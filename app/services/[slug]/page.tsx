import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CalButton from '@/components/CalButton'
import Pill, { PillarIcon } from '@/components/Pill'
import { pillars, getPillar, tierNames } from '@/lib/services'

export function generateStaticParams() {
  return pillars.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPillar(params.slug)
  if (!p) return {}
  return {
    title: `${p.name}: Playbook`,
    description: p.summary,
    alternates: { canonical: `https://www.hewn.life/services/${p.slug}` },
  }
}

export default function PillarPage({ params }: { params: { slug: string } }) {
  const p = getPillar(params.slug)
  if (!p) notFound()

  const idx = pillars.indexOf(p)
  const prev = pillars[(idx + pillars.length - 1) % pillars.length]
  const next = pillars[(idx + 1) % pillars.length]

  return (
    <div className="bg-bone">
      {/* ── HEADER ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-36 pb-12">
        <Link href="/services" className="font-body text-sm text-slate hover:text-iron transition-colors">← All services</Link>
        <div className="flex items-start gap-5 mt-8">
          <span className="hidden sm:flex w-16 h-16 rounded-2xl items-center justify-center flex-shrink-0 bg-iron">
            <PillarIcon paths={p.icon} color="#6BAD3D" className="w-7 h-7" />
          </span>
          <div>
            <Pill>Playbook {p.num} · Modeled on {p.modeledOn}</Pill>
            <h1 className="hero-heading fluid-hero text-iron mt-4">{p.name}</h1>
            <p className="accent text-xl md:text-2xl text-slate mt-3">{p.deck}</p>
          </div>
        </div>
      </section>

      {/* ── PLAYBOOK ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-iron text-white p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">Accountable for</p>
              <div className="mt-4 space-y-3">
                {p.accountableFor.map(k => (
                  <div key={k} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="font-display font-semibold text-lg">{k}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Live</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-white/45 mt-5">Tracked daily in your growth dashboard.</p>
            </div>

            <div className="rounded-3xl bg-white border border-black/[0.06] p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash mb-5">Across the rollout</p>
              <ol className="space-y-5">
                {p.rollout.map((r, i) => (
                  <li key={r.phase} className="flex gap-4">
                    <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: ['#3D4A3F', '#8B5CF6', '#6BAD3D'][i] }} />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-iron font-semibold">{r.phase}</p>
                      <p className="font-body text-sm text-slate mt-1">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl p-7" style={{ background: p.tint }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-iron/50 mb-4">What you get</p>
              <ul className="space-y-2.5">
                {p.deliverables.map(d => (
                  <li key={d} className="flex items-center gap-3 font-body text-sm text-iron">
                    <svg className="w-4 h-4 flex-shrink-0 text-ember" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {d}
                  </li>
                ))}
              </ul>
              <p className="font-body text-xs text-iron/60 mt-5">Included from the <Link href="/pricing" className="font-semibold text-iron underline underline-offset-2">{tierNames[p.tier]}</Link> plan.</p>
            </div>
          </div>

          {/* Right column — the plays */}
          <div className="rounded-3xl bg-white border border-black/[0.06] p-7 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold bg-ember/20 text-moss rounded-full px-3 py-1">The plays</span>
              <span className="accent text-sm text-ash">in order</span>
            </div>
            <ol className="relative">
              <span className="absolute left-[15px] top-2 bottom-2 w-px bg-black/[0.08]" aria-hidden="true" />
              {p.plays.map((play, i) => (
                <li key={play.title} className="relative flex gap-5 pb-8 last:pb-0">
                  <span className="relative z-10 w-8 h-8 rounded-full bg-moss text-white font-display font-semibold text-sm flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="pt-1">
                    <h2 className="font-display font-semibold text-lg text-iron">{play.title}</h2>
                    <p className="font-body text-sm text-slate leading-relaxed mt-1.5">{play.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 pt-8 border-t border-black/[0.06]">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold bg-moss text-white rounded-full px-3 py-1">Keep running</span>
                <span className="accent text-sm text-ash">every week</span>
              </div>
              <ul className="space-y-3">
                {p.cadence.map(c => (
                  <li key={c} className="flex gap-3 font-body text-sm text-iron">
                    <span className="text-ember font-bold leading-5">✱</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREV / NEXT ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <div className="grid grid-cols-2 gap-4">
          {[{ label: 'Previous', p: prev }, { label: 'Next', p: next }].map(({ label, p: q }) => (
            <Link key={label} href={`/services/${q.slug}`} className={`rounded-3xl bg-white border border-black/[0.06] p-6 hover:border-black/20 transition-colors ${label === 'Next' ? 'text-right' : ''}`}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">{label === 'Previous' ? '←' : ''} {label} {label === 'Next' ? '→' : ''}</p>
              <p className="font-display font-semibold text-base md:text-lg text-iron mt-1">{q.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="rounded-[2rem] bg-iron p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-bold fluid-h3 text-white">Put this playbook to work.</h2>
            <p className="font-body text-base text-white/60 mt-3 max-w-lg">We&apos;ll grade this pillar for your business on the discovery call. Free, 30 minutes, no pitch deck.</p>
          </div>
          <CalButton className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition whitespace-nowrap">Book a Discovery Call</CalButton>
        </div>
      </section>
    </div>
  )
}
