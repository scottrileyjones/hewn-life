/**
 * The agreement a self-serve buyer signs at checkout: the same Master Services
 * Agreement and Order Form HQ sends, filled in from what's in their cart.
 * Prices come from Stripe, so the signed fee is the fee they're charged.
 */
import Stripe from 'stripe'
import { lookup, normalizeCart } from '@/lib/addons'
import { blankDeal, render, type Deal, type Product } from '@/lib/agreements/templates'
import { hashDoc } from '@/lib/agreements/data'
import { applyPromo } from './promo'

export type CheckoutSigner = {
  email: string
  fullName: string
  businessName: string
  /** Legal entity name if different, e.g. "Acme Plumbing LLC". */
  legalName?: string
  title?: string
  address?: string
}
export type CheckoutOrder = { priceId?: string; items?: string[]; promoCode?: string }

const PLAN_PRICES: Record<string, [Product, 'monthly' | 'annual']> = Object.fromEntries(([
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_MONTHLY, 'Hewn', 'monthly'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_ANNUAL, 'Hewn', 'annual'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_MONTHLY, 'Wrought', 'monthly'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_ANNUAL, 'Wrought', 'annual'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_MONTHLY, 'Forged', 'monthly'],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_ANNUAL, 'Forged', 'annual'],
] as const).filter(([id]) => id).map(([id, p, b]) => [id!, [p, b]]))

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

/** The deal for this cart and buyer, its text, and the fingerprint of that text. */
export async function checkoutAgreement(order: CheckoutOrder, who: CheckoutSigner) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_missing', { apiVersion: '2026-04-22.dahlia' })
  const fail = (msg: string) => { throw Object.assign(new Error(msg), { userFacing: true }) }
  const company = (who.legalName || who.businessName).trim()
  let deal: Deal

  const cart = order.items?.length ? normalizeCart(order.items) : []
  // Local previews without Stripe keys (PLAN_SAMPLE=1) price the cart from the catalog.
  const sample = process.env.PLAN_SAMPLE === '1' && !process.env.STRIPE_SECRET_KEY
  if (cart.length) {
    const prices = sample
      ? cart.map(s => ({ unit_amount: lookup(s)!.fee * 100, currency: 'usd', product: '' } as unknown as Stripe.Price))
      : await Promise.all(cart.map(s => stripe.prices.retrieve(lookup(s)!.priceId)))
    deal = blankDeal('Add-on services', { company, name: who.fullName, email: who.email })
    deal.addOns = cart.map(s => ({ name: lookup(s)!.name, qty: 1 }))
    deal.fee = prices.reduce((t, p) => t + (p.unit_amount ?? 0), 0) / 100
    if (order.promoCode?.trim()) {
      const promo = await applyPromo(stripe, order.promoCode, prices)
      deal.specialTerms = `Promo code ${promo.code} applied at checkout: ${usd(promo.off / 100)} off, for a total of ${usd(deal.fee - promo.off / 100)}.`
    }
  } else if (order.priceId) {
    const price = sample ? ({ unit_amount: 250000, recurring: { interval: 'month' } } as unknown as Stripe.Price) : await stripe.prices.retrieve(order.priceId)
    const plan = PLAN_PRICES[order.priceId] ?? (sample ? (['Hewn', 'monthly'] as [Product, 'monthly']) : undefined)
    if (plan) {
      deal = blankDeal(plan[0], { company, name: who.fullName, email: who.email })
      deal.billing = plan[1]
      deal.fee = Math.round((price.unit_amount ?? 0) / (plan[1] === 'annual' ? 12 : 1)) / 100
    } else if (order.priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_WEBSITE_IN_A_DAY && !price.recurring) {
      deal = blankDeal('Website in a Day', { company, name: who.fullName, email: who.email })
      deal.fee = (price.unit_amount ?? 0) / 100
      if (order.promoCode?.trim()) {
        const promo = await applyPromo(stripe, order.promoCode, [price])
        deal.specialTerms = `Promo code ${promo.code} applied at checkout: ${usd(promo.off / 100)} off, for a total of ${usd(deal.fee - promo.off / 100)}.`
      }
    } else return fail('We couldn’t find that plan. Go back to pricing and try again.')
  } else return fail('Pick a plan or an add-on first.')

  deal.clientLegalName = company
  deal.signerName = who.fullName.trim()
  deal.signerTitle = (who.title || 'Owner').trim()
  deal.signerEmail = who.email.trim().toLowerCase()
  deal.clientAddress = (who.address || '').trim()
  const doc = render(deal)
  return { deal, doc, hash: hashDoc(doc) }
}
