import { NextResponse } from 'next/server'
import Stripe from 'stripe'

type Body = {
  priceId: string
  mode: 'subscription' | 'payment'
  email: string
  metadata?: Record<string, string>
}

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
    const { priceId, mode, email, metadata } = (await request.json()) as Body

    if (!priceId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const customer = await stripe.customers.create({
      email,
      metadata: metadata ?? {},
    })

    if (mode === 'subscription') {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card'],
        },
        expand: ['latest_invoice.payment_intent'],
      })

      const invoice = subscription.latest_invoice as (Stripe.Invoice & {
        payment_intent: Stripe.PaymentIntent | null
      }) | null

      const clientSecret = invoice?.payment_intent?.client_secret

      if (!clientSecret) {
        // Fallback: retrieve the payment intent directly from the subscription's pending setup
        if (subscription.pending_setup_intent) {
          const setupIntent = await stripe.setupIntents.retrieve(
            typeof subscription.pending_setup_intent === 'string'
              ? subscription.pending_setup_intent
              : subscription.pending_setup_intent.id
          )
          return NextResponse.json({ clientSecret: setupIntent.client_secret, mode: 'setup' })
        }
        return NextResponse.json({ error: 'Could not create payment session. Please try again.' }, { status: 500 })
      }

      return NextResponse.json({ clientSecret })
    } else {
      const price = await stripe.prices.retrieve(priceId)

      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount!,
        currency: price.currency,
        customer: customer.id,
        metadata: metadata ?? {},
        payment_method_types: ['card', 'klarna', 'afterpay_clearpay', 'affirm'],
      })

      return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
