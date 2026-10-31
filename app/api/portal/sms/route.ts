import { NextRequest, NextResponse } from 'next/server'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient, saveSmsChoice } from '@/lib/portal/data'
import { subscribe } from '@/lib/smsMarketing'
import { CONSENT_TEXT, WELCOME_TEXT, prettyPhone, sendSms, toE164 } from '@/lib/sms'

/** A client turns text alerts on (with their mobile and the consent box ticked) or off. */
export async function POST(req: NextRequest) {
  const email = currentClientEmail()
  const client = email ? await findClient(email).catch(() => null) : null
  if (!client || client.status === 'Past') return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as { optIn?: unknown; mobile?: unknown; agreed?: unknown; offers?: unknown }
  try {
    if (b.optIn !== true) {
      const saved = await saveSmsChoice(client, false, client.mobile, 'turned off in portal')
      return NextResponse.json({ ok: true, mobile: saved.mobile, smsOptIn: saved.smsOptIn })
    }
    const mobile = toE164(typeof b.mobile === 'string' ? b.mobile : '')
    if (!mobile) return NextResponse.json({ error: 'Enter a 10-digit mobile number.' }, { status: 400 })
    if (b.agreed !== true) return NextResponse.json({ error: 'Tick the box to agree to texts.' }, { status: 400 })
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
    const saved = await saveSmsChoice(client, true, mobile, `portal checkbox${ip ? ` from ${ip}` : ''}: "${CONSENT_TEXT}"`)
    if (b.offers === true) await subscribe({ mobile, name: client.name, email: client.email, company: client.company, source: 'Client portal', ip })
    const sent = await sendSms(mobile, WELCOME_TEXT).catch(err => { console.error('Welcome text failed:', err); return false })
    return NextResponse.json({ ok: true, mobile: saved.mobile, smsOptIn: saved.smsOptIn, pretty: prettyPhone(mobile), sent })
  } catch (err) {
    console.error('SMS choice failed:', err)
    return NextResponse.json({ error: 'Couldn’t save. Try again.' }, { status: 502 })
  }
}
