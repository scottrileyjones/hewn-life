'use client'

import { useEffect, useRef, useState } from 'react'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

/* ── Hooks ─────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useCountUp(to: number, duration = 1600, trigger = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [trigger, to, duration])
  return val
}

/* ── Data ───────────────────────────────────────── */
const pillars = [
  { num: '01', name: 'BRAND FOUNDATION',       desc: 'Identity, voice, and positioning — the strategic bedrock everything else is built on.' },
  { num: '02', name: 'DIGITAL PRESENCE',        desc: 'Website, SEO, and maps — your complete digital footprint, owned and optimized.' },
  { num: '03', name: 'LEAD & REVENUE ENGINE',   desc: 'Paid media, funnels, and automation — systems that turn attention into revenue.' },
  { num: '04', name: 'CUSTOMER EXPERIENCE',     desc: 'Scheduling, follow-up, and retention — the systems that turn buyers into loyal customers.' },
  { num: '05', name: 'REPUTATION & SOCIAL PROOF', desc: 'Reviews, UGC, and referrals — turning your best customers into your best marketing.' },
  { num: '06', name: 'BUSINESS ADVISORY',       desc: 'Strategy, KPIs, and growth planning — the fractional CMO layer that ties it all together.' },
]

const comparisonRows = [
  { service: 'Brand Strategy & Identity',     traditional: '$15,000–$50,000 project',    hewn: 'Included' },
  { service: 'Website Design & Development',  traditional: '$15,000–$40,000 project',    hewn: 'Included' },
  { service: 'Paid Media Management',         traditional: '$3,000–$10,000/mo + 15%',   hewn: 'Included' },
  { service: 'SEO & Content Marketing',       traditional: '$3,000–$8,000/month',        hewn: 'Included' },
  { service: 'Marketing Automation & CRM',    traditional: '$5,000–$15,000 setup',      hewn: 'Included' },
  { service: 'Social Media Management',       traditional: '$2,000–$5,000/month',       hewn: 'Included' },
  { service: 'Strategic Advisory / CMO',      traditional: '$5,000–$15,000/month',      hewn: 'Included' },
]

const testimonials = [
  {
    quote: 'Our ROAS went from 1.4 to 3.8 in 90 days. And the brand actually looks like something worth buying from.',
    name: 'Sarah Chen',
    role: 'Founder, Meridian Wellness',
    metric: '3.8×',
    metricLabel: 'ROAS in 90 days',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&crop=face',
  },
  {
    quote: 'Twenty-two days from signed contract to live site. Our last agency took four months just to finish the brief.',
    name: 'Marcus Webb',
    role: 'CEO, Webb Construction Group',
    metric: '22 days',
    metricLabel: 'Contract to launch',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face',
  },
  {
    quote: 'The weekly AI competitive intelligence is worth the retainer by itself. Our rivals have no idea what\'s coming.',
    name: 'Priya Okonkwo',
    role: 'CMO, Elevate Fitness',
    metric: '+284%',
    metricLabel: 'Lead volume YoY',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face',
  },
]

const results = [
  {
    photo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&fit=crop',
    category: 'Paid Media',
    stat: '+284%',
    statLabel: 'Lead volume, Q4 YoY',
  },
  {
    photo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&fit=crop',
    category: 'Brand & Presence',
    stat: '22 days',
    statLabel: 'Avg. time to launch',
  },
  {
    photo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&fit=crop',
    category: 'Growth Systems',
    stat: '3.2×',
    statLabel: 'Average client ROAS',
  },
]

