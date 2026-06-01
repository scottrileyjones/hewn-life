'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const PRODUCT_META: Record<string, { color: string; highlights: string[] }> = {
  hewn: {
    color: '#B87A40',
    highlights: [
      'Brand strategy, visual identity & style guide',
      'Custom website + SEO foundation',
      'Google Business Profile + local listings',
      'Monthly strategy call',
    ],
  },
  wrought: {
    color: '#9BA4AE',
    highlights: [
      'Everything in Hewn',
      'Paid media management + sales funnels',
      'Marketing automation + CRM setup',
      'Booking, onboarding & retention systems',
    ],
  },
  forged: {
    color: '#C9A84C',
    highlights: [
      'Everything in Wrought',
      'Review generation, UGC & referral program',
      'Monthly KPI dashboard + quarterly growth planning',
      'Weekly calls + Slack access (M–F)',
    ],
  },
  'website-in-a-week': {
    color: '#6BAD3D',
    highlights: [
      'Custom design — mobile & desktop',
      'Conversion-focused copywriting',
      'Full development & hosting',
      'SEO-ready foundation',
      'Live in 5 business days',
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

function OrderSummary({
  name,
  price,
  billing,
  mode,
  tier,
}: {
  name: string
  price: number
  billing: string
  mode: string
  tier: string
}) {
  const meta = PRODUCT_META[tier] ?? PRODUCT_META['website-in-a-week']
  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
      <div className="h-1.5" style={{ background: meta.color }} />
      <div className="p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6560] mb-1">
          Your Order
        </p>
        <p className="font-display font-bold text-[26px] text-[#0D0D0D] leading-tight mb-1">
          {name}
        </p>
        <p className="font-body text-xs text-[#6B6560] mb-6">
          {mode === 'subscription' ? `${billing} billing` : 'One-time payment'}
        </p>

        <ul className="space-y-2.5 mb-6 pb-6 border-b border-black/[0.06]">
          {meta.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: meta.color + '22' }}
              >
                <svg
                  className="w-2.5 h-2.5"
                  style={{ color: meta.color }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-body text-xs text-[#6B6560]">{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-between mb-1">
          <span className="font-body text-sm text-[#6B6560]">
            {mode === 'subscription'
              ? billing === 'annual'
                ? 'Annual total'
                : 'Monthly'
              : 'Project fee'}
          </span>
          <span className="font-display font-bold text-[32px] text-[#0D0D0D] leading-none">
            ${price.toLocaleString()}
          </span>
        </div>
        {mode === 'subscription' && (
          <p className="text-right font-body text-xs text-[#6B6560]/60 mb-4">
            /{billing === 'annual' ? 'year' : 'month'}
          </p>
        )}

        <div className="pt-4 border-t border-black/[0.06] space-y-2.5 mt-2">
          {[
            {
              icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
              text: 'Secured by Stripe',
            },
            {
              icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
              text: 'Onboarding within 48 hours',
            },
            {
              icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              text: mode === 'subscription' ? 'Cancel anytime' : 'Satisfaction guaranteed',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-[#6BAD3D] flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="font-body text-xs text-[#6B6560]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentForm() {
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
      confirmParams: {
        return_url: `${window.location.origin}/thank-you`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'auto', googlePay: 'auto' },
        }}
      />

      {error && (
        <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="flex items-center justify-center gap-2 w-full bg-[#0D0D0D] text-white font-body font-semibold text-sm px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Complete Payment
          </>
        )}
      </button>

      <p className="text-center font-body text-xs text-[#6B6560]/60">
        Your card details are encrypted and never touch our servers.
      </p>
    </form>
  )
}

export default function CheckoutClient() {
  const params = useSearchParams()
  const priceId = params.get('priceId') ?? ''
  const mode = (params.get('mode') ?? 'subscription') as 'subscription' | 'payment'
  const name = params.get('name') ?? ''
  const price = Number(params.get('price') ?? '0')
  const billing = params.get('billing') ?? 'monthly'
  const tier = params.get('tier') ?? ''

  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [clientSecret, setClientSecret] = useState('')
  const [contact, setContact] = useState<ContactInfo>({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode,
          email: contact.email,
          metadata: {
            businessName: contact.businessName,
            fullName: contact.fullName,
            phone: contact.phone,
            notes: contact.notes,
          },
        }),
      })
      const { clientSecret: secret, error: apiError } = (await res.json()) as {
        clientSecret?: string
        error?: string
      }
      if (apiError) throw new Error(apiError)
      if (secret) {
        setClientSecret(secret)
        setStep('payment')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0D0D0D',
      colorBackground: '#ffffff',
      colorText: '#0D0D0D',
      colorDanger: '#ef4444',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      borderRadius: '12px',
      spacingUnit: '5px',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(0,0,0,0.15)',
        padding: '12px 16px',
        fontSize: '14px',
      },
      '.Input:focus': {
        border: '1px solid rgba(0,0,0,0.4)',
        boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
        outline: 'none',
      },
      '.Label': {
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: '500',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#0D0D0D',
        marginBottom: '8px',
      },
      '.Tab': {
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: '10px',
      },
      '.Tab--selected': {
        border: '1px solid rgba(0,0,0,0.4)',
        boxShadow: 'none',
      },
      '.Tab:hover': {
        border: '1px solid rgba(0,0,0,0.25)',
      },
    },
  }

  if (!priceId || !name) {
    return (
      <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-body text-[#6B6560] mb-6">No plan selected.</p>
          <Link
            href="/pricing"
            className="font-body text-sm font-medium text-[#6BAD3D] hover:underline"
          >
            ← Back to Pricing
          </Link>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-[#0D0D0D] placeholder:text-[#6B6560]/40 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/40 bg-white transition-all'
  const labelClass =
    'block font-body text-xs font-medium text-[#0D0D0D] uppercase tracking-[0.12em] mb-2'

  return (
    <div className="min-h-screen bg-[#F9F7F3] pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header row */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() =>
              step === 'payment' ? setStep('info') : window.history.back()
            }
            className="inline-flex items-center gap-1.5 font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {step === 'payment' ? 'Back to your info' : 'Back'}
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 ${
                step === 'info'
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-[#6BAD3D] text-white'
              }`}
            >
              {step === 'payment' ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                '1'
              )}
            </div>
            <div className="w-8 h-px bg-black/15" />
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 ${
                step === 'payment'
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-black/[0.07] text-[#6B6560]'
              }`}
            >
              2
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

          {/* Left: form */}
          <div>
            {step === 'info' ? (
              <>
                <h1 className="font-display font-bold text-[40px] md:text-[48px] text-[#0D0D0D] mb-2 leading-tight">
                  Tell us about<br />your business.
                </h1>
                <p className="font-body text-base text-[#6B6560] mb-10 leading-relaxed">
                  We&apos;ll use this to personalize your onboarding before you pay.
                </p>

                <form onSubmit={handleInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        Business Name <span className="text-[#6BAD3D]">*</span>
                      </label>
                      <input
                        required
                        value={contact.businessName}
                        onChange={e => setContact(c => ({ ...c, businessName: e.target.value }))}
                        type="text"
                        placeholder="Acme Co."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Your Name <span className="text-[#6BAD3D]">*</span>
                      </label>
                      <input
                        required
                        value={contact.fullName}
                        onChange={e => setContact(c => ({ ...c, fullName: e.target.value }))}
                        type="text"
                        placeholder="Jane Smith"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        Email <span className="text-[#6BAD3D]">*</span>
                      </label>
                      <input
                        required
                        value={contact.email}
                        onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                        type="email"
                        placeholder="jane@acme.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Phone{' '}
                        <span className="font-normal normal-case tracking-normal text-[#6B6560]/50">
                          (optional)
                        </span>
                      </label>
                      <input
                        value={contact.phone}
                        onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Anything we should know?{' '}
                      <span className="font-normal normal-case tracking-normal text-[#6B6560]/50">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={contact.notes}
                      onChange={e => setContact(c => ({ ...c, notes: e.target.value }))}
                      rows={4}
                      placeholder="Tell us about your business, goals, or anything that'll help us hit the ground running."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {error && (
                    <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-[#0D0D0D] text-white font-body font-semibold text-sm px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Setting up…
                      </>
                    ) : (
                      <>
                        Continue to Payment
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center font-body text-xs text-[#6B6560]/50">
                    Questions?{' '}
                    <Link href="/contact" className="text-[#6BAD3D] hover:underline">
                      Let&apos;s talk first
                    </Link>
                  </p>
                </form>
              </>
            ) : (
              <>
                <h1 className="font-display font-bold text-[40px] md:text-[48px] text-[#0D0D0D] mb-2 leading-tight">
                  Payment details.
                </h1>
                <p className="font-body text-base text-[#6B6560] mt-1 mb-10">
                  Paying as{' '}
                  <span className="text-[#0D0D0D] font-medium">{contact.email}</span>
                </p>

                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                  >
                    <PaymentForm />
                  </Elements>
                )}
              </>
            )}
          </div>

          {/* Right: sticky order summary */}
          <div className="lg:sticky lg:top-28 order-first lg:order-last">
            <OrderSummary
              name={name}
              price={price}
              billing={billing}
              mode={mode}
              tier={tier}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
