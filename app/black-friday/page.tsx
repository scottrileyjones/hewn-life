import type { Metadata } from 'next'
import Link from 'next/link'
import Photo from '@/components/strata/Photo'
import { Pill } from '@/components/strata/Glyph'
import { h2Class, SectionHead } from '@/components/strata/Page'
import StatRow from '@/components/strata/StatRow'
import IntakeForm from '@/components/IntakeForm'
import Countdown from '@/components/Countdown'
import { cardsFor } from '@/lib/gallery'
import { blackFriday, money, wiadCheckout } from '@/lib/offer'

/**
 * Black Friday landing page: Website in a Day at 50% off. One offer, one
 * action (the brief, then checkout with the code applied). Laid out like a
 * promo landing page: offer bar, split hero with the price, trust strip,
 * proof, three steps, what's included, the order form, FAQ, then a nudge to
 * the monthly plans.
 */

export const metadata: Metadata = {
  title: 'Black Friday: Website in a Day, 50% off | Hewn Life',
  description: `A custom small business website, designed, written and live within 24 hours, for ${money(blackFriday.price)} instead of $999. Ends ${blackFriday.endsLabel}.`,
  alternates: { canonical: 'https://www.hewn.life/black-friday' },
}

// Rebuild hourly so the offer and its checkout link drop off on time.
export const revalidate = 3600

const price = money(blackFriday.price)
const checkoutUrl = process.env.NEXT_PUBLIC_STRIPE_PRICE_WEBSITE_IN_A_DAY ? wiadCheckout(true) : ''

const Icon = ({ d }: { d: string }) => (
  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-lime text-forest" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d={d} /></svg>
  </span>
)
const ICONS = {
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  pen: 'M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4',
  key: 'M15 7a4 4 0 1 1-3.9 4.9L4 19v-3h2v-2h2l1.1-1.1A4 4 0 0 1 15 7Zm1.5 2.5h.01',
}

const benefits: [keyof typeof ICONS, string, string][] = [
  ['clock', 'Live within 24 hours', 'of your brief and payment, with one round of edits on us.'],
  ['pen', 'Designed and written for you', 'from your brief and three sites you love. No call needed.'],
  ['key', 'Yours to keep', 'built and hosted on your domain. No deposit, no retainer.'],
]

const trust = [
  ['No deposit, no retainer', 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-3 9l2 2 4-4'],
  ['Live within 24 hours', ICONS.clock],
  ['One round of edits, on us', 'M4 13l5 5L20 7'],
  ['Custom, never a template', 'M4 4h16v16H4zM4 9h16'],
] as const

const steps = [
  ['Answer the brief', 'A few quick questions about your business and a website you love, one at a time. About five minutes.', 'sketching'],
  [`Pay ${price}`, `One flat fee by card, straight after the brief. The Black Friday code is already applied.`, 'cafePhone'],
  ['Live within 24 hours', 'The clock starts when payment clears. You get the live link and one round of edits.', 'bakerTablet'],
] as const

const included = [
  'Custom design for mobile and desktop',
  'Copy written from your brief',
  'Built, hosted and on your domain',
  'Contact or booking form, wired up',
  'SEO-ready foundation',
]

const faqs = [
  { q: 'How does the Black Friday price work?', a: `Code ${blackFriday.code} takes ${blackFriday.percentOff}% off the one-time $999 fee, so you pay ${price}. It is applied for you at checkout when you start from this page. It ends ${blackFriday.endsLabel}, 2026 at 11:59pm Mountain.` },
  { q: 'When do the 24 hours start?', a: 'As soon as your brief is in and your payment clears. You get the live link within 24 hours of that, then one round of edits on us.' },
  { q: 'How big is the site?', a: 'A focused site built around one goal: a home page plus the core pages your brief calls for, such as services, about and contact. Larger builds, online stores and integrations are quoted separately.' },
  { q: 'Is it really custom, or a template?', a: 'Custom. Your brand, your structure, your copy, your form. AI speeds up the build; it doesn’t hand you someone else’s template.' },
  { q: 'What happens after the day?', a: 'The site is hosted, live and yours. If you want ongoing growth — paid media, SEO, funnels — that’s where our monthly plans come in, with zero obligation.' },
]

/** A 16-point starburst badge. */
function Burst({ children }: { children: React.ReactNode }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 ? 43 : 50, a = (Math.PI * 2 * i) / 32
    return `${50 + r * Math.sin(a)},${50 - r * Math.cos(a)}`
  }).join(' ')
  return (
    <div className="relative h-[132px] w-[132px] sm:h-[150px] sm:w-[150px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true"><polygon points={pts} fill="#D6F28B" /></svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-forest">{children}</div>
    </div>
  )
}

