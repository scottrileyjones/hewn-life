/**
 * Test records and anomalies.
 *
 * Tests: our own addresses, "+test" addresses and anything marked Test in the
 * CRM (the Pipeline table's Test checkbox). They stay in the CRM, but are left
 * out of HQ numbers, the funnel and automated flows.
 *
 * Anomalies: things a person should look at instead of the system guessing,
 * like a surname typed into the business-name box. They're flagged, never
 * fixed automatically.
 */

import { looksLikeName } from './names'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const PIPELINE = process.env.AIRTABLE_PIPELINE_TABLE_ID || 'tblIKXW7fczoBIlTz'

const INTERNAL_DOMAINS = ['hewn.life']

/** Why an email counts as a test by rule, or '' if it doesn't. */
export function testRule(rawEmail: string): string {
  const email = rawEmail.trim().toLowerCase()
  const [local = '', domain = ''] = email.split('@')
  if (INTERNAL_DOMAINS.includes(domain)) return 'Hewn Life address'
  if (/\+test/.test(local) || /^test\d*$/.test(local) || domain === 'example.com') return 'Test address'
  return ''
}

/** Emails marked Test by hand in the CRM. */
export async function markedTests(): Promise<Set<string>> {
  const out = new Set<string>()
  if (!BASE || !TOKEN) return out
  let offset: string | undefined
  do {
    const q = new URLSearchParams({ filterByFormula: '{Test}', pageSize: '100', 'fields[]': 'Email' })
    if (offset) q.set('offset', offset)
    const res = await fetch(`https://api.airtable.com/v0/${BASE}/${PIPELINE}?${q}`, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable pipeline ${res.status}: ${await res.text()}`)
    const page = await res.json() as { records: { fields: { Email?: string } }[]; offset?: string }
    for (const r of page.records) if (r.fields.Email) out.add(r.fields.Email.trim().toLowerCase())
    offset = page.offset
  } while (offset)
  return out
}

/** True for a test email, by rule or by hand. Never throws: a lookup failure counts as not a test. */
export async function isTestEmail(email: string): Promise<boolean> {
  if (testRule(email)) return true
  try { return (await markedTests()).has(email.trim().toLowerCase()) } catch { return false }
}

/** Things worth a human look on one contact. */
export function anomalies(c: { name: string; company: string; companies: string[]; firstSeen: string }): string[] {
  const flags: string[] = []
  if (looksLikeName(c.name, c.company)) {
    flags.push(`“${c.company}” may be a last name, not a business name`)
  }
  const distinct = Array.from(new Map(c.companies.map(x => [x.trim().toLowerCase(), x.trim()])).values()).filter(Boolean)
  if (distinct.length >= 3) flags.push(`${distinct.length} different business names: ${distinct.join(', ')}`)
  else if (distinct.length === 2) flags.push(`Two business names: ${distinct.join(' and ')}`)
  return flags
}
