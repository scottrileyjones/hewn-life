/**
 * Revenue numbers for the HQ report, read live from Stripe. These are cash
 * figures (money collected, less refunds), so they track but don't replace
 * the booked Net Revenue the Grant Agreement's milestones are measured on.
 */
import Stripe from 'stripe'

export type Revenue = {
  mrr: number
  activeSubs: number
  collected30: number
  collected90: number
  runRate: number
  clients90: number
  months: { label: string; amount: number }[]
}

const monthKey = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}`

export async function loadRevenue(): Promise<Revenue> {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe not configured')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  const now = Date.now()
  const day = 864e5

  // Six calendar months back, for the monthly bars and the trailing windows.
  const start = new Date(now)
  start.setUTCDate(1); start.setUTCHours(0, 0, 0, 0); start.setUTCMonth(start.getUTCMonth() - 5)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(start); d.setUTCMonth(d.getUTCMonth() + i)
    return { key: monthKey(d), label: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }), amount: 0 }
  })

  let collected30 = 0, collected90 = 0
  const customers = new Set<string>()
  for await (const ch of stripe.charges.list({ created: { gte: Math.floor(start.getTime() / 1000) }, limit: 100 })) {
    if (ch.status !== 'succeeded' || !ch.paid) continue
    const net = (ch.amount - ch.amount_refunded) / 100
    const at = ch.created * 1000
    const m = months.find(x => x.key === monthKey(new Date(at)))
    if (m) m.amount += net
    if (at >= now - 30 * day) collected30 += net
    if (at >= now - 90 * day) {
      collected90 += net
      const who = typeof ch.customer === 'string' ? ch.customer : ch.customer?.id ?? ch.billing_details?.email ?? ''
      if (who && net > 0) customers.add(who)
    }
  }

  let mrr = 0, activeSubs = 0
  for await (const sub of stripe.subscriptions.list({ status: 'all', limit: 100 })) {
    if (!['active', 'trialing', 'past_due'].includes(sub.status)) continue
    activeSubs++
    if (typeof sub.customer === 'string') customers.add(sub.customer)
    for (const item of sub.items.data) {
      const p = item.price
      if (!p.recurring || p.unit_amount == null) continue
      const perInterval = (p.unit_amount / 100) * (item.quantity ?? 1)
      const n = p.recurring.interval_count || 1
      const perMonth = { day: perInterval * 30 / n, week: perInterval * 52 / 12 / n, month: perInterval / n, year: perInterval / 12 / n }[p.recurring.interval]
      mrr += perMonth
    }
  }

  return {
    mrr: Math.round(mrr),
    activeSubs,
    collected30: Math.round(collected30),
    collected90: Math.round(collected90),
    // Grant 1.2 annualizes three months of revenue (×4); this uses the last 90 days of cash.
    runRate: Math.round(collected90 * 4),
    clients90: customers.size,
    months: months.map(({ label, amount }) => ({ label, amount: Math.round(amount) })),
  }
}
