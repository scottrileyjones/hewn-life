'use client'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

const steps = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    title: 'DISCOVER',
    desc: 'We audit your business end-to-end — brand, digital presence, systems, and competitive landscape — then build a custom growth roadmap before a single dollar is spent.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
      </svg>
    ),
    title: 'BUILD',
    desc: 'We deploy your full marketing system across all six pillars — brand identity, website, paid media, automations, CRM, and customer experience — in a focused sprint.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    ),
    title: 'SCALE',
    desc: 'We optimize performance, advise monthly, and compound what\'s working — operating as your embedded fractional CMO for as long as you\'re growing.',
  },
]

const pillars = [
  {
    num: '01',
    name: 'Brand Foundation',
    tier: 'Hewn',
    desc: 'Identity, voice, and positioning. The strategic bedrock everything else is built on.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2c1.51 0 2.91.49 4.06 1.31L5.31 16.06A6.97 6.97 0 0 1 4 12c0-3.87 3.13-7 7-7zm0 14c-1.51 0-2.91-.49-4.06-1.31l10.75-10.75A6.97 6.97 0 0 1 20 12c0 3.87-3.13 7-7 7z"/>
      </svg>
    ),
  },
  {
    num: '02',
    name: 'Digital Presence',
    tier: 'Hewn',
    desc: 'Website, SEO, and maps. Your complete digital footprint, owned and optimized.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
  },
  {
    num: '03',
    name: 'Lead & Revenue Engine',
    tier: 'Forged',
    desc: 'Paid media, funnels, and automation. Systems that turn attention into revenue.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      </svg>
    ),
  },
  {
    num: '04',
    name: 'Customer Experience',
    tier: 'Forged',
    desc: 'Scheduling, follow-up, and retention. Systems that turn buyers into loyal customers.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
  {
    num: '05',
    name: 'Reputation & Social Proof',
    tier: 'Carved',
    desc: 'Reviews, UGC, and referrals. Turning your best customers into your best marketing.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
  },
  {
    num: '06',
    name: 'Business Advisory',
    tier: 'Carved',
    desc: 'Strategy, KPIs, and growth planning. The fractional CMO layer that ties it all together.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-2.18c.07-.44.18-.87.18-1.33C18 2.54 15.96.5 13.5.5c-1.38 0-2.58.63-3.5 1.6C9.08 1.13 7.88.5 6.5.5 4.04.5 2 2.54 2 5.17c0 3.22 3.6 6.21 9 11.33 5.4-5.12 9-8.11 9-11.33 0-.46-.11-.89-.18-1.17H20V6zm-7.07 14.84L12 22l-1.07-.22C5.3 19.77 2 16.42 2 12.85V11l10-4 10 4v1.85c0 3.57-3.3 6.92-9.07 9z"/>
      </svg>
    ),
  },
]

const timeline = [
  { period: 'WEEKS 1–2', title: 'Onboarding & Discovery', desc: 'Deep dive into your business, systems, competitive landscape, and ownership goals.' },
  { period: 'WEEKS 3–8', title: 'Foundation Sprint', desc: 'Brand, website, Google presence, and core automations built and launched.' },
  { period: 'MONTHS 3–6', title: 'Growth Sprint', desc: 'Paid media, referral program, UGC, and retention systems layered in.' },
  { period: 'MONTH 6+', title: 'Optimize & Scale', desc: 'Ongoing advisory, performance optimization, and strategic planning as the business grows.' },
]

const tierColors: Record<string, string> = {
  Hewn: 'text-ember',
  Forged: 'text-ash',
  Carved: 'text-oat',
}

export default function HowItWorks() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[65vh] flex items-end pb-24 relative overflow-hidden pt-32" style={{background: '#1A1815'}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Our Process" />
          </div>
          <h1 className="font-display text-[52px] md:text-[76px] text-cream max-w-4xl mb-8 animate-fade-up delay-1 leading-tight">
            We don&apos;t bolt marketing on. We <em style={{color: '#7CB550'}}>build</em> it into the bones of your business.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            Hewn Life operates as your fractional CMO — embedded, invested, and building systems that outlast any single campaign.
          </p>
        </div>
      </section>

      {/* How It Works — 3-step */}
      <section className="bg-iron py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-body font-bold text-[42px] md:text-[56px] uppercase tracking-wider text-cream mb-20">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
            {steps.map((step, i) => (
              <div key={i}>
                <div className="w-20 h-20 rounded-full bg-ember flex items-center justify-center mb-8 text-iron">
                  {step.icon}
                </div>
                <h3 className="font-body font-bold text-[15px] uppercase tracking-[0.18em] text-ember mb-4">
                  {step.title}
                </h3>
                <p className="font-body text-base text-ash leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="inline-block font-body font-semibold text-[13px] uppercase tracking-[0.15em] bg-ember text-iron px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            See Our Plans
          </Link>
        </div>
      </section>

      {/* Six Pillars — icon grid */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <SectionEyebrow text="The Six Pillars" light />
            <h2 className="font-body font-bold text-[36px] md:text-[48px] uppercase tracking-wide text-ink mt-2">
              Full-service, built in layers.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            {pillars.map((pillar, i) => (
              <div key={i} className="bg-bone p-10 flex flex-col gap-5">
                <div className="w-14 h-14 rounded-full bg-iron flex items-center justify-center text-ember flex-shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash mb-1">
                    {pillar.num} — {pillar.tier}
                  </p>
                  <h3 className="font-body font-bold text-[15px] uppercase tracking-[0.1em] text-ink mb-3">
                    {pillar.name}
                  </h3>
                  <p className="font-body text-sm text-slate leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Timeline */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <SectionEyebrow text="How We Engage" />
            <h2 className="font-body font-bold text-[36px] md:text-[48px] uppercase tracking-wide text-cream mt-2">
              From day one to market leader.
            </h2>
          </div>

          <div className="hidden md:grid grid-cols-4 gap-8 relative">
            <div className="absolute top-4 left-[12.5%] right-[12.5%] h-[1px] border-t border-dashed border-cream/20" />
            {timeline.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-ember flex items-center justify-center mb-6">
                  <span className="font-body text-xs font-semibold text-cream">{i + 1}</span>
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
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-ember flex-shrink-0 flex items-center justify-center">
                    <span className="font-body text-xs font-semibold text-cream">{i + 1}</span>
                  </div>
                  {i < timeline.length - 1 && <div className="w-[1px] flex-1 border-l border-dashed border-cream/20 mt-2" />}
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
          <div className="mb-16">
            <SectionEyebrow text="Staying Aligned" light />
            <h2 className="font-body font-bold text-[36px] md:text-[48px] uppercase tracking-wide text-ink mt-2">
              You will always know what&apos;s happening.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                ),
                title: 'Monthly KPI Report',
                timing: '1st of each month',
                desc: 'Written report with live dashboard tracking all key performance metrics.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                ),
                title: 'Weekly Async Update',
                timing: 'Every week',
                desc: "Brief email or Slack update on what was done, what's next, and any open questions.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                  </svg>
                ),
                title: 'Monthly Strategy Call',
                timing: '60-minute video call',
                desc: 'Monthly video call with ownership to review performance and plan the month ahead.',
              },
            ].map((card, i) => (
              <div key={i} className="bg-iron p-10">
                <div className="w-14 h-14 rounded-full bg-ember flex items-center justify-center text-iron mb-6">
                  {card.icon}
                </div>
                <h3 className="font-body font-bold text-[14px] uppercase tracking-[0.12em] text-ember mb-2">{card.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash mb-4">{card.timing}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
