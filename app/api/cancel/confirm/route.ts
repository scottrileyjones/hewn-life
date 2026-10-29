import { NextRequest, NextResponse } from 'next/server'
import { confirmCancel, verifyCancelLink } from '@/lib/cancel'

/** Step 2: the button on the emailed link's page. A POST, so link scanners opening the email can't cancel. */
export async function POST(req: NextRequest) {
  const { e, x, s } = await req.json().catch(() => ({}))
  if (!verifyCancelLink(String(e || ''), Number(x), String(s || ''))) {
    return NextResponse.json({ error: 'This link has expired. Request a new one at hewn.life/cancel.' }, { status: 400 })
  }
  try {
    const done = await confirmCancel(String(e))
    return NextResponse.json({ ok: true, done })
  } catch (err) {
    console.error('Cancel confirm failed:', err)
    return NextResponse.json({ error: 'Something went wrong. Please email hello@hewn.life and we’ll cancel for you.' }, { status: 500 })
  }
}
