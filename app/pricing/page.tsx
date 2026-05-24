'use client'
import { useState } from 'react'
import SectionEyebrow from '@/components/SectionEyebrow'
import Link from 'next/link'

const tiers = [
  {
    name: 'Bronze',
    subtitle: 'The Foundation',
    price: { monthly: 2500, annual: 2250 },
    accentColor: '#B87A40',
    desc: 'Designed for businesses ready to establish a professional, modern presence with essential marketing infrastructure.',
    featured: false,
    stripeMonthly: '#stripe-bronze-monthly',
    stripeAnnual: '#stripe-bronze-annual',
    deliverables: [
      { pillar: 'Brand Foundation', items: ['Brand Strategy Document', 'Logo & Visual Identity', 'Brand Style Guide', 'Messaging Framework'] },
      { pillar: 'Digital Presence', items: ['Custom Website (up to 5 pages)', 'SEO Foundation Setup', 'Google Business Profile Optimization'] },
      { pillar: 'Communication', items: ['Monthly KPI Report', 'Bi-weekly Async Update', 'Monthly Strategy Call (30 min)'] },
    ]
  },
  {
    name: 'Silver',
    subtitle: 'The Growth Engine',
    price: { monthly: 5000, annual: 4500 },
    accentColor: '#9BA4AE',
    desc: 'Our most popular tier. Designed for businesses aggressively seeking to expand their reach and acquire new customers.',
    featured: true,
    stripeMonthly: '#stripe-silver-monthly',
    stripeAnnual: '#stripe-silver-annual',
    deliverables: [
      { pillar: 'Everything in Bronze', items: ['All Brand Foundation deliverables', 'All Digital Presence deliverables'] },
      { pillar: 'Lead & Revenue Engine', items: ['Paid Media Management (1 platform)', 'Sales Funnel Design', 'Marketing Automation Setup', 'CRM Integration'] },
      { pillar: 'Customer Experience', items: ['Booking System Setup', 'Customer Onboarding Sequence', 'Retention Campaign'] },
      { pillar: 'Communication', items: ['Monthly KPI Report', 'Weekly Async Update', 'Monthly Strategy Call (60 min)'] },
    ]
  },
  {
    name: 'Gold',
    subtitle: 'The Full Disruption',
    price: { monthly: 9500, annual: 8550 },
    accentColor: '#C9A84C',
    desc: 'The ultimate full-service agency experience. Designed for established brands demanding market dominance.',
    featured: false,
    stripeMonthly: '#stripe-gold-monthly',
    stripeAnnual: '#stripe-gold-annual',
    deliverables: [
      { pillar: 'Everything in Silver', items: ['All Silver tier deliverables'] },
      { pillar: 'Full Lead Engine', items: ['Paid Media Management (all platforms)', 'Advanced Funnel Optimization', 'Full Marketing Automation Suite'] },
      { pillar: 'Reputation & Social Proof', items: ['Review Generation System', 'UGC Strategy & Campaigns', 'Referral Program', 'Testimonial Collection'] },
      { pillar: 'Business Advisory', items: ['Monthly KPI Dashboard', 'Monthly Strategy Call (60 min)', 'Quarterly Growth Planning', 'Competitive Intelligence'] },
    ]
  },
]

const alaCarte = [
  { service: 'Brand Identity Sprint', desc: 'Logo, colors, typography — full identity system', fee: '$4,500', stripeUrl: '#stripe-brand-identity' },
  { service: 'Website Design & Build', desc: 'Custom 5-page website, copywritten and launched', fee: '$7,500', stripeUrl: '#stripe-website' },
  { service: 'SEO Audit & Roadmap', desc: 'Technical and content audit with 90-day plan', fee: '$2,500', stripeUrl: '#stripe-seo' },
  { service: 'Google Ads Launch Package', desc: 'Campaign setup, creatives, and 30-day management', fee: '$3,000', stripeUrl: '#stripe-google-ads' },
  { service: 'Marketing Automation Setup', desc: 'CRM + email nurture sequence (up to 10 steps)', fee: '$3,500', stripeUrl: '#stripe-automation' },
  { service: 'Video Ad Package', desc: '3 short-form video ads, scripted and produced', fee: '$5,000', stripeUrl: '#stripe-video' },
  { service: 'Content Strategy Sprint', desc: '90-day content calendar + 10 pieces of content', fee: '$2,000', stripeUrl: '#stripe-content' },
  { service: 'Referral Program Build', desc: 'Full referral system design, copy, and setup', fee: '$2,500', stripeUrl: '#stripe-referral' },
]