/* ── Page ───────────────────────────────────────── */
export default function Home() {
  const { ref: statsRef, inView: statsInView } = useInView(0.2)
  const { ref: testRef,  inView: testInView  } = useInView(0.1)

  const brands  = useCountUp(47,  1600, statsInView)
  const adSpend = useCountUp(42,  1800, statsInView)
  const roas    = useCountUp(32,  1400, statsInView)
  const days    = useCountUp(22,  1200, statsInView)

  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden grain-overlay pt-20"
        style={{
          background: `
            radial-gradient(ellipse at 60% 40%, rgba(124,181,80,0.13) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 70%, rgba(74,83,72,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(124,181,80,0.06) 0%, transparent 45%),
            #1A1815
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="The AI-Era Marketing Agency" />
          </div>
          <h1 className="font-display font-semibold text-[52px] md:text-[72px] lg:text-[88px] leading-[1.08] text-cream mb-8 max-w-4xl mx-auto animate-fade-up delay-1">
            Marketing isn&apos;t a line item.<br className="hidden md:block" /> It&apos;s the <span className="italic text-ember">life</span> of your business.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl mx-auto mb-10 animate-fade-up delay-2 leading-relaxed">
            Hewn Life combines thirty years of human business acumen with the speed and scale of AI to carve out something truly beautiful and valuable for your brand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-3">
            <Link
              href="/pricing"
              className="bg-ember text-iron font-body font-semibold px-8 py-4 rounded-full hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
            >
              Get Started — From $2,500/mo
            </Link>
            <Link href="/how-it-works" className="text-cream font-body font-medium px-8 py-4 rounded-full hover:underline underline-offset-4 flex items-center gap-2">
              See How It Works →
            </Link>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25 mt-6 animate-fade-up delay-3">
            No long-term contracts &nbsp;·&nbsp; Month-to-month after the build
          </p>
        </div>
      </section>

      {/* ── PROOF STATS ───────────────────────────── */}
      <div ref={statsRef} className="bg-iron border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.07]">
            {[
              { value: `${brands}+`,                          label: 'Brands built & launched' },
              { value: `$${Math.floor(adSpend/10)}.${adSpend%10}M`, label: 'Ad spend managed' },
              { value: `${Math.floor(roas/10)}.${roas%10}×`, label: 'Average client ROAS' },
              { value: `${days} days`,                        label: 'Average time to launch' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 first:pl-0 last:pr-0">
                <p className="font-display text-[38px] md:text-[48px] text-cream leading-none">{s.value}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ember mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DISRUPTION STATEMENT ──────────────────── */}
      <section className="bg-bone py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="font-display font-bold text-[100px] md:text-[120px] leading-none text-ember">3×</p>
              <p className="font-body text-sm text-slate mt-2">average ROI vs. traditional agency model</p>
            </div>
            <div>
              <SectionEyebrow text="What Makes Us Different" light />
              <h2 className="font-display font-medium text-[36px] md:text-[40px] leading-tight text-ink mb-6 mt-2">
                Premium, full-service marketing at a fraction of the traditional cost.
              </h2>
              <p className="font-body text-base text-slate max-w-lg mb-8 leading-relaxed">
                Traditional agencies carry massive overhead, opaque retainers, and percentage-of-spend fees that punish your growth. Hewn Life was built to disrupt that. Flat fees. Full transparency. Zero percentage-of-spend.
              </p>
              <Link href="/pricing" className="font-body font-semibold text-sm text-ember hover:underline underline-offset-4">
                See How We Price It →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS / EDITORIAL PHOTOS ────────────── */}
      <section className="bg-white py-20 md:py-28 border-t border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <SectionEyebrow text="Client Results" light />
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-ink leading-tight mt-2">
              The work. The numbers.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((r, i) => (
              <div key={i}>
                <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-iron/80 via-iron/10 to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <p className="font-display text-[36px] text-cream leading-none">{r.stat}</p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/50 mt-1">{r.statLabel}</p>
                  </div>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate mt-3">{r.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIX PILLARS ───────────────────────────── */}
      <section
        className="py-20 md:py-28"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(74,83,72,0.5) 0%, transparent 70%), #1A1815' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionEyebrow text="How We Work" />
            <h2 className="font-display font-normal italic text-[40px] md:text-[48px] leading-tight text-cream mt-2 mb-4">
              Six pillars. One mission.
            </h2>
            <p className="font-body text-base text-ash max-w-2xl mx-auto">
              We operate as your fractional CMO and growth partner — embedded in your business, invested in the outcome, building systems that outlast any single campaign.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 hover:border-ember/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <p className="font-display font-bold text-[48px] text-ember/20 leading-none mb-4">{pillar.num}</p>
                <p className="font-body font-semibold text-[13px] uppercase tracking-wider text-cream mb-3">{pillar.name}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="bg-ember text-iron font-body font-semibold px-8 py-4 rounded-full hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
            >
              Get Started — From $2,500/mo
            </Link>
            <Link href="/how-it-works" className="text-ash font-body text-sm hover:text-cream transition-colors flex items-center gap-2">
              See the full process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section ref={testRef} className="bg-bone py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <SectionEyebrow text="What Clients Say" light />
            <h2 className="font-display font-medium text-[36px] md:text-[44px] text-ink leading-tight mt-2">
              Don&apos;t take our word for it.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-black/[0.06] rounded-2xl p-8 flex flex-col"
                style={{
                  opacity:    testInView ? 1 : 0,
                  transform:  testInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
                }}
              >
                {/* Metric callout */}
                <div className="mb-6 pb-6 border-b border-black/[0.06]">
                  <p className="font-display text-[40px] text-ember leading-none">{t.metric}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate mt-1">{t.metricLabel}</p>
                </div>
                <p className="font-body italic text-[16px] text-slate leading-relaxed flex-1 mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-body font-semibold text-sm text-ink">{t.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────── */}
      <section className="bg-moss py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <SectionEyebrow text="The Numbers Don't Lie" />
            <h2 className="font-display font-normal text-[36px] md:text-[44px] leading-tight text-cream mt-2">
              What this costs at a traditional agency.
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.10]">
                  <th className="text-left py-4 pr-8 font-mono text-[10px] uppercase tracking-[0.15em] text-ash/60 font-normal">Service</th>
                  <th className="text-left py-4 pr-8 font-mono text-[10px] uppercase tracking-[0.15em] text-ash/60 font-normal">Traditional Agency</th>
                  <th className="text-left py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-ember font-normal">Hewn Life</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.06]">
                    <td className="py-4 pr-8 font-body text-sm text-cream">{row.service}</td>
                    <td className="py-4 pr-8 font-body text-sm text-ash line-through decoration-white/20">{row.traditional}</td>
                    <td className="py-4 font-body text-sm font-semibold text-ember">{row.hewn}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/[0.15]">
                  <td className="py-6 font-body font-semibold text-sm text-cream">Monthly Total</td>
                  <td className="py-6 font-body text-sm text-ash line-through decoration-white/20">$20,000–$50,000+/mo</td>
                  <td className="py-6 font-body font-semibold text-ember">From $2,500/mo</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/pricing"
              className="bg-ember text-iron font-body font-semibold px-8 py-4 rounded-full hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
            >
              See Full Pricing
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
              No percentage-of-spend · No hidden fees
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
