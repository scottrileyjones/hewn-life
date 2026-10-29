import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import Contour from '@/components/strata/Contour'
import Photo from '@/components/strata/Photo'
import PlanPicker from '@/components/strata/PlanPicker'
import { Glyph, Pill } from '@/components/strata/Glyph'
import { HeroRidge, PaybackChart, StrataBars, ElevationClimb, CreativeGrid, RidgeChart, dashboardSummary, verdictOf } from '@/components/strata/Charts'
import { pillars, tierNames } from '@/lib/services'
import { colors } from '@/lib/strata'

const steps = [
  { title: 'Audit', when: 'Week 1', body: 'We grade your nine pillars against the best in class and find the cheapest gaps to close.', Visual: StrataBars },
  { title: 'Plan', when: 'Weeks 1–2', body: 'A growth model, a scaling gate and a 90-day roadmap with one owner per number.', Visual: ElevationClimb },
  { title: 'Build', when: 'Days 0–30', body: 'Tracking, the creative matrix and the first funnel tests go live.', Visual: CreativeGrid },
  { title: 'Grade', when: 'Every week', body: 'Every strategy gets a verdict on the dashboard. Winners scale.', Visual: () => <Contour grade="B−" /> },
]

const comparisonRows = [
  { service: 'Brand strategy and identity', traditional: '$15,000–$50,000 project' },
  { service: 'Website design and build', traditional: '$15,000–$40,000 project' },
  { service: 'Paid media management', traditional: '$3,000–$10,000/mo + 15%' },
  { service: 'SEO, AEO and content', traditional: '$3,000–$8,000/mo' },
  { service: 'Lifecycle, CRM and automation', traditional: '$5,000–$15,000 setup' },
  { service: 'Social and creator programs', traditional: '$2,000–$5,000/mo' },
  { service: 'Strategy and fractional CMO', traditional: '$5,000–$15,000/mo' },
]

const formats = [
  { format: 'Founder / expert', hook: '“The three noises your furnace makes before it quits.”', cta: 'Watch the 30-second fix', scene: 'amber' as const },
  { format: 'Outcome proof', hook: '$98 per booked job, down from $171.', cta: 'See the numbers', bg: colors.forest },
  { format: 'Raw UGC', hook: '“They showed up at 7am and the house was warm by 8.”', cta: 'Book a tune-up', scene: 'ember' as const },
  { format: 'Comparison', hook: 'Flat-rate tune-up vs. the hourly guess.', cta: 'Compare', bg: colors.paper },
  { format: 'Quiz hook', hook: 'Is your system costing you $40 a month? 60-second check.', cta: 'Start the check', bg: colors.lime },
  { format: 'Social proof', hook: '4.9 from 612 reviews in the valley.', cta: 'Read reviews', scene: 'valley' as const },
]

const faqs = [
  { q: 'Do you require long-term contracts?', a: 'No. Monthly agreements. We earn the next month by delivering this one.' },
  { q: 'Who actually does the work?', a: 'The founder leads strategy on every account, backed by an AI-native production line. You are never handed to a junior.' },
  { q: 'Do you take a percentage of ad spend?', a: 'Never. One flat monthly fee, whatever you spend on media.' },
  { q: 'What if I only need one project?', a: 'Websites, brand refreshes and creative packs are available at flat fees, with no retainer.' },
  { q: 'How fast do we start?', a: 'Onboarding within 48 hours, the nine-pillar audit in week one, first quick wins inside 30 days.' },
]

const sectionHead = 'mx-auto mb-12 max-w-[720px] text-center'
const h2 = 'mt-4 font-display font-medium tracking-[-0.03em] leading-[1.08] text-balance'

