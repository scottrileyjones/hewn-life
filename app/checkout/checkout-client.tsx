'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import HewnLogo from '@/components/HewnLogo'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const PRODUCT_META: Record<string, {
  color: string
  tagline: string
  chips: string[]
  highlights: string[]
  nextSteps: string[]
}> = {
  hewn: {
    color: '#6BAD3D',
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
    color: '#8B5CF6',
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
    color: '#8B5CF6',
    tagline: 'Your entire marketing team.',
    chips: ['All 6 pillars', 'Fractional CMO', 'Cancel anytime'],
    highlights: [
      'Everything in Wrought',
      'Review generation, UGC & referral program',
      'Monthly KPI dashboard + quarterly planning',
      'Weekly calls + Slack access (M–F)',
    ],
    nextSteps: [
      'Onboarding call booked within 48 hours',
      'Full system audit & roadmap built',
      'All six pillars activated month one',
    ],
  },
  'website-in-a-week': {
    color: '#6BAD3D',
    tagline: 'Your website, live in 5 days.',
    chips: ['$1,000 flat', '5 days', '100% yours'],
    highlights: [
      'Custom design — mobile & desktop',
      'Conversion-focused copywriting',
      'Full development & hosting setup',
      'SEO-ready technical foundation',
      'Live in 5 business days',
    ],
    nextSteps: [
      'Day 1 — Kickoff call & structure built',
      'Day 2–4 — Design, copy & development',
      'Day 5 — Your site goes live',
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

function OrderSummary({ name, price, billing, mode, tier }: {
  name: string; price: number; billing: string; mode: string; tier: string
}) {
  const meta = PRODUCT_META[tier] ?? PRODUCT_META['website-in-a-week']

  return (
    <div className="rounded-3xl overflow-hidden bg-white border border-black/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">

      {/* Accent top bar */}
      <div className="h-1" style={{ background: meta.color }} />

      {/* Header */}
      <div className="px-7 pt-6 pb-5 border-b border-black/[0.06]">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-2" style={{ color: meta.color }}>
          {mode === 'subscription' ? 'Monthly plan' : 'One-time project'}
        </p>
        <h2 className="font-display font-bold text-[22px] text-[#0D0D0D] leading-snug mb-3">
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

      {/* What's included */}
      <div className="px-7 py-5 border-b border-black/[0.06]">
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
      </div>

      {/* Price */}
      <div className="px-7 py-5 border-b border-black/[0.06]">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-[#6B6560]">
            {mode === 'subscription'
              ? billing === 'annual' ? 'Billed annually' : 'Billed monthly'
              : 'One-time fee'}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-[38px] text-[#0D0D0D] leading-none">
              ${price.toLocaleString()}
            </span>
            {mode === 'subscription' && (
              <span className="font-body text-sm text-[#6B6560]">/{billing === 'annual' ? 'yr' : 'mo'}</span>
            )}
          </div>
        </div>
        <p className="font-body text-xs text-[#6B6560]/60 mt-1 text-right">
          {mode === 'subscription' ? 'No long-term contract · cancel anytime' : 'No recurring charges'}
        </p>
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
      <div className="px-7 py-4 bg-[#F9F7F3] flex items-center gap-5 flex-wrap">
        {[
          { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Stripe secured' },
          { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: mode === 'subscription' ? 'Cancel anytime' : 'Satisfaction guaranteed' },
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

function PaymentForm({ color, order }: {
  color: string
  order: { name: string; price: number; tier: string; mode: string }
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    // Pass order details to /thank-you so it can fire the GA4 purchase
    // conversion. Stripe appends payment_intent & redirect_status itself.
    const returnUrl = new URL('/thank-you', window.location.origin)
    returnUrl.searchParams.set('value', String(order.price))
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

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
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
          'Complete Payment'
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
  const mode = (params.get('mode') ?? 'subscription') as 'subscription' | 'payment'
  const name = params.get('name') ?? ''
  const price = Number(params.get('price') ?? '0')
  const billing = params.get('billing') ?? 'monthly'
  const tier = params.get('tier') ?? ''

  const meta = PRODUCT_META[tier] ?? PRODUCT_META['website-in-a-week']

  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [clientSecret, setClientSecret] = useState('')
  const [contact, setContact] = useState<ContactInfo>({ businessName: '', fullName: '', email: '', phone: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.classList.add('checkout-mode')
    return () => document.body.classList.remove('checkout-mode')
  }, [])

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId, mode,
          email: contact.email,
          metadata: { businessName: contact.businessName, fullName: contact.fullName, phone: contact.phone, notes: contact.notes },
        }),
      })
      const { clientSecret: secret, error: apiError } = await res.json() as { clientSecret?: string; error?: string }
      if (apiError) throw new Error(apiError)
      if (secret) { setClientSecret(secret); setStep('payment'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
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

  if (!priceId || !name) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-body text-[#6B6560] mb-6">No plan selected.</p>
          <a href="/pricing" className="font-body text-sm font-medium text-[#6BAD3D] hover:underline">← Back to Pricing</a>
        </div>
      </div>
    )
  }

  const inputClass = 'w-full border border-black/[0.12] rounded-xl px-4 py-3.5 font-body text-sm text-[#0D0D0D] placeholder:text-[#6B6560]/40 focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all'
  const labelClass = 'block font-body text-xs font-medium text-[#0D0D0D] uppercase tracking-[0.12em] mb-2'

  return (
    <div className="min-h-screen bg-[#F9F7F3]">

      {/* Checkout header with real logo */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <HewnLogo dark size="sm" />
          <div className="flex items-center gap-2">
            {['Contact info', 'Payment'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className="w-5 h-px bg-black/15" />}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300"
                    style={
                      (i === 0 && step === 'info') || (i === 1 && step === 'payment')
                        ? { background: meta.color, color: '#fff' }
                        : i === 0 && step === 'payment'
                          ? { background: meta.color, color: '#fff' }
                          : { background: 'rgba(0,0,0,0.07)', color: '#6B6560' }
                    }
                  >
                    {i === 0 && step === 'payment'
                      ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : i + 1}
                  </div>
                  <span className={`font-body text-xs hidden sm:block ${
                    (i === 0 && step === 'info') || (i === 1 && step === 'payment') ? 'text-[#0D0D0D] font-medium' : 'text-[#6B6560]'
                  }`}>{label}</span>
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
              onClick={() => step === 'payment' ? setStep('info') : window.history.back()}
              className="inline-flex items-center gap-1.5 font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {step === 'payment' ? 'Back' : 'Back to pricing'}
            </button>

            {step === 'info' ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step 1 of 2</p>
                <h1 className="font-display font-bold text-[38px] md:text-[50px] text-[#0D0D0D] mb-3 leading-[1.06]">
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
                      <>Continue to Payment <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                    )}
                  </button>

                  <p className="text-center font-body text-xs text-[#6B6560]/50">
                    Have questions first?{' '}
                    <a href="https://cal.com/scott-hewn/discovery" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: meta.color }}>Book a free call</a>
                  </p>
                </form>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step 2 of 2</p>
                <h1 className="font-display font-bold text-[38px] md:text-[50px] text-[#0D0D0D] mb-3 leading-[1.06]">
                  How would you<br />like to pay?
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-10">
                  Paying as <span className="text-[#0D0D0D] font-medium">{contact.email}</span>
                </p>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <PaymentForm color={meta.color} order={{ name, price, tier, mode }} />
                  </Elements>
                )}
              </>
            )}
          </div>

          {/* Right: sticky order summary */}
          <div className="lg:sticky lg:top-8 order-first lg:order-last">
            <OrderSummary name={name} price={price} billing={billing} mode={mode} tier={tier} />
          </div>

        </div>
      </div>
    </div>
  )
}
