'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import CalButton from '@/components/CalButton'

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

// ── Visual art per product ──────────────────────────────

function WebsiteArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 160" fill="none" className="w-full">
      {/* browser frame */}
      <rect x="20" y="10" width="280" height="140" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* chrome bar */}
      <rect x="20" y="10" width="280" height="32" rx="10" fill="rgba(255,255,255,0.07)" />
      <rect x="20" y="30" width="280" height="12" fill="rgba(255,255,255,0.07)" />
      {/* traffic lights */}
      <circle cx="40" cy="26" r="4" fill="rgba(255,255,255,0.15)" />
      <circle cx="54" cy="26" r="4" fill="rgba(255,255,255,0.15)" />
      <circle cx="68" cy="26" r="4" fill="rgba(255,255,255,0.15)" />
      {/* address bar */}
      <rect x="90" y="19" width="160" height="14" rx="4" fill="rgba(255,255,255,0.08)" />
      <circle cx="100" cy="26" r="3" fill={color} />
      <rect x="108" y="23" width="80" height="6" rx="2" fill={color + '80'} />
      {/* live badge */}
      <rect x="238" y="19" width="42" height="14" rx="4" fill={color + '30'} />
      <circle cx="248" cy="26" r="3" fill={color} />
      <rect x="254" y="23" width="22" height="6" rx="2" fill={color} />
      {/* page content */}
      <rect x="32" y="52" width="120" height="12" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="32" y="70" width="80" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="32" y="84" width="100" height="8" rx="2" fill="rgba(255,255,255,0.07)" />
      <rect x="32" y="98" width="60" height="8" rx="2" fill="rgba(255,255,255,0.07)" />
      <rect x="32" y="116" width="80" height="20" rx="10" fill={color} />
      {/* image placeholder */}
      <rect x="178" y="52" width="110" height="84" rx="6" fill="rgba(255,255,255,0.06)" />
      <rect x="200" y="76" width="66" height="36" rx="3" fill="rgba(255,255,255,0.08)" />
      {/* day progress dots */}
      {[0,1,2,3,4].map((i) => (
        <circle key={i} cx={220 + i * 12} cy={148} r={3} fill={i < 5 ? color : 'rgba(255,255,255,0.1)'} />
      ))}
      <rect x="208" y="145" width="60" height="1" rx="0.5" fill="rgba(255,255,255,0.1)" />
    </svg>
  )
}

function BrandArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 160" fill="none" className="w-full">
      {/* Large H mark */}
      <text x="30" y="130" fontFamily="serif" fontSize="120" fontWeight="700" fill="rgba(255,255,255,0.06)">H</text>
      {/* Color palette swatches */}
      <rect x="30" y="20" width="36" height="36" rx="6" fill={color} />
      <rect x="74" y="20" width="36" height="36" rx="6" fill="#0D0D0D" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <rect x="118" y="20" width="36" height="36" rx="6" fill="rgba(255,255,255,0.12)" />
      {/* Typography specimen */}
      <rect x="170" y="24" width="120" height="10" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="170" y="40" width="90" height="7" rx="2" fill="rgba(255,255,255,0.12)" />
      {/* Logo grid */}
      <rect x="30" y="72" width="50" height="50" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="55" cy="97" r="14" fill={color + '40'} stroke={color} strokeWidth="1.5" />
      <rect x="49" y="91" width="12" height="12" rx="2" fill={color} />
      {/* Style guide lines */}
      <rect x="96" y="72" width="194" height="6" rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x="96" y="84" width="150" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="96" width="170" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="108" width="120" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="120" width="60" height="18" rx="9" fill={color + '30'} stroke={color} strokeWidth="1" />
      <rect x="110" y="127" width="34" height="4" rx="2" fill={color} />
    </svg>
  )
}

