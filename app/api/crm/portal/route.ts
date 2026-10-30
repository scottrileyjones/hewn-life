import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { CLIENT_STATUSES, addMessage, findClient, loadMessages, saveClient, touchClient, type ClientPatch } from '@/lib/portal/data'
import { sendPortalLink } from '@/lib/portal/auth'
import { notifyClient } from '@/lib/portal/notify'

type Body =
  | { action: 'save'; id: string | null; patch: ClientPatch; invite?: boolean }
  | { action: 'post'; email: string; body: string; kind: 'Message' | 'Update' }
  | { action: 'invite'; email: string }
  | { action: 'thread'; email: string }

/** The team side of the client portal: add and edit clients, post to their thread, send invites. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as Body
  try {
    if (b.action === 'save') {
      const p = b.patch ?? {}
      if (p.status !== undefined && !CLIENT_STATUSES.includes(p.status)) return NextResponse.json({ error: 'Unknown status' }, { status: 400 })
      if (p.email !== undefined && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email.trim())) return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 })
      if (!b.id) {
        if (!p.email) return NextResponse.json({ error: 'A new client needs an email.' }, { status: 400 })
        if (await findClient(p.email)) return NextResponse.json({ error: 'That email already has a portal.' }, { status: 409 })
      }
      const client = await saveClient(b.id, { ...p, ...(b.id ? {} : { status: p.status ?? 'Onboarding' }) })
      if (b.invite) await sendPortalLink(client.email)
      return NextResponse.json({ ok: true, client })
    }
    if (b.action === 'post') {
      const client = await findClient(b.email)
      const text = (b.body || '').trim()
      if (!client) return NextResponse.json({ error: 'No such client.' }, { status: 404 })
      if (!text) return NextResponse.json({ error: 'Write something first.' }, { status: 400 })
      const message = await addMessage({ clientEmail: client.email, from: 'Hewn', kind: b.kind === 'Update' ? 'Update' : 'Message', author: user, body: text })
      await touchClient(client.id, 'Last team message')
      let alerted = true
      await notifyClient(client, message).catch(err => { alerted = false; console.error('Portal client alert failed:', err) })
      return NextResponse.json({ ok: true, message, alerted })
    }
    if (b.action === 'invite') {
      await sendPortalLink(b.email)
      return NextResponse.json({ ok: true })
    }
    if (b.action === 'thread') {
      return NextResponse.json({ ok: true, messages: await loadMessages(b.email) })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Portal admin failed:', err)
    return NextResponse.json({ error: 'Couldn’t save to Airtable.' }, { status: 502 })
  }
}
