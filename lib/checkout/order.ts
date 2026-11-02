/**
 * The order behind a /thank-you page. Stripe sends the buyer back with the
 * payment's ID and client secret; only the buyer's browser has the secret, so
 * a match lets us show their order and sign them straight into their portal.
 */
import Stripe from 'stripe'
import { lookup, isKit } from '@/lib/addons'
import { addonPackage, packageName } from '@/lib/portal/onboarding'

export type PaidOrder = {
  id: string
  email: string
  name: string
  company: string
  /** The portal package: a plan id, or "addons:…". */
  pkg: string
  title: string
  lines: { name: string; detail: string; amount?: number }[]
  amount: number
  currency: string
  succeeded: boolean
}

const PLAN_LINE: Record<string, string> = {
  'website-in-a-day': 'Your custom website, live within 24 hours of your brief.',
  hewn: 'Monthly plan: brand, website, SEO and your Google profile.',
  wrought: 'Monthly plan: everything in Hewn plus ads, funnels and automation.',
  forged: 'Monthly plan: all nine pillars, run by our team.',
}

export async function paidOrder(paymentIntent?: string, secret?: string): Promise<PaidOrder | null> {
  // Local previews (PLAN_SAMPLE=1): /thank-you?payment_intent=pi_sample&payment_intent_client_secret=x
  if (process.env.PLAN_SAMPLE === '1' && paymentIntent === 'pi_sample') {
    const skus = ['kit_found', 'video']
    return { id: 'pi_sample', email: 'jane@acmeplumbing.com', name: 'Jane Smith', company: 'Acme Plumbing', pkg: addonPackage(skus), title: packageName(addonPackage(skus)), succeeded: true, amount: 169000, currency: 'usd',
      lines: skus.map(s => lookup(s)!).map(x => ({ name: x.name, detail: isKit(x) ? `Includes ${x.includes.map(s => lookup(s)?.name).join(', ')}` : x.detail, amount: x.fee * 100 })) }
  }
  if (process.env.PLAN_SAMPLE === '1' && paymentIntent === 'pi_sample_wiad') {
    return { id: 'pi_sample_wiad', email: 'jane@acmeplumbing.com', name: 'Jane Smith', company: 'Acme Plumbing', pkg: 'website-in-a-day', title: packageName('website-in-a-day'), succeeded: true, amount: 99900, currency: 'usd',
      lines: [{ name: packageName('website-in-a-day'), detail: PLAN_LINE['website-in-a-day'] ?? '' }] }
  }
  if (!paymentIntent?.startsWith('pi_') || !secret || !process.env.STRIPE_SECRET_KEY) return null
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
    const pi = await stripe.paymentIntents.retrieve(paymentIntent, { expand: ['customer'] })
    if (pi.client_secret !== secret) return null
    // Only fresh orders: the link in a browser's history shouldn't sign anyone in next month.
    if (Date.now() / 1000 - pi.created > 3 * 86400) return null
    const customer = pi.customer && typeof pi.customer !== 'string' && !pi.customer.deleted ? pi.customer : null
    const m = { ...(customer?.metadata ?? {}), ...(pi.metadata ?? {}) }
    const email = (pi.receipt_email || customer?.email || '').toLowerCase()
    if (!email) return null
    let pkg = m.tier ?? ''
    let lines: PaidOrder['lines'] = []
    if (pkg === 'addons') {
      const skus = (m.items ?? '').split(',').filter(s => lookup(s))
      pkg = addonPackage(skus)
      lines = skus.map(s => lookup(s)!).map(x => ({ name: x.name, detail: isKit(x) ? `Includes ${x.includes.map(s => lookup(s)?.name).join(', ')}` : x.detail, amount: x.fee * 100 }))
    } else if (pkg) {
      lines = [{ name: packageName(pkg), detail: PLAN_LINE[pkg] ?? '' }]
    }
    return {
      id: pi.id, email, name: m.fullName ?? '', company: m.businessName ?? '', pkg,
      title: packageName(pkg) || 'Your order', lines,
      amount: pi.amount_received || pi.amount, currency: pi.currency,
      succeeded: pi.status === 'succeeded' || pi.status === 'processing',
    }
  } catch (err) {
    console.error('Order lookup failed:', err)
    return null
  }
}
