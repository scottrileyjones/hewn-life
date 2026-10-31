/**
 * The content calendar: one post, many platforms, stored in the Content
 * Calendar table in Airtable. Media comes from the client's asset library
 * (by asset id) so files live in one place.
 *
 * Status: Idea → Draft → Client review → Approved (or Changes requested) →
 * Scheduled → Published. Clients see everything from Client review on.
 */
import { FORMATS, PLATFORMS, type Format, type Platform } from './platforms'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const TABLE = process.env.AIRTABLE_CALENDAR_TABLE_ID || 'tblFzzpnRL9hKeqJR'

export const POST_STATUSES = ['Idea', 'Draft', 'Client review', 'Changes requested', 'Approved', 'Scheduled', 'Published', 'Archived'] as const
export type PostStatus = typeof POST_STATUSES[number]

export type Post = {
  id: string
  clientEmail: string
  title: string
  caption: string
  platforms: Platform[]
  format: Format
  status: PostStatus
  scheduledAt: string
  assetIds: string[]
  overrides: Partial<Record<Platform, string>>
  notes: string
  feedback: string
  publishedLinks: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

/** Clients don't see our ideas, drafts or archived posts. */
export const clientSees = (p: Post) => !['Idea', 'Draft', 'Archived'].includes(p.status)

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const json = <T,>(v: unknown, fallback: T): T => { try { return typeof v === 'string' && v ? JSON.parse(v) as T : fallback } catch { return fallback } }

const toPost = (r: Row): Post => ({
  id: r.id,
  clientEmail: str(r.fields['Client email']).toLowerCase(),
  title: str(r.fields['Title']),
  caption: str(r.fields['Caption']),
  platforms: (Array.isArray(r.fields['Platforms']) ? r.fields['Platforms'] as string[] : []).filter((p): p is Platform => (PLATFORMS as readonly string[]).includes(p)),
  format: ((FORMATS as readonly string[]).includes(str(r.fields['Format'])) ? str(r.fields['Format']) : 'Post') as Format,
  status: ((POST_STATUSES as readonly string[]).includes(str(r.fields['Status'])) ? str(r.fields['Status']) : 'Draft') as PostStatus,
  scheduledAt: str(r.fields['Scheduled at']),
  assetIds: json<string[]>(r.fields['Asset IDs'], []).filter(x => typeof x === 'string'),
  overrides: json<Partial<Record<Platform, string>>>(r.fields['Overrides'], {}),
  notes: str(r.fields['Notes']),
  feedback: str(r.fields['Feedback']),
  publishedLinks: str(r.fields['Published links']),
  createdBy: str(r.fields['Created by']),
  createdAt: str(r.fields['Created at']) || r.createdTime,
  updatedAt: str(r.fields['Updated at']) || r.createdTime,
})

function need() { if (!BASE || !TOKEN) throw new Error('Airtable not configured') }
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const api = () => `https://api.airtable.com/v0/${BASE}/${TABLE}`

/** Posts for one client, or every client when email is empty. Optionally limited to a date window (plus all unscheduled). */
export async function loadPosts(email = '', range?: { from: string; to: string }): Promise<Post[]> {
  need()
  const parts: string[] = []
  if (email) parts.push(`LOWER({Client email})=${quote(email.toLowerCase())}`)
  if (range) parts.push(`OR({Scheduled at}=BLANK(),AND(IS_AFTER({Scheduled at},${quote(range.from)}),IS_BEFORE({Scheduled at},${quote(range.to)})))`)
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const q = new URLSearchParams({ pageSize: '100' })
    if (parts.length) q.set('filterByFormula', parts.length > 1 ? `AND(${parts.join(',')})` : parts[0])
    if (offset) q.set('offset', offset)
    const res = await fetch(`${api()}?${q}`, { headers: headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable calendar ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records)
    offset = out.offset
  } while (offset)
  return rows.map(toPost).sort((a, b) => (a.scheduledAt || '9') < (b.scheduledAt || '9') ? -1 : 1)
}

export async function getPost(id: string): Promise<Post | null> {
  need()
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) return null
  const res = await fetch(`${api()}/${id}`, { headers: headers(), cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Airtable post ${res.status}: ${await res.text()}`)
  return toPost(await res.json() as Row)
}

export type PostInput = Partial<Pick<Post, 'title' | 'caption' | 'platforms' | 'format' | 'status' | 'scheduledAt' | 'assetIds' | 'overrides' | 'notes' | 'publishedLinks'>>

/** Check and clean a post edit from any caller (HQ, MCP). Throws a readable error. */
export function cleanInput(raw: Record<string, unknown>): PostInput {
  const p: PostInput = {}
  if (raw.title !== undefined) p.title = String(raw.title).slice(0, 200)
  if (raw.caption !== undefined) p.caption = String(raw.caption).slice(0, 63206)
  if (raw.platforms !== undefined) {
    if (!Array.isArray(raw.platforms)) throw new Error('platforms must be a list')
    const bad = raw.platforms.filter(x => !(PLATFORMS as readonly string[]).includes(String(x)))
    if (bad.length) throw new Error(`Unknown platform: ${bad.join(', ')}. Use: ${PLATFORMS.join(', ')}`)
    p.platforms = raw.platforms as Platform[]
  }
  if (raw.format !== undefined) {
    if (!(FORMATS as readonly string[]).includes(String(raw.format))) throw new Error(`Unknown format. Use: ${FORMATS.join(', ')}`)
    p.format = raw.format as Format
  }
  if (raw.status !== undefined) {
    if (!(POST_STATUSES as readonly string[]).includes(String(raw.status))) throw new Error(`Unknown status. Use: ${POST_STATUSES.join(', ')}`)
    p.status = raw.status as PostStatus
  }
  if (raw.scheduledAt !== undefined) {
    const v = String(raw.scheduledAt || '')
    if (v && Number.isNaN(Date.parse(v))) throw new Error('scheduledAt must be an ISO date-time, e.g. 2026-11-04T09:00:00-07:00')
    p.scheduledAt = v ? new Date(v).toISOString() : ''
  }
  if (raw.assetIds !== undefined) {
    if (!Array.isArray(raw.assetIds) || raw.assetIds.some(x => typeof x !== 'string')) throw new Error('assetIds must be a list of asset ids')
    p.assetIds = (raw.assetIds as string[]).slice(0, 20)
  }
  if (raw.overrides !== undefined) {
    const o = raw.overrides as Record<string, unknown>
    if (!o || typeof o !== 'object') throw new Error('overrides must be an object of platform → caption')
    p.overrides = Object.fromEntries(Object.entries(o).filter(([k, v]) => (PLATFORMS as readonly string[]).includes(k) && typeof v === 'string' && v.trim()).map(([k, v]) => [k, String(v)]))
  }
  if (raw.notes !== undefined) p.notes = String(raw.notes).slice(0, 5000)
  if (raw.publishedLinks !== undefined) p.publishedLinks = String(raw.publishedLinks).slice(0, 5000)
  return p
}

export async function savePost(id: string | null, p: PostInput & { clientEmail?: string; createdBy?: string }): Promise<Post> {
  need()
  const now = new Date().toISOString()
  const f: Record<string, unknown> = { 'Updated at': now }
  if (p.title !== undefined) f['Title'] = p.title
  if (p.caption !== undefined) f['Caption'] = p.caption
  if (p.platforms !== undefined) f['Platforms'] = p.platforms
  if (p.format !== undefined) f['Format'] = p.format
  if (p.status !== undefined) f['Status'] = p.status
  if (p.scheduledAt !== undefined) f['Scheduled at'] = p.scheduledAt || null
  if (p.assetIds !== undefined) f['Asset IDs'] = JSON.stringify(p.assetIds)
  if (p.overrides !== undefined) f['Overrides'] = JSON.stringify(p.overrides)
  if (p.notes !== undefined) f['Notes'] = p.notes
  if (p.publishedLinks !== undefined) f['Published links'] = p.publishedLinks
  if (!id) Object.assign(f, { 'Client email': p.clientEmail, 'Created by': p.createdBy, 'Created at': now, Status: p.status ?? 'Draft', Format: p.format ?? 'Post' })
  const res = id
    ? await fetch(`${api()}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields: f, typecast: true }) })
    : await fetch(api(), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields: f }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable post ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return toPost('records' in out ? out.records[0] : out)
}

/** Set status and add a line to the post's history in one write. */
export async function movePost(p: Post, status: PostStatus, who: string, comment = ''): Promise<Post> {
  need()
  const stamp = new Date().toLocaleString('en-US', { timeZone: 'America/Denver', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  const line = `${stamp} · ${who}: ${status}${comment.trim() ? ` — ${comment.trim().slice(0, 4000)}` : ''}`
  const res = await fetch(`${api()}/${p.id}`, {
    method: 'PATCH', headers: headers(),
    body: JSON.stringify({ fields: { Status: status, Feedback: [p.feedback, line].filter(Boolean).join('\n'), 'Updated at': new Date().toISOString() }, typecast: true }),
  })
  if (!res.ok) throw new Error(`Airtable post ${res.status}: ${await res.text()}`)
  return toPost(await res.json() as Row)
}

export async function deletePost(id: string) {
  need()
  const res = await fetch(`${api()}/${id}`, { method: 'DELETE', headers: headers() })
  if (!res.ok) throw new Error(`Airtable post ${res.status}: ${await res.text()}`)
}
