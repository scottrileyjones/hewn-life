import { NextRequest, NextResponse } from 'next/server'
import { requestCancel } from '@/lib/cancel'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Step 1 of online cancellation. Always answers the same way, so it can't be used to look up customers. */
export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || !EMAIL.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  try {
    await requestCancel(email)
  } catch (err) {
    console.error('Cancel request failed:', err)
    return NextResponse.json({ error: 'Something went wrong. Please email hello@hewn.life and we’ll cancel for you.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
