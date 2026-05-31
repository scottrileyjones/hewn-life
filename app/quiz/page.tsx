'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CalButton from '@/components/CalButton'

const QUIZ_HERO_IMAGE =
  'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1400,h_1600,c_fill/v1779578220/main-sample.png'

// ── Revenue slider stops ──────────────────────────────────────────────────────

const REVENUE_STOPS = [
  { value: 0, label: '$0' },
  { value: 50000, label: '$50K' },
  { value: 100000, label: '$100K' },
  { value: 250000, label: '$250K' },
  { value: 500000, label: '$500K' },
  { value: 750000, label: '$750K' },
  { value: 1000000, label: '$1M' },
  { value: 1500000, label: '$1.5M' },
  { value: 2000000, label: '$2M' },
  { value: 3000000, label: '$3M' },
  { value: 5000000, label: '$5M' },
  { value: 7500000, label: '$7.5M' },
  { value: 10000000, label: '$10M' },
  { value: 15000000, label: '$15M' },
  { value: 20000000, label: '$20M' },
  { value: 30000000, label: '$30M' },
  { value: 50000000, label: '$50M' },
  { value: 75000000, label: '$75M' },
  { value: 100000000, label: '$100M' },
  { value: 100000001, label: '$100M+' },
]

function revenueLabel(idx: number): string {
  return REVENUE_STOPS[idx]?.label ?? '$0'
}

function revenueValue(idx: number): number {
  return REVENUE_STOPS[idx]?.value ?? 0
}

// Derive the business-stage bucket the rest of the scoring relies on from the
// real annual-revenue number the user gave us on the slider.
function revenueStage(idx: number): 'pre' | 'early' | 'growth' | 'scale' {
  const v = revenueValue(idx)
  if (v <= 0) return 'pre'
  if (v < 250000) return 'early'
  if (v < 1000000) return 'growth'
  return 'scale'
}

// ── Questions ────────────────────────────────────────────────────────────────

const questions = [
  {
    id: 'goal',
    question: 'What\'s your single most important goal in the next 90 days?',
    subtitle: 'Pick the one that keeps you up at night.',
    options: [
      { label: 'Get a professional web presence live', value: 'web', score: { hewn: 3, wrought: 0, forged: 0 } },
      { label: 'Generate consistent inbound leads', value: 'leads', score: { hewn: 1, wrought: 2, forged: 2 } },
      { label: 'Grow revenue from existing customers', value: 'retention', score: { hewn: 0, wrought: 2, forged: 2 } },
      { label: 'Dominate a market or outpace a competitor', value: 'dominate', score: { hewn: 0, wrought: 1, forged: 3 } },
    ],
  },
  {
    id: 'presence',
    question: 'How would you describe your current marketing presence?',
    subtitle: 'No judgment — most businesses are in survival mode.',
    options: [
      { label: 'Little to none — we rely on referrals', value: 'none', score: { hewn: 3, wrought: 1, forged: 0 } },
      { label: 'Basic — a website and occasional posts', value: 'basic', score: { hewn: 2, wrought: 2, forged: 0 } },
      { label: 'Active — ads, email, content but not converting', value: 'active', score: { hewn: 0, wrought: 3, forged: 1 } },
      { label: 'Sophisticated — we have systems, just need them to perform', value: 'advanced', score: { hewn: 0, wrought: 1, forged: 3 } },
    ],
  },
  {
    id: 'budget',
    question: 'What\'s a realistic monthly marketing investment for you?',
    subtitle: 'This shapes what we can actually build together.',
    options: [
      { label: 'Under $1,000 / mo — I need one-off work', value: 'low', score: { hewn: 3, wrought: 0, forged: 0 } },
      { label: '$1,000–$3,000 / mo', value: 'mid', score: { hewn: 2, wrought: 1, forged: 0 } },
      { label: '$3,000–$6,000 / mo', value: 'high', score: { hewn: 0, wrought: 3, forged: 1 } },
      { label: '$6,000+ / mo — results over everything', value: 'premium', score: { hewn: 0, wrought: 0, forged: 3 } },
    ],
  },
  {
    id: 'pain',
    question: 'What\'s the biggest thing holding your marketing back?',
    subtitle: 'Be specific — vague problems get vague solutions.',
    options: [
      { label: 'No website or it\'s embarrassing to share', value: 'nosite', score: { hewn: 3, wrought: 0, forged: 0 } },
      { label: 'We get traffic but nothing converts', value: 'conversion', score: { hewn: 1, wrought: 3, forged: 1 } },
      { label: 'We don\'t show up in search or social', value: 'visibility', score: { hewn: 0, wrought: 2, forged: 2 } },
      { label: 'Our messaging is inconsistent or unclear', value: 'messaging', score: { hewn: 1, wrought: 2, forged: 2 } },
    ],
  },
  {
    id: 'timeline',
    question: 'How urgent is this for you?',
    subtitle: 'Speed costs. Knowing this helps us prioritize.',
    options: [
      { label: 'I needed it yesterday', value: 'urgent', score: { hewn: 2, wrought: 2, forged: 1 } },
      { label: 'Within the next 30 days', value: 'soon', score: { hewn: 1, wrought: 2, forged: 2 } },
      { label: 'This quarter — building toward something', value: 'quarter', score: { hewn: 0, wrought: 2, forged: 3 } },
      { label: 'No rush — doing our research', value: 'research', score: { hewn: 1, wrought: 1, forged: 1 } },
    ],
  },
  {
    id: 'team',
    question: 'What does your internal marketing capacity look like?',
    subtitle: 'This tells us how much we need to own versus support.',
    options: [
      { label: 'Just me — I do everything', value: 'solo', score: { hewn: 2, wrought: 2, forged: 1 } },
      { label: 'One or two people who wear many hats', value: 'small', score: { hewn: 1, wrought: 2, forged: 2 } },
      { label: 'A small dedicated team but missing strategy', value: 'team', score: { hewn: 0, wrought: 1, forged: 3 } },
      { label: 'A full team — we need an execution partner', value: 'full', score: { hewn: 0, wrought: 0, forged: 3 } },
    ],
  },
]

