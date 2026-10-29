import type { GlyphKey, SceneName } from './strata'
import type { PhotoKey } from './photos'

/**
 * Who we serve: one entry per tab on /who-we-serve. `id` doubles as the URL
 * hash, so /who-we-serve#healthcare opens that tab.
 */
export interface Audience {
  id: string
  tab: string
  glyph: GlyphKey
  eyebrow: string
  title: string
  accent: string
  intro: string
  build: string[]
  why: { title: string; body: string }[]
  stat?: { value: string; label: string }
  visual: { photo: PhotoKey } | { scene: SceneName; seed: number }
  cta: { label: string; href?: string }
}

export const audiences: Audience[] = [
  {
    id: 'healthcare',
    tab: 'Healthcare',
    glyph: 'data',
    eyebrow: 'Clinics, practices, med spas and telehealth',
    title: 'Healthcare marketing,',
    accent: 'done with care.',
    intro: 'We have marketed healthcare for 30 years. We know what you can say, where you can say it, and how to grow patient volume without putting your practice at risk.',
    build: [
      'Patient-acquisition websites with compliant intake and booking',
      'HIPAA-aware tracking: no health data in ad pixels, server-side conversions',
      'Paid media written to Meta and Google health-ad policies',
      'Provider and service pages built for local and AI search',
      'Reviews, reputation and referral programs',
      'Lifecycle email and SMS that respect patient privacy',
    ],
    why: [
      { title: '30 years in healthcare', body: 'Three decades of marketing healthcare, from single practices to multi-location groups.' },
      { title: 'Compliance up front', body: 'Every ad, form and tag is checked against privacy and platform rules before it ships.' },
      { title: 'Measured on patients', body: 'The dashboard tracks booked appointments, not clicks.' },
    ],
    stat: { value: '30 yrs', label: 'marketing healthcare' },
    visual: { scene: 'highland', seed: 23 },
    cta: { label: 'Talk healthcare growth' },
  },
  {
    id: 'creators',
    tab: 'Creators & influencers',
    glyph: 'creators',
    eyebrow: 'Influencers, experts and personal brands',
    title: 'Your name is the brand.',
    accent: 'We make it look like it.',
    intro: 'A home on the web you own, and the creative to keep every channel fed: ads, posts, reels and the pages that turn followers into customers.',
    build: [
      'Personal sites and link-in-bio hubs on your own domain',
      'Ad creative, posts and short-form reels, every week',
      'Media kits and rate cards that win brand deals',
      'Launch pages for products, courses and merch',
      'Email lists you own, so the algorithm can’t take your audience',
    ],
    why: [
      { title: 'Taste first', body: 'Artists and editors lead the look; AI handles the volume and the versions.' },
      { title: '20–40 assets a week', body: 'Enough creative to test hooks and keep every platform fresh.' },
      { title: 'Built to convert', body: 'Every page and post points at a product, a list or a booking.' },
    ],
    visual: { photo: 'creator' },
    cta: { label: 'Build my creator stack' },
  },
  {
    id: 'startups',
    tab: 'Startups raising capital',
    glyph: 'strategy',
    eyebrow: 'Founders getting ready to raise',
    title: 'Look fundable',
    accent: 'before the first meeting.',
    intro: 'Investors judge the deck and the website in minutes. We make both sharp, fast, so your story lands and your product looks as real as it is.',
    build: [
      'Pitch deck design and narrative',
      'A pitch-ready product website, live in a day',
      'Demo, product and team pages that show traction',
      'Investor update and data-room landing pages',
      'Launch creative for the announcement',
    ],
    why: [
      { title: 'Speed when it matters', body: 'A website in a day and a deck in days, not a six-week agency cycle.' },
      { title: 'Story, not slides', body: 'Senior strategists shape the narrative before anyone opens a design tool.' },
      { title: 'Grows with you', body: 'After the raise, the same team runs your go-to-market.' },
    ],
    visual: { scene: 'forge', seed: 31 },
    cta: { label: 'Start with a website in a day', href: '/website-in-a-day' },
  },
  {
    id: 'investors',
    tab: 'Investors & consultants',
    glyph: 'brand',
    eyebrow: 'VC, private equity, advisory and consulting firms',
    title: 'Firms that sell judgment',
    accent: 'need to look the part.',
    intro: 'Beautifully designed websites, decks and thought leadership for venture, private equity and consulting firms, and the marketing support your portfolio companies need after the deal.',
    build: [
      'Firm websites and portfolio showcases',
      'Fund decks, LP materials and pitch books',
      'Thought-leadership content and newsletters',
      'Partner and team pages that build trust',
      'Growth support for portfolio companies',
    ],
    why: [
      { title: 'Design that signals quality', body: 'The same craft we bring to brands, applied to institutional audiences.' },
      { title: 'Discreet and fast', body: 'Senior people on every engagement, with turnarounds that fit a deal timeline.' },
      { title: 'Portfolio leverage', body: 'One partner to raise the marketing floor across your companies.' },
    ],
    visual: { scene: 'canyon', seed: 44 },
    cta: { label: 'Talk to us about your firm' },
  },
  {
    id: 'any',
    tab: 'Any industry',
    glyph: 'media',
    eyebrow: 'Home services, hospitality, retail and professional services',
    title: 'If customers buy from you,',
    accent: 'we can grow it.',
    intro: 'The nine pillars work for any business with a product and a customer: a full growth team for the price of one hire, measured on revenue.',
    build: [
      'Websites and brand that earn trust',
      'Paid media and AI creative, tested weekly',
      'SEO and AI-search visibility',
      'Lifecycle, CRM and referral programs',
      'A live dashboard that grades every dollar',
    ],
    why: [
      { title: 'A full agency', body: 'Everything a $20,000-a-month agency delivers, from $2,500 a month.' },
      { title: 'No long contracts', body: 'Monthly plans; we earn the next month by delivering this one.' },
      { title: 'Start small', body: 'Not ready for a plan? Start with a website in a day for $999.' },
    ],
    visual: { photo: 'cafeOwner' },
    cta: { label: 'Book a discovery call' },
  },
]
