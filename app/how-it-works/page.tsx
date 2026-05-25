'use client'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

const tiers = [
  {
    name: 'Hewn',
    range: 'Pillars 01–02',
    tagline: 'The foundation.',
    why: 'You can\'t grow what people can\'t find — or trust. Before ads, before campaigns, you need a brand worth growing and a digital presence that converts.',
    pillars: [
      {
        num: '01',
        name: 'Brand Foundation',
        items: ['Brand strategy & positioning', 'Logo & visual identity', 'Messaging framework'],
      },
      {
        num: '02',
        name: 'Digital Presence',
        items: ['Website design & development', 'SEO foundation', 'Google Business Profile'],
      },
    ],
    bridge: 'Foundation is set. Now make it generate revenue.',
  },
  {
    name: 'Forged',
    range: 'Pillars 01–04',
    tagline: 'The growth engine.',
    why: 'Visibility without conversion is just vanity. Forged layers in the systems that turn attention into booked jobs — and first-time buyers into repeat customers.',
    pillars: [
      {
        num: '03',
        name: 'Lead & Revenue Engine',
        items: ['Paid media management', 'Sales funnels & landing pages', 'Marketing automation & CRM'],
      },
      {
        num: '04',
        name: 'Customer Experience',
        items: ['Booking & scheduling systems', 'Onboarding sequences', 'Retention campaigns'],
      },
    ],
    bridge: 'Revenue is flowing. Now compound it into lasting advantage.',
    inherited: 'Includes everything in Hewn',
  },
  {
    name: 'Carved',
    range: 'Pillars 01–06',
    tagline: 'The complete system.',
    why: 'With revenue flowing and customers retained, the final layer turns your best customers into your best marketers — and adds the strategic oversight that ties it all together.',
    pillars: [
      {
        num: '05',
        name: 'Reputation & Social Proof',
        items: ['Review generation system', 'UGC strategy & campaigns', 'Referral program'],
      },
      {
        num: '06',
        name: 'Business Advisory',
        items: ['Monthly KPI dashboard & reporting', 'Quarterly growth planning', 'Fractional CMO strategy'],
      },
    ],
    bridge: null,
    inherited: 'Includes everything in Forged',
  },
]

const timeline = [
  { period: 'Weeks 1–2', title: 'Onboarding & Discovery', desc: 'Deep dive into your business, systems, competitive landscape, and ownership goals. We audit before we act.' },
  { period: 'Weeks 3–8', title: 'Foundation Sprint', desc: 'Brand identity, website, and Google presence built and launched. The core system goes live.' },
  { period: 'Months 3–6', title: 'Growth Sprint', desc: 'Paid media, funnels, automations, and retention systems layered in on top of the foundation.' },
  { period: 'Month 6+', title: 'Optimize & Scale', desc: 'Ongoing advisory, performance optimization, and strategic planning as the business compounds.' },
]

