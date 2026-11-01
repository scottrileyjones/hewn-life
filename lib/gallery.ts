/**
 * Checkout galleries: the swipeable slides at the top of the order summary.
 *
 * One gallery per plan, add-on and kit, keyed by the checkout `tier` (plans) or
 * the catalog SKU (add-ons and kits). Every claim here repeats what the pricing
 * page, the catalog in lib/addons.ts or the plan pages already promise: no
 * results, reviews or numbers that aren't ours. Mockups that show figures are
 * labelled "Sample data" or "Illustrative" where they render.
 */
import type { GlyphKey, SceneName } from '@/lib/strata'
import { ADDONS, KITS, lookup, type Kit } from '@/lib/addons'
import type { PhotoKey } from '@/lib/photos'
import type { PlatformKey } from '@/lib/platforms'

/** A headline with an optional italic accent run at the end. */
export type Head = { text: string; accent?: string }

export type Mock =
  | 'brandsite' | 'funnel' | 'dashboard' | 'site' | 'landing' | 'profile' | 'audit' | 'reviews'
  | 'tracking' | 'ads' | 'email' | 'blog' | 'clips' | 'brandsheet' | 'copy'

/** A floating card on a photo: a platform logo or a glyph, a label, an optional status. */
export type Chip = { logo?: PlatformKey; glyph?: GlyphKey; label: string; sub?: string }
export type Item = { glyph: GlyphKey; label: string; logos?: PlatformKey[] }
export type PhotoSlide = { kind: 'photo'; photo: PhotoKey; head: Head; chips: Chip[] }

export type Slide =
  | { kind: 'cover'; scene: SceneName; seed: number; eyebrow: string; head: Head; sub: string }
  | PhotoSlide
  | { kind: 'included'; head: Head; items: Item[] }
  | { kind: 'result'; mock: Mock; head: Head; caption: string }
  | { kind: 'steps'; head: Head; steps: { when: string; what: string }[] }
  | { kind: 'kit'; head: Head; kit: Kit }

export type Gallery = { label: string; slides: Slide[] }

const planSteps = (two: string, three: string) => [
  { when: 'Within 48 hours', what: 'Your onboarding call is booked' },
  { when: 'Week one', what: two },
  { when: 'Month one', what: three },
]

const oneTimeSteps = [
  { when: 'Today', what: 'Pay once. No recurring charges' },
  { when: 'Straight away', what: 'Your project opens in your client portal' },
  { when: 'Then', what: 'Send your requirements and we start' },
]

/* ── Monthly plans and Website in a Day ─────────────────────── */

