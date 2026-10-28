/**
 * The Hewn Growth Engine — nine service pillars.
 *
 * Single source of truth for the homepage pillar grid, /services and
 * /services/[slug]. Each pillar is written as an execution playbook:
 * what it owns, the number it answers to, the plays we run, and the
 * weekly cadence that keeps it compounding.
 */

export type TierSlug = 'hewn' | 'wrought' | 'forged'

export interface Pillar {
  slug: string
  num: string
  name: string
  short: string
  /** One-line positioning used on cards. */
  summary: string
  /** Italic deck line on the playbook page. */
  deck: string
  /** Public category leader whose playbook the pillar is modeled on. */
  modeledOn: string
  accountableFor: string[]
  plays: { title: string; body: string }[]
  cadence: string[]
  rollout: { phase: string; body: string }[]
  deliverables: string[]
  /** Lowest tier that includes this pillar. */
  tier: TierSlug
  accent: string
  tint: string
  /** SVG path data, 24×24 stroke icon. */
  icon: string[]
}

export const pillars: Pillar[] = [
  {
    slug: 'strategy',
    num: '01',
    name: 'Strategy & Fractional CMO',
    short: 'Strategy',
    summary: 'Positioning, channel mix, the marketing P&L and the growth model, owned by a senior operator.',
    deck: 'Run marketing like an investment, not an expense line.',
    modeledOn: 'Hims & Hers',
    accountableFor: ['Blended CAC', 'LTV : CAC', 'Payback period'],
    plays: [
      { title: 'Build the growth model', body: 'Map what a customer is worth, what you can afford to pay for one, and how fast that spend comes back. Every channel decision answers to this model.' },
      { title: 'Set the scaling gate', body: 'Agree the LTV:CAC and payback thresholds that unlock more budget. Spend scales only behind proven unit economics.' },
      { title: 'Choose the channel mix', body: 'Rank channels by impact versus cost to close. Quick wins first, big bets sequenced behind them, everything else maintained.' },
      { title: 'Own the roadmap', body: 'A 90-day plan with one owner and one number per workstream, reviewed every quarter against the scorecard.' },
    ],
    cadence: ['Weekly scorecard review: CAC, payback, pipeline', 'Monthly marketing P&L and budget reallocation', 'Quarterly growth plan and channel re-rank'],
    rollout: [
      { phase: 'Days 0–30', body: 'Audit, growth model, and the gap analysis across all nine pillars.' },
      { phase: 'Days 30–90', body: 'Quick wins live; scaling gate enforced; first quarterly roadmap.' },
      { phase: 'Day 90+', body: 'Budget follows unit economics. Big bets sequenced in.' },
    ],
    deliverables: ['Growth model & unit economics', 'Nine-pillar gap analysis', 'Quarterly roadmap', 'Monthly marketing P&L'],
    tier: 'hewn',
    accent: '#3D4A3F',
    tint: '#EEF1EC',
    icon: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z'],
  },
  {
    slug: 'performance-media',
    num: '02',
    name: 'Performance Media',
    short: 'Paid media',
    summary: 'Meta, Google, TikTok and YouTube, run to a CAC and payback target, not to a spend number.',
    deck: 'Treat acquisition as capex and pour budget only into proven winners.',
    modeledOn: 'Hims & Hers',
    accountableFor: ['CAC', 'ROAS / MER', 'Payback'],
    plays: [
      { title: 'Launch the iso-creative test', body: '8–12 angles × 3 hooks at a small daily budget each until they reach significance. The data, not opinion, picks the winners.' },
      { title: 'Scale the 2–3 winners', body: 'Survivors move to scaling budgets behind the gate. Everything else is cut or sent back to creative.' },
      { title: 'Retarget with proof', body: 'Warm audiences see the offer plus a testimonial. Abandoners get a reason to come back.' },
      { title: 'Feed creative', body: 'Winning angles go straight back to the creative line as briefs for the next round of variants.' },
    ],
    cadence: ['Every Monday: kill ads under 1% CTR or over target CPA', 'Refresh the top ads every 7–10 days, before frequency passes 2.5', 'Hand winning angles back to creative for new variants'],
    rollout: [
      { phase: 'Days 0–30', body: 'Tracking verified; iso-creative test live; find the angles.' },
      { phase: 'Days 30–90', body: 'Scale winners; build retargeting; budget follows the gate.' },
      { phase: 'Day 90+', body: 'Full-force spend on proven creative across channels.' },
    ],
    deliverables: ['Meta + Google campaign management', 'Weekly creative testing', 'Retargeting program', 'Live performance dashboard'],
    tier: 'wrought',
    accent: '#B5621C',
    tint: '#F7F0EB',
    icon: ['M3 17l6-6 4 4 8-8', 'M21 7v5h-5'],
  },
  {
    slug: 'creative-production',
    num: '03',
    name: 'AI Creative Production',
    short: 'Creative',
    summary: 'An AI-native creative line shipping 20–40 on-brand, test-ready ads and pages every week.',
    deck: 'Out-produce everyone. Ship the matrix, let the data pick winners.',
    modeledOn: 'Hims & Hers · AG1',
    accountableFor: ['Assets shipped / week', 'Creative win rate', 'Creative-driven CAC delta'],
    plays: [
      { title: 'Build the ad matrix', body: '4 archetypes × 5 hooks × 3 formats from one shoot plus real customer clips. One day of capture, a month of creative.' },
      { title: 'Spin up the AI line', body: 'AI avatars, statics, motion and landing pages produced on demand, with human direction that keeps it on-brand and never looking like AI.' },
      { title: 'Wire the winner board', body: 'A swipe file of category leaders, multivariate tests, and one analytics source of truth for what is working.' },
      { title: 'Ship 20 by Friday of week one', body: 'On-brand variants go straight into the funnel test. Velocity is the lever.' },
    ],
    cadence: ['Ship 20–40 fresh, on-brand assets every week', 'Retire any ad past frequency 2.5 or with CTR decay', 'Promote winners to evergreen and whitelist for creators + paid'],
    rollout: [
      { phase: 'Days 0–30', body: 'Template library built; 20+ assets a week shipping.' },
      { phase: 'Days 30–90', body: 'Testing loop matures; the winner library grows.' },
      { phase: 'Day 90+', body: 'Proven pipeline running at full velocity.' },
    ],
    deliverables: ['Ad creative matrix', 'AI video, static + motion', 'Landing page variants', 'Winner library'],
    tier: 'wrought',
    accent: '#8B5CF6',
    tint: '#F3EBFF',
    icon: ['M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z'],
  },
  {
    slug: 'seo-aeo',
    num: '04',
    name: 'SEO + AEO',
    short: 'SEO + AI search',
    summary: 'Content that ranks on Google and gets cited inside ChatGPT, Perplexity, Claude and Gemini.',
    deck: 'Own the answer, on Google and now inside AI.',
    modeledOn: 'Hims & Hers',
    accountableFor: ['AI citation share', 'Organic sessions', 'AI-referral traffic'],
    plays: [
      { title: 'Build the cornerstone cluster', body: 'Ten deep pieces on the questions your buyers actually ask, interlinked into one authority hub.' },
      { title: 'Stamp every page expert-reviewed', body: 'Named expert byline, cited sources, real experience. The trust signals both Google and AI models reward.' },
      { title: 'Win the AI answer', body: 'FAQ blocks, schema and clean, quotable claims so AI assistants cite you. Citation share is tracked against competitors.' },
      { title: 'Lock the local layer', body: 'Google Business Profile, listings and reviews tuned so you show up in maps and "near me" answers.' },
    ],
    cadence: ['Publish 2–4 expert-reviewed cornerstones a month', 'Expand around the queries that get cited', 'Re-review claims and citations quarterly'],
    rollout: [
      { phase: 'Days 0–30', body: 'Technical fixes; first cluster published and indexed.' },
      { phase: 'Days 30–90', body: 'Citations compound; authority builds.' },
      { phase: 'Day 90+', body: 'You are the cited answer in your category.' },
    ],
    deliverables: ['Technical + on-page SEO', 'Cornerstone content cluster', 'AI citation tracking', 'Google Business Profile'],
    tier: 'hewn',
    accent: '#3D7FA4',
    tint: '#EBF3F7',
    icon: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.3-4.3'],
  },
  {
    slug: 'creators',
    num: '05',
    name: 'Creators, UGC & Referrals',
    short: 'Creators',
    summary: 'Trusted voices, real customers and micro-creators, each tracked to the dollar with a page and a code.',
    deck: 'Trust is the scarce asset. Real users first, then amplify.',
    modeledOn: 'AG1 · Function Health',
    accountableFor: ['Revenue per partnership', 'Code redemptions', 'Blended-CAC impact'],
    plays: [
      { title: 'Anchor on a trusted voice', body: 'The founder, a respected local expert or an industry name. Credibility transfers, and it is the cheapest attention you will ever buy.' },
      { title: 'Sample first', body: 'Product or service goes out before any deal. Only genuine fans become partners, so the content reads true.' },
      { title: 'Give every partner a tracked page', body: 'yoursite.com/[creator]: their photo, their words, a unique code and offer. UTM everything.' },
      { title: 'Spark-ad the winners', body: 'Top creator videos are whitelisted straight into paid: organic trust, paid reach.' },
    ],
    cadence: ['Onboard 10–20 sampled creators or customers a month', 'Cut codes above target CAC; renew the winners', 'Collect reviews and referrals after every job or order'],
    rollout: [
      { phase: 'Days 0–30', body: 'Seed creators and customers; prove the mechanic.' },
      { phase: 'Days 30–90', body: 'Scale the bench; land a flagship voice.' },
      { phase: 'Day 90+', body: 'Flagship plus full bench live, feeding paid.' },
    ],
    deliverables: ['Creator + UGC program', 'Personalized creator pages', 'Review generation system', 'Referral program'],
    tier: 'forged',
    accent: '#A43D3D',
    tint: '#F7EBEB',
    icon: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  },
  {
    slug: 'lifecycle',
    num: '06',
    name: 'Lifecycle / CRM',
    short: 'Lifecycle',
    summary: 'Email + SMS onboarding, reminders, repeat purchase and win-back. Where lifetime value is made or lost.',
    deck: 'Retention is the real growth engine.',
    modeledOn: 'Hims & Hers',
    accountableFor: ['Repeat / retention rate', 'Revenue per customer', 'Net revenue retention'],
    plays: [
      { title: 'Ship the three money flows', body: 'Onboarding, repeat + reminder, and win-back. The flows that pay for themselves in the first month.' },
      { title: 'Wire the CRM pipeline', body: 'Every lead staged, scored and followed up, so no booked call or quote goes cold.' },
      { title: 'Add the cross-sell', body: 'Segment by behavior and offer the next most-valuable product or service at the right moment.' },
      { title: 'Ask for the review and the referral', body: 'Automated at the moment of delight, feeding the creators and social-proof engines.' },
    ],
    cadence: ['A/B subject lines, send times and offers continuously', 'Watch cohort retention and repeat rate every week', 'Prune dead flows; refresh as cohorts mature'],
    rollout: [
      { phase: 'Days 0–30', body: 'Core flows live; CRM pipeline configured.' },
      { phase: 'Days 30–90', body: 'Optimize; build the retention baseline.' },
      { phase: 'Day 90+', body: 'Cross-sell and win-back compounding LTV.' },
    ],
    deliverables: ['Email + SMS automation', 'CRM setup & pipeline', 'Onboarding + win-back flows', 'Booking & follow-up systems'],
    tier: 'wrought',
    accent: '#6BAD3D',
    tint: '#F0F7EB',
    icon: ['M17 2l4 4-4 4', 'M3 11v-1a4 4 0 0 1 4-4h14', 'M7 22l-4-4 4-4', 'M21 13v1a4 4 0 0 1-4 4H3'],
  },
  {
    slug: 'data-attribution',
    num: '07',
    name: 'Data & Attribution',
    short: 'Data',
    summary: 'The measurement spine: first-party tracking, blended MER and one live dashboard as the source of truth.',
    deck: 'Signal loss makes first-party data and blended measurement non-negotiable.',
    modeledOn: 'Function Health',
    accountableFor: ['MER (blended ROAS)', 'CAC by channel', 'Cohort LTV'],
    plays: [
      { title: 'Server-side conversions', body: 'Conversions API and enhanced conversions, sent server-side and clean, so the ad platforms optimize on real outcomes.' },
      { title: 'One source of truth', body: 'A live growth dashboard: spend, CAC, MER and pipeline by strategy, refreshed daily, not a monthly PDF.' },
      { title: 'Measure blended, not last-click', body: 'MER and cohort economics show what is really working when platform attribution disagrees.' },
      { title: 'Grade every strategy', body: 'Each campaign gets a verdict against target: scale, watch, or cut and fix.' },
    ],
    cadence: ['Daily dashboard refresh across Meta, Google and CRM', 'Weekly verdicts: scale, watch, cut', 'Monthly cohort and payback review'],
    rollout: [
      { phase: 'Days 0–30', body: 'Tracking audit; server-side events live; dashboard v1.' },
      { phase: 'Days 30–90', body: 'Cohort baseline; blended MER in every review.' },
      { phase: 'Day 90+', body: 'A single source of truth runs the function.' },
    ],
    deliverables: ['Tracking + server-side events', 'Live growth dashboard', 'Strategy verdicts', 'Cohort reporting'],
    tier: 'wrought',
    accent: '#44514D',
    tint: '#ECEFEE',
    icon: ['M3 3v18h18', 'M7 15l3-3 3 3 5-6'],
  },
  {
    slug: 'social',
    num: '08',
    name: 'Social / Owned',
    short: 'Social',
    summary: 'One premium, consistent feed: the content supply chain that feeds creators, AI search and paid.',
    deck: 'One premium, unmistakable feed that compounds authority.',
    modeledOn: 'AG1',
    accountableFor: ['Posts / channel / week', 'Engagement growth', 'Social-sourced leads'],
    plays: [
      { title: 'Adopt the five-pillar feed', body: 'The Work, The Expertise, The Proof, The Authority and The Offer. The same look on every post.' },
      { title: 'Batch like the best', body: 'One monthly capture day becomes 60+ posts, AI-expanded to 5+ per channel per week.' },
      { title: 'Run the partner-content loop', body: 'Repost customer and creator clips, and secure whitelisting rights for paid.' },
      { title: 'Pin the offer everywhere', body: 'The quiz, the booking link or the lead magnet in every bio, link and pinned post.' },
    ],
    cadence: ['Publish 5+ per channel weekly: on cadence, no gaps', 'Every post on-brand and fact-checked', 'Weekly best-of review; double down on top formats'],
    rollout: [
      { phase: 'Days 0–30', body: 'Establish cadence and voice; first batch shoot.' },
      { phase: 'Days 30–90', body: 'Partner loop running; formats refined.' },
      { phase: 'Day 90+', body: 'Full cadence on every channel.' },
    ],
    deliverables: ['Content pillars + calendar', 'Monthly batch production', 'Community management', 'Video repurposing'],
    tier: 'hewn',
    accent: '#7A4A9A',
    tint: '#F3EBF7',
    icon: ['M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z'],
  },
  {
    slug: 'brand',
    num: '09',
    name: 'Brand',
    short: 'Brand',
    summary: 'The cross-cutting layer: positioning, identity and one promise carried across every surface.',
    deck: 'Same promise, every voice, every surface.',
    modeledOn: 'Function Health · AG1',
    accountableFor: ['Branded search growth', 'Direct traffic', 'Close rate'],
    plays: [
      { title: 'Write the message spine', body: 'One promise and three proof points that never change, whoever is speaking and wherever it shows up.' },
      { title: 'Build the identity system', body: 'Logo, palette, typography and art direction, documented so every asset is unmistakably yours.' },
      { title: 'Build the proof library', body: 'Results, reviews, credentials and press, organized and ready to use across ads, pages and sales.' },
      { title: 'Carry it across four surfaces', body: 'Website, ads, social and sales conversations: same promise, same look, every time.' },
    ],
    cadence: ['Every asset checked against the brand system', 'Proof library updated monthly', 'Annual positioning review'],
    rollout: [
      { phase: 'Days 0–30', body: 'Positioning, message spine and identity audit.' },
      { phase: 'Days 30–90', body: 'Identity system and style guide shipped.' },
      { phase: 'Day 90+', body: 'One brand, full force, everywhere.' },
    ],
    deliverables: ['Positioning + messaging', 'Logo + visual identity', 'Brand style guide', 'Proof library'],
    tier: 'hewn',
    accent: '#0D0D0D',
    tint: '#EDEAE4',
    icon: ['M12 3L3 8l9 5 9-5-9-5z', 'M3 13l9 5 9-5', 'M3 18l9 5 9-5'],
  },
]

