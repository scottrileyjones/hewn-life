import { NextResponse } from 'next/server'
import Stripe from 'stripe'

type Body = {
  priceId: string
  mode: 'subscription' | 'payment'
  customerEmail?: string
  metadata?: Record<string, string>
}

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
    const { priceId, mode, customerEmail, metadata } = (await request.json()) as Body

    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

    const origin = request.headers.get('origin') ?? 'https://hewn.life'

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      allow_promotion_codes: true,
      ...(mode === 'subscription'
        ? { subscription_data: { metadata: metadata ?? {} } }
        : { payment_intent_data: { metadata: metadata ?? {} } }),
      success_url: `${origin}/thank-you`,
      cancel_url: `${origin}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