const clientPays = [
  { item: 'Ad Spend', desc: 'Facebook, Google, etc.', cost: 'Set by client' },
  { item: 'Technology Platforms', desc: 'CRM, email, scheduling tools', cost: '$100–$500/mo' },
  { item: 'Website Hosting', desc: 'Domain, hosting, SSL', cost: '$20–$100/mo' },
  { item: 'Stock Photography / Video', desc: 'Licensed media assets', cost: 'As needed' },
  { item: 'Third-Party Tools', desc: 'Any specialized software', cost: 'As needed' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-end pb-24 relative overflow-hidden grain-overlay pt-32" style={{background: `radial-gradient(ellipse at 70% 30%, rgba(124,181,80,0.10) 0%, transparent 55%), #1A1815`}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Transparent Pricing" />
          </div>
          <h1 className="hero-heading text-[56px] md:text-[80px] text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            Pick a plan. Check out. We <em style={{color: '#7CB550'}}>get to work.</em>
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed mb-10">
            No sales calls required. Clear flat fees, secure checkout, and onboarding within 48 hours of purchase.
          </p>
          <div className="flex flex-wrap items-center gap-6 animate-fade-up delay-2">
            <a
              href="#plans"
              className="inline-flex items-center bg-moss text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all duration-300"
            >
              See Plans
            </a>
            <Link href="/contact" className="font-body text-sm text-ash hover:text-cream transition-colors">
              Need help choosing? Book a call →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="plans" className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`font-body text-sm ${!annual ? 'text-ink' : 'text-slate'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-moss' : 'bg-black/20'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${annual ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`font-body text-sm ${annual ? 'text-ink' : 'text-slate'}`}>
              Annual <span className="text-ember font-medium">(save 10%)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {tiers.map((tier) => {
              const price = annual ? tier.price.annual : tier.price.monthly
              const stripeUrl = annual ? tier.stripeAnnual : tier.stripeMonthly
              return (
                <div
                  key={tier.name}
                  className={`relative bg-white rounded-2xl overflow-hidden border ${
                    tier.featured ? 'border-ember shadow-xl shadow-ember/10 lg:scale-[1.02]' : 'border-black/10'
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-moss text-obsidian font-body text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="h-1" style={{ backgroundColor: tier.accentColor }} />
                  <div className="p-8">
                    <p className="font-display font-semibold text-2xl text-ink mb-1">{tier.name}</p>
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-slate mb-4">{tier.subtitle}</p>
                    <div className="flex items-end gap-2 mb-4">
                      <p className="font-display font-bold text-[56px] leading-none text-ink">
                        ${price.toLocaleString()}
                      </p>
                      <p className="font-body text-base text-slate mb-2">/month</p>
                    </div>
                    <p className="font-body text-sm text-slate leading-relaxed mb-6">{tier.desc}</p>
                    <div className="border-t border-black/[0.08] pt-6 mb-3" />

                    {/* Primary purchase CTA */}
                    <a
                      href={stripeUrl}
                      className={`flex items-center justify-center gap-2 w-full text-center font-body font-medium text-sm px-6 py-3.5 rounded-full transition-all duration-300 mb-3 ${
                        tier.featured
                          ? 'bg-moss text-bone hover:brightness-110'
                          : 'bg-ink text-bone hover:bg-forge'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Buy Now — ${price.toLocaleString()}/mo
                    </a>

                    {/* Secondary call CTA */}
                    <div className="text-center mb-6">
                      <Link href="/contact" className="font-body text-xs text-slate hover:text-ember transition-colors">
                        Have questions? Book a call →
                      </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-black/[0.08]">
                      <span className="font-body text-[10px] text-slate/70 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Secure checkout
                      </span>
                      <span className="font-body text-[10px] text-slate/70">Cancel anytime</span>
                      <span className="font-body text-[10px] text-slate/70">48hr onboarding</span>
                    </div>

                    <div className="space-y-6">
                      {tier.deliverables.map((group, gi) => (
                        <div key={gi}>
                          <p className="font-body text-[11px] uppercase tracking-[0.15em] text-slate mb-3">{group.pillar}</p>
                          <ul className="space-y-2">
                            {group.items.map((item, ii) => (
                              <li key={ii} className="flex items-start gap-3">
                                <svg className="w-4 h-4 text-ember flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-body text-sm text-ink">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom trust bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-body text-xs text-slate">Payments secured by Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-body text-xs text-slate">Onboarding call scheduled within 48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-body text-xs text-slate">Cancel anytime, no long-term contracts</span>
            </div>
          </div>
        </div>
      </section>

      {/* A La Carte */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <SectionEyebrow text='The "Sides"' />
            <h2 className="font-display font-normal italic text-[40px] leading-tight text-cream mb-4">
              One-off projects. Clear, flat fees.
            </h2>
            <p className="font-body text-base text-ash max-w-xl">
              Don&apos;t need a full retainer? Order exactly what you need.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Service</th>
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal hidden md:table-cell">Description</th>
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Flat Fee</th>
                  <th className="text-right py-4 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {alaCarte.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.08] group">
                    <td className="py-5 pr-8 font-body font-medium text-sm text-cream">{row.service}</td>
                    <td className="py-5 pr-8 font-body text-sm text-ash hidden md:table-cell">{row.desc}</td>
                    <td className="py-5 pr-8 font-body text-sm text-ember font-medium">{row.fee}</td>
                    <td className="py-5 text-right">
                      <a
                        href={row.stripeUrl}
                        className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-obsidian bg-cream px-4 py-2 rounded-full hover:bg-white transition-colors whitespace-nowrap"
                      >
                        Order Now
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Clients Pay Separately */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <SectionEyebrow text="Full Transparency" light />
            <h2 className="font-display font-medium text-[36px] leading-tight text-ink mb-4">
              Our fee covers expertise and execution.<br />Here&apos;s what sits outside it.
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-slate font-normal">Item</th>
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-slate font-normal">Description</th>
                  <th className="text-left py-4 font-body text-[11px] uppercase tracking-[0.1em] text-slate font-normal">Typical Cost</th>
                </tr>
              </thead>
              <tbody>
                {clientPays.map((row, i) => (
                  <tr key={i} className="border-b border-black/[0.06]">
                    <td className="py-5 pr-8 font-body font-medium text-sm text-ink">{row.item}</td>
                    <td className="py-5 pr-8 font-body text-sm text-slate">{row.desc}</td>
                    <td className="py-5 font-body text-sm text-slate">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-obsidian py-24 md:py-32 grain-overlay">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <SectionEyebrow text="Ready to Start" />
          <h2 className="font-display font-bold text-[52px] leading-tight text-bone mb-6 max-w-2xl mx-auto">
            Your next chapter starts with a single <em style={{color: '#7CB550'}}>click.</em>
          </h2>
          <p className="font-body text-base text-ash max-w-lg mx-auto mb-10">
            Pick your plan above and check out securely. We&apos;ll have your onboarding call scheduled within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#plans"
              className="inline-flex items-center bg-moss text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all duration-300"
            >
              Choose Your Plan
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center font-body text-sm text-ash hover:text-cream transition-colors"
            >
              Still have questions? Book a call →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
