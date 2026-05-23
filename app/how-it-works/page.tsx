'use client'
import { useState } from 'react'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'

const pillars = [
  {
    num: '01',
    name: 'Brand Foundation',
    desc: 'Identity, voice, and positioning — the strategic bedrock everything else is built on. We build your brand to be distinct, defensible, and deeply aligned with your business goals.',
    deliverables: [
      { item: 'Brand Strategy Document', desc: 'Positioning, audience, voice, and competitive differentiation' },
      { item: 'Logo & Visual Identity', desc: 'Logo suite, color palette, typography, and usage guidelines' },
      { item: 'Brand Style Guide', desc: 'Complete brand standards for consistent application' },
      { item: 'Messaging Framework', desc: 'Core messages, taglines, elevator pitch, and value propositions' },
    ]
  },
  {
    num: '02',
    name: 'Digital Presence',
    desc: "Website, SEO, and maps — your complete digital footprint, owned and optimized. We build websites that convert and ensure you're found everywhere your customers are looking.",
    deliverables: [
      { item: 'Website Design & Development', desc: 'Custom-designed, conversion-optimized website' },
      { item: 'SEO Foundation', desc: 'Technical SEO, on-page optimization, and keyword strategy' },
      { item: 'Google Business Profile', desc: 'Complete optimization of your local presence' },
      { item: 'Local Listings Management', desc: 'Consistent NAP across all major directories' },
    ]
  },
  {
    num: '03',
    name: 'Lead & Revenue Engine',
    desc: 'Paid media, funnels, and automation — systems that turn attention into revenue. We build and manage the full acquisition stack from ad to closed deal.',
    deliverables: [
      { item: 'Paid Media Management', desc: 'Google, Meta, and relevant platform ad management' },
      { item: 'Sales Funnel Design', desc: 'Landing pages, offers, and conversion pathways' },
      { item: 'Marketing Automation', desc: 'Lead nurture sequences, drip campaigns, and follow-up systems' },
      { item: 'CRM Setup & Integration', desc: 'Pipeline management and sales process automation' },
    ]
  },
  {
    num: '04',
    name: 'Customer Experience',
    desc: 'Scheduling, follow-up, and retention — the systems that turn buyers into loyal customers. We design the full customer journey from first touch to long-term advocate.',
    deliverables: [
      { item: 'Booking & Scheduling System', desc: 'Seamless appointment and consultation booking' },
      { item: 'Onboarding Sequence', desc: 'Automated welcome and onboarding for new customers' },
      { item: 'Retention Campaigns', desc: 'Re-engagement campaigns and loyalty programs' },
      { item: 'Customer Feedback Systems', desc: 'Survey, NPS, and satisfaction measurement' },
    ]
  },
  {
    num: '05',
    name: 'Reputation & Social Proof',
    desc: 'Reviews, UGC, and referrals — turning your best customers into your best marketing. We systematize the generation and amplification of social proof.',
    deliverables: [
      { item: 'Review Generation System', desc: 'Automated post-service review request campaigns' },
      { item: 'UGC Strategy & Campaigns', desc: 'User-generated content programs and incentives' },
      { item: 'Referral Program', desc: 'Structured referral system with tracking and rewards' },
      { item: 'Testimonial Collection', desc: 'Video and written testimonial capture process' },
    ]
  },
  {
    num: '06',
    name: 'Business Advisory',
    desc: 'Strategy, KPIs, and growth planning — the fractional CMO layer that ties it all together. We operate as a strategic partner invested in your long-term growth.',
    deliverables: [
      { item: 'Monthly KPI Dashboard', desc: 'Custom performance dashboard with key metrics' },
      { item: 'Monthly Strategy Call', desc: '60-minute video call reviewing performance and planning ahead' },
      { item: 'Quarterly Growth Planning', desc: 'Structured quarterly planning sessions with written roadmap' },
      { item: 'Competitive Intelligence', desc: 'Ongoing monitoring of competitive landscape and opportunities' },
    ]
  },
]

