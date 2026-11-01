import Stripe from 'stripe'

/** A customer-entered code that checks out, with the discount it gives on this price. */
export async function applyPromo(stripe: Stripe, raw: string, prices: Stripe.Price[]) {
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
  if (!coupon.valid) fail()
  // A coupon limited to certain products only discounts those lines.
  const productOf = (p: Stripe.Price) => typeof p.product === 'string' ? p.product : p.product.id
  const eligible = prices.filter(p => !coupon.applies_to || coupon.applies_to.products.includes(productOf(p)))
  if (!eligible.length) fail()
  const base = eligible.reduce((t, p) => t + (p.unit_amount ?? 0), 0)
  const total = prices.reduce((t, p) => t + (p.unit_amount ?? 0), 0)
  const off = coupon.amount_off != null
    ? (coupon.currency === prices[0].currency ? Math.min(coupon.amount_off, base) : 0)
    : Math.round(base * (coupon.percent_off ?? 0) / 100)
  if (!off) fail()
  // Stripe's minimum card charge is 50 cents.
  return { id: promo.id, code: promo.code, off: Math.min(off, total - 50) }
}

