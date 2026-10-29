/**
 * The CRM's view of a contact: everything we know about one email address,
 * merged from Quiz Leads (quiz and contact form), Website Briefs, Growth Plans
 * and the Pipeline table, with a stage worked out from what has happened.
 */
import { getPlan, type PlanId } from '@/lib/playbook'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const LEADS = process.env.AIRTABLE_TABLE_ID
const BRIEFS = process.env.AIRTABLE_BRIEFS_TABLE_ID
const PLANS = process.env.AIRTABLE_PLANS_TABLE_ID
const PIPELINE = process.env.AIRTABLE_PIPELINE_TABLE_ID || 'tblIKXW7fczoBIlTz'

export const STAGES = ['New', 'Plan sent', 'Opened', 'Booked', 'Proposal', 'Won', 'Lost'] as const
export type Stage = typeof STAGES[number]

export type CrmEvent = { at: string; label: string }

export type Contact = {
  email: string
  name: string
  company: string
  phone: string
  state: string
  sources: string[]
  firstSeen: string
  lastActivity: string
  tier: string
  score: number | null
  revenue: string
  consent: boolean
  answers: Record<string, string>
  notes: string
  plan: null | { token: string; status: string; by: string; recommended: string; summary: string }
  stage: Stage
  autoStage: Stage
  manual: null | { id: string; stage: Stage; at: string; by: string }
  value: number | null
  crmNotes: string
  pipelineId: string | null
  events: CrmEvent[]
}

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }

async function listAll(table: string | undefined): Promise<Row[]> {
  if (!BASE || !TOKEN || !table) return []
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${table}?pageSize=100${offset ? `&offset=${offset}` : ''}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records)
    offset = out.offset
  } while (offset)
  return rows
}

const str = (v: unknown) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '')
const pick = (v: unknown) => (v && typeof v === 'object' && 'name' in v ? str((v as { name: unknown }).name) : str(v))
const json = <T,>(v: unknown): T | null => { try { return typeof v === 'string' ? JSON.parse(v) as T : null } catch { return null } }
const later = (a: string, b: string) => (!a ? b : !b ? a : a > b ? a : b)
const earlier = (a: string, b: string) => (!a ? b : !b ? a : a < b ? a : b)

const QUIZ_FIELDS: Record<string, string> = {
  'Business Stage': 'Business stage', 'Primary Goal': 'Goal (90 days)', 'Marketing Presence': 'Marketing presence',
  'Monthly Budget': 'Monthly budget', 'Biggest Challenge': 'Biggest challenge', Timeline: 'Urgency', 'Team Capacity': 'Team',
  'Recommended Services': 'Recommended services',
}

