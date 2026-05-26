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

function useCountUp(to: number, duration = 1800, trigger = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [trigger, to, duration])
  return val
}

/* ── Data viz components ────────────────────────── */
function Sparkline({ trigger, color = '#7CB550', width = 120, height = 40 }: { trigger: boolean; color?: string; width?: number; height?: number }) {
  const pts = [8, 22, 14, 38, 28, 52, 41, 65, 57, 78, 70, 92]
  const max = Math.max(...pts), min = Math.min(...pts)
  const norm = (v: number) => height - ((v - min) / (max - min)) * (height - 8) - 4
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * width} ${norm(p)}`).join(' ')
  const totalLen = 350
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={`url(#grad-${color.replace('#', '')})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: totalLen,
          strokeDashoffset: trigger ? 0 : totalLen,
          transition: 'stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <circle
        cx={(pts.length - 1) / (pts.length - 1) * width}
        cy={norm(pts[pts.length - 1])}
        r="3"
        fill={color}
        style={{ opacity: trigger ? 1 : 0, transition: 'opacity 0.4s ease 2s' }}
      />
    </svg>
  )
}

function BarChart({ trigger, bars }: { trigger: boolean; bars: { label: string; pct: number; color: string }[] }) {
  return (
    <div className="flex items-end gap-1.5 h-10">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm origin-bottom"
            style={{
              background: b.color,
              height: `${b.pct}%`,
              maxHeight: 36,
              transform: trigger ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'bottom',
              transition: `transform 0.7s cubic-bezier(0.34,1.4,0.64,1) ${i * 90}ms`,
            }}
          />
          <span className="font-mono text-[7px] text-white/30 uppercase leading-none">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

function RingChart({ trigger, pct, color = '#7CB550' }: { trigger: boolean; pct: number; color?: string }) {
  const r = 14, circ = 2 * Math.PI * r
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={trigger ? circ * (1 - pct / 100) : circ}
        style={{ transition: 'stroke-dashoffset 1.4s ease 0.3s' }}
      />
    </svg>
  )
}

/* ── Data ───────────────────────────────────────── */
const pillars = [
  { num: '01', name: 'Brand Foundation',       desc: 'Identity, voice, and positioning — the strategic bedrock everything else is built on.' },
  { num: '02', name: 'Digital Presence',        desc: 'Website, SEO, and maps — your complete digital footprint, owned and optimized.' },
  { num: '03', name: 'Lead & Revenue Engine',   desc: 'Paid media, funnels, and automation — systems that turn attention into revenue.' },
  { num: '04', name: 'Customer Experience',     desc: 'Scheduling, follow-up, and retention — the systems that turn buyers into loyal customers.' },
  { num: '05', name: 'Reputation & Proof',      desc: 'Reviews, UGC, and referrals — turning your best customers into your best marketing.' },
  { num: '06', name: 'Business Advisory',       desc: 'Strategy, KPIs, and growth planning — the fractional CMO layer that ties it all together.' },
]

const testimonials = [
  {
    quote: "Hewn Life didn't just run our marketing. They rebuilt how we think about the entire business.",
    name: 'Sarah Chen',
    role: 'Founder, Meridian Wellness',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&crop=face',
  },
  {
    quote: "We launched in 22 days. Our last agency took four months just to build the brief.",
    name: 'Marcus Webb',
    role: 'CEO, Webb Construction Group',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face',
  },
  {
    quote: "The AI layer is real. We get competitive insights our rivals won't see for months.",
    name: 'Priya Okonkwo',
    role: 'CMO, Elevate Fitness',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face',
  },
]

/* ── Page ───────────────────────────────────────── */
export default function Home() {
  const { ref: statsRef, inView: statsInView } = useInView(0.2)
  const { ref: photoRef, inView: photoInView } = useInView(0.1)
  const { ref: testRef, inView: testInView } = useInView(0.1)

  const brands  = useCountUp(47,   1600, statsInView)
  const days    = useCountUp(22,   1200, statsInView)
  const clients = useCountUp(124,  2000, statsInView)

  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="bg-bone pt-28 pb-16 md:pb-20 border-b border-iron/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Editorial header strip */}
          <div className="flex items-center gap-6 mb-10 pb-5 border-b border-iron/10">
            <SectionEyebrow text="The AI-Era Marketing Agency" light />
            <div className="flex-1 h-px bg-iron/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* Left — text */}
            <div className="order-2 lg:order-1">
              <h1 className="font-display text-[52px] md:text-[66px] lg:text-[78px] text-iron leading-[1.02] mb-6 animate-fade-up">
                Marketing that moves<br />
                at the speed of<br />
                <em style={{ color: '#7CB550' }}>your ambition.</em>
              </h1>
              <p
                className="font-body text-lg text-ash max-w-md mb-10 leading-relaxed animate-fade-up"
                style={{ animationDelay: '80ms' }}
              >
                AI-driven analysis and speed. Human taste and judgment. Full-service execution at a fraction of what agencies charge.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-up"
                style={{ animationDelay: '160ms' }}
              >
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center bg-iron text-bone font-body font-semibold px-8 py-4 rounded-sm hover:bg-iron/85 transition-all duration-300 text-base"
                >
                  Get Started — From $2,500/mo
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-iron/40 font-body text-sm hover:text-iron transition-colors flex items-center gap-2 self-center"
                >
                  See how it works →
                </Link>
              </div>

              {/* Trust stats */}
              <div
                className="mt-12 pt-10 border-t border-iron/10 grid grid-cols-2 gap-8 animate-fade-up"
                style={{ animationDelay: '240ms' }}
              >
                {[
                  { value: '47+',     label: 'Brands launched' },
                  { value: '$4.2M',   label: 'Ad spend managed' },
                  { value: '3.2×',    label: 'Average ROAS' },
                  { value: '22 days', label: 'Avg time to launch' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="font-display text-[28px] md:text-[34px] text-iron leading-none">{s.value}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-iron/35 mt-1.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — person photo (hidden on mobile) */}
            <div
              className="order-1 lg:order-2 hidden lg:block animate-fade-up"
              style={{ animationDelay: '60ms' }}
            >
              <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '3/4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=85&fit=crop&crop=top"
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-iron/30 mt-3 pl-1">
                Building brands that compound.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS ──────────────────────────── */}
      <div ref={statsRef} className="bg-iron border-b border-white/[0.06] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-white/[0.08]">
            <div className="md:pr-12">
              <p className="font-display text-[64px] md:text-[80px] leading-none text-bone">
                {brands}<span className="text-ember">+</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember mt-3">Brands built & launched</p>
              <p className="font-body text-sm text-white/30 mt-2 leading-relaxed">Across retail, services, health, and e-commerce</p>
            </div>
            <div className="md:px-12">
              <p className="font-display text-[64px] md:text-[80px] leading-none text-bone">
                {days}<span className="text-ember"> days</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember mt-3">Average time to launch</p>
              <p className="font-body text-sm text-white/30 mt-2 leading-relaxed">From signed contract to live brand and site</p>
            </div>
            <div className="md:pl-12">
              <p className="font-display text-[64px] md:text-[80px] leading-none text-bone">
                {clients}<span className="text-ember">%</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember mt-3">Client retention rate</p>
              <p className="font-body text-sm text-white/30 mt-2 leading-relaxed">Because results compound and the system keeps working</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── WORK SECTION ────────────────────────────── */}
      <section ref={photoRef} className="bg-bone py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-end justify-between gap-8 mb-10 pb-6 border-b border-iron/10">
            <div>
              <SectionEyebrow text="The Work" light />
              <h2 className="font-display font-medium text-[36px] md:text-[48px] text-iron leading-tight mt-2">
                AI does the heavy lifting.<br /><em style={{ color: '#7CB550' }}>We make it win.</em>
              </h2>
            </div>
            <p className="hidden md:block font-body text-sm text-ash leading-relaxed max-w-xs self-end">
              Real-time intelligence, creative variation, and human judgment — every campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Large photo */}
            <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&fit=crop"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-iron via-iron/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-iron/80 backdrop-blur-md border border-white/[0.10] rounded-sm p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/35 mb-3">Campaign performance — Q4</p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-display text-[28px] text-ember leading-none">+284%</p>
                      <p className="font-mono text-[9px] text-white/30 mt-1">Lead volume YoY</p>
                    </div>
                    <Sparkline trigger={photoInView} width={120} height={40} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — two stacked */}
            <div className="flex flex-col gap-4">

              <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80&fit=crop"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-iron via-iron/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-iron/80 backdrop-blur-md border border-white/[0.10] rounded-sm p-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/35 mb-3">ROAS by channel</p>
                    <BarChart
                      trigger={photoInView}
                      bars={[
                        { label: 'Meta',   pct: 62, color: 'rgba(124,181,80,0.45)' },
                        { label: 'Google', pct: 78, color: 'rgba(124,181,80,0.65)' },
                        { label: 'TikTok', pct: 91, color: 'rgba(124,181,80,0.85)' },
                        { label: 'Email',  pct: 100, color: '#7CB550' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80&fit=crop"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-iron via-iron/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-iron/80 backdrop-blur-md border border-white/[0.10] rounded-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/35">Market share captured</p>
                      <p className="font-display text-[24px] text-bone leading-none mt-1">↑ 18%</p>
                      <p className="font-mono text-[8px] text-white/30 mt-1">vs. nearest competitor</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <RingChart trigger={photoInView} pct={72} />
                      <span className="font-mono text-[8px] text-ember">72%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SIX PILLARS ────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-t border-b border-iron/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between gap-8 mb-10 pb-6 border-b border-iron/10">
            <div>
              <SectionEyebrow text="How We Work" light />
              <h2 className="font-display font-normal italic text-[36px] md:text-[48px] text-iron leading-tight mt-2">
                Six pillars.<br />One mission.
              </h2>
            </div>
            <p className="hidden md:block font-body text-sm text-ash leading-relaxed max-w-xs self-end">
              We operate as your embedded growth partner — not a vendor. Every pillar connects to the next.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {pillars.map((p) => (
              <div key={p.num} className="group">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ember mb-3">{p.num}</p>
                <h3 className="font-display text-[20px] text-iron mb-3 leading-tight">{p.name}</h3>
                <p className="font-body text-sm text-ash leading-relaxed">{p.desc}</p>
                <div className="mt-5 h-px bg-iron/8 group-hover:bg-ember/40 transition-colors duration-300" />
              </div>
            ))}
          </div>
          <div className="mt-14 flex items-center gap-6">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-iron text-bone font-body font-semibold px-8 py-4 rounded-sm hover:bg-iron/85 transition-all duration-300"
            >
              Get Started — From $2,500/mo
            </Link>
            <Link href="/how-it-works" className="font-body text-sm text-ash hover:text-iron transition-colors">
              See the full process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section ref={testRef} className="bg-bone py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-end justify-between gap-8 mb-10 pb-6 border-b border-iron/10">
            <div>
              <SectionEyebrow text="Client Results" light />
              <h2 className="font-display font-medium text-[36px] md:text-[48px] text-iron leading-tight mt-2">
                Don&apos;t take<br /><em>our word for it.</em>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-iron/8 rounded-sm p-8 flex flex-col"
                style={{
                  opacity: testInView ? 1 : 0,
                  transform: testInView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
                }}
              >
                <p className="font-display italic text-[18px] text-iron/70 leading-snug mb-8 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-6 border-t border-iron/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-body font-semibold text-sm text-iron">{t.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-iron/35">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
