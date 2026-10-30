import { NextRequest, NextResponse } from 'next/server'
import { currentClientEmail } from '@/lib/portal/auth'
import { addMessage, findClient, touchClient } from '@/lib/portal/data'
import { notifyTeam } from '@/lib/portal/notify'

/** A client sends us a message from their portal. */
export async function POST(req: NextRequest) {
  const email = currentClientEmail()
  const client = email ? await findClient(email).catch(() => null) : null
  if (!client || client.status === 'Past') return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const { body } = await req.json().catch(() => ({})) as { body?: unknown }
  const text = typeof body === 'string' ? body.trim() : ''
  if (!text) return NextResponse.json({ error: 'Write a message first.' }, { status: 400 })
  try {
    const message = await addMessage({ clientEmail: client.email, from: 'Client', kind: 'Message', author: client.email, body: text })
    await touchClient(client.id, 'Last client message')
    await notifyTeam(client, message).catch(err => console.error('Portal team alert failed:', err))
    return NextResponse.json({ ok: true, message })
  } catch (err) {
    console.error('Portal message failed:', err)
    return NextResponse.json({ error: 'Couldn’t send. Try again.' }, { status: 502 })
  }
}
