import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { currentClientEmail } from '@/lib/portal/auth'
import { SITE } from '@/lib/plans/email'

/** Send a signed-in client to Stripe's billing page for invoices, card and plan changes. */
export async function POST(req: NextRequest) {
  const email = currentClientEmail()
  if (!email) return NextResponse.redirect(new URL('/portal/login', req.url), 303)
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
    const { data } = await stripe.customers.list({ email, limit: 10 })
    // Checkout makes a customer per purchase; the newest one holds the latest billing.
    const customer = data.sort((a, b) => b.created - a.created)[0]
    if (!customer) return NextResponse.redirect(new URL('/portal?billing=none', req.url), 303)
    const session = await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: `${SITE}/portal` })
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    console.error('Portal billing failed:', err)
    return NextResponse.redirect(new URL('/portal?billing=error', req.url), 303)
  }
}
