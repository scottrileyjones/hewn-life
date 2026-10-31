/**
 * The Hewn Life MCP server: lets Claude read clients, their briefs and asset
 * libraries, and draft posts straight into the content calendar. Streamable
 * HTTP transport, JSON responses only (no server-initiated messages).
 * Spec: https://modelcontextprotocol.io/specification
 */
import { timingSafeEqual } from 'crypto'
import { findClient, loadClients } from '@/lib/portal/data'
import { buildBrief } from '@/lib/portal/brief'
import { packageName, track } from '@/lib/portal/onboarding'
import { libraryFor } from '@/lib/portal/library'
import { mediaFor } from '@/lib/portal/media'
import { cleanInput, getPost, loadPosts, movePost, savePost } from '@/lib/portal/posts'
import { PLATFORMS, RULES, FORMATS, checkPost } from '@/lib/portal/platforms'
import { typeOf, pillarOf, TYPE_IDS } from '@/lib/portal/taxonomy'
import { notifyClientPosts } from '@/lib/portal/notify'

const AUTHOR = 'claude (MCP)'

/** Constant-time check of the shared secret in HEWN_MCP_TOKEN. */
export function authorized(key: string | null | undefined) {
  const secret = process.env.HEWN_MCP_TOKEN || ''
  if (secret.length < 24 || !key) return false
  const a = Buffer.from(secret), b = Buffer.from(key)
  return a.length === b.length && timingSafeEqual(a, b)
}

type Tool = { name: string; description: string; inputSchema: Record<string, unknown>; run: (args: Record<string, unknown>) => Promise<unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
async function client(args: Record<string, unknown>) {
  const c = await findClient(str(args.email))
  if (!c) throw new Error(`No client with email ${str(args.email)}. Call list_clients for valid emails.`)
  return c
}

const postSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short internal name, e.g. "Water heater myths carousel"' },
    caption: { type: 'string', description: 'The caption used on every platform unless overridden' },
    platforms: { type: 'array', items: { type: 'string', enum: [...PLATFORMS] } },
    format: { type: 'string', enum: [...FORMATS] },
    scheduledAt: { type: 'string', description: 'ISO 8601 with offset, e.g. 2026-11-04T09:00:00-07:00 (client time is Mountain unless told otherwise). Omit to leave unscheduled.' },
    assetIds: { type: 'array', items: { type: 'string' }, description: 'Asset ids from list_assets to use as media, in order' },
    overrides: { type: 'object', description: 'Per-platform caption, e.g. {"X": "shorter version"}', additionalProperties: { type: 'string' } },
    notes: { type: 'string', description: 'Internal notes for the Hewn team' },
  },
}

