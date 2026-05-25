import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

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

const timeline = [
  {
    period: 'WKS 1–2',
    flex: 2,
    title: 'Discovery',
    desc: 'Full audit — brand, digital, systems, competitive landscape, and ownership goals. Nothing is assumed.',
  },
  {
    period: 'WKS 3–8',
    flex: 6,
    title: 'Foundation Sprint',
    desc: 'Brand identity, website, and Google presence built and launched. Infrastructure before spend.',
  },
  {
    period: 'MOS 3–6',
    flex: 14,
    title: 'Growth Sprint',
    desc: 'Paid media, funnels, automations, and retention systems layered onto the foundation.',
  },
  {
    period: 'MO 6+',
    flex: 26,
    title: 'Scale',
    desc: 'Ongoing advisory, quarterly planning, optimization. The system compounds.',
    ongoing: true,
  },
]

const cadence = [
  { freq: 'Weekly',  dots: 4, title: 'Async Update',  detail: 'Every Friday',      desc: 'What was done, what\'s next, any decisions that need your input.' },
  { freq: 'Monthly', dots: 1, title: 'KPI Report',    detail: '1st of each month', desc: 'Every key metric, every channel, every trend — written clearly, not hidden in slides.' },
  { freq: 'Monthly', dots: 1, title: 'Strategy Call', detail: '60 minutes',        desc: 'Where next month\'s priorities get set, not just reported on.' },
]

export default function HowItWorks() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
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

      {/* ── The Agency Audit ───────────────────────────────────── */}
      <section className="bg-iron py-24 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-12">
            <SectionEyebrow text="The Problem" />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-cream leading-tight mt-2">
              The agency model:<br /><em>a 24-month audit.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {/* Left — what you pay */}
            <div className="bg-iron p-10 md:p-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-6">Total invested</p>
              <p className="font-display text-[88px] md:text-[112px] leading-none text-cream">$84k</p>
              <p className="font-mono text-[10px] text-white/25 mt-2 mb-12">avg. retainer × 24 months</p>

              <div className="border-t border-white/10">
                {[
                  ['Monthly retainer', '$3,500 / mo'],
                  ['Setup & onboarding', '$2,000 – $5,000'],
                  ['Performance fees', '10–20% of ad spend'],
                  ['Ad spend (client-funded)', '$1,500 – $5,000 / mo'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-baseline py-4 border-b border-white/[0.06]">
                    <span className="font-body text-sm text-white/40">{label}</span>
                    <span className="font-mono text-[11px] text-white/25">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — what you own */}
            <div className="bg-forge p-10 md:p-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-6">Assets owned at month 24</p>
              <p className="font-display text-[88px] md:text-[112px] leading-none text-white/10">$0</p>
              <p className="font-mono text-[10px] text-white/25 mt-2 mb-12">stop paying and it all stops</p>

              <div className="border-t border-white/10">
                {[
                  ['Brand strategy', 'Stays in their heads'],
                  ['Website', 'Their CMS, their template'],
                  ['Ad campaigns', 'Pause the day you stop'],
                  ['Automations & CRM', 'Their tools, their logins'],
                  ['Strategy & playbook', 'Not documented, not yours'],
                ].map(([label, note]) => (
                  <div key={label} className="flex justify-between items-baseline py-4 border-b border-white/[0.06]">
                    <span className="font-body text-sm text-white/20 line-through decoration-white/15">{label}</span>
                    <span className="font-mono text-[10px] text-white/15 ml-6 text-right">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Get ───────────────────────────────────────── */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <SectionEyebrow text="What You Get" light />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-ink leading-tight mt-2">
              Assets you own.<br /><em>Systems that compound.</em>
            </h2>
            <p className="font-body text-sm text-slate mt-4 max-w-md leading-relaxed">
              Every deliverable is yours from day one. No proprietary tools. No lock-in. When the engagement ends, the system keeps running.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">

            {/* Hewn */}
            <div className="bg-bone p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/40 mb-3">Hewn — Pillars 01–02</p>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-[72px] leading-none text-ink">{hewnAssets.length}</span>
              </div>
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

            {/* Forged — inverted / featured */}
            <div className="bg-iron p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 mb-3">Forged — Pillars 01–04</p>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-[72px] leading-none text-cream">{hewnAssets.length + forgedAssets.length}</span>
              </div>
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

            {/* Carved */}
            <div className="bg-bone p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/40 mb-3">Carved — Pillars 01–06</p>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-[72px] leading-none text-ink">{hewnAssets.length + forgedAssets.length + carvedAssets.length}</span>
              </div>
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

      {/* ── How It Works — Process Timeline ────────────────────── */}
      <section className="bg-iron py-24 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <SectionEyebrow text="The Process" />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-cream leading-tight mt-2">
              From first call<br /><em style={{ color: '#7CB550' }}>to market leader.</em>
            </h2>
          </div>

          {/* Gantt bar — desktop */}
          <div className="hidden md:flex h-10 w-full mb-0 rounded overflow-hidden">
            {timeline.map((phase, i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-full transition-all ${
                  phase.ongoing
                    ? 'bg-ember'
                    : i === 0
                    ? 'bg-white/[0.06]'
                    : i === 1
                    ? 'bg-white/[0.10]'
                    : 'bg-white/[0.16]'
                } ${i > 0 ? 'ml-px' : ''}`}
                style={{ flex: phase.flex }}
              >
                <span className={`font-mono text-[9px] uppercase tracking-[0.2em] truncate px-2 ${phase.ongoing ? 'text-iron' : 'text-white/40'}`}>
                  {phase.period}{phase.ongoing ? ' →' : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Phase descriptions — desktop */}
          <div className="hidden md:flex w-full border-b border-white/10 mb-0">
            {timeline.map((phase, i) => (
              <div
                key={i}
                className="pt-8 pb-10 pr-8 last:pr-0"
                style={{ flex: phase.flex }}
              >
                <p className="font-display font-medium text-[20px] text-cream leading-snug mb-3">{phase.title}</p>
                <p className="font-body text-xs text-ash leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile timeline */}
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

      {/* ── Communication Cadence ──────────────────────────────── */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <SectionEyebrow text="Staying Aligned" light />
            <h2 className="font-display font-medium text-[36px] md:text-[48px] text-ink leading-tight mt-2">
              You will always know<br /><em>exactly what&apos;s happening.</em>
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
