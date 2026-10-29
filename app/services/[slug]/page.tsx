import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import Photo from '@/components/strata/Photo'
import { Glyph, Pill, Check } from '@/components/strata/Glyph'
import { pillars, getPillar, tierNames } from '@/lib/services'
import { colors } from '@/lib/strata'
import { pillarPhotos } from '@/lib/photos'

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

const phaseColor = [colors.forest2, colors.lichen, colors.lime]

export default function PillarPage({ params }: { params: { slug: string } }) {
  const p = getPillar(params.slug)
  if (!p) notFound()

  const idx = pillars.indexOf(p)
  const prev = pillars[(idx + pillars.length - 1) % pillars.length]
  const next = pillars[(idx + 1) % pillars.length]

  return (
    <div className="bg-bone pb-24 pt-20 text-ink">
      {/* ── HEADER ── */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:pt-14">
        <Link href="/services" className="font-body text-sm text-ink/60 transition-colors hover:text-ink">← All services</Link>
        <div className="mt-8 flex items-start gap-5">
          <span className="hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-[18px] bg-forest sm:flex">
            <Glyph name={p.glyph} fg={colors.mist} accent={colors.lichen} size={38} />
          </span>
          <div>
            <Pill>Playbook {p.num} · Modeled on {p.modeledOn}</Pill>
            <h1 className="mt-4 font-display text-[clamp(40px,5.4vw,76px)] font-medium leading-none tracking-[-0.045em]">{p.name}</h1>
            <p className="accent mt-3 text-xl text-ink/70 md:text-2xl">{p.deck}</p>
          </div>
        </div>
      </section>

      {pillarPhotos[p.slug] && (
        <div className="mx-auto max-w-7xl px-5 pb-3.5">
          <div className="relative isolate aspect-[16/10] overflow-hidden rounded-[32px] bg-sand sm:aspect-[21/8]">
            <Photo name={pillarPhotos[p.slug]} w={1280} h={488} sizes="(min-width: 1280px) 1240px, 100vw" priority />
          </div>
        </div>
      )}

      {/* ── PLAYBOOK ── */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-3.5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-3.5">
            <div className="relative isolate overflow-hidden rounded-[22px] p-7 text-mist">
              <Terrain scene="amber" seed={60 + idx} className="-z-20" />
              <div className="absolute inset-0 -z-10 bg-[rgba(20,16,10,.55)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Accountable for</p>
              <div className="mt-4 space-y-3">
                {p.accountableFor.map(k => (
                  <div key={k} className="flex items-center justify-between border-b border-mist/15 pb-3 last:border-0 last:pb-0">
                    <span className="font-display text-lg font-medium">{k}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist/60">Live</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 font-body text-xs text-mist/70">Tracked daily in your growth dashboard.</p>
            </div>

            <div className="rounded-[22px] border border-ink/[0.08] bg-white p-7">
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Across the rollout</p>
              <ol className="space-y-5">
                {p.rollout.map((r, i) => (
                  <li key={r.phase} className="flex gap-4">
                    <span className="mt-1 h-4 w-[5px] flex-shrink-0" style={{ background: phaseColor[i] }} />
                    <div>
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em]">{r.phase}</p>
                      <p className="mt-1 font-body text-sm text-ink/70">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[22px] bg-forest p-7 text-mist">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/65">What you get</p>
              <ul className="space-y-2.5">
                {p.deliverables.map(d => (
                  <li key={d} className="flex items-center gap-3 font-body text-sm">
                    <svg viewBox="0 0 100 100" className="h-4 w-4 flex-shrink-0" aria-hidden="true"><rect x="14" y="30" width="16" height="56" fill={colors.mist} /><polygon points="30,62 86,34 86,48 30,76" fill={colors.lime} /></svg>
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-body text-xs text-mist/70">Included from the <Link href="/pricing" className="font-medium text-lime underline underline-offset-2">{tierNames[p.tier]}</Link> plan.</p>
            </div>
          </div>

          <div className="rounded-[22px] border border-ink/[0.08] bg-white p-7 md:p-10">
            <div className="mb-8 flex items-center gap-3">
              <span className="rounded-full bg-lime px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-forest">The plays</span>
              <span className="accent text-sm text-ink/55">in order</span>
            </div>
            <ol className="relative">
              <span className="absolute bottom-2 left-[15px] top-2 w-px bg-ink/[0.08]" aria-hidden="true" />
              {p.plays.map((play, i) => (
                <li key={play.title} className="relative flex gap-5 pb-8 last:pb-0">
                  <span className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest font-display text-sm font-medium text-mist">{i + 1}</span>
                  <div className="pt-1">
                    <h2 className="font-display text-lg font-medium">{play.title}</h2>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/70">{play.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 border-t border-ink/[0.08] pt-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-full bg-forest px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-mist">Keep running</span>
                <span className="accent text-sm text-ink/55">every week</span>
              </div>
              <ul className="space-y-3">
                {p.cadence.map(c => (
                  <li key={c} className="flex gap-3 font-body text-sm"><Check className="mt-[2px] h-4 w-4 flex-shrink-0" />{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREV / NEXT ── */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid grid-cols-2 gap-3">
          {[{ label: 'Previous', q: prev }, { label: 'Next', q: next }].map(({ label, q }) => (
            <Link key={label} href={`/services/${q.slug}`} className={`flex items-center gap-4 rounded-[22px] border border-ink/[0.08] bg-white p-5 transition-colors hover:border-ink/25 ${label === 'Next' ? 'flex-row-reverse text-right' : ''}`}>
              <span className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-forest sm:flex"><Glyph name={q.glyph} fg={colors.mist} accent={colors.lichen} size={26} /></span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{label === 'Previous' ? '← Previous' : 'Next →'}</span>
                <span className="mt-1 block font-display text-base font-medium md:text-lg">{q.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="relative isolate overflow-hidden rounded-[32px] text-mist">
          <Terrain scene="ember" seed={70 + idx} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.65), rgba(20,16,10,.15))' }} />
          <div className="flex flex-col justify-between gap-8 p-8 md:flex-row md:items-center md:p-14">
            <div>
              <h2 className="font-display text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.08] tracking-[-0.03em]">Put this playbook to work.</h2>
              <p className="mt-3 max-w-lg font-body text-mist/80">We&apos;ll grade this pillar for your business on the discovery call. Free, 30 minutes, no pitch deck.</p>
            </div>
            <CalButton className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Book a discovery call</CalButton>
          </div>
        </section>
      </div>
    </div>
  )
}
