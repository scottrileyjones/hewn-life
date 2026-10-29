import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import { Glyph } from '@/components/strata/Glyph'
import StickyCta from '@/components/plan/StickyCta'
import { getChallenge, getPlan, plans, proof, type ChallengeId } from '@/lib/playbook'
import type { GlyphKey, SceneName } from '@/lib/strata'
import type { PlanRecord } from '@/lib/plans/store'

/**
 * A lead's personal growth plan. It reads as a report first (findings, a
 * recommendation, a roadmap) and offers the two next steps where a reader
 * would expect them: at the recommendation and at the end.
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
const arrow = (k: string) => (lowerIsBetter.has(k) ? '↓' : '↑')

/** Tag a buy link with the plan's token so Stripe can credit the sale to this lead. */
function withRef(href: string, token: string) {
  if (!/^[a-f0-9]{32}$/.test(token)) return href
  if (href.startsWith('/checkout?')) return `${href}&ref=${token}`
  if (href.startsWith('/website-in-a-day')) return `/website-in-a-day?ref=${token}#order`
  return href
}

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.2em]'
const darkBtn = 'inline-flex items-center justify-center rounded-full bg-forest px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2'
const ghostDark = 'inline-flex items-center justify-center rounded-full border border-forest/25 px-7 py-4 font-body text-[15px] font-medium text-forest transition hover:bg-forest/5'
const limeBtn = 'inline-flex items-center justify-center rounded-full bg-lime px-7 py-4 font-body text-[15px] font-medium text-forest transition hover:bg-[#c7e67a]'
const ghostLight = 'inline-flex items-center justify-center rounded-full border border-mist/30 px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-mist/10'

function SectionHead({ n, label, title }: { n: string; label: string; title: React.ReactNode }) {
  return (
    <>
      <p className={`${eyebrow} text-forest`}>{n} · {label}</p>
      <h2 className="hero-heading fluid-h2 mt-3 max-w-3xl">{title}</h2>
    </>
  )
}

