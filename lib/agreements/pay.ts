/** Where a signed retainer goes to pay: the normal checkout, prefilled, at the plan's Stripe price. */
import { LIST_PRICE, isRetainer } from './templates'
import type { Agreement } from './data'

const PRICE_IDS: Record<string, Record<'monthly' | 'annual', string | undefined>> = {
  hewn: { monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_MONTHLY, annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_ANNUAL },
  wrought: { monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_MONTHLY, annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_ANNUAL },
  forged: { monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_MONTHLY, annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_ANNUAL },
}

/** A checkout link for a retainer at list price; null when we'll invoice instead (custom price, one-time work). */
export function payLink(a: Agreement): string | null {
  const d = a.deal
  if (!isRetainer(a.product) || d.billing === 'one-time') return null
  const billing = d.billing === 'annual' ? 'annual' : 'monthly'
  if (LIST_PRICE[a.product][billing] !== d.fee) return null
  const tier = a.product.toLowerCase()
  const priceId = PRICE_IDS[tier]?.[billing]
  if (!priceId) return null
  return `/checkout?${new URLSearchParams({ priceId, mode: 'subscription', name: a.product, price: String(d.fee), billing, tier, email: a.clientEmail, fullName: d.signerName, businessName: d.clientLegalName || a.company })}`
}
