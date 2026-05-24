'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

const tierDetails: Record<string, { highlights: string[]; accentColor: string }> = {
  bronze: {
    accentColor: '#B87A40',
    highlights: ['Brand Strategy + Full Visual Identity', 'Custom Website (up to 5 pages)', 'SEO Foundation & Google Business Profile', 'Monthly Strategy Call (30 min)'],
  },
  silver: {
    accentColor: '#9BA4AE',
    highlights: ['Everything in Bronze', 'Paid Media Management (1 platform)', 'CRM + Full Marketing Automation', '60-min Monthly Call + Weekly Updates'],
  },
  gold: {
    accentColor: '#C9A84C',
    highlights: ['Everything in Silver', 'All Paid Media Platforms', 'Reputation, UGC & Referral Systems', 'Fractional CMO + Quarterly Planning'],
  },
}

export default function CheckoutClient() {
  const params = useSearchParams()
  const type = params.get('type') ?? 'plan'
  const tier = params.get('tier') ?? ''
  const billing = params.get('billing') ?? 'monthly'
  const price = params.get('price') ?? ''
  const name = params.get('name') ?? ''

  const displayName = type === 'plan' ? `${name} Plan` : name
  const priceNum = Number(price)
  const tierInfo = tierDetails[tier] ?? null
  const accentColor = tierInfo?.accentColor ?? '#7CB550'

  const [form, setForm] = useState({ businessName: '', fullName: '', email: '', phone: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: replace with Stripe checkout redirect
    setSubmitted(true)
  }

  if (!price || !name) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-body text-slate mb-6">No plan selected.</p>
          <Link href="/pricing" className="font-body text-sm font-medium text-ember hover:underline">← Back to Pricing</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-moss/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="font-display font-bold text-[36px] text-ink mb-4">You&apos;re almost there.</h1>
          <p className="font-body text-base text-slate mb-8">Redirecting you to secure checkout via Stripe…</p>
          <p className="font-body text-xs text-slate/60">
            Not redirected? <Link href="/contact" className="text-ember hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bone pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <Link href="/pricing" className="inline-flex items-center gap-1.5 font-body text-sm text-slate hover:text-ink transition-colors mb-10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Pricing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Form */}
          <div>
            <h1 className="font-display font-bold text-[40px] text-ink mb-2">Complete your order</h1>
            <p className="font-body text-base text-slate mb-10">Tell us about your business and we&apos;ll get everything ready before Stripe checkout.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-xs font-medium text-ink uppercase tracking-[0.12em] mb-2">Business Name <span className="text-ember">*</span></label>
                  <input required value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} type="text" placeholder="Acme Co." className="w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white" />
                </div>
                <div>
                  <label className="block font-body text-xs font-medium text-ink uppercase tracking-[0.12em] mb-2">Your Name <span className="text-ember">*</span></label>
                  <input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} type="text" placeholder="Jane Smith" className="w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-xs font-medium text-ink uppercase tracking-[0.12em] mb-2">Email <span className="text-ember">*</span></label>
                  <input required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="jane@acme.com" className="w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white" />
                </div>
                <div>
                  <label className="block font-body text-xs font-medium text-ink uppercase tracking-[0.12em] mb-2">Phone <span className="text-slate/50 font-normal normal-case tracking-normal">(optional)</span></label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" placeholder="+1 (555) 000-0000" className="w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white" />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-ink uppercase tracking-[0.12em] mb-2">
                  Anything we should know? <span className="text-slate/50 font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={4} placeholder="Tell us about your business, your goals, or any context that will help us hit the ground running." className="w-full border border-black/15 rounded-xl px-4 py-3.5 font-body text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white resize-none" />
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 w-full font-body font-semibold text-sm px-8 py-4 rounded-full text-white transition-all duration-300 hover:brightness-110" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` }}>
                <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Continue to Secure Payment
              </button>

              <p className="text-center font-body text-xs text-slate/60">
                You&apos;ll be redirected to Stripe to complete payment. Questions?{' '}
                <Link href="/contact" className="text-ember hover:underline">Book a free call</Link> instead.
              </p>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />
              <div className="p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate mb-1">Your Order</p>
                <p className="font-display font-bold text-[26px] text-ink leading-tight mb-1">{displayName}</p>
                {type === 'plan' && (
                  <p className="font-body text-xs text-slate capitalize mb-6">{billing} billing</p>
                )}
                {type === 'service' && (
                  <p className="font-body text-xs text-slate mb-6">One-time project</p>
                )}

                {tierInfo && (
                  <ul className="space-y-2 mb-6 pb-6 border-b border-black/[0.06]">
                    {tierInfo.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span className="font-body text-xs text-slate">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-end justify-between mb-1">
                  <span className="font-body text-sm text-slate">{type === 'plan' ? (billing === 'annual' ? 'Annual total' : 'Monthly total') : 'Project fee'}</span>
                  <span className="font-display font-bold text-[28px] text-ink leading-none">${priceNum.toLocaleString()}</span>
                </div>
                {type === 'plan' && (
                  <p className="text-right font-body text-xs text-slate/60 mb-6">/{billing === 'annual' ? 'year' : 'month'}</p>
                )}

                <div className="pt-4 border-t border-black/[0.06] space-y-2">
                  {[
                    { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Secured by Stripe' },
                    { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Onboarding within 48 hours' },
                    { icon: 'M6 18L18 6M6 6l12 12', text: 'Cancel anytime' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-moss flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                      <span className="font-body text-xs text-slate">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
