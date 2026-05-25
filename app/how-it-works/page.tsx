import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

const problems = [
  {
    num: '01',
    heading: 'They\'re structured for dependency.',
    body: 'Agencies make money on complexity. The more you need them, the better. So they build campaigns — not systems — and keep the strategy locked inside their own heads. Switching costs are high by design.',
  },
  {
    num: '02',
    heading: 'Everything stops when you stop paying.',
    body: 'Retainer ends. Ads stop. Leads dry up. Nothing transfers. You\'ve been renting attention, not building equity. Most businesses spend years paying for results that evaporate the moment they pause.',
  },
  {
    num: '03',
    heading: 'You get a vendor. Not a partner.',
    body: 'They\'re optimizing for deliverables and reports, not your revenue. They show up with a deck, not a plan. And when results disappoint, there\'s always another tactic to sell you.',
  },
]

const principles = [
  {
    heading: 'We operate as your fractional CMO.',
    body: 'Not an agency you hire. A marketing leader you embed. We\'re accountable to your outcomes — revenue, retention, reputation — not our output. If your business isn\'t growing, we\'re not doing our job.',
  },
  {
    heading: 'We build in the right order.',
    body: 'Brand before ads. Infrastructure before spend. Most businesses throw money at growth before they have anything worth growing. We fix the foundation first, then layer in the engine, then compound it.',
  },
  {
    heading: 'Everything we build, you own.',
    body: 'No proprietary tools. No lock-in. The brand, the website, the automations, the CRM — they\'re yours from day one. We don\'t hold your business hostage to keep your retainer.',
  },
]

const timeline = [
  {
    period: 'Weeks 1–2',
    title: 'Onboarding & Discovery',
    desc: 'We audit your business end-to-end — brand, digital presence, systems, competitive landscape, and ownership goals. We don\'t guess.',
  },
  {
    period: 'Weeks 3–8',
    title: 'Foundation Sprint',
    desc: 'Brand identity, website, and Google presence built and launched. The core infrastructure goes live before we touch any growth spend.',
  },
  {
    period: 'Months 3–6',
    title: 'Growth Sprint',
    desc: 'Paid media, funnels, automations, and retention systems layered in on top of the foundation. Now we scale what\'s built to last.',
  },
  {
    period: 'Month 6+',
    title: 'Optimize & Scale',
    desc: 'Ongoing advisory, performance optimization, and quarterly growth planning. We compound what\'s working and cut what isn\'t.',
  },
]

const cadence = [
  {
    frequency: 'Weekly',
    title: 'Async Update',
    detail: 'Every Friday',
    desc: 'Short written update — what was done, what\'s next, any decisions that need your input. You always know where things stand.',
  },
  {
    frequency: 'Monthly',
    title: 'KPI Report',
    detail: '1st of each month',
    desc: 'Full performance report with a live dashboard. Every key metric, every channel, every trend — written clearly, not hidden in slides.',
  },
  {
    frequency: 'Monthly',
    title: 'Strategy Call',
    detail: '60 minutes',
    desc: 'Video call with ownership to review the month and set priorities for the next one. This is where strategy gets made, not reported on.',
  },
]

export default function HowItWorks() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[60vh] flex items-end pb-24 pt-36 bg-iron">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="How It Works" />
          </div>
          <h1 className="font-display text-[52px] md:text-[80px] text-cream max-w-3xl mb-8 animate-fade-up delay-1 leading-[1.05]">
            Most agencies sell campaigns.<br />
            <em style={{ color: '#7CB550' }}>We build systems.</em>
          </h1>
          <p className="font-body text-lg text-ash max-w-lg animate-fade-up delay-2 leading-relaxed">
            The difference isn&apos;t the tactics. It&apos;s what remains when the engagement ends.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <SectionEyebrow text="The Problem" light />
              <h2 className="font-display font-medium text-[36px] md:text-[44px] text-ink leading-tight mt-2">
                Why the agency model<br /><em>fails you.</em>
              </h2>
            </div>
            <div className="flex flex-col divide-y divide-black/10">
              {problems.map((p) => (
                <div key={p.num} className="py-10 first:pt-0 last:pb-0 grid grid-cols-[3rem_1fr] gap-6">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ember mt-1">{p.num}</span>
                  <div>
                    <h3 className="font-display font-medium text-[22px] text-ink mb-3 leading-snug">{p.heading}</h3>
                    <p className="font-body text-sm text-slate leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="bg-iron py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-xl">
            <SectionEyebrow text="The Difference" />
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-cream leading-tight mt-2">
              How Hewn Life<br /><em style={{ color: '#7CB550' }}>works differently.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
            {principles.map((p, i) => (
              <div key={i} className="pt-10 md:pr-12 md:border-r border-white/10 last:border-0 md:pl-12 first:pl-0">
                <div className="w-1 h-8 bg-ember mb-8" />
                <h3 className="font-display font-medium text-[22px] text-cream leading-snug mb-4">{p.heading}</h3>
                <p className="font-body text-sm text-ash leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Engagement — Timeline */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-xl">
            <SectionEyebrow text="The Engagement" light />
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-ink leading-tight mt-2">
              From first call<br /><em>to market leader.</em>
            </h2>
          </div>

          {/* Desktop timeline */}
          <div className="hidden md:grid grid-cols-4 border-t border-black/10">
            {timeline.map((step, i) => (
              <div key={i} className="pt-8 pr-10 last:pr-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-4">{step.period}</p>
                <p className="font-display font-medium text-[20px] text-ink leading-snug mb-3">{step.title}</p>
                <p className="font-body text-sm text-slate leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden flex flex-col">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-6 border-t border-black/10 py-8">
                <span className="font-mono text-[11px] text-ember flex-shrink-0 mt-[2px] w-4">{i + 1}</span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-2">{step.period}</p>
                  <p className="font-display font-medium text-[20px] text-ink leading-snug mb-2">{step.title}</p>
                  <p className="font-body text-sm text-slate leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Cadence */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-xl">
            <SectionEyebrow text="Staying Aligned" />
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-cream leading-tight mt-2">
              You will always know<br /><em>exactly what&apos;s happening.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
            {cadence.map((c, i) => (
              <div key={i} className="pt-10 md:pr-12 md:border-r border-white/10 last:border-0 md:pl-12 first:pl-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember mb-1">{c.frequency}</p>
                <p className="font-display text-[36px] text-cream leading-none mb-1">{c.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/30 mb-6">{c.detail}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing nudge */}
      <section className="bg-bone py-20 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display font-medium text-[28px] md:text-[36px] text-ink leading-tight">
              Ready to see what&apos;s included<br />
              <em>at each tier?</em>
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 inline-flex items-center gap-3 bg-iron text-cream font-body font-semibold text-sm px-8 py-4 rounded-full hover:bg-moss transition-colors"
          >
            See Pricing
            <span className="text-ember">→</span>
          </Link>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
