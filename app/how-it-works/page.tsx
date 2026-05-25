import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

const problems = [
  {
    num: '01',
    heading: 'Structured for dependency.',
    body: 'Agencies make money on complexity. The more you need them, the better. Strategy stays locked in their heads. Switching costs are high by design.',
  },
  {
    num: '02',
    heading: 'Everything stops when you stop paying.',
    body: 'Retainer ends. Ads stop. Leads dry up. Nothing transfers. You\'ve been renting attention, not building equity.',
  },
  {
    num: '03',
    heading: 'A vendor, not a partner.',
    body: 'Optimizing for deliverables and decks, not your revenue. When results disappoint, there\'s always another tactic to sell you.',
  },
]

const comparison = [
  { category: 'Relationship',  agency: 'Vendor on retainer',          hewn: 'Fractional CMO, embedded' },
  { category: 'What you buy',  agency: 'Campaigns',                    hewn: 'Permanent systems' },
  { category: 'Strategy',      agency: 'Lives in their heads',         hewn: 'Documented, fully yours' },
  { category: 'When you stop', agency: 'Everything stops',             hewn: 'Assets remain and compound' },
  { category: 'Measured by',   agency: 'Deliverables & reports',       hewn: 'Your revenue growth' },
  { category: 'Build order',   agency: 'Whatever they can sell next',  hewn: 'Foundation first, always' },
]

const timeline = [
  { period: 'WKS 1–2',   title: 'Discovery',         desc: 'Full audit of your brand, digital presence, systems, and competitive landscape.' },
  { period: 'WKS 3–8',   title: 'Foundation Sprint', desc: 'Brand identity, website, and Google presence built and launched.' },
  { period: 'MOS 3–6',   title: 'Growth Sprint',     desc: 'Paid media, funnels, automations, and retention systems layered in.' },
  { period: 'MO 6+',     title: 'Scale',             desc: 'Ongoing advisory, optimization, and quarterly growth planning.' },
]

const cadence = [
  { freq: 'Weekly',  dots: 4,  title: 'Async Update',   detail: 'Every Friday',       desc: 'What was done, what\'s next, what needs your input.' },
  { freq: 'Monthly', dots: 1,  title: 'KPI Report',     detail: '1st of each month',  desc: 'Every key metric, every channel, every trend — written clearly.' },
  { freq: 'Monthly', dots: 1,  title: 'Strategy Call',  detail: '60 minutes',         desc: 'Where the next month\'s priorities get set, not just reported on.' },
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

      {/* The Problem — large number treatment */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-baseline gap-4 mb-16 border-b border-black/10 pb-8">
            <SectionEyebrow text="The Problem" light />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-black/10">
            {problems.map((p) => (
              <div key={p.num} className="py-10 md:py-0 md:px-10 first:pl-0 last:pr-0 flex flex-col">
                <span className="font-mono text-[80px] md:text-[96px] leading-none text-black/[0.06] mb-6 select-none">
                  {p.num}
                </span>
                <h3 className="font-display font-medium text-[20px] text-ink leading-snug mb-4">{p.heading}</h3>
                <p className="font-body text-sm text-slate leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Comparison — WSJ table */}
      <section className="bg-iron py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-baseline gap-4 mb-12 border-b border-white/10 pb-8">
            <SectionEyebrow text="The Difference" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16 items-start mb-12">
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-cream leading-tight">
              The traditional agency model,<br /><em style={{ color: '#7CB550' }}>compared.</em>
            </h2>
            <p className="font-body text-sm text-ash leading-relaxed self-end">
              Six dimensions where the engagement model changes everything — not just what you get, but what you&apos;re left with.
            </p>
          </div>

          {/* Table */}
          <div className="w-full">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/10 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/20"></span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">Traditional Agency</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember">Hewn Life</span>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/[0.07] py-5 items-baseline">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">{row.category}</span>
                <span className="font-body text-sm text-white/30 line-through decoration-white/20">{row.agency}</span>
                <span className="font-body text-sm text-cream font-medium">{row.hewn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Engagement — visual timeline */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-baseline gap-4 mb-16 border-b border-black/10 pb-8">
            <SectionEyebrow text="The Engagement" light />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 items-start mb-20">
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-ink leading-tight">
              From first call<br /><em>to market leader.</em>
            </h2>
          </div>

          {/* Desktop timeline */}
          <div className="hidden md:block">
            {/* The line */}
            <div className="relative mb-0">
              <div className="absolute top-[7px] left-0 right-0 border-t border-dashed border-black/20" />
              <div className="grid grid-cols-4 relative">
                {timeline.map((step, i) => (
                  <div key={i} className="pr-10 last:pr-0">
                    {/* Dot on the line */}
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-ember bg-bone mb-6 relative z-10" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-3">{step.period}</p>
                    <p className="font-display font-medium text-[22px] text-ink leading-snug mb-3">{step.title}</p>
                    <p className="font-body text-sm text-slate leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden flex flex-col">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-5 pb-10 last:pb-0 relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-ember bg-bone flex-shrink-0 mt-1 relative z-10" />
                  {i < timeline.length - 1 && (
                    <div className="w-[1px] flex-1 border-l border-dashed border-black/20 mt-1" />
                  )}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-2">{step.period}</p>
                  <p className="font-display font-medium text-[22px] text-ink leading-snug mb-2">{step.title}</p>
                  <p className="font-body text-sm text-slate leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Cadence — rhythm chart */}
      <section className="bg-iron py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-baseline gap-4 mb-16 border-b border-white/10 pb-8">
            <SectionEyebrow text="Communication Cadence" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 items-start mb-16">
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-cream leading-tight">
              You will always know<br /><em style={{ color: '#7CB550' }}>exactly what&apos;s happening.</em>
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.07]">
            {cadence.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_1fr] gap-6 md:gap-12 py-8 items-baseline">
                {/* Frequency label */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1">{c.freq}</p>
                  {/* Rhythm dots */}
                  <div className="flex gap-1.5 mt-2">
                    {Array.from({ length: c.dots }).map((_, j) => (
                      <div key={j} className="w-2 h-2 rounded-full bg-ember" />
                    ))}
                    {Array.from({ length: 4 - c.dots }).map((_, j) => (
                      <div key={j} className="w-2 h-2 rounded-full bg-white/10" />
                    ))}
                  </div>
                </div>
                <p className="font-display text-[28px] text-cream leading-none">{c.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 self-center">{c.detail}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing nudge */}
      <section className="bg-bone py-20 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="font-display font-medium text-[28px] md:text-[36px] text-ink leading-tight">
            Ready to see what&apos;s included<br />
            <em>at each tier?</em>
          </p>
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
