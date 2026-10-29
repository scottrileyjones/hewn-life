import type { Metadata } from 'next'
import Link from 'next/link'
import CtaBanner from '@/components/CtaBanner'
import BuildDay from '@/components/BuildDay'
import CountUp from '@/components/CountUp'
import IntakeForm from '@/components/IntakeForm'
import Photo from '@/components/strata/Photo'
import { PageHero, SectionHead, ForestBand, h2Class, btnLight, btnGlass, btnForest } from '@/components/strata/Page'

export const metadata: Metadata = {
  title: 'Website in a Day — A Custom Small Business Website for $999',
  description: 'Fill in one form and get a custom, professional small business website live within 24 hours for a flat $999. No calls, no Figma, no surprise invoices.',
  alternates: { canonical: 'https://www.hewn.life/website-in-a-day' },
  openGraph: {
    title: 'Website in a Day — A Custom Small Business Website for $999',
    description: 'Fill in one form and get a custom website live within 24 hours for a flat $999.',
    url: 'https://www.hewn.life/website-in-a-day',
    images: [{ url: 'https://res.cloudinary.com/dsx2wcqte/image/upload/c_fill,g_auto:faces,w_1200,h_630/f_auto,q_auto/v1793234720/AdobeStock_2168699755_av5jgr.jpg', width: 1200, height: 630 }],
  },
}

// One-time $999 Stripe price. Without it the brief still submits and we invoice by email.
const WIAD_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_WEBSITE_IN_A_DAY ?? ''
const checkoutUrl = WIAD_PRICE_ID
  ? `/checkout?${new URLSearchParams({ priceId: WIAD_PRICE_ID, mode: 'payment', name: 'Website in a Day', price: '999', tier: 'website-in-a-day' })}`
  : ''

const orderSteps = [
  ['Fill in the brief', 'Your logo, three sites you love and a few lines about your business. About five minutes.'],
  ['Pay $999', 'One flat fee by card, straight after the brief. No deposit, no retainer.'],
  ['Live within 24 hours', 'The clock starts when payment clears. You get the live link and one round of edits.'],
]

const included = [
  'Custom design for mobile and desktop',
  'Copy written from your brief',
  'Built, hosted and on your domain',
  'Contact or booking form, wired up',
  'SEO-ready foundation',
  'Live within 24 hours',
]

