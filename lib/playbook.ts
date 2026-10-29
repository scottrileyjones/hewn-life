/**
 * The growth-plan playbook: the exploration deck as data.
 *
 * Personal decks (lib/plans) are assembled from this. Claude chooses which
 * challenges apply to a lead and words them for that person, but every
 * statistic, source, proof point and price shown in a deck comes from here,
 * never from the model.
 */

export type ChallengeId = 'capacity' | 'acquisition' | 'measurement' | 'agency' | 'creator' | 'founder' | 'credibility'

export type Stat = { value: string; pct?: number; label: string }

export type Challenge = {
  id: ChallengeId
  name: string
  headline: string
  stats: Stat[]
  source: string
  impact: string[]
  solution: string
  kpis: string[]
}

export const challenges: Challenge[] = [
  {
    id: 'capacity',
    name: 'Capacity',
    headline: 'Marketing runs on whatever time the owner has left.',
    stats: [
      { value: '44%', pct: 44, label: 'of small-business owners are also the business’s marketer' },
      { value: '54%', pct: 54, label: 'spend more time on marketing than they planned' },
      { value: '69%', pct: 69, label: 'would rather hand creative work to someone else' },
    ],
    source: 'Adobe Express and Talker Research, 1,000 US small-business owners, 2026',
    impact: ['Campaigns stall whenever the business gets busy', 'Inconsistent output caps reach and share of voice', 'High opportunity cost on the owner’s hours'],
    solution: 'A senior team executes every week; you approve in minutes.',
    kpis: ['Output', 'Consistency'],
  },
  {
    id: 'acquisition',
    name: 'Acquisition cost',
    headline: 'Customer acquisition is the top challenge, and CAC keeps climbing.',
    stats: [
      { value: '60%', pct: 60, label: 'of small businesses name winning new customers their #1 challenge' },
      { value: '45%', pct: 45, label: 'expected steady leads to be a struggle this year' },
      { value: '$9 → $29', label: 'lost on each new online customer, 2013 to 2021' },
    ],
    source: 'Constant Contact and Ascend2, 2024; LocaliQ, 2025; SimplicityDX, 2022',
    impact: ['Rising CAC against flat conversion rates', 'Paid leads instead of owned demand', 'Concentration risk in a single channel'],
    solution: 'Conversion-led pages and 20–40 creative tests a week.',
    kpis: ['CAC', 'Conversion rate'],
  },
  {
    id: 'measurement',
    name: 'Measurement',
    headline: 'Most businesses can’t attribute revenue to their marketing spend.',
    stats: [
      { value: '23%', pct: 23, label: 'of small businesses say their #1 frustration is not knowing what drives results' },
      { value: '38%', pct: 38, label: 'of marketers measure the return on their spend' },
      { value: '33%', pct: 33, label: 'of the marketing software teams pay for gets used' },
    ],
    source: 'Constant Contact, 2025; Marketing Week, Kantar and Google, 2025; Gartner, 2023',
    impact: ['Budget allocated by habit, not by return', 'Winners aren’t scaled; losers aren’t cut', 'Decisions lag a monthly report'],
    solution: 'Server-side tracking, attribution by channel and a live dashboard.',
    kpis: ['MER', 'ROAS'],
  },
  {
    id: 'agency',
    name: 'Agency economics',
    headline: 'Traditional agency models add cost and time before results.',
    stats: [
      { value: '48%', pct: 48, label: 'of clients who fired an agency blamed delivery; only 18% of agencies agree' },
      { value: '36¢', pct: 36, label: 'of each programmatic ad dollar reaches the actual ad' },
      { value: '8–16 wks', label: 'for a typical agency website build' },
    ],
    source: 'Setup, 2024; ANA Programmatic Transparency Study, 2023; agency-published timelines',
    impact: ['Hourly billing and change orders erode ROI', 'Senior strategy in the pitch, junior execution after', '6–12 month contracts limit flexibility'],
    solution: 'One flat monthly fee, month to month, senior people on every account.',
    kpis: ['Cost as % of revenue'],
  },
  {
    id: 'creator',
    name: 'Creator revenue',
    headline: 'Creator revenue depends on platforms they don’t control.',
    stats: [
      { value: '67%', pct: 67, label: 'of creators earned under $10K from creating last year' },
      { value: '62%', pct: 62, label: 'of creator payments go to the top 10%' },
      { value: '52%', pct: 52, label: 'have burned out because of the work' },
    ],
    source: 'CreatorIQ, 2025; Billion Dollar Boy, 2025',
    impact: ['Revenue swings with algorithm changes', 'No owned audience, list or product', 'Content demand outpaces capacity'],
    solution: 'An owned site, email list and offer, with content made for you.',
    kpis: ['Owned revenue', 'LTV'],
  },
  {
    id: 'founder',
    name: 'Founder runway',
    headline: 'Founders must prove traction faster, in a tighter capital market.',
    stats: [
      { value: '28%', pct: 28, label: 'fewer new seed rounds in early 2025 than a year before' },
      { value: '20 mo', label: 'from seed to Series A, near the longest in years' },
      { value: '4 min', label: 'or less spent by an investor on a pitch deck' },
    ],
    source: 'Carta, State of Private Markets, 2025; DocSend pitch deck research',
    impact: ['Runway must buy measurable traction', 'Diligence starts with the brand, site and deck', 'No go-to-market team in place yet'],
    solution: 'Deck, site and go-to-market in days, not a six-week agency cycle.',
    kpis: ['Time to traction', 'Pipeline'],
  },
  {
    id: 'credibility',
    name: 'Credibility',
    headline: 'Credibility is judged before anyone reads a word.',
    stats: [
      { value: '0.05s', label: 'for a visitor to form a first impression of a website' },
      { value: '53%', pct: 53, label: 'of mobile visits end when a page takes over 3 seconds' },
      { value: '4%', pct: 4, label: 'of consumers never read reviews before choosing a local business' },
    ],
    source: 'Lindgaard et al., 2006; Google, 2016; BrightLocal, 2025',
    impact: ['A dated site loses the click you paid for', 'Thin reviews read as thin demand', 'Slow pages leak mobile visitors'],
    solution: 'A conversion-ready website in a day and a review program.',
    kpis: ['Conversion rate', 'Reviews'],
  },
]

