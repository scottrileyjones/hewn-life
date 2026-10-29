import type { Metadata } from 'next'
import CtaBanner from '@/components/CtaBanner'
import BuildWeek from '@/components/BuildWeek'
import CalButton from '@/components/CalButton'
import CountUp from '@/components/CountUp'
import Link from 'next/link'
import Photo from '@/components/strata/Photo'
import { PageHero, SectionHead, ForestBand, h2Class, btnLight, btnGlass, btnForest } from '@/components/strata/Page'

export const metadata: Metadata = {
  title: 'Website in a Week — Professional Small Business Website for $1,000',
  description: 'A complete, professional small business website — live in 7 days for a flat $1,000. No bloated timelines. No surprise invoices. Built and launched by Hewn Life.',
  alternates: { canonical: 'https://www.hewn.life/website-in-a-week' },
  openGraph: {
    title: 'Website in a Week — Professional Small Business Website for $1,000',
    description: 'A complete, professional small business website — live in 7 days for a flat $1,000. No bloated timelines. No surprise invoices.',
    url: 'https://www.hewn.life/website-in-a-week',
    images: [{ url: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1779578220/main-sample.png', width: 1200, height: 630 }],
  },
}

const WIAW_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_WEBSITE_IN_A_WEEK ?? ''

function StartButton({ className }: { className?: string }) {
  if (WIAW_PRICE_ID) {
    const qs = new URLSearchParams({
      priceId: WIAW_PRICE_ID,
      mode: 'payment',
      name: 'Website in a Week',
      price: '1000',
      tier: 'website-in-a-week',
    })
    return (
      <a href={`/checkout?${qs.toString()}`} className={className}>
        Start My Website
      </a>
    )
  }
  return (
    <CalButton className={className}>
      Start My Website
    </CalButton>
  )
}


const included = [
  'Custom design for mobile and desktop',
  'Conversion-focused copywriting',
  'Full development and hosting',
  'A few custom features (forms, booking, galleries)',
  'SEO-ready foundation',
  'Live in 5 business days',
]

const faqs = [
  {
    q: 'How is this only $1,000?',
    a: 'AI handles the slow, repetitive work — scaffolding, layout, first-draft copy, asset generation. That collapses what used to take agencies weeks into days, so we pass the savings on. You get senior taste and judgment without the senior-agency invoice.',
  },
  {
    q: 'Do I need to provide designs or a Figma file?',
    a: 'No. There\'s no design phase to wait on. We build directly, refining the look live with you. What you see is the real, working site — not a mockup.',
  },
  {
    q: 'What happens after the week?',
    a: 'The site is hosted, live, and yours. You take over from there. If you want ongoing growth — paid media, funnels, optimization — that\'s where our other tiers come in, but there\'s zero obligation.',
  },
  {
    q: 'Is it really custom, or a template?',
    a: 'Custom. Your brand, your structure, your copy, your features. AI accelerates the build — it doesn\'t hand you someone else\'s template.',
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

export default function WebsiteInAWeek() {
  const stats = [
    { num: '$1,000', label: 'flat, no surprises' },
    { num: '5 days', label: 'from kickoff to live' },
    { num: '0', label: 'Figma files required' },
    { num: '100%', label: 'yours to keep' },
  ]
  return (
    <div className="bg-bone text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        pill="Website in a week"
        title={<>A real website. <em className="accent text-lime">In one week. $1,000.</em></>}
        lede="Custom design, copy, development and hosting, live in five business days. No Figma. AI speed, senior taste."
        seed={71}
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
        <StartButton className={btnLight} />
        <Link href="#how" className={btnGlass}>See how it works</Link>
      </PageHero>

      {/* ── BUILD WEEK ── */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-24">
        <SectionHead pill="The build week" title="Watch it come together, day by day." lede="Five days from kickoff to launch. Scroll to see each layer of the site take shape: structure, design, copy, features and go-live." />
        <BuildWeek />
        <div className="mt-20 flex flex-col justify-center gap-2.5 sm:flex-row">
          <StartButton className={btnForest} />
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3.5 font-body text-[15px] font-medium transition hover:border-ink/40">See plans &amp; pricing</Link>
        </div>
      </section>

      {/* ── OPEN ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[32px] bg-sand text-mist lg:min-h-[520px]">
          <Photo name="cafeOwner" w={1280} h={600} sizes="(min-width: 1280px) 1240px, 100vw" className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.62), rgba(20,16,10,.1) 70%), linear-gradient(0deg, rgba(20,16,10,.45), transparent 50%)' }} />
          <div className="max-w-xl p-7 sm:p-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80">Day five</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.6vw,50px)]`}>Open for business <em className="accent">by Friday.</em></h2>
            <p className="mt-3.5 font-body text-[17px] text-mist/85">Monday is kickoff. Friday your doors are open online: a real site, on your domain, ready to take bookings and orders.</p>
          </div>
        </div>
      </section>

      {/* ── INCLUDED ── */}
      <ForestBand>
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">What&apos;s included</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Everything you need to go live.</h2>
            <p className="mt-4 max-w-md font-body text-mist/75">One flat price. One week. A complete, working website you own outright, not a deposit on an endless retainer.</p>
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

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-5 py-24">
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
