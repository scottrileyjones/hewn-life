'use client'
import { useState } from 'react'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

const tiers = [
  {
    name: 'Bronze',
    subtitle: 'The Foundation',
    price: { monthly: 2500, annual: 2250 },
    accentColor: '#B87A40',
    desc: 'Designed for businesses ready to establish a professional, modern presence with essential marketing infrastructure.',
    featured: false,
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
    deliverables: [
      { pillar: 'Everything in Silver', items: ['All Silver tier deliverables'] },
      { pillar: 'Full Lead Engine', items: ['Paid Media Management (all platforms)', 'Advanced Funnel Optimization', 'Full Marketing Automation Suite'] },
      { pillar: 'Reputation & Social Proof', items: ['Review Generation System', 'UGC Strategy & Campaigns', 'Referral Program', 'Testimonial Collection'] },
      { pillar: 'Business Advisory', items: ['Monthly KPI Dashboard', 'Monthly Strategy Call (60 min)', 'Quarterly Growth Planning', 'Competitive Intelligence'] },
    ]
  },
]

const alaCarte = [
  { service: 'Brand Identity Sprint', desc: 'Logo, colors, typography — full identity system', fee: '$4,500' },
  { service: 'Website Design & Build', desc: 'Custom 5-page website, copywritten and launched', fee: '$7,500' },
  { service: 'SEO Audit & Roadmap', desc: 'Technical and content audit with 90-day plan', fee: '$2,500' },
  { service: 'Google Ads Launch Package', desc: 'Campaign setup, creatives, and 30-day management', fee: '$3,000' },
  { service: 'Marketing Automation Setup', desc: 'CRM + email nurture sequence (up to 10 steps)', fee: '$3,500' },
  { service: 'Video Ad Package', desc: '3 short-form video ads, scripted and produced', fee: '$5,000' },
  { service: 'Content Strategy Sprint', desc: '90-day content calendar + 10 pieces of content', fee: '$2,000' },
  { service: 'Referral Program Build', desc: 'Full referral system design, copy, and setup', fee: '$2,500' },
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
          <h1 className="font-display font-semibold text-[56px] md:text-[72px] leading-[1.08] text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            You know exactly what you&apos;re ordering. And exactly what it <span className="italic text-ember">costs.</span>
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            We operate like a fine dining restaurant: clear, flat fees for premium, full-service work. No hidden percentages. No bloated retainers. No surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-bone py-24 md:py-32">
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
                    <div className="border-t border-black/[0.08] pt-6 mb-6" />
                    <Link
                      href="/contact"
                      className={`block w-full text-center font-body font-medium text-sm px-6 py-3.5 rounded-full transition-all duration-300 mb-8 ${
                        tier.featured
                          ? 'bg-moss text-bone hover:brightness-110'
                          : 'border border-ember text-ember hover:bg-ember hover:text-iron'
                      }`}
                    >
                      Get Started
                    </Link>
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
              For clients needing specific projects outside their monthly retainer.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Service</th>
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Description</th>
                  <th className="text-left py-4 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Flat Fee</th>
                </tr>
              </thead>
              <tbody>
                {alaCarte.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.08]">
                    <td className="py-5 pr-8 font-body font-medium text-sm text-cream">{row.service}</td>
                    <td className="py-5 pr-8 font-body text-sm text-ash">{row.desc}</td>
                    <td className="py-5 font-body text-sm text-ember font-medium">{row.fee}</td>
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

      <CtaBanner buttonText="Book a Free Discovery Call — No Commitment." />
    </>
  )
}