const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-full bg-forest px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2'
const btnOutline = 'inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-4 font-body text-[15px] font-medium text-ink transition hover:border-ink/30'
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>

export default function BlackFriday() {
  return (
    <div className="bg-bone text-ink">
      {/* ── OFFER BAR ── */}
      <div className="mx-auto max-w-7xl px-5 pt-20">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[18px] bg-lime px-5 py-3 text-center font-body text-[15px] text-forest">
          <span><strong className="font-semibold">Black Friday:</strong> Website in a Day {blackFriday.percentOff}% off, <s className="opacity-60">$999</s> <strong className="font-semibold">{price}</strong></span>
          <span className="flex items-center gap-2 text-forest/80">Ends in <Countdown to={blackFriday.ends} className="font-semibold text-forest" /></span>
          <Link href="#order" className="rounded-full bg-forest px-4 py-1.5 text-[13px] font-medium text-mist transition hover:bg-forest-2">Claim offer</Link>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-14">
        <div>
          <Pill>Black Friday · ends {blackFriday.endsLabel}</Pill>
          <h1 className="mt-5 font-display text-[clamp(40px,5vw,68px)] font-medium leading-[1.02] tracking-[-0.045em]">Your website, live in 24 hours. <span className="whitespace-nowrap">Half price.</span></h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-body text-xl text-ink/40 line-through tabular-nums">$999</span>
            <span className="rounded-full bg-forest px-4 py-2 font-body text-[22px] font-semibold leading-none tabular-nums text-white">{price}<span className="text-[15px] font-medium text-white/75"> one time</span></span>
            <span className="rounded-full bg-lime px-3 py-1.5 font-body text-[13px] font-semibold text-forest">{blackFriday.percentOff}% off</span>
          </div>
          <p className="mt-6 max-w-[34em] font-body text-[18px] leading-relaxed text-ink/75">Answer a few quick questions. We design, write, build and launch a custom website for your business within a day, for half the usual price.</p>
          <ul className="mt-7 space-y-4">
            {benefits.map(([icon, strong, rest]) => (
              <li key={strong} className="flex items-center gap-4 font-body text-[16px] text-ink/80">
                <Icon d={ICONS[icon]} />
                <span><strong className="font-semibold text-ink">{strong}</strong> {rest}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#order" className={btnPrimary}>Get my website for {price} <Arrow /></Link>
            <Link href="#included" className={btnOutline}>See what&apos;s included</Link>
          </div>
          <p className="mt-5 max-w-[40em] font-body text-[12px] leading-relaxed text-ink/50">
            {blackFriday.percentOff}% off the one-time $999 Website in a Day fee with code {blackFriday.code}, applied automatically at checkout. Offer ends {blackFriday.endsLabel}, 2026 at 11:59pm Mountain. Larger builds, online stores and integrations are quoted separately.
          </p>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand lg:aspect-[5/6]">
            <Photo name="ownerPortrait" w={900} h={1080} sizes="(min-width: 1024px) 560px, 92vw" film={false} priority />
          </div>
          <div className="absolute -right-2 -top-6 sm:-right-6">
            <Burst>
              <span className="font-display text-[34px] font-semibold leading-none tracking-[-0.04em] sm:text-[40px]">{blackFriday.percentOff}%</span>
              <span className="mt-1 font-body text-[13px] font-semibold uppercase leading-tight tracking-[0.04em]">off<br />this week</span>
            </Burst>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-5 rounded-[20px] border border-white/15 bg-forest/80 p-4 text-white shadow-[0_18px_40px_-20px_rgba(20,35,26,.6)] backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto">
            <div>
              <p className="font-body text-[12px] uppercase tracking-[0.06em] text-white/80">yourbusiness.com</p>
              <p className="font-display text-[20px] font-medium leading-tight tracking-[-0.02em]">Live within 24 hours</p>
            </div>
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#8BD36B]" />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="mx-auto max-w-7xl px-5">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-ink/[0.08] bg-ink/[0.08] lg:grid-cols-4">
          {trust.map(([label, d]) => (
            <li key={label} className="flex items-center gap-3 bg-white px-5 py-5 font-body text-[15px] font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1E3826" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0" aria-hidden="true"><path d={d} /></svg>
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <StatRow eyebrow="Why it matters" title="Built for how people actually browse."
        sub="Fast on a phone, easy to scan and ready for search. The source is on every card."
        cards={cardsFor('website-in-a-day')} cta={{ href: '#order', label: `Get mine for ${price}` }} />

      {/* ── THREE STEPS ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <Pill>How it works</Pill>
            <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.6vw,50px)]`}>Three steps. One day.</h2>
          </div>
          <Link href="#order" className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-body text-sm font-medium text-mist transition hover:bg-forest-2">Start my brief <Arrow /></Link>
        </div>
        <ol className="grid gap-3.5 md:grid-cols-3">
          {steps.map(([t, d, photo], i) => (
            <li key={t} className="overflow-hidden rounded-[28px] border border-ink/[0.08] bg-white">
              <div className="p-3 pb-0">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-sand">
                  <Photo name={photo} w={720} h={450} sizes="(min-width: 768px) 400px, 92vw" film={false} />
                </div>
              </div>
              <div className="p-7">
                <p className="flex items-center gap-3 font-display text-[22px] font-medium tracking-[-0.02em]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest font-body text-sm font-semibold text-mist">{i + 1}</span>{t}
                </p>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-ink/70">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── INCLUDED ── */}
      <section id="included" className="mx-auto grid max-w-7xl scroll-mt-24 items-center gap-10 px-5 pb-24 lg:grid-cols-2">
        <div>
          <Pill>What you get</Pill>
          <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.6vw,50px)]`}>Everything you need to go live.</h2>
          <p className="mt-4 max-w-[32em] font-body text-[17px] text-ink/70">One flat price, one day. A complete, working website you own outright, not a deposit on an endless retainer.</p>
          <Link href="#order" className={`${btnPrimary} mt-8`}>Get my website for {price} <Arrow /></Link>
        </div>
        <ul className="rounded-[28px] p-6 sm:p-8" style={{ background: 'linear-gradient(160deg, #EEF4DF 0%, #F4F2EC 55%, #EDE6DA 100%)' }}>
          {included.map((item, i) => (
            <li key={item} className={`flex items-center justify-between gap-4 py-4 ${i ? 'border-t border-ink/[0.1]' : ''}`}>
              <span className="font-body text-[16px] font-medium">{item}</span>
              <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1 font-body text-[12px] font-semibold text-forest">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-3.5 w-3.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></svg>Included
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── ORDER ── */}
      <section id="order" className="mx-auto grid max-w-7xl scroll-mt-24 items-start gap-10 px-5 pb-24 lg:grid-cols-[1fr_2fr]">
        <aside className="lg:sticky lg:top-24">
          <Pill>Start here</Pill>
          <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.4vw,46px)]`}>Claim your {price} website.</h2>
          <p className="mt-4 font-body text-ink/70">Answer the brief, then check out. The Black Friday code is already applied.</p>
          <div className="mt-6 rounded-[20px] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,.04)]">
            <p className="font-body text-[12px] font-semibold uppercase tracking-[0.06em] text-ink/60">Offer ends in</p>
            <Countdown to={blackFriday.ends} className="mt-1 block font-display text-[28px] font-medium tracking-[-0.03em]" ended="This offer has ended" />
          </div>
        </aside>
        <IntakeForm order checkoutUrl={checkoutUrl} source="Website in a Day · Black Friday" />
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-5 pb-24">
        <SectionHead pill="Questions" title="The honest answers." className="!mb-8" />
        <div className="border-t border-ink/[0.08]">
          {faqs.map(f => (
            <details key={f.q} className="group border-b border-ink/[0.08] py-5">
              <summary className="flex cursor-pointer list-none justify-between gap-4 font-display text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}<span className="text-ink/50 group-open:hidden">+</span><span className="hidden text-ink/50 group-open:inline">−</span>
              </summary>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── NEXT STEP: THE PLANS ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid items-center gap-8 rounded-[32px] p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]" style={{ background: '#E4EDD6' }}>
          <div>
            <h2 className={`${h2Class} text-[clamp(28px,3.4vw,46px)]`}>Want more than a website? <span className="text-forest/70">Grow it every month.</span></h2>
            <p className="mt-4 max-w-[32em] font-body text-[17px] text-ink/70">Brand, SEO, paid media and automation, run for you on a flat monthly plan. No contracts.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/pricing" className={btnPrimary}>See plans &amp; pricing <Arrow /></Link>
              <Link href="#order" className={btnOutline}>Just the website, {price}</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand">
            <Photo name="teamPlanning" w={800} h={600} sizes="(min-width: 1024px) 480px, 92vw" film={false} />
          </div>
        </div>
      </section>
    </div>
  )
}
