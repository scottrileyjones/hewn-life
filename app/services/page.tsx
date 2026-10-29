import type { Metadata } from 'next'
import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import Contour from '@/components/strata/Contour'
import Photo from '@/components/strata/Photo'
import { h2Class } from '@/components/strata/Page'
import { Glyph, Pill } from '@/components/strata/Glyph'
import { pillars, funnel, archetypes, scorecard, tierNames } from '@/lib/services'
import { colors } from '@/lib/strata'

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

const stageTag: Record<string, string> = { TOF: 'bg-forest-2 text-mist', MOF: 'bg-lime text-forest', BOF: 'bg-ink text-mist' }
const h2 = 'font-display font-medium leading-[1.08] tracking-[-0.03em] text-balance'

export default function ServicesPage() {
  return (
    <div className="bg-bone pb-24 pt-20 text-ink">
      {/* ── HERO ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="relative isolate overflow-hidden rounded-[32px] text-mist">
          <Terrain scene="amber" seed={12} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.65) 0%, rgba(20,16,10,.2) 60%, transparent 85%)' }} />
          <div className="px-6 pb-14 pt-24 lg:px-14 lg:pb-20 lg:pt-36">
            <Pill dark>The growth engine</Pill>
            <h1 className="mt-5 max-w-[14ch] font-display text-[clamp(44px,5.8vw,84px)] font-medium leading-none tracking-[-0.045em]">Nine pillars. One team. Every number owned.</h1>
            <p className="mt-5 max-w-[34em] font-body text-lg text-mist/80">
              World-class marketing runs on nine functions, each staffed, instrumented and accountable to a number. We run all nine as playbooks, built AI-native so one lean team out-produces a legacy agency.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <CalButton className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Book a discovery call</CalButton>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20">See the dashboard →</Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── PILLARS ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Pill>The playbooks</Pill>
            <h2 className={`${h2} mt-4 max-w-2xl text-[clamp(32px,3.6vw,50px)]`}>Each pillar, run as a playbook.</h2>
          </div>
          <p className="max-w-sm font-body text-ink/70">An owner, the plays, a weekly cadence and the number it answers to. Choose any pillar for the full playbook.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(p => (
            <Link key={p.slug} href={`/services/${p.slug}`} className="group flex flex-col rounded-[22px] border border-ink/[0.08] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
              <div className="mb-6 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-forest">
                  <Glyph name={p.glyph} fg={colors.mist} accent={colors.lichen} size={30} />
                </span>
                <span className="font-mono text-xs text-ink/55">{p.num}</span>
              </div>
              <h3 className="mb-2 font-display text-xl font-medium">{p.name}</h3>
              <p className="mb-6 font-body text-sm leading-relaxed text-ink/70">{p.summary}</p>
              <div className="mt-auto flex items-center justify-between border-t border-ink/[0.08] pt-5">
                <span className="font-body text-xs text-ink/55">From {tierNames[p.tier]}</span>
                <span className="font-body text-sm font-medium text-forest">Playbook →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LAYERS ── */}
      <section className="mx-auto max-w-7xl px-5 pb-3.5">
        <div className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[32px] bg-sand text-mist lg:min-h-[520px]">
          <Photo name="rockStrata" film w={1280} h={600} sizes="(min-width: 1280px) 1240px, 100vw" className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.78), rgba(20,16,10,.38) 45%, rgba(20,16,10,.12) 75%), linear-gradient(0deg, rgba(20,16,10,.55), transparent 55%)' }} />
          <div className="max-w-xl p-7 sm:p-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80">Built in layers</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.6vw,50px)]`}>Nine layers. <em className="accent">Each one</em> carries weight.</h2>
            <p className="mt-3.5 font-body text-[17px] text-mist/85">Growth that lasts is laid down the way rock is: one dependable layer on the next. Skip one and everything above it cracks.</p>
          </div>
        </div>
      </section>

      {/* ── FUNNEL ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="rounded-[32px] bg-forest px-5 py-12 text-mist sm:px-12 sm:py-[72px]">
          <div className="mb-10 grid items-end gap-8 lg:grid-cols-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">How a dollar travels</span>
              <h2 className={`${h2} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Every dollar runs a mapped funnel.</h2>
            </div>
            <p className="max-w-[32em] font-body text-mist/75 lg:justify-self-end">Wide, cheap attention at the edge; loyal customers at the summit. Every ring is a stage we test every week.</p>
          </div>
          <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_1.3fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[22px]"><Contour /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {funnel.map(f => (
                <div key={f.name} className="flex flex-col rounded-[22px] p-5" style={{ background: f.bg, color: f.fg }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">{f.stage}</p>
                  <p className="mt-1 font-display text-xl font-medium">{f.name}</p>
                  <p className="mt-2 font-body text-sm opacity-80">{f.goal}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.creative.map(c => <span key={c} className="rounded-full border border-current/20 px-2.5 py-1 font-body text-xs opacity-90" style={{ borderColor: 'currentColor' }}>{c}</span>)}
                  </div>
                  <p className="mt-auto pt-5 font-body text-xs opacity-75">Lands on {f.landsOn.toLowerCase()} · {f.benchmark}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── ARCHETYPES ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Pill>Creative</Pill>
            <h2 className={`${h2} mt-4 max-w-2xl text-[clamp(32px,3.6vw,50px)]`}>Eight proven ad formats.</h2>
          </div>
          <p className="max-w-sm font-body text-ink/70">The formats that built the category leaders, produced by our AI creative line and tested through the funnel every week.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {archetypes.map(a => (
            <div key={a.name} className="flex min-h-[180px] flex-col rounded-[22px] border border-ink/[0.08] bg-white p-6">
              <h3 className="mb-2 font-display text-lg font-medium">{a.name}</h3>
              <p className="font-body text-sm leading-relaxed text-ink/70">{a.body}</p>
              <div className="mt-auto flex gap-1.5 pt-5">
                {a.stages.map(s => <span key={s} className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-medium ${stageTag[s]}`}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ECONOMICS ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="relative isolate overflow-hidden rounded-[32px] p-4 lg:p-12">
          <Terrain scene="valley" seed={18} className="-z-10" />
          <div className="grid items-start gap-8 rounded-[22px] border border-mist/30 p-6 text-mist backdrop-blur-xl lg:grid-cols-[1fr_1.6fr] lg:p-10" style={{ background: 'linear-gradient(140deg, rgba(20,34,24,.6), rgba(20,34,24,.4))' }}>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/85">The economics</span>
              <h2 className={`${h2} mt-3 text-[clamp(28px,3vw,40px)]`}>Acquisition isn&apos;t an expense. It&apos;s the price of an asset.</h2>
              <p className="mt-4 font-body text-mist/80">$300 spent to win a customer hits this quarter&apos;s P&amp;L. Through the asset lens, the same $300 buys $1,560 of lifetime gross profit. We fund growth to the limit of capital while payback stays short.</p>
              <p className="mt-5 font-body text-xs text-mist/70">Illustrative scenarios. Your model is built on your own numbers.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {scenarios.map(s => (
                <div key={s.label} className={`flex flex-col rounded-[18px] p-5 ${s.featured ? 'bg-lime text-forest' : 'border border-mist/20 bg-forest/40'}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-75">{s.label}</p>
                  <p className="mt-2 font-display text-4xl font-medium tracking-[-0.03em]">{s.ratio}<span className="text-xl">:1</span></p>
                  <p className="font-body text-xs opacity-75">LTV : CAC</p>
                  <dl className="mt-5 space-y-2 font-body text-sm tabular-nums">
                    {[['CAC', s.cac], ['Gross profit / mo', s.gp], ['Payback', s.payback], ['Lifetime value', s.ltv]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2"><dt className="opacity-80">{k}</dt><dd className="font-medium">{v}</dd></div>
                    ))}
                  </dl>
                  <p className="mt-5 border-t border-current/15 pt-4 font-body text-xs opacity-85">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── SCORECARD ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Pill>The scorecard</Pill>
          <h2 className={`${h2} mt-4 text-[clamp(32px,3.6vw,50px)]`}>Run the function by <em className="accent text-forest">these numbers.</em></h2>
          <p className="mt-4 font-body text-ink/70">Every client gets the same scorecard, live in their dashboard. LTV:CAC and payback are tracked as a pair.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scorecard.map(g => (
            <div key={g.group} className="rounded-[22px] border border-ink/[0.08] bg-white p-6">
              <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-forest">{g.group}</p>
              <ul className="space-y-2">
                {g.items.map(i => (
                  <li key={i} className="flex items-center gap-2.5 font-body text-sm"><span className="h-3 w-[3px] bg-lichen" />{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">Explore the sample dashboard →</Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="relative isolate flex min-h-[460px] items-end overflow-hidden rounded-[32px] text-mist">
          <Terrain scene="ember" seed={33} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.6), transparent 70%)' }} />
          <div className="p-7 sm:p-14">
            <h2 className={`${h2} max-w-[16ch] text-[clamp(34px,4.4vw,60px)]`}>Find out which pillars are holding you back.</h2>
            <p className="mt-4 max-w-[34em] font-body text-[17px] text-mist/85">Every engagement starts with a nine-pillar gap analysis: where you are, what world-class looks like, and the cheapest gaps to close first.</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <CalButton className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Book a discovery call</CalButton>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20">See plans &amp; pricing</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