export const methodology = [
  { phase: 'Audit', when: 'Week 1', body: 'Benchmark all nine pillars and set your KPI baseline: CAC, conversion rate, LTV.', deliverable: 'Graded scorecard' },
  { phase: 'Plan', when: 'Weeks 1–2', body: 'A growth model with unit-economics targets, budget by channel and one owner per KPI.', deliverable: '90-day roadmap' },
  { phase: 'Build', when: 'Days 0–30', body: 'Tracking, a conversion-ready site, the creative testing matrix and first funnel tests.', deliverable: 'Live dashboard' },
  { phase: 'Grade', when: 'Ongoing', body: 'Every strategy gets a verdict against target, and budget moves to what wins.', deliverable: 'Weekly report, monthly review, quarterly business review' },
]

export const kpiGlossary: Record<string, string> = {
  CAC: 'What it costs to win one customer',
  'Conversion rate': 'Share of visitors who buy, book or sign up',
  LTV: 'Revenue one customer brings over time',
  MER: 'Revenue per total marketing dollar',
  ROAS: 'Revenue per ad dollar',
  Output: 'Creative and content shipped each week',
  Consistency: 'Weeks in a row the plan ran without a gap',
  'Cost as % of revenue': 'What marketing costs relative to what it earns',
  'Owned revenue': 'Revenue from your own site and list, not a platform',
  'Time to traction': 'Weeks from launch to the first proof investors want',
  Pipeline: 'Qualified leads and deals in progress',
  Reviews: 'New reviews each month, and your average rating',
}

export type ProofId = 'growth' | 'exit' | 'raise' | 'regulated'

export const proof: { id: ProofId; value: string; label: string }[] = [
  { id: 'growth', value: '$0 → $10M', label: 'Grew a national telemedicine brand from launch to a $10M company.' },
  { id: 'exit', value: 'Acquired', label: 'Built the growth engine behind a business that went on to be acquired.' },
  { id: 'raise', value: 'Seed', label: 'Helped raise a multi-million-dollar seed round with the story, deck and brand.' },
  { id: 'regulated', value: '30 years', label: 'Of healthcare marketing, one of the most regulated categories to market.' },
]

export type PlanId = 'website-in-a-day' | 'hewn' | 'wrought' | 'forged'

/** Monthly checkout for a tier, the same URL the pricing page builds. No price ID yet: the pricing page. */
function checkout(name: string, tier: string, price: number, priceId?: string) {
  if (!priceId) return '/pricing#plans'
  return `/checkout?${new URLSearchParams({ priceId, mode: 'subscription', name, price: String(price), billing: 'monthly', tier })}`
}

export const plans: { id: PlanId; name: string; price: string; per: string; includes: string[]; href: string }[] = [
  { id: 'website-in-a-day', name: 'Website in a Day', price: '$999', per: 'one time', includes: ['Custom website, live in a day', 'Copy, hosting and SEO-ready build'], href: '/website-in-a-day#order' },
  { id: 'hewn', name: 'Hewn', price: '$2,500', per: 'per month', includes: ['Website included', 'Brand, SEO + AI search, social', 'Monthly strategy call'], href: checkout('Hewn', 'hewn', 2500, process.env.NEXT_PUBLIC_STRIPE_PRICE_HEWN_MONTHLY) },
  { id: 'wrought', name: 'Wrought', price: '$5,000', per: 'per month', includes: ['Everything in Hewn', 'Paid media + AI creative', 'Email, CRM + live dashboard'], href: checkout('Wrought', 'wrought', 5000, process.env.NEXT_PUBLIC_STRIPE_PRICE_WROUGHT_MONTHLY) },
  { id: 'forged', name: 'Forged', price: '$9,500', per: 'per month', includes: ['Everything in Wrought', 'Creators, reviews, referrals', 'Weekly strategy + Slack'], href: checkout('Forged', 'forged', 9500, process.env.NEXT_PUBLIC_STRIPE_PRICE_FORGED_MONTHLY) },
]

export const challengeIds = challenges.map(c => c.id) as [ChallengeId, ...ChallengeId[]]
export const proofIds = proof.map(p => p.id) as [ProofId, ...ProofId[]]
export const planIds = plans.map(p => p.id) as [PlanId, ...PlanId[]]

export const getChallenge = (id: ChallengeId) => challenges.find(c => c.id === id)!
export const getPlan = (id: PlanId) => plans.find(p => p.id === id)!
