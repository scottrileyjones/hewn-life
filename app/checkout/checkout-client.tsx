'use client'
import { useState, useEffect, useRef } from 'react'
import { CAL_URL } from '@/lib/cal'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import HewnLogo from '@/components/HewnLogo'
import { trackBeginCheckout, trackAddPaymentInfo } from '@/lib/gtm'
import { cartTotals, isKit, kitListPrice, lookup, type AddOn, type Kit } from '@/lib/addons'
import AgreementDoc from '@/components/agreements/AgreementDoc'
import SignatureBlocks from '@/components/agreements/SignatureBlocks'
import type { Doc } from '@/lib/agreements/templates'
import ProductGallery from '@/components/checkout/ProductGallery'
import { galleryFor, introFor } from '@/lib/gallery'
import { blackFriday, offerLive, money as usd } from '@/lib/offer'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const PRODUCT_META: Record<string, {
  color: string
  tagline: string
  chips: string[]
  highlights: string[]
  nextSteps: string[]
}> = {
  hewn: {
    color: '#1E3826',
    tagline: 'Your brand, built to last.',
    chips: ['No contract', '48hr kickoff', 'Cancel anytime'],
    highlights: [
      'Brand strategy, visual identity & style guide',
      'Custom website + SEO foundation',
      'Google Business Profile + local listings',
      'Monthly strategy call',
    ],
    nextSteps: [
      'Onboarding call booked within 48 hours',
      'Brand strategy & kickoff session',
      'First deliverables live within 30 days',
    ],
  },
  wrought: {
    color: '#1E3826',
    tagline: 'Your full marketing engine.',
    chips: ['No contract', '48hr kickoff', 'Cancel anytime'],
    highlights: [
      'Everything in Hewn',
      'Paid media management + sales funnels',
      'Marketing automation + CRM setup',
      'Booking, onboarding & retention systems',
    ],
    nextSteps: [
      'Onboarding call booked within 48 hours',
      'Full audit & strategy session week one',
      'Campaigns live within the first month',
    ],
  },
  forged: {
    color: '#1E3826',
    tagline: 'Your entire marketing team.',
    chips: ['All 9 pillars', 'Fractional CMO', 'Cancel anytime'],
    highlights: [
      'Everything in Wrought',
      'Review generation, UGC & referral program',
      'Monthly KPI dashboard + quarterly planning',
      'Weekly calls + Slack access (M–F)',
    ],
    nextSteps: [
      'Onboarding call booked within 48 hours',
      'Full system audit & roadmap built',
      'All nine pillars activated in month one',
    ],
  },
  addons: {
    color: '#1E3826',
    tagline: 'Picked off the shelf.',
    chips: ['Fixed price', 'Paid once', 'No contract'],
    highlights: [],
    nextSteps: [
      'Pay securely, once',
      'Your plan opens in your portal straight away',
      'Send your requirements and we start',
    ],
  },
  'website-in-a-day': {
    color: '#1E3826',
    tagline: 'Your website, live in a day.',
    chips: ['$999 flat', '24 hours', '100% yours'],
    highlights: [
      'Custom design from your brief — mobile & desktop',
      'Copy written from your brief',
      'Built, hosted and connected to your domain',
      'Contact or booking form',
      'SEO-ready technical foundation',
    ],
    nextSteps: [
      'Brief received — we start as soon as payment clears',
      'Within 24 hours — your site is live',
      'Then — one round of edits, on us',
    ],
  },
}

interface ContactInfo {
  businessName: string
  fullName: string
  email: string
  phone: string
  notes: string
}

// ── Order Summary ─────────────────────────────────────

