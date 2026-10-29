import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import { Glyph } from '@/components/strata/Glyph'
import StickyCta from '@/components/plan/StickyCta'
import { getChallenge, getPlan, plans, proof, type ChallengeId } from '@/lib/playbook'
import type { GlyphKey, SceneName } from '@/lib/strata'
import type { PlanRecord } from '@/lib/plans/store'

/**
 * A lead's personal growth plan, laid out as a landing page: a hook, what we
 * heard, the plan we'd start them on, and two actions throughout — buy that
 * plan or book a call.
 */

/** A generated pattern per challenge, in place of photography. */
const challengeScene: Record<ChallengeId, SceneName> = {
  acquisition: 'survey', measurement: 'topo', capacity: 'woodgrain', agency: 'canyon',
  creator: 'amber', founder: 'valley', credibility: 'forest',
}

const challengeGlyph: Record<ChallengeId, GlyphKey> = {
  acquisition: 'media', measurement: 'data', capacity: 'creative', agency: 'strategy',
  creator: 'creators', founder: 'strategy', credibility: 'brand',
}

/** KPIs where lower is the win. */
const lowerIsBetter = new Set(['CAC', 'Cost as % of revenue', 'Time to traction'])

/** Tag a buy link with the plan's token so Stripe can credit the sale to this lead. */
function withRef(href: string, token: string) {
  if (!/^[a-f0-9]{32}$/.test(token)) return href
  if (href.startsWith('/checkout?')) return `${href}&ref=${token}`
  if (href.startsWith('/website-in-a-day')) return `/website-in-a-day?ref=${token}#order`
  return href
}

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.2em]'
const primaryBtn = 'inline-flex items-center justify-center rounded-full bg-lime px-7 py-4 font-body text-[15px] font-medium text-forest transition hover:bg-[#c7e67a]'
const darkBtn = 'inline-flex items-center justify-center rounded-full bg-forest px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2'
const ghostLight = 'inline-flex items-center justify-center rounded-full border border-mist/30 px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-mist/10'
const ghostDark = 'inline-flex items-center justify-center rounded-full border border-forest/25 px-7 py-4 font-body text-[15px] font-medium text-forest transition hover:bg-forest/5'

