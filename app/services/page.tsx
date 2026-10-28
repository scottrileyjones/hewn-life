import type { Metadata } from 'next'
import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Pill, { PillarIcon } from '@/components/Pill'
import { pillars, funnel, archetypes, scorecard, tierNames } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services: The Growth Engine',
  description: 'Nine marketing pillars, each run as a playbook with an owner, a number and a weekly cadence: strategy, paid media, AI creative, SEO + AEO, creators, lifecycle, data, social and brand.',
  alternates: { canonical: 'https://www.hewn.life/services' },
}

const scenarios = [
  { label: 'Conservative', ratio: '2.3', cac: '$400', gp: '$50', payback: '8 mo', ltv: '$900', note: 'Returns more than it costs, but slow payback ties up cash.' },
  { label: 'Target', ratio: '5.2', cac: '$300', gp: '$65', payback: '4.6 mo', ltv: '$1,560', note: 'Short payback, strong multiple. Fund this to the limit of capital.', featured: true },
  { label: 'At scale', ratio: '8.4', cac: '$250', gp: '$70', payback: '3.6 mo', ltv: '$2,100', note: 'Retention and cheap CAC compound into a true asset.' },
]

export default function ServicesPage() {
  return (
    <div className="bg-bone">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-iron text-white">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 80% 0%, rgba(107,173,61,0.22) 0%, transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(139,92,246,0.18) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20 lg:pt-40 lg:pb-28">
          <Pill dark>The Growth Engine</Pill>
          <h1 className="hero-heading fluid-hero mt-6 max-w-4xl">
            Nine pillars. One engine. <span className="accent text-ember">Every number owned.</span>
          </h1>
          <p className="font-body text-lg text-white/60 max-w-2xl mt-6 leading-relaxed">
            World-class marketing runs on nine functions, each staffed, instrumented and accountable to a number.
            We run all nine as playbooks, built AI-native so one lean team out-produces a legacy agency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <CalButton className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition">
              Book a Discovery Call
            </CalButton>
            <Link href="/dashboard" className="inline-flex items-center justify-center border border-white/20 text-white font-body font-medium px-7 py-3.5 rounded-full hover:border-white/50 transition">
              See the live dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── NINE PILLARS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Pill>The frame</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-4 max-w-2xl">Each pillar run as a playbook.</h2>
          </div>
          <p className="font-body text-base text-slate max-w-sm">An owner, the plays, a weekly cadence, and the number it answers to. Click any pillar for the full playbook.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map(p => (
            <Link
              key={p.slug}
              href={`/services/${p.slug}`}
              className="group rounded-3xl bg-white border border-black/[0.06] p-7 flex flex-col hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: p.tint }}>
                  <PillarIcon paths={p.icon} color={p.accent} />
                </span>
                <span className="font-mono text-xs text-ash">{p.num}</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-iron mb-2">{p.name}</h3>
              <p className="font-body text-sm text-slate leading-relaxed mb-6">{p.summary}</p>
              <div className="mt-auto flex items-center justify-between pt-5 border-t border-black/[0.06]">
                <span className="font-body text-xs text-ash">From {tierNames[p.tier]}</span>
                <span className="font-body text-sm font-medium text-iron group-hover:text-ember transition-colors">Playbook →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FUNNEL ── */}
      <section className="bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Pill dot="#8B5CF6">The funnel</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-4">Every dollar runs a tested funnel.</h2>
            <p className="font-body text-base text-slate mt-4">Cold creative earns the click. The right page closes it. Lifecycle turns one purchase into many.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {funnel.map(f => (
              <div key={f.name} className="rounded-3xl border border-black/[0.06] overflow-hidden flex flex-col bg-bone">
                <div className="px-6 py-5" style={{ background: f.bg, color: f.fg }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">{f.stage}</p>
                  <p className="font-display font-semibold text-xl mt-1">{f.name}</p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="font-body text-sm font-medium text-iron mb-4">{f.goal}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {f.creative.map(c => (
                      <span key={c} className="font-body text-xs text-iron bg-white border border-black/[0.08] rounded-full px-2.5 py-1">{c}</span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash mb-1">Lands on</p>
                    <p className="font-body text-sm text-iron mb-4">{f.landsOn}</p>
                    <p className="font-body text-xs text-slate bg-white rounded-xl px-3 py-2 border border-black/[0.05]">{f.benchmark}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHETYPES ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Pill dot="#B5621C">Creative</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-4 max-w-2xl">Eight proven ad archetypes.</h2>
          </div>
          <p className="font-body text-base text-slate max-w-sm">The formats that built the category leaders, produced by our AI creative line and tested through the funnel every week.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {archetypes.map(a => (
            <div key={a.name} className="rounded-3xl bg-white border border-black/[0.06] p-6 flex flex-col min-h-[180px]">
              <h3 className="font-display font-semibold text-lg text-iron mb-2">{a.name}</h3>
              <p className="font-body text-sm text-slate leading-relaxed">{a.body}</p>
              <div className="flex gap-1.5 mt-auto pt-5">
                {a.stages.map(s => (
                  <span key={s} className="font-mono text-[10px] font-semibold rounded-full px-2.5 py-1" style={{ background: s === 'TOF' ? '#3D4A3F' : s === 'MOF' ? '#E9D5FF' : '#0D0D0D', color: s === 'MOF' ? '#6D28D9' : '#fff' }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAC AS CAPEX ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="rounded-[2rem] bg-moss text-white p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 items-start">
            <div>
              <Pill dark>The economics</Pill>
              <h2 className="font-display font-bold fluid-h3 mt-5">Acquisition isn&apos;t an expense. It&apos;s the purchase price of an asset.</h2>
              <p className="font-body text-base text-white/65 mt-5 leading-relaxed">
                $300 spent to win a customer hits this quarter&apos;s P&amp;L. Through the asset lens, that same $300 buys
                $1,560 of lifetime gross profit. We fund growth to the limit of capital while payback stays short.
              </p>
              <p className="font-body text-xs text-white/40 mt-6">Illustrative scenarios. Your model is built on your own numbers.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scenarios.map(s => (
                <div key={s.label} className={`rounded-3xl p-6 flex flex-col ${s.featured ? 'bg-ember text-iron' : 'bg-white/[0.06] border border-white/10'}`}>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${s.featured ? 'text-iron/60' : 'text-white/50'}`}>{s.label}</p>
                  <p className="font-display font-bold text-4xl mt-2">{s.ratio}<span className="text-xl">:1</span></p>
                  <p className={`font-body text-xs ${s.featured ? 'text-iron/60' : 'text-white/50'}`}>LTV : CAC</p>
                  <dl className="mt-5 space-y-2 font-body text-sm">
                    {[['CAC', s.cac], ['Gross profit / mo', s.gp], ['Payback', s.payback], ['Lifetime value', s.ltv]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2"><dt className={s.featured ? 'text-iron/70' : 'text-white/60'}>{k}</dt><dd className="font-semibold">{v}</dd></div>
                    ))}
                  </dl>
                  <p className={`font-body text-xs mt-5 pt-4 border-t ${s.featured ? 'border-iron/15 text-iron/75' : 'border-white/10 text-white/55'}`}>{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SCORECARD ── */}
      <section className="bg-white border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Pill>The scorecard</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-4">Run the function by <span className="accent text-ember">these numbers.</span></h2>
            <p className="font-body text-base text-slate mt-4">Every client gets the same scorecard, live in their dashboard. LTV:CAC and payback are tracked as a pair, the single most important discipline.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scorecard.map(g => (
              <div key={g.group} className="rounded-3xl bg-bone border border-black/[0.05] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ember font-semibold mb-4">{g.group}</p>
                <ul className="space-y-2">
                  {g.items.map(i => (
                    <li key={i} className="flex items-center gap-2.5 font-body text-sm text-iron">
                      <span className="w-1 h-1 rounded-full bg-iron/30" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-iron text-white font-body font-medium px-7 py-3.5 rounded-full hover:bg-charcoal transition">
              Explore the sample dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="rounded-[2rem] bg-iron p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 80% at 50% 120%, rgba(107,173,61,0.3) 0%, transparent 70%)' }} />
          <div className="relative">
            <h2 className="font-display font-bold fluid-h2 text-white max-w-2xl mx-auto">Find out which pillars are holding you back.</h2>
            <p className="font-body text-base text-white/60 mt-4 max-w-xl mx-auto">Every engagement starts with a nine-pillar gap analysis: where you are, what world-class looks like, and the cheapest gaps to close first.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <CalButton className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition">Book a Discovery Call</CalButton>
              <Link href="/pricing" className="inline-flex items-center justify-center border border-white/20 text-white font-body font-medium px-7 py-3.5 rounded-full hover:border-white/50 transition">See Plans &amp; Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
