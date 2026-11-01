/**
 * Design Builds: one row per client, queued for the Claude routine that builds
 * their Figma file. Status moves Waiting on requirements → Ready (all their
 * requirement steps are in) → Building → Built.
 */
import { waitUntil } from '@vercel/functions'
import type { PortalClient } from '@/lib/portal/data'
import { packageName, track } from '@/lib/portal/onboarding'
import { buildBrief } from '@/lib/portal/brief'
import { captureSite, homepage, screenshotsConfigured } from './capture'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const TABLE = process.env.AIRTABLE_DESIGN_BUILDS_TABLE_ID || 'tblXmQ8QqY48Nso0r'
const api = () => `https://api.airtable.com/v0/${BASE}/${TABLE}`
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

type Row = { id: string; fields: Record<string, unknown> }

/** Fields in requirement steps that hold the client's current website. */
const WEBSITE_FIELDS = ['current_website', 'vis_website', 'cp_site', 'bl_site', 'lp_domain', 'website_platform']

export function clientWebsite(c: PortalClient): string | null {
  for (const st of Object.values(c.progress)) for (const k of WEBSITE_FIELDS) {
    const v = st.data?.[k]
    const home = v ? homepage(v) : null
    if (home) return home
  }
  return null
}

/** Every requirement step (client steps before the build) is sent or signed off. */
export function requirementsIn(c: PortalClient) {
  const t = track(c.package, c.progress)
  const reqs = t.rows.filter(r => r.step.owner === 'client' && r.step.phase === 'kickoff' && !r.step.action)
  return reqs.length > 0 && reqs.every(r => r.status === 'done' || r.status === 'submitted')
}

async function find(email: string): Promise<Row | null> {
  const q = new URLSearchParams({ filterByFormula: `LOWER({Client email})=${quote(email.toLowerCase())}`, pageSize: '1' })
  const res = await fetch(`${api()}?${q}`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) throw new Error(`Airtable design builds ${res.status}: ${await res.text()}`)
  return ((await res.json()) as { records: Row[] }).records[0] ?? null
}

async function write(id: string | null, fields: Record<string, unknown>) {
  const res = id
    ? await fetch(`${api()}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields, typecast: true }) })
    : await fetch(api(), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable design builds ${res.status}: ${await res.text()}`)
}

/**
 * Keep a client's design build up to date after they send a step: capture their
 * site the first time we learn its address (or when it changes), refresh the
 * brief, and mark it Ready once all their requirements are in. Never throws.
 */
export async function syncDesignBuild(c: PortalClient) {
  if (!BASE || !TOKEN || !c.package) return
  try {
    const row = await find(c.email)
    const status = String(row?.fields['Status'] ?? '')
    if (status === 'Building' || status === 'Built') return
    const site = clientWebsite(c)
    const fields: Record<string, unknown> = {
      Company: c.company || c.name || c.email, 'Client email': c.email, Package: packageName(c.package) || c.plan,
      Brief: buildBrief(c).slice(0, 90000),
      Status: requirementsIn(c) ? 'Ready' : 'Waiting on requirements',
    }
    const known = homepage(String(row?.fields['Website'] ?? ''))
    if (site && site !== known) {
      if (screenshotsConfigured()) {
        const cap = await captureSite(site)
        if (cap) Object.assign(fields, { Website: cap.website, Pages: JSON.stringify(cap.pages, null, 1), Nav: JSON.stringify(cap.nav, null, 1), 'Captured at': new Date().toISOString() })
        // Warm the screenshot cache so the build doesn't wait on first renders.
        if (cap) waitUntil(Promise.allSettled(cap.pages.flatMap(p => [fetch(p.desktop), fetch(p.mobile)])).then(() => undefined))
      } else {
        Object.assign(fields, { Website: site, Notes: 'Screenshots not set up yet (SCREENSHOTONE keys missing in Vercel).' })
      }
    }
    await write(row?.id ?? null, fields)
  } catch (err) {
    console.error('Design build sync failed:', err)
  }
}
