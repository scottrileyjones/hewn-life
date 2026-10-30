/**
 * Client portal records in Airtable: one Portal Clients row per client login,
 * and a Portal Messages row for each message or update between them and us.
 */
import { parseProgress, type Progress } from './onboarding'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const CLIENTS = process.env.AIRTABLE_PORTAL_CLIENTS_TABLE_ID || 'tblrLwKCOAdGvvpL4'
const MESSAGES = process.env.AIRTABLE_PORTAL_MESSAGES_TABLE_ID || 'tblYg7cE9Ajw1tVC2'

export const CLIENT_STATUSES = ['Onboarding', 'Active', 'Paused', 'Past'] as const
export type ClientStatus = typeof CLIENT_STATUSES[number]

export type PortalLink = { label: string; url: string }
export type PortalAsset = { id: string; name: string; url: string; type: string; size: number }

export type PortalClient = {
  id: string
  email: string
  name: string
  company: string
  plan: string
  status: ClientStatus
  projectStatus: string
  nextSteps: string
  links: PortalLink[]
  lastClientMessage: string
  lastTeamMessage: string
  lastLogin: string
  /** Onboarding plan key, e.g. 'website-in-a-day'. Empty until we apply one. */
  package: string
  progress: Progress
  assets: PortalAsset[]
}

export type PortalMessage = {
  id: string
  clientEmail: string
  from: 'Client' | 'Hewn'
  kind: 'Message' | 'Update'
  author: string
  body: string
  at: string
}

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

/** "Label | https://…" per line; bare URLs use their host as the label. Only http(s) links are kept. */
export function parseLinks(raw: string): PortalLink[] {
  return raw.split('\n').map(l => l.trim()).filter(Boolean).flatMap(line => {
    const [a, b] = line.includes('|') ? line.split('|').map(s => s.trim()) : ['', line]
    try {
      const u = new URL(b)
      return u.protocol === 'https:' || u.protocol === 'http:' ? [{ label: a || u.host, url: u.toString() }] : []
    } catch { return [] }
  })
}
export const formatLinks = (links: PortalLink[]) => links.map(l => `${l.label} | ${l.url}`).join('\n')

const toClient = (r: Row): PortalClient => ({
  id: r.id,
  email: str(r.fields['Email']).toLowerCase(),
  name: str(r.fields['Name']),
  company: str(r.fields['Company']),
  plan: str(r.fields['Plan']),
  status: (CLIENT_STATUSES as readonly string[]).includes(str(r.fields['Status'])) ? str(r.fields['Status']) as ClientStatus : 'Onboarding',
  projectStatus: str(r.fields['Project status']),
  nextSteps: str(r.fields['Next steps']),
  links: parseLinks(str(r.fields['Links'])),
  lastClientMessage: str(r.fields['Last client message']),
  lastTeamMessage: str(r.fields['Last team message']),
  lastLogin: str(r.fields['Last login']),
  package: str(r.fields['Package']),
  progress: parseProgress(str(r.fields['Progress'])),
  assets: Array.isArray(r.fields['Assets'])
    ? (r.fields['Assets'] as { id?: string; filename?: string; url?: string; type?: string; size?: number }[]).map(a => ({ id: a.id ?? '', name: a.filename ?? '', url: a.url ?? '', type: a.type ?? '', size: a.size ?? 0 }))
    : [],
})

const toMessage = (r: Row): PortalMessage => ({
  id: r.id,
  clientEmail: str(r.fields['Client email']).toLowerCase(),
  from: str(r.fields['From']) === 'Client' ? 'Client' : 'Hewn',
  kind: str(r.fields['Kind']) === 'Update' ? 'Update' : 'Message',
  author: str(r.fields['Author']),
  body: str(r.fields['Body']),
  at: str(r.fields['Sent at']) || r.createdTime,
})

function need() { if (!BASE || !TOKEN) throw new Error('Airtable not configured') }
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const api = (table: string) => `https://api.airtable.com/v0/${BASE}/${table}`

