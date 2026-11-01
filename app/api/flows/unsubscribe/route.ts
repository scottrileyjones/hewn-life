import { NextRequest, NextResponse } from 'next/server'
import { unsubSig, unsubscribe } from '@/lib/flows/engine'
import { layout } from '@/lib/plans/email'

const page = (msg: string) => new NextResponse(layout(`<p style="margin:0">${msg}</p>`), { headers: { 'Content-Type': 'text/html; charset=utf-8' } })

/** One-click unsubscribe from Hewn Life lifecycle and marketing emails (GET from the link, POST from mail apps). */
async function handle(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const email = (p.get('e') || '').toLowerCase()
  if (!email || p.get('s') !== unsubSig(email)) return page('That unsubscribe link isn’t valid. Email hello@hewn.life and we’ll take you off our list.')
  await unsubscribe(email, 'email link')
  return page(`You’re unsubscribed. ${email.replace(/[<>&]/g, '')} won’t get any more marketing or follow-up emails from Hewn Life. You’ll still get receipts and messages about work you’ve bought.`)
}
export const GET = handle
export const POST = handle