function OrderSummary({ name, price, billing, mode, tier, charge, lines = [], saved = 0, bf = false }: {
  name: string; price: number; billing: string; mode: string; tier: string; charge: Charge | null; lines?: (AddOn | Kit)[]; saved?: number; bf?: boolean
}) {
  const meta = PRODUCT_META[tier] ?? PRODUCT_META['website-in-a-day']
  const slides = galleryFor(tier, lines.map(l => l.sku))
  const intro = introFor(tier, lines.map(l => l.sku))

  return (
    <div className="rounded-[28px] overflow-hidden bg-white border border-ink/[0.08]">

      {/* Swipeable gallery of what the package delivers; plain accent bar if there's none */}
      {slides.length > 0
        ? <ProductGallery slides={slides} label={name} />
        : <div className="h-1" style={{ background: meta.color }} />}

      {/* Header: the plan's title at the top, or the classic label, tagline and chips */}
      {intro ? (
        <div className="px-7 pt-6 pb-5 border-b border-black/[0.06]">
          <h2 className="font-display font-medium tracking-[-0.035em] text-[34px] leading-[1.05] text-[#0D0D0D]">{name}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(bf || charge?.promo) && <span className="font-body text-sm text-ink/40 line-through tabular-nums">${price.toLocaleString()}</span>}
            <span className="rounded-full bg-forest px-3.5 py-1.5 font-body text-[15px] font-semibold leading-none tabular-nums text-white">
              {charge?.promo ? money(charge.amount, charge.currency) : bf ? usd(blackFriday.price) : `$${price.toLocaleString()}`}
              <span className="font-medium text-white/75">{mode === 'subscription' ? '/mo' : ' one time'}</span>
            </span>
            {bf && <span className="rounded-full bg-lime px-3 py-1.5 font-body text-[12px] font-semibold leading-none text-forest">Black Friday · {blackFriday.percentOff}% off</span>}
            {intro.badge && <span className="rounded-full bg-lime px-3 py-1.5 font-body text-[12px] font-semibold leading-none text-forest">{intro.badge}</span>}
          </div>
          <p className="mt-4 font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0D0D0D]">{intro.eyebrow}</p>
          <p className="mt-1.5 font-body text-[15px] leading-relaxed text-[#3D3A36]">{intro.blurb}</p>
        </div>
      ) : (
        <div className="px-7 pt-6 pb-5 border-b border-black/[0.06]">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-2" style={{ color: meta.color }}>
            {mode === 'subscription' ? 'Monthly plan' : 'One-time project'}
          </p>
          <h2 className="font-display font-medium tracking-[-0.03em] text-[22px] text-[#0D0D0D] leading-snug mb-3">
            {meta.tagline}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {meta.chips.map((chip, i) => (
              <span key={i}
                className="font-mono text-[8px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
                style={{ background: meta.color + '12', color: meta.color, border: `1px solid ${meta.color}30` }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* À la carte: the items in the cart */}
      {lines.length > 0 && (
        <div className="px-7 py-5 border-b border-black/[0.06]">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6B6560]/60 mb-4">Your order</p>
          <ul className="space-y-4">
            {lines.map(l => (
              <li key={l.sku} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-[#0D0D0D]">{l.name}</p>
                  <p className="mt-0.5 font-body text-xs leading-snug text-[#6B6560]">
                    {isKit(l) ? `Includes ${l.includes.map(s => lookup(s)?.name).join(', ')}` : l.detail}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  {isKit(l) && <p className="font-body text-xs text-[#6B6560] line-through">${kitListPrice(l).toLocaleString()}</p>}
                  <p className="font-body text-sm font-medium tabular-nums text-[#0D0D0D]">${l.fee.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
          {saved > 0 && (
            <p className="mt-4 rounded-full bg-lime px-3 py-1.5 text-center font-body text-xs font-medium text-forest">Kit pricing: you save ${saved.toLocaleString()}</p>
          )}
        </div>
      )}

      {/* What's included */}
      {meta.highlights.length > 0 && <div className="px-7 py-5 border-b border-black/[0.06]">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6B6560]/60 mb-4">What&apos;s included</p>
        <ul className="space-y-3">
          {meta.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-[2px] w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: meta.color + '18' }}>
                <svg className="w-2.5 h-2.5" style={{ color: meta.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-body text-sm text-[#3D3A36] leading-snug">{h}</span>
            </li>
          ))}
        </ul>
      </div>}

      {/* Price */}
      <div className="px-7 py-5 border-b border-black/[0.06]">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-[#6B6560]">
            {mode === 'subscription'
              ? billing === 'annual' ? 'Per month, billed yearly' : 'Billed monthly'
              : 'One-time fee'}
          </p>
          <div className="flex items-baseline gap-2">
            {(charge?.promo || bf) && <span className="font-body text-lg text-[#6B6560] line-through">${price.toLocaleString()}</span>}
            <span className="font-display font-medium tracking-[-0.03em] text-[38px] text-[#0D0D0D] leading-none">
              {charge?.promo ? money(charge.amount, charge.currency) : bf ? usd(blackFriday.price) : `$${price.toLocaleString()}`}
            </span>
            {mode === 'subscription' && (
              <span className="font-body text-sm text-[#6B6560]">/mo</span>
            )}
          </div>
        </div>
        <p className="font-body text-xs text-[#6B6560]/60 mt-1 text-right">
          {mode === 'subscription' ? 'No long-term contract · cancel anytime' : 'No recurring charges'}
        </p>
        {bf && !charge?.promo && (
          <p className="mt-2 text-right font-body text-xs font-medium text-forest">Code {blackFriday.code} applied at payment: {blackFriday.percentOff}% off</p>
        )}
        {charge?.promo && (
          <p className="mt-2 text-right font-body text-xs font-medium" style={{ color: meta.color }}>
            Code {charge.promo.code} applied: {money(charge.promo.off, charge.currency)} off
          </p>
        )}
      </div>

      {/* What happens next */}
      <div className="px-7 py-5 border-b border-black/[0.06]">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6B6560]/60 mb-4">What happens next</p>
        <ol className="space-y-3">
          {meta.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold mt-[1px] text-white"
                style={{ background: meta.color }}>
                {i + 1}
              </span>
              <span className="font-body text-sm text-[#3D3A36] leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Trust strip */}
      <div className="px-7 py-4 bg-bone flex items-center gap-5 flex-wrap">
        {[
          { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Stripe secured' },
          { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: mode === 'subscription' ? 'Cancel online anytime' : 'One round of edits included' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#6B6560]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6B6560]/50">{item.text}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

// ── Payment form ──────────────────────────────────────

/** What Stripe will actually charge, from the price itself. */
type Charge = { amount: number; currency: string; interval: string | null; intervalCount: number; original?: number; promo?: { code: string; off: number } }

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100)

/** The automatic-renewal disclosure, stated next to the button that agrees to it. */
function renewalTerms(c: Charge, fallbackDollars: number, mode: string) {
  if (mode !== 'subscription') {
    const amt = c.amount ? money(c.amount, c.currency) : `$${fallbackDollars.toLocaleString()}`
    return `You’ll be charged ${amt} once, plus any applicable tax. No recurring charges.`
  }
  const amt = money(c.amount, c.currency)
  const every = c.intervalCount > 1 ? `every ${c.intervalCount} ${c.interval}s` : c.interval === 'year' ? 'every year' : 'every month'
  return `You’ll be charged ${amt} today and ${amt} ${every} after that, plus any applicable tax, until you cancel. Your plan renews automatically. Cancel anytime at hewn.life/cancel; it takes effect at the end of the period you’ve paid for.`
}

function PaymentForm({ color, order, charge }: {
  color: string
  order: { name: string; price: number; tier: string; mode: string }
  charge: Charge | null
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !agreed) return
    setLoading(true)
    setError('')
    // Pass order details to /thank-you so it can fire the GA4 purchase
    // conversion. Stripe appends payment_intent & redirect_status itself.
    const returnUrl = new URL('/thank-you', window.location.origin)
    returnUrl.searchParams.set('value', String(charge?.amount ? charge.amount / 100 : order.price))
    if (order.name) returnUrl.searchParams.set('item_name', order.name)
    if (order.tier) returnUrl.searchParams.set('item_id', order.tier)
    returnUrl.searchParams.set('mode', order.mode)
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl.toString() },
    })
    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: { type: 'tabs', defaultCollapsed: false } }} />

      {error && (
        <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="rounded-xl border border-black/[0.08] bg-bone px-4 py-3.5">
        <p className="font-body text-[13px] leading-relaxed text-[#3D3A36]">
          {renewalTerms(charge ?? { amount: 0, currency: 'usd', interval: 'month', intervalCount: 1 }, order.price, order.mode)}
        </p>
        <label className="mt-3 flex items-start gap-2.5 font-body text-[13px] leading-relaxed text-[#3D3A36]">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest" />
          <span>
            I agree to the <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Terms of Service</a>
            {order.mode === 'subscription' ? ', including automatic renewal,' : ''} and the <a href="/legal/refund" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Refunds &amp; Cancellations</a> policy, and I’ve read the <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Privacy Policy</a>.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe || !elements || !agreed}
        className="flex items-center justify-center gap-2 w-full text-white font-body font-semibold text-[15px] px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
        style={{ background: color }}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing…
          </>
        ) : (
          order.mode === 'subscription' ? 'Subscribe and pay' : 'Complete payment'
        )}
      </button>

      <p className="text-center font-body text-xs text-[#6B6560]/50">
        Encrypted by Stripe. Your card never touches our servers.
      </p>
    </form>
  )
}

// ── Main checkout ─────────────────────────────────────

export default function CheckoutClient() {
  const params = useSearchParams()
  const priceId = params.get('priceId') ?? ''
  // À la carte: ?items=gbp,reviews. Names and prices come from the catalog, not the link.
  const skus = (params.get('items') ?? '').split(',').filter(Boolean)
  const cart = cartTotals(skus)
  const isCart = cart.lines.length > 0
  const mode = isCart ? 'payment' : (params.get('mode') ?? 'subscription') as 'subscription' | 'payment'
  const name = isCart ? (cart.lines.length === 1 ? cart.lines[0].name : 'Hewn Life add-ons') : params.get('name') ?? ''
  const price = isCart ? cart.total : Number(params.get('price') ?? '0')
  const billing = params.get('billing') ?? 'monthly'
  const tier = isCart ? 'addons' : params.get('tier') ?? ''
  // Set by a growth-plan page, so the purchase is credited to that lead in the CRM.
  const planRef = (params.get('ref') ?? '').replace(/[^a-f0-9]/g, '').slice(0, 32)

  const meta = PRODUCT_META[tier] ?? PRODUCT_META['website-in-a-day']

  const [step, setStep] = useState<'info' | 'sign' | 'payment'>('info')
  // Signed earlier (e.g. an agreement from HQ, then its pay link): no second signature needed.
  const presigned = (params.get('agreement') ?? '').match(/^rec[A-Za-z0-9]{14}$/)?.[0] ?? ''
  const [agreementId, setAgreementId] = useState(presigned)
  const [agreement, setAgreement] = useState<{ doc: Doc; hash: string; hewn?: { name: string; title: string } } | null>(null)
  const [signer, setSigner] = useState({ legalName: '', title: 'Owner', address: '', signature: '', consent: false, authority: false })
  // Only monthly plans are signed (Master Services Agreement); one-time orders accept the Terms at payment.
  const needsSign = mode === 'subscription' && !presigned
  const stepLabels = needsSign ? ['Your details', 'Review & sign', 'Payment'] : ['Your details', 'Payment']
  const stepIndex = step === 'info' ? 0 : step === 'sign' ? 1 : stepLabels.length - 1
  const [clientSecret, setClientSecret] = useState('')
  const [charge, setCharge] = useState<Charge | null>(null)
  // Orders that start from a brief arrive with the contact details already filled in.
  const [contact, setContact] = useState<ContactInfo>({
    businessName: params.get('businessName') ?? '',
    fullName: params.get('fullName') ?? '',
    email: params.get('email') ?? '',
    phone: params.get('phone') ?? '',
    notes: '',
  })
  // Beta testers can arrive with ?promo=BETA250 already in the link.
  // A Black Friday link opened after the offer ends checks out at the normal price.
  const [promoCode, setPromoCode] = useState(() => {
    const code = (params.get('promo') ?? '').toUpperCase()
    return code === blackFriday.code && !offerLive() ? '' : code
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.classList.add('checkout-mode')
    return () => document.body.classList.remove('checkout-mode')
  }, [])

  // GA4 ecommerce funnel: begin_checkout when a valid plan loads,
  // add_payment_info when the payment step is reached.
  const items = isCart
    ? cart.lines.map(l => ({ item_id: l.sku, item_name: l.name, price: l.fee, quantity: 1 }))
    : [{ item_id: tier || 'website-in-a-day', item_name: name, price, quantity: 1 }]
  const beganCheckout = useRef(false)
  useEffect(() => {
    if (beganCheckout.current || (!priceId && !isCart) || !name) return
    beganCheckout.current = true
    trackBeginCheckout(price, items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceId, name])

  useEffect(() => {
    if (step === 'payment') trackAddPaymentInfo(price, items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const orderBody = () => ({
    ...(isCart ? { items: cart.lines.map(l => l.sku) } : { priceId }),
    ...(mode === 'payment' && promoCode.trim() ? { promoCode: promoCode.trim() } : {}),
  })
  const signerBody = () => ({
    email: contact.email, fullName: signer.signature.trim() || contact.fullName, businessName: contact.businessName,
    legalName: signer.legalName.trim() || contact.businessName, title: signer.title, address: signer.address,
  })
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // The agreement names the signer, their title, entity and address, so it is re-filled as they type;
  // they always sign the exact text on screen.
  useEffect(() => {
    if (step !== 'sign') return
    let live = true
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/checkout/agreement', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'preview', ...orderBody(), ...signerBody() }),
        })
        const out = await res.json() as { doc?: Doc; hash?: string }
        if (live && out.doc && out.hash) setAgreement(ag => ({ doc: out.doc!, hash: out.hash!, hewn: ag?.hewn }))
      } catch { /* keep the last version; signing re-fills it anyway */ }
    }, 500)
    return () => { live = false; clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, signer.legalName, signer.title, signer.address, signer.signature])

  // Step 1 → 2: load their filled-in agreement to read and sign.
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!needsSign) return createIntent(presigned)
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/agreement', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preview', ...orderBody(), ...signerBody(), fullName: contact.fullName }),
      })
      const out = await res.json() as { doc?: Doc; hash?: string; hewn?: { name: string; title: string }; error?: string }
      if (!res.ok || !out.doc || !out.hash) throw new Error(out.error || 'We couldn’t load your agreement. Try again.')
      setAgreement({ doc: out.doc, hash: out.hash, hewn: out.hewn })
      setSigner(sg => ({ ...sg, legalName: sg.legalName || contact.businessName, signature: sg.signature || contact.fullName }))
      setStep('sign'); top()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 → 3: sign, then set up the payment against the signed agreement.
  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreement) return
    setLoading(true)
    setError('')
    try {
      // Re-fill the agreement with exactly what's in the form now, show it, and sign that text.
      // (Only their own details can differ from what's on screen; the order terms come from the server.)
      const fresh = await fetch('/api/checkout/agreement', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preview', ...orderBody(), ...signerBody() }),
      }).then(r => r.json() as Promise<{ doc?: Doc; hash?: string; error?: string }>)
      if (!fresh.doc || !fresh.hash) throw new Error(fresh.error || 'We couldn’t load your agreement. Try again.')
      setAgreement(ag => ({ doc: fresh.doc!, hash: fresh.hash!, hewn: ag?.hewn }))
      const res = await fetch('/api/checkout/agreement', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign', hash: fresh.hash, consent: signer.consent, authority: signer.authority, ...orderBody(), ...signerBody() }),
      })
      const out = await res.json() as { agreementId?: string; doc?: Doc; hash?: string; error?: string }
      if (out.doc && out.hash) setAgreement(ag => ({ doc: out.doc!, hash: out.hash!, hewn: ag?.hewn }))
      if (!res.ok || !out.agreementId) throw new Error(out.error || 'We couldn’t sign. Try again.')
      setAgreementId(out.agreementId)
      await createIntent(out.agreementId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const createIntent = async (signedId: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isCart ? { items: cart.lines.map(l => l.sku) } : { priceId }), mode,
          email: contact.email, ...(signedId ? { agreementId: signedId } : {}),
          ...(mode === 'payment' && promoCode.trim() ? { promoCode: promoCode.trim() } : {}),
          metadata: { businessName: contact.businessName, fullName: contact.fullName, phone: contact.phone, notes: contact.notes, ...(tier ? { tier } : {}), ...(planRef ? { planToken: planRef } : {}) },
        }),
      })
      const { clientSecret: secret, charge: c, error: apiError } = await res.json() as { clientSecret?: string; charge?: Charge; error?: string }
      if (apiError) throw new Error(apiError)
      if (secret) { setClientSecret(secret); if (c) setCharge(c); setStep('payment'); top() }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: meta.color,
      colorBackground: '#ffffff',
      colorText: '#0D0D0D',
      colorDanger: '#ef4444',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      borderRadius: '12px',
      spacingUnit: '5px',
    },
    rules: {
      '.Input': { border: '1px solid rgba(0,0,0,0.15)', padding: '12px 16px', fontSize: '14px' },
      '.Input:focus': { border: `1px solid ${meta.color}`, boxShadow: `0 0 0 3px ${meta.color}20`, outline: 'none' },
      '.Label': { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0D0D0D', marginBottom: '8px' },
      '.Tab': { border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px' },
      '.Tab--selected': { border: `1px solid ${meta.color}`, boxShadow: 'none' },
      '.Tab:hover': { border: '1px solid rgba(0,0,0,0.25)' },
    },
  }

  if ((!priceId && !isCart) || !name) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-body text-[#6B6560] mb-6">No plan selected.</p>
          <a href="/pricing" className="font-body text-sm font-medium text-forest hover:underline">← Back to Pricing</a>
        </div>
      </div>
    )
  }

  const inputClass = 'w-full border border-black/[0.12] rounded-[14px] px-4 py-3.5 font-body text-sm text-[#0D0D0D] placeholder:text-[#6B6560]/40 focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all'
  const labelClass = 'block font-body text-xs font-medium text-[#0D0D0D] uppercase tracking-[0.12em] mb-2'

  return (
    <div className="min-h-screen bg-bone">

      {/* Checkout header with real logo */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <HewnLogo dark size="sm" />
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <div className="w-5 h-px bg-black/15" />}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300"
                    style={i <= stepIndex ? { background: meta.color, color: '#fff' } : { background: 'rgba(0,0,0,0.07)', color: '#6B6560' }}>
                    {i < stepIndex
                      ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : i + 1}
                  </div>
                  <span className={`font-body text-xs hidden sm:block ${i === stepIndex ? 'text-[#0D0D0D] font-medium' : 'text-[#6B6560]'}`}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start">

          {/* Left: form */}
          <div>
            <button
              onClick={() => step === 'payment' ? setStep(needsSign && agreement ? 'sign' : 'info') : step === 'sign' ? setStep('info') : window.history.back()}
              className="inline-flex items-center gap-1.5 font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {step === 'info' ? 'Back to pricing' : 'Back'}
            </button>

            {step === 'info' ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step 1 of {stepLabels.length}</p>
                <h1 className="font-display font-medium tracking-[-0.03em] text-[38px] md:text-[50px] text-[#0D0D0D] mb-3 leading-[1.06]">
                  You&apos;re almost in.
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-10 leading-relaxed max-w-md">
                  Fill in your details so we can hit the ground running the moment payment clears.
                </p>

                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Business Name <span style={{ color: meta.color }}>*</span></label>
                      <input
                        required
                        value={contact.businessName}
                        onChange={e => setContact(c => ({ ...c, businessName: e.target.value }))}
                        type="text"
                        placeholder="Acme Co."
                        className={inputClass}
                        style={{ '--tw-ring-color': meta.color + '30' } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Your Name <span style={{ color: meta.color }}>*</span></label>
                      <input required value={contact.fullName} onChange={e => setContact(c => ({ ...c, fullName: e.target.value }))} type="text" placeholder="Jane Smith" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Email <span style={{ color: meta.color }}>*</span></label>
                      <input required value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} type="email" placeholder="jane@acme.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone <span className="font-normal normal-case tracking-normal text-[#6B6560]/50">(optional)</span></label>
                      <input value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} type="tel" placeholder="+1 (555) 000-0000" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Anything we should know? <span className="font-normal normal-case tracking-normal text-[#6B6560]/50">(optional)</span></label>
                    <textarea
                      value={contact.notes}
                      onChange={e => setContact(c => ({ ...c, notes: e.target.value }))}
                      rows={3}
                      placeholder="Goals, timeline, current situation — anything useful for your kickoff."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {mode === 'payment' && (
                    <div className="sm:max-w-[50%]">
                      <label className={labelClass}>Promo code <span className="font-normal normal-case tracking-normal text-[#6B6560]/50">(optional)</span></label>
                      <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} type="text" autoComplete="off" placeholder="Enter code" className={`${inputClass} uppercase`} />
                    </div>
                  )}

                  {error && <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full text-white font-body font-semibold text-[15px] px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: meta.color }}
                  >
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Setting up…</>
                    ) : (
                      <>{needsSign ? 'Continue to your agreement' : 'Continue to payment'} <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                    )}
                  </button>

                  <p className="text-center font-body text-xs text-[#6B6560]/50">
                    Have questions first?{' '}
                    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: meta.color }}>Book a free call</a>
                  </p>
                </form>
              </>
            ) : step === 'sign' && agreement ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step 2 of {stepLabels.length}</p>
                <h1 className="font-display font-medium tracking-[-0.03em] text-[38px] md:text-[50px] text-[#0D0D0D] mb-3 leading-[1.06]">
                  Review and sign.
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-8 leading-relaxed max-w-lg">
                  Your agreement, filled in for {contact.businessName || 'your business'}. Hewn Life has already signed. Read it through, sign below, and payment comes next.
                </p>

                <div className="relative rounded-[22px] border border-black/[0.08] bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B6560]">Your agreement</span>
                    <span className="flex items-center gap-1.5 font-body text-xs text-forest">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Signed by Hewn Life
                    </span>
                  </div>
                  <div className="max-h-[440px] overflow-y-auto px-5 py-6 sm:px-7" tabIndex={0} aria-label="Agreement text">
                    <AgreementDoc doc={agreement.doc} />
                    <SignatureBlocks
                      hewn={agreement.hewn ?? { name: 'Hewn Life', title: 'Authorized signatory' }}
                      client={signer.signature.trim() ? { name: signer.signature.trim(), title: signer.title } : null}
                      clientEntity={signer.legalName || contact.businessName} />
                  </div>
                </div>

                <form onSubmit={handleSign} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="legalName" className={labelClass}>Legal business name</label>
                      <input id="legalName" required value={signer.legalName} onChange={e => setSigner({ ...signer, legalName: e.target.value })} placeholder="e.g. Acme Plumbing LLC" className={inputClass} style={{ '--tw-ring-color': meta.color + '40' } as React.CSSProperties} />
                    </div>
                    <div>
                      <label htmlFor="signerTitle" className={labelClass}>Your title</label>
                      <input id="signerTitle" required value={signer.title} onChange={e => setSigner({ ...signer, title: e.target.value })} placeholder="Owner" className={inputClass} style={{ '--tw-ring-color': meta.color + '40' } as React.CSSProperties} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="noticeAddress" className={labelClass}>Business address <span className="normal-case tracking-normal text-[#6B6560]/60 font-normal">(optional, for notices)</span></label>
                    <input id="noticeAddress" value={signer.address} onChange={e => setSigner({ ...signer, address: e.target.value })} placeholder="Street, city, state ZIP" className={inputClass} style={{ '--tw-ring-color': meta.color + '40' } as React.CSSProperties} />
                  </div>

                  <div>
                    <label htmlFor="signature" className={labelClass}>Type your full name to sign</label>
                    <input id="signature" required value={signer.signature} onChange={e => setSigner({ ...signer, signature: e.target.value })} autoComplete="name"
                      className="w-full border-b-2 border-black/20 bg-transparent px-1 pb-2 pt-1 font-accent text-[32px] italic text-forest focus:border-forest focus:outline-none" />
                    <p className="mt-2 font-body text-xs text-[#6B6560]">{signer.signature.trim() ? `${signer.signature.trim()}, ${signer.title || 'Owner'} · ${signer.legalName || contact.businessName}` : ' '}</p>
                  </div>

                  <label className="flex items-start gap-3">
                    <input type="checkbox" checked={signer.consent} onChange={e => setSigner({ ...signer, consent: e.target.checked })} required className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest" />
                    <span className="font-body text-sm leading-relaxed text-[#3D3A36]">I’ve read this agreement and agree to sign it electronically. My typed name is my signature.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" checked={signer.authority} onChange={e => setSigner({ ...signer, authority: e.target.checked })} required className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest" />
                    <span className="font-body text-sm leading-relaxed text-[#3D3A36]">I have authority to sign for {signer.legalName || contact.businessName || 'my business'}.</span>
                  </label>

                  {error && <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">{error}</div>}

                  <button type="submit" disabled={loading || !signer.consent || !signer.authority || !signer.signature.trim()}
                    className="flex items-center justify-center gap-2 w-full text-white font-body font-semibold text-[15px] px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: meta.color }}>
                    {loading ? 'Signing…' : <>Sign and continue to payment <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
                  </button>
                  <p className="text-center font-body text-xs text-[#6B6560]/70">Signed under the federal ESIGN Act. Your countersigned copy is emailed to you and saved in your portal.</p>
                </form>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step {stepLabels.length} of {stepLabels.length}</p>
                <h1 className="font-display font-medium tracking-[-0.03em] text-[38px] md:text-[50px] text-[#0D0D0D] mb-3 leading-[1.06]">
                  How would you<br />like to pay?
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-10">
                  Paying as <span className="text-[#0D0D0D] font-medium">{contact.email}</span>
                </p>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <PaymentForm color={meta.color} order={{ name, price, tier, mode }} charge={charge} />
                  </Elements>
                )}
              </>
            )}
          </div>

          {/* Right: sticky order summary */}
          <div className="lg:sticky lg:top-8 order-first lg:order-last">
            <OrderSummary name={name} price={price} billing={billing} mode={mode} tier={tier} charge={step === 'payment' ? charge : null} lines={cart.lines} saved={cart.saved} bf={tier === 'website-in-a-day' && promoCode === blackFriday.code} />
          </div>

        </div>
      </div>
    </div>
  )
}
