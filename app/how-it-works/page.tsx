import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

const agencyComplaints = [
  {
    stat: '26%',
    label: 'of your budget',
    point: 'Goes to channels that don\'t work.',
    detail: 'Agencies know it and keep billing anyway. Opaque pricing isn\'t accidental — it\'s structural. The more confused you are, the longer you stay.',
  },
  {
    stat: '#1',
    label: 'reason clients fire agencies',
    point: 'Perceived indifference.',
    detail: 'You\'re one of 20 clients. Your urgency isn\'t theirs. The retainer is their product. Your growth is an afterthought.',
  },
  {
    stat: '87%',
    label: 'of businesses',
    point: 'Report campaign performance issues.',
    detail: 'Because agencies are execution shops pretending to be strategic partners. They handle the "how." Nobody owns your "why" — or your outcome.',
  },
  {
    stat: '$0',
    label: 'in assets after 24 months',
    point: 'Stop paying and everything stops.',
    detail: 'The strategy stays in their heads. The site runs on their CMS. The campaigns pause. $84k invested. Infrastructure built: none.',
  },
]

const hewnAssets = [
  'Brand strategy & positioning',
  'Logo & visual identity system',
  'Brand style guide',
  'Messaging framework & taglines',
  'Custom website design & build',
  'SEO foundation & on-page optimization',
  'Google Business Profile setup',
]

const forgedAssets = [
  'Paid media campaigns (Google + Meta)',
  'Sales funnels & landing pages',
  'Marketing automation sequences',
  'CRM setup & pipeline management',
  'Booking & scheduling system',
  'New customer onboarding sequence',
  'Retention & re-engagement campaigns',
]

const carvedAssets = [
  'Review generation system',
  'UGC strategy & campaigns',
  'Referral program with tracking',
  'Video & written testimonial capture',
  'Monthly KPI dashboard',
  'Quarterly growth planning sessions',
  'Fractional CMO advisory layer',
]

const aiStats = [
  { num: '22%',    label: 'higher conversions',       note: 'AI-driven campaigns vs. traditional' },
  { num: '30–70%', label: 'conversion lift',          note: 'from AI personalization' },
  { num: '49%',    label: 'higher cross-sell revenue', note: 'organizations using AI vs. not' },
]

const timeline = [
  { period: 'WKS 1–2', flex: 2,  title: 'Discovery',          desc: 'Full audit — brand, digital, systems, competitive landscape. Nothing assumed.' },
  { period: 'WKS 3–8', flex: 6,  title: 'Foundation Sprint',  desc: 'Brand identity, website, Google presence built and launched. Infrastructure before spend.' },
  { period: 'MOS 3–6', flex: 14, title: 'Growth Sprint',      desc: 'Paid media, funnels, automations, and retention systems layered onto the foundation.' },
  { period: 'MO 6+',   flex: 26, title: 'Scale',              desc: 'Ongoing advisory, quarterly planning, optimization. The system compounds.', ongoing: true },
]

const cadence = [
  { freq: 'Weekly',  dots: 4, title: 'Async Update',  detail: 'Every Friday',      desc: 'What was done, what\'s next, what needs your input.' },
  { freq: 'Monthly', dots: 1, title: 'KPI Report',    detail: '1st of each month', desc: 'Every metric, every channel, every trend — written clearly, not buried in slides.' },
  { freq: 'Monthly', dots: 1, title: 'Strategy Call', detail: '60 minutes',        desc: 'Where the next month\'s priorities get set, not just reported on.' },
]

