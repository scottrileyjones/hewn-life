import { NextRequest, NextResponse } from 'next/server'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient } from '@/lib/portal/data'
import { getPost, movePost } from '@/lib/portal/posts'
import { notifyTeamPost } from '@/lib/portal/notify'

/** A client approves a post, or asks for changes. */
export async function POST(req: NextRequest) {
  const email = currentClientEmail()
  const c = email ? await findClient(email).catch(() => null) : null
  if (!c || c.status === 'Past') return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as { id?: string; decision?: string; comment?: string }
  try {
    const p = b.id ? await getPost(b.id) : null
    if (!p || p.clientEmail !== c.email) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    if (p.status !== 'Client review') return NextResponse.json({ error: 'This post isn’t waiting for your review.' }, { status: 400 })
    const status = b.decision === 'approve' ? 'Approved' : b.decision === 'changes' ? 'Changes requested' : null
    if (!status) return NextResponse.json({ error: 'Approve or request changes.' }, { status: 400 })
    if (status === 'Changes requested' && !(b.comment || '').trim()) return NextResponse.json({ error: 'Tell us what to change.' }, { status: 400 })
    const saved = await movePost(p, status, c.name || c.email, b.comment || '')
    await notifyTeamPost(c, saved, status, b.comment || '').catch(err => console.error('Post alert failed:', err))
    return NextResponse.json({ ok: true, post: saved })
  } catch (err) {
    console.error('Portal calendar failed:', err)
    return NextResponse.json({ error: 'Couldn’t save. Try again, or message us.' }, { status: 502 })
  }
}