const PLANS: Record<string, Gallery> = {
  hewn: {
    label: 'Hewn',
    slides: [
      { kind: 'cover', scene: 'valley', seed: 21, eyebrow: 'Hewn · monthly plan', head: { text: 'Your brand,', accent: 'built to last.' }, sub: 'Brand, website and local presence, shaped once and kept sharp every month.' },
      { kind: 'photo', photo: 'leatherArtisan', head: { text: 'A brand that looks', accent: 'as good as your work.' }, chips: [
        { glyph: 'brand', label: 'Logo and style guide', sub: 'Delivered' },
        { glyph: 'creative', label: 'Website', sub: 'Live' },
        { logo: 'googleMaps', label: 'Google Business Profile', sub: 'Optimized' },
      ] },
      { kind: 'included', head: { text: 'What’s', accent: 'included' }, items: [
        { glyph: 'strategy', label: 'Brand strategy and messaging' },
        { glyph: 'brand', label: 'Logo, visual identity and style guide' },
        { glyph: 'creative', label: 'Custom website, up to 5 pages' },
        { glyph: 'seo', label: 'SEO foundation' },
        { glyph: 'social', label: 'Google Business Profile and local listings', logos: ['googleMaps'] },
        { glyph: 'data', label: 'Monthly strategy call' },
      ] },
      { kind: 'result', mock: 'brandsite', head: { text: 'What you', accent: 'walk away with.' }, caption: 'A brand system, and a website built on it that turns visitors into calls.' },
      { kind: 'steps', head: { text: 'How it', accent: 'starts' }, steps: planSteps('Brand strategy and kickoff session', 'First deliverables live within 30 days') },
    ],
  },
  wrought: {
    label: 'Wrought',
    slides: [
      { kind: 'cover', scene: 'canyon', seed: 8, eyebrow: 'Wrought · monthly plan', head: { text: 'Your full', accent: 'marketing engine.' }, sub: 'Everything in Hewn, plus paid media, funnels, automation and a CRM that follows up for you.' },
      { kind: 'photo', photo: 'coastPhone', head: { text: 'Found, clicked,', accent: 'followed up.' }, chips: [
        { logo: 'googleAds', label: 'Search campaign', sub: 'Live' },
        { logo: 'meta', label: 'Retargeting', sub: 'Live' },
        { glyph: 'lifecycle', label: 'Follow-up email', sub: 'Sent automatically' },
      ] },
      { kind: 'included', head: { text: 'What’s', accent: 'included' }, items: [
        { glyph: 'brand', label: 'Everything in Hewn' },
        { glyph: 'media', label: 'Paid media on Google and Meta', logos: ['googleAds', 'meta'] },
        { glyph: 'creative', label: 'Sales funnels and landing pages' },
        { glyph: 'lifecycle', label: 'Marketing automation and nurture' },
        { glyph: 'data', label: 'CRM setup and pipeline' },
        { glyph: 'creators', label: 'Booking, onboarding and retention' },
      ] },
      { kind: 'result', mock: 'funnel', head: { text: 'Every lead,', accent: 'followed up.' }, caption: 'Ads bring them in, the page converts them, automation books them, and the CRM tracks every one.' },
      { kind: 'steps', head: { text: 'How it', accent: 'starts' }, steps: planSteps('Full audit and strategy session', 'Campaigns live within the first month') },
    ],
  },
  forged: {
    label: 'Forged',
    slides: [
      { kind: 'cover', scene: 'forge', seed: 5, eyebrow: 'Forged · monthly plan', head: { text: 'Your entire', accent: 'marketing team.' }, sub: 'All nine pillars, a fractional CMO, and weekly access to the people doing the work.' },
      { kind: 'photo', photo: 'teamMeeting', head: { text: 'A team', accent: 'in your corner.' }, chips: [
        { logo: 'slack', label: 'Slack access', sub: 'Monday to Friday' },
        { glyph: 'data', label: 'KPI dashboard', sub: 'Monthly' },
        { glyph: 'strategy', label: 'Growth plan', sub: 'Quarterly' },
      ] },
      { kind: 'included', head: { text: 'What’s', accent: 'included' }, items: [
        { glyph: 'media', label: 'Everything in Wrought' },
        { glyph: 'creators', label: 'Review generation and testimonials' },
        { glyph: 'social', label: 'UGC campaigns and a referral program' },
        { glyph: 'data', label: 'Monthly KPI dashboard' },
        { glyph: 'strategy', label: 'Quarterly growth planning' },
        { glyph: 'lifecycle', label: 'Weekly calls and Slack access, M–F' },
      ] },
      { kind: 'result', mock: 'dashboard', head: { text: 'Every dollar,', accent: 'accounted for.' }, caption: 'A live dashboard puts a verdict on every strategy: scale it, watch it, or cut it.' },
      { kind: 'steps', head: { text: 'How it', accent: 'starts' }, steps: planSteps('Full system audit and roadmap', 'All nine pillars activated') },
    ],
  },
  'website-in-a-day': {
    label: 'Website in a Day',
    slides: [
      { kind: 'cover', scene: 'amber', seed: 7, eyebrow: 'Website in a Day', head: { text: 'Your website.', accent: 'Live in 24 hours.' }, sub: 'Custom design and copy from your brief. Built, hosted and yours to keep.' },
      { kind: 'photo', photo: 'cafeOwner', head: { text: 'Open for business.', accent: 'Online, too.' }, chips: [
        { glyph: 'creative', label: 'Your website', sub: 'Live in 24 hours' },
        { glyph: 'lifecycle', label: 'Booking form', sub: 'On' },
        { logo: 'google', label: 'SEO-ready', sub: 'Built in' },
      ] },
      { kind: 'included', head: { text: 'What’s', accent: 'included' }, items: [
        { glyph: 'creative', label: 'Custom design for mobile and desktop' },
        { glyph: 'brand', label: 'Copy written from your brief' },
        { glyph: 'social', label: 'Hosted and connected to your domain' },
        { glyph: 'lifecycle', label: 'Contact or booking form' },
        { glyph: 'seo', label: 'SEO-ready technical foundation' },
      ] },
      { kind: 'result', mock: 'site', head: { text: 'Live on', accent: 'your domain.' }, caption: 'A real site on your own address, on every screen, ready for customers the next day.' },
      { kind: 'steps', head: { text: 'Three steps.', accent: 'One day.' }, steps: [
        { when: 'Today', what: 'Brief received. We start as soon as payment clears' },
        { when: 'Within 24 hours', what: 'Your site is live' },
        { when: 'Then', what: 'One round of edits, on us' },
      ] },
    ],
  },
}

