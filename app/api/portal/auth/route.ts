import { NextRequest, NextResponse } from 'next/server'
import { PORTAL_COOKIE, portalSessionFromLink } from '@/lib/portal/auth'

/** The emailed sign-in link: sets the portal session cookie and opens the dashboard. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const session = portalSessionFromLink(p.get('e') || '', Number(p.get('x')), p.get('s') || '')
  if (!session) return NextResponse.redirect(new URL('/portal/login?expired=1', req.url))
  const res = NextResponse.redirect(new URL('/portal', req.url))
  res.cookies.set(PORTAL_COOKIE, session.value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: session.maxAge })
  return res
}