export default function PlanView({ record, review = false }: { record: PlanRecord; review?: boolean }) {
  const { deck, lead } = record
  if (!deck) return null
  const firstName = lead.name.trim().split(/\s+/)[0] || 'there'
  const company = lead.company || 'your business'
  const rec = getPlan(deck.plan)
  const booked = Boolean(record.bookedAt)
  const sources = deck.challenges.map(c => getChallenge(c.id).source)
  const monthly = rec.per === 'per month'

  // The one purchase we steer to: finish an open Website in a Day order, else the recommended plan.
  const unfinishedOrder = lead.source === 'Website in a Day' && !record.paidAt
  const buy = unfinishedOrder
    ? { href: withRef('/website-in-a-day#order', record.token), label: 'Finish my Website in a Day order' }
    : { href: withRef(rec.href, record.token), label: rec.id === 'website-in-a-day' ? 'Start my website · $999' : `Start ${rec.name} · ${rec.price}/mo` }
  const terms = rec.id === 'website-in-a-day' ? 'One-time $999 · live within 24 hours of your brief' : 'Flat monthly fee · no contract · cancel anytime online'
  const hook = deck.hook || `A growth plan for ${company}.`

  const BookButton = ({ className }: { className: string }) => booked
    ? <span className={`${className} pointer-events-none opacity-80`}>You’re booked ✓</span>
    : <CalButton className={className}>Book a free 30-min call</CalButton>

  return (
    <div className="bg-bone pb-28 text-ink">
      {/* Hero: the hook and both actions */}
      <section id="plan-hero" className="px-4 pt-24 sm:px-6">
        <div className="relative isolate mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[32px] bg-forest px-6 py-12 text-mist sm:px-12 sm:py-16 lg:grid-cols-[1fr_340px]">
          <Terrain scene="topo" seed={11} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,38,26,.94), rgba(20,38,26,.6) 80%)' }} />
          <div>
            <p className={`${eyebrow} text-lime`}>Prepared for {firstName}{lead.company ? ` · ${lead.company}` : ''}</p>
            <h1 className="hero-heading fluid-hero mt-4 max-w-3xl leading-[1.04]">{hook}</h1>
            <p className="mt-5 max-w-xl font-body text-[17px] leading-relaxed text-mist/85">{deck.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={buy.href} className={primaryBtn}>{buy.label} →</a>
              <BookButton className={ghostLight} />
            </div>
            <p className="mt-4 font-body text-[13px] text-mist/65">{terms}</p>
          </div>
          <a href={buy.href} className="group hidden rounded-[24px] border border-white/15 bg-black/20 p-6 shadow-glass backdrop-blur-md transition hover:bg-black/30 lg:block">
            <p className={`${eyebrow} text-lime`}>Recommended for you</p>
            <p className="mt-3 font-display text-[28px] font-semibold">{rec.name}</p>
            <p className="mt-1"><span className="font-display text-[34px] font-semibold">{rec.price}</span> <span className="font-body text-[14px] text-mist/65">{rec.per}</span></p>
            <ul className="mt-4 space-y-1.5 font-body text-[14px] text-mist/85">
              {rec.includes.map(x => <li key={x} className="flex gap-2"><span className="text-lime">✓</span>{x}</li>)}
            </ul>
            <p className="mt-5 font-body text-[14px] font-medium text-lime">{unfinishedOrder ? 'Finish your order' : `Start ${rec.name}`} <span className="inline-block transition group-hover:translate-x-0.5">→</span></p>
          </a>
        </div>
      </section>

      {/* What we heard: three compact cards */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 print:break-before-page print:pt-0">
        <p className={`${eyebrow} text-forest`}>What we heard</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">What’s holding {company} back, and our first move on each.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {deck.challenges.map((c, i) => {
            const ch = getChallenge(c.id)
            const stat = [...ch.stats].sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1))[0]
            const kpi = ch.kpis[0]
            return (
              <article key={c.id} className="flex flex-col overflow-hidden rounded-[28px] border border-ink/[0.08] bg-paper">
                <div className="relative h-28">
                  <Terrain scene={challengeScene[c.id]} seed={i * 7 + 3} />
                  <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mist backdrop-blur-md">
                      We move {kpi} {lowerIsBetter.has(kpi) ? '↓' : '↑'}
                    </span>
                    <Glyph name={challengeGlyph[c.id]} fg="#F4F2EC" accent="#D6F28B" size={26} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className={`${eyebrow} text-ink/55`}>{ch.name}</p>
                  <p className="mt-3 font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-dawn">{stat.value}</p>
                  <p className="mt-1.5 font-body text-[13px] leading-snug text-ink/60">{stat.label}</p>
                  <p className="mt-4 font-body text-[16px] leading-relaxed text-ink/85">{c.whyYou}</p>
                  <p className="mt-4 border-t border-ink/[0.08] pt-4 font-body text-[15px] leading-relaxed text-ink/75"><b className="text-forest">Our first move:</b> {c.firstMove}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* The offer */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid items-center gap-6 rounded-[32px] bg-lime p-6 text-forest sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className={eyebrow}>Where we’d start</p>
            <h2 className="hero-heading fluid-h2 mt-3 max-w-2xl">{rec.name}, <span className="accent">{rec.price}{monthly ? '/mo' : ''}.</span></h2>
            <p className="mt-3 max-w-2xl font-body text-[17px] text-forest/80">{deck.planReason}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href={buy.href} className={darkBtn}>{buy.label} →</a>
            <BookButton className={ghostDark} />
          </div>
        </div>
      </section>

      {/* 90 days */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className={`${eyebrow} text-forest`}>Your first 90 days</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">Baseline, launch, then grade every dollar.</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {([['Days 0–30', 'Set up', deck.roadmap.first30], ['Days 31–60', 'Launch', deck.roadmap.next30], ['Days 61–90', 'Optimize', deck.roadmap.last30]] as const).map(([when, name, items], i) => (
            <li key={when} className="rounded-[24px] border border-ink/[0.08] bg-paper p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest font-display text-sm font-medium text-lime">{i + 1}</span>
                <div>
                  <p className="font-display text-[19px] font-medium leading-tight">{name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{when}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 font-body text-[15px] text-ink/80">
                {items.map(t => <li key={t} className="flex gap-2"><span className="text-dawn">—</span>{t}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Track record */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="rounded-[32px] bg-forest p-6 text-mist sm:p-10">
          <p className={`${eyebrow} text-lime`}>Track record</p>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {deck.proof.map(id => {
              const p = proof.find(x => x.id === id)!
              return (
                <div key={id}>
                  <p className="font-display text-[36px] font-semibold leading-none text-lime">{p.value}</p>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-mist/80">{p.label}</p>
                </div>
              )
            })}
          </div>
          <p className="mt-6 font-body text-[12px] leading-relaxed text-mist/55">Our team’s work before founding Hewn Life. These outcomes aren’t typical, and yours will depend on your business. <a href="/legal/results-disclaimer" className="underline underline-offset-2">Results Disclaimer</a></p>
        </div>
      </section>

      {/* Every plan */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className={`${eyebrow} text-forest`}>Pick your starting point</p>
        <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">Flat fees. No contracts.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map(p => {
            const on = p.id === rec.id
            return (
              <a key={p.id} href={withRef(p.href, record.token)} className={`group flex flex-col gap-3 rounded-[24px] p-6 transition hover:-translate-y-0.5 ${on ? 'bg-lime text-forest hover:bg-[#c7e67a]' : 'border border-ink/[0.08] bg-paper hover:border-forest/30'}`}>
                <span className={`self-start rounded-full px-3 py-1 font-mono text-[12px] ${on ? 'bg-forest text-lime' : 'invisible'}`}>Recommended for you</span>
                <h3 className="font-display text-[22px] font-semibold">{p.name}</h3>
                <p><span className="font-display text-[34px] font-semibold">{p.price}</span> <span className="font-body text-[14px] opacity-70">{p.per}</span></p>
                <ul className="flex flex-col gap-1 font-body text-[14px] opacity-90">{p.includes.map(x => <li key={x}>{x}</li>)}</ul>
                <span className={`mt-auto inline-flex self-start rounded-full px-5 py-2.5 font-body text-[14px] font-medium transition ${on ? 'bg-forest text-mist' : 'border border-forest/20 text-forest group-hover:bg-forest group-hover:text-mist'}`}>
                  {p.id === 'website-in-a-day' ? 'Start your brief →' : `Choose ${p.name} →`}
                </span>
              </a>
            )
          })}
        </div>
        <p className="mt-4 font-body text-[14px] text-ink/60">Month to month. Never a percentage of your ad spend.</p>
      </section>

      {/* Close: the same two actions */}
      <section id="plan-close" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16 sm:px-6">
        <div id="book" className="relative isolate overflow-hidden rounded-[32px] p-6 text-mist sm:p-12">
          <Terrain scene="amber" seed={7} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(14,10,6,.75), rgba(14,10,6,.2) 75%)' }} />
          <p className={`${eyebrow} text-lime`}>Ready when you are</p>
          <h2 className="hero-heading fluid-h2 mt-3 max-w-2xl">
            {booked ? <>You’re booked. <span className="accent text-lime">We’ll walk through this together.</span></> : <>AI runs the engine. <span className="accent text-lime">You drive.</span></>}
          </h2>
          <p className="mt-3 max-w-xl font-body text-[17px] text-mist/85">{booked ? 'Bring your questions. We’ll use this plan as the agenda for our call.' : `Start ${rec.name} today, or talk it through with us first. Either way, ${firstName}, this plan is yours to keep.`}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={buy.href} className={primaryBtn}>{buy.label} →</a>
            <BookButton className={ghostLight} />
          </div>
          <p className="mt-5 font-body text-[13px] text-mist/65">Questions? <a href="mailto:hello@hewn.life" className="underline underline-offset-2">hello@hewn.life</a></p>
        </div>
        <p className="mt-6 font-body text-[12px] leading-relaxed text-ink/50">
          Sources: {Array.from(new Set(sources)).join('; ')}. Figures are from published research, not Hewn Life client results. This plan was written with AI from your answers, so tell us if anything looks off. Plans are estimates of what we’d do, not a guarantee of results. See our <a href="/legal/results-disclaimer" className="underline underline-offset-2">Results Disclaimer</a>.
        </p>
      </section>

      {!review && <StickyCta label={rec.name} price={`${rec.price} ${rec.per}`} href={buy.href} cta={unfinishedOrder ? 'Finish order' : `Start ${rec.name}`} showBook={!booked} />}
    </div>
  )
}
