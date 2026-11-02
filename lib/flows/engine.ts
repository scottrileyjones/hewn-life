/**
 * Lifecycle flows: people join a flow when something happens (checkout started,
 * lead form, purchase, cancellation), and the runner sends each step when it's
 * due. People leave a flow when they convert or unsubscribe. Emails always carry
 * an unsubscribe link; texts only go to SMS marketing subscribers, inside the
 * send window.
 */
import { createHmac } from 'crypto'
import { SITE, button, layout, send } from '@/lib/plans/email'
import { CAL_URL } from '@/lib/cal'
import { sendSms } from '@/lib/sms'
import { marketingText, sendWindow, toE164 } from '@/lib/smsText'
import { loadSubscribers } from '@/lib/smsMarketing'
import { DEFAULT_FLOWS, FLOW_KEYS, defaultFlow, fill, type Flow, type FlowKey, type Step } from './defaults'
import { isTestEmail } from '@/lib/crm/test'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const FLOWS = process.env.AIRTABLE_FLOWS_TABLE_ID || 'tblLxbvkRt2PJH7sS'
const RUNS = process.env.AIRTABLE_FLOW_RUNS_TABLE_ID || 'tblgzZnvzL5cqqLrl'
const UNSUBS = process.env.AIRTABLE_EMAIL_UNSUBS_TABLE_ID || 'tblzkdq5Ra9FL0UPJ'

export type RunStatus = 'Active' | 'Completed' | 'Exited' | 'Unsubscribed'
export type Run = { id: string; flow: FlowKey; email: string; name: string; company: string; phone: string; context: Record<string, string>; step: number; nextAt: string; status: RunStatus; log: string; createdAt: string }
export type Person = { email: string; name?: string; company?: string; phone?: string }

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const api = (t: string) => `https://api.airtable.com/v0/${BASE}/${t}`
const configured = () => Boolean(BASE && TOKEN)

