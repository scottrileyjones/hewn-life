import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { findClient } from '@/lib/portal/data'
import { cleanInput, deletePost, getPost, loadPosts, movePost, savePost, POST_STATUSES, type PostStatus } from '@/lib/portal/posts'
import { mediaFor } from '@/lib/portal/media'
import { notifyClientPosts } from '@/lib/portal/notify'

type Body =
  | { action: 'list'; email?: string }
  | { action: 'media'; email: string }
  | { action: 'save'; id?: string | null; email?: string; post: Record<string, unknown> }
  | { action: 'status'; id: string; status: PostStatus; comment?: string; publishedLinks?: string }
  | { action: 'review'; email: string; ids: string[] }
  | { action: 'delete'; id: string }

/** Team calendar actions: list posts, load a client's media, save posts, move them through review, delete. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as Body
  try {
    if (b.action === 'list') return NextResponse.json({ ok: true, posts: await loadPosts(b.email || '') })
    if (b.action === 'media') {
      const c = await findClient(b.email)
      return c ? NextResponse.json({ ok: true, media: await mediaFor(c) }) : NextResponse.json({ error: 'No such client.' }, { status: 404 })
    }
    if (b.action === 'save') {
      const input = cleanInput(b.post ?? {})
      if (!b.id) {
        const c = b.email ? await findClient(b.email) : null
        if (!c) return NextResponse.json({ error: 'Pick a client.' }, { status: 400 })
        if (!input.title?.trim() && !input.caption?.trim()) return NextResponse.json({ error: 'Give the post a title or caption.' }, { status: 400 })
        return NextResponse.json({ ok: true, post: await savePost(null, { ...input, title: input.title?.trim() || input.caption!.slice(0, 60), clientEmail: c.email, createdBy: user }) })
      }
      if (!(await getPost(b.id))) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
      return NextResponse.json({ ok: true, post: await savePost(b.id, input) })
    }
    if (b.action === 'status') {
      if (!POST_STATUSES.includes(b.status)) return NextResponse.json({ error: 'Unknown status.' }, { status: 400 })
      const p = await getPost(b.id)
      if (!p) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
      if (b.publishedLinks !== undefined) await savePost(p.id, { publishedLinks: b.publishedLinks })
      const saved = await movePost({ ...p, publishedLinks: b.publishedLinks ?? p.publishedLinks }, b.status, user.split('@')[0], b.comment)
      let alerted = false
      if (b.status === 'Client review') {
        const c = await findClient(p.clientEmail)
        if (c) alerted = await notifyClientPosts(c, [saved]).then(() => true, err => { console.error('Post alert failed:', err); return false })
      }
      return NextResponse.json({ ok: true, post: saved, alerted })
    }
    if (b.action === 'review') {
      const c = await findClient(b.email)
      if (!c) return NextResponse.json({ error: 'No such client.' }, { status: 404 })
      const moved = []
      for (const id of (b.ids || []).slice(0, 60)) {
        const p = await getPost(id)
        if (p && p.clientEmail === c.email && ['Idea', 'Draft', 'Changes requested'].includes(p.status)) moved.push(await movePost(p, 'Client review', user.split('@')[0]))
      }
      const alerted = moved.length ? await notifyClientPosts(c, moved).then(() => true, err => { console.error('Post alert failed:', err); return false }) : false
      return NextResponse.json({ ok: true, posts: moved, alerted })
    }
    if (b.action === 'delete') { await deletePost(b.id); return NextResponse.json({ ok: true }) }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Calendar failed:', err)
    return NextResponse.json({ error: err instanceof Error && !err.message.startsWith('Airtable') ? err.message : 'Couldn’t save to Airtable.' }, { status: 502 })
  }
}

export const dynamic = 'force-dynamic'