const faqs = [
  {
    q: 'How can a real website be done in a day?',
    a: 'Your brief replaces the kickoff call, and AI handles the slow, repetitive work: scaffolding, layout, first-draft copy and assets. A senior designer shapes and checks every site before it goes live. You get senior taste without the agency timeline.',
  },
  {
    q: 'When do the 24 hours start?',
    a: 'As soon as your brief is in and your payment clears. You get the live link within 24 hours of that, then one round of edits on us.',
  },
  {
    q: 'How big is the site?',
    a: 'A focused site built around one goal: a home page plus the core pages your brief calls for, such as services, about and contact. Larger builds, online stores and integrations are quoted separately.',
  },
  {
    q: 'Do I need designs or a Figma file?',
    a: 'No. Send three websites or brands you love and we build from those. What you see is the real, working site, not a mockup.',
  },
  {
    q: 'Is it really custom, or a template?',
    a: 'Custom. Your brand, your structure, your copy, your form. AI speeds up the build; it doesn’t hand you someone else’s template.',
  },
  {
    q: 'What happens after the day?',
    a: 'The site is hosted, live and yours. If you want ongoing growth — paid media, SEO, funnels — that’s where our monthly plans come in, with zero obligation.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function WebsiteInADay() {
  const stats = [
    { num: '$999', label: 'flat, no surprises' },
    { num: '24h', label: 'from brief to live' },
    { num: '1', label: 'form, no calls needed' },
    { num: '100%', label: 'yours to keep' },
  ]
  return (
    <div className="bg-bone text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        pill="Website in a day"
        title={<>A real website. <em className="accent text-lime">In one day. $999.</em></>}
        lede="Fill in one form. We design, write, build and launch your website within 24 hours. The easiest way to start with Hewn."
        scene="forge" seed={71}
        aside={
          <div className="grid w-full max-w-[380px] grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-mist/30 backdrop-blur-xl lg:justify-self-end" style={{ background: 'rgba(244,242,236,.18)' }}>
            {stats.map(s => (
              <div key={s.label} className="p-5" style={{ background: 'rgba(20,16,10,.28)' }}>
                <p className="font-display text-[30px] font-medium leading-none tracking-[-0.03em] tabular-nums"><CountUp value={s.num} /></p>
                <p className="mt-2 font-body text-xs text-mist/75">{s.label}</p>
              </div>
            ))}
          </div>
        }
      >
        <Link href="#order" className={btnLight}>Start my website</Link>
        <Link href="#how" className={btnGlass}>See how it works</Link>
      </PageHero>

      {/* ── THREE STEPS ── */}
      <section className="mx-auto max-w-7xl px-5 pt-16">
        <ol className="grid gap-3 md:grid-cols-3">
          {orderSteps.map(([t, d], i) => (
            <li key={t} className="rounded-[22px] border border-ink/[0.08] bg-white p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest font-display text-sm font-medium text-mist">{i + 1}</span>
              <p className="mt-4 font-display text-lg font-medium">{t}</p>
              <p className="mt-1.5 font-body text-sm text-ink/70">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── BUILD DAY ── */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-24">
        <SectionHead pill="The build day" title="Watch it come together, hour by hour." lede="Twenty-four hours from your brief to launch. Scroll to see each layer of the site take shape: structure, design, copy, features and go-live." />
        <BuildDay />
        <div className="mt-20 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link href="#order" className={btnForest}>Start my website</Link>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3.5 font-body text-[15px] font-medium transition hover:border-ink/40">See plans &amp; pricing</Link>
        </div>
      </section>

      {/* ── OPEN ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[32px] bg-sand text-mist lg:min-h-[520px]">
          <Photo name="cafeOwner" w={1280} h={600} sizes="(min-width: 1280px) 1240px, 100vw" className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.78), rgba(20,16,10,.38) 45%, rgba(20,16,10,.12) 75%), linear-gradient(0deg, rgba(20,16,10,.55), transparent 55%)' }} />
          <div className="max-w-xl p-7 sm:p-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80">Hour 24</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.6vw,50px)]`}>Open for business <em className="accent">by tomorrow.</em></h2>
            <p className="mt-3.5 font-body text-[17px] text-mist/85">Send the brief today. By this time tomorrow your doors are open online: a real site, on your domain, ready to take bookings and orders.</p>
          </div>
        </div>
      </section>

      {/* ── INCLUDED ── */}
      <ForestBand>
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">What&apos;s included</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Everything you need to go live.</h2>
            <p className="mt-4 max-w-md font-body text-mist/75">One flat price. One day. A complete, working website you own outright, not a deposit on an endless retainer.</p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {included.map((item, i) => (
              <li key={item} className={`flex items-start gap-3 rounded-[18px] p-5 ${i === 5 ? 'bg-lime text-forest' : 'bg-forest-2'}`}>
                <svg viewBox="0 0 100 100" className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" aria-hidden="true"><rect x="14" y="30" width="16" height="56" fill={i === 5 ? '#1E3826' : '#F4F2EC'} /><polygon points="30,62 86,34 86,48 30,76" fill={i === 5 ? '#1E3826' : '#D6F28B'} /></svg>
                <span className="font-body text-[15px] leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </ForestBand>

      {/* ── ORDER ── */}
      <section id="order" className="mx-auto grid max-w-7xl scroll-mt-20 items-start gap-10 px-5 py-24 lg:grid-cols-[1fr_2fr]">
        <aside className="lg:sticky lg:top-24">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Start here</span>
          <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Your brief is the kickoff.</h2>
          <p className="mt-4 font-body text-ink/70">Everything we need to build your site, in one form. Then you pay $999 and the clock starts.</p>
          <ol className="mt-8 space-y-6">
            {orderSteps.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="mt-1 h-5 w-[3px] flex-shrink-0 bg-ember" />
                <div>
                  <p className="font-display text-lg font-medium">{i + 1}. {t}</p>
                  <p className="mt-1 font-body text-sm text-ink/70">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
        <IntakeForm order checkoutUrl={checkoutUrl} source="Website in a Day" />
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

      <CtaBanner />
    </div>
  )
}
