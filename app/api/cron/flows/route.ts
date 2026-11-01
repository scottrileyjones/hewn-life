import { NextRequest, NextResponse } from 'next/server'
import { runDue } from '@/lib/flows/engine'

export const maxDuration = 60

/** Sends lifecycle flow steps that are due. Called every 15 minutes by GitHub Actions, and daily by Vercel as a backup. */
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true, ...(await runDue()) })
}
