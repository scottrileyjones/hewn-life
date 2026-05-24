// Requires server-side env var: STRIPE_SECRET_KEY=sk_live_...
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
    const { priceId, mode } = (await request.json()) as { priceId: string; mode: 'subscription' | 'payment' }

    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

    const origin = request.headers.get('origin') ?? 'https://hewn-life.vercel.app'

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: `${origin}/thank-you`,
      cancel_url: `${origin}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
