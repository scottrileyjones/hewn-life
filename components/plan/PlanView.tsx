import CalButton from '@/components/CalButton'
import Photo from '@/components/strata/Photo'
import Terrain from '@/components/strata/Terrain'
import { getChallenge, getPlan, kpiGlossary, methodology, plans, proof, type ChallengeId } from '@/lib/playbook'
import type { PhotoKey } from '@/lib/photos'
import type { PlanRecord } from '@/lib/plans/store'

const challengePhoto: Record<ChallengeId, PhotoKey> = {
  capacity: 'baristas', acquisition: 'leatherArtisan', measurement: 'rockStrata', agency: 'teamMeeting',
  creator: 'creator', founder: 'teamMeeting', credibility: 'coastPhone',
}

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.2em]'

/** One stat as a bar on a 0–100 track (the largest share highlighted), or as a figure when it isn't a share. */
function StatRow({ value, pct, label, highlight }: { value: string; pct?: number; label: string; highlight: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-body text-[15px] leading-snug text-ink/75">{label}</p>
      <div className="flex items-center gap-3">
        {pct !== undefined ? (
          <div className="h-3 flex-1 rounded bg-sand" aria-hidden="true">
            <div className={`h-3 rounded ${highlight ? 'bg-dawn' : 'bg-ash/60'}`} style={{ width: `${pct}%` }} />
          </div>
        ) : <div className="flex-1" />}
        <span className="min-w-[5rem] whitespace-nowrap text-right font-display text-[22px] font-semibold tabular-nums text-ink">{value}</span>
      </div>
    </div>
  )
}

