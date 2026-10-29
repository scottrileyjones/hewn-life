import { NextRequest, NextResponse } from 'next/server'
import { findByToken } from '@/lib/plans/store'
import { unsubscribe } from '@/lib/plans/flow'
import { verify } from '@/lib/plans/sign'

const page = (title: string, body: string) => new NextResponse(
  `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background:#F7F6F3;font-family:Helvetica,Arial,sans-serif;color:#0D0D0D;display:grid;place-items:center;min-height:100vh;padding:16px">
<div style="max-width:440px;background:#fff;border-radius:20px;padding:32px;text-align:center"><h1 style="font-size:22px;margin:0 0 12px">${title}</h1>${body}</div></body></html>`,
  { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
)

// GET shows a confirm button, so link scanners can't unsubscribe anyone; POST does it
// (and serves one-click List-Unsubscribe from mail clients).
export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t') || '', s = req.nextUrl.searchParams.get('s')
  if (!verify(t, 'unsubscribe', s)) return page('Link not valid', '<p>This unsubscribe link has expired or is incomplete.</p>')
  return page('Stop these emails?', `<form method="post" action="/api/plan/unsubscribe?t=${t}&s=${s}"><button style="background:#1E3826;color:#F4F2EC;border:0;border-radius:999px;padding:14px 24px;font-size:16px;cursor:pointer">Unsubscribe</button></form>`)
}

export async function POST(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t') || '', s = req.nextUrl.searchParams.get('s')
  if (!verify(t, 'unsubscribe', s)) return page('Link not valid', '<p>This unsubscribe link has expired or is incomplete.</p>')
  const p = await findByToken(t)
  if (p) await unsubscribe(p)
  return page('You’re unsubscribed', '<p>You won’t get any more emails about your growth plan. Your plan link still works.</p>')
}
