import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import ProcessTimeline from '@/components/ProcessTimeline'
import CalButton from '@/components/CalButton'
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

const cadence = [
  { freq: 'Weekly',  dots: 4, title: 'Async Update',  detail: 'Every Friday',      desc: 'What was done, what\'s next, what needs your input.' },
  { freq: 'Monthly', dots: 1, title: 'KPI Report',    detail: '1st of each month', desc: 'Every metric, every channel, every trend — written clearly, not buried in slides.' },
  { freq: 'Monthly', dots: 1, title: 'Strategy Call', detail: '60 minutes',        desc: 'Where the next month\'s priorities get set, not just reported on.' },
]

export default function HowItWorks() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-up max-w-2xl">
            <SectionEyebrow text="How It Works" light />
            <h1 className="hero-heading text-[44px] md:text-[60px] text-[#0D0D0D] mb-6 leading-[1.05]">
              Most agencies sell campaigns.<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>We build systems.</span>
            </h1>
            <p className="font-body text-lg text-[#6B6560] max-w-xl leading-relaxed mb-10">
              We deploy AI to compress months of work into days — cutting costs without cutting corners. Then we layer in the design taste and market instinct that actually wins.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CalButton className="inline-flex items-center justify-center bg-[#0D0D0D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200">
                Book a Discovery Call
              </CalButton>
              <Link href="/pricing" className="inline-flex items-center justify-center border border-black/15 text-[#0D0D0D] font-body font-medium px-8 py-4 rounded-full hover:border-black/30 transition-all duration-200">
                See Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process Timeline ──────────────────────────────────── */}
      <section className="bg-white pb-28 px-6 lg:px-12 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto">

          {/* WSJ-style section header */}
          <div className="flex items-center gap-4 mb-16 pb-6 border-b border-black/[0.08]">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/30">Fig. 1</span>
            <div className="flex-1 h-[0.5px] bg-black/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/30">The Hewn Life Engagement Model</span>
            <div className="w-8 h-[0.5px] bg-black/10" />
          </div>

          <ProcessTimeline />

          {/* Footnote annotation */}
          <div className="mt-14 pt-6 border-t border-black/[0.06] flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/20">* AI-compressed timeline vs. traditional agency average</p>
            <div className="hidden md:block flex-1 h-[0.5px] bg-black/[0.06]" />
            <p className="font-mono text-[9px] text-black/20">Source: internal benchmarks, 2024–2025</p>
          </div>
        </div>
      </section>

      {/* ── Speed Table ───────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-center gap-4 mb-14 pb-6 border-b border-white/[0.08]">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/20">Fig. 2</span>
            <div className="flex-1 h-[0.5px] bg-white/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/20">AI Compression — Before vs. Now</span>
            <div className="w-8 h-[0.5px] bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 mb-14 items-end">
            <div>
              <h2 className="hero-heading text-[36px] md:text-[52px] text-white leading-tight">
                What used to take<br />
                <span className="accent" style={{ color: '#6BAD3D' }}>weeks takes hours.</span>
              </h2>
            </div>
            <p className="font-body text-base text-white/50 leading-relaxed max-w-md self-end">
              AI doesn&apos;t replace the strategy — it eliminates the delay. Every hour we save on execution is redirected into the craft and judgment that actually moves the needle.
            </p>
          </div>

          <div className="border border-white/[0.08] divide-y divide-white/[0.06]">
            {/* Header */}
            <div className="grid grid-cols-[1fr_130px_160px] px-6 md:px-10 py-4 bg-white/[0.03]">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">Task</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">Traditional</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6BAD3D]/70">With AI</span>
            </div>
            {[
              ['Deep market & competitor analysis', 'weeks',            'hours'],
              ['Ad creative variations at scale',   'days',             'minutes'],
              ['Campaign setup & launch',           'weeks',            '48 hours'],
              ['Performance reporting',             'monthly',          'real-time'],
              ['Trend & competitor monitoring',     'quarterly review', 'continuous'],
              ['Ad model optimization',             'manual, periodic', 'always on'],
            ].map(([task, before, after]) => (
              <div key={task} className="grid grid-cols-[1fr_130px_160px] px-6 md:px-10 py-5 items-center hover:bg-white/[0.02] transition-colors">
                <span className="font-body text-sm text-white/60 pr-4">{task}</span>
                <span className="font-mono text-[11px] text-white/20 line-through">{before}</span>
                <span className="font-mono text-[11px] text-[#6BAD3D]">{after}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Get ─────────────────────────────────────── */}
      <section className="bg-[#F9F7F3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-center gap-4 mb-14 pb-6 border-b border-black/[0.08]">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/25">Fig. 3</span>
            <div className="flex-1 h-[0.5px] bg-black/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/25">Assets You Own — By Tier</span>
            <div className="w-8 h-[0.5px] bg-black/10" />
          </div>

          <div className="mb-12">
            <h2 className="hero-heading text-[36px] md:text-[52px] text-[#0D0D0D] leading-tight mb-4">
              Assets you own.<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>Systems that compound.</span>
            </h2>
            <p className="font-body text-sm text-[#6B6560] max-w-md leading-relaxed">
              No proprietary tools. No lock-in. Every deliverable is yours from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.08]">
            <div className="bg-[#F9F7F3] p-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/30 mb-3">Hewn — Tier 01</p>
              <p className="font-display text-[64px] leading-none text-[#0D0D0D] mb-1">{hewnAssets.length}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6BAD3D] mb-8">deliverables built & owned</p>
              <ul className="space-y-3">
                {hewnAssets.map(a => (
                  <li key={a} className="grid grid-cols-[12px_1fr] gap-2 items-start">
                    <span className="font-mono text-[9px] text-[#6BAD3D] mt-[4px]">—</span>
                    <span className="font-body text-sm text-[#6B6560] leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0D0D0D] p-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-3">Forged — Tier 02</p>
              <p className="font-display text-[64px] leading-none text-white mb-1">{hewnAssets.length + forgedAssets.length}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6BAD3D] mb-3">deliverables built & owned</p>
              <p className="font-mono text-[9px] text-white/20 mb-6">Everything in Hewn, plus:</p>
              <ul className="space-y-3">
                {forgedAssets.map(a => (
                  <li key={a} className="grid grid-cols-[12px_1fr] gap-2 items-start">
                    <span className="font-mono text-[9px] text-[#6BAD3D] mt-[4px]">—</span>
                    <span className="font-body text-sm text-white/60 leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F9F7F3] p-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/30 mb-3">Carved — Tier 03</p>
              <p className="font-display text-[64px] leading-none text-[#0D0D0D] mb-1">{hewnAssets.length + forgedAssets.length + carvedAssets.length}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6BAD3D] mb-3">deliverables built & owned</p>
              <p className="font-mono text-[9px] text-black/25 mb-6">Everything in Forged, plus:</p>
              <ul className="space-y-3">
                {carvedAssets.map(a => (
                  <li key={a} className="grid grid-cols-[12px_1fr] gap-2 items-start">
                    <span className="font-mono text-[9px] text-[#6BAD3D] mt-[4px]">—</span>
                    <span className="font-body text-sm text-[#6B6560] leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link href="/pricing" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6BAD3D] hover:opacity-70 transition-opacity">
              See pricing for each tier <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Communication Cadence ─────────────────────────────── */}
      <section className="bg-white py-24 md:py-32 border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-center gap-4 mb-14 pb-6 border-b border-black/[0.08]">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/25">Fig. 4</span>
            <div className="flex-1 h-[0.5px] bg-black/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/25">Communication Cadence</span>
            <div className="w-8 h-[0.5px] bg-black/10" />
          </div>

          <div className="mb-12">
            <h2 className="hero-heading text-[36px] md:text-[52px] text-[#0D0D0D] leading-tight">
              You will always know<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>exactly what&apos;s happening.</span>
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-black/[0.07]">
            {cadence.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[100px_200px_160px_1fr] gap-4 md:gap-12 py-8 items-center">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/30 mb-2">{c.freq}</p>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className={`w-2 h-2 rounded-full ${j < c.dots ? 'bg-[#6BAD3D]' : 'bg-black/8'}`} />
                    ))}
                  </div>
                </div>
                <p className="font-display font-medium text-[28px] text-[#0D0D0D] leading-none">{c.title}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/30">{c.detail}</p>
                <p className="font-body text-sm text-[#6B6560] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
