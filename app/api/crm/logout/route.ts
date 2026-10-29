import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/crm/auth'

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/crm/login', req.url), 303)
  res.cookies.delete(SESSION_COOKIE)
  return res
}
