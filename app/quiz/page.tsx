'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Terrain from '@/components/strata/Terrain'
import CalButton from '@/components/CalButton'
import StepFrame, { Climb, nextBtn } from '@/components/quiz/StepFrame'


// ── Revenue slider stops ──────────────────────────────────────────────────────

// ── Outcome ticker ────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { label: 'Revenue opportunity', value: '$340K', color: '#6BAD3D' },
  { label: 'Marketing health score', value: '71 / 100', color: '#1E3826' },
  { label: 'Top priority', value: 'Paid Media', color: '#0D0D0D' },
  { label: 'Revenue opportunity', value: '$1.2M', color: '#6BAD3D' },
  { label: 'Health score', value: '58 / 100', color: '#1E3826' },
  { label: 'Biggest gap', value: 'Brand Messaging', color: '#0D0D0D' },
  { label: 'Revenue opportunity', value: '$88K', color: '#6BAD3D' },
  { label: 'Marketing health score', value: '83 / 100', color: '#1E3826' },
  { label: 'Top priority', value: 'SEO & Content', color: '#0D0D0D' },
  { label: 'Revenue opportunity', value: '$520K', color: '#6BAD3D' },
  { label: 'Health score', value: '47 / 100', color: '#1E3826' },
  { label: 'Biggest gap', value: 'Email & Retention', color: '#0D0D0D' },
]

function OutcomeTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS] // duplicate for seamless loop
  return (
    <div className="relative py-4 select-none">
      {/* fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F7F6F3, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F7F6F3, transparent)' }} />
      <div className="flex gap-3 ticker-track">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center gap-2.5 border border-ink/[0.08] rounded-full px-4 py-2 bg-paper"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/60">{item.label}</span>
            <span className="w-px h-3 bg-ink/10" />
            <span className="font-display font-medium text-[14px] text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

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

// Waypoints on the climb, in the order the steps are asked.
const STEP_LABELS = ['Revenue', 'Goal', 'Presence', 'Budget', 'Biggest blocker', 'Urgency', 'Team', 'Anything else']

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
    color: '#D6F28B',
  },
  forged: {
    name: 'Forged',
    price: '$9,500 / mo',
    tagline: 'Market leadership or nothing.',
    description: 'For companies that are done playing catch-up. Full-stack growth execution with senior strategy, aggressive paid programs, and a dedicated team obsessed with your numbers.',
    href: '/pricing',
    color: '#D6F28B',
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
  // Brand-safe grades: ember strong, dawn middling, copper weak (marks only; numbers stay ink).
  const scoreColor = health.overall >= 65 ? '#6BAD3D' : health.overall >= 40 ? '#D9893F' : '#B5621C'
  const scoreLabel = health.overall >= 65 ? 'Strong Foundation' : health.overall >= 40 ? 'Room to Grow' : 'Significant Gap'
  const firstName = contact.name ? contact.name.split(' ')[0] : null
  // launch: pre-revenue, so no projection. small: the projected lift is smaller
  // than the plan, so we point them at Website in a Day. growth: the full ROI view.
  const mode: 'launch' | 'small' | 'growth' = roi.revenueLabel === '$0' ? 'launch' : roi.annualMaxRaw <= 0 ? 'small' : 'growth'

  return (
    <div className="min-h-screen bg-bone">
      <div className="px-6 lg:px-12 max-w-4xl mx-auto pb-24 pt-28">

        {/* ── Report label + retake ── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Growth Opportunity Report</span>
          </div>
          <button onClick={onRestart} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55 hover:text-ink transition-colors">
            ← Retake
          </button>
        </div>

        {/* ── Hero headline ── */}
        <div className={`pb-12 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest mb-5">
            {firstName ? `${firstName}'s Assessment` : 'Your Assessment'} · {tier.name} Tier Match
          </p>
          <h1 className="hero-heading fluid-hero text-ink leading-[1.04] mb-4">
            {mode === 'launch'
              ? <>You&apos;re at the starting line.<br /><span className="accent" style={{ color: '#1E3826' }}>Here&apos;s the fastest way off it.</span></>
              : <>You have a real<br /><span className="accent" style={{ color: '#1E3826' }}>revenue opportunity.</span></>}
          </h1>
          <p className="font-body text-base text-ink/70 max-w-xl">
            {mode === 'launch'
              ? 'Before revenue, the job is simple: look credible, then win your first customers. Here’s the plan your answers point to.'
              : 'Based on your answers, here’s what the numbers suggest, and what’s within reach if you execute.'}
          </p>
          {mode !== 'launch' && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/[0.1] bg-paper px-3.5 py-1.5 font-body text-[13px] text-ink/70">
              <span className="h-3 w-[3px] bg-dawn" />Estimates based on industry averages, not a guarantee
            </p>
          )}
        </div>

        {/* ── ROI hero ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-[32px] overflow-hidden bg-paper border border-ink/[0.08] p-8 md:p-12">

            <div className="relative">
              {mode === 'launch' ? (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55 mb-6">Your launch plan</p>
                  <ol className="grid gap-3 md:grid-cols-3">
                    {[
                      ['Look credible', 'Get a real website live, on your domain, in a day. Website in a Day, $999.'],
                      ['Win your first customers', services[0] ? `Start with ${services[0].label.toLowerCase()}, the channel your answers point to first.` : 'Start with the one channel your answers point to first.'],
                      ['Grow from there', `Step up to ${tier.name} once there’s revenue to grow. Monthly, no long contract.`],
                    ].map(([t, d], i) => (
                      <li key={t} className="rounded-[22px] bg-bone p-5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest font-display text-sm font-medium text-mist">{i + 1}</span>
                        <p className="mt-4 font-display text-[18px] font-medium">{t}</p>
                        <p className="mt-1.5 font-body text-[14px] text-ink/70">{d}</p>
                      </li>
                    ))}
                  </ol>
                  <Link href="/website-in-a-day#order" className="mt-8 inline-flex items-center justify-center rounded-full bg-forest px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">
                    Start with Website in a Day · $999 →
                  </Link>
                </>
              ) : (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55 mb-6">Revenue opportunity · {roi.revenueLabel} current revenue</p>

                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest mb-3">Potential new revenue</p>
                      <div className="font-display fluid-stat leading-none text-ink mb-2 tabular-nums">
                        {fmtCompact(roiCount)}
                      </div>
                      <p className="font-body text-[14px] text-ink/60">a year, at the high end of the range</p>
                    </div>
                    {mode === 'growth' ? (
                      <div className="flex flex-col justify-center">
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest mb-3">Return after your plan</p>
                        <div className="font-display fluid-stat leading-none mb-2 tabular-nums" style={{ color: '#1E3826' }}>
                          {fmtCompact(netCount)}
                        </div>
                        <p className="font-body text-[14px] text-ink/60">a year, after your {tier.name} plan</p>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center rounded-[22px] bg-lime p-6 text-forest">
                        <p className="font-display text-[19px] font-medium leading-snug">At your current size, a monthly plan may not pay for itself yet.</p>
                        <p className="mt-2 font-body text-[14px] text-forest/80">Start with Website in a Day, and step up when the numbers support it.</p>
                        <Link href="/website-in-a-day#order" className="mt-4 inline-flex self-start rounded-full bg-forest px-5 py-3 font-body text-[14px] font-medium text-mist transition hover:bg-forest-2">Start for $999 →</Link>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Revenue lift range', val: `${roi.conservativeLift}–${roi.aggressiveLift}%` },
                      { label: 'Conservative case', val: `${roi.conservativeNew} a year` },
                      { label: 'Your plan', val: tier.price.replace(' / ', '/') },
                    ].map(st => (
                      <div key={st.label} className="bg-bone rounded-2xl p-4 border border-ink/[0.06]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55 mb-2">{st.label}</p>
                        <p className="font-display text-[22px] leading-none text-ink">{st.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[18px] border border-ink/[0.1] bg-bone/70 p-5">
                    <p className="flex items-center gap-2 font-display text-[16px] font-medium"><span className="h-3.5 w-[3px] bg-dawn" />These are estimates, not promises</p>
                    <p className="mt-2 font-body text-[14px] leading-relaxed text-ink/70">
                      We apply average growth ranges for businesses at your revenue and plan, based on industry benchmarks. Real results depend on your market, offer, budget and execution. This is not a guarantee or financial advice.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Marketing health ── */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-paper rounded-[32px] border border-ink/[0.08] p-8 md:p-10">
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
              {/* Dial */}
              <div className="flex flex-col items-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 mb-5">Marketing Health</p>
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
                    <span className="font-display fluid-stat leading-none text-ink tabular-nums">{scoreCount}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/55">/ 100</span>
                  </div>
                </div>
                <span className="mt-4 font-mono text-[11px] px-4 py-1.5 rounded-full border text-ink" style={{ borderColor: `${scoreColor}66`, background: `${scoreColor}1F` }}>
                  {scoreLabel}
                </span>
                <p className="font-body text-[12px] text-ink/55 text-center mt-3 max-w-[160px]">
                  {health.overall < 40 ? 'Big gap = big opportunity.' : health.overall < 65 ? 'Solid base, accelerate now.' : 'Strong — time to scale.'}
                </p>
              </div>

              {/* Category bars */}
              <div className="space-y-5">
                {health.categories.map((cat, i) => {
                  const c = cat.score >= 65 ? '#6BAD3D' : cat.score >= 40 ? '#D9893F' : '#B5621C'
                  const active = phase >= 3
                  return (
                    <div key={cat.label} style={{ transitionDelay: active ? `${i * 100}ms` : '0ms' }}
                      className={`transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-body text-[13px] text-ink/80">{cat.label}</span>
                        <span className="font-mono text-[12px] tabular-nums text-ink">{cat.score}/100</span>
                      </div>
                      <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: active ? `${cat.score}%` : '0%',
                          background: c,
                          transition: `width 1s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`,
                        }} />
                      </div>
                      <p className="font-body text-[11px] text-ink/55 mt-1">{cat.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommended services ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-paper rounded-[32px] border border-ink/[0.08] p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 mb-2">Recommended Service Mix</p>
            <h2 className="hero-heading text-[24px] md:text-[32px] text-ink leading-tight mb-8">
              The channels that'll <span className="accent" style={{ color: '#1E3826' }}>move the needle.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-5 bg-bone border border-black/[0.06] rounded-2xl transition-all duration-500 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-forest flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-display font-medium text-[16px] text-ink mb-0.5">{svc.label}</p>
                    <p className="font-body text-[13px] text-ink/65 leading-relaxed">{svc.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier + CTA ── */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative isolate rounded-[32px] overflow-hidden p-8 md:p-12 bg-forest">
            <Terrain scene="canyon" seed={tierKey === 'hewn' ? 3 : tierKey === 'wrought' ? 8 : 14} className="-z-20" />
            <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.8), rgba(20,16,10,.35) 70%)' }} />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3 text-lime">
                {mode === 'launch' ? 'When there’s revenue to grow' : <>Your starting point · {tierKey === 'hewn' ? 'Foundation' : tierKey === 'wrought' ? 'Growth' : 'Scale'}</>}
              </p>
              <h3 className="font-display fluid-h2 leading-none text-white mb-1">{tier.name}</h3>
              <p className="font-body text-[24px] text-mist/70 mb-5">{tier.price}</p>
              <p className="accent text-[22px] text-mist mb-3">{tier.tagline}</p>
              <p className="font-body text-[15px] text-mist/75 leading-relaxed max-w-lg mb-10">{tier.description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <CalButton
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-body font-medium text-ink transition hover:bg-mist"
                >
                  Book a Discovery Call →
                </CalButton>
                <Link href={tier.href} className="inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-8 py-4 font-body font-medium text-mist backdrop-blur transition hover:bg-mist/20">
                  See Full Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Not ready yet ── */}
        {mode !== 'launch' && <div className={`transition-all duration-700 ${phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-paper border border-ink/[0.08] rounded-[32px] p-8">
            <div>
              <p className="font-display font-medium text-[18px] text-ink mb-1">Not ready for a retainer?</p>
              <p className="font-body text-[14px] text-ink/55">Start with Website in a Day — fully built for a flat $999.</p>
            </div>
            <Link href="/website-in-a-day" className="flex-shrink-0 inline-flex items-center justify-center border border-black/[0.12] text-ink font-body font-medium px-8 py-4 rounded-full hover:border-black/30 transition-all duration-200 whitespace-nowrap">
              Site in a Day →
            </Link>
          </div>
        </div>}

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
    <main className="min-h-screen bg-bone flex items-center justify-center px-6 py-28">
      <div className="max-w-md w-full">
        <p className="mb-6 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-forest">
          <span className="h-3 w-[3px] animate-pulse bg-ember" />
          Building your growth plan
        </p>

        {/* Device frame */}
        <div className="relative rounded-[32px] bg-forest shadow-[0_24px_60px_-20px_rgba(30,56,38,0.45)] overflow-hidden">
          {/* Plan header */}
          <div className="flex items-center justify-between gap-3 border-b border-mist/10 px-6 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist/70">Your growth plan</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime">{scene + 1} / 3</span>
          </div>

          {/* Scene stage */}
          <div className="relative h-[300px] flex items-center justify-center px-7">
            {/* ── Scene 0: website building ── */}
            {scene === 0 && (
              <div key="s0" className="w-full animate-fade-up">
                <div className="rounded-[18px] bg-paper p-4">
                  <div className="build-block h-20 rounded-xl bg-lime" style={{ animationDelay: '0ms' }} />
                  <div className="build-block h-3 w-3/4 rounded-full bg-black/10 mt-4" style={{ animationDelay: '300ms' }} />
                  <div className="build-block h-3 w-1/2 rounded-full bg-black/10 mt-2.5" style={{ animationDelay: '500ms' }} />
                  <div className="flex gap-3 mt-4">
                    <div className="build-block h-14 flex-1 rounded-xl bg-black/[0.05]" style={{ animationDelay: '750ms' }} />
                    <div className="build-block h-14 flex-1 rounded-xl bg-black/[0.05]" style={{ animationDelay: '900ms' }} />
                  </div>
                  <div className="build-block mt-4 h-9 w-32 rounded-full bg-forest" style={{ animationDelay: '1150ms' }} />
                </div>
                <div className="build-badge mt-4 flex items-center justify-center gap-2" style={{ animationDelay: '1500ms' }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest">Published · Live</span>
                  </span>
                </div>
              </div>
            )}

            {/* ── Scene 1: social engagement ── */}
            {scene === 1 && (
              <div key="s1" className="w-full animate-fade-up">
                <div className="rounded-[18px] bg-paper p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-9 h-9 rounded-full bg-lime" />
                    <div>
                      <div className="h-2.5 w-24 rounded-full bg-black/15" />
                      <div className="h-2 w-16 rounded-full bg-black/10 mt-1.5" />
                    </div>
                  </div>
                  <div className="h-28 rounded-xl bg-sand mb-3 flex items-center justify-center overflow-hidden relative">
                    {/* floating hearts */}
                    {[0,1,2,3,4].map(i => (
                      <span key={i} className="heart-float absolute text-[#D9893F]" style={{ left: `${15 + i*18}%`, animationDelay: `${i*260}ms` }}>♥</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#D9893F]">
                      <span className="heart-pop text-[20px]">♥</span>
                      <span className="font-display text-[18px] text-ink tabular-nums">{likeCount.toLocaleString()}</span>
                    </span>
                    <span className="font-body text-[13px] text-ink/55">likes this week</span>
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-forest">↑ 312%</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Scene 2: purchase / revenue ── */}
            {scene === 2 && (
              <div key="s2" className="w-full animate-fade-up">
                <div className="rounded-[18px] bg-paper p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-12 rounded-xl bg-lime flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-2.5 w-28 rounded-full bg-black/15" />
                      <div className="h-2 w-20 rounded-full bg-black/10 mt-2" />
                    </div>
                  </div>
                  <div className="checkout-confirm flex items-center justify-center gap-2 rounded-full bg-forest py-3 mb-4">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-body font-medium text-[14px] text-mist">Order confirmed</span>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55 mb-1">Revenue today</p>
                    <p className="font-display fluid-stat leading-none text-ink tabular-nums">${revenueCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copy */}
        <div className="text-center mt-7 min-h-[120px]">
          <p key={`e${scene}`} className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest mb-3 animate-fade-up">{current.eyebrow}</p>
          <h2 key={`h${scene}`} className="hero-heading text-[24px] md:text-[28px] text-ink leading-tight mb-3 animate-fade-up">{current.headline}</h2>
          <p key={`s${scene}`} className="font-body text-[14px] text-ink/65 leading-relaxed max-w-sm mx-auto animate-fade-up">{current.sub}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-7 h-1 bg-black/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-forest" style={{ width: `${progress}%`, transition: `width ${SCENE_MS * 3}ms linear` }} />
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

  const field = 'w-full rounded-[14px] border border-ink/[0.12] bg-bone/60 px-4 py-3.5 font-body text-[16px] text-ink transition placeholder:text-ink/40 focus:border-forest focus:bg-paper focus:outline-none focus:ring-1 focus:ring-forest'
  const label = 'mb-2 block font-body text-sm font-medium text-ink'
  return (
    <main className="min-h-screen bg-bone px-5 pb-16 pt-24 text-ink md:pb-24">
      <div className="mx-auto grid max-w-6xl items-start gap-3.5 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-[32px] bg-forest p-8 text-mist lg:sticky lg:top-24">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">Summit reached</span>
          <p className="mt-4 font-display text-[30px] font-medium leading-[1.08] tracking-[-0.03em]">Your plan is built.</p>
          <p className="mt-3 font-body text-sm text-mist/70">Eight answers in. Your report is ready to open:</p>
          <ul className="mt-5 space-y-2.5 font-body text-sm">
            {['Marketing health score', 'The services you need first', 'The revenue on the table', 'Your best-fit plan'].map(t => (
              <li key={t} className="flex items-center gap-3"><span className="h-3.5 w-[3px] bg-lime" />{t}</li>
            ))}
          </ul>
          <div className="mt-8 hidden lg:block"><Climb step={STEP_LABELS.length} labels={STEP_LABELS} /></div>
        </aside>

        <section className="rounded-[32px] border border-ink/[0.08] bg-paper p-6 sm:p-10 lg:p-14">
          <h2 className="text-balance font-display text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.08] tracking-[-0.03em]">
            Where should we send <em className="accent text-forest">your plan?</em>
          </h2>
          <p className="mt-3 font-body text-[16px] text-ink/65">Tell us where to send it, and we&apos;ll show it to you right now.</p>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cap-name" className={label}>Name *</label>
              <input id="cap-name" type="text" name="name" autoComplete="name" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} placeholder="Your full name" className={field} />
            </div>
            <div>
              <label htmlFor="cap-company" className={label}>Company</label>
              <input id="cap-company" type="text" name="organization" autoComplete="organization" value={contact.company} onChange={e => setContact(c => ({ ...c, company: e.target.value }))} placeholder="Your business" className={field} />
            </div>
            <div>
              <label htmlFor="cap-email" className={label}>Email *</label>
              <input id="cap-email" type="email" name="email" autoComplete="email" inputMode="email" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="you@business.com" className={field} />
            </div>
            <div>
              <label htmlFor="cap-phone" className={label}>Phone <span className="font-normal text-ink/50">(optional)</span></label>
              <input id="cap-phone" type="tel" name="tel" autoComplete="tel" inputMode="tel" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="(555) 123-4567" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cap-state" className={label}>State</label>
              <select id="cap-state" name="address-level1" autoComplete="address-level1" value={contact.state} onChange={e => setContact(c => ({ ...c, state: e.target.value }))} className={`${field} appearance-none ${contact.state ? '' : 'text-ink/40'}`}>
                <option value="">Select a state…</option>
                {US_STATES.map(s => <option key={s} value={s} className="text-ink">{s}</option>)}
              </select>
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer select-none items-start gap-3">
            <input
              type="checkbox"
              checked={contact.consent}
              onChange={e => setContact(c => ({ ...c, consent: e.target.checked }))}
              className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded accent-[#1E3826]"
            />
            <span className="font-body text-[14px] leading-relaxed text-ink/70">
              I agree to receive my results and occasional marketing communications from Hewn Life, and consent to my information being used as described in the <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-2">privacy policy</Link>. I can unsubscribe anytime.
            </span>
          </label>

          {error && <p role="alert" className="mt-4 rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{error}</p>}

          <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-ink/[0.08] pt-6 sm:flex-row sm:items-center">
            <button onClick={onBack} className="font-body text-[15px] font-medium text-ink/60 transition-colors hover:text-ink">← Back</button>
            <button onClick={handleSubmit} disabled={!canSubmit} className={nextBtn}>Show my results →</button>
          </div>
          <p className="mt-4 font-body text-[13px] text-ink/55">No spam. We&apos;ll only reach out about your recommendation.</p>
        </section>
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
  const val = REVENUE_STOPS[revenueIdx]
  const pct = (revenueIdx / (REVENUE_STOPS.length - 1)) * 100

  return (
    <StepFrame
      step={1}
      labels={STEP_LABELS}
      title="What is your current annual revenue?"
      subtitle="The most important number for calculating your real return."
      onBack={onBack}
      next={<button onClick={onNext} className={nextBtn}>Next →</button>}
    >
      <div className="rounded-[22px] bg-bone px-6 py-8 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Annual revenue</span>
        <p className="mt-2 font-display text-[clamp(48px,6vw,72px)] font-medium leading-none tracking-[-0.04em] tabular-nums">{val.label}</p>
        <p className="mt-3 min-h-[20px] font-body text-sm text-ink/60">
          {revenueIdx === 0 && 'Pre-revenue: we’ll base projections on market-entry benchmarks.'}
          {revenueIdx === REVENUE_STOPS.length - 1 && 'Impressive. Let’s talk scale.'}
        </p>
      </div>

      <div className="mt-8 px-1">
        <label htmlFor="quiz-revenue" className="sr-only">Annual revenue</label>
        <input
          id="quiz-revenue"
          type="range"
          min={0}
          max={REVENUE_STOPS.length - 1}
          step={1}
          value={revenueIdx}
          onChange={e => setRevenueIdx(Number(e.target.value))}
          className="quiz-range h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{ background: `linear-gradient(to right, #1E3826 ${pct}%, #E9E5DB ${pct}%)` }}
        />
        <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
          <span>$0</span><span>$100M+</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[0, 3, 6, 10, 12, 16, 19].map(i => (
          <button
            key={i}
            onClick={() => setRevenueIdx(i)}
            className={`rounded-full border px-3.5 py-1.5 font-body text-[13px] font-medium transition-colors ${
              revenueIdx === i ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] text-ink/70 hover:border-ink/35'
            }`}
          >
            {REVENUE_STOPS[i].label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .quiz-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #1E3826;
          border: 4px solid #D6F28B;
          box-shadow: 0 2px 10px rgba(30, 56, 38, 0.35);
          cursor: pointer;
        }
        .quiz-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1E3826;
          border: 4px solid #D6F28B;
          box-shadow: 0 2px 10px rgba(30, 56, 38, 0.35);
          cursor: pointer;
        }
      `}</style>
    </StepFrame>
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
  const [nothingElse, setNothingElse] = useState(false)
  return (
    <StepFrame
      step={stepNumber}
      labels={STEP_LABELS.slice(0, totalSteps)}
      title="Anything else we should know?"
      subtitle="Optional, but the more context you give, the sharper your recommendation."
      onBack={onBack}
      next={<button onClick={onNext} disabled={!notes.trim() && !nothingElse} className={nextBtn}>Continue →</button>}
    >
      <label htmlFor="quiz-notes" className="sr-only">Anything else we should know</label>
      <textarea
        id="quiz-notes"
        name="notes"
        rows={6}
        value={notes}
        disabled={nothingElse}
        onChange={e => setNotes(e.target.value)}
        placeholder="Tell us about your business, your goals, what you’ve tried, or anything that would help us tailor your plan."
        className="w-full resize-none rounded-[18px] border border-ink/[0.12] bg-bone/60 px-5 py-4 font-body text-[16px] text-ink transition placeholder:text-ink/40 focus:border-forest focus:bg-paper focus:outline-none focus:ring-1 focus:ring-forest disabled:opacity-50"
      />
      <label className="mt-4 flex cursor-pointer items-center gap-3 font-body text-[16px] text-ink">
        <input
          type="checkbox"
          checked={nothingElse}
          onChange={e => {
            setNothingElse(e.target.checked)
            if (e.target.checked) setNotes('')
          }}
          className="h-5 w-5 flex-shrink-0 cursor-pointer rounded accent-[#1E3826]"
        />
        No, nothing else to add
      </label>
    </StepFrame>
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
      <main className="flex flex-col bg-bone" style={{ height: '100dvh' }}>
        {/* Hero — flex-1 so it fills remaining space; overflow-hidden clips the image only */}
        <section className="relative flex-1 overflow-hidden flex flex-col lg:block">
          {/* Image — right half on desktop, bottom fill on mobile */}
          <div className="absolute bottom-6 right-6 top-20 hidden w-[calc(50%-24px)] overflow-hidden rounded-[32px] isolate lg:block">
            <Terrain scene="survey" seed={57} className="-z-10" />
          </div>

          {/* Content */}
          <div className="relative lg:h-full flex items-start lg:items-center px-6 lg:px-12 pt-20 pb-4">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-xl">
                <div className="animate-fade-up">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/[0.1] bg-paper px-3.5 py-1.5">
                    <span className="h-3 w-[3px] bg-ember" />
                    <span className="font-body text-[13px] font-medium text-ink">Free growth assessment</span>
                  </span>

                  <h1 className="hero-heading fluid-hero text-ink leading-[1.02] mb-4">
                    See what growth<br />
                    <span className="accent" style={{ color: '#1E3826' }}>is worth to you.</span>
                  </h1>

                  <p className="font-body text-base lg:text-lg text-ink/70 leading-relaxed mb-6 max-w-md">
                    Answer 8 quick questions and get a personalized report — your marketing health score, the exact services you need, and the revenue you could unlock.
                  </p>

                  <button
                    onClick={() => setStep('revenue')}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-forest text-mist font-body font-medium text-[16px] px-9 py-4 rounded-full hover:bg-forest-2 transition-colors"
                  >
                    Calculate My ROI →
                  </button>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {['2 minutes', 'No sales call', 'Instant results'].map(t => (
                      <span key={t} className="flex items-center gap-2 font-body text-[14px] text-ink/70"><span className="h-3 w-[3px] bg-ember" />{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile image — fills remaining space below content */}
          <div className="relative isolate mx-5 mb-5 min-h-[120px] flex-1 overflow-hidden rounded-[28px] lg:hidden">
            <Terrain scene="survey" seed={57} className="-z-10" />
          </div>
        </section>

        {/* Ticker — sibling to the section, never clipped by overflow-hidden above */}
        <div className="flex-shrink-0 border-t border-ink/[0.06] bg-bone overflow-hidden">
          <OutcomeTicker />
        </div>
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
    <StepFrame
      step={(step as number) + 2}
      labels={STEP_LABELS}
      title={currentQ.question}
      subtitle={currentQ.subtitle}
      onBack={handleBack}
      next={
        <button onClick={handleNext} disabled={!selected} className={nextBtn}>
          {typeof step === 'number' && step === questions.length - 1 ? 'Almost done →' : 'Next →'}
        </button>
      }
    >
      <div className="grid gap-2.5">
        {currentQ.options.map((opt, i) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              aria-pressed={isSelected}
              className={`group flex w-full items-center gap-4 rounded-[18px] border p-4 text-left font-body text-[16px] leading-snug transition-all duration-200 sm:p-5 ${
                isSelected
                  ? 'border-forest bg-forest text-mist'
                  : 'border-ink/[0.1] bg-bone/60 text-ink hover:border-ink/30 hover:bg-bone'
              }`}
            >
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-medium transition-colors ${
                isSelected ? 'bg-lime text-forest' : 'border border-ink/15 bg-paper text-ink/60 group-hover:border-ink/40'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt.label}
            </button>
          )
        })}
      </div>
    </StepFrame>
  )
}