export default function HowItWorks() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
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
            We deploy AI intelligently — compressing months of work into days, cutting costs without cutting corners. Then we layer in the design taste and market instinct to make sure it actually wins.
          </p>
        </div>
      </section>

      {/* ── The Agency Problem — data-backed ─────────────────── */}
      <section className="bg-bone py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 mb-20 items-end">
            <div>
              <SectionEyebrow text="Traditional Agencies" light />
              <h2 className="font-display font-medium text-[44px] md:text-[60px] text-ink leading-tight mt-2">
                What working with a<br /><span className="font-bold">typical agency costs you.</span>
              </h2>
            </div>
            <p className="font-body text-base text-slate leading-relaxed max-w-md self-end">
              These aren&apos;t edge cases. 87% of businesses report campaign performance issues in any given year. The traditional agency model is structurally misaligned with your success — by design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
            {agencyComplaints.map((c, i) => (
              <div key={i} className="bg-bone p-12 md:p-16 flex flex-col">
                <div className="flex items-baseline gap-5 mb-8">
                  <span className="font-display text-[88px] md:text-[120px] leading-none text-ink">{c.stat}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate/40 leading-tight max-w-[120px]">{c.label}</span>
                </div>
                <p className="font-display font-medium text-[24px] text-ink leading-snug mb-4">{c.point}</p>
                <p className="font-body text-base text-slate leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The AI Advantage ─────────────────────────────────── */}
      <section className="bg-iron py-28 md:py-40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 mb-20 items-end">
            <div>
              <SectionEyebrow text="How We're Different" />
              <h2 className="font-display font-medium text-[44px] md:text-[60px] text-cream leading-tight mt-2">
                We know what sells.<br /><span style={{ color: '#6BAD3D' }} className="font-bold">We know what&apos;s beautiful.</span>
              </h2>
            </div>
            <p className="font-body text-base text-ash leading-relaxed max-w-md self-end">
              &ldquo;30 years of experience&rdquo; means nothing if the taste is bad and the data is ignored. We use AI-driven market analysis, conversion intelligence, and trend data to inform every decision — then apply the human design judgment that turns insight into something people actually want to buy.
            </p>
          </div>

          {/* AI stat callouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 mb-16">
            {aiStats.map((s, i) => (
              <div key={i} className="bg-iron p-12 md:p-14">
                <p className="font-display text-[88px] md:text-[112px] leading-none text-cream mb-3">{s.num}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember mb-2">{s.label}</p>
                <p className="font-mono text-[11px] text-white/25">{s.note}</p>
              </div>
            ))}
          </div>

          {/* Speed compression — annotated before/after */}
          <div className="bg-forge mb-px">
            <div className="px-6 md:px-14 pt-10 md:pt-12 pb-5 md:pb-6 border-b border-white/10 flex items-center justify-between">
              <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] md:tracking-[0.25em] text-white/25">
                What used to take weeks — now takes hours
              </p>
              <div className="hidden md:flex items-center gap-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">Before</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">Now</span>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {[
                ['Deep market & competitor analysis', 'weeks',            'hours'],
                ['Ad creative variations at scale',   'days',             'minutes'],
                ['Campaign setup & launch',           'weeks',            '48 hours'],
                ['Performance reporting',             'monthly',          'real-time'],
                ['Trend & competitor monitoring',     'quarterly review', 'continuous'],
                ['Ad model optimization',             'manual, periodic', 'AI-driven, always on'],
              ].map(([task, before, after]) => (
                <div key={task} className="px-6 md:px-14 py-5 md:py-6">
                  <span className="font-body text-sm md:text-base text-cream/50 block mb-3">{task}</span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[20px] md:text-[22px] leading-none text-white/20 line-through">{before}</span>
                    <span className="font-mono text-[10px] text-white/20">→</span>
                    <span className="font-display text-[20px] md:text-[22px] leading-none text-ember">{after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrast — agency vs Hewn Life */}
          <div className="bg-iron">
            {/* Mobile header */}
            <div className="md:hidden grid grid-cols-2 px-6 pt-10 pb-4 border-b border-white/10 gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">Agency</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ember">Hewn Life</span>
            </div>
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-[140px_1fr_1fr] px-14 pt-12 pb-5 border-b border-white/10 gap-4">
              <span />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Traditional Agency</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember">Hewn Life</span>
            </div>
            {[
              ['Strategy',     '"We\'ve seen this work before."',              'AI deep market analysis — not gut feel'],
              ['Creative',     'Junior team executing a template',              'Human taste on top of AI-generated intelligence'],
              ['Speed',        'Weeks to launch anything',                      'AI compresses the slow work. We move fast.'],
              ['Optimization', 'Manual, slow, often skipped',                   'AI models running ads and optimizing continuously'],
              ['Intel',        'Gut feel and guesswork',                        'Competitor & trend data monitored and acted on — always'],
              ['Edge',         '30 years of experience (maybe bad taste)',       'What converts, made beautiful. You can\'t lose that.'],
            ].map(([cat, agency, hewn]) => (
              <div key={cat} className="border-b border-white/[0.06]">
                {/* Mobile */}
                <div className="md:hidden px-6 py-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20 block mb-3">{cat}</span>
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <span className="font-body text-sm text-white/25 line-through decoration-white/15 leading-snug">{agency}</span>
                    <span className="font-body text-sm text-cream leading-snug">{hewn}</span>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[140px_1fr_1fr] px-14 py-5 gap-4 items-start">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20 pt-[3px]">{cat}</span>
                  <span className="font-body text-base text-white/25 line-through decoration-white/15 pr-4">{agency}</span>
                  <span className="font-body text-base text-cream">{hewn}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pull quote */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <p className="font-display text-[30px] md:text-[44px] text-cream/60 leading-snug max-w-3xl">
              &ldquo;AI does the work that used to take weeks.<br />
              <em className="text-cream/80">We focus on the work that actually needs a human.</em>&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── What You Get ─────────────────────────────────────── */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <SectionEyebrow text="What You Get" light />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-ink leading-tight mt-2">
              Assets you own.<br /><span className="font-bold">Systems that compound.</span>
            </h2>
            <p className="font-body text-sm text-slate mt-4 max-w-md leading-relaxed">
              No proprietary tools. No lock-in. Every deliverable is yours from day one. When the engagement ends, the system keeps running.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            <div className="bg-bone p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/40 mb-3">Hewn — Pillars 01–02</p>
              <p className="font-display text-[72px] leading-none text-ink mb-1">{hewnAssets.length}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-8">assets built & owned</p>
              <ul className="space-y-3">
                {hewnAssets.map(a => (
                  <li key={a} className="grid grid-cols-[16px_1fr] gap-2 items-start">
                    <span className="font-mono text-[10px] text-ember mt-[3px]">—</span>
                    <span className="font-body text-sm text-slate leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-iron p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 mb-3">Forged — Pillars 01–04</p>
              <p className="font-display text-[72px] leading-none text-cream mb-1">{hewnAssets.length + forgedAssets.length}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-3">assets built & owned</p>
              <p className="font-mono text-[10px] text-white/25 mb-6">Everything in Hewn, plus:</p>
              <ul className="space-y-3">
                {forgedAssets.map(a => (
                  <li key={a} className="grid grid-cols-[16px_1fr] gap-2 items-start">
                    <span className="font-mono text-[10px] text-ember mt-[3px]">—</span>
                    <span className="font-body text-sm text-ash leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-bone p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/40 mb-3">Carved — Pillars 01–06</p>
              <p className="font-display text-[72px] leading-none text-ink mb-1">{hewnAssets.length + forgedAssets.length + carvedAssets.length}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember mb-3">assets built & owned</p>
              <p className="font-mono text-[10px] text-slate/30 mb-6">Everything in Forged, plus:</p>
              <ul className="space-y-3">
                {carvedAssets.map(a => (
                  <li key={a} className="grid grid-cols-[16px_1fr] gap-2 items-start">
                    <span className="font-mono text-[10px] text-ember mt-[3px]">—</span>
                    <span className="font-body text-sm text-slate leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link href="/pricing" className="inline-flex items-center gap-2 font-body text-sm font-medium text-ember hover:opacity-70 transition-opacity">
              See pricing for each tier <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Process Timeline ──────────────────────────────────── */}
      <section className="bg-iron py-24 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <SectionEyebrow text="The Process" />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-cream leading-tight mt-2">
              From first call<br /><em style={{ color: '#7CB550' }}>to market leader.</em>
            </h2>
          </div>

          {/* Gantt bar */}
          <div className="hidden md:flex h-10 w-full mb-0 rounded overflow-hidden">
            {timeline.map((phase, i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-full ${
                  phase.ongoing ? 'bg-ember' : i === 0 ? 'bg-white/[0.06]' : i === 1 ? 'bg-white/[0.10]' : 'bg-white/[0.16]'
                } ${i > 0 ? 'ml-px' : ''}`}
                style={{ flex: phase.flex }}
              >
                <span className={`font-mono text-[9px] uppercase tracking-[0.2em] truncate px-2 ${phase.ongoing ? 'text-iron' : 'text-white/40'}`}>
                  {phase.period}{phase.ongoing ? ' →' : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden md:flex w-full border-b border-white/10">
            {timeline.map((phase, i) => (
              <div key={i} className="pt-8 pb-10 pr-8 last:pr-0" style={{ flex: phase.flex }}>
                <p className="font-display font-medium text-[20px] text-cream leading-snug mb-3">{phase.title}</p>
                <p className="font-body text-xs text-ash leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>

          <div className="md:hidden flex flex-col divide-y divide-white/[0.07]">
            {timeline.map((phase, i) => (
              <div key={i} className="py-8 grid grid-cols-[80px_1fr] gap-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ember leading-relaxed">{phase.period}</p>
                <div>
                  <p className="font-display font-medium text-[20px] text-cream leading-snug mb-2">{phase.title}</p>
                  <p className="font-body text-sm text-ash leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Communication Cadence ─────────────────────────────── */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <SectionEyebrow text="Staying Aligned" light />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-ink leading-tight mt-2">
              You will always know<br /><span className="font-bold">exactly what&apos;s happening.</span>
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-black/10">
            {cadence.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[120px_200px_160px_1fr] gap-4 md:gap-12 py-8 items-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/40 mb-2">{c.freq}</p>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className={`w-2.5 h-2.5 rounded-full ${j < c.dots ? 'bg-ember' : 'bg-black/10'}`} />
                    ))}
                  </div>
                </div>
                <p className="font-display text-[32px] text-ink leading-none">{c.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate/35">{c.detail}</p>
                <p className="font-body text-sm text-slate leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