async function list(table: string, formula?: string): Promise<Row[]> {
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const q = new URLSearchParams({ pageSize: '100' })
    if (formula) q.set('filterByFormula', formula)
    if (offset) q.set('offset', offset)
    const res = await fetch(`${api(table)}?${q}`, { headers: headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records); offset = out.offset
  } while (offset)
  return rows
}
async function write(table: string, id: string | null, fields: Record<string, unknown>): Promise<Row> {
  const res = id
    ? await fetch(`${api(table)}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields, typecast: true }) })
    : await fetch(api(table), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return 'records' in out ? out.records[0] : out
}

/* ── Flows ─────────────────────────────────────────── */

/** All flows: saved versions from the Flows table, defaults for any not saved yet. */
export async function loadFlows(): Promise<Flow[]> {
  const rows = configured() ? await list(FLOWS).catch(() => []) : []
  return DEFAULT_FLOWS.map(d => {
    const r = rows.find(x => str(x.fields['Key']) === d.key)
    if (!r) return d
    let steps: Step[] = d.steps
    try { const s = JSON.parse(str(r.fields['Steps'])); if (Array.isArray(s)) steps = s } catch { /* keep defaults */ }
    return { ...d, id: r.id, name: str(r.fields['Name']) || d.name, status: str(r.fields['Status']) === 'Active' ? 'Active' : 'Paused', steps }
  })
}
export async function getFlow(key: FlowKey) { return (await loadFlows()).find(f => f.key === key) ?? defaultFlow(key) }

export async function saveFlow(f: Pick<Flow, 'key' | 'name' | 'status' | 'steps'>, by: string): Promise<Flow> {
  const existing = (await loadFlows()).find(x => x.key === f.key)
  const steps = f.steps.slice(0, 12).map((s, i) => ({
    id: s.id || `s${i}${Date.now().toString(36)}`, waitHours: Math.max(0, Math.min(24 * 120, Number(s.waitHours) || 0)),
    channel: s.channel === 'sms' ? 'sms' as const : 'email' as const, subject: String(s.subject || '').slice(0, 200), body: String(s.body || '').slice(0, 6000),
  }))
  const row = await write(FLOWS, existing?.id ?? null, { Key: f.key, Name: f.name.slice(0, 120), Status: f.status, Steps: JSON.stringify(steps), 'Updated by': by })
  return { ...defaultFlow(f.key), id: row.id, name: f.name, status: f.status, steps }
}

/* ── Runs ──────────────────────────────────────────── */

const toRun = (r: Row): Run => {
  let context: Record<string, string> = {}
  try { context = JSON.parse(str(r.fields['Context']) || '{}') } catch { /* empty */ }
  return {
    id: r.id, flow: str(r.fields['Flow']) as FlowKey, email: str(r.fields['Email']).toLowerCase(), name: str(r.fields['Name']), company: str(r.fields['Company']),
    phone: str(r.fields['Phone']), context, step: Number(r.fields['Step'] ?? 0), nextAt: str(r.fields['Next at']),
    status: (['Active', 'Completed', 'Exited', 'Unsubscribed'].includes(str(r.fields['Status'])) ? str(r.fields['Status']) : 'Active') as RunStatus,
    log: str(r.fields['Log']), createdAt: r.createdTime,
  }
}
const stamp = (what: string) => `${new Date().toISOString()} · ${what}`
const addLog = (r: Run, what: string) => (r.log ? `${r.log}\n` : '') + stamp(what)
const later = (hours: number) => new Date(Date.now() + hours * 3600e3).toISOString()

export async function loadRuns(flow?: FlowKey): Promise<Run[]> {
  return (await list(RUNS, flow ? `{Flow}=${quote(flow)}` : undefined)).map(toRun).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function isUnsubscribed(email: string) {
  return (await list(UNSUBS, `LOWER({Email})=${quote(email.toLowerCase())}`)).length > 0
}

/**
 * Put someone in a flow. Skips quietly when the flow is paused, they're already
 * in it, or they've unsubscribed. Never throws: callers are checkouts and webhooks.
 */
export async function enroll(key: FlowKey, p: Person, context: Record<string, string> = {}) {
  try {
    const email = p.email.trim().toLowerCase()
    if (!configured() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null
    const flow = await getFlow(key)
    if (flow.status !== 'Active' || !flow.steps.length) return null
    if (await isUnsubscribed(email)) return null
    // Test records never get automated emails or texts.
    if (await isTestEmail(email)) return null
    const open = await list(RUNS, `AND({Flow}=${quote(key)}, LOWER({Email})=${quote(email)}, {Status}='Active')`)
    if (open.length) return null
    return toRun(await write(RUNS, null, {
      Title: `${email} · ${flow.name}`, Flow: key, Email: email, Name: p.name ?? '', Company: p.company ?? '', Phone: p.phone ?? '',
      Context: JSON.stringify(context), Step: 0, 'Next at': later(flow.steps[0].waitHours), Status: 'Active', Log: stamp('joined'),
    }))
  } catch (err) { console.error(`Flow enroll ${key} failed:`, err); return null }
}

/** Take someone out of the given flows (they converted). Never throws. */
export async function exitFlows(email: string, keys: readonly FlowKey[], why: string) {
  try {
    const e = email.trim().toLowerCase()
    if (!configured() || !e) return
    const rows = await list(RUNS, `AND(LOWER({Email})=${quote(e)}, {Status}='Active')`)
    await Promise.all(rows.map(toRun).filter(r => keys.includes(r.flow)).map(r => write(RUNS, r.id, { Status: 'Exited', Log: addLog(r, `left: ${why}`) })))
  } catch (err) { console.error('Flow exit failed:', err) }
}

export async function setRunStatus(id: string, status: RunStatus, why: string) {
  const r = toRun(await (await fetch(`${api(RUNS)}/${id}`, { headers: headers(), cache: 'no-store' })).json() as Row)
  return toRun(await write(RUNS, id, { Status: status, Log: addLog(r, why) }))
}

/* ── Unsubscribe ───────────────────────────────────── */

const secret = () => process.env.PLAN_LINK_SECRET || process.env.CRON_SECRET || 'hewn-flows'
export const unsubSig = (email: string) => createHmac('sha256', secret()).update(`unsub:${email.toLowerCase()}`).digest('hex').slice(0, 24)
export const unsubUrl = (email: string) => `${SITE}/api/flows/unsubscribe?${new URLSearchParams({ e: email.toLowerCase(), s: unsubSig(email) })}`

export async function unsubscribe(email: string, source: string) {
  const e = email.trim().toLowerCase()
  if (!(await isUnsubscribed(e))) await write(UNSUBS, null, { Email: e, At: new Date().toISOString(), Source: source })
  const rows = await list(RUNS, `AND(LOWER({Email})=${quote(e)}, {Status}='Active')`)
  await Promise.all(rows.map(toRun).map(r => write(RUNS, r.id, { Status: 'Unsubscribed', Log: addLog(r, `unsubscribed (${source})`) })))
}

/* ── Sending ───────────────────────────────────────── */

export function mergeVars(r: Pick<Run, 'name' | 'company' | 'context' | 'email'>): Record<string, string> {
  return {
    first_name: r.name.trim().split(/\s+/)[0] || '', company: r.company, plan: r.context.plan || '',
    checkout_link: r.context.checkout_link ? `${SITE}${r.context.checkout_link}` : `${SITE}/pricing`,
    portal_link: `${SITE}/portal`, book_link: CAL_URL, pricing_link: `${SITE}/pricing`,
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** Plain text to email HTML: paragraphs, line breaks, bare links made clickable, a lone link line becomes a button. */
export function emailHtml(body: string, email: string) {
  const blocks = body.split(/\n{2,}/).map(b => {
    const t = b.trim()
    if (/^https?:\/\/\S+$/.test(t)) return `<p style="margin:20px 0">${button(t, t.includes('/checkout') ? 'Finish checkout' : t.includes('/portal') ? 'Open your portal' : t.includes('/pricing') ? 'See the plans' : 'Open')}</p>`
    return `<p style="margin:0 0 14px">${esc(t).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#1E3826">$1</a>').replace(/\n/g, '<br>')}</p>`
  }).join('')
  return layout(blocks, `You’re receiving this because you were in touch with Hewn Life. <a href="${unsubUrl(email)}" style="color:#6E736D">Unsubscribe</a>`)
}

