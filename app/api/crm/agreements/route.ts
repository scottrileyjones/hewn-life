import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { findClient } from '@/lib/portal/data'
import { notifyClientAgreement } from '@/lib/portal/notify'
import { createAgreement, getAgreement, loadAgreements, noteSent, voidAgreement } from '@/lib/agreements/data'
import { cleanDeal } from '@/lib/agreements/validate'

type Body =
  | { action: 'list'; email: string }
  | { action: 'send'; email: string; deal: Record<string, unknown>; signer: { name?: string; title?: string; agree?: boolean } }
  | { action: 'resend'; id: string }
  | { action: 'void'; id: string }

const ipOf = (req: NextRequest) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()

/** HQ: list a client's agreements, countersign and send a new one, resend the email, or void one. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as Body
  try {
    if (b.action === 'list') return NextResponse.json({ ok: true, agreements: await loadAgreements(b.email) })
    if (b.action === 'send') {
      const c = await findClient(b.email)
      if (!c) return NextResponse.json({ error: 'Give this client a portal first.' }, { status: 404 })
      const { deal, error } = cleanDeal(b.deal ?? {})
      if (!deal) return NextResponse.json({ error }, { status: 400 })
      const name = (b.signer?.name || '').trim().slice(0, 120), title = (b.signer?.title || '').trim().slice(0, 120)
      if (!name || !title) return NextResponse.json({ error: 'Add your name and title to countersign.' }, { status: 400 })
      if (b.signer?.agree !== true) return NextResponse.json({ error: 'Tick the box to sign for Hewn Life.' }, { status: 400 })
      const a = await createAgreement(deal, { email: c.email, company: c.company || deal.clientLegalName }, { name, title, email: user, at: new Date().toISOString(), ip: ipOf(req) })
      const emailed = await notifyClientAgreement(c, a).then(() => true, err => { console.error('Agreement email failed:', err); return false })
      return NextResponse.json({ ok: true, agreement: a, emailed })
    }
    if (b.action === 'resend' || b.action === 'void') {
      const a = await getAgreement(b.id)
      if (!a) return NextResponse.json({ error: 'No such agreement.' }, { status: 404 })
      if (a.status === 'Signed' || a.status === 'Void') return NextResponse.json({ error: `This agreement is already ${a.status.toLowerCase()}.` }, { status: 409 })
      if (b.action === 'void') return NextResponse.json({ ok: true, agreement: await voidAgreement(a, user) })
      const c = await findClient(a.clientEmail)
      if (!c) return NextResponse.json({ error: 'That client no longer has a portal.' }, { status: 404 })
      await notifyClientAgreement(c, a)
      await noteSent(a, `reminder emailed by ${user}`)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Agreements action failed:', err)
    return NextResponse.json({ error: 'Couldn’t save. Try again.' }, { status: 502 })
  }
}
