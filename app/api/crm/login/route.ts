import { NextRequest, NextResponse } from 'next/server'
import { sendLoginLink } from '@/lib/crm/auth'

/** Email a sign-in link. Same answer for every address, so it can't be used to find out who has access. */
export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || !email.includes('@')) return NextResponse.json({ error: 'Enter your email.' }, { status: 400 })
  try {
    await sendLoginLink(email)
  } catch (err) {
    console.error('CRM login link failed:', err)
    return NextResponse.json({ error: 'Couldn’t send the link. Try again in a minute.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