export default function PlanView({ record, review = false }: { record: PlanRecord; review?: boolean }) {
  const { deck, lead } = record
  if (!deck) return null
  const firstName = lead.name.trim().split(/\s+/)[0] || 'there'
  const company = lead.company || 'your business'
  const rec = getPlan(deck.plan)
  const booked = Boolean(record.bookedAt)
  const sources = deck.challenges.map(c => getChallenge(c.id).source)
  const monthly = rec.per === 'per month'
  const date = new Date(record.created || record.sentAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const kpis = Array.from(new Set(deck.challenges.flatMap(c => getChallenge(c.id).kpis))).slice(0, 4)

  // The one purchase we point to: finish an open Website in a Day order, else the recommended plan.
  const unfinishedOrder = lead.source === 'Website in a Day' && !record.paidAt
  const buy = unfinishedOrder
    ? { href: withRef('/website-in-a-day#order', record.token), label: 'Finish my Website in a Day order' }
    : { href: withRef(rec.href, record.token), label: rec.id === 'website-in-a-day' ? 'Start my website · $999' : `Start ${rec.name} · ${rec.price}/mo` }
  const terms = rec.id === 'website-in-a-day' ? 'One-time $999 · live within 24 hours of your brief' : 'Flat monthly fee · no contract · cancel anytime online'

  const BookButton = ({ className, label = 'Book a 30-minute call' }: { className: string; label?: string }) => booked
    ? <span className={`${className} pointer-events-none opacity-80`}>You’re booked ✓</span>
    : <CalButton className={className}>{label}</CalButton>

  return (
    <div className="bg-bone pb-28 text-ink">
      {/* Cover */}
      <section id="plan-hero" className="px-4 pt-24 sm:px-6">
        <div className="relative isolate mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[32px] bg-forest px-6 py-12 text-mist sm:px-12 sm:py-16 lg:grid-cols-[1fr_360px]">
          <Terrain scene="topo" seed={11} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,38,26,.94), rgba(20,38,26,.65) 80%)' }} />
          <div>
            <p className={`${eyebrow} text-lime`}>Growth plan · Prepared for {firstName} · {date}</p>
            <h1 className="hero-heading fluid-hero mt-4 max-w-3xl leading-[1.04]">
              A growth plan for <span className="accent text-lime">{company}.</span>
            </h1>
            {deck.hook && <p className="mt-5 font-display text-[22px] font-medium leading-snug text-mist sm:text-[26px]">{deck.hook}</p>}
            <p className="mt-4 max-w-xl font-body text-[17px] leading-relaxed text-mist/85">{deck.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={buy.href} className={limeBtn}>{buy.label} →</a>
              <BookButton className={ghostLight} />
            </div>
            <p className="mt-4 font-body text-[13px] text-mist/60">{terms}. Built from the answers you gave us, with sourced industry research.</p>
          </div>
          <aside className="self-center rounded-[24px] border border-white/15 bg-black/20 p-6 shadow-glass backdrop-blur-md">
            <p className={`${eyebrow} text-lime`}>At a glance</p>
            <dl className="mt-4 space-y-4 font-body text-[14px]">
              <div>
                <dt className="text-mist/55">Top challenges</dt>
                <dd className="mt-1 space-y-0.5 text-mist">{deck.challenges.map((c, i) => <p key={c.id}>{i + 1}. {getChallenge(c.id).name}</p>)}</dd>
              </div>
              <div>
                <dt className="text-mist/55">What we’d track</dt>
                <dd className="mt-1 text-mist">{kpis.map(k => `${k} ${arrow(k)}`).join(' · ')}</dd>
              </div>
              <div>
                <dt className="text-mist/55">Our recommendation</dt>
                <dd className="mt-1 text-mist"><b className="font-medium">{rec.name}</b> · {rec.price} {rec.per}</dd>
              </div>
            </dl>
            <a href="#recommendation" className="mt-5 inline-block font-body text-[14px] font-medium text-lime">Jump to our recommendation →</a>
          </aside>
        </div>
      </section>

      {/* 01 Findings */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 print:break-before-page print:pt-0">
        <SectionHead n="01" label="What we heard" title={<>What’s holding {company} back.</>} />
        <div className="mt-8 flex flex-col gap-5">
          {deck.challenges.map((c, i) => {
            const ch = getChallenge(c.id)
            const stats = [...ch.stats].sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1)).slice(0, 2)
            return (
              <article key={c.id} className="grid overflow-hidden rounded-[28px] border border-ink/[0.08] bg-paper md:grid-cols-[1fr_320px]">
                <div className="p-6 sm:p-9">
                  <p className={`${eyebrow} text-ink/55`}>Finding {i + 1} · {ch.name}</p>
                  <h3 className="mt-2 font-display text-[24px] font-medium leading-tight sm:text-[27px]">{ch.headline}</h3>
                  <p className="mt-4 border-l-2 border-dawn pl-4 font-body text-[16px] leading-relaxed text-ink/80">{c.whyYou}</p>
                  <div className="mt-5">
                    <p className={`${eyebrow} text-forest`}>Our approach</p>
                    <p className="mt-1.5 font-body text-[16px] leading-relaxed text-ink/80">{ch.solution} {c.firstMove}</p>
                  </div>
                </div>
                <div className="flex flex-col border-t border-ink/[0.06] bg-bone/60 md:border-l md:border-t-0">
                  <div className="relative h-24">
                    <Terrain scene={challengeScene[c.id]} seed={i * 7 + 3} />
                    <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mist backdrop-blur-md">
                        KPI · {ch.kpis.map(k => `${k} ${arrow(k)}`).join(' · ')}
                      </span>
                      <Glyph name={challengeGlyph[c.id]} fg="#F4F2EC" accent="#D6F28B" size={24} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <p className={`${eyebrow} text-ink/50`}>The research</p>
                    {stats.map((s, j) => (
                      <div key={s.label}>
                        <p className={`font-display text-[30px] font-semibold leading-none tracking-[-0.02em] ${j === 0 ? 'text-dawn' : 'text-ink/70'}`}>{s.value}</p>
                        <p className="mt-1 font-body text-[13px] leading-snug text-ink/65">{s.label}</p>
                      </div>
                    ))}
                    <p className="mt-auto font-body text-[11px] leading-snug text-ink/45">Source: {ch.source}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* 02 Recommendation, with the two next steps */}
      <section id="recommendation" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-20 sm:px-6">
        <SectionHead n="02" label="Our recommendation" title={<>Start with <span className="accent" style={{ color: '#1E3826' }}>{rec.name}.</span></>} />
        <div className="mt-8 grid gap-6 rounded-[28px] border border-ink/[0.08] bg-paper p-6 sm:p-9 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="font-body text-[17px] leading-relaxed text-ink/80">{deck.planReason}</p>
            <ul className="mt-5 grid gap-2 font-body text-[15px] text-ink/80 sm:grid-cols-2">
              {rec.includes.map(x => <li key={x} className="flex gap-2"><span className="text-forest">✓</span>{x}</li>)}
            </ul>
          </div>
          <div className="rounded-[22px] bg-lime p-6 text-forest">
            <p className={eyebrow}>{rec.name}</p>
            <p className="mt-2"><span className="font-display text-[38px] font-semibold">{rec.price}</span> <span className="font-body text-[14px] opacity-70">{monthly ? 'per month' : rec.per}</span></p>
            <p className="mt-1 font-body text-[13px] text-forest/70">{terms}</p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a href={buy.href} className={darkBtn}>{buy.label} →</a>
              <BookButton className={ghostDark} label="Talk it through first" />
            </div>
          </div>
        </div>
      </section>

      {/* 03 Roadmap */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHead n="03" label="Your first 90 days" title="Baseline, launch, then grade every dollar." />
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

      {/* 04 Track record */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHead n="04" label="Track record" title="Proven in one of the hardest categories to market." />
        <div className="mt-8 rounded-[28px] bg-forest p-6 text-mist sm:p-9">
          <div className="grid gap-6 md:grid-cols-3">
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
          <a href="/case-studies/telehealth" className="mt-4 inline-block font-body text-[15px] font-medium text-lime">Read the full case study →</a>
        </div>
      </section>

      {/* 05 Options */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHead n="05" label="Other ways to start" title="Every plan, side by side." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map(p => {
            const on = p.id === rec.id
            return (
              <a key={p.id} href={withRef(p.href, record.token)} className={`group flex flex-col gap-3 rounded-[24px] p-6 transition hover:-translate-y-0.5 ${on ? 'border-2 border-forest bg-paper' : 'border border-ink/[0.08] bg-paper hover:border-forest/30'}`}>
                <span className={`self-start rounded-full px-3 py-1 font-mono text-[12px] ${on ? 'bg-forest text-lime' : 'invisible'}`}>Our recommendation</span>
                <h3 className="font-display text-[22px] font-semibold">{p.name}</h3>
                <p><span className="font-display text-[30px] font-semibold">{p.price}</span> <span className="font-body text-[14px] opacity-70">{p.per}</span></p>
                <ul className="flex flex-col gap-1 font-body text-[14px] text-ink/75">{p.includes.map(x => <li key={x}>{x}</li>)}</ul>
                <span className="mt-auto font-body text-[14px] font-medium text-forest">{p.id === 'website-in-a-day' ? 'Start your brief →' : `Choose ${p.name} →`}</span>
              </a>
            )
          })}
        </div>
        <p className="mt-4 font-body text-[14px] text-ink/60">Flat fees, month to month. Never a percentage of your ad spend.</p>
      </section>

      {/* Next step */}
      <section id="plan-close" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-20 sm:px-6">
        <div id="book" className="relative isolate overflow-hidden rounded-[32px] p-6 text-mist sm:p-12">
          <Terrain scene="amber" seed={7} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(14,10,6,.75), rgba(14,10,6,.2) 75%)' }} />
          <p className={`${eyebrow} text-lime`}>Next step</p>
          <h2 className="hero-heading fluid-h2 mt-3 max-w-2xl">
            {booked ? <>You’re booked. <span className="accent text-lime">We’ll walk through this together.</span></> : <>Let’s walk through it <span className="accent text-lime">together.</span></>}
          </h2>
          <p className="mt-3 max-w-xl font-body text-[17px] text-mist/85">{booked ? 'Bring your questions. We’ll use this plan as the agenda for our call.' : deck.nextStep}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {booked ? <a href={buy.href} className={limeBtn}>{buy.label} →</a> : <>
              <BookButton className={limeBtn} />
              <a href={buy.href} className={ghostLight}>{buy.label} →</a>
            </>}
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
