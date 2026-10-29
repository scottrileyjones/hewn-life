'use client'
/*
 * ─── ENV VARS REQUIRED — add to .env.local ───────────────────────────────────
 * STRIPE_SECRET_KEY=sk_live_...                  ← server-side only
 * NEXT_PUBLIC_STRIPE_PRICE_HEWN_MONTHLY=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_HEWN_ANNUAL=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_FORGED_MONTHLY=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_FORGED_ANNUAL=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_CARVED_MONTHLY=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_CARVED_ANNUAL=price_...
 * NEXT_PUBLIC_STRIPE_LINK_BRAND_IDENTITY=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_WEBSITE_BUILD=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_SEO_AUDIT=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_GOOGLE_ADS=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_MARKETING_AUTO=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_VIDEO_ADS=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_CONTENT_SPRINT=https://buy.stripe.com/...
 * NEXT_PUBLIC_STRIPE_LINK_REFERRAL_BUILD=https://buy.stripe.com/...
 * NEXT_PUBLIC_CALCOM_LINK=your-username/strategy-call
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Terrain from '@/components/strata/Terrain'
import { Glyph, Pill } from '@/components/strata/Glyph'
import { PageHero, ForestBand, ClosePanel, h2Class, btnLight, btnGlass } from '@/components/strata/Page'
import type { GlyphKey } from '@/lib/strata'
import Link from 'next/link'
import Cal, { getCalApi } from '@calcom/embed-react'
import CalButton from '@/components/CalButton'

type TierSlug = 'hewn' | 'wrought' | 'forged'
type IconType = 'brand' | 'website' | 'seo' | 'ads' | 'automation' | 'video' | 'content' | 'referral'

const PRICE_IDS: Record<TierSlug, { monthly: string; annual: string }> = {
  hewn: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_MONTHLY ?? '',
    annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_ANNUAL  ?? '',
  },
  wrought: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_MONTHLY ?? '',
    annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_ANNUAL  ?? '',
  },
  forged: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_MONTHLY ?? '',
    annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_ANNUAL  ?? '',
  },
}

const PAYMENT_LINKS: Record<string, string> = {
  'brand-identity': process.env.NEXT_PUBLIC_STRIPE_LINK_BRAND_IDENTITY ?? '',
  'website':        process.env.NEXT_PUBLIC_STRIPE_LINK_WEBSITE_BUILD  ?? '',
  'seo':            process.env.NEXT_PUBLIC_STRIPE_LINK_SEO_AUDIT      ?? '',
  'google-ads':     process.env.NEXT_PUBLIC_STRIPE_LINK_GOOGLE_ADS     ?? '',
  'automation':     process.env.NEXT_PUBLIC_STRIPE_LINK_MARKETING_AUTO ?? '',
  'video':          process.env.NEXT_PUBLIC_STRIPE_LINK_VIDEO_ADS      ?? '',
  'content':        process.env.NEXT_PUBLIC_STRIPE_LINK_CONTENT_SPRINT ?? '',
  'referral':       process.env.NEXT_PUBLIC_STRIPE_LINK_REFERRAL_BUILD ?? '',
}

const tiers = [
  {
    name: 'Hewn',
    slug: 'hewn' as TierSlug,
    subtitle: 'Pillars 01 · 04 · 08 · 09',
    tagline: 'Deliberately shaped. Ready to work.',
    price: { monthly: 2500, annual: 2000 },
    accentColor: '#B87A40',
    badge: null as string | null,
    highlights: [
      'Brand strategy, visual identity & style guide',
      'Custom website + SEO foundation',
      'Google Business Profile + local listings',
      'Monthly strategy call',
    ],
    deliverables: [
      {
        pillar: 'Brand Foundation',
        items: [
          'Brand Strategy Document (positioning, audience, voice)',
          'Logo & Visual Identity (logo suite, palette, typography)',
          'Brand Style Guide (complete brand standards)',
          'Messaging Framework (taglines, elevator pitch, value props)',
        ],
      },
      {
        pillar: 'Digital Presence',
        items: [
          'Website Design & Development (up to 5 pages, conversion-optimized)',
          'SEO Foundation (technical + on-page optimization)',
          'Google Business Profile (complete setup & optimization)',
          'Local Listings Management (consistent NAP across directories)',
        ],
      },
    ],
  },
  {
    name: 'Wrought',
    slug: 'wrought' as TierSlug,
    subtitle: 'Pillars 01–04 · 06–09',
    tagline: 'Full-stack marketing without the full-stack agency.',
    price: { monthly: 5000, annual: 4000 },
    accentColor: '#9BA4AE',
    badge: 'Most Popular' as string | null,
    highlights: [
      'Everything in Hewn',
      'Paid media management + sales funnels',
      'Marketing automation + CRM setup',
      'Booking, onboarding & retention systems',
    ],
    deliverables: [
      {
        pillar: 'Everything in Hewn',
        items: ['All Hewn deliverables included'],
      },
      {
        pillar: 'Lead & Revenue Engine',
        items: [
          'Paid Media Management (Google + Meta)',
          'Sales Funnel Design (landing pages, offers, conversion paths)',
          'Marketing Automation (nurture sequences + drip campaigns)',
          'CRM Setup & Integration (pipeline + sales process)',
        ],
      },
      {
        pillar: 'Customer Experience',
        items: [
          'Booking & Scheduling System',
          'Automated Onboarding Sequence (new customer welcome)',
          'Retention Campaigns (re-engagement + loyalty)',
          'Customer Feedback Systems (NPS + satisfaction)',
        ],
      },
    ],
  },
  {
    name: 'Forged',
    slug: 'forged' as TierSlug,
    subtitle: 'All nine pillars',
    tagline: 'Your outsourced CMO and creative department.',
    price: { monthly: 9500, annual: 7600 },
    accentColor: '#C9A84C',
    badge: 'Full Service' as string | null,
    highlights: [
      'Everything in Wrought',
      'Review generation, UGC & referral program',
      'Monthly KPI dashboard + quarterly growth planning',
      'Weekly calls + Slack access (M–F)',
    ],
    deliverables: [
      {
        pillar: 'Everything in Wrought',
        items: ['All Wrought deliverables included'],
      },
      {
        pillar: 'Reputation & Social Proof',
        items: [
          'Review Generation System (automated post-service requests)',
          'UGC Strategy & Campaigns (user-generated content programs)',
          'Referral Program (structured system with tracking)',
          'Testimonial Collection (video + written capture process)',
        ],
      },
      {
        pillar: 'Business Advisory',
        items: [
          'Monthly KPI Dashboard (custom performance tracking)',
          'Monthly Strategy Call (60-min video, performance + planning)',
          'Quarterly Growth Planning (structured sessions + roadmap)',
          'Competitive Intelligence (ongoing landscape monitoring)',
        ],
      },
    ],
  },
]

const services = [
  { service: 'Extra Ad Creative Pack',      slug: 'brand-identity', desc: '8 additional ad creatives — static or motion, any platform',         fee: '$800',   icon: 'brand'     as IconType },
  { service: 'Email Automation Build-Out',  slug: 'automation',     desc: '6-email nurture or sales sequence, fully written and mapped',         fee: '$1,500', icon: 'automation' as IconType },
  { service: 'Additional SEO Blog Post',    slug: 'seo',            desc: '1,200–1,500 words, keyword-optimized, publish-ready',                  fee: '$350',   icon: 'seo'       as IconType },
  { service: 'Video Repurposing Pack',      slug: 'video',          desc: 'One raw video → 5 short-form clips, captioned and formatted',          fee: '$400',   icon: 'video'     as IconType },
  { service: 'Whitepaper or Lead Magnet',   slug: 'content',        desc: 'Long-form authority piece — researched, written, and designed',        fee: '$1,200', icon: 'content'   as IconType },
  { service: 'Competitor Audit + Report',   slug: 'google-ads',     desc: 'Positioning gap analysis + actionable recommendations',               fee: '$1,800', icon: 'ads'       as IconType },
  { service: 'Brand Identity Refresh',      slug: 'referral',       desc: 'Logo, colors, typography — updated and delivered in a style guide',   fee: '$2,500', icon: 'referral'  as IconType },
  { service: 'Full Website Copy',           slug: 'website',        desc: '5 pages written, structured, and optimized for conversion',           fee: '$3,000', icon: 'website'   as IconType },
]

const iconGlyph: Record<IconType, GlyphKey> = {
  brand: 'creative', website: 'brand', seo: 'seo', ads: 'data', automation: 'lifecycle', video: 'social', content: 'strategy', referral: 'brand',
}

function ServiceIcon({ type }: { type: IconType }) {
  return <Glyph name={iconGlyph[type]} fg="#F4F2EC" accent="#D6F28B" size={26} />
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function FadeInWrapper({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({})
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  return (
    <Cal
      calLink="scott-hewn/discovery"
      style={{ width: '100%', height: '600px', border: 'none' }}
    />
  )
}

export default function Pricing() {
  const router = useRouter()
  const [annual, setAnnual] = useState(false)
  const [expanded, setExpanded] = useState<TierSlug | null>(null)
  const [calOpen, setCalOpen] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const plansRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = plansRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -100px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleStripeCheckout = useCallback((slug: TierSlug) => {
    const tier = tiers.find(t => t.slug === slug)!
    const price = annual ? tier.price.annual : tier.price.monthly
    const priceId = PRICE_IDS[slug][annual ? 'annual' : 'monthly']
    const billing = annual ? 'annual' : 'monthly'
    const qs = new URLSearchParams({
      priceId,
      mode: 'subscription',
      name: tier.name,
      price: String(price),
      billing,
      tier: slug,
    })
    router.push(`/checkout?${qs.toString()}`)
  }, [annual, router])

  const handleForgedClick = useCallback(() => handleStripeCheckout('forged'), [handleStripeCheckout])

  return (
    <div className="bg-bone text-ink">
      <PageHero
        pill="Transparent pricing"
        title={<>Pick a plan. Check out. We <em className="accent text-lime">get to work.</em></>}
        lede="No sales call required. Flat fees, secure checkout, and your onboarding call scheduled within 48 hours of purchase."
        seed={23}
      >
        <a href="#plans" className={btnLight}>See plans</a>
        <CalButton className={btnGlass}>Not sure? Let&apos;s talk</CalButton>
      </PageHero>

      {/* ── PLANS ── */}
      <section id="plans" ref={plansRef} className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <Pill>Monthly plans</Pill>
          <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.6vw,50px)]`}>Three plans. No contracts. No agency tax.</h2>
          <p className="mt-3.5 font-body text-[17px] text-ink/70">We charge what a freelancer costs and deliver what an agency can&apos;t.</p>
          <div className="mt-8 inline-flex gap-1 rounded-full border border-ink/[0.08] bg-white p-1" role="group" aria-label="Billing period">
            {[false, true].map(a => (
              <button key={String(a)} type="button" aria-pressed={annual === a} onClick={() => setAnnual(a)}
                className={`rounded-full px-4 py-2 font-body text-sm transition ${annual === a ? 'bg-forest text-mist' : 'text-ink/70 hover:text-ink'}`}>
                {a ? 'Yearly · save 20%' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-3.5 lg:grid-cols-3">
          {tiers.map((tier, i) => {
            const price = annual ? tier.price.annual : tier.price.monthly
            const feat = tier.slug === 'wrought'
            const isExpanded = expanded === tier.slug
            return (
              <FadeInWrapper key={tier.slug} delay={i * 110} className="flex h-full flex-col">
                <div className={`flex h-full flex-col overflow-hidden rounded-[28px] ${feat ? 'bg-forest text-mist' : 'border border-ink/[0.08] bg-white'}`}>
                  {feat && (
                    <div className="relative isolate h-24 overflow-hidden">
                      <Terrain scene="amber" seed={31} className="-z-10" />
                      <span className="absolute bottom-3 left-7 rounded-full bg-lime px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-forest">{tier.badge}</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <div className="mb-5 flex items-center justify-between">
                      <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${feat ? 'text-mist/60' : 'text-ink/55'}`}>{tier.subtitle}</p>
                      {!feat && tier.badge && <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest">{tier.badge}</span>}
                    </div>
                    <p className="font-display text-[32px] font-medium leading-none tracking-[-0.03em]">{tier.name}</p>
                    <p className={`mt-3 mb-6 font-body text-sm ${feat ? 'text-mist/70' : 'text-ink/70'}`}>{tier.tagline}</p>

                    <div className={`mb-6 border-b pb-6 ${feat ? 'border-mist/[0.12]' : 'border-ink/[0.08]'}`}>
                      {annual && (
                        <div className="mb-1 flex items-baseline gap-2">
                          <span className={`font-body text-sm line-through ${feat ? 'text-mist/40' : 'text-ink/40'}`}>${tier.price.monthly.toLocaleString()}</span>
                          <span className={`font-mono text-[10px] uppercase tracking-widest ${feat ? 'text-lime' : 'text-forest'}`}>Save 20%</span>
                        </div>
                      )}
                      <div className="flex items-end gap-1">
                        <span className="font-display text-[56px] font-medium leading-none tracking-[-0.04em] tabular-nums">${price.toLocaleString()}</span>
                        <span className={`mb-1.5 font-body text-sm ${feat ? 'text-mist/60' : 'text-ink/55'}`}>/mo{annual ? ', billed yearly' : ''}</span>
                      </div>
                    </div>

                    <ul className="mb-8 space-y-2.5">
                      {tier.highlights.map(h => (
                        <li key={h} className="flex items-start gap-3">
                          <svg viewBox="0 0 100 100" className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" aria-hidden="true"><rect x="14" y="30" width="16" height="56" fill={feat ? '#F4F2EC' : '#1E3826'} /><polygon points="30,62 86,34 86,48 30,76" fill={feat ? '#D6F28B' : '#6BAD3D'} /></svg>
                          <span className={`font-body text-sm ${feat ? 'text-mist/85' : 'text-ink/80'}`}>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleStripeCheckout(tier.slug)}
                        className={`mb-3 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-body text-sm font-medium transition ${feat ? 'bg-lime text-forest hover:bg-white' : 'bg-forest text-mist hover:bg-forest-2'}`}
                      >
                        Get {tier.name} · ${price.toLocaleString()}/mo
                      </button>
                      <p className="mb-6 text-center">
                        <CalButton className={`font-body text-xs transition-colors ${feat ? 'text-mist/60 hover:text-mist' : 'text-ink/55 hover:text-ink'}`}>Have questions? Book a free call →</CalButton>
                      </p>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : tier.slug)}
                        aria-expanded={isExpanded}
                        className={`flex w-full items-center gap-1.5 font-body text-xs transition-colors ${feat ? 'text-mist/60 hover:text-mist' : 'text-ink/55 hover:text-ink'}`}
                      >
                        <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        {isExpanded ? 'Hide full deliverables' : 'See everything included'}
                      </button>
                      {isExpanded && (
                        <div className={`mt-6 space-y-5 border-t pt-6 ${feat ? 'border-mist/[0.12]' : 'border-ink/[0.08]'}`}>
                          {tier.deliverables.map(group => (
                            <div key={group.pillar}>
                              <p className={`mb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] ${feat ? 'text-lime' : 'text-forest'}`}>{group.pillar}</p>
                              <ul className="space-y-1.5">
                                {group.items.map(item => (
                                  <li key={item} className="flex items-start gap-2.5">
                                    <span className={`mt-1 h-3 w-[3px] flex-shrink-0 ${feat ? 'bg-lime' : 'bg-ember'}`} />
                                    <span className={`font-body text-xs ${feat ? 'text-mist/75' : 'text-ink/75'}`}>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeInWrapper>
            )
          })}
        </div>
        <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
          Cancel anytime · Onboarding in 48 hours · Founder-led strategy · No long-term contracts
        </p>
      </section>

      {/* ── À LA CARTE ── */}
      <ForestBand id="services">
        <div className="mb-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">À la carte</span>
          <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Just need one thing?</h2>
          <p className="mt-3 font-body text-mist/75">Order exactly what you need. Flat fees, fast execution.</p>
        </div>
        <div className="grid gap-2.5">
          {services.map((svc, i) => (
            <FadeInWrapper key={svc.slug} delay={i * 60}>
              <div className="flex flex-col gap-4 rounded-[18px] bg-forest-2 p-5 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-forest"><ServiceIcon type={svc.icon} /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-medium">{svc.service}</p>
                  <p className="mt-0.5 font-body text-xs leading-relaxed text-mist/70">{svc.desc}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-4">
                  <span className="font-display text-[22px] font-medium tabular-nums">{svc.fee}</span>
                  <a href={PAYMENT_LINKS[svc.slug] || '#'} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-full bg-mist px-5 py-2.5 font-body text-xs font-medium text-forest transition hover:bg-lime">Buy now</a>
                </div>
              </div>
            </FadeInWrapper>
          ))}

          <FadeInWrapper delay={services.length * 60}>
            <div className="rounded-[18px] bg-lime p-5 text-forest">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-forest"><Glyph name="strategy" fg="#F4F2EC" accent="#D6F28B" size={26} /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-medium">Strategy call</p>
                  <p className="mt-0.5 font-body text-xs leading-relaxed text-forest/80">60-minute deep dive with our team. No pitch, just strategy.</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-4">
                  <span className="font-display text-[22px] font-medium">$500</span>
                  <button onClick={() => setCalOpen(!calOpen)} aria-expanded={calOpen} className="whitespace-nowrap rounded-full bg-forest px-5 py-2.5 font-body text-xs font-medium text-mist transition hover:bg-forest-2">
                    {calOpen ? 'Close calendar' : 'Book a call'}
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: calOpen ? '700px' : '0', overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="pt-6">
                  <div className="overflow-hidden rounded-[14px] bg-white">{calOpen && <CalEmbed />}</div>
                </div>
              </div>
            </div>
          </FadeInWrapper>
        </div>
      </ForestBand>

      {/* ── WHAT'S OUTSIDE THE FEE ── */}
      <section className="mx-auto grid max-w-7xl items-start gap-3.5 px-5 py-24 lg:grid-cols-2">
        <div className="rounded-[28px] border border-ink/[0.08] bg-white p-7 sm:p-9">
          <Pill>Full transparency</Pill>
          <h2 className={`${h2Class} mt-4 text-[clamp(26px,2.6vw,34px)]`}>Our fee covers expertise and execution.</h2>
          <p className="mt-2 font-body text-sm text-ink/70">Here&apos;s what sits outside it.</p>
          <div className="mt-6 divide-y divide-ink/[0.08] border-t border-ink/[0.08]">
            {[
              { item: 'Ad spend', desc: 'Meta, Google and others', cost: 'Set by you' },
              { item: 'Technology platforms', desc: 'CRM, email, scheduling', cost: '$100–$500/mo' },
              { item: 'Website hosting', desc: 'Domain, hosting, SSL', cost: '$20–$100/mo' },
              { item: 'Photography and licensed media', desc: 'Shoots and licensed assets', cost: 'As needed' },
              { item: 'Third-party tools', desc: 'Specialized software', cost: 'As needed' },
            ].map(row => (
              <div key={row.item} className="grid grid-cols-[1fr_auto] gap-4 py-4 sm:grid-cols-[1fr_1fr_auto]">
                <span className="font-body text-sm font-medium">{row.item}</span>
                <span className="hidden font-body text-sm text-ink/65 sm:block">{row.desc}</span>
                <span className="text-right font-body text-sm text-ink/70">{row.cost}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] bg-forest p-7 text-mist sm:p-9">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">The agency tax</span>
          <h2 className={`${h2Class} mt-4 text-[clamp(26px,2.6vw,34px)]`}>What you&apos;re really paying for.</h2>
          <div className="mt-6 divide-y divide-mist/[0.1] border-t border-mist/[0.1]">
            {[
              { scope: 'Brand + website only', agency: '$8,000–$15,000 project', hewn: 'Website · $999' },
              { scope: 'Brand, website and digital presence', agency: '$5,000–$10,000/mo', hewn: 'Hewn · $2,500' },
              { scope: 'Plus paid media, funnels and automation', agency: '$10,000–$18,000/mo', hewn: 'Wrought · $5,000' },
              { scope: 'Full service, UGC and fractional CMO', agency: '$15,000–$25,000/mo', hewn: 'Forged · $9,500' },
            ].map(row => (
              <div key={row.scope} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4">
                <div>
                  <p className="font-body text-sm">{row.scope}</p>
                  <p className="mt-0.5 font-body text-xs text-mist/50 line-through">{row.agency}</p>
                </div>
                <span className="font-body text-sm font-medium text-lime">{row.hewn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosePanel title="Let's figure it out together." body="Book a free 30-minute discovery call. No pitch deck, no pressure. Just an honest conversation about your business and where to start." seed={24} />

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-forest px-5 py-4 md:hidden"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          transform: showStickyBar ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p className="font-body text-sm font-medium leading-tight text-mist">Forged · $9,500/mo</p>
        <button onClick={handleForgedClick} className="flex flex-shrink-0 items-center gap-2 rounded-full bg-lime px-6 py-3 font-body text-sm font-medium text-forest transition hover:bg-white">
          Start with Forged →
        </button>
      </div>
    </div>
  )
}
