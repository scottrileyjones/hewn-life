/**
 * Hewn Life's own marketing-text list: SMS Subscribers (one row per mobile, with the
 * consent log) and SMS Campaigns (what we sent). Sends only to rows with Marketing
 * ticked, never twice to one number within 24 hours, and only inside the send window.
 */
import { loadClients } from '@/lib/portal/data'
import { sendSms } from './sms'
import { MARKETING_CONSENT, MARKETING_WELCOME, marketingText, sendWindow, toE164 } from './smsText'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const SUBSCRIBERS = process.env.AIRTABLE_SMS_SUBSCRIBERS_TABLE_ID || 'tblrk9nXR2wtwgcqy'
const CAMPAIGNS = process.env.AIRTABLE_SMS_CAMPAIGNS_TABLE_ID || 'tblC86duCMmuuSdRK'

export const SOURCES = ['ROI calculator', 'Contact form', 'Website brief', 'Client portal'] as const
export type Source = typeof SOURCES[number]
export const AUDIENCES = ['Everyone', 'Leads', 'Clients'] as const
export type Audience = typeof AUDIENCES[number]

export type Subscriber = { id: string; mobile: string; name: string; email: string; company: string; source: string; marketing: boolean; lastText: string }
export type Campaign = { id: string; message: string; audience: string; sentAt: string; sentBy: string; sent: number; skipped: number }

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const api = (table: string) => `https://api.airtable.com/v0/${BASE}/${table}`

async function list(table: string, formula?: string): Promise<Row[]> {
  if (!BASE || !TOKEN) throw new Error('Airtable not configured')
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const q = new URLSearchParams({ pageSize: '100' })
    if (formula) q.set('filterByFormula', formula)
    if (offset) q.set('offset', offset)
    const res = await fetch(`${api(table)}?${q}`, { headers: headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records)
    offset = out.offset
  } while (offset)
  return rows
}

async function write(table: string, id: string | null, fields: Record<string, unknown>): Promise<Row> {
  if (!BASE || !TOKEN) throw new Error('Airtable not configured')
  const res = id
    ? await fetch(`${api(table)}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields, typecast: true }) })
    : await fetch(api(table), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return 'records' in out ? out.records[0] : out
}

const toSubscriber = (r: Row): Subscriber => ({
  id: r.id, mobile: str(r.fields['Mobile']), name: str(r.fields['Name']), email: str(r.fields['Email']).toLowerCase(),
  company: str(r.fields['Company']), source: str(r.fields['Source']), marketing: r.fields['Marketing'] === true, lastText: str(r.fields['Last marketing text']),
})
const toCampaign = (r: Row): Campaign => ({
  id: r.id, message: str(r.fields['Message']), audience: str(r.fields['Audience']), sentAt: str(r.fields['Sent at']) || r.createdTime,
  sentBy: str(r.fields['Sent by']), sent: Number(r.fields['Sent'] ?? 0), skipped: Number(r.fields['Skipped'] ?? 0),
})

async function byMobile(mobile: string) {
  return (await list(SUBSCRIBERS, `{Mobile}=${quote(mobile)}`))[0] ?? null
}
const logLine = (what: string) => `${new Date().toISOString()} · ${what}`

/**
 * Someone ticked the marketing-text box on a form or in the portal. Adds or re-subscribes
 * their number, logs the consent, and sends the one confirmation text. Never throws.
 */
export async function subscribe(p: { mobile: string; name?: string; email?: string; company?: string; source: Source; ip?: string }) {
  const mobile = toE164(p.mobile)
  if (!mobile) return false
  try {
    const row = await byMobile(mobile)
    const was = row?.fields['Marketing'] === true
    const log = row ? str(row.fields['Consent log']) : ''
    const line = logLine(`opted in · ${p.source}${p.ip ? ` from ${p.ip}` : ''}: "${MARKETING_CONSENT}"`)
    await write(SUBSCRIBERS, row?.id ?? null, {
      Mobile: mobile, Marketing: true, Source: p.source, 'Consent log': (log ? `${log}\n` : '') + line,
      ...(p.name ? { Name: p.name.slice(0, 200) } : {}), ...(p.email ? { Email: p.email.trim().toLowerCase() } : {}), ...(p.company ? { Company: p.company.slice(0, 200) } : {}),
    })
    if (!was) await sendSms(mobile, MARKETING_WELCOME).catch(err => console.error('Marketing welcome failed:', err))
    return true
  } catch (err) {
    console.error('SMS subscribe failed:', err)
    return false
  }
}

/** STOP (or START) by text: update the row if there is one. START only re-subscribes someone who opted in before. */
export async function setMarketing(mobile: string, on: boolean, how: string) {
  const row = await byMobile(mobile)
  if (!row) return
  if (on && !str(row.fields['Consent log']).includes('opted in')) return
  await write(SUBSCRIBERS, row.id, { Marketing: on, 'Consent log': `${str(row.fields['Consent log'])}\n${logLine(`${on ? 'opted in' : 'opted out'} · ${how}`)}`.trim() })
}

export async function loadSubscribers() { return (await list(SUBSCRIBERS)).map(toSubscriber) }
export async function loadCampaigns() {
  return (await list(CAMPAIGNS)).map(toCampaign).sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1))
}

/** Which subscribers a campaign would reach. Clients are anyone whose email or mobile matches a current portal client. */
export async function audienceFor(audience: Audience, subs?: Subscriber[]) {
  const [all, clients] = await Promise.all([subs ? Promise.resolve(subs) : loadSubscribers(), loadClients().catch(() => [])])
  const current = clients.filter(c => c.status !== 'Past')
  const emails = new Set(current.map(c => c.email)), mobiles = new Set(current.map(c => c.mobile).filter(Boolean))
  const isClient = (s: Subscriber) => emails.has(s.email) || mobiles.has(s.mobile)
  return all.filter(s => s.marketing && (audience === 'Everyone' || (audience === 'Clients') === isClient(s)))
}

const DAY = 24 * 3600e3

/** Send a campaign now. Refuses outside the send window. Skips anyone texted in the last 24 hours. */
export async function sendCampaign(body: string, audience: Audience, by: string) {
  if (!sendWindow().open) throw new Error(`Marketing texts can only go out ${sendWindow().label}.`)
  const text = marketingText(body)
  const people = await audienceFor(audience)
  let sent = 0, skipped = 0
  for (const s of people) {
    if (s.lastText && Date.now() - new Date(s.lastText).getTime() < DAY) { skipped++; continue }
    try {
      if (await sendSms(s.mobile, text)) {
        sent++
        await write(SUBSCRIBERS, s.id, { 'Last marketing text': new Date().toISOString() })
      } else skipped++
    } catch (err) {
      console.error('Campaign text failed:', s.mobile, err)
      skipped++
    }
  }
  await write(CAMPAIGNS, null, { Message: text, Audience: audience, 'Sent at': new Date().toISOString(), 'Sent by': by, Sent: sent, Skipped: skipped })
  return { sent, skipped }
}
