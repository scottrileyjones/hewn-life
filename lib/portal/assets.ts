/**
 * The asset library: every file, link or piece of text in a client's portal,
 * whether they uploaded it or we made it. Hewn assets move Draft → In review →
 * Approved (or Changes requested) → Live; client uploads arrive as Received.
 * Stored in the Portal Assets table in Airtable.
 */
const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const TABLE = process.env.AIRTABLE_PORTAL_ASSETS_TABLE_ID || 'tblI6qCew5yyIYhOR'

export const CATEGORIES = [
  { id: 'Brand guide', hint: 'Your brand guide: colors, type, voice and logo rules.' },
  { id: 'Logos & brand', hint: 'Logo files and brand marks.' },
  { id: 'Photos', hint: 'Photos of your work, team, products or place.' },
  { id: 'UGC & video', hint: 'Customer videos, creator content and reels. Big files: share a link.' },
  { id: 'Ads', hint: 'Ad creative and ad copy.' },
  { id: 'Copy', hint: 'Website copy, headlines and messaging.' },
  { id: 'Landing pages', hint: 'Landing page links and drafts.' },
  { id: 'Keywords & SEO', hint: 'Target keywords, search terms and SEO notes.' },
  { id: 'Social', hint: 'Social posts, captions and content plans.' },
  { id: 'Email', hint: 'Email campaigns and automations.' },
  { id: 'Reports', hint: 'Reports and dashboards.' },
  { id: 'Other', hint: 'Anything else.' },
] as const
export type Category = typeof CATEGORIES[number]['id']
export const CATEGORY_IDS = CATEGORIES.map(c => c.id) as readonly string[]

export const ASSET_STATUSES = ['Draft', 'Received', 'In review', 'Changes requested', 'Approved', 'Live', 'Archived'] as const
export type AssetStatus = typeof ASSET_STATUSES[number]

export type AssetFile = { id: string; name: string; url: string; type: string; size: number; thumb: string }

export type Asset = {
  id: string
  clientEmail: string
  title: string
  category: Category
  source: 'Client' | 'Hewn'
  status: AssetStatus
  files: AssetFile[]
  link: string
  text: string
  notes: string
  feedback: string
  liveLink: string
  addedBy: string
  addedAt: string
  updatedAt: string
}

/** What a client may see: everything except our drafts and archived items. */
export const clientVisible = (a: Asset) => a.status !== 'Draft' && a.status !== 'Archived'

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const toAsset = (r: Row): Asset => ({
  id: r.id,
  clientEmail: str(r.fields['Client email']).toLowerCase(),
  title: str(r.fields['Title']),
  category: (CATEGORY_IDS.includes(str(r.fields['Category'])) ? str(r.fields['Category']) : 'Other') as Category,
  source: str(r.fields['Source']) === 'Hewn' ? 'Hewn' : 'Client',
  status: ((ASSET_STATUSES as readonly string[]).includes(str(r.fields['Status'])) ? str(r.fields['Status']) : 'Received') as AssetStatus,
  files: Array.isArray(r.fields['Files'])
    ? (r.fields['Files'] as { id?: string; filename?: string; url?: string; type?: string; size?: number; thumbnails?: { large?: { url?: string } } }[])
      .map(f => ({ id: f.id ?? '', name: f.filename ?? '', url: f.url ?? '', type: f.type ?? '', size: f.size ?? 0, thumb: f.thumbnails?.large?.url ?? '' }))
    : [],
  link: str(r.fields['Link']),
  text: str(r.fields['Text']),
  notes: str(r.fields['Notes']),
  feedback: str(r.fields['Feedback']),
  liveLink: str(r.fields['Live link']),
  addedBy: str(r.fields['Added by']),
  addedAt: str(r.fields['Added at']) || r.createdTime,
  updatedAt: str(r.fields['Updated at']) || str(r.fields['Added at']) || r.createdTime,
})

