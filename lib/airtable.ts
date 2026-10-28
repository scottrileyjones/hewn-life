/**
 * Website briefs in Airtable.
 *
 * Briefs go to their own table (AIRTABLE_BRIEFS_TABLE_ID) in the same base
 * as quiz leads. Column names match `label` in lib/intake.ts, plus Source,
 * Submitted, Cal booking and Logo (attachment).
 */
import { intakeFields } from './intake'

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = process.env.AIRTABLE_BRIEFS_TABLE_ID
const TOKEN = process.env.AIRTABLE_TOKEN

export function briefsConfigured() {
  return Boolean(BASE && TABLE && TOKEN)
}

/** Map answers keyed by field id to Airtable column names. */
export function toFields(answers: Record<string, string>, extra: Record<string, unknown>) {
  const fields: Record<string, unknown> = { ...extra, Submitted: new Date().toISOString() }
  for (const f of intakeFields) {
    if (f.type === 'file') continue
    const v = answers[f.id]
    if (typeof v === 'string' && v.trim()) fields[f.label] = v.trim().slice(0, 5000)
  }
  return fields
}

export async function createBrief(fields: Record<string, unknown>): Promise<string> {
  const res = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  })
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.records[0].id as string
}

/** Attach a file to a record's Logo field (Airtable upload endpoint, 5 MB max). */
export async function attachLogo(recordId: string, file: { name: string; type: string; bytes: ArrayBuffer }) {
  const res = await fetch(`https://content.airtable.com/v0/${BASE}/${recordId}/${encodeURIComponent('Logo')}/uploadAttachment`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, filename: file.name, file: Buffer.from(file.bytes).toString('base64') }),
  })
  if (!res.ok) throw new Error(`Airtable upload ${res.status}: ${await res.text()}`)
}
