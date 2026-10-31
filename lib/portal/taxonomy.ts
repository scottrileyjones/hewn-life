/**
 * How a client's brand assets are organized: the website, then the nine
 * growth-engine pillars, each with its asset types. An asset's category is
 * stored as "Pillar · Type" (e.g. "Paid media · Ads").
 */
import type { GlyphKey } from '@/lib/strata'

export type AssetType = { id: string; name: string; hint: string }
export type PillarGroup = { key: string; name: string; glyph: GlyphKey | null; types: AssetType[] }

const t = (pillar: string, name: string, hint: string): AssetType => ({ id: `${pillar} · ${name}`, name, hint })

export const PILLARS: PillarGroup[] = [
  { key: 'website', name: 'Website', glyph: null, types: [
    t('Website', 'Pages & copy', 'Page copy, headlines and messaging for your site.'),
    t('Website', 'Design', 'Mockups, page designs and site screenshots.'),
    t('Website', 'Domain & access', 'Domain, hosting and login details.'),
  ] },
  { key: 'brand', name: 'Brand', glyph: 'brand', types: [
    t('Brand', 'Brand guide', 'Your brand guide: colors, type, voice and logo rules.'),
    t('Brand', 'Logos', 'Logo files and brand marks, every version.'),
    t('Brand', 'Colors & type', 'Palettes, fonts and style references.'),
    t('Brand', 'Voice & messaging', 'Tagline, positioning, tone and key messages.'),
  ] },
  { key: 'strategy', name: 'Strategy', glyph: 'strategy', types: [
    t('Strategy', 'Plans & roadmaps', 'Growth plans, roadmaps and briefs.'),
    t('Strategy', 'Research', 'Competitor, customer and market research.'),
  ] },
  { key: 'media', name: 'Paid media', glyph: 'media', types: [
    t('Paid media', 'Ads', 'Ad creative and ad copy, by campaign.'),
    t('Paid media', 'Landing pages', 'Landing page links and drafts.'),
    t('Paid media', 'Audiences & offers', 'Targeting, offers and promotions.'),
  ] },
  { key: 'creative', name: 'Creative', glyph: 'creative', types: [
    t('Creative', 'Photos', 'Photos of your work, team, products or place.'),
    t('Creative', 'Video', 'Brand video and edits. Big files: share a link.'),
    t('Creative', 'Graphics', 'Statics, graphics and design files.'),
  ] },
  { key: 'seo', name: 'SEO + AI search', glyph: 'seo', types: [
    t('SEO + AI search', 'Keywords', 'Target keywords and search terms.'),
    t('SEO + AI search', 'Articles', 'Blog posts, guides and FAQ content.'),
    t('SEO + AI search', 'Local listings', 'Google Business Profile and directory listings.'),
  ] },
  { key: 'creators', name: 'Creators & UGC', glyph: 'creators', types: [
    t('Creators & UGC', 'UGC & video', 'Customer videos and creator content. Big files: share a link.'),
    t('Creators & UGC', 'Reviews & testimonials', 'Reviews, quotes and case stories.'),
    t('Creators & UGC', 'Creator briefs', 'Briefs and partner details.'),
  ] },
  { key: 'lifecycle', name: 'Email & CRM', glyph: 'lifecycle', types: [
    t('Email & CRM', 'Emails', 'Email campaigns and newsletters.'),
    t('Email & CRM', 'Automations', 'Flows, sequences and SMS.'),
  ] },
  { key: 'data', name: 'Data & reports', glyph: 'data', types: [
    t('Data & reports', 'Reports', 'Monthly reports and results.'),
    t('Data & reports', 'Dashboards & tracking', 'Dashboards, pixels and tracking plans.'),
  ] },
  { key: 'social', name: 'Social', glyph: 'social', types: [
    t('Social', 'Posts', 'Social posts and captions.'),
    t('Social', 'Content calendar', 'Content plans and schedules.'),
  ] },
  { key: 'other', name: 'Other', glyph: null, types: [t('Other', 'Files', 'Anything else.')] },
]

export const TYPES = PILLARS.flatMap(p => p.types)
export const TYPE_IDS = TYPES.map(x => x.id)
export const pillarOf = (category: string) => PILLARS.find(p => p.types.some(x => x.id === category)) ?? PILLARS[PILLARS.length - 1]
export const typeOf = (category: string) => TYPES.find(x => x.id === category) ?? TYPES[TYPES.length - 1]

/** Categories from the first version of the library, mapped into the pillar structure. */
const LEGACY: Record<string, string> = {
  'Brand guide': 'Brand · Brand guide', 'Logos & brand': 'Brand · Logos', Photos: 'Creative · Photos', 'UGC & video': 'Creators & UGC · UGC & video',
  Ads: 'Paid media · Ads', Copy: 'Website · Pages & copy', 'Landing pages': 'Paid media · Landing pages', 'Keywords & SEO': 'SEO + AI search · Keywords',
  Social: 'Social · Posts', Email: 'Email & CRM · Emails', Reports: 'Data & reports · Reports', Other: 'Other · Files',
}
export const normalizeCategory = (raw: string) => (TYPE_IDS.includes(raw) ? raw : LEGACY[raw] ?? 'Other · Files')