// ── Service map ───────────────────────────────────────────────────────────────

type ServiceFlag = {
  label: string
  reason: string
  trigger: (answers: Record<string, string>) => boolean
}

const serviceFlags: ServiceFlag[] = [
  {
    label: 'Website Design & Development',
    reason: 'Your foundation needs to be something worth sending people to.',
    trigger: a => ['none', 'basic', 'nosite', 'pre', 'early'].some(v => Object.values(a).includes(v)),
  },
  {
    label: 'Conversion Rate Optimization',
    reason: 'You have traffic but your site isn\'t turning visitors into revenue.',
    trigger: a => a.pain === 'conversion' || a.presence === 'active',
  },
  {
    label: 'SEO & Content Strategy',
    reason: 'Long-term organic traffic is the highest-ROI channel for your stage.',
    trigger: a => a.pain === 'visibility' || a.goal === 'leads',
  },
  {
    label: 'Paid Media Management',
    reason: 'You need fast, scalable lead flow — not a waiting game.',
    trigger: a => a.budget === 'high' || a.budget === 'premium' || a.goal === 'dominate',
  },
  {
    label: 'Brand Messaging & Positioning',
    reason: 'Before you spend on ads, your story has to be impossible to ignore.',
    trigger: a => a.pain === 'messaging' || a.stage === 'pre' || a.stage === 'early',
  },
  {
    label: 'Email & Retention Marketing',
    reason: 'The most underutilized channel — your best customers buy again.',
    trigger: a => a.goal === 'retention' || a.stage === 'scale' || a.stage === 'growth',
  },
  {
    label: 'Full-Funnel Growth Strategy',
    reason: 'You need a connected system, not disconnected tactics.',
    trigger: a => a.stage === 'scale' || a.budget === 'premium' || a.goal === 'dominate',
  },
]

// ── Tier config ───────────────────────────────────────────────────────────────

