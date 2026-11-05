import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { currentClientEmail } from '@/lib/portal/auth'
import { SITE } from '@/lib/plans/email'

/**
 * hewn.life/portal/billing: where Stripe's billing emails (renewals, expiring cards,
 * failed payments) send customers. Signed in: straight to their card and plan,
 * returning to their portal. Signed out: sign in first, then back here.
 */
export async function GET(req: NextRequest) {
  const email = (await currentClientEmail())
  if (!email) return NextResponse.redirect(new URL('/portal/login?next=billing', req.url))
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
    const { data } = await stripe.customers.list({ email, limit: 10 })
    // Checkout makes a customer per purchase; the newest one holds the latest billing.
    const customer = data.sort((a, b) => b.created - a.created)[0]
    if (!customer) return NextResponse.redirect(new URL('/portal?billing=none', req.url))
    const session = await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: `${SITE}/portal` })
    return NextResponse.redirect(session.url)
  } catch (err) {
    console.error('Portal billing failed:', err)
    return NextResponse.redirect(new URL('/portal?billing=error', req.url))
  }
}
