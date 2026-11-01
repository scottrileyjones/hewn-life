import { NextRequest, NextResponse } from 'next/server'
import { paidOrder } from '@/lib/checkout/order'
import { provisionPortal } from '@/lib/portal/provision'
import { findClient } from '@/lib/portal/data'
import { PORTAL_COOKIE, portalSessionFor } from '@/lib/portal/auth'

/**
 * "Start my requirements" on /thank-you: signs the buyer straight into their
 * portal. Sets the portal up first if Stripe's webhook hasn't got there yet.
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const order = await paidOrder(p.get('pi') ?? undefined, p.get('s') ?? undefined)
  if (!order?.succeeded) return NextResponse.redirect(new URL('/portal/login', req.url))
  try {
    if (order.pkg) await provisionPortal({ email: order.email, tier: order.pkg, name: order.name, company: order.company })
  } catch (err) { console.error('Portal setup from checkout failed:', err) }
  const client = await findClient(order.email).catch(() => null)
  if (!client) return NextResponse.redirect(new URL('/portal/login', req.url))
  const session = portalSessionFor(order.email)
  const res = NextResponse.redirect(new URL('/portal', req.url))
  res.cookies.set(PORTAL_COOKIE, session.value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: session.maxAge })
  return res
}