export async function loadContacts(): Promise<Contact[]> {
  const [leads, briefs, plans, pipeline] = await Promise.all([listAll(LEADS), listAll(BRIEFS), listAll(PLANS), listAll(PIPELINE)])
  const map = new Map<string, Contact>()

  const get = (rawEmail: unknown) => {
    const email = str(rawEmail).trim().toLowerCase()
    if (!email) return null
    let c = map.get(email)
    if (!c) {
      c = {
        email, name: '', company: '', phone: '', state: '', sources: [], firstSeen: '', lastActivity: '', tier: '', score: null,
        revenue: '', consent: false, answers: {}, notes: '', plan: null, stage: 'New', autoStage: 'New', manual: null,
        value: null, crmNotes: '', pipelineId: null, events: [],
      }
      map.set(email, c)
    }
    return c
  }
  const fill = (c: Contact, k: 'name' | 'company' | 'phone' | 'state' | 'revenue' | 'tier', v: string) => { if (v && !c[k]) c[k] = v }
  const touch = (c: Contact, at: string, label: string) => {
    if (!at) return
    c.events.push({ at, label })
    c.firstSeen = earlier(c.firstSeen, at)
    c.lastActivity = later(c.lastActivity, at)
  }
  const source = (c: Contact, s: string) => { if (s && !c.sources.includes(s)) c.sources.push(s) }

  for (const r of leads) {
    const f = r.fields, c = get(f['Email'])
    if (!c) continue
    const at = str(f['Submission Timestamp']) || r.createdTime
    const src = pick(f['Lead Source']) || 'Quiz'
    fill(c, 'name', str(f['Name'])); fill(c, 'company', str(f['Company'])); fill(c, 'phone', str(f['Phone'])); fill(c, 'state', str(f['State']))
    fill(c, 'tier', str(f['Recommended Tier']))
    if (typeof f['Quiz Score'] === 'number') c.score = f['Quiz Score'] as number
    if (typeof f['Annual Revenue'] === 'number') fill(c, 'revenue', `$${(f['Annual Revenue'] as number).toLocaleString()}`)
    if (f['Marketing Consent'] === true) c.consent = true
    for (const [k, label] of Object.entries(QUIZ_FIELDS)) if (str(f[k])) c.answers[label] = str(f[k])
    if (str(f['Notes'])) c.notes = [c.notes, str(f['Notes'])].filter(Boolean).join('\n\n')
    source(c, src)
    touch(c, at, src === 'Contact form' ? 'Sent the contact form' : 'Took the ROI calculator')
  }

  for (const r of briefs) {
    const f = r.fields, c = get(f['Email'])
    if (!c) continue
    const at = str(f['Submitted']) || r.createdTime
    const src = str(f['Source']) || 'Website brief'
    fill(c, 'name', str(f['Name'])); fill(c, 'company', str(f['Business name'])); fill(c, 'phone', str(f['Phone']))
    fill(c, 'revenue', pick(f['Annual revenue']))
    for (const k of ['90-day goal', 'Interested in', 'What visitors should do', 'Main products or services', 'Ideal customer', 'Where you serve', 'Current website']) {
      const v = pick(f[k]); if (v) c.answers[k] = v
    }
    source(c, src)
    touch(c, at, str(f['Cal booking']) ? `Booked a call: ${str(f['Cal booking'])}` : `Sent a ${src.toLowerCase()}`)
  }

  for (const r of plans) {
    const f = r.fields, c = get(f['Email'])
    if (!c) continue
    const lead = json<{ name?: string; company?: string; source?: string; consent?: boolean; answers?: Record<string, string> }>(f['Lead'])
    const deck = json<{ summary?: string; plan?: PlanId }>(f['Plan'])
    fill(c, 'name', lead?.name || str(f['Name'])); fill(c, 'company', lead?.company || str(f['Company']))
    if (lead?.consent || f['Consent'] === true) c.consent = true
    for (const [k, v] of Object.entries(lead?.answers ?? {})) if (v && !c.answers[k]) c.answers[k] = v
    source(c, lead?.source || str(f['Source']))
    const recommended = deck?.plan ? getPlan(deck.plan)?.name ?? '' : ''
    fill(c, 'tier', recommended)
    c.plan = { token: str(f['Token']), status: pick(f['Status']), by: str(f['Generated by']), recommended, summary: deck?.summary ?? '' }
    touch(c, str(f['Sent at']), 'Growth plan emailed')
    touch(c, str(f['Opened at']), 'Opened their growth plan')
    touch(c, str(f['Follow-up sent']), 'Follow-up emailed')
    touch(c, str(f['Booked at']), 'Booked a call')
    touch(c, str(f['Paid at']), 'Paid')
    if (pick(f['Status']) === 'Unsubscribed') touch(c, str(f['Follow-up sent']) || str(f['Sent at']), 'Unsubscribed')
  }

  for (const r of pipeline) {
    const f = r.fields, c = get(f['Email'])
    if (!c) continue
    c.pipelineId = r.id
    if (typeof f['Deal value'] === 'number') c.value = f['Deal value'] as number
    c.crmNotes = str(f['Notes'])
    const stage = pick(f['Stage']) as Stage
    const at = str(f['Stage set at'])
    if (STAGES.includes(stage) && at) {
      c.manual = { id: r.id, stage, at, by: str(f['Stage set by']) }
      touch(c, at, `Moved to ${stage}${c.manual.by ? ` by ${c.manual.by.split('@')[0]}` : ''}`)
    }
  }

  const contacts = Array.from(map.values())
  for (const c of contacts) {
    const has = (label: string) => c.events.filter(e => e.label === label || e.label.startsWith(label)).map(e => e.at).sort().pop() || ''
    const auto: [Stage, string][] = [['Won', has('Paid')], ['Booked', has('Booked a call')], ['Opened', has('Opened')], ['Plan sent', has('Growth plan emailed')]]
    const hit = auto.find(([, at]) => at)
    c.autoStage = hit ? hit[0] : 'New'
    const autoAt = auto.map(([, at]) => at).filter(Boolean).sort().pop() || ''
    // A stage set by hand holds until something newer happens to the contact.
    c.stage = c.manual && c.manual.at >= autoAt ? c.manual.stage : c.autoStage
    c.events.sort((a, b) => (a.at < b.at ? 1 : -1))
    if (!c.name) c.name = c.email
  }

  return contacts.sort((a, b) => (a.lastActivity < b.lastActivity ? 1 : -1))
}

/** Save a hand-set stage, notes or deal value for a contact. */
export async function savePipeline(email: string, fields: { Stage?: Stage; 'Stage set by'?: string; Notes?: string; 'Deal value'?: number | null }, existingId?: string | null) {
  if (!BASE || !TOKEN) throw new Error('Airtable not configured')
  const body: Record<string, unknown> = { ...fields }
  if (fields.Stage) body['Stage set at'] = new Date().toISOString()
  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
  const api = `https://api.airtable.com/v0/${BASE}/${PIPELINE}`
  let id = existingId
  if (!id) {
    const q = `${api}?maxRecords=1&filterByFormula=${encodeURIComponent(`LOWER({Email})='${email.replace(/'/g, "\\'")}'`)}`
    const found = await fetch(q, { headers, cache: 'no-store' }).then(r => r.json()).catch(() => null) as { records?: Row[] } | null
    id = found?.records?.[0]?.id
  }
  const res = id
    ? await fetch(`${api}/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ fields: body, typecast: true }) })
    : await fetch(api, { method: 'POST', headers, body: JSON.stringify({ records: [{ fields: { Email: email, ...body } }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return 'records' in out ? out.records[0].id : out.id
}