export const tierNames: Record<TierSlug, string> = { hewn: 'Hewn', wrought: 'Wrought', forged: 'Forged' }

export function getPillar(slug: string) {
  return pillars.find(p => p.slug === slug)
}

/** The four-stage funnel every dollar runs through. */
export const funnel = [
  {
    stage: 'Top · Cold', name: 'Awareness', goal: 'Stop the scroll, earn cheap attention.',
    creative: ['Raw UGC hooks', 'Founder / expert', 'Problem-aware', 'Myth-bust'],
    landsOn: 'Educational article or advertorial', benchmark: 'CTR 1–3% · lowest CPM wins',
    bg: '#3D4A3F', fg: '#ffffff',
  },
  {
    stage: 'Middle · Warm', name: 'Consideration', goal: 'Build trust, qualify real intent.',
    creative: ['UGC testimonial', 'Before / after', 'Expert read', 'Comparison'],
    landsOn: 'Quiz or interactive tool', benchmark: 'Quiz completion 40–60%',
    bg: '#8B5CF6', fg: '#ffffff',
  },
  {
    stage: 'Bottom · Hot', name: 'Conversion', goal: 'Turn intent into a customer.',
    creative: ['Offer / guarantee', 'Social proof', 'Retargeting', 'Results page'],
    landsOn: 'Tailored results page → checkout or booking', benchmark: 'Quiz funnel 2–3× a static page',
    bg: '#0D0D0D', fg: '#ffffff',
  },
  {
    stage: 'Post-purchase', name: 'Retention', goal: 'Repeat, referrals, reviews.',
    creative: ['Lifecycle email + SMS', 'Win-back', 'Customer stories', 'Referral'],
    landsOn: 'CRM flows and customer hub', benchmark: 'Retention worth 3–5× equal CAC cuts',
    bg: '#6BAD3D', fg: '#0D0D0D',
  },
]

