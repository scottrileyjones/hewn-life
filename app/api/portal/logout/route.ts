import { NextRequest, NextResponse } from 'next/server'
import { PORTAL_COOKIE } from '@/lib/portal/auth'

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/portal/login', req.url), 303)
  res.cookies.delete(PORTAL_COOKIE)
  return res
}
