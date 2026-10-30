import { NextRequest, NextResponse } from 'next/server'
import { sendPortalLink } from '@/lib/portal/auth'

/** Email a portal sign-in link. Same answer for every address, so it can't be used to find out who's a client. */
export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || !email.includes('@')) return NextResponse.json({ error: 'Enter your email.' }, { status: 400 })
  try {
    await sendPortalLink(email)
  } catch (err) {
    console.error('Portal login link failed:', err)
    return NextResponse.json({ error: 'Couldn’t send the link. Try again in a minute.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
