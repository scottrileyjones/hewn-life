/**
 * Black Friday: Website in a Day at 50% off.
 *
 * The discount is a live Stripe promotion code (BLACKFRIDAY50 on coupon
 * oPaEyWmI: 50% off, Website in a Day only), which itself stops working at
 * `ends`. The checkout applies it from the link (?promo=), and the server
 * charges what Stripe says. Everything here is display: the promo bar, the
 * landing page and the struck-through price in checkout.
 */
export const blackFriday = {
  code: 'BLACKFRIDAY50',
  percentOff: 50,
  list: 999,
  price: 499.5,
  /** Cyber Monday, 11:59:59pm Mountain (Stripe's redeem_by / expires_at). */
  ends: new Date('2026-12-02T06:59:59Z'),
  endsLabel: 'Dec 1',
  page: '/black-friday',
}

export const offerLive = (now = new Date()) => now < blackFriday.ends

export const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

const WIAD_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_WEBSITE_IN_A_DAY ?? ''

/** Checkout for Website in a Day, with the Black Friday code while it runs. */
export function wiadCheckout(withOffer = offerLive()) {
  if (!WIAD_PRICE_ID) return '/website-in-a-day#order'
  return `/checkout?${new URLSearchParams({
    priceId: WIAD_PRICE_ID, mode: 'payment', name: 'Website in a Day', price: '999', tier: 'website-in-a-day',
    ...(withOffer ? { promo: blackFriday.code } : {}),
  })}`
}