/* ── One-time add-ons ───────────────────────────────────────── */

type AddOnCopy = { scene: SceneName; seed: number; head: Head; items: Item[]; mock: Mock; result: Head; caption: string; photo: Omit<PhotoSlide, 'kind'> }

const ADDON_COPY: Record<string, AddOnCopy> = {
  gbp: {
    scene: 'meadow', seed: 3, head: { text: 'Get found on', accent: 'Google Maps.' },
    items: [
      { glyph: 'seo', label: 'Categories and services set up', logos: ['googleMaps'] },
      { glyph: 'creative', label: 'Photos and description written' },
      { glyph: 'social', label: 'Your first posts published' },
      { glyph: 'data', label: 'Details matched across the main directories' },
    ],
    photo: { photo: 'cafeOwner', head: { text: 'When locals search,', accent: 'you show up.' }, chips: [
      { logo: 'googleMaps', label: 'Google Maps', sub: 'Profile complete' },
      { logo: 'google', label: 'Google Search', sub: 'Details matched' },
    ] },
    mock: 'profile', result: { text: 'A profile that', accent: 'gets the call.' }, caption: 'Complete, accurate and ready when locals search for what you do.',
  },
  visibility: {
    scene: 'survey', seed: 12, head: { text: 'See how you show up,', accent: 'everywhere.' },
    items: [
      { glyph: 'seo', label: 'Google search and Maps', logos: ['google', 'googleMaps'] },
      { glyph: 'strategy', label: 'ChatGPT and Gemini answers', logos: ['chatgpt', 'gemini'] },
      { glyph: 'data', label: 'Side by side with your competitors' },
      { glyph: 'brand', label: 'A ranked list of fixes' },
    ],
    photo: { photo: 'coastPhone', head: { text: 'See where', accent: 'they find you.' }, chips: [
      { logo: 'google', label: 'Google Search' }, { logo: 'googleMaps', label: 'Google Maps' },
      { logo: 'chatgpt', label: 'ChatGPT' }, { logo: 'gemini', label: 'Gemini' },
    ] },
    mock: 'audit', result: { text: 'Know exactly', accent: 'what to fix.' }, caption: 'Where you stand on each channel, and the fixes ranked by what moves you most.',
  },
  reviews: {
    scene: 'harvest', seed: 9, head: { text: 'More reviews,', accent: 'on autopilot.' },
    items: [
      { glyph: 'lifecycle', label: 'Automatic requests by text and email after each job' },
      { glyph: 'brand', label: 'A QR card for your counter' },
      { glyph: 'creators', label: 'Reply templates for every kind of review' },
    ],
    photo: { photo: 'baristas', head: { text: 'Every great job,', accent: 'a review request.' }, chips: [
      { logo: 'google', label: 'Google review', sub: 'Request sent' },
      { glyph: 'lifecycle', label: 'Text and email', sub: 'After each job' },
    ] },
    mock: 'reviews', result: { text: 'Every happy customer,', accent: 'asked.' }, caption: 'The request goes out after each job without anyone remembering to send it.',
  },
  ads_audit: {
    scene: 'topo', seed: 14, head: { text: 'Stop paying for', accent: 'ads that don’t work.' },
    items: [
      { glyph: 'media', label: 'Google Ads account reviewed', logos: ['googleAds'] },
      { glyph: 'social', label: 'Meta Ads account reviewed', logos: ['meta'] },
      { glyph: 'strategy', label: 'Wasted spend found' },
      { glyph: 'data', label: 'Conversion tracking fixed' },
    ],
    photo: { photo: 'teamMeeting', head: { text: 'Know what your ads', accent: 'really bring in.' }, chips: [
      { logo: 'googleAds', label: 'Google Ads', sub: 'Audited' },
      { logo: 'meta', label: 'Meta Ads', sub: 'Audited' },
      { glyph: 'data', label: 'Conversion tracking', sub: 'Fixed' },
    ] },
    mock: 'tracking', result: { text: 'See which ads', accent: 'bring customers.' }, caption: 'Tracking that follows each click through to a lead, so spend goes where it works.',
  },
  creatives: {
    scene: 'canyon', seed: 22, head: { text: 'Eight ads,', accent: 'ready to run.' },
    items: [
      { glyph: 'creative', label: '8 ad creatives' },
      { glyph: 'media', label: 'Static or motion' },
      { glyph: 'social', label: 'Sized for any platform', logos: ['instagram', 'facebook', 'tiktok'] },
    ],
    photo: { photo: 'creator', head: { text: 'Made for', accent: 'every feed.' }, chips: [
      { logo: 'instagram', label: 'Instagram', sub: 'Feed and Stories' },
      { logo: 'facebook', label: 'Facebook', sub: 'Feed' },
      { logo: 'tiktok', label: 'TikTok', sub: 'In-feed' },
    ] },
    mock: 'ads', result: { text: 'Every size,', accent: 'every feed.' }, caption: 'Square, portrait and story formats, so every placement gets an ad made for it.',
  },
  landing: {
    scene: 'amber', seed: 31, head: { text: 'A page built', accent: 'to convert.' },
    items: [
      { glyph: 'creative', label: 'One focused page for an ad or offer' },
      { glyph: 'brand', label: 'Designed and written for you' },
      { glyph: 'strategy', label: 'Live within 24 hours of your brief' },
    ],
    photo: { photo: 'coastPhone', head: { text: 'From the ad', accent: 'to the call.' }, chips: [
      { logo: 'googleAds', label: 'From Google Ads' },
      { logo: 'meta', label: 'From Meta' },
      { glyph: 'creative', label: 'Your page', sub: 'Live in 24 hours' },
    ] },
    mock: 'landing', result: { text: 'One page.', accent: 'One job.' }, caption: 'A single offer, a clear call to action, and nothing to distract from it.',
  },
  email: {
    scene: 'highland', seed: 4, head: { text: 'Follow-up that', accent: 'never forgets.' },
    items: [
      { glyph: 'lifecycle', label: 'A 6-email sequence' },
      { glyph: 'strategy', label: 'Welcome, nurture or sales' },
      { glyph: 'brand', label: 'Written for your business' },
      { glyph: 'data', label: 'Built in your email tool' },
    ],
    photo: { photo: 'baristas', head: { text: 'Stay in touch', accent: 'while you work.' }, chips: [
      { logo: 'gmail', label: 'Email 3 of 6', sub: 'Sent' },
      { glyph: 'lifecycle', label: 'Your sequence', sub: 'Always on' },
    ] },
    mock: 'email', result: { text: 'Six emails,', accent: 'always on.' }, caption: 'Every new lead gets the same well-timed follow-up, without you lifting a finger.',
  },
  blog: {
    scene: 'valley', seed: 40, head: { text: 'Content that', accent: 'gets found.' },
    items: [
      { glyph: 'brand', label: '4 blog posts' },
      { glyph: 'creative', label: '1,200 to 1,500 words each' },
      { glyph: 'seo', label: 'Keyword-researched', logos: ['google'] },
      { glyph: 'social', label: 'Ready to publish' },
    ],
    photo: { photo: 'woodCarving', head: { text: 'Answers to what', accent: 'customers search.' }, chips: [
      { logo: 'google', label: 'Google Search', sub: 'Keyword-researched' },
      { glyph: 'brand', label: '4 posts', sub: 'Ready to publish' },
    ] },
    mock: 'blog', result: { text: 'Four posts,', accent: 'ready to publish.' }, caption: 'Each one written around what your customers already search for.',
  },
  video: {
    scene: 'night', seed: 6, head: { text: 'One video.', accent: 'Ten clips.' },
    items: [
      { glyph: 'creative', label: '10 short clips from one video' },
      { glyph: 'brand', label: 'Captioned' },
      { glyph: 'social', label: 'For Reels, TikTok and Shorts', logos: ['instagram', 'tiktok', 'youtubeShorts'] },
    ],
    photo: { photo: 'creator', head: { text: 'Film once.', accent: 'Post all week.' }, chips: [
      { logo: 'instagram', label: 'Reels' }, { logo: 'tiktok', label: 'TikTok' }, { logo: 'youtubeShorts', label: 'Shorts' },
    ] },
    mock: 'clips', result: { text: 'A week of posts', accent: 'from one shoot.' }, caption: 'Vertical, captioned and cut for the feeds your customers scroll.',
  },
  brand: {
    scene: 'woodgrain', seed: 2, head: { text: 'A look that', accent: 'matches your work.' },
    items: [
      { glyph: 'brand', label: 'Logo refreshed' },
      { glyph: 'creative', label: 'Colors and type' },
      { glyph: 'strategy', label: 'A style guide' },
      { glyph: 'social', label: 'Ready-to-use files' },
    ],
    photo: { photo: 'clayHands', head: { text: 'Shaped to fit', accent: 'your business.' }, chips: [
      { glyph: 'brand', label: 'Logo', sub: 'Refreshed' },
      { glyph: 'creative', label: 'Colors and type' },
      { glyph: 'strategy', label: 'Style guide', sub: 'With files' },
    ] },
    mock: 'brandsheet', result: { text: 'Your brand,', accent: 'in one place.' }, caption: 'Logo, colors and type with a guide, so everything you make looks like you.',
  },
  copy: {
    scene: 'highland', seed: 19, head: { text: 'Words that turn', accent: 'visitors into calls.' },
    items: [
      { glyph: 'brand', label: 'Five pages written' },
      { glyph: 'strategy', label: 'Structured to lead to a call' },
      { glyph: 'seo', label: 'Optimized for search' },
    ],
    photo: { photo: 'leatherArtisan', head: { text: 'Every word', accent: 'doing a job.' }, chips: [
      { glyph: 'brand', label: 'Five pages', sub: 'Written' },
      { logo: 'google', label: 'Search-optimized' },
    ] },
    mock: 'copy', result: { text: 'Five pages,', accent: 'one clear story.' }, caption: 'Each page knows its job and points the reader to the next step.',
  },
}

