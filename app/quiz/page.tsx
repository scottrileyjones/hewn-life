'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CalButton from '@/components/CalButton'

const QUIZ_HERO_IMAGE =
  'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1400,h_1600,c_fill/v1779578220/main-sample.png'

// ── Questions ────────────────────────────────────────────────────────────────

const questions = [
  {
    id: 'stage',
    question: 'Where is your business right now?',
    subtitle: 'Be honest — there\'s no wrong answer, just a wrong starting point.',
    options: [
      { label: 'Pre-launch or just getting started', value: 'pre', score: { hewn: 3, wrought: 0, forged: 0 } },
      { label: 'Live but under $250K in annual revenue', value: 'early', score: { hewn: 2, wrought: 1, forged: 0 } },
      { label: '$250K–$1M and growing steadily', value: 'growth', score: { hewn: 0, wrought: 3, forged: 1 } },
      { label: '$1M+ and ready to scale aggressively', value: 'scale', score: { hewn: 0, wrought: 1, forged: 3 } },
    ],
  },
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

// The match score of the recommended tier — higher means a stronger fit.
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

function computeRoi(answers: Record<string, string>, tierKey: 'hewn' | 'wrought' | 'forged'): RoiProjection {
  const revenueBase: Record<string, number> = { pre: 0, early: 125000, growth: 600000, scale: 1500000 }
  const revenueLabel: Record<string, string> = { pre: 'Pre-revenue', early: '~$125K / yr', growth: '~$600K / yr', scale: '~$1.5M+ / yr' }

  const liftRange: Record<string, [number, number]> = {
    hewn:   [0.18, 0.32],
    wrought:[0.38, 0.65],
    forged: [0.65, 1.20],
  }

  const base = revenueBase[answers.stage] ?? 125000
  const [lo, hi] = liftRange[tierKey]

  const newLo = Math.round(base * lo)
  const newHi = Math.round(base * hi)

  const fmt = (n: number) =>
    n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`

  // Annual retainer cost
  const cost: Record<string, number> = { hewn: 30000, wrought: 60000, forged: 114000 }
  const annualCost = cost[tierKey]
  const annualMin = fmt(Math.max(0, newLo - annualCost))
  const annualMax = fmt(Math.max(0, newHi - annualCost))

  return {
    revenueLabel: revenueLabel[answers.stage] ?? '~$125K / yr',
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

// ── Results dashboard (full-screen takeover) ──────────────────────────────────

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
  // phase 1=roi hero, 2=health gauge, 3=bars, 4=services, 5=tier+cta

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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0D0D0D]">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6BAD3D] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Growth Opportunity Report</span>
        </div>
        <button onClick={onRestart} className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 hover:text-white/60 transition-colors">
          ← Retake
        </button>
      </div>

      <div className="px-6 lg:px-12 max-w-4xl mx-auto pb-24">

        {/* ── Hero headline ── */}
        <div className={`pt-16 pb-12 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6BAD3D] mb-5">
            {firstName ? `${firstName}'s Assessment` : 'Your Assessment'} · {tier.name} Tier Match
          </p>
          <h1 className="hero-heading text-[36px] md:text-[56px] text-white leading-[1.04] mb-4">
            You have a real<br />
            <span className="accent" style={{ color: '#6BAD3D' }}>revenue opportunity.</span>
          </h1>
          <p className="font-body text-base text-white/50 max-w-xl">
            Based on your answers, here's what the numbers say — and what's within reach if you execute.
          </p>
        </div>

        {/* ── ROI hero ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#13101A] to-[#0D0D0D] border border-white/[0.06] p-8 md:p-12">
            {/* Animated glow rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
              <div className="absolute inset-0 rounded-full border border-[#8B5CF6]/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-8 rounded-full border border-[#6BAD3D]/8 animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
            </div>
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl bg-[#8B5CF6]/15 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-[#6BAD3D]/10 pointer-events-none" />

            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30 mb-6">Revenue Opportunity · {roi.revenueLabel} current stage</p>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10">
                {/* Big number */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6BAD3D] mb-3">Potential New Revenue</p>
                  <div className="font-display text-[64px] md:text-[80px] leading-none text-white mb-2 tabular-nums">
                    {fmtCompact(roiCount)}
                  </div>
                  <p className="font-body text-[14px] text-white/40">additional annual revenue — aggressive case</p>
                </div>
                {/* Net ROI */}
                <div className="flex flex-col justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8B5CF6] mb-3">Net ROI After Retainer</p>
                  <div className="font-display text-[48px] md:text-[60px] leading-none mb-2 tabular-nums" style={{ color: '#8B5CF6' }}>
                    {fmtCompact(netCount)}
                  </div>
                  <p className="font-body text-[14px] text-white/40">profit above {tier.price} investment</p>
                </div>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Revenue Lift Range', val: `${roi.conservativeLift}–${roi.aggressiveLift}%` },
                  { label: 'Conservative Case', val: roi.conservativeNew },
                  { label: 'Annual Retainer', val: tier.price.split(' ')[0] },
                ].map(s => (
                  <div key={s.label} className="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.06]">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 mb-2">{s.label}</p>
                    <p className="font-display text-[22px] leading-none text-white">{s.val}</p>
                  </div>
                ))}
              </div>

              <p className="font-body text-[11px] text-white/20 mt-6 leading-relaxed">
                Projections based on industry ROAS benchmarks for businesses at your stage and tier. Actual results vary. Not a guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* ── Marketing health ── */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-[#111] rounded-3xl border border-white/[0.06] p-8 md:p-10">
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
              {/* Dial */}
              <div className="flex flex-col items-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-5">Marketing Health</p>
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="50" fill="none" strokeWidth="8"
                      stroke={scoreColor} strokeLinecap="round"
                      strokeDasharray={`${phase >= 2 ? (health.overall / 100) * 314 : 0} 314`}
                      style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 8px ${scoreColor}60)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-[44px] leading-none text-white tabular-nums">{scoreCount}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">/ 100</span>
                  </div>
                </div>
                <span className="mt-4 font-mono text-[11px] px-4 py-1.5 rounded-full border" style={{ color: scoreColor, borderColor: `${scoreColor}40`, background: `${scoreColor}12` }}>
                  {scoreLabel}
                </span>
                <p className="font-body text-[12px] text-white/30 text-center mt-3 max-w-[160px]">
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
                        <span className="font-body text-[13px] text-white/70">{cat.label}</span>
                        <span className="font-mono text-[12px] tabular-nums" style={{ color: c }}>{cat.score}/100</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: active ? `${cat.score}%` : '0%',
                          background: c,
                          boxShadow: `0 0 8px ${c}50`,
                          transition: `width 1s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`,
                        }} />
                      </div>
                      <p className="font-body text-[11px] text-white/25 mt-1">{cat.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommended services ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-[#111] rounded-3xl border border-white/[0.06] p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">Recommended Service Mix</p>
            <h2 className="hero-heading text-[24px] md:text-[32px] text-white leading-tight mb-8">
              The channels that'll <span className="accent" style={{ color: '#6BAD3D' }}>move the needle.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-5 bg-white/[0.04] border border-white/[0.06] rounded-2xl transition-all duration-500 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#6BAD3D] flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-display font-semibold text-[15px] text-white mb-0.5">{svc.label}</p>
                    <p className="font-body text-[12px] text-white/40 leading-relaxed">{svc.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier + CTA ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-12" style={{ background: tierKey === 'hewn' ? '#1A1815' : '#17131F' }}>
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: tier.color }} />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: tier.color }} />
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
                  className="inline-flex items-center justify-center font-body font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]"
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8">
            <div>
              <p className="font-display font-semibold text-[17px] text-white mb-1">Not ready for a retainer?</p>
              <p className="font-body text-[14px] text-white/40">Start with our Website in a Week — fully built for a flat $1,000.</p>
            </div>
            <Link href="/website-in-a-week" className="flex-shrink-0 inline-flex items-center justify-center border border-white/15 text-white font-body font-medium px-8 py-4 rounded-full hover:border-white/30 transition-all duration-200 whitespace-nowrap">
              Site in a Week →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Calculating screen ────────────────────────────────────────────────────────