async function list(table: string, formula?: string): Promise<Row[]> {
  need()
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
  need()
  const res = id
    ? await fetch(`${api(table)}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields, typecast: true }) })
    : await fetch(api(table), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return 'records' in out ? out.records[0] : out
}

export async function loadClients(): Promise<PortalClient[]> {
  return (await list(CLIENTS)).map(toClient).filter(c => c.email).sort((a, b) => a.company.localeCompare(b.company))
}

export async function findClient(email: string): Promise<PortalClient | null> {
  const e = email.trim().toLowerCase()
  if (!e) return null
  const rows = await list(CLIENTS, `LOWER({Email})=${quote(e)}`)
  return rows[0] ? toClient(rows[0]) : null
}

export type ClientPatch = Partial<Pick<PortalClient, 'email' | 'name' | 'company' | 'plan' | 'status' | 'projectStatus' | 'nextSteps' | 'package' | 'progress'>> & { links?: string }

export async function saveClient(id: string | null, p: ClientPatch): Promise<PortalClient> {
  const f: Record<string, unknown> = {}
  if (p.email !== undefined) f['Email'] = p.email.trim().toLowerCase()
  if (p.name !== undefined) f['Name'] = p.name.slice(0, 200)
  if (p.company !== undefined) f['Company'] = p.company.slice(0, 200)
  if (p.plan !== undefined) f['Plan'] = p.plan.slice(0, 200)
  if (p.status !== undefined) f['Status'] = p.status
  if (p.projectStatus !== undefined) f['Project status'] = p.projectStatus.slice(0, 5000)
  if (p.nextSteps !== undefined) f['Next steps'] = p.nextSteps.slice(0, 5000)
  if (p.links !== undefined) f['Links'] = formatLinks(parseLinks(p.links))
  if (p.package !== undefined) f['Package'] = p.package || null
  if (p.progress !== undefined) f['Progress'] = JSON.stringify(p.progress)
  return toClient(await write(CLIENTS, id, f))
}

export async function touchClient(id: string, field: 'Last client message' | 'Last team message' | 'Last login') {
  await write(CLIENTS, id, { [field]: new Date().toISOString() })
}

/** A client's thread, oldest first. */
export async function loadMessages(email: string): Promise<PortalMessage[]> {
  const rows = await list(MESSAGES, `LOWER({Client email})=${quote(email.toLowerCase())}`)
  return rows.map(toMessage).sort((a, b) => (a.at < b.at ? -1 : 1))
}

export async function addMessage(m: Omit<PortalMessage, 'id' | 'at'>): Promise<PortalMessage> {
  return toMessage(await write(MESSAGES, null, {
    'Client email': m.clientEmail, From: m.from, Kind: m.kind, Author: m.author, Body: m.body.slice(0, 10000), 'Sent at': new Date().toISOString(),
  }))
}

export const ASSET_MAX_BYTES = 4 * 1024 * 1024
export const ASSET_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif', 'application/pdf']

/** Add a file to the client's Assets field (Airtable's upload endpoint). The name starts with the step id. */
export async function attachAsset(clientId: string, stepId: string, file: { name: string; type: string; bytes: ArrayBuffer }) {
  need()
  const name = `${stepId}--${file.name.replace(/[^\w.\- ]+/g, '_').slice(0, 120)}`
  const res = await fetch(`https://content.airtable.com/v0/${BASE}/${clientId}/${encodeURIComponent('Assets')}/uploadAttachment`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ contentType: file.type, filename: name, file: Buffer.from(file.bytes).toString('base64') }),
  })
  if (!res.ok) throw new Error(`Airtable upload ${res.status}: ${await res.text()}`)
  return name
}

/** Add files to the client's Assets by URL (Airtable copies them), keeping the ones already there. */
export async function addAssetUrls(client: PortalClient, files: { url: string; filename: string }[]): Promise<PortalClient> {
  if (!files.length) return client
  const keep = client.assets.filter(a => a.id).map(a => ({ id: a.id }))
  return toClient(await write(CLIENTS, client.id, { Assets: [...keep, ...files] }))
}
