/**
 * Checkout galleries: the swipeable slides at the top of the order summary.
 *
 * One gallery per plan, keyed by the checkout `tier` (or a single catalog SKU).
 * A cover photo, then one card per service: what you get, in a word or two,
 * and one sourced stat on why it matters. Cards alternate between photos and
 * flat colour cards with a simple graphic.
 *
 * Every stat is a published third-party figure, cited on the card. Never a
 * result, review or number of ours. Plan facts (price, timing, what's
 * included) repeat the pricing page and lib/addons.ts.
 *
 * The cover is a clean photo; the plan's title, price, tagline and blurb sit
 * at the top of the order summary instead (see introFor).
 */
import type { PhotoKey } from '@/lib/photos'

export type Graphic = 'funnel' | 'pipeline' | 'swatches' | 'bars' | 'stars' | 'clock'

/** How a card looks: a photo (type straight on it, or on faint glass) or a flat colour with a graphic. */
export type Look =
  | { photo: PhotoKey; glass?: boolean }
  | { color: 'lime' | 'forest'; graphic?: Graphic }

export type Slide =
  | { kind: 'cover'; photo: PhotoKey }
  | { kind: 'stat'; service: string; stat: string; text: string; source: string; look: Look }
  | { kind: 'list'; service: string; items: string[]; look: Look }

const GALLERIES: Record<string, Slide[]> = {
  hewn: [
    { kind: 'cover', photo: 'logoSketch' },
    { kind: 'stat', service: 'Brand identity', stat: '23%', text: 'average revenue lift from consistent branding', source: 'Lucidpress & Demand Metric, 2016', look: { color: 'lime', graphic: 'swatches' } },
    { kind: 'stat', service: 'Website', stat: '46%', text: 'of credibility judgments cite a site’s design', source: 'Stanford Web Credibility Project, 2002', look: { photo: 'bakerTablet' } },
    { kind: 'stat', service: 'Google profile', stat: '2.7×', text: 'more likely to be seen as reputable with a complete profile', source: 'Google Business Profile Help', look: { photo: 'brownstones', glass: true } },
    { kind: 'stat', service: 'SEO', stat: '53%', text: 'of trackable web traffic comes from organic search', source: 'BrightEdge, 2019', look: { color: 'forest', graphic: 'bars' } },
  ],
  wrought: [
    { kind: 'cover', photo: 'teamPlanning' },
    { kind: 'stat', service: 'Paid media', stat: '$8', text: 'profit per $1 on Google Ads', source: 'Google Economic Impact Report', look: { photo: 'cityWalkPhone' } },
    { kind: 'stat', service: 'Sales funnels', stat: '6.6%', text: 'median landing page conversion', source: 'Unbounce, 2024', look: { color: 'lime', graphic: 'funnel' } },
    { kind: 'stat', service: 'Automation', stat: '7×', text: 'likelier to qualify a lead when you reply within the hour', source: 'Harvard Business Review, 2011', look: { photo: 'kitchenMorning', glass: true } },
    { kind: 'stat', service: 'CRM setup', stat: '$8.71', text: 'return per $1 spent on CRM', source: 'Nucleus Research, 2014', look: { color: 'forest', graphic: 'pipeline' } },
  ],
  forged: [
    { kind: 'cover', photo: 'officeWalk' },
    { kind: 'stat', service: 'UGC', stat: '79%', text: 'of shoppers say customer content highly impacts purchases', source: 'Stackla, 2021', look: { photo: 'creatorFilming' } },
    { kind: 'stat', service: 'Review generation', stat: '270%', text: 'higher purchase likelihood with five reviews vs none', source: 'Spiegel Research Center, 2017', look: { color: 'forest', graphic: 'stars' } },
    { kind: 'stat', service: 'Referral program', stat: '16%', text: 'higher lifetime value from referred customers', source: 'Journal of Marketing, 2011', look: { photo: 'friendsWalking', glass: true } },
    { kind: 'list', service: 'Everything in Wrought', items: ['Paid media', 'Sales funnels', 'Automation', 'CRM'], look: { color: 'lime' } },
  ],
  'website-in-a-day': [
    { kind: 'cover', photo: 'ownerPortrait' },
    { kind: 'stat', service: 'Live in 24 hours', stat: '24h', text: 'from your brief to a live site', source: 'Then one round of edits, on us', look: { color: 'lime', graphic: 'clock' } },
    { kind: 'stat', service: 'Mobile-first design', stat: '53%', text: 'of mobile visits are abandoned if a page takes over 3 seconds to load', source: 'Google, 2016', look: { photo: 'cafePhone' } },
    { kind: 'stat', service: 'Copy written for you', stat: '20%', text: 'of a page’s words get read on a typical visit', source: 'Nielsen Norman Group, 2008', look: { photo: 'sketching', glass: true } },
    { kind: 'stat', service: 'SEO-ready', stat: 'Half', text: 'of trackable web traffic comes from organic search', source: 'BrightEdge, 2019', look: { color: 'forest', graphic: 'bars' } },
  ],
}

