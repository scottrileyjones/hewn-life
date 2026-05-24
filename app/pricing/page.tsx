'use client'
/*
 * ─── ENV VARS REQUIRED — add to .env.local ───────────────────────────────────
 * STRIPE_SECRET_KEY=sk_live_...                  ← server-side only
 * NEXT_PUBLIC_STRIPE_PRICE_BRONZE_MONTHLY=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_BRONZE_ANNUAL=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_SILVER_MONTHLY=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_SILVER_ANNUAL=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_GOLD_MONTHLY=price_...
 * NEXT_PUBLIC_STRIPE_PRICE_GOLD_ANNUAL=price_...
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
import SectionEyebrow from '@/components/SectionEyebrow'
import Link from 'next/link'
import Cal, { getCalApi } from '@calcom/embed-react'

type TierSlug = 'bronze' | 'silver' | 'gold'
type IconType = 'brand' | 'website' | 'seo' | 'ads' | 'automation' | 'video' | 'content' | 'referral'

const PRICE_IDS: Record<TierSlug, { monthly: string; annual: string }> = {
  bronze: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE_MONTHLY ?? '',
    annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE_ANNUAL  ?? '',
  },
  silver: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER_MONTHLY ?? '',
    annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER_ANNUAL  ?? '',
  },
  gold: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD_MONTHLY ?? '',
    annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD_ANNUAL  ?? '',
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
    name: 'Bronze',
    slug: 'bronze' as TierSlug,
    subtitle: 'The Foundation',
    tagline: 'Brand, web, and SEO — show up professionally from day one.',
    price: { monthly: 2500, annual: 2250 },
    accentColor: '#B87A40',
    badge: null as string | null,
    highlights: [
      'Brand Strategy + Full Visual Identity',
      'Custom Website (up to 5 pages)',
      'SEO Foundation & Google Business Profile',
      'Monthly Strategy Call (30 min)',
    ],
    deliverables: [
      { pillar: 'Brand Foundation', items: ['Brand Strategy Document', 'Logo & Visual Identity', 'Brand Style Guide', 'Messaging Framework'] },
      { pillar: 'Digital Presence', items: ['Custom Website (up to 5 pages)', 'SEO Foundation Setup', 'Google Business Profile Optimization'] },
      { pillar: 'Communication', items: ['Monthly KPI Report', 'Bi-weekly Async Update', 'Monthly Strategy Call (30 min)'] },
    ],
  },
  {
    name: 'Silver',
    slug: 'silver' as TierSlug,
    subtitle: 'The Growth Engine',
    tagline: 'Paid media, automation, and a full revenue pipeline — built to scale.',
    price: { monthly: 5000, annual: 4500 },
    accentColor: '#9BA4AE',
    badge: 'Most Popular' as string | null,
    highlights: [
      'Everything in Bronze',
      'Paid Media Management (1 platform)',
      'CRM + Full Marketing Automation',
      '60-min Monthly Call + Weekly Updates',
    ],
    deliverables: [
      { pillar: 'Everything in Bronze', items: ['All Brand Foundation deliverables', 'All Digital Presence deliverables'] },
      { pillar: 'Lead & Revenue Engine', items: ['Paid Media Management (1 platform)', 'Sales Funnel Design', 'Marketing Automation Setup', 'CRM Integration'] },
      { pillar: 'Customer Experience', items: ['Booking System Setup', 'Customer Onboarding Sequence', 'Retention Campaign'] },
      { pillar: 'Communication', items: ['Monthly KPI Report', 'Weekly Async Update', 'Monthly Strategy Call (60 min)'] },
    ],
  },
  {
    name: 'Gold',
    slug: 'gold' as TierSlug,
    subtitle: 'The Full Disruption',
    tagline: 'Every platform, every system, fractional CMO — total market dominance.',
    price: { monthly: 9500, annual: 8550 },
    accentColor: '#C9A84C',
    badge: 'Full Service' as string | null,
    highlights: [
      'Everything in Silver',
      'All Paid Media Platforms',
      'Reputation, UGC & Referral Systems',
      'Fractional CMO + Quarterly Planning',
    ],
    deliverables: [
      { pillar: 'Everything in Silver', items: ['All Silver tier deliverables'] },
      { pillar: 'Full Lead Engine', items: ['Paid Media Management (all platforms)', 'Advanced Funnel Optimization', 'Full Marketing Automation Suite'] },
      { pillar: 'Reputation & Social Proof', items: ['Review Generation System', 'UGC Strategy & Campaigns', 'Referral Program', 'Testimonial Collection'] },
      { pillar: 'Business Advisory', items: ['Monthly KPI Dashboard', 'Monthly Strategy Call (60 min)', 'Quarterly Growth Planning', 'Competitive Intelligence'] },
    ],
  },
]

const services = [
  { service: 'Brand Identity Sprint',  slug: 'brand-identity', desc: 'Logo, colors, typography — your complete visual identity system', fee: '$4,500', icon: 'brand'     as IconType, gradient: 'from-[#D4622A] to-[#9A3510]' },
  { service: 'Website Design & Build', slug: 'website',        desc: 'Custom 5-page site, copywritten and launched',                   fee: '$7,500', icon: 'website'   as IconType, gradient: 'from-[#7CB550] to-[#3D6E1E]' },
  { service: 'SEO Audit & Roadmap',    slug: 'seo',            desc: 'Technical + content audit with a 90-day action plan',            fee: '$2,500', icon: 'seo'       as IconType, gradient: 'from-[#4B6BFB] to-[#1A3BB8]' },
  { service: 'Google Ads Launch',      slug: 'google-ads',     desc: 'Campaign setup, creatives, and 30-day management',               fee: '$3,000', icon: 'ads'       as IconType, gradient: 'from-[#E88B4A] to-[#C05A18]' },
  { service: 'Marketing Automation',   slug: 'automation',     desc: 'CRM + email nurture sequence up to 10 steps',                    fee: '$3,500', icon: 'automation' as IconType, gradient: 'from-[#7C3AED] to-[#3B0F8C]' },
  { service: 'Video Ad Package',       slug: 'video',          desc: '3 short-form video ads, scripted and produced',                  fee: '$5,000', icon: 'video'     as IconType, gradient: 'from-[#DC2626] to-[#7F1D1D]' },
  { service: 'Content Strategy Sprint',slug: 'content',        desc: '90-day content calendar + 10 pieces of content',                 fee: '$2,000', icon: 'content'   as IconType, gradient: 'from-[#0D9488] to-[#064E3B]' },
  { service: 'Referral Program Build', slug: 'referral',       desc: 'Full referral system design, copy, and technical setup',         fee: '$2,500', icon: 'referral'  as IconType, gradient: 'from-[#C9A84C] to-[#7A5A1A]' },
]

function ServiceIcon({ type }: { type: IconType }) {
  const cls = 'w-7 h-7 text-white'
  if (type === 'brand')      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
  if (type === 'website')    return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
  if (type === 'seo')        return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
  if (type === 'ads')        return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
  if (type === 'automation') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  if (type === 'video')      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
  if (type === 'content')    return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
  return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
}

function TierIcon({ name }: { name: string }) {
  const cls = 'w-6 h-6'
  if (name === 'Bronze') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18m2.25-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
  if (name === 'Silver') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
  return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
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
      calLink={process.env.NEXT_PUBLIC_CALCOM_LINK ?? ''}
      style={{ width: '100%', height: '600px', border: 'none' }}
    />
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [expanded, setExpanded] = useState<TierSlug | null>(null)
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
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

  const handleStripeCheckout = useCallback(async (slug: TierSlug) => {
    setLoadingTier(slug)
    try {
      const priceId = PRICE_IDS[slug][annual ? 'annual' : 'monthly']
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: 'subscription' }),
      })
      const { url, error } = await res.json() as { url?: string; error?: string }
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch {
      setLoadingTier(null)
    }
  }, [annual])

  const handleSilverClick = useCallback(() => handleStripeCheckout('silver'), [handleStripeCheckout])

  return (
    <>
      {/* Hero — unchanged */}
      <section
        className="min-h-[70vh] flex items-end pb-24 relative overflow-hidden grain-overlay pt-32"
        style={{ background: `radial-gradient(ellipse at 70% 30%, rgba(124,181,80,0.10) 0%, transparent 55%), #1A1815` }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Transparent Pricing" />
          </div>
          <h1 className="hero-heading text-[56px] md:text-[80px] text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            Pick a plan. Check out. We <em style={{ color: '#7CB550' }}>get to work.</em>
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed mb-10">
            No sales calls required. Flat fees, secure checkout, and your onboarding call scheduled within 48 hours of purchase.
          </p>
          <div className="flex flex-wrap items-center gap-6 animate-fade-up delay-2">
            <a href="#plans" className="inline-flex items-center bg-moss text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all duration-300">
              See Plans
            </a>
            <Link href="/contact" className="font-body text-sm text-ash hover:text-cream transition-colors">
              Not sure what you need? Let&apos;s talk →
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" ref={plansRef} className="bg-[#0A0908] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionEyebrow text="Monthly Retainers" />
            <p className="font-display font-semibold italic text-[22px] md:text-[28px] text-cream/60 mt-5 mb-5">
              Choose your tier. Start building. No contracts, no surprises.
            </p>
            <h2 className="font-display font-semibold text-[40px] text-cream mb-4">Full-service marketing, all included.</h2>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`font-body text-sm ${!annual ? 'text-cream font-medium' : 'text-ash/50'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-moss' : 'bg-white/10'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${annual ? 'translate-x-6' : ''}`} />
              </button>
              <span className={`font-body text-sm ${annual ? 'text-cream font-medium' : 'text-ash/50'}`}>
                Annual <span className="font-medium" style={{ color: '#7CB550' }}>(save 10%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {tiers.map((tier, i) => {
              const price = annual ? tier.price.annual : tier.price.monthly
              const isGold = tier.slug === 'gold'
              const isSilver = tier.badge === 'Most Popular'
              const isLoading = loadingTier === tier.slug
              const isExpanded = expanded === tier.slug

              return (
                <FadeInWrapper key={tier.slug} delay={i * 110} className="flex flex-col">
                  <div
                    className={`rounded-2xl overflow-hidden flex flex-col h-full ${isGold ? 'lg:-mx-2' : ''}`}
                    style={{
                      background: isSilver ? '#1E1C19' : '#141210',
                      border: `1px solid ${tier.accentColor}${isSilver ? '55' : '2A'}`,
                      boxShadow: isSilver ? `0 0 48px ${tier.accentColor}18` : undefined,
                    }}
                  >
                    {/* Accent top stripe */}
                    <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${tier.accentColor}, ${tier.accentColor}30)` }} />

                    <div className="p-8 flex flex-col flex-1">
                      {/* Badge */}
                      {tier.badge && (
                        <div className="mb-5">
                          <span
                            className="font-body text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                            style={{ background: `${tier.accentColor}18`, color: tier.accentColor, border: `1px solid ${tier.accentColor}40` }}
                          >
                            {tier.badge}
                          </span>
                        </div>
                      )}

                      {/* Tier identity */}
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${tier.accentColor}15`, border: `1px solid ${tier.accentColor}35`, color: tier.accentColor }}
                        >
                          <TierIcon name={tier.name} />
                        </div>
                        <p className="font-display font-bold text-[28px] leading-none" style={{ color: tier.accentColor }}>{tier.name}</p>
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash/40 mb-5">{tier.subtitle}</p>

                      {/* Tagline */}
                      <p className="font-display italic text-sm text-ash/70 mb-6 leading-snug">{tier.tagline}</p>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-white/[0.06]">
                        {annual ? (
                          <>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-body text-sm text-ash/30 line-through">${tier.price.monthly.toLocaleString()}</span>
                              <span className="font-mono text-[10px] uppercase tracking-widest font-medium" style={{ color: tier.accentColor }}>Save 10%</span>
                            </div>
                            <div className="flex items-end gap-1">
                              <span className="font-display font-bold text-[52px] leading-none text-cream">${price.toLocaleString()}</span>
                              <span className="font-body text-sm text-ash/50 mb-1.5">/mo, billed annually</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-end gap-1">
                            <span className="font-display font-bold text-[52px] leading-none text-cream">${price.toLocaleString()}</span>
                            <span className="font-body text-sm text-ash/50 mb-1.5">/mo</span>
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-2.5 mb-8">
                        {tier.highlights.map((h, hi) => (
                          <li key={hi} className="flex items-start gap-3">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tier.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-body text-sm text-ash/80">{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleStripeCheckout(tier.slug)}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 w-full font-body font-semibold text-sm px-6 py-4 rounded-full text-white transition-all duration-300 hover:brightness-110 mb-3 disabled:opacity-70 disabled:cursor-not-allowed"
                          style={{ background: `linear-gradient(135deg, ${tier.accentColor}, ${tier.accentColor}CC)` }}
                        >
                          {isLoading ? (
                            <><Spinner /> Redirecting…</>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              Get {tier.name} — ${price.toLocaleString()}/mo
                            </>
                          )}
                        </button>

                        <p className="text-center mb-6">
                          <Link href="/contact" className="font-body text-xs text-ash/40 hover:text-ash transition-colors">
                            Have questions? Book a free call →
                          </Link>
                        </p>

                        <button
                          onClick={() => setExpanded(isExpanded ? null : tier.slug)}
                          className="flex items-center gap-1.5 font-body text-xs text-ash/40 hover:text-ash transition-colors w-full"
                        >
                          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          {isExpanded ? 'Hide full deliverables' : 'See everything included'}
                        </button>

                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-white/[0.05] space-y-5">
                            {tier.deliverables.map((group, gi) => (
                              <div key={gi}>
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash/35 mb-2.5">{group.pillar}</p>
                                <ul className="space-y-1.5">
                                  {group.items.map((item, ii) => (
                                    <li key={ii} className="flex items-start gap-2.5">
                                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: tier.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                      <span className="font-body text-xs text-ash/60">{item}</span>
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
        </div>
      </section>

      {/* Trust signals strip */}
      <div className="bg-[#0A0908] border-t border-b border-white/[0.06] py-5 px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash/40 text-center">
          CANCEL ANYTIME&nbsp;&nbsp;·&nbsp;&nbsp;ONBOARDING IN 48 HRS&nbsp;&nbsp;·&nbsp;&nbsp;DEDICATED ACCOUNT MANAGER&nbsp;&nbsp;·&nbsp;&nbsp;NO LONG-TERM CONTRACTS
        </p>
      </div>

      {/* The Sides — a-la-carte */}
      <section className="bg-obsidian py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <SectionEyebrow text="À La Carte" />
            <h2 className="font-display font-semibold text-[40px] text-cream mb-3">Just need one thing?</h2>
            <p className="font-body text-base text-ash">Order exactly what you need. Flat fees, fast execution.</p>
          </div>

          <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {services.map((svc, i) => (
              <FadeInWrapper key={svc.slug} delay={i * 60}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 group">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center flex-shrink-0`}>
                    <ServiceIcon type={svc.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-cream text-sm">{svc.service}</p>
                    <p className="font-body text-xs text-ash/80 leading-relaxed mt-0.5">{svc.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-display font-bold text-[22px] text-cream">{svc.fee}</span>
                    <a
                      href={PAYMENT_LINKS[svc.slug] || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs font-semibold px-5 py-2.5 rounded-full border border-cream/40 text-cream hover:bg-cream/10 transition-colors whitespace-nowrap"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </FadeInWrapper>
            ))}

            {/* Strategy Call row */}
            <FadeInWrapper delay={services.length * 60}>
              <div className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4A5348] to-[#2A3228] flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-cream text-sm">Strategy Call</p>
                    <p className="font-body text-xs text-ash/80 leading-relaxed mt-0.5">60-min deep-dive with our team. No pitch — just strategy.</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-display font-bold text-[22px] text-cream">$500</span>
                    <button
                      onClick={() => setCalOpen(!calOpen)}
                      className="font-body text-xs font-semibold px-5 py-2.5 rounded-full border border-cream/40 text-cream hover:bg-cream/10 transition-colors whitespace-nowrap"
                    >
                      {calOpen ? 'Close ✕' : 'Book a Call'}
                    </button>
                  </div>
                </div>

                {/* Cal.com accordion */}
                <div
                  style={{
                    maxHeight: calOpen ? '700px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div className="pt-6">
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={() => setCalOpen(false)}
                        className="font-body text-xs text-ash/60 hover:text-ash transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Close calendar
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white/5">
                      {calOpen && <CalEmbed />}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInWrapper>
          </div>
        </div>
      </section>

      {/* What's not included — unchanged */}
      <section className="bg-bone py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <SectionEyebrow text="Full Transparency" light />
            <h2 className="font-display font-medium text-[32px] text-ink mb-2">Our fee covers expertise and execution.</h2>
            <p className="font-body text-sm text-slate">Here&apos;s what sits outside it.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  {['Item', 'Description', 'Typical Cost'].map(h => (
                    <th key={h} className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-slate font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { item: 'Ad Spend',              desc: 'Facebook, Google, etc.',               cost: 'Set by client' },
                  { item: 'Technology Platforms',  desc: 'CRM, email, scheduling tools',          cost: '$100–$500/mo' },
                  { item: 'Website Hosting',       desc: 'Domain, hosting, SSL',                  cost: '$20–$100/mo' },
                  { item: 'Stock Photography / Video', desc: 'Licensed media assets',             cost: 'As needed' },
                  { item: 'Third-Party Tools',     desc: 'Any specialized software',              cost: 'As needed' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-black/[0.06]">
                    <td className="py-5 pr-8 font-body font-medium text-sm text-ink">{row.item}</td>
                    <td className="py-5 pr-8 font-body text-sm text-slate">{row.desc}</td>
                    <td className="py-5 font-body text-sm text-slate">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Not Sure? — unchanged */}
      <section className="bg-obsidian py-24 md:py-32 grain-overlay">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionEyebrow text="Not Sure Where to Start?" />
          <h2 className="font-display font-bold text-[48px] leading-tight text-cream mb-6">
            Let&apos;s figure it out <em style={{ color: '#7CB550' }}>together.</em>
          </h2>
          <p className="font-body text-base text-ash max-w-lg mx-auto mb-10">
            Book a free 30-minute exploration call. No pitch deck, no pressure — just an honest conversation about your business and where to start.
          </p>
          <Link href="/contact" className="inline-flex items-center bg-moss text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all duration-300">
            Book a Free Exploration Call
          </Link>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-moss px-6 py-4 flex items-center justify-between gap-4"
        style={{
          transform: showStickyBar ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p className="font-body text-sm text-bone font-medium leading-tight">
          Silver — $5,000/mo
        </p>
        <button
          onClick={handleSilverClick}
          disabled={loadingTier === 'silver'}
          className="flex items-center gap-2 bg-bone text-moss font-body font-semibold text-sm px-6 py-3 rounded-full hover:bg-white transition-colors disabled:opacity-70 flex-shrink-0"
        >
          {loadingTier === 'silver' ? <><Spinner /> Redirecting…</> : 'Start with Silver →'}
        </button>
      </div>
    </>
  )
}
