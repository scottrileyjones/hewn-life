/**
 * Links that go straight to checkout, so every page can sell: a monthly plan,
 * or one à la carte item or kit. Prices shown come from lib/services (plans)
 * and lib/addons (à la carte); checkout charges the Stripe price itself.
 */
import { plans } from '@/lib/services'
import { lookup, isKit, type AddOn, type Kit } from '@/lib/addons'

type TierSlug = 'hewn' | 'wrought' | 'forged'

const MONTHLY: Record<TierSlug, string> = {
  hewn: process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_MONTHLY ?? '',
  wrought: process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_MONTHLY ?? '',
  forged: process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_MONTHLY ?? '',
}

/** Checkout for a plan, billed monthly; the pricing page if its price isn't configured. */
export function planCheckout(slug: TierSlug) {
  const plan = plans.find(p => p.slug === slug)!
  if (!MONTHLY[slug]) return '/pricing#plans'
  return `/checkout?${new URLSearchParams({ priceId: MONTHLY[slug], mode: 'subscription', name: plan.name, price: String(plan.price.monthly), billing: 'monthly', tier: slug })}`
}

/** Checkout for one à la carte item or kit. */
export const itemCheckout = (sku: string) => `/checkout?${new URLSearchParams({ items: sku, mode: 'payment' })}`

/** The à la carte pieces that match each service playbook (keyed by lib/services pillar slug). */
const PILLAR_ITEMS: Record<string, string[]> = {
  strategy: ['visibility', 'kit_found'],
  'performance-media': ['ads_audit', 'creatives', 'kit_ads'],
  'creative-production': ['creatives', 'video', 'kit_ads'],
  'seo-aeo': ['visibility', 'blog', 'gbp'],
  creators: ['video', 'reviews', 'kit_content'],
  lifecycle: ['email', 'reviews', 'kit_content'],
  'data-attribution': ['ads_audit', 'visibility'],
  social: ['video', 'blog', 'kit_content'],
  brand: ['brand', 'copy', 'kit_brand'],
}

export function pillarItems(slug: string): (AddOn | Kit)[] {
  return (PILLAR_ITEMS[slug] ?? []).map(s => lookup(s)).filter((x): x is AddOn | Kit => !!x)
}

export { isKit }