const timeline = [
  { period: 'WEEKS 1–2', title: 'Onboarding & Discovery', desc: 'Deep dive into your business, systems, competitive landscape, and ownership goals.' },
  { period: 'WEEKS 3–8', title: 'Foundation Sprint', desc: 'Brand, website, Google presence, and core automations built and launched.' },
  { period: 'MONTHS 3–6', title: 'Growth Sprint', desc: 'Paid media, referral program, UGC, and retention systems layered in.' },
  { period: 'MONTH 6+', title: 'Optimize & Scale', desc: 'Ongoing advisory, performance optimization, and strategic planning as the business grows.' },
]

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0)
  const activePillar = pillars[activeTab]

  return (
    <>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-end pb-24 relative overflow-hidden grain-overlay pt-32" style={{background: `radial-gradient(ellipse at 70% 30%, rgba(124,181,80,0.10) 0%, transparent 55%), #1A1815`}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Our Process" />
          </div>
          <h1 className="font-display font-light italic text-[56px] md:text-[72px] leading-[1.08] text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            We don&apos;t bolt marketing on. We build it into the bones of your business.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            Hewn Life operates as your fractional CMO — embedded, invested, and building systems that outlast any single campaign.
          </p>
        </div>
      </section>

      {/* Six Pillars Tabs */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <SectionEyebrow text="The Six Pillars" light />
            <h2 className="font-display font-medium text-[40px] leading-tight text-ink">
              Full-service, built in layers.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {pillars.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`font-body text-[13px] px-5 py-2 rounded-full transition-all duration-300 ${
                  activeTab === i
                    ? 'bg-ember text-iron'
                    : 'border border-moss/40 text-ember hover:border-moss'
                }`}
              >
                {p.num} {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-display font-medium text-[32px] text-ink mb-4">{activePillar.name}</h3>
              <p className="font-body text-base text-slate leading-relaxed">{activePillar.desc}</p>
            </div>
            <div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left pb-3 font-body text-[11px] uppercase tracking-[0.1em] text-slate font-normal">Deliverable</th>
                    <th className="text-left pb-3 font-body text-[11px] uppercase tracking-[0.1em] text-slate font-normal">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activePillar.deliverables.map((d, i) => (
                    <tr key={i} className="border-b border-black/[0.06]">
                      <td className="py-4 pr-6 font-body font-medium text-sm text-ink w-2/5">{d.item}</td>
                      <td className="py-4 font-body text-sm text-slate">{d.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Timeline */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="How We Engage" />
            <h2 className="font-display font-normal text-[44px] leading-tight text-cream">
              From day one to market leader.
            </h2>
          </div>

          <div className="hidden md:grid grid-cols-4 gap-8 relative">
            <div className="absolute top-4 left-[12.5%] right-[12.5%] h-[1px] border-t border-dashed border-moss/40" />
            {timeline.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-8 h-8 rounded-full bg-moss flex items-center justify-center mb-6">
                  <span className="font-body text-xs font-semibold text-obsidian">{i + 1}</span>
                </div>
                <p className="font-body text-[11px] uppercase tracking-[0.15em] text-ember mb-2">{step.period}</p>
                <p className="font-body font-semibold text-sm text-cream mb-2">{step.title}</p>
                <p className="font-body text-xs text-ash leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-8">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-moss flex-shrink-0 flex items-center justify-center">
                    <span className="font-body text-xs font-semibold text-obsidian">{i + 1}</span>
                  </div>
                  {i < timeline.length - 1 && <div className="w-[1px] flex-1 border-l border-dashed border-moss/40 mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="font-body text-[11px] uppercase tracking-[0.15em] text-ember mb-1">{step.period}</p>
                  <p className="font-body font-semibold text-sm text-cream mb-2">{step.title}</p>
                  <p className="font-body text-xs text-ash leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Cadence */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="Staying Aligned" light />
            <h2 className="font-display font-medium text-[36px] leading-tight text-ink">
              You will always know exactly what&apos;s happening.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📊', title: 'Monthly KPI Report', timing: '1st of each month', desc: 'Written report with live dashboard tracking all key performance metrics.' },
              { icon: '📬', title: 'Weekly Async Update', timing: 'Every week', desc: "Brief email or Slack update on what was done, what's next, and any open questions." },
              { icon: '📞', title: 'Monthly Strategy Call', timing: '60-minute video call', desc: 'Monthly video call with ownership to review performance and plan the month ahead.' },
            ].map((card, i) => (
              <div key={i} className="bg-oat border border-black/[0.08] rounded-2xl p-8">
                <p className="text-3xl mb-4">{card.icon}</p>
                <p className="font-body font-semibold text-sm text-ink mb-1">{card.title}</p>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-ember mb-4">{card.timing}</p>
                <p className="font-body text-sm text-slate leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
