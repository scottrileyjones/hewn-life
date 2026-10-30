/**
 * Carry a client's Website Brief (the form they filled in before checkout)
 * into their onboarding, so the portal never asks for it twice. Answers fill
 * the matching steps; a step whose required answers are all there counts as
 * sent, and the brief's logo is copied into their portal files.
 */
import type { Progress } from './onboarding'
import { stepsFor } from './onboarding'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const BRIEFS = process.env.AIRTABLE_BRIEFS_TABLE_ID

/** Brief column → [step, field]. Column names are the labels in lib/intake.ts. */
const MAP: [string, string, string][] = [
  ['Business name', 'business', 'business_name'],
  ['Main products or services', 'business', 'offers'],
  ['Ideal customer', 'business', 'ideal_customer'],
  ['What makes you different', 'business', 'usp'],
  ['Where you serve', 'business', 'service_area'],
  ['What visitors should do', 'business', 'primary_action'],
  ['Tagline', 'business', 'tagline'],
  ['Three words for your brand', 'business', 'brand_words'],
  ['Top competitors', 'business', 'competitors'],
  ['90-day goal', 'business', 'goal_90_days'],
  ['Reference site 1', 'look', 'reference_1'],
  ['Reference site 2', 'look', 'reference_2'],
  ['Reference site 3', 'look', 'reference_3'],
  ['What you like about them', 'look', 'reference_notes'],
  ['Brand colors', 'look', 'brand_colors'],
  ['Current website', 'domain', 'current_website'],
  ['Phone', 'copy', 'public_phone'],
]

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const text = (v: unknown) => (typeof v === 'string' ? v : v && typeof v === 'object' && 'name' in v ? String((v as { name: unknown }).name) : '').trim()
/** Briefs accept bare domains ("example.com"); the portal's URL fields want https://. */
const asUrl = (v: string) => (!v || /^https?:\/\//i.test(v) ? v : `https://${v}`)

export async function latestBrief(email: string): Promise<Row | null> {
  if (!BASE || !TOKEN || !BRIEFS) return null
  const q = new URLSearchParams({ filterByFormula: `LOWER({Email})='${email.toLowerCase().replace(/'/g, "\\'")}'`, pageSize: '10' })
  const res = await fetch(`https://api.airtable.com/v0/${BASE}/${BRIEFS}?${q}`, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' })
  if (!res.ok) throw new Error(`Airtable briefs ${res.status}: ${await res.text()}`)
  const { records } = await res.json() as { records: Row[] }
  return records.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1))[0] ?? null
}

/** Merge a brief into progress without touching anything the client or team already did. */
export function briefProgress(pkg: string, progress: Progress, brief: Row, logoFiles: string[]): Progress {
  const steps = stepsFor(pkg)
  const out: Progress = { ...progress }
  const now = new Date().toISOString()
  for (const step of steps) {
    if (out[step.id]?.submitted || out[step.id]?.done) continue
    const data: Record<string, string> = { ...(out[step.id]?.data ?? {}) }
    for (const [col, stepId, field] of MAP) {
      if (stepId !== step.id) continue
      const v = text(brief.fields[col])
      const def = step.fields?.find(f => f.id === field)
      if (!v || !def) continue
      if (def.type === 'select' && !def.options?.includes(v)) continue
      data[field] = def.type === 'url' ? asUrl(v) : v
    }
    const files = step.id === 'assets' ? logoFiles : []
    if (!Object.keys(data).length && !files.length) continue
    const complete = (step.fields ?? []).every(f => !f.required || data[f.id])
    // Sent if the brief covers every required answer; for files, the logo is enough to start.
    const sent = step.uploads ? files.length > 0 : complete && (step.fields ?? []).some(f => f.required)
    out[step.id] = { ...out[step.id], data, ...(files.length ? { files } : {}), ...(sent ? { submitted: now } : {}) }
  }
  return out
}

/** The brief's logo, as attachments for the portal Assets field (Airtable copies them from the URL). */
export function briefLogos(brief: Row): { url: string; filename: string }[] {
  const logos = Array.isArray(brief.fields['Logo']) ? brief.fields['Logo'] as { url?: string; filename?: string }[] : []
  return logos.filter(l => l.url).map(l => ({ url: l.url!, filename: `assets--${(l.filename || 'logo').replace(/[^\w.\- ]+/g, '_')}` }))
}
