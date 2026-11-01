import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, safeNext, sessionFromLink } from '@/lib/crm/auth'

/** The emailed sign-in link: sets the session cookie and opens HQ. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const session = sessionFromLink(p.get('e') || '', Number(p.get('x')), p.get('s') || '')
  const next = safeNext(p.get('next'))
  if (!session) return NextResponse.redirect(new URL(`/crm/login?expired=1${next ? `&next=${encodeURIComponent(next)}` : ''}`, req.url))
  const res = NextResponse.redirect(new URL(next || '/hq', req.url))
  res.cookies.set(SESSION_COOKIE, session.value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: session.maxAge })
  return res
}
