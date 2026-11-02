import { joinNotes } from '@/lib/checkout/notes'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { markPaid } from '@/lib/plans/flow'
import { provisionPortal } from '@/lib/portal/provision'
import { enroll, exitFlows } from '@/lib/flows/engine'
import { lookup } from '@/lib/addons'
import { addonPackage } from '@/lib/portal/onboarding'
import { notifyAddonOrder, notifyCheckoutAgreement } from '@/lib/portal/notify'
import { getAgreement, pdfName } from '@/lib/agreements/data'
import { signedPdf } from '@/lib/agreements/pdf'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // The plan token a growth-plan buy link put on the customer, so the sale is credited to that lead.
  const planToken = async (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null, own?: Stripe.Metadata | null) => {
    if (own?.planToken) return own.planToken
    if (typeof customer !== 'string') return undefined
    const c = await stripe.customers.retrieve(customer)
    return c.deleted ? undefined : c.metadata?.planToken
  }

  // Paying for anything ends the checkout reminders and the lead and win-back sequences.
  const converted = (email: string) => exitFlows(email, ['checkout_abandoned', 'lead_nurture', 'winback'], 'paid')

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Checkout completed:', {
      id: session.id,
      customer: session.customer,
      email: session.customer_email ?? session.customer_details?.email,
      amount: session.amount_total,
      mode: session.mode,
    })
    await markPaid(session.customer_email ?? session.customer_details?.email ?? '', {
      token: await planToken(session.customer, session.metadata),
      amount: session.amount_total ? session.amount_total / 100 : undefined,
    })
    await converted(session.customer_email ?? session.customer_details?.email ?? '')
  }

  // The agreement they signed at checkout: their countersigned copy, once paid.
  const signedCopy = async (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null, meta?: Stripe.Metadata | null) => {
    try {
      let id = meta?.agreementId
      if (!id && typeof customer === 'string') {
        const c = await stripe.customers.retrieve(customer)
        if (!c.deleted) id = c.metadata?.agreementId
      }
      const a = id ? await getAgreement(id) : null
      if (!a?.clientSig) return
      const bytes = await signedPdf(a)
      await notifyCheckoutAgreement({ title: a.title, clientEmail: a.clientEmail, signer: `${a.clientSig.name}, ${a.clientSig.title}`, company: a.company }, { filename: pdfName(a), content: Buffer.from(bytes).toString('base64') })
    } catch (err) { console.error('Signed copy email failed:', err) }
  }

  // A first purchase gets a client portal with its package's onboarding plan, and joins the lifecycle flows. Never fail the webhook over it.
  const portal = async (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null, email: string, meta?: Stripe.Metadata | null) => {
    try {
      let m = meta ?? {}
      if (!m.tier && typeof customer === 'string') {
        const c = await stripe.customers.retrieve(customer)
        if (!c.deleted) m = c.metadata ?? {}
      }
      await provisionPortal({ email, tier: m.tier, name: m.fullName, company: m.businessName })
      const person = { email, name: m.fullName, company: m.businessName, phone: m.phone }
      await enroll('onboarding', person)
      // Website in a Day buyers hear about monthly plans later; a monthly plan ends that.
      if (m.tier === 'website-in-a-day') await enroll('upsell', person)
      else await exitFlows(email, ['upsell', 'winback'], 'started a monthly plan')
    } catch (err) { console.error('Portal provisioning failed:', err) }
  }

  // Embedded checkout: subscriptions settle as paid invoices, one-time orders as payment intents.
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    await markPaid(invoice.customer_email ?? '', {
      token: await planToken(invoice.customer),
      amount: invoice.amount_paid ? invoice.amount_paid / 100 : undefined,
    })
    await converted(invoice.customer_email ?? '')
    if (invoice.billing_reason === 'subscription_create') { await portal(invoice.customer, invoice.customer_email ?? ''); await signedCopy(invoice.customer) }
  }
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    let email = pi.receipt_email ?? ''
    if (!email && typeof pi.customer === 'string') {
      const c = await stripe.customers.retrieve(pi.customer)
      if (!c.deleted) email = c.email ?? ''
    }
    // Subscription invoices also raise payment intents; invoice.paid credits those.
    await markPaid(email, { token: await planToken(pi.customer, pi.metadata), amount: pi.amount_received ? pi.amount_received / 100 : undefined })
    // Only our one-time checkout puts the tier on the payment intent; subscription payments are handled above.
    await converted(email)
    if (pi.metadata?.tier === 'addons') {
      // À la carte orders: a portal with the requirements for what they bought, and the order to us.
      const m = pi.metadata
      const skus = (m.items ?? '').split(',').filter(sku => lookup(sku))
      try {
        await provisionPortal({ email, tier: addonPackage(skus), name: m.fullName, company: m.businessName })
        await enroll('onboarding', { email, name: m.fullName, company: m.businessName, phone: m.phone })
      } catch (err) { console.error('Add-on portal failed:', err) }
      const items = skus.map(sku => lookup(sku)!).map(x => ({ name: x.name, detail: 'includes' in x ? `Includes ${x.includes.map(s => lookup(s)?.name).join(', ')}` : x.detail }))
      try { await notifyAddonOrder({ email, name: m.fullName, company: m.businessName, phone: m.phone, notes: joinNotes(m), items, amount: pi.amount_received }) } catch (err) { console.error('Add-on order notice failed:', err) }
    } else if (pi.metadata?.tier) await portal(pi.customer, email, pi.metadata)
    if (pi.metadata?.tier) await signedCopy(pi.customer, pi.metadata)
  }

  // A cancelled monthly plan joins the win-back flow.
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    if (typeof sub.customer === 'string') {
      const c = await stripe.customers.retrieve(sub.customer)
      if (!c.deleted && c.email) await enroll('winback', { email: c.email, name: c.metadata?.fullName, company: c.metadata?.businessName, phone: c.metadata?.phone })
    }
  }

  return NextResponse.json({ received: true })
}