const calcSteps = [
  { task: 'Analyzing your business stage', benefit: 'We tailor every recommendation to where you actually are — no generic playbooks.' },
  { task: 'Mapping your goals to proven channels', benefit: 'Hewn Life builds strategies around outcomes, not vanity metrics.' },
  { task: 'Identifying your highest-leverage services', benefit: 'AI-accelerated execution means we move 3× faster than a traditional agency.' },
  { task: 'Matching you to the right starting tier', benefit: 'You only invest in what moves the needle — nothing you don\'t need.' },
  { task: 'Building your personalized recommendation', benefit: 'Senior strategy and craft, without the senior-agency invoice.' },
]

function CalculatingScreen({ onDone }: { onDone: () => void }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const perStep = 1600
    const timers = calcSteps.map((_, i) =>
      setTimeout(() => setActive(i + 1), perStep * (i + 1))
    )
    const done = setTimeout(onDone, perStep * calcSteps.length + 700)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentBenefit = calcSteps[Math.min(active, calcSteps.length - 1)].benefit

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6 py-32">
      <div className="max-w-xl w-full text-center">
        {/* Pulsing machine core */}
        <div className="relative mx-auto mb-12 w-28 h-28 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-[#8B5CF6]/30 animate-ping" style={{ animationDuration: '2s' }} />
          <span className="absolute inset-2 rounded-full border border-[#8B5CF6]/20 animate-ping" style={{ animationDuration: '2.6s' }} />
          <span className="absolute inset-0 rounded-full blur-2xl bg-[#8B5CF6]/30" />
          <svg className="relative w-12 h-12 animate-spin text-[#8B5CF6]" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="none">
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6BAD3D] mb-8">
          Building your assessment
        </p>

        {/* Task checklist */}
        <div className="space-y-3 text-left mb-10">
          {calcSteps.map((s, i) => {
            const isDone = i < active
            const isCurrent = i === active
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  isDone || isCurrent ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone ? 'bg-[#6BAD3D]' : isCurrent ? 'border border-[#8B5CF6]' : 'border border-white/20'
                }`}>
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                  ) : null}
                </span>
                <span className={`font-body text-[15px] ${isDone ? 'text-white/50' : isCurrent ? 'text-white' : 'text-white/40'}`}>
                  {s.task}{isCurrent && <span className="inline-block animate-pulse">…</span>}
                </span>
              </div>
            )
          })}
        </div>

        {/* Rotating benefit message */}
        <div className="min-h-[60px] flex items-center justify-center">
          <p key={active} className="font-display italic text-[19px] md:text-[22px] text-white/90 leading-snug animate-fade-up">
            “{currentBenefit}”
          </p>
        </div>
      </div>
    </main>
  )
}

// ── Capture screen ────────────────────────────────────────────────────────────

interface Contact { name: string; company: string; email: string; phone: string; state: string }

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
  const canSubmit = contact.name.trim().length > 1 && emailValid

  function handleSubmit() {
    if (!canSubmit) {
      setError('Please enter your name and a valid email.')
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
                value={contact.company}
                onChange={e => setContact(c => ({ ...c, company: e.target.value }))}
                placeholder="Costco"
                className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">Email</label>
              <input
                type="email"
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
                value={contact.phone}
                onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full px-5 py-4 rounded-2xl border border-black/[0.12] bg-white font-body text-[15px] text-[#0D0D0D] placeholder:text-black/25 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89F92] mb-2 block">State</label>
              <select
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function Quiz() {
  const [step, setStep] = useState<'intro' | number | 'capture' | 'calculating' | 'results'>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [contact, setContact] = useState({ name: '', company: '', email: '', phone: '', state: '' })

  const currentQ = typeof step === 'number' ? questions[step] : null
  const progress = typeof step === 'number' ? ((step + 1) / questions.length) * 100 : step === 'results' ? 100 : 0

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
      setStep('capture')
    }
  }

  function handleBack() {
    if (typeof step === 'number' && step > 0) {
      setStep(step - 1)
      setSelected(answers[questions[step - 1].id] || null)
    } else if (typeof step === 'number' && step === 0) {
      setStep('intro')
      setSelected(null)
    }
  }

  function handleRestart() {
    setStep('intro')
    setAnswers({})
    setSelected(null)
    setContact({ name: '', company: '', email: '', phone: '', state: '' })
  }

  // Map raw answer values to their human-readable labels for the CRM.
  function readableAnswers(): Record<string, string> {
    const out: Record<string, string> = {}
    questions.forEach(q => {
      const opt = q.options.find(o => o.value === answers[q.id])
      if (opt) out[q.question] = opt.label
    })
    return out
  }

  async function submitLead() {
    const tierKey = computeResult(answers)
    const svc = getServices(answers).map(s => s.label)
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
          tier: tiers[tierKey].name,
          services: svc,
          answers: readableAnswers(),
          score: computeScore(answers),
        }),
      })
    } catch {
      // Don't block the user's results on a CRM hiccup — log only.
      console.error('Lead submission failed')
    }
  }

  const tier = step === 'results' ? tiers[computeResult(answers)] : null
  const services = step === 'results' ? getServices(answers) : []

  // ── Intro (landing page) ──────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <main className="min-h-screen bg-[#0D0D0D]">
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex flex-col overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={QUIZ_HERO_IMAGE}
              alt=""
              fill
              priority
              className="object-cover object-[70%_center] lg:object-[60%_center]"
            />
            {/* Gradients for legibility — strong on mobile bottom, left on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/70 to-[#0D0D0D]/30 lg:bg-gradient-to-r lg:from-[#0D0D0D] lg:via-[#0D0D0D]/85 lg:to-transparent" />
            <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-[#0D0D0D]/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex-1 flex items-center px-6 lg:px-12 pt-28 pb-10">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-xl">
                <div className="animate-fade-up">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#6BAD3D]/40 bg-[#6BAD3D]/10 px-4 py-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D] animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6BAD3D]">Free ROI Assessment</span>
                  </span>

                  <h1 className="hero-heading text-[40px] md:text-[64px] text-white leading-[1.02] mb-5">
                    See what growth<br />
                    <span className="accent" style={{ color: '#6BAD3D' }}>is worth to you.</span>
                  </h1>

                  <p className="font-body text-lg text-white/70 leading-relaxed mb-8 max-w-md">
                    Answer 7 quick questions and get a personalized report — your marketing health score, the exact services you need, and the revenue you could unlock.
                  </p>

                  <button
                    onClick={() => setStep(0)}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-[#8B5CF6] text-white font-body font-semibold text-[17px] px-10 py-5 rounded-full hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_12px_40px_-8px_rgba(139,92,246,0.6)] hover:-translate-y-0.5"
                  >
                    Calculate My ROI →
                  </button>

                  <div className="flex items-center gap-5 mt-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">⚡ 2 minutes</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">✓ No sales call</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">✓ Instant results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom value strip */}
          <div className="relative border-t border-white/[0.08] bg-[#0D0D0D]/60 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 grid grid-cols-3 gap-4">
              {[
                { stat: 'ROI', label: 'projection for your stage' },
                { stat: 'Health', label: 'score across 4 areas' },
                { stat: 'Plan', label: 'matched to your goals' },
              ].map(s => (
                <div key={s.stat} className="text-center sm:text-left">
                  <p className="font-display text-[22px] md:text-[28px] leading-none text-white mb-1">{s.stat}</p>
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-[#8B5CF6]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  // ── Capture ──────────────────────────────────────────────────────────────────
  if (step === 'capture') {
    return (
      <CaptureScreen
        contact={contact}
        setContact={setContact}
        onBack={() => {
          setStep(questions.length - 1)
          setSelected(answers[questions[questions.length - 1].id] || null)
        }}
        onSubmit={() => {
          submitLead()
          setStep('calculating')
        }}
      />
    )
  }

  // ── Calculating ──────────────────────────────────────────────────────────────
  if (step === 'calculating') {
    return <CalculatingScreen onDone={() => setStep('results')} />
  }

  // ── Results dashboard ─────────────────────────────────────────────────────
  if (step === 'results' && tier) {
    const tierKey = computeResult(answers)
    const health = computeHealthScore(answers)
    const roi = computeRoi(answers, tierKey)
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

  // ── Question step ──────────────────────────────────────────────────────────
  if (!currentQ) return null

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
                Question {(step as number) + 1} of {questions.length}
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
              {typeof step === 'number' && step === questions.length - 1 ? 'See My Results →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