export default function Home() {
  const dash = dashboardSummary()

  return (
    <div className="bg-bone pb-24 pt-20 text-ink">

      {/* ── HERO ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="relative isolate flex min-h-0 flex-col justify-between overflow-hidden rounded-[32px] text-mist lg:min-h-[680px]">
          <Terrain scene="amber" seed={7} className="-z-10" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.62) 0%, rgba(20,16,10,.18) 50%, transparent 75%), linear-gradient(0deg, rgba(20,16,10,.55) 0%, transparent 35%)' }} />
          <div className="grid items-end gap-10 px-6 pb-7 pt-24 lg:grid-cols-[1.2fr_1fr] lg:px-14 lg:pb-10 lg:pt-32">
            <div>
              <Pill dark>Made by hand · Scaled by AI</Pill>
              <h1 className="mt-5 max-w-[13ch] font-display text-[clamp(44px,5.8vw,84px)] font-medium leading-none tracking-[-0.045em]">AI runs the engine. <em className="accent block text-lime">Artists drive.</em></h1>
              <p className="mt-5 max-w-[30em] font-body text-lg text-mist/80">
                Senior marketers and artists make every call. AI does the heavy lifting: 20–40 assets a week and a live dashboard that grades every dollar. A full agency, one flat monthly fee.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <CalButton className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Book a discovery call</CalButton>
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20">See the dashboard →</Link>
              </div>
            </div>
            <div className="w-full max-w-[340px] rounded-[22px] border border-mist/30 p-[18px] pb-3.5 backdrop-blur-xl lg:justify-self-end" style={{ background: 'linear-gradient(140deg, rgba(244,242,236,.2), rgba(244,242,236,.07))', boxShadow: '0 24px 60px rgba(20,16,10,.35), inset 0 1px 0 rgba(255,255,255,.18)' }}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/75">Booked revenue · 90 days</span>
                <span className="font-mono text-xs text-lime">▲ 34%</span>
              </div>
              <p className="mt-1 font-display text-[32px] font-medium tracking-[-0.03em] tabular-nums">$48,200</p>
              <HeroRidge />
              <div className="grid grid-cols-3 gap-2 border-t border-mist/20 pt-2.5 font-body text-xs text-mist/70 tabular-nums">
                {[['Leads', '142'], ['ROAS', '4.8×'], ['CAC', '$112']].map(([k, v]) => <div key={k}>{k}<b className="block text-sm font-medium text-mist">{v}</b></div>)}
              </div>
            </div>
          </div>
          <div className="mx-6 mb-6 grid border-t border-mist/20 sm:grid-cols-3 lg:mx-14 lg:mb-8">
            {[['Covers', 'All nine marketing pillars'], ['Starts at', '$2,500 / month, flat'], ['Ships', '20–40 assets a week']].map(([k, v], i) => (
              <div key={k} className={`pt-3 sm:pr-5 sm:pt-4 ${i ? 'sm:border-l sm:border-mist/20 sm:pl-5' : ''}`}>
                <small className="block font-body text-xs text-mist/65">{k}</small>
                <b className="font-body text-[15px] font-medium">{v}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 pb-2 pt-6 font-body text-sm text-ink/70">
        <span>Free nine-pillar audit on every discovery call</span>
        <span className="hidden h-1 w-1 rounded-full bg-ink/40 sm:block" />
        <span>Onboarding within 48 hours</span>
        <span className="hidden h-1 w-1 rounded-full bg-ink/40 sm:block" />
        <span>Never a percentage of ad spend</span>
      </div>

      {/* ── WHO IT'S FOR ── */}
      <section className="mx-auto max-w-7xl px-5 pt-24 lg:pt-28">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-2">
          <div>
            <Pill>Who we build for</Pill>
            <h2 className={`${h2} text-[clamp(32px,3.6vw,50px)]`}>For the businesses people already love.</h2>
          </div>
          <div className="max-w-[32em] lg:justify-self-end">
            <p className="font-body text-[17px] text-ink/70">Owner-run shops, studios, service teams and makers. You have the craft and the customers who come back. We build the engine that brings the next thousand.</p>
            <Link href="/who-we-serve" className="mt-3 inline-flex font-body text-[15px] font-medium text-forest underline underline-offset-4">See who we serve: e-commerce, local businesses, startups and more →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2">
          {([
            ['cafeOwner', 'Hospitality', 'col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto', 900, 900],
            ['leatherArtisan', 'Makers and retail', 'aspect-[4/5] lg:aspect-[4/3]', 600, 450],
            ['creator', 'Experts and creators', 'aspect-[4/5] lg:aspect-[4/3]', 600, 450],
            ['baristas', 'Service teams', 'col-span-2 aspect-[16/9] lg:aspect-[8/3]', 1200, 450],
          ] as const).map(([name, label, cls, w, h]) => (
            <figure key={name} className={`relative isolate overflow-hidden rounded-[22px] bg-sand ${cls}`}>
              <Photo name={name} w={w} h={h} sizes={name === 'cafeOwner' || name === 'baristas' ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 320px, 50vw'} />
              <span className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(0deg, rgba(20,16,10,.5), transparent)' }} />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-mist/90 px-3 py-1.5 font-body text-xs font-medium text-forest backdrop-blur">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:py-28">
        <div className={sectionHead}>
          <Pill>How it works</Pill>
          <h2 className={`${h2} text-[clamp(32px,3.6vw,50px)]`}>From audit to engine in 90 days.</h2>
          <p className="mt-3.5 font-body text-[17px] text-ink/70">Four steps, the same for every client. You always know what happens next and what it is measured by.</p>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, when, body, Visual }, i) => (
            <article key={title}>
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/4.4] rounded-[22px] bg-forest"><Visual /></div>
              <h3 className="mt-4 font-display text-lg font-medium">{i + 1}. {title}</h3>
              <p className="mt-1.5 max-w-[30ch] font-body text-sm text-ink/70">{body}</p>
              <p className="mt-2.5 font-mono text-[11px] tracking-[0.12em] text-ink/55">{when}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── THE PRODUCT ── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 lg:grid-cols-[0.8fr_1.4fr] lg:pb-28">
        <div>
          <Pill>The product</Pill>
          <h2 className={`${h2} text-[clamp(30px,3.2vw,44px)]`}>Every engagement runs on a live growth dashboard.</h2>
          <p className="mt-3.5 font-body text-ink/70">Meta, Google and your CRM in one view, refreshed daily, with a verdict on every strategy.</p>
          <div className="mt-7 grid gap-2">
            {[
              ['What does the verdict mean?', 'Each strategy is compared with your target cost per customer: scale it at or under target, watch it within 1.5×, cut or fix it above that.'],
              ['Where does the data come from?', 'The Meta and Google Ads APIs and your CRM, with conversions sent server-side so the platforms optimize on real bookings.'],
              ['Who reads it with me?', 'The founder walks through it with you every month, with the next three tests already written.'],
            ].map(([q, a], i) => (
              <details key={q} open={i === 0} className="group rounded-[14px] border border-ink/[0.08] bg-white px-[18px] py-3.5">
                <summary className="flex cursor-pointer list-none justify-between gap-3 font-body text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                  {q}<span className="text-ink/50 group-open:hidden">+</span><span className="hidden text-ink/50 group-open:inline">−</span>
                </summary>
                <p className="mt-2 font-body text-sm text-ink/70">{a}</p>
              </details>
            ))}
          </div>
          <Link href="/dashboard" className="mt-6 inline-flex font-body text-sm font-medium text-forest underline underline-offset-4">Open the full sample dashboard →</Link>
        </div>
        <Link href="/dashboard" className="relative isolate flex items-center justify-center overflow-hidden rounded-[32px] px-3.5 py-7 sm:px-10 sm:py-14 lg:min-h-[560px]" aria-label="Open the sample dashboard">
          <Terrain scene="sage" seed={21} className="-z-10" />
          <div className="w-full max-w-[760px] rounded-[26px] bg-[#101511] p-3.5 shadow-[0_40px_80px_rgba(20,30,20,.35)] lg:[transform:perspective(1600px)_rotateX(4deg)_rotateY(-7deg)]">
            <div className="overflow-hidden rounded-[14px] bg-[#111814] p-4 text-mist">
              <div className="flex flex-wrap items-baseline justify-between gap-2.5">
                <h3 className="font-display text-lg font-medium">Every platform, <em className="accent text-dawn">every strategy</em></h3>
                <span className="rounded-full border border-[#C4B07E]/35 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#C4B07E]">Sample data</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 tabular-nums">
                {[['Spend', '$' + (dash.spend / 1000).toFixed(1) + 'K'], ['Booked jobs', String(dash.jobs)], ['Cost / job', '$' + Math.round(dash.spend / dash.jobs)], ['ROAS', (dash.revenue / dash.spend).toFixed(2) + '×']].map(([k, v]) => (
                  <div key={k} className="rounded-[10px] border border-mist/[0.14] px-2.5 py-2 font-body text-[10px] text-[#A9B0A8]">{k}<b className="block font-display text-lg font-medium tracking-[-0.02em] text-mist">{v}</b></div>
                ))}
              </div>
              <RidgeChart />
              <div className="tabular-nums">
                {dash.per.map(s => {
                  const [v, vc] = verdictOf(s.cpa)
                  const max = Math.max(...dash.per.map(p => p.sp))
                  return (
                    <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_48px_74px] items-center gap-2.5 border-t border-mist/[0.14] py-1.5 font-body text-[11px] sm:grid-cols-[130px_minmax(0,1fr)_48px_74px]">
                      <span className="truncate">{s.name}</span>
                      <span className="hidden h-[5px] overflow-hidden rounded-full bg-mist/[0.08] sm:block"><i className="block h-full" style={{ width: `${(s.sp / max) * 100}%`, background: s.color }} /></span>
                      <span className="text-right text-[#A9B0A8]">{s.cpa ? '$' + Math.round(s.cpa) : '—'}</span>
                      <span className="text-right font-mono text-[10px]" style={{ color: vc }}>● {v}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── COST COMPARISON ── */}
      <section className="mx-auto max-w-[760px] px-5 pb-24 lg:pb-28">
        <h2 className="text-balance text-center font-display text-[clamp(32px,4vw,54px)] font-medium leading-[1.08] tracking-[-0.03em]">
          What would cost <s className="text-ink/50 decoration-2">$20,000+ a month</s> is now $2,500.
        </h2>
        <div className="mt-9 overflow-hidden rounded-[22px] border border-ink/[0.08] bg-white">
          <div className="grid grid-cols-[minmax(0,1fr)_84px] gap-4 bg-sand px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55 sm:grid-cols-[1.3fr_1fr_96px] sm:px-6">
            <span>Service</span><span className="hidden sm:block">Traditional agency</span><span className="text-right">Hewn</span>
          </div>
          {comparisonRows.map(r => (
            <div key={r.service} className="grid grid-cols-[minmax(0,1fr)_84px] items-center gap-4 border-t border-ink/[0.08] px-5 py-3.5 font-body text-[15px] sm:grid-cols-[1.3fr_1fr_96px] sm:px-6">
              <span>{r.service}</span>
              <span className="hidden text-ink/50 line-through sm:block">{r.traditional}</span>
              <span className="text-right font-medium text-forest">Included</span>
            </div>
          ))}
          <div className="grid grid-cols-[minmax(0,1fr)_84px] items-center gap-4 bg-forest px-5 py-3.5 font-body text-[15px] text-mist sm:grid-cols-[1.3fr_1fr_96px] sm:px-6">
            <span>Total</span>
            <span className="hidden text-mist/55 line-through sm:block">$20,000–$50,000+/mo</span>
            <span className="text-right font-display text-lg text-lime">$2,500/mo</span>
          </div>
        </div>
        <div className="mt-7 text-center">
          <Link href="/pricing#plans" className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">Become a client</Link>
        </div>
      </section>

      {/* ── NINE PILLARS ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="rounded-[32px] bg-forest px-5 py-12 text-mist sm:px-12 sm:py-[72px]" id="services">
          <div className="mb-10 grid items-end gap-8 lg:grid-cols-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">The growth engine</span>
              <h2 className="mt-3.5 font-display text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.08] tracking-[-0.03em]">Nine pillars. One team. Every number owned.</h2>
            </div>
            <p className="max-w-[32em] font-body text-mist/75 lg:justify-self-end">Each pillar runs as a playbook with an owner, a weekly cadence and the number it answers to. Pick the plan that covers the layers you need.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map(p => {
              const feat = p.slug === 'data-attribution'
              return (
                <Link
                  key={p.slug}
                  href={`/services/${p.slug}`}
                  className={`group flex min-h-[230px] flex-col gap-2.5 rounded-[22px] border p-[22px] transition hover:-translate-y-0.5 ${feat ? 'border-transparent bg-lime text-forest' : 'border-mist/[0.06] bg-forest-2'}`}
                >
                  <div className="flex items-start justify-between">
                    <Glyph name={p.glyph} fg={feat ? colors.forest : colors.mist} accent={feat ? colors.forest : colors.lichen} />
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-[0.1em] ${feat ? 'border-forest/35' : 'border-mist/30 text-mist/85'}`}>{p.num}</span>
                  </div>
                  <h3 className="mt-auto font-display text-[19px] font-medium">{p.name}</h3>
                  <p className={`font-body text-sm ${feat ? 'text-forest/80' : 'text-mist/70'}`}>{p.summary}</p>
                  <span className={`font-body text-xs ${feat ? 'text-forest' : 'text-lime'}`}>From {tierNames[p.tier]} · Playbook →</span>
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      {/* ── ECONOMICS ── */}
      <div className="mx-auto mt-3.5 max-w-[1400px] px-5">
        <section className="relative isolate flex items-center overflow-hidden rounded-[32px] p-4 lg:min-h-[560px] lg:p-12" aria-label="Payback">
          <Terrain scene="valley" seed={18} className="-z-10" />
          <div className="grid w-full items-center gap-7 rounded-[22px] border border-mist/30 p-6 text-mist backdrop-blur-xl lg:grid-cols-[1fr_1fr_0.9fr] lg:p-9" style={{ background: 'linear-gradient(140deg, rgba(20,34,24,.55), rgba(20,34,24,.35))' }}>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/85">The economics</span>
              <h2 className="mt-3 font-display text-[clamp(28px,3vw,40px)] font-medium leading-[1.08] tracking-[-0.03em]">Most ad spend never pays back. Ours has to.</h2>
            </div>
            <PaybackChart />
            <div>
              <p className="font-display text-[64px] font-medium leading-none tracking-[-0.04em] tabular-nums">4.6<span className="text-2xl"> mo</span></p>
              <p className="mt-2 font-body text-[13px] text-mist/85">Target payback on a $300 customer acquisition cost at $65 gross profit a month. Budget scales only while payback stays short.</p>
              <p className="mt-3 font-body text-[13px] text-mist/70">Illustrative model</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── FOUNDER ── */}
      <section className="mx-auto grid max-w-7xl gap-3.5 px-5 py-24 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-between gap-8 rounded-[32px] border border-ink/[0.08] bg-white p-7 sm:p-12">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Led by the founder</span>
            <h2 className="mt-3.5 font-display text-[clamp(28px,3vw,42px)] font-medium leading-[1.08] tracking-[-0.03em]">Thirty years of business judgment, with AI doing the volume.</h2>
          </div>
          <blockquote className="accent text-[22px] leading-snug text-ink/70">“Senior judgment on every account. You are never handed to a junior.”</blockquote>
          <div>
            <p className="font-body text-sm"><b className="block font-medium">The founder</b>Hewn Life</p>
            <div className="mt-5 grid grid-cols-3 border-t border-ink/[0.08] tabular-nums">
              {[['30 yrs', 'in business'], ['48h', 'to onboard'], ['1', 'point of contact']].map(([k, v], i) => (
                <div key={k} className={`pr-3 pt-4 ${i ? 'border-l border-ink/[0.08] pl-3.5' : ''}`}>
                  <b className="block font-display text-[30px] font-medium leading-tight tracking-[-0.03em]">{k}</b>
                  <small className="font-body text-xs text-ink/55">{v}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Replaced by the commissioned founder portrait once shot. */}
        <div className="relative isolate min-h-[420px] overflow-hidden rounded-[32px] lg:min-h-[480px]">
          <Terrain scene="ember" seed={5} className="-z-10" />
        </div>
      </section>

      {/* ── THE WORK ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24 lg:pb-28">
        <div className={sectionHead}>
          <Pill>The work</Pill>
          <h2 className={`${h2} text-[clamp(32px,3.6vw,50px)]`}>What 20–40 assets a week looks like.</h2>
          <p className="mt-3.5 font-body text-[17px] text-ink/70">Proven ad formats, produced by our AI creative line and tested through the funnel every week. Winners scale; the rest are retired.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {formats.map((f, i) => {
            const light = f.bg === colors.paper || f.bg === colors.lime
            return (
              <article key={f.format} className={`relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[14px] p-3.5 ${light ? 'border border-ink/[0.08] text-forest' : 'text-mist'}`} style={{ background: f.bg ?? colors.forest }}>
                {f.scene && (
                  <>
                    <Terrain scene={f.scene} seed={50 + i} className="-z-10" />
                    <span className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(14,20,15,.55) 0%, rgba(14,20,15,.25) 55%, rgba(14,20,15,.5) 100%)' }} />
                  </>
                )}
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-80">{f.format}</span>
                <p className="font-display text-[17px] font-medium leading-tight tracking-[-0.02em]">{f.hook}</p>
                <span className={`self-start rounded-full px-2.5 py-1.5 font-body text-[11px] font-medium ${light ? 'bg-forest text-mist' : 'bg-mist text-forest'}`}>{f.cta}</span>
              </article>
            )
          })}
        </div>
        <p className="mt-4 text-center font-body text-[13px] text-ink/55">Format studies for a sample client. Client work appears here once approved.</p>
      </section>

      {/* ── OFFER ── */}
      <section className="mx-auto grid max-w-7xl items-start gap-10 px-5 pb-24 lg:grid-cols-2 lg:pb-28" id="offer">
        <div className="relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[32px] p-8 text-mist lg:min-h-[520px]">
          <Terrain scene="amber" seed={41} className="-z-10" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist/85">Nine-pillar grade · sample</p>
            <p className="mt-2.5 font-display text-7xl font-medium leading-none tracking-[-0.04em]">B</p>
            <p className="font-body text-sm text-mist/90">2.84 of 4.00 · top-quartile peers at 3.64</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Data A-', 'Paid media B+', 'Brand B+', 'SEO + AEO C', 'Social C+'].map(c => (
              <span key={c} className="rounded-full border border-mist/25 bg-[rgba(20,16,10,.35)] px-2.5 py-1.5 font-body text-xs">{c}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Plans</span>
          <h2 className="mt-2.5 font-display text-[clamp(30px,3.2vw,44px)] font-medium leading-[1.08] tracking-[-0.03em]">Choose how far we go together.</h2>
          <PlanPicker />
          <div className="mt-6 grid grid-cols-3 border-t border-ink/[0.08] tabular-nums">
            {[['48h', 'from signing to onboarding'], ['20–40', 'assets shipped a week'], ['$0', 'percentage-of-spend fees']].map(([k, v], i) => (
              <div key={k} className={`pr-2.5 pt-3.5 ${i ? 'border-l border-ink/[0.08] pl-3' : ''}`}>
                <b className="block font-display text-[28px] font-medium tracking-[-0.03em]">{k}</b>
                <small className="block font-body text-xs leading-snug text-ink/55">{v}</small>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-ink/[0.08]">
            {faqs.map(f => (
              <details key={f.q} className="group border-b border-ink/[0.08] py-3.5">
                <summary className="flex cursor-pointer list-none justify-between gap-3 font-body text-[15px] [&::-webkit-details-marker]:hidden">
                  {f.q}<span className="text-ink/50 group-open:hidden">+</span><span className="hidden text-ink/50 group-open:inline">−</span>
                </summary>
                <p className="mt-2 font-body text-sm text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSE ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <section className="relative isolate flex min-h-[560px] items-end overflow-hidden rounded-[32px] text-mist lg:min-h-[620px]" aria-label="Book a call">
          <Terrain scene="ember" seed={33} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.6), transparent 70%)' }} />
          <div className="p-7 sm:p-14">
            <Pill dark>Start here</Pill>
            <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(40px,5.4vw,76px)] font-medium leading-none tracking-[-0.045em]">Growth is your new <em className="accent">baseline.</em></h2>
            <p className="mt-4 max-w-[30em] font-body text-[17px] text-mist/85">A free 30-minute call. We grade your nine pillars against the best in class and show you the cheapest gaps to close first.</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <CalButton className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Book a discovery call</CalButton>
              <Link href="/services" className="inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20">Explore the services</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
