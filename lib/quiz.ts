/**
 * The ROI calculator's questions and scoring, shared by the quiz and the
 * contact form so both ask the same things and read out the same result.
 */

export const REVENUE_STOPS = [
  { value: 0, label: 'Pre-revenue' },
  { value: 100000, label: 'Under $250K' },
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

/** Index of the stop with this value, for forms that ask in ranges. */
export const revenueIndex = (value: number) => Math.max(0, REVENUE_STOPS.findIndex(s => s.value === value))

export function revenueLabel(idx: number): string {
  return REVENUE_STOPS[idx]?.label ?? '$0'
}

export function revenueValue(idx: number): number {
  return REVENUE_STOPS[idx]?.value ?? 0
}

// Derive the business-stage bucket the rest of the scoring relies on from the
// real annual-revenue number the user gave us on the slider.
export function revenueStage(idx: number): 'pre' | 'early' | 'growth' | 'scale' {
  const v = revenueValue(idx)
  if (v <= 0) return 'pre'
  if (v < 250000) return 'early'
  if (v < 1000000) return 'growth'
  return 'scale'
}

// ── Questions ────────────────────────────────────────────────────────────────

export const questions = [
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

export type ServiceFlag = {
  label: string
  reason: string
  trigger: (answers: Record<string, string>) => boolean
}

export const serviceFlags: ServiceFlag[] = [
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

export const tiers = {
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

export function computeResult(answers: Record<string, string>): 'hewn' | 'wrought' | 'forged' {
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

export function computeScore(answers: Record<string, string>): number {
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

export function getServices(answers: Record<string, string>): ServiceFlag[] {
  return serviceFlags.filter(s => s.trigger(answers))
}

// ── Health score ──────────────────────────────────────────────────────────────

export type HealthCategory = { label: string; score: number; description: string }

export function computeHealthScore(answers: Record<string, string>): { overall: number; categories: HealthCategory[] } {
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
