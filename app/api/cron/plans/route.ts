import { NextRequest, NextResponse } from 'next/server'
import { runFollowUps } from '@/lib/plans/flow'

/** Daily (vercel.json): sends growth-plan follow-ups that are due. */
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sent = await runFollowUps()
  return NextResponse.json({ ok: true, sent })
}