const TOOLS: Tool[] = [
  {
    name: 'list_clients',
    description: 'All Hewn Life clients with a portal: company, contact, email, package and onboarding progress.',
    inputSchema: { type: 'object', properties: {} },
    run: async () => (await loadClients()).map(c => {
      const t = c.package ? track(c.package, c.progress) : null
      return { email: c.email, company: c.company, name: c.name, status: c.status, package: packageName(c.package) || c.plan, onboarding: t ? `${t.done}/${t.total} steps done` : 'no plan applied' }
    }),
  },
  {
    name: 'get_client',
    description: 'One client in depth: everything they submitted in onboarding (business, audience, offers, brand words, references, copy) as a Markdown brief. Read this before writing posts for them.',
    inputSchema: { type: 'object', properties: { email: { type: 'string' } }, required: ['email'] },
    run: async args => { const c = await client(args); return { email: c.email, company: c.company, package: packageName(c.package) || c.plan, projectStatus: c.projectStatus, brief: buildBrief(c) } },
  },
  {
    name: 'list_assets',
    description: `A client's asset library (brand guide, logos, photos, video, ads, copy, keywords…), organized as "Pillar · Type". Use asset ids as post media. Optionally filter by type, one of: ${TYPE_IDS.join('; ')}.`,
    inputSchema: { type: 'object', properties: { email: { type: 'string' }, type: { type: 'string' } }, required: ['email'] },
    run: async args => {
      const c = await client(args)
      const all = (await libraryFor(c)).filter(a => a.status !== 'Archived' && (!args.type || a.category === args.type))
      return all.map(a => ({
        id: a.id, title: a.title, pillar: pillarOf(a.category).name, type: typeOf(a.category).name, status: a.status, from: a.source,
        media: a.files.map(f => ({ name: f.name, type: f.type, url: f.url })), link: a.link || undefined, text: a.text ? a.text.slice(0, 2000) : undefined, notes: a.notes || undefined,
      }))
    },
  },
  {
    name: 'list_posts',
    description: 'Posts on the content calendar, for one client or all. Optional ISO date window.',
    inputSchema: { type: 'object', properties: { email: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } } },
    run: async args => (await loadPosts(str(args.email), args.from && args.to ? { from: str(args.from), to: str(args.to) } : undefined)).map(p => ({
      id: p.id, client: p.clientEmail, title: p.title, status: p.status, scheduledAt: p.scheduledAt || null, platforms: p.platforms, format: p.format, caption: p.caption, overrides: p.overrides, assetIds: p.assetIds, feedback: p.feedback || undefined,
    })),
  },
  {
    name: 'platform_rules',
    description: 'Caption limits, media requirements and best shapes for each platform.',
    inputSchema: { type: 'object', properties: {} },
    run: async () => Object.fromEntries(PLATFORMS.map(p => [p, { maxChars: RULES[p].maxChars, needsMedia: !!RULES[p].needsMedia, needsVideo: !!RULES[p].needsVideo, bestShape: RULES[p].shape }])),
  },
  {
    name: 'create_posts',
    description: 'Draft one or more posts on a client\'s calendar. They are saved as Draft (or Idea), visible only to the Hewn team until someone sends them for review. Returns ids and any platform problems (caption too long, missing video).',
    inputSchema: { type: 'object', properties: { email: { type: 'string' }, status: { type: 'string', enum: ['Draft', 'Idea'] }, posts: { type: 'array', items: postSchema, maxItems: 40 } }, required: ['email', 'posts'] },
    run: async args => {
      const c = await client(args)
      const posts = Array.isArray(args.posts) ? args.posts as Record<string, unknown>[] : []
      if (!posts.length) throw new Error('posts is empty')
      const media = await mediaFor(c)
      const out = []
      for (const raw of posts.slice(0, 40)) {
        const input = cleanInput({ ...raw, status: args.status === 'Idea' ? 'Idea' : 'Draft' })
        if (!input.platforms?.length) input.platforms = ['Instagram', 'Facebook']
        const p = await savePost(null, { ...input, title: input.title?.trim() || (input.caption || 'Post').slice(0, 60), clientEmail: c.email, createdBy: AUTHOR })
        const files = media.filter(m => p.assetIds.includes(m.id)).flatMap(m => m.files)
        out.push({ id: p.id, title: p.title, scheduledAt: p.scheduledAt || null, issues: checkPost(p, files).map(i => `${i.platform}: ${i.text}`) })
      }
      return { created: out.length, posts: out, next: 'Drafts are in HQ → Calendar. A teammate reviews them, then sends to the client.' }
    },
  },
  {
    name: 'update_post',
    description: 'Edit a draft post: caption, platforms, schedule, media, overrides, notes. Cannot change posts the client already approved or that were published.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' }, ...((postSchema.properties) as object) }, required: ['id'] },
    run: async args => {
      const p = await getPost(str(args.id))
      if (!p) throw new Error('No post with that id')
      if (['Approved', 'Scheduled', 'Published'].includes(p.status)) throw new Error(`This post is ${p.status}; ask the team before changing it.`)
      const { id: _id, ...rest } = args
      void _id
      const saved = await savePost(p.id, cleanInput(rest))
      return { id: saved.id, status: saved.status, scheduledAt: saved.scheduledAt || null }
    },
  },
  {
    name: 'send_posts_for_review',
    description: 'Send draft posts to the client for approval. This EMAILS THE CLIENT. Only do it when the person you are working with has asked you to.',
    inputSchema: { type: 'object', properties: { email: { type: 'string' }, ids: { type: 'array', items: { type: 'string' } } }, required: ['email', 'ids'] },
    run: async args => {
      const c = await client(args)
      const moved = []
      for (const id of (Array.isArray(args.ids) ? args.ids as string[] : []).slice(0, 60)) {
        const p = await getPost(id)
        if (p && p.clientEmail === c.email && ['Idea', 'Draft', 'Changes requested'].includes(p.status)) moved.push(await movePost(p, 'Client review', AUTHOR))
      }
      if (moved.length) await notifyClientPosts(c, moved)
      return { sent: moved.length, emailed: moved.length > 0 ? c.email : null }
    },
  },
]

type Rpc = { jsonrpc: '2.0'; id?: string | number | null; method: string; params?: Record<string, unknown> }
const ok = (id: Rpc['id'], result: unknown) => ({ jsonrpc: '2.0', id, result })
const fail = (id: Rpc['id'], code: number, message: string) => ({ jsonrpc: '2.0', id, error: { code, message } })

/** Handle one JSON-RPC message. Returns null for notifications. */
export async function handle(m: Rpc) {
  if (!m || m.jsonrpc !== '2.0' || typeof m.method !== 'string') return fail(m?.id ?? null, -32600, 'Invalid request')
  const isNote = m.id === undefined
  switch (m.method) {
    case 'initialize':
      return ok(m.id, {
        protocolVersion: str(m.params?.protocolVersion) || '2025-06-18',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'hewn-life', version: '1.0.0' },
        instructions: 'Hewn Life agency tools. Typical flow: list_clients → get_client (read the brief) → list_assets → platform_rules → create_posts as drafts. Never send posts for review unless asked; that emails the client. Write in the client\'s voice from their brief and never invent reviews, stats or credentials.',
      })
    case 'ping': return ok(m.id, {})
    case 'tools/list': return ok(m.id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) })
    case 'tools/call': {
      const tool = TOOLS.find(t => t.name === m.params?.name)
      if (!tool) return fail(m.id, -32602, `Unknown tool: ${str(m.params?.name)}`)
      try {
        const result = await tool.run((m.params?.arguments as Record<string, unknown>) ?? {})
        return ok(m.id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] })
      } catch (err) {
        return ok(m.id, { content: [{ type: 'text', text: err instanceof Error ? err.message : 'Tool failed' }], isError: true })
      }
    }
    default:
      return isNote ? null : fail(m.id, -32601, `Method not found: ${m.method}`)
  }
}
