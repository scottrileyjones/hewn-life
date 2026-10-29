import type { GlyphKey, SceneName } from './strata'
import type { PhotoKey } from './photos'

/**
 * Who we serve: one entry per tab on /who-we-serve. `id` doubles as the URL
 * hash, so /who-we-serve#ecommerce opens that tab.
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
    id: 'ecommerce',
    tab: 'E-commerce & DTC',
    glyph: 'media',
    eyebrow: 'Shopify and DTC brands, makers and online stores',
    title: 'More orders,',
    accent: 'not just more traffic.',
    intro: 'We build the store, the creative and the email engine together, so every visitor has a reason to buy now and a reason to come back.',
    build: [
      'Shopify storefronts and product pages built to convert',
      'Paid social and Google Shopping, tested every week',
      'UGC and AI creative: 20–40 ad variations a week',
      'Email and SMS flows: welcome, abandoned cart, win-back',
      'Reviews, bundles and subscriptions that lift order value',
      'A live dashboard for cost per order, return on ad spend and repeat rate',
    ],
    why: [
      { title: 'Creative is the lever', body: 'On Meta and TikTok the ad does the targeting. We ship enough of it to find winners fast.' },
      { title: 'Profit, not vanity', body: 'We report on margin and repeat purchases, not clicks and likes.' },
      { title: 'Revenue you own', body: 'Email and SMS turn one-time buyers into a list no algorithm can take away.' },
    ],
    visual: { photo: 'leatherArtisan' },
    cta: { label: 'Grow my store' },
  },
  {
    id: 'local',
    tab: 'Local businesses',
    glyph: 'seo',
    eyebrow: 'Restaurants, cafés, home services, salons and retail',
    title: 'Be the first name',
    accent: 'people find nearby.',
    intro: 'When someone searches for what you do near them, you should be the obvious pick: on Google, on maps, in AI answers and in their inbox.',
    build: [
      'A fast website with booking, ordering or quote requests',
      'Google Business Profile and local SEO',
      'Local ads on Google and Meta, tied to calls and bookings',
      'Reviews collected after every visit or job',
      'Email and SMS that bring regulars back',
    ],
    why: [
      { title: 'Found nearby', body: 'Maps, search and AI answers, all pointing at you.' },
      { title: 'Measured on customers', body: 'We track calls, bookings and orders, not likes.' },
      { title: 'Owner-friendly', body: 'One team, one monthly fee and reporting in plain English.' },
    ],
    visual: { photo: 'cafeOwner' },
    cta: { label: 'Grow my local business' },
  },
  {
    id: 'startups',
    tab: 'Startups',
    glyph: 'strategy',
    eyebrow: 'Founders launching, raising and scaling',
    title: 'Look fundable',
    accent: 'before the first meeting.',
    intro: 'Investors judge the deck and the website in minutes. We make both sharp, fast, so your story lands and your product looks as real as it is.',
    build: [
      'Pitch deck design and narrative',
      'A pitch-ready product website, live in a day',
      'Demo, product and team pages that show traction',
      'Investor update and data-room landing pages',
      'Launch creative for the announcement',
      'Go-to-market from day one: ads, email and a dashboard',
    ],
    why: [
      { title: 'Speed when it matters', body: 'A website in a day and a deck in days, not a six-week agency cycle.' },
      { title: 'Story, not slides', body: 'Senior strategists shape the narrative before anyone opens a design tool.' },
      { title: 'Grows with you', body: 'After the raise, the same team runs your go-to-market.' },
    ],
    visual: { scene: 'forge', seed: 31 },
    cta: { label: 'Start with a website in a day', href: '/website-in-a-day' },
  },  {
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
  },  {
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
  },  {
    id: 'any',
    tab: 'Any industry',
    glyph: 'media',
    eyebrow: 'B2B, professional services, nonprofits and more',
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
    visual: { photo: 'teamMeeting' },
    cta: { label: 'Book a discovery call' },
  },]