export default function HowItWorks() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[65vh] flex items-end pb-24 relative overflow-hidden pt-32 bg-iron">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Our Process" />
          </div>
          <h1 className="font-display text-[52px] md:text-[76px] text-cream max-w-4xl mb-8 animate-fade-up delay-1 leading-[1.05]">
            We don&apos;t bolt marketing on. We <em style={{color: '#7CB550'}}>build</em> it into the bones of your business.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            Hewn Life operates as your fractional CMO — embedded, invested, and building systems that outlast any single campaign.
          </p>
        </div>
      </section>

      {/* Tier progression */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <SectionEyebrow text="The Three Tiers" light />
            <h2 className="font-display font-medium text-[40px] md:text-[52px] text-ink leading-tight mt-2">
              Built in layers.<br /><em>Each one earns the next.</em>
            </h2>
            <p className="font-body text-base text-slate leading-relaxed mt-6">
              Every tier starts where the last one left off. You don&apos;t get leads before you have a brand. You don&apos;t build reputation before you have customers. The order is the system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-black/10">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`flex flex-col p-10 md:p-12 border-b lg:border-b-0 lg:border-r border-black/10 last:border-0 ${i === 1 ? 'bg-iron text-cream' : 'bg-bone'}`}
              >
                {/* Tier header */}
                <div className="mb-8">
                  <p className={`font-mono text-[10px] uppercase tracking-[0.25em] mb-3 ${i === 1 ? 'text-ember' : 'text-slate/50'}`}>
                    {tier.range}
                  </p>
                  <h3 className={`font-display text-[48px] md:text-[56px] leading-none mb-2 ${i === 1 ? 'text-cream' : 'text-ink'}`}>
                    {tier.name}
                  </h3>
                  <p className={`font-display italic text-[18px] ${i === 1 ? 'text-ash' : 'text-slate'}`}>
                    {tier.tagline}
                  </p>
                </div>

                {/* Why this tier */}
                {tier.inherited && (
                  <p className={`font-mono text-[10px] uppercase tracking-[0.15em] mb-2 ${i === 1 ? 'text-ember/60' : 'text-slate/40'}`}>
                    {tier.inherited}
                  </p>
                )}
                <p className={`font-body text-sm leading-relaxed mb-8 ${i === 1 ? 'text-ash' : 'text-slate'}`}>
                  {tier.why}
                </p>

                {/* Pillars */}
                <div className="flex flex-col gap-6 flex-1">
                  {tier.pillars.map((pillar) => (
                    <div key={pillar.num}>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className={`font-mono text-[10px] tracking-[0.15em] ${i === 1 ? 'text-ember' : 'text-ember'}`}>
                          {pillar.num}
                        </span>
                        <span className={`font-body font-semibold text-sm ${i === 1 ? 'text-cream' : 'text-ink'}`}>
                          {pillar.name}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-1 pl-8">
                        {pillar.items.map((item) => (
                          <li key={item} className={`font-body text-xs leading-relaxed flex items-start gap-2 ${i === 1 ? 'text-ash' : 'text-slate'}`}>
                            <span className="mt-[5px] w-1 h-1 rounded-full bg-ember flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Bridge to next tier */}
                {tier.bridge ? (
                  <div className={`mt-10 pt-8 border-t ${i === 1 ? 'border-white/10' : 'border-black/10'}`}>
                    <p className={`font-body text-xs leading-relaxed italic ${i === 1 ? 'text-ash' : 'text-slate'}`}>
                      {tier.bridge}
                    </p>
                  </div>
                ) : (
                  <div className="mt-10 pt-8 border-t border-black/10">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 font-body text-sm font-semibold text-ember hover:opacity-70 transition-opacity"
                    >
                      See pricing for all three tiers
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Timeline */}
      <section className="bg-iron py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <SectionEyebrow text="The Engagement" />
            <h2 className="font-display font-medium text-[40px] md:text-[52px] text-cream leading-tight mt-2">
              From day one<br /><em>to market leader.</em>
            </h2>
          </div>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-0 border-t border-white/10">
            {timeline.map((step, i) => (
              <div key={i} className="pt-8 pr-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ember mb-4">{step.period}</p>
                <p className="font-body font-semibold text-sm text-cream mb-3">{step.title}</p>
                <p className="font-body text-xs text-ash leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-6 border-t border-white/10 py-8">
                <span className="font-mono text-[11px] text-ember w-4 flex-shrink-0 mt-[2px]">{i + 1}</span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ember mb-2">{step.period}</p>
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
          <div className="mb-16 max-w-xl">
            <SectionEyebrow text="Staying Aligned" light />
            <h2 className="font-display font-medium text-[40px] md:text-[48px] text-ink leading-tight mt-2">
              You will always know<br /><em>exactly what&apos;s happening.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {[
              {
                label: 'Monthly',
                title: 'KPI Report',
                timing: '1st of each month',
                desc: 'Written report with a live dashboard covering all key performance metrics, spend, and results.',
              },
              {
                label: 'Weekly',
                title: 'Async Update',
                timing: 'Every Friday',
                desc: 'Short email or Slack update — what was done, what\'s next, and any open questions that need your input.',
              },
              {
                label: 'Monthly',
                title: 'Strategy Call',
                timing: '60 minutes',
                desc: 'Video call with ownership to review the month\'s performance and set priorities for the month ahead.',
              },
            ].map((card, i) => (
              <div key={i} className="bg-bone p-10 md:p-12">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember mb-1">{card.label}</p>
                <h3 className="font-display text-[32px] text-ink leading-tight mb-1">{card.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate/50 mb-6">{card.timing}</p>
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
