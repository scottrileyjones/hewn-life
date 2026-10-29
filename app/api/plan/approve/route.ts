import { NextRequest, NextResponse } from 'next/server'
import { approvePlan } from '@/lib/plans/flow'
import { verify } from '@/lib/plans/sign'

/** One-tap approval from the review link: sends the plan to the lead. */
export async function POST(req: NextRequest) {
  const { token, sig } = (await req.json().catch(() => ({}))) as { token?: string; sig?: string }
  if (!token || !verify(token, 'review', sig)) return NextResponse.json({ error: 'Invalid link.' }, { status: 403 })
  try {
    const sent = await approvePlan(token)
    return NextResponse.json({ ok: true, sent })
  } catch (err) {
    console.error('approve error:', err)
    return NextResponse.json({ error: 'Could not send the plan.' }, { status: 500 })
  }
}