/** The top of the order summary: a short uppercase tagline, an optional badge and one line on the plan. */
export type Intro = { eyebrow: string; badge?: string; blurb: string }

const INTROS: Record<string, Intro> = {
  hewn: { eyebrow: 'Brand, website and local', blurb: 'Deliberately shaped. Ready to work. Brand strategy and identity, a custom website, SEO and local listings.' },
  wrought: { eyebrow: 'Your full marketing engine', badge: 'Most Popular', blurb: 'Full-stack marketing without the full-stack agency. Everything in Hewn, plus paid media, funnels, automation and a CRM.' },
  forged: { eyebrow: 'Your outsourced CMO', badge: 'Full Service', blurb: 'Your outsourced CMO and creative department. Everything in Wrought, plus reviews, UGC, referrals and growth planning.' },
  'website-in-a-day': { eyebrow: 'Live within 24 hours', blurb: 'Answer a few quick questions. We design, write, build and launch your website within 24 hours.' },
}

export function introFor(tier: string, skus: string[]): Intro | null {
  return INTROS[tier] ?? (skus.length === 1 ? INTROS[skus[0]] : undefined) ?? null
}

/** The gallery for a checkout: a plan tier, or the SKUs in an à la carte cart. */
export function galleryFor(tier: string, skus: string[]): Slide[] {
  if (GALLERIES[tier]) return GALLERIES[tier]
  if (skus.length === 1 && GALLERIES[skus[0]]) return GALLERIES[skus[0]]
  return []
}

type Card = Extract<Slide, { kind: 'stat' | 'list' }>

/** A plan's service cards without the cover, for site pages. */
export function cardsFor(key: string): Card[] {
  return (GALLERIES[key] ?? []).filter((s): s is Card => s.kind !== 'cover')
}

/** A plan's cover photo. */
export function coverFor(key: string): PhotoKey | null {
  const c = GALLERIES[key]?.find(s => s.kind === 'cover')
  return c && c.kind === 'cover' ? c.photo : null
}

/** A plan's short uppercase tagline and badge (also used at the top of checkout). */
export const introOf = (key: string): Intro | null => INTROS[key] ?? null

/** The home page's "why it matters" row: one card from each layer of the work, alternating photo and colour. */
export function homeCards(): Card[] {
  const pick = (plan: string, service: string) => cardsFor(plan).find(c => c.service === service)!
  return [
    pick('wrought', 'Paid media'),
    pick('wrought', 'Sales funnels'),
    pick('wrought', 'Automation'),
    pick('forged', 'Review generation'),
  ]
}

/** The services page row: one card each from brand, search, content and referrals. */
export function servicesCards(): Card[] {
  const pick = (plan: string, service: string) => cardsFor(plan).find(c => c.service === service)!
  return [
    pick('forged', 'UGC'),
    pick('hewn', 'Brand identity'),
    pick('forged', 'Referral program'),
    pick('hewn', 'SEO'),
  ]
}

/** The stat card for a service playbook page, where one fits (keyed by lib/services pillar slug). */
const PILLAR_CARDS: Record<string, [string, string]> = {
  'performance-media': ['wrought', 'Paid media'],
  'seo-aeo': ['hewn', 'SEO'],
  creators: ['forged', 'UGC'],
  lifecycle: ['wrought', 'Automation'],
  brand: ['hewn', 'Brand identity'],
}

export function pillarCard(slug: string): Card | null {
  const ref = PILLAR_CARDS[slug]
  return ref ? cardsFor(ref[0]).find(c => c.service === ref[1]) ?? null : null
}
