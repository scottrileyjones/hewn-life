import { NextResponse } from 'next/server'
import Stripe from 'stripe'

type Body = {
  priceId: string
  mode: 'subscription' | 'payment'
  email: string
  metadata?: Record<string, string>
  promoCode?: string
}

/** A customer-entered code that checks out, with the discount it gives on this price. */
async function applyPromo(stripe: Stripe, raw: string, price: Stripe.Price) {
  const code = raw.trim()
  const fail = (msg = 'That promo code isn’t valid for this purchase.') => { throw Object.assign(new Error(msg), { userFacing: true }) }
  if (!/^[A-Za-z0-9-]{2,40}$/.test(code)) fail()
  const { data } = await stripe.promotionCodes.list({ code, active: true, limit: 1 })
  const promo = data[0]
  if (!promo || (promo.expires_at && promo.expires_at * 1000 < Date.now())) fail()
  if (promo.max_redemptions && promo.times_redeemed >= promo.max_redemptions) fail('That promo code has been used up.')
  const couponId = typeof promo.promotion.coupon === 'string' ? promo.promotion.coupon : promo.promotion.coupon?.id
  if (!couponId) fail()
  const coupon = await stripe.coupons.retrieve(couponId!, { expand: ['applies_to'] })
  const product = typeof price.product === 'string' ? price.product : price.product.id
  if (!coupon.valid || (coupon.applies_to && !coupon.applies_to.products.includes(product))) fail()
  const base = price.unit_amount ?? 0
  const off = coupon.amount_off != null
    ? (coupon.currency === price.currency ? coupon.amount_off : 0)
    : Math.round(base * (coupon.percent_off ?? 0) / 100)
  if (!off) fail()
  // Stripe's minimum card charge is 50 cents.
  return { id: promo.id, code: promo.code, off: Math.min(off, base - 50) }
}

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
    const { priceId, mode, email, metadata, promoCode } = (await request.json()) as Body

    if (!priceId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // The exact charge and renewal interval, shown next to the pay button.
    const price = await stripe.prices.retrieve(priceId)
    // Promo codes are for one-time purchases (e.g. BETA250 on Website in a Day).
    if (promoCode?.trim() && mode === 'subscription') {
      return NextResponse.json({ error: 'Promo codes only apply to one-time purchases.' }, { status: 400 })
    }
    const promo = promoCode?.trim() ? await applyPromo(stripe, promoCode, price) : null
    const charge = {
      amount: (price.unit_amount ?? 0) - (promo?.off ?? 0),
      currency: price.currency,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? 1,
      ...(promo ? { original: price.unit_amount ?? 0, promo: { code: promo.code, off: promo.off } } : {}),
    }
    const promoMeta: Record<string, string> = promo ? { promoCode: promo.code, promotionCodeId: promo.id, discount: String(promo.off) } : {}

    const customer = await stripe.customers.create({
      email,
      metadata: metadata ?? {},
    })

    if (mode === 'subscription') {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        metadata: metadata ?? {},
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card'],
        },
        // Since Stripe API 2025-03-31, invoices expose the first payment's secret as
        // confirmation_secret; latest_invoice.payment_intent no longer exists.
        expand: ['latest_invoice.confirmation_secret'],
      })

      const invoice = subscription.latest_invoice as Stripe.Invoice | null
      const clientSecret = invoice?.confirmation_secret?.client_secret

      if (!clientSecret) {
        // Fallback: retrieve the payment intent directly from the subscription's pending setup
        if (subscription.pending_setup_intent) {
          const setupIntent = await stripe.setupIntents.retrieve(
            typeof subscription.pending_setup_intent === 'string'
              ? subscription.pending_setup_intent
              : subscription.pending_setup_intent.id
          )
          return NextResponse.json({ clientSecret: setupIntent.client_secret, mode: 'setup', charge })
        }
        return NextResponse.json({ error: 'Could not create payment session. Please try again.' }, { status: 500 })
      }

      return NextResponse.json({ clientSecret, charge })
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: charge.amount,
        currency: price.currency,
        customer: customer.id,
        metadata: { ...(metadata ?? {}), ...promoMeta },
        payment_method_types: ['card', 'klarna', 'afterpay_clearpay', 'affirm'],
      })

      return NextResponse.json({ clientSecret: paymentIntent.client_secret, charge })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: (err as { userFacing?: boolean }).userFacing ? 400 : 500 })
  }
}