export default function PlanView({ record }: { record: PlanRecord }) {
  const { deck, lead } = record
  if (!deck) return null
  const firstName = lead.name.trim().split(/\s+/)[0] || 'there'
  const company = lead.company || 'your business'
  const rec = getPlan(deck.plan)
  const booked = Boolean(record.bookedAt)
  const sources = deck.challenges.map(c => getChallenge(c.id).source)

  return (
    <div className="bg-bone pb-28 text-ink">
      {/* Cover */}
      <section className="px-4 pt-24 sm:px-6">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-forest px-6 py-14 text-mist sm:px-12 sm:py-20">
          <Terrain scene="topo" seed={11} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,38,26,.92), rgba(20,38,26,.55) 75%)' }} />
          <p className={`${eyebrow} text-lime`}>Growth plan · Prepared for {firstName}</p>
          <h1 className="hero-heading fluid-hero mt-4 max-w-3xl leading-[1.04]">
            A growth plan for <span className="accent text-lime">{company}.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-[17px] leading-relaxed text-mist/85">{deck.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#book" className="rounded-full bg-lime px-6 py-3 font-body text-[15px] font-medium text-forest transition hover:bg-[#c7e67a]">
              {booked ? 'About our call' : 'Book a call about this plan'}
            </a>
            <a href="#plan" className="rounded-full border border-mist/30 px-6 py-3 font-body text-[15px] font-medium text-mist transition hover:bg-mist/10">See the plan</a>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <p className={`${eyebrow} text-forest`}>01 · What we heard</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">Your top {deck.challenges.length === 1 ? 'challenge' : `${deck.challenges.length} challenges`}, and how we’d address them.</h2>
        <div className="mt-8 flex flex-col gap-6">
          {deck.challenges.map((c, i) => {
            const ch = getChallenge(c.id)
            const top = Math.max(...ch.stats.map(s => s.pct ?? -1))
            return (
              <article key={c.id} className="grid overflow-hidden rounded-[28px] border border-ink/[0.08] bg-paper lg:grid-cols-[1fr_340px]">
                <div className="flex flex-col gap-6 p-6 sm:p-10">
                  <div>
                    <p className={`${eyebrow} text-ink/55`}>Challenge {i + 1} · {ch.name}</p>
                    <h3 className="mt-2 font-display text-[26px] font-medium leading-tight sm:text-[30px]">{ch.headline}</h3>
                    <p className="mt-3 border-l-2 border-dawn pl-4 font-body text-[17px] leading-relaxed text-ink/80">{c.whyYou}</p>
                  </div>
                  <div className="grid gap-4">
                    {ch.stats.map(s => <StatRow key={s.label} {...s} highlight={s.pct !== undefined && s.pct === top} />)}
                  </div>
                  <div className="rounded-[20px] bg-forest p-6 text-mist">
                    <p className={`${eyebrow} text-lime`}>Our approach</p>
                    <p className="mt-2 font-body text-[16px] leading-relaxed text-mist/90">{ch.solution} {c.firstMove}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {ch.kpis.map(k => (
                        <span key={k} title={kpiGlossary[k]} className="rounded-full bg-lime px-3 py-1 font-mono text-[12px] text-forest">KPI · {k}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative hidden min-h-[320px] lg:block">
                  <Photo name={challengePhoto[c.id]} w={680} h={900} sizes="340px" />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Methodology */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <p className={`${eyebrow} text-forest`}>02 · How we work</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">Four phases, one scorecard.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {methodology.map((m, i) => (
            <div key={m.phase} className={`flex flex-col gap-3 rounded-[24px] p-6 ${i === 3 ? 'bg-forest text-mist' : 'border border-ink/[0.08] bg-paper'}`}>
              <p className={`${eyebrow} ${i === 3 ? 'text-lime' : 'text-ink/55'}`}>{String(i + 1).padStart(2, '0')} · {m.when}</p>
              <h3 className="font-display text-[26px] font-medium">{m.phase}</h3>
              <p className={`font-body text-[15px] leading-relaxed ${i === 3 ? 'text-mist/85' : 'text-ink/70'}`}>{m.body}</p>
              <p className={`mt-auto font-body text-[14px] ${i === 3 ? 'text-lime' : 'text-forest'}`}><b>Deliverable:</b> {m.deliverable}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section id="plan" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16 sm:px-6">
        <p className={`${eyebrow} text-forest`}>03 · Your first 90 days</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">Baseline, launch, then optimize to target.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {([['Days 0–30', deck.roadmap.first30], ['Days 31–60', deck.roadmap.next30], ['Days 61–90', deck.roadmap.last30]] as const).map(([when, items], i) => (
            <div key={when} className={`rounded-[24px] p-6 ${i === 2 ? 'bg-lime text-forest' : 'bg-forest text-mist'}`}>
              <p className={`${eyebrow} ${i === 2 ? 'text-forest' : 'text-lime'}`}>{when}</p>
              <ul className={`mt-4 flex flex-col gap-2 font-body text-[16px] ${i === 2 ? '' : 'text-mist/90'}`}>
                {items.map(t => <li key={t} className="flex gap-2"><span aria-hidden="true">·</span>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendation */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <p className={`${eyebrow} text-forest`}>04 · Where to start</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">We’d start you on <span className="accent" style={{ color: '#1E3826' }}>{rec.name}.</span></h2>
        <p className="mt-3 max-w-2xl font-body text-[17px] text-ink/75">{deck.planReason}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map(p => {
            const on = p.id === rec.id
            return (
              <div key={p.id} className={`flex flex-col gap-3 rounded-[24px] p-6 ${on ? 'bg-lime text-forest' : 'border border-ink/[0.08] bg-paper'}`}>
                {on && <span className="self-start rounded-full bg-forest px-3 py-1 font-mono text-[12px] text-lime">Recommended for you</span>}
                <h3 className="font-display text-[22px] font-semibold">{p.name}</h3>
                <p><span className="font-display text-[34px] font-semibold">{p.price}</span> <span className="font-body text-[14px] opacity-70">{p.per}</span></p>
                <ul className="flex flex-col gap-1 font-body text-[14px] opacity-90">{p.includes.map(x => <li key={x}>{x}</li>)}</ul>
              </div>
            )
          })}
        </div>
        <p className="mt-4 font-body text-[14px] text-ink/60">Flat fees, month to month. Never a percentage of your ad spend.</p>
      </section>

      {/* Proof */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="rounded-[32px] bg-lime p-6 text-forest sm:p-10">
          <p className={`${eyebrow}`}>05 · Track record</p>
          <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">Proven in one of the most regulated categories to market.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {deck.proof.map(id => {
              const p = proof.find(x => x.id === id)!
              return (
                <div key={id} className="rounded-[24px] bg-forest p-6 text-mist">
                  <p className="font-display text-[34px] font-semibold text-lime">{p.value}</p>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-mist/85">{p.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Book */}
      <section id="book" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-[32px] p-6 text-mist sm:p-12">
          <Photo name="clayHands" w={1600} h={900} sizes="(min-width: 1024px) 1152px, 100vw" className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(14,26,18,.92), rgba(14,26,18,.6) 70%)' }} />
          <p className={`${eyebrow} text-lime`}>Next step</p>
          <h2 className="hero-heading fluid-h2 mt-3 max-w-2xl">
            {booked ? <>You’re booked. <span className="accent text-lime">We’ll walk through this together.</span></> : <>AI runs the engine. <span className="accent text-lime">You drive.</span></>}
          </h2>
          <p className="mt-3 max-w-xl font-body text-[17px] text-mist/85">{booked ? 'Bring your questions. We’ll use this plan as the agenda for our call.' : deck.nextStep}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {!booked && <CalButton className="rounded-full bg-lime px-7 py-4 font-body text-[15px] font-medium text-forest transition hover:bg-[#c7e67a]">Book a 30-minute call →</CalButton>}
            {lead.source === 'Website in a Day' && !record.paidAt && (
              <a href="/website-in-a-day#order" className="rounded-full border border-mist/30 bg-mist/10 px-7 py-4 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20">Finish your Website in a Day order</a>
            )}
            <a href="mailto:hello@hewnlife.com" className="rounded-full border border-mist/30 px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-mist/10">hello@hewnlife.com</a>
          </div>
        </div>
        <p className="mt-6 font-body text-[12px] leading-relaxed text-ink/50">
          Sources: {Array.from(new Set(sources)).join('; ')}. Figures are from published research, not Hewn Life client results. Plans are estimates of what we’d do, not a guarantee of results.
        </p>
      </section>
    </div>
  )
}