const KIT_SCENES: Record<string, [SceneName, number]> = {
  kit_found: ['meadow', 17], kit_ads: ['canyon', 3], kit_content: ['highland', 27], kit_brand: ['woodgrain', 9],
}

function addOnGallery(sku: string): Gallery | null {
  const a = ADDONS.find(x => x.sku === sku)
  const c = ADDON_COPY[sku]
  if (!a || !c) return null
  return {
    label: a.name,
    slides: [
      { kind: 'cover', scene: c.scene, seed: c.seed, eyebrow: a.name, head: c.head, sub: a.detail },
      { kind: 'photo', ...c.photo },
      { kind: 'included', head: { text: 'What’s', accent: 'included' }, items: c.items },
      { kind: 'result', mock: c.mock, head: c.result, caption: c.caption },
      { kind: 'steps', head: { text: 'How it', accent: 'works' }, steps: oneTimeSteps },
    ],
  }
}

function kitGallery(sku: string): Gallery | null {
  const k = KITS.find(x => x.sku === sku)
  if (!k) return null
  const [scene, seed] = KIT_SCENES[sku] ?? ['valley', 1]
  const parts = k.includes.map(s => ADDON_COPY[s]).filter(Boolean)
  return {
    label: k.name,
    slides: [
      { kind: 'cover', scene, seed, eyebrow: k.name, head: splitHead(k.pitch), sub: `${k.includes.map(s => lookup(s)?.name).join(', ')}, together for less.` },
      { kind: 'photo', ...parts[0].photo },
      { kind: 'kit', head: { text: 'Everything in', accent: 'the kit' }, kit: k },
      ...parts.map((p): Slide => ({ kind: 'result', mock: p.mock, head: p.result, caption: p.caption })),
      { kind: 'steps', head: { text: 'How it', accent: 'works' }, steps: oneTimeSteps },
    ],
  }
}

/** Turn a pitch sentence into a headline, accenting its last two words. */
function splitHead(s: string): Head {
  const words = s.replace(/\.$/, '').split(' ')
  return { text: words.slice(0, -2).join(' '), accent: words.slice(-2).join(' ') + '.' }
}

/** The gallery for a checkout: a plan tier, or the SKUs in an à la carte cart. */
export function galleryFor(tier: string, skus: string[]): Slide[] {
  if (PLANS[tier]) return PLANS[tier].slides
  if (skus.length === 1) return (kitGallery(skus[0]) ?? addOnGallery(skus[0]))?.slides ?? []
  // Several items: each one's cover, then how it works.
  const covers = skus.map(s => (kitGallery(s) ?? addOnGallery(s))?.slides[0]).filter((x): x is Slide => !!x)
  return covers.length ? [...covers, { kind: 'steps', head: { text: 'How it', accent: 'works' }, steps: oneTimeSteps }] : []
}
