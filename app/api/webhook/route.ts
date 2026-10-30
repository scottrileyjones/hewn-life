import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { markPaid } from '@/lib/plans/flow'
import { provisionPortal } from '@/lib/portal/provision'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // The plan token a growth-plan buy link put on the customer, so the sale is credited to that lead.
  const planToken = async (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null, own?: Stripe.Metadata | null) => {
    if (own?.planToken) return own.planToken
    if (typeof customer !== 'string') return undefined
    const c = await stripe.customers.retrieve(customer)
    return c.deleted ? undefined : c.metadata?.planToken
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Checkout completed:', {
      id: session.id,
      customer: session.customer,
      email: session.customer_email ?? session.customer_details?.email,
      amount: session.amount_total,
      mode: session.mode,
    })
    await markPaid(session.customer_email ?? session.customer_details?.email ?? '', {
      token: await planToken(session.customer, session.metadata),
      amount: session.amount_total ? session.amount_total / 100 : undefined,
    })
  }

  // A first purchase gets a client portal with its package's onboarding plan. Never fail the webhook over it.
  const portal = async (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null, email: string, meta?: Stripe.Metadata | null) => {
    try {
      let m = meta ?? {}
      if (!m.tier && typeof customer === 'string') {
        const c = await stripe.customers.retrieve(customer)
        if (!c.deleted) m = c.metadata ?? {}
      }
      await provisionPortal({ email, tier: m.tier, name: m.fullName, company: m.businessName })
    } catch (err) { console.error('Portal provisioning failed:', err) }
  }

  // Embedded checkout: subscriptions settle as paid invoices, one-time orders as payment intents.
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    await markPaid(invoice.customer_email ?? '', {
      token: await planToken(invoice.customer),
      amount: invoice.amount_paid ? invoice.amount_paid / 100 : undefined,
    })
    if (invoice.billing_reason === 'subscription_create') await portal(invoice.customer, invoice.customer_email ?? '')
  }
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    let email = pi.receipt_email ?? ''
    if (!email && typeof pi.customer === 'string') {
      const c = await stripe.customers.retrieve(pi.customer)
      if (!c.deleted) email = c.email ?? ''
    }
    // Subscription invoices also raise payment intents; invoice.paid credits those.
    await markPaid(email, { token: await planToken(pi.customer, pi.metadata), amount: pi.amount_received ? pi.amount_received / 100 : undefined })
    // Only our one-time checkout puts the tier on the payment intent; subscription payments are handled above.
    if (pi.metadata?.tier) await portal(pi.customer, email, pi.metadata)
  }

  return NextResponse.json({ received: true })
}
