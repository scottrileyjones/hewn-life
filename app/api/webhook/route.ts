import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { markPaid } from '@/lib/plans/flow'

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Checkout completed:', {
      id: session.id,
      customer: session.customer,
      email: session.customer_email ?? session.customer_details?.email,
      amount: session.amount_total,
      mode: session.mode,
    })
    await markPaid(session.customer_email ?? session.customer_details?.email ?? '')
  }

  // Embedded checkout: subscriptions settle as paid invoices, one-time orders as payment intents.
  if (event.type === 'invoice.paid') {
    await markPaid((event.data.object as Stripe.Invoice).customer_email ?? '')
  }
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    let email = pi.receipt_email ?? ''
    if (!email && typeof pi.customer === 'string') {
      const c = await stripe.customers.retrieve(pi.customer)
      if (!c.deleted) email = c.email ?? ''
    }
    await markPaid(email)
  }

  return NextResponse.json({ received: true })
}