function need() { if (!BASE || !TOKEN) throw new Error('Airtable not configured') }
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const api = () => `https://api.airtable.com/v0/${BASE}/${TABLE}`

export async function loadAssets(email: string): Promise<Asset[]> {
  need()
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const q = new URLSearchParams({ pageSize: '100', filterByFormula: `LOWER({Client email})=${quote(email.toLowerCase())}` })
    if (offset) q.set('offset', offset)
    const res = await fetch(`${api()}?${q}`, { headers: headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable assets ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records)
    offset = out.offset
  } while (offset)
  return rows.map(toAsset).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export async function getAsset(id: string): Promise<Asset | null> {
  need()
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) return null
  const res = await fetch(`${api()}/${id}`, { headers: headers(), cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Airtable asset ${res.status}: ${await res.text()}`)
  return toAsset(await res.json() as Row)
}

export type AssetInput = Partial<Pick<Asset, 'title' | 'category' | 'status' | 'link' | 'text' | 'notes' | 'liveLink'>>

export async function saveAsset(id: string | null, p: AssetInput & { clientEmail?: string; source?: 'Client' | 'Hewn'; addedBy?: string }): Promise<Asset> {
  need()
  const now = new Date().toISOString()
  const f: Record<string, unknown> = { 'Updated at': now }
  if (p.title !== undefined) f['Title'] = p.title.slice(0, 200)
  if (p.category !== undefined) f['Category'] = p.category
  if (p.status !== undefined) f['Status'] = p.status
  if (p.link !== undefined) f['Link'] = p.link || null
  if (p.text !== undefined) f['Text'] = p.text.slice(0, 50000)
  if (p.notes !== undefined) f['Notes'] = p.notes.slice(0, 5000)
  if (p.liveLink !== undefined) f['Live link'] = p.liveLink || null
  if (!id) Object.assign(f, { 'Client email': p.clientEmail, Source: p.source, 'Added by': p.addedBy, 'Added at': now })
  const res = id
    ? await fetch(`${api()}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields: f, typecast: true }) })
    : await fetch(api(), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields: f }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable asset ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return toAsset('records' in out ? out.records[0] : out)
}

/** Add a line to the review history and set the status in one write. */
export async function reviewAsset(a: Asset, status: AssetStatus, who: string, comment: string): Promise<Asset> {
  const stamp = new Date().toLocaleString('en-US', { timeZone: 'America/Denver', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  const line = `${stamp} · ${who}: ${status}${comment.trim() ? ` — ${comment.trim().slice(0, 4000)}` : ''}`
  need()
  const res = await fetch(`${api()}/${a.id}`, {
    method: 'PATCH', headers: headers(),
    body: JSON.stringify({ fields: { Status: status, Feedback: [a.feedback, line].filter(Boolean).join('\n'), 'Updated at': new Date().toISOString() }, typecast: true }),
  })
  if (!res.ok) throw new Error(`Airtable asset ${res.status}: ${await res.text()}`)
  return toAsset(await res.json() as Row)
}

export const UPLOAD_MAX_BYTES = 4 * 1024 * 1024

/** Attach a file to an asset (Airtable's upload endpoint, kept under Vercel's 4.5 MB request limit). */
export async function attachFile(assetId: string, file: { name: string; type: string; bytes: ArrayBuffer }) {
  need()
  const res = await fetch(`https://content.airtable.com/v0/${BASE}/${assetId}/${encodeURIComponent('Files')}/uploadAttachment`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ contentType: file.type || 'application/octet-stream', filename: file.name.replace(/[^\w.\- ]+/g, '_').slice(0, 120), file: Buffer.from(file.bytes).toString('base64') }),
  })
  if (!res.ok) throw new Error(`Airtable upload ${res.status}: ${await res.text()}`)
}

export async function deleteAsset(id: string) {
  need()
  const res = await fetch(`${api()}/${id}`, { method: 'DELETE', headers: headers() })
  if (!res.ok) throw new Error(`Airtable asset ${res.status}: ${await res.text()}`)
}