/** Eight proven ad archetypes and the funnel stages they serve. */
export const archetypes = [
  { name: 'Founder / Expert', body: 'The owner or an expert to camera. Authority that transfers trust.', stages: ['TOF', 'MOF'] },
  { name: 'Raw UGC testimonial', body: 'A real customer, phone-shot and unpolished. Authenticity converts.', stages: ['MOF'] },
  { name: 'Problem → Solution', body: 'Name the pain, then show the fix.', stages: ['TOF'] },
  { name: 'Advertorial', body: 'Editorial that pre-sells before the offer ever appears.', stages: ['TOF', 'MOF'] },
  { name: 'Quiz hook', body: '“Find your plan”: interactive, high-intent capture.', stages: ['MOF'] },
  { name: 'Outcome proof', body: 'Before / after and hard results. Earned, not claimed.', stages: ['MOF', 'BOF'] },
  { name: 'Comparison', body: 'Us versus the old way, and versus the alternatives.', stages: ['BOF'] },
  { name: 'Social proof / press', body: 'Reviews, star ratings and “as seen in”.', stages: ['BOF'] },
]

/** The scorecard we run every client on. */
export const scorecard = [
  { group: 'Acquisition', items: ['Blended CAC', 'CAC by channel', 'CPC · CPM', 'MER (blended ROAS)', 'New customers / day'] },
  { group: 'Economics', items: ['12-mo LTV', 'LTV : CAC ≥ 3:1', 'Payback period', 'Gross margin'] },
  { group: 'Retention', items: ['Cohort retention', 'Repeat rate', 'Churn', 'Net revenue retention'] },
  { group: 'Creative', items: ['Assets shipped / week', 'Win rate', 'Creative-driven CAC delta'] },
  { group: 'Organic / AEO', items: ['Organic sessions', 'Keyword footprint', 'AI citation share', 'AI-referral traffic'] },
  { group: 'Creators', items: ['Revenue per partnership', 'Code redemptions', 'Blended-CAC impact'] },
]

/** Plan summaries for the homepage pricing teaser. Prices mirror /pricing. */
export const plans = [
  {
    slug: 'hewn' as TierSlug, name: 'Hewn', tagline: 'Brand, website and organic foundation.', price: { monthly: 2500, annual: 2000 },
    pillars: ['01', '04', '08', '09'],
    highlights: ['Strategy + growth model', 'Brand identity & style guide', 'Website + SEO / AEO foundation', 'Social content system'],
  },
  {
    slug: 'wrought' as TierSlug, name: 'Wrought', tagline: 'The full paid and lifecycle engine.', price: { monthly: 5000, annual: 4000 },
    pillars: ['01–04', '06–09'],
    highlights: ['Everything in Hewn', 'Paid media on Meta + Google', 'AI creative: 20+ assets / week', 'Lifecycle, CRM + live dashboard'],
  },
  {
    slug: 'forged' as TierSlug, name: 'Forged', tagline: 'All nine pillars. Your outsourced CMO.', price: { monthly: 9500, annual: 7600 },
    pillars: ['01–09'],
    highlights: ['Everything in Wrought', 'Creators, UGC + referral program', 'Quarterly growth planning', 'Weekly calls + Slack access'],
  },
]
