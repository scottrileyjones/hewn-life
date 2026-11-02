import { fitMetadata } from '@/lib/checkout/notes'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { waitUntil } from '@vercel/functions'
import { enroll } from '@/lib/flows/engine'
import { lookup, normalizeCart } from '@/lib/addons'
import { applyPromo } from '@/lib/checkout/promo'
import { getAgreement } from '@/lib/agreements/data'

type Body = {
  priceId?: string
  /** À la carte cart: add-on and kit SKUs from lib/addons.ts (one-time only). */
  items?: string[]
  mode: 'subscription' | 'payment'
  email: string
  metadata?: Record<string, string>
  promoCode?: string
  /** The agreement they signed at checkout (or one signed earlier in the portal). */
  agreementId?: string
}

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
    const { priceId: single, items, mode, email, metadata: rawMeta, promoCode, agreementId } = (await request.json()) as Body

    // Monthly plans: no payment without a signed agreement for this buyer. One-time orders accept the Terms at payment.
    if (mode === 'subscription' && process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_TOKEN) {
      const a = agreementId ? await getAgreement(agreementId).catch(() => null) : null
      if (!a || a.status !== 'Signed' || a.clientEmail !== String(email ?? '').trim().toLowerCase()) {
        return NextResponse.json({ error: 'Please review and sign your agreement before paying.' }, { status: 400 })
      }
    }

    // A cart is tidied the same way the shop shows it (kits swapped in), then priced by Stripe.
    const cart = items?.length ? normalizeCart(items) : []
    if (items?.length && (!cart.length || mode !== 'payment')) {
      return NextResponse.json({ error: 'Pick at least one add-on.' }, { status: 400 })
    }
    const priceIds = cart.length ? cart.map(s => lookup(s)!.priceId) : single ? [single] : []
    if (!priceIds.length || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const priceId = priceIds[0]
    const metadata: Record<string, string> = fitMetadata({ ...(rawMeta ?? {}), ...(agreementId ? { agreementId } : {}), ...(cart.length ? { tier: 'addons', items: cart.join(',') } : {}) })

    // The exact charge and renewal interval, shown next to the pay button.
    const prices = await Promise.all(priceIds.map(id => stripe.prices.retrieve(id)))
    if (prices.length > 1 && prices.some(p => p.recurring || p.currency !== prices[0].currency)) {
      return NextResponse.json({ error: 'Those items can’t be bought together.' }, { status: 400 })
    }
    const listAmount = prices.reduce((t, p) => t + (p.unit_amount ?? 0), 0)
    const price = prices[0]
    // Promo codes are for one-time purchases (e.g. BETA250 on Website in a Day).
    if (promoCode?.trim() && mode === 'subscription') {
      return NextResponse.json({ error: 'Promo codes only apply to one-time purchases.' }, { status: 400 })
    }
    const promo = promoCode?.trim() ? await applyPromo(stripe, promoCode, prices) : null
    const charge = {
      amount: listAmount - (promo?.off ?? 0),
      currency: price.currency,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? 1,
      ...(promo ? { original: listAmount, promo: { code: promo.code, off: promo.off } } : {}),
    }
    const promoMeta: Record<string, string> = promo ? { promoCode: promo.code, promotionCodeId: promo.id, discount: String(promo.off) } : {}

    const customer = await stripe.customers.create({
      email,
      metadata,
    })

    // Joins the abandoned-checkout flow; paying takes them out of it (webhook).
    const tier = metadata.tier ?? ''
    const plan = cart.length ? (cart.length === 1 ? lookup(cart[0])!.name : 'Hewn Life add-ons') : ({ 'website-in-a-day': 'Website in a Day', hewn: 'Hewn', wrought: 'Wrought', forged: 'Forged' } as Record<string, string>)[tier] ?? 'Hewn Life'
    const checkoutLink = `/checkout?${new URLSearchParams({
      ...(cart.length ? { items: cart.join(',') } : { priceId }), mode, name: plan, price: String(listAmount / 100), billing: price.recurring?.interval === 'year' ? 'annual' : 'monthly',
      ...(tier ? { tier } : {}), email, fullName: metadata.fullName ?? '', businessName: metadata.businessName ?? '', phone: metadata.phone ?? '',
    })}`
    waitUntil(enroll('checkout_abandoned', { email, name: metadata.fullName, company: metadata.businessName, phone: metadata.phone }, { plan, checkout_link: checkoutLink }))

    if (mode === 'subscription') {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        metadata,
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
        metadata: { ...metadata, ...promoMeta },
        description: cart.length ? cart.map(s => lookup(s)!.name).join(' + ') : undefined,
        // Stripe offers whatever methods are switched on in the dashboard and valid for this amount (e.g. Affirm has a minimum).
        automatic_payment_methods: { enabled: true },
      })

      return NextResponse.json({ clientSecret: paymentIntent.client_secret, charge })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: (err as { userFacing?: boolean }).userFacing ? 400 : 500 })
  }
}
