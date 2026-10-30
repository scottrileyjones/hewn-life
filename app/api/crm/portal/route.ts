import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { CLIENT_STATUSES, addMessage, findClient, loadMessages, saveClient, touchClient, type ClientPatch } from '@/lib/portal/data'
import { sendPortalLink } from '@/lib/portal/auth'
import { notifyClient, notifyClientStep } from '@/lib/portal/notify'
import { isPackage, stepsFor, track } from '@/lib/portal/onboarding'
import { buildBrief } from '@/lib/portal/brief'

type Body =
  | { action: 'save'; id: string | null; patch: ClientPatch; invite?: boolean }
  | { action: 'post'; email: string; body: string; kind: 'Message' | 'Update' }
  | { action: 'invite'; email: string }
  | { action: 'thread'; email: string }
  | { action: 'package'; email: string; package: string }
  | { action: 'signoff'; email: string; step: string; done: boolean; notify?: boolean }
  | { action: 'brief'; email: string }

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
    if (b.action === 'package') {
      const client = await findClient(b.email)
      if (!client) return NextResponse.json({ error: 'No such client.' }, { status: 404 })
      if (!isPackage(b.package)) return NextResponse.json({ error: 'Unknown package.' }, { status: 400 })
      // Keep anything already done; the first two steps are done the moment a plan is applied.
      const now = new Date().toISOString()
      const progress = { ...client.progress }
      for (const id of ['order', 'welcome']) if (!progress[id]?.done) progress[id] = { ...progress[id], done: now, by: user }
      const saved = await saveClient(client.id, { package: b.package, progress })
      return NextResponse.json({ ok: true, client: saved })
    }
    if (b.action === 'signoff') {
      const client = await findClient(b.email)
      if (!client) return NextResponse.json({ error: 'No such client.' }, { status: 404 })
      const step = stepsFor(client.package).find(s => s.id === b.step)
      if (!step) return NextResponse.json({ error: 'Unknown step.' }, { status: 400 })
      const prev = client.progress[step.id] ?? {}
      const next = b.done ? { ...prev, done: new Date().toISOString(), by: user } : { ...prev, done: undefined, by: undefined }
      const saved = await saveClient(client.id, { progress: { ...client.progress, [step.id]: next } })
      let alerted = false
      if (b.done && b.notify !== false) {
        const t = track(saved.package, saved.progress)
        const theirs = t.yourTurn[0]
        const upNext = theirs ? { title: theirs.step.title, theirs: true } : t.current ? { title: t.current.title, theirs: false } : null
        alerted = await notifyClientStep(saved, step.title, upNext, { done: t.done, total: t.total }).then(() => true, err => { console.error('Step alert failed:', err); return false })
      }
      return NextResponse.json({ ok: true, client: saved, alerted })
    }
    if (b.action === 'brief') {
      const client = await findClient(b.email)
      if (!client) return NextResponse.json({ error: 'No such client.' }, { status: 404 })
      return NextResponse.json({ ok: true, markdown: buildBrief(client) })
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