/** Send whatever is due. Returns what happened, for the cron log and HQ. */
export async function runDue(limit = 60) {
  if (!configured()) return { sent: 0, skipped: 0, waiting: 0 }
  const flows = await loadFlows()
  const due = (await list(RUNS, `AND({Status}='Active', IS_BEFORE({Next at}, DATEADD(NOW(), 1, 'minutes')))`)).map(toRun).slice(0, limit)
  const subs = due.some(r => flows.find(f => f.key === r.flow)?.steps[r.step]?.channel === 'sms') ? await loadSubscribers().catch(() => []) : []
  let sent = 0, skipped = 0, waiting = 0
  for (const r of due) {
    const flow = flows.find(f => f.key === r.flow)
    if (!flow || flow.status !== 'Active') { waiting++; continue }
    const step = flow.steps[r.step]
    if (!step) { await write(RUNS, r.id, { Status: 'Completed', Log: addLog(r, 'finished') }); continue }
    const vars = mergeVars(r)
    let note = ''
    try {
      if (step.channel === 'email') {
        if (await isUnsubscribed(r.email)) { await write(RUNS, r.id, { Status: 'Unsubscribed', Log: addLog(r, 'skipped: unsubscribed') }); skipped++; continue }
        await send(r.email, fill(step.subject, vars), emailHtml(fill(step.body, vars), r.email), { 'List-Unsubscribe': `<${unsubUrl(r.email)}>` })
        note = `sent email "${fill(step.subject, vars)}"`; sent++
      } else {
        const mobile = toE164(r.phone)
        const subscribed = mobile && subs.some(s => s.mobile === mobile && s.marketing)
        if (!subscribed) { note = 'skipped text: not an SMS subscriber'; skipped++ }
        else if (!sendWindow().open) { waiting++; continue } // try again on the next run, inside the window
        else { await sendSms(mobile, marketingText(fill(step.body, vars))); note = 'sent text'; sent++ }
      }
    } catch (err) {
      console.error('Flow step failed:', err); note = `failed: ${err instanceof Error ? err.message.slice(0, 120) : 'error'}`; skipped++
    }
    const next = flow.steps[r.step + 1]
    await write(RUNS, r.id, next
      ? { Step: r.step + 1, 'Next at': later(next.waitHours), Log: addLog(r, `step ${r.step + 1}: ${note}`) }
      : { Step: r.step + 1, Status: 'Completed', Log: addLog(r, `step ${r.step + 1}: ${note}; finished`) })
  }
  return { sent, skipped, waiting }
}

export { FLOW_KEYS }
