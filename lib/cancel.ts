/**
 * Online cancellation: the customer asks at /cancel, we email a signed link to
 * the address on the subscription, and the page it opens cancels at period end.
 * Emailing the link proves they own the address, so nobody can cancel someone
 * else's plan just by knowing their email.
 */
import { createHmac, timingSafeEqual } from 'crypto'
import Stripe from 'stripe'
import { SITE, REVIEWER, layout, button, esc, send } from '@/lib/plans/email'

const LINK_HOURS = 24

const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })

function signature(email: string, expires: number) {
  return createHmac('sha256', process.env.PLAN_SECRET || '').update(`cancel:${email}:${expires}`).digest('hex').slice(0, 32)
}

export function verifyCancelLink(email: string, expires: number, sig: string) {
  if (!process.env.PLAN_SECRET || !email || !sig || !Number.isFinite(expires) || expires < Date.now()) return false
  const a = Buffer.from(signature(email, expires)), b = Buffer.from(sig)
  return a.length === b.length && timingSafeEqual(a, b)
}

const normalize = (email: string) => email.trim().toLowerCase()

/** Subscriptions for this email that will still renew. */
async function renewing(email: string) {
  const s = stripe()
  const customers = await s.customers.list({ email, limit: 20 })
  const subs: Stripe.Subscription[] = []
  for (const c of customers.data) {
    const list = await s.subscriptions.list({ customer: c.id, status: 'all', limit: 20, expand: ['data.items.data.price.product'] })
    subs.push(...list.data.filter(x => ['active', 'trialing', 'past_due'].includes(x.status) && !x.cancel_at_period_end))
  }
  return subs
}

const planName = (sub: Stripe.Subscription) =>
  sub.items.data.map(i => (typeof i.price.product === 'object' && 'name' in i.price.product ? i.price.product.name : 'Hewn Life plan')).join(', ')

const periodEnd = (sub: Stripe.Subscription) => {
  const end = sub.items.data[0]?.current_period_end
  return end ? new Date(end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'the end of your current billing period'
}

/** Step 1: email a cancel link if this address has a renewing plan. Says nothing either way to the caller. */
export async function requestCancel(rawEmail: string) {
  const email = normalize(rawEmail)
  const subs = await renewing(email)
  if (!subs.length) return
  const expires = Date.now() + LINK_HOURS * 3600e3
  const url = `${SITE}/cancel/confirm?${new URLSearchParams({ e: email, x: String(expires), s: signature(email, expires) })}`
  const html = layout(`
<p>We got a request to cancel your Hewn Life subscription (${esc(subs.map(planName).join(', '))}).</p>
<p>Use the button below to confirm. Your plan will stay active until the end of the period you’ve paid for, and you won’t be charged again.</p>
<p style="margin:24px 0">${button(url, 'Confirm cancellation')}</p>
<p style="font-size:13px;color:#6E736D">This link works for ${LINK_HOURS} hours. If you didn’t ask to cancel, you can ignore this email and nothing will change.</p>`)
  await send(email, 'Confirm your Hewn Life cancellation', html)
}

/** For the confirm page: what will be cancelled. */
export async function describeCancel(email: string) {
  return (await renewing(normalize(email))).map(s => ({ plan: planName(s), until: periodEnd(s) }))
}

/** Step 2: cancel every renewing plan for this email at period end, and confirm by email. */
export async function confirmCancel(rawEmail: string) {
  const email = normalize(rawEmail)
  const subs = await renewing(email)
  const done: { plan: string; until: string }[] = []
  for (const sub of subs) {
    await stripe().subscriptions.update(sub.id, { cancel_at_period_end: true })
    done.push({ plan: planName(sub), until: periodEnd(sub) })
  }
  if (!done.length) return done
  const lines = done.map(d => `<li>${esc(d.plan)}: active until ${esc(d.until)}, then no further charges.</li>`).join('')
  await send(email, 'Your Hewn Life subscription is cancelled', layout(`
<p>Your cancellation is confirmed.</p>
<ul style="padding-left:20px">${lines}</ul>
<p>We’ll hand over your completed work as described in our Terms. If you change your mind before then, just reply to this email.</p>
<p style="margin:0">The Hewn Life team</p>`))
  await send(REVIEWER, `Cancelled: ${email}`, layout(`<p>${esc(email)} cancelled online.</p><ul style="padding-left:20px">${lines}</ul>`)).catch(() => {})
  return done
}