function DashboardArt({ color }: { color: string }) {
  const bars = [45, 65, 52, 80, 70, 95]
  return (
    <svg viewBox="0 0 320 160" fill="none" className="w-full">
      {/* card bg */}
      <rect x="20" y="10" width="280" height="140" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* top metric */}
      <rect x="36" y="24" width="60" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="36" y="38" width="90" height="16" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="36" y="60" width="50" height="6" rx="2" fill={color + '80'} />
      {/* sparkline */}
      <polyline
        points="140,90 165,75 190,82 215,60 240,68 265,45 290,38"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <circle cx="290" cy="38" r="4" fill={color} />
      {/* bars */}
      {bars.map((h, i) => (
        <g key={i}>
          <rect
            x={36 + i * 38}
            y={158 - h * 0.55}
            width="22"
            height={h * 0.55}
            rx="4"
            fill={i === bars.length - 1 ? color : color + '30'}
          />
        </g>
      ))}
      {/* x axis */}
      <line x1="30" y1="158" x2="290" y2="158" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    </svg>
  )
}

// ── Order Summary ─────────────────────────────────────

function OrderSummary({ name, price, billing, mode, tier }: {
  name: string; price: number; billing: string; mode: string; tier: string
}) {
  const meta = PRODUCT_META[tier] ?? PRODUCT_META['website-in-a-week']
  const isWebsite = tier === 'website-in-a-week'
  const isForged = tier === 'forged'

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0D0D0D] shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

      {/* Visual product art */}
      <div className="relative px-6 pt-6 pb-0 overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${meta.color}18 0%, transparent 65%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}60, transparent)` }} />
        {isWebsite ? <WebsiteArt color={meta.color} /> : isForged ? <DashboardArt color={meta.color} /> : tier === 'hewn' ? <BrandArt color={meta.color} /> : <DashboardArt color={meta.color} />}
      </div>

      {/* Tagline + chips */}
      <div className="px-7 pt-5 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: meta.color }}>
          {isWebsite ? 'One-time project' : `Tier ${tier === 'hewn' ? '01' : tier === 'wrought' ? '02' : '03'}`}
        </p>
        <h2 className="font-display font-bold text-[26px] text-white leading-snug mb-4">
          {meta.tagline}
        </h2>
        <div className="flex flex-wrap gap-2">
          {meta.chips.map((chip, i) => (
            <span key={i} className="font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
              style={{ background: meta.color + '20', color: meta.color, border: `1px solid ${meta.color}40` }}>
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* What's included */}
      <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25 mb-4">What&apos;s included</p>
        <ul className="space-y-2.5">
          {meta.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 mt-[3px] w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: meta.color + '25' }}>
                <svg className="w-2.5 h-2.5" style={{ color: meta.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-body text-sm text-white/65 leading-snug">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1">
              {mode === 'subscription' ? (billing === 'annual' ? 'Annual total' : 'Monthly') : 'Project fee'}
            </p>
            <p className="font-body text-xs text-white/30">
              {mode === 'subscription' ? 'No long-term contract' : 'One-time · no recurring'}
            </p>
          </div>
          <div className="text-right">
            <span className="font-display font-bold text-[44px] text-white leading-none">
              ${price.toLocaleString()}
            </span>
            {mode === 'subscription' && (
              <span className="font-body text-sm text-white/35 ml-1">
                /{billing === 'annual' ? 'yr' : 'mo'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25 mb-4">What happens next</p>
        <ol className="space-y-3">
          {meta.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold mt-[1px]"
                style={{ background: meta.color + '20', color: meta.color, border: `1px solid ${meta.color}40` }}>
                {i + 1}
              </span>
              <span className="font-body text-sm text-white/55 leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Trust strip */}
      <div className="px-7 py-4">
        <div className="flex items-center gap-5 flex-wrap">
          {[
            { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Stripe secured' },
            { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: mode === 'subscription' ? 'Cancel anytime' : 'Guaranteed' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 flex-shrink-0" style={{ color: meta.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/25">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Payment form ──────────────────────────────────────

function PaymentForm({ color }: { color: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/thank-you` },
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
        className="flex items-center justify-center gap-2 w-full text-white font-body font-semibold text-sm px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
          <>
            <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Complete Payment
          </>
        )}
      </button>

      <p className="text-center font-body text-xs text-[#6B6560]/60">
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

  // Hide site nav & footer at checkout
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
      <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-body text-[#6B6560] mb-6">No plan selected.</p>
          <a href="/pricing" className="font-body text-sm font-medium text-[#6BAD3D] hover:underline">← Back to Pricing</a>
        </div>
      </div>
    )
  }

  const inputClass = 'w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-[#0D0D0D] placeholder:text-[#6B6560]/40 focus:outline-none focus:ring-2 focus:border-black/40 bg-white transition-all'
  const labelClass = 'block font-body text-xs font-medium text-[#0D0D0D] uppercase tracking-[0.12em] mb-2'

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      {/* Slim checkout header */}
      <div className="border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-[18px] text-[#0D0D0D] tracking-tight">
            hewn<span style={{ color: meta.color }}>life</span>
          </a>
          <div className="flex items-center gap-2">
            {['Your info', 'Payment'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className="w-6 h-px bg-black/15" />}
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                    (i === 0 && step === 'info') || (i === 1 && step === 'payment')
                      ? 'text-white'
                      : i === 0 && step === 'payment'
                        ? 'text-white'
                        : 'bg-black/[0.07] text-[#6B6560]'
                  }`}
                    style={(i === 0 && step === 'info') || (i === 1 && step === 'payment') ? { background: meta.color } : i === 0 && step === 'payment' ? { background: meta.color } : {}}
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

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">

          {/* Left: form */}
          <div>
            <button
              onClick={() => step === 'payment' ? setStep('info') : window.history.back()}
              className="inline-flex items-center gap-1.5 font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {step === 'payment' ? 'Back to your info' : 'Back'}
            </button>

            {step === 'info' ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step 1 of 2</p>
                <h1 className="font-display font-bold text-[40px] md:text-[52px] text-[#0D0D0D] mb-3 leading-[1.05]">
                  Tell us about<br />your business.
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-10 leading-relaxed">
                  We use this to personalize your onboarding before a single dollar changes hands.
                </p>

                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Business Name <span style={{ color: meta.color }}>*</span></label>
                      <input required value={contact.businessName} onChange={e => setContact(c => ({ ...c, businessName: e.target.value }))} type="text" placeholder="Acme Co." className={inputClass} style={{ '--tw-ring-color': meta.color + '30' } as React.CSSProperties} />
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
                    <label className={labelClass}>What should we know going in? <span className="font-normal normal-case tracking-normal text-[#6B6560]/50">(optional)</span></label>
                    <textarea value={contact.notes} onChange={e => setContact(c => ({ ...c, notes: e.target.value }))} rows={4} placeholder="Your goals, current situation, anything that'll help us show up ready on day one." className={`${inputClass} resize-none`} />
                  </div>

                  {error && <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full text-white font-body font-semibold text-sm px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90" style={{ background: meta.color }}>
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Setting up…</>
                    ) : (
                      <>Continue to Payment <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                    )}
                  </button>

                  <p className="text-center font-body text-xs text-[#6B6560]/50">
                    Have questions first?{' '}
                    <CalButton className="hover:underline" style={{ color: meta.color }}>Book a free call</CalButton>
                  </p>
                </form>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: meta.color }}>Step 2 of 2 — Almost there</p>
                <h1 className="font-display font-bold text-[40px] md:text-[52px] text-[#0D0D0D] mb-3 leading-[1.05]">
                  How would you<br />like to pay?
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-10">
                  Paying as <span className="text-[#0D0D0D] font-medium">{contact.email}</span>
                </p>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <PaymentForm color={meta.color} />
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