const tiers = {
  hewn: {
    name: 'Hewn',
    price: '$2,500 / mo',
    tagline: 'Build the foundation. Own your market.',
    description: 'For businesses that need to establish a professional presence before they can scale. We build the core — site, brand, messaging — so every future dollar you spend actually works.',
    href: '/pricing',
    color: '#6BAD3D',
  },
  wrought: {
    name: 'Wrought',
    price: '$5,000 / mo',
    tagline: 'Activate the machine.',
    description: 'For growing businesses ready to turn marketing into a revenue driver. SEO, paid media, email, and conversion optimization — a full system running for you every month.',
    href: '/pricing',
    color: '#8B5CF6',
  },
  forged: {
    name: 'Forged',
    price: '$9,500 / mo',
    tagline: 'Market leadership or nothing.',
    description: 'For companies that are done playing catch-up. Full-stack growth execution with senior strategy, aggressive paid programs, and a dedicated team obsessed with your numbers.',
    href: '/pricing',
    color: '#8B5CF6',
  },
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function computeResult(answers: Record<string, string>): 'hewn' | 'wrought' | 'forged' {
  const totals = { hewn: 0, wrought: 0, forged: 0 }
  questions.forEach(q => {
    const val = answers[q.id]
    const opt = q.options.find(o => o.value === val)
    if (opt) {
      totals.hewn += opt.score.hewn
      totals.wrought += opt.score.wrought
      totals.forged += opt.score.forged
    }
  })
  if (totals.forged >= totals.wrought && totals.forged >= totals.hewn) return 'forged'
  if (totals.wrought >= totals.hewn) return 'wrought'
  return 'hewn'
}

function computeScore(answers: Record<string, string>): number {
  const totals = { hewn: 0, wrought: 0, forged: 0 }
  questions.forEach(q => {
    const opt = q.options.find(o => o.value === answers[q.id])
    if (opt) {
      totals.hewn += opt.score.hewn
      totals.wrought += opt.score.wrought
      totals.forged += opt.score.forged
    }
  })
  return Math.max(totals.hewn, totals.wrought, totals.forged)
}

function getServices(answers: Record<string, string>): ServiceFlag[] {
  return serviceFlags.filter(s => s.trigger(answers))
}

// ── Health score ──────────────────────────────────────────────────────────────

type HealthCategory = { label: string; score: number; description: string }

function computeHealthScore(answers: Record<string, string>): { overall: number; categories: HealthCategory[] } {
  const presenceMap: Record<string, number> = { none: 8, basic: 28, active: 62, advanced: 88 }
  const budgetMap: Record<string, number> = { low: 10, mid: 30, high: 65, premium: 88 }
  const stageMap: Record<string, number> = { pre: 12, early: 30, growth: 62, scale: 85 }
  const teamMap: Record<string, number> = { solo: 18, small: 40, team: 65, full: 85 }
  const painMap: Record<string, number> = { nosite: 8, conversion: 42, visibility: 48, messaging: 38 }

  const presence = presenceMap[answers.presence] ?? 20
  const budget = budgetMap[answers.budget] ?? 20
  const stage = stageMap[answers.stage] ?? 20
  const team = teamMap[answers.team] ?? 20
  const pain = painMap[answers.pain] ?? 30

  const overall = Math.round((presence + budget + stage + team + pain) / 5)

  const categories: HealthCategory[] = [
    {
      label: 'Digital Presence',
      score: presence,
      description: presence < 30 ? 'Little to no established presence — the foundation is missing.' : presence < 60 ? 'Basic presence exists but conversion and differentiation are weak.' : 'Strong presence with active channels in play.',
    },
    {
      label: 'Investment Readiness',
      score: budget,
      description: budget < 30 ? 'Budget constraints will limit growth velocity significantly.' : budget < 60 ? 'Budget allows for meaningful activity, with room to scale.' : 'Investment level is aligned with serious growth ambitions.',
    },
    {
      label: 'Business Maturity',
      score: stage,
      description: stage < 30 ? 'Early stage — systems and proof points are still being built.' : stage < 60 ? 'Established business with clear growth trajectory.' : 'Proven business ready to scale aggressively.',
    },
    {
      label: 'Team Capacity',
      score: team,
      description: team < 30 ? 'Thin team means marketing will compete with everything else for attention.' : team < 60 ? 'Some marketing capacity, but strategy and execution are stretched.' : 'Solid team capacity to execute and adapt quickly.',
    },
  ]

  return { overall, categories }
}

// ── ROI projection ────────────────────────────────────────────────────────────

type RoiProjection = {
  revenueLabel: string
  conservativeLift: number
  aggressiveLift: number
  conservativeNew: string
  aggressiveNew: string
  aggressiveNewRaw: number
  annualMin: string
  annualMax: string
  annualMaxRaw: number
}

function computeRoi(annualRevenue: number, revLabel: string, tierKey: 'hewn' | 'wrought' | 'forged'): RoiProjection {
  const liftRange: Record<string, [number, number]> = {
    hewn:   [0.18, 0.32],
    wrought:[0.38, 0.65],
    forged: [0.65, 1.20],
  }

  const base = annualRevenue
  const [lo, hi] = liftRange[tierKey]

  const newLo = Math.round(base * lo)
  const newHi = Math.round(base * hi)

  const fmt = (n: number) =>
    n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`

  const cost: Record<string, number> = { hewn: 30000, wrought: 60000, forged: 114000 }
  const annualCost = cost[tierKey]
  const annualMin = fmt(Math.max(0, newLo - annualCost))
  const annualMax = fmt(Math.max(0, newHi - annualCost))

  return {
    revenueLabel: revLabel,
    conservativeLift: Math.round(lo * 100),
    aggressiveLift: Math.round(hi * 100),
    conservativeNew: fmt(newLo),
    aggressiveNew: fmt(newHi),
    aggressiveNewRaw: newHi,
    annualMin,
    annualMax,
    annualMaxRaw: Math.max(0, newHi - annualCost),
  }
}

// ── Results dashboard ─────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1800): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setVal(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return val
}

function fmtCompact(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}

function ResultsDashboard({
  contact, tier, tierKey, health, roi, services, onRestart,
}: {
  contact: Contact
  tier: typeof tiers['hewn']
  tierKey: 'hewn' | 'wrought' | 'forged'
  health: ReturnType<typeof computeHealthScore>
  roi: RoiProjection
  services: ServiceFlag[]
  onRestart: () => void
}) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3000),
      setTimeout(() => setPhase(5), 3600),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  const roiCount = useCountUp(roi.aggressiveNewRaw, phase >= 1, 2000)
  const netCount = useCountUp(roi.annualMaxRaw, phase >= 1, 2200)
  const scoreCount = useCountUp(health.overall, phase >= 2, 1400)
  const scoreColor = health.overall >= 65 ? '#6BAD3D' : health.overall >= 40 ? '#F59E0B' : '#EF4444'
  const scoreLabel = health.overall >= 65 ? 'Strong Foundation' : health.overall >= 40 ? 'Room to Grow' : 'Significant Gap'
  const firstName = contact.name ? contact.name.split(' ')[0] : null

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="px-6 lg:px-12 max-w-4xl mx-auto pb-24 pt-28">

        {/* ── Report label + retake ── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6BAD3D] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89F92]">Growth Opportunity Report</span>
          </div>
          <button onClick={onRestart} className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] hover:text-[#6B6560] transition-colors">
            ← Retake
          </button>
        </div>

        {/* ── Hero headline ── */}
        <div className={`pb-12 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6BAD3D] mb-5">
            {firstName ? `${firstName}'s Assessment` : 'Your Assessment'} · {tier.name} Tier Match
          </p>
          <h1 className="hero-heading text-[36px] md:text-[56px] text-[#0D0D0D] leading-[1.04] mb-4">
            You have a real<br />
            <span className="accent" style={{ color: '#6BAD3D' }}>revenue opportunity.</span>
          </h1>
          <p className="font-body text-base text-[#6B6560] max-w-xl">
            Based on your answers, here's what the numbers say — and what's within reach if you execute.
          </p>
        </div>

        {/* ── ROI hero ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-3xl overflow-hidden bg-white border border-black/[0.07] shadow-[0_4px_40px_-8px_rgba(0,0,0,0.08)] p-8 md:p-12">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl bg-[#8B5CF6]/8 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-[#6BAD3D]/8 pointer-events-none" />

            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89F92] mb-6">Revenue Opportunity · {roi.revenueLabel} current revenue</p>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6BAD3D] mb-3">Potential New Revenue</p>
                  <div className="font-display text-[64px] md:text-[80px] leading-none text-[#0D0D0D] mb-2 tabular-nums">
                    {fmtCompact(roiCount)}
                  </div>
                  <p className="font-body text-[14px] text-[#A89F92]">additional annual revenue — aggressive case</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8B5CF6] mb-3">Net ROI After Retainer</p>
                  <div className="font-display text-[48px] md:text-[60px] leading-none mb-2 tabular-nums" style={{ color: '#8B5CF6' }}>
                    {fmtCompact(netCount)}
                  </div>
                  <p className="font-body text-[14px] text-[#A89F92]">profit above {tier.price} investment</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Revenue Lift Range', val: `${roi.conservativeLift}–${roi.aggressiveLift}%` },
                  { label: 'Conservative Case', val: roi.conservativeNew },
                  { label: 'Annual Retainer', val: tier.price.split(' ')[0] },
                ].map(s => (
                  <div key={s.label} className="bg-[#F9F7F3] rounded-2xl p-4 border border-black/[0.06]">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#A89F92] mb-2">{s.label}</p>
                    <p className="font-display text-[22px] leading-none text-[#0D0D0D]">{s.val}</p>
                  </div>
                ))}
              </div>

              <p className="font-body text-[11px] text-[#C4BDB5] mt-6 leading-relaxed">
                Projections based on industry ROAS benchmarks for businesses at your stage and tier. Actual results vary. Not a guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* ── Marketing health ── */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-black/[0.07] shadow-[0_4px_40px_-8px_rgba(0,0,0,0.06)] p-8 md:p-10">
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
              {/* Dial */}
              <div className="flex flex-col items-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92] mb-5">Marketing Health</p>
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="50" fill="none" strokeWidth="8"
                      stroke={scoreColor} strokeLinecap="round"
                      strokeDasharray={`${phase >= 2 ? (health.overall / 100) * 314 : 0} 314`}
                      style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 6px ${scoreColor}50)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-[44px] leading-none text-[#0D0D0D] tabular-nums">{scoreCount}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#A89F92]">/ 100</span>
                  </div>
                </div>
                <span className="mt-4 font-mono text-[11px] px-4 py-1.5 rounded-full border" style={{ color: scoreColor, borderColor: `${scoreColor}40`, background: `${scoreColor}12` }}>
                  {scoreLabel}
                </span>
                <p className="font-body text-[12px] text-[#A89F92] text-center mt-3 max-w-[160px]">
                  {health.overall < 40 ? 'Big gap = big opportunity.' : health.overall < 65 ? 'Solid base, accelerate now.' : 'Strong — time to scale.'}
                </p>
              </div>

              {/* Category bars */}
              <div className="space-y-5">
                {health.categories.map((cat, i) => {
                  const c = cat.score >= 65 ? '#6BAD3D' : cat.score >= 40 ? '#F59E0B' : '#EF4444'
                  const active = phase >= 3
                  return (
                    <div key={cat.label} style={{ transitionDelay: active ? `${i * 100}ms` : '0ms' }}
                      className={`transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-body text-[13px] text-[#3D3A36]">{cat.label}</span>
                        <span className="font-mono text-[12px] tabular-nums" style={{ color: c }}>{cat.score}/100</span>
                      </div>
                      <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: active ? `${cat.score}%` : '0%',
                          background: c,
                          transition: `width 1s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`,
                        }} />
                      </div>
                      <p className="font-body text-[11px] text-[#A89F92] mt-1">{cat.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommended services ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl border border-black/[0.07] shadow-[0_4px_40px_-8px_rgba(0,0,0,0.06)] p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92] mb-2">Recommended Service Mix</p>
            <h2 className="hero-heading text-[24px] md:text-[32px] text-[#0D0D0D] leading-tight mb-8">
              The channels that'll <span className="accent" style={{ color: '#6BAD3D' }}>move the needle.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-5 bg-[#F9F7F3] border border-black/[0.06] rounded-2xl transition-all duration-500 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#6BAD3D] flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-display font-semibold text-[15px] text-[#0D0D0D] mb-0.5">{svc.label}</p>
                    <p className="font-body text-[12px] text-[#A89F92] leading-relaxed">{svc.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier + CTA ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-[#0D0D0D]">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: tier.color }} />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: tier.color }} />
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: tier.color }}>
                Your Starting Point · {tierKey === 'hewn' ? 'Foundation' : tierKey === 'wrought' ? 'Growth' : 'Scale'}
              </p>
              <h3 className="font-display text-[52px] leading-none text-white mb-1">{tier.name}</h3>
              <p className="font-body text-[28px] font-light text-white/50 mb-5">{tier.price}</p>
              <p className="font-display italic text-[20px] text-white/90 mb-3">{tier.tagline}</p>
              <p className="font-body text-[15px] text-white/50 leading-relaxed max-w-lg mb-10">{tier.description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <CalButton
                  className="inline-flex items-center justify-center font-body font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: tier.color, color: 'white' }}
                >
                  Book a Discovery Call →
                </CalButton>
                <Link href={tier.href} className="inline-flex items-center justify-center border border-white/15 text-white font-body font-medium px-8 py-4 rounded-full hover:border-white/30 transition-all duration-200">
                  See Full Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Not ready yet ── */}
        <div className={`transition-all duration-700 ${phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-black/[0.07] rounded-3xl p-8">
            <div>
              <p className="font-display font-semibold text-[17px] text-[#0D0D0D] mb-1">Not ready for a retainer?</p>
              <p className="font-body text-[14px] text-[#A89F92]">Start with our Website in a Week — fully built for a flat $1,000.</p>
            </div>
            <Link href="/website-in-a-week" className="flex-shrink-0 inline-flex items-center justify-center border border-black/[0.12] text-[#0D0D0D] font-body font-medium px-8 py-4 rounded-full hover:border-black/30 transition-all duration-200 whitespace-nowrap">
              Site in a Week →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Calculating screen ────────────────────────────────────────────────────────

const calcScenes = [
  {
    eyebrow: 'Step 1 · Your website',
    headline: 'A conversion-ready site, live in days.',
    sub: 'Our AI-accelerated build process ships a polished website while traditional agencies are still scheduling the kickoff call.',
  },
  {
    eyebrow: 'Step 2 · Reach',
    headline: 'Ads & content that actually get seen.',
    sub: 'We launch and manage campaigns across search and social — real reach and engagement, without the bloated agency retainer.',
  },
  {
    eyebrow: 'Step 3 · Revenue',
    headline: 'Watch the sales roll in.',
    sub: 'Every channel pointed at one outcome: more customers and more revenue — at a fraction of the cost of building it in-house.',
  },
]

const SCENE_MS = 2800

function CalculatingScreen({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setScene(1), SCENE_MS)
    const t2 = setTimeout(() => setScene(2), SCENE_MS * 2)
    const done = setTimeout(onDone, SCENE_MS * 3)
    // Kick the progress bar to 100% over the full duration.
    const p = requestAnimationFrame(() => setProgress(100))
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(done)
      cancelAnimationFrame(p)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const likeCount = useCountUp(2847, scene >= 1, 2000)
  const revenueCount = useCountUp(4250, scene >= 2, 2000)
  const current = calcScenes[scene]

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-28">
      <div className="max-w-md w-full">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#6BAD3D] mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6BAD3D] animate-pulse mr-2 align-middle" />
          Building your growth plan
        </p>

        {/* Device frame */}
        <div className="relative rounded-[28px] border border-black/[0.08] bg-[#F9F7F3] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-black/[0.06] bg-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-3 flex-1 h-5 rounded-full bg-[#F2ECE0]" />
          </div>

          {/* Scene stage */}
          <div className="relative h-[300px] flex items-center justify-center px-7">
            {/* ── Scene 0: website building ── */}
            {scene === 0 && (
              <div key="s0" className="w-full animate-fade-up">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm">
                  <div className="build-block h-20 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6BAD3D]" style={{ animationDelay: '0ms' }} />
                  <div className="build-block h-3 w-3/4 rounded-full bg-black/10 mt-4" style={{ animationDelay: '300ms' }} />
                  <div className="build-block h-3 w-1/2 rounded-full bg-black/10 mt-2.5" style={{ animationDelay: '500ms' }} />
                  <div className="flex gap-3 mt-4">
                    <div className="build-block h-14 flex-1 rounded-xl bg-black/[0.05]" style={{ animationDelay: '750ms' }} />
                    <div className="build-block h-14 flex-1 rounded-xl bg-black/[0.05]" style={{ animationDelay: '900ms' }} />
                  </div>
                  <div className="build-block mt-4 h-9 w-32 rounded-full bg-[#8B5CF6]" style={{ animationDelay: '1150ms' }} />
                </div>
                <div className="build-badge mt-4 flex items-center justify-center gap-2" style={{ animationDelay: '1500ms' }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6BAD3D]/10 border border-[#6BAD3D]/30 px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D] animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6BAD3D]">Published · Live</span>
                  </span>
                </div>
              </div>
            )}

            {/* ── Scene 1: social engagement ── */}
            {scene === 1 && (
              <div key="s1" className="w-full animate-fade-up">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6BAD3D]" />
                    <div>
                      <div className="h-2.5 w-24 rounded-full bg-black/15" />
                      <div className="h-2 w-16 rounded-full bg-black/10 mt-1.5" />
                    </div>
                  </div>
                  <div className="h-28 rounded-xl bg-gradient-to-br from-[#F2ECE0] to-[#E5E1DA] mb-3 flex items-center justify-center overflow-hidden relative">
                    {/* floating hearts */}
                    {[0,1,2,3,4].map(i => (
                      <span key={i} className="heart-float absolute text-[#EF4444]" style={{ left: `${15 + i*18}%`, animationDelay: `${i*260}ms` }}>♥</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#EF4444]">
                      <span className="heart-pop text-[20px]">♥</span>
                      <span className="font-display text-[18px] text-[#0D0D0D] tabular-nums">{likeCount.toLocaleString()}</span>
                    </span>
                    <span className="font-body text-[13px] text-[#A89F92]">likes this week</span>
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-[#6BAD3D]">↑ 312%</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Scene 2: purchase / revenue ── */}
            {scene === 2 && (
              <div key="s2" className="w-full animate-fade-up">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6BAD3D] flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-2.5 w-28 rounded-full bg-black/15" />
                      <div className="h-2 w-20 rounded-full bg-black/10 mt-2" />
                    </div>
                  </div>
                  <div className="checkout-confirm flex items-center justify-center gap-2 rounded-full bg-[#6BAD3D] py-3 mb-4">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-body font-semibold text-[14px] text-white">Order confirmed</span>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-1">Revenue today</p>
                    <p className="font-display text-[44px] leading-none text-[#0D0D0D] tabular-nums">${revenueCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copy */}
        <div className="text-center mt-7 min-h-[120px]">
          <p key={`e${scene}`} className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8B5CF6] mb-3 animate-fade-up">{current.eyebrow}</p>
          <h2 key={`h${scene}`} className="hero-heading text-[24px] md:text-[28px] text-[#0D0D0D] leading-tight mb-3 animate-fade-up">{current.headline}</h2>
          <p key={`s${scene}`} className="font-body text-[14px] text-[#6B6560] leading-relaxed max-w-sm mx-auto animate-fade-up">{current.sub}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-7 h-1 bg-black/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: `${progress}%`, transition: `width ${SCENE_MS * 3}ms linear` }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes buildIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .build-block { opacity: 0; animation: buildIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .build-badge { opacity: 0; animation: buildIn 0.5s ease forwards; }
        @keyframes heartPop {
          0% { transform: scale(0.5); opacity: 0.4; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .heart-pop { display: inline-block; animation: heartPop 0.6s ease forwards; }
        @keyframes heartFloat {
          0% { transform: translateY(40px) scale(0.6); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-70px) scale(1.1); opacity: 0; }
        }
        .heart-float { bottom: 0; font-size: 18px; animation: heartFloat 1.8s ease-in infinite; }
        @keyframes confirmIn {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        .checkout-confirm { animation: confirmIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>
    </main>
  )
}

// ── Capture screen ────────────────────────────────────────────────────────────

interface Contact { name: string; company: string; email: string; phone: string; state: string; notes: string; consent: boolean }

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
]

function CaptureScreen({
  contact,
  setContact,
  onBack,
  onSubmit,
}: {
  contact: Contact
  setContact: React.Dispatch<React.SetStateAction<Contact>>
  onBack: () => void
  onSubmit: () => void
}) {
  const [error, setError] = useState('')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  const canSubmit = contact.name.trim().length > 1 && emailValid && contact.consent

  function handleSubmit() {
    if (contact.name.trim().length <= 1 || !emailValid) {
      setError('Please enter your name and a valid email.')
      return
    }
    if (!contact.consent) {
      setError('Please agree to the consent statement to see your results.')
      return
    }
    setError('')
    onSubmit()
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6BAD3D] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D]" />
              Your results are ready
            </span>
            <h2 className="hero-heading text-[30px] md:text-[40px] text-[#0D0D0D] leading-tight mb-3">
              Where should we send<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>your plan?</span>
            </h2>
            <p className="font-body text-[15px] text-[#6B6560] leading-relaxed">
              We&apos;ve built your personalized recommendation. Tell us where to send it — and we&apos;ll show it to you right now.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">Name</label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={contact.name}
                onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                placeholder="Jane Founder"
                className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">Company</label>
              <input
                type="text"
                name="organization"
                autoComplete="organization"
                value={contact.company}
                onChange={e => setContact(c => ({ ...c, company: e.target.value }))}
                placeholder="Acme Co."
                className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={contact.email}
                onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                placeholder="jane@company.com"
                className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">
                Phone <span className="text-black/25 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="tel"
                name="tel"
                autoComplete="tel"
                inputMode="tel"
                value={contact.phone}
                onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">State</label>
              <select
                name="address-level1"
                autoComplete="address-level1"
                value={contact.state}
                onChange={e => setContact(c => ({ ...c, state: e.target.value }))}
                className={`w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all appearance-none ${contact.state ? 'text-[#0D0D0D]' : 'text-black/25'}`}
              >
                <option value="">Select a state…</option>
                {US_STATES.map(s => (
                  <option key={s} value={s} className="text-[#0D0D0D]">{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Marketing consent */}
          <label className="flex items-start gap-3 mt-6 cursor-pointer select-none">
            <span className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={contact.consent}
                onChange={e => setContact(c => ({ ...c, consent: e.target.checked }))}
                className="peer sr-only"
              />
              <span className="w-5 h-5 rounded-md border border-black/20 bg-white flex items-center justify-center transition-all peer-checked:bg-[#8B5CF6] peer-checked:border-[#8B5CF6]">
                {contact.consent && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </span>
            <span className="font-body text-[13px] text-[#6B6560] leading-relaxed">
              I agree to receive my results and occasional marketing communications from Hewn Life, and consent to my information being used as described in the <Link href="/legal/privacy" className="text-[#8B5CF6] underline hover:text-[#7C3AED]">privacy policy</Link>. I can unsubscribe anytime.
            </span>
          </label>

          {error && <p className="font-body text-[13px] text-red-500 mt-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full mt-6 inline-flex items-center justify-center font-body font-medium px-8 py-4 rounded-full transition-all duration-200 ${
              canSubmit
                ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_8px_30px_-8px_rgba(139,92,246,0.5)] hover:-translate-y-0.5'
                : 'bg-black/[0.06] text-black/30 cursor-not-allowed'
            }`}
          >
            Show My Results →
          </button>

          <p className="font-body text-[12px] text-[#A89F92] text-center mt-4 leading-relaxed">
            No spam. We&apos;ll only reach out about your recommendation. Unsubscribe anytime.
          </p>

          <div className="text-center mt-6">
            <button onClick={onBack} className="font-body text-sm text-[#A89F92] hover:text-[#6B6560] transition-colors">
              ← Back
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Revenue slider screen ─────────────────────────────────────────────────────

function RevenueSliderScreen({
  revenueIdx,
  setRevenueIdx,
  onBack,
  onNext,
  totalSteps,
}: {
  revenueIdx: number
  setRevenueIdx: (v: number) => void
  onBack: () => void
  onNext: () => void
  totalSteps: number
}) {
  const sliderRef = useRef<HTMLInputElement>(null)
  const val = REVENUE_STOPS[revenueIdx]

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                Question 1 of {totalSteps}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                {Math.round((1 / totalSteps) * 100)}%
              </p>
            </div>
            <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(1 / totalSteps) * 100}%`, background: '#8B5CF6' }} />
            </div>
          </div>

          {/* Question */}
          <div className="mb-10">
            <h2 className="hero-heading text-[28px] md:text-[36px] text-[#0D0D0D] leading-tight mb-3">
              What is your current annual revenue?
            </h2>
            <p className="font-body text-[15px] text-[#A89F92] leading-relaxed italic">
              This is the most important number for calculating your real ROI.
            </p>
          </div>

          {/* Slider */}
          <div className="mb-12">
            {/* Big value display */}
            <div className="text-center mb-8">
              <div className="inline-flex flex-col items-center gap-2 bg-[#F9F7F3] border border-black/[0.07] rounded-3xl px-10 py-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">Annual Revenue</span>
                <span className="font-display text-[56px] md:text-[72px] leading-none text-[#0D0D0D] tabular-nums">
                  {val.label}
                </span>
                {revenueIdx === 0 && (
                  <span className="font-body text-[13px] text-[#A89F92]">Pre-revenue — we&apos;ll base projections on market entry benchmarks</span>
                )}
                {revenueIdx === REVENUE_STOPS.length - 1 && (
                  <span className="font-body text-[13px] text-[#6BAD3D]">Impressive — let&apos;s talk scale</span>
                )}
              </div>
            </div>

            {/* Range input */}
            <div className="px-2">
              <input
                ref={sliderRef}
                type="range"
                min={0}
                max={REVENUE_STOPS.length - 1}
                step={1}
                value={revenueIdx}
                onChange={e => setRevenueIdx(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 ${(revenueIdx / (REVENUE_STOPS.length - 1)) * 100}%, #E5E1DA ${(revenueIdx / (REVENUE_STOPS.length - 1)) * 100}%)`,
                }}
              />
              <div className="flex justify-between mt-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#C4BDB5]">$0</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#C4BDB5]">$100M+</span>
              </div>
            </div>

            {/* Tick marks / milestone labels */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[0, 3, 6, 10, 12, 16, 19].map((i) => (
                <button
                  key={i}
                  onClick={() => setRevenueIdx(i)}
                  className={`font-mono text-[10px] px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    revenueIdx === i
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/[0.06] text-[#8B5CF6]'
                      : 'border-black/[0.08] text-[#A89F92] hover:border-black/20'
                  }`}
                >
                  {REVENUE_STOPS[i].label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="font-body text-sm text-[#A89F92] hover:text-[#6B6560] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center font-body font-medium px-8 py-4 rounded-full transition-all duration-200 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_8px_30px_-8px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 2px solid #8B5CF6;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 2px solid #8B5CF6;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          cursor: pointer;
        }
      `}</style>
    </main>
  )
}

// ── Notes screen ──────────────────────────────────────────────────────────────

function NotesScreen({
  notes,
  setNotes,
  onBack,
  onNext,
  stepNumber,
  totalSteps,
}: {
  notes: string
  setNotes: (v: string) => void
  onBack: () => void
  onNext: () => void
  stepNumber: number
  totalSteps: number
}) {
  const pct = (stepNumber / totalSteps) * 100
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                Question {stepNumber} of {totalSteps}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                {Math.round(pct)}%
              </p>
            </div>
            <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: '#8B5CF6' }} />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="hero-heading text-[28px] md:text-[36px] text-[#0D0D0D] leading-tight mb-3">
              Anything else we should know?
            </h2>
            <p className="font-body text-[15px] text-[#A89F92] leading-relaxed italic">
              Optional — but the more context you give, the sharper your recommendation.
            </p>
          </div>

          {/* Textarea */}
          <div className="mb-10">
            <textarea
              name="notes"
              rows={6}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tell us about your business, your goals, what you've tried, or anything that would help us tailor your plan."
              className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all resize-none"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="font-body text-sm text-[#A89F92] hover:text-[#6B6560] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center font-body font-medium px-8 py-4 rounded-full transition-all duration-200 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_8px_30px_-8px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
            >
              {notes.trim() ? 'Continue →' : 'Skip →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Quiz() {
  const [step, setStep] = useState<'intro' | number | 'revenue' | 'notes' | 'capture' | 'calculating' | 'results'>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [contact, setContact] = useState({ name: '', company: '', email: '', phone: '', state: '', notes: '', consent: false })
  const [revenueIdx, setRevenueIdx] = useState(0)

  // The revenue slider is the first step; downstream scoring still expects a
  // `stage` answer, so we derive it from the revenue number.
  const scoredAnswers = { ...answers, stage: revenueStage(revenueIdx) }

  const totalSteps = questions.length + 2 // +1 revenue slider, +1 notes
  const currentQ = typeof step === 'number' ? questions[step] : null
  // Revenue is step 1; question index N is step N+2; notes is the last step.
  const progress =
    step === 'revenue' ? (1 / totalSteps) * 100
    : typeof step === 'number' ? ((step + 2) / totalSteps) * 100
    : step === 'notes' ? 100
    : step === 'results' ? 100 : 0

  // Always start each step at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  function handleSelect(value: string) {
    setSelected(value)
  }

  function handleNext() {
    if (!currentQ || !selected) return
    const newAnswers = { ...answers, [currentQ.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (typeof step === 'number' && step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setStep('notes')
    }
  }

  function handleBack() {
    if (typeof step === 'number' && step > 0) {
      setStep(step - 1)
      setSelected(answers[questions[step - 1].id] || null)
    } else if (typeof step === 'number' && step === 0) {
      // First question goes back to the revenue slider.
      setStep('revenue')
      setSelected(null)
    }
  }

  function handleRestart() {
    setStep('intro')
    setAnswers({})
    setSelected(null)
    setContact({ name: '', company: '', email: '', phone: '', state: '', notes: '', consent: false })
    setRevenueIdx(0)
  }

  function readableAnswers(): Record<string, string> {
    const out: Record<string, string> = {}
    questions.forEach(q => {
      const opt = q.options.find(o => o.value === answers[q.id])
      if (opt) out[q.question] = opt.label
    })
    return out
  }

  async function submitLead() {
    const tierKey = computeResult(scoredAnswers)
    const svc = getServices(scoredAnswers).map(s => s.label)
    try {
      await fetch('/api/quiz-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          company: contact.company,
          email: contact.email,
          phone: contact.phone,
          state: contact.state,
          notes: contact.notes,
          consent: contact.consent,
          tier: tiers[tierKey].name,
          services: svc,
          answers: readableAnswers(),
          score: computeScore(scoredAnswers),
          annualRevenue: revenueValue(revenueIdx),
          annualRevenueLabel: revenueLabel(revenueIdx),
        }),
      })
    } catch {
      console.error('Lead submission failed')
    }
  }

  const tier = step === 'results' ? tiers[computeResult(scoredAnswers)] : null
  const services = step === 'results' ? getServices(scoredAnswers) : []

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <main className="min-h-screen bg-white">
        <section className="relative min-h-screen flex flex-col overflow-hidden">
          {/* Image — right half on desktop, hidden on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <Image
              src={QUIZ_HERO_IMAGE}
              alt=""
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex-1 flex items-center px-6 lg:px-12 pt-28 pb-10">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-xl">
                <div className="animate-fade-up">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#6BAD3D]/30 bg-[#6BAD3D]/[0.06] px-4 py-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D] animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6BAD3D]">Free ROI Assessment</span>
                  </span>

                  <h1 className="hero-heading text-[40px] md:text-[64px] text-[#0D0D0D] leading-[1.02] mb-5">
                    See what growth<br />
                    <span className="accent" style={{ color: '#6BAD3D' }}>is worth to you.</span>
                  </h1>

                  <p className="font-body text-lg text-[#6B6560] leading-relaxed mb-8 max-w-md">
                    Answer 7 quick questions and get a personalized report — your marketing health score, the exact services you need, and the revenue you could unlock.
                  </p>

                  <button
                    onClick={() => setStep('revenue')}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-[#8B5CF6] text-white font-body font-semibold text-[17px] px-10 py-5 rounded-full hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_12px_40px_-8px_rgba(139,92,246,0.35)] hover:-translate-y-0.5"
                  >
                    Calculate My ROI →
                  </button>

                  <div className="flex items-center gap-5 mt-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A89F92]">⚡ 2 minutes</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A89F92]">✓ No sales call</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A89F92]">✓ Instant results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom value strip */}
          <div className="relative border-t border-black/[0.06] bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 grid grid-cols-3 gap-4">
              {[
                { stat: 'ROI', label: 'projection for your stage' },
                { stat: 'Health', label: 'score across 4 areas' },
                { stat: 'Plan', label: 'matched to your goals' },
              ].map(s => (
                <div key={s.stat} className="text-center sm:text-left">
                  <p className="font-display text-[22px] md:text-[28px] leading-none text-[#0D0D0D] mb-1">{s.stat}</p>
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-[#8B5CF6]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  // ── Revenue slider ────────────────────────────────────────────────────────
  if (step === 'revenue') {
    return (
      <RevenueSliderScreen
        revenueIdx={revenueIdx}
        setRevenueIdx={setRevenueIdx}
        onBack={() => setStep('intro')}
        onNext={() => setStep(0)}
        totalSteps={totalSteps}
      />
    )
  }

  // ── Notes ─────────────────────────────────────────────────────────────────
  if (step === 'notes') {
    return (
      <NotesScreen
        notes={contact.notes}
        setNotes={(v) => setContact(c => ({ ...c, notes: v }))}
        onBack={() => {
          setStep(questions.length - 1)
          setSelected(answers[questions[questions.length - 1].id] || null)
        }}
        onNext={() => setStep('capture')}
        stepNumber={totalSteps}
        totalSteps={totalSteps}
      />
    )
  }

  // ── Capture ───────────────────────────────────────────────────────────────
  if (step === 'capture') {
    return (
      <CaptureScreen
        contact={contact}
        setContact={setContact}
        onBack={() => setStep('notes')}
        onSubmit={() => {
          submitLead()
          setStep('calculating')
        }}
      />
    )
  }

  // ── Calculating ───────────────────────────────────────────────────────────
  if (step === 'calculating') {
    return <CalculatingScreen onDone={() => setStep('results')} />
  }

  // ── Results dashboard ─────────────────────────────────────────────────────
  if (step === 'results' && tier) {
    const tierKey = computeResult(scoredAnswers)
    const health = computeHealthScore(scoredAnswers)
    const roi = computeRoi(revenueValue(revenueIdx), revenueLabel(revenueIdx), tierKey)
    return (
      <ResultsDashboard
        contact={contact}
        tier={tier}
        tierKey={tierKey}
        health={health}
        roi={roi}
        services={services}
        onRestart={handleRestart}
      />
    )
  }

  // ── Question step ─────────────────────────────────────────────────────────
  if (!currentQ) return null

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                Question {(step as number) + 2} of {totalSteps}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                {Math.round(progress)}%
              </p>
            </div>
            <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: '#8B5CF6' }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="hero-heading text-[28px] md:text-[36px] text-[#0D0D0D] leading-tight mb-3">
              {currentQ.question}
            </h2>
            <p className="font-body text-[15px] text-[#A89F92] leading-relaxed italic">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-10">
            {currentQ.options.map(opt => {
              const isSelected = selected === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 font-body text-[15px] leading-snug ${
                    isSelected
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/[0.06] text-[#0D0D0D] shadow-[0_0_0_1px_#8B5CF6]'
                      : 'border-black/[0.08] bg-white text-[#3D3A36] hover:border-black/20 hover:bg-[#F9F7F3]'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border mr-3 flex-shrink-0 align-middle transition-all duration-200 ${
                    isSelected ? 'border-[#8B5CF6] bg-[#8B5CF6]' : 'border-black/20 bg-transparent'
                  }`}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.2l2 2L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="font-body text-sm text-[#A89F92] hover:text-[#6B6560] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selected}
              className={`inline-flex items-center justify-center font-body font-medium px-8 py-4 rounded-full transition-all duration-200 ${
                selected
                  ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_8px_30px_-8px_rgba(139,92,246,0.5)] hover:-translate-y-0.5'
                  : 'bg-black/[0.06] text-black/30 cursor-not-allowed'
              }`}
            >
              {typeof step === 'number' && step === questions.length - 1 ? 'Almost done →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
