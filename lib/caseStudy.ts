/**
 * The telehealth case study. Anonymous by design: no brand, people or
 * product names. Every figure here must be true and something we can back up.
 * A metric with `value: null` isn't shown; fill it in when we have the real number.
 */
import type { GlyphKey } from './strata'

export const outcomes = [
  { value: '$0 → $10M', label: 'annual revenue, in under two years' },
  { value: 'Nationwide', label: 'patients served across the US' },
  { value: 'Seed', label: 'multi-million-dollar round raised' },
  { value: 'Acquired', label: 'the business was acquired' },
]

export const summary = {
  situation: 'A new direct-to-consumer telehealth company had a clinical offering ready to launch. It had no brand, no website, no customers and no marketing team.',
  complication: 'Healthcare is one of the hardest categories to market. Ad platforms restrict health advertising, every claim needs review, and acquisition costs climb fast without owned demand. Every growth function had to be built at once, by a small team, before the money ran out.',
  resolution: 'We designed and ran the entire growth stack as one system, on one scorecard: brand, website, paid media, creator content, search, CRM, lifecycle, analytics and the investor story.',
}

export type Layer = { name: string; tagline: string; items: { name: string; glyph: GlyphKey; what: string }[] }

/** The growth stack, bottom (foundation) to top. */
export const stack: Layer[] = [
  {
    name: 'Foundation', tagline: 'What everything else stands on',
    items: [
      { name: 'Brand strategy & guide', glyph: 'brand', what: 'Positioning, voice, visual identity and a full brand guide.' },
      { name: 'Copy & messaging', glyph: 'creative', what: 'The core story and claims language, written for a regulated category.' },
      { name: 'Website', glyph: 'seo', what: 'A conversion-led site, built to launch fast and change weekly.' },
    ],
  },
  {
    name: 'Acquisition', tagline: 'How new patients found the brand',
    items: [
      { name: 'Paid media', glyph: 'media', what: 'Paid social and search, run on a weekly testing cadence.' },
      { name: 'UGC & creators', glyph: 'creators', what: 'A creator program feeding a steady stream of authentic ad content.' },
      { name: 'SEO', glyph: 'seo', what: 'Content and technical SEO to build demand the brand owned.' },
      { name: 'AEO', glyph: 'data', what: 'Content structured to be cited by AI search and answer engines.' },
    ],
  },
  {
    name: 'Conversion', tagline: 'How visitors became patients',
    items: [
      { name: 'Landing pages', glyph: 'creative', what: 'Dedicated pages per audience, offer and channel, tested continuously.' },
      { name: 'Funnel optimization', glyph: 'strategy', what: 'Intake and checkout tuned to cut drop-off at every step.' },
    ],
  },
  {
    name: 'Retention', tagline: 'How patients stayed',
    items: [
      { name: 'CRM', glyph: 'lifecycle', what: 'The CRM and data model underneath every patient touchpoint.' },
      { name: 'Email & SMS lifecycle', glyph: 'lifecycle', what: 'Onboarding, adherence and win-back flows.' },
    ],
  },
  {
    name: 'Intelligence & capital', tagline: 'How the business proved itself',
    items: [
      { name: 'Analytics & attribution', glyph: 'data', what: 'One scorecard tying spend to revenue by channel.' },
      { name: 'Investor story & seed deck', glyph: 'strategy', what: 'The narrative, deck and brand behind the seed round.' },
    ],
  },
]

export const phases = [
  { name: 'Foundation', when: 'Before launch', goal: 'Build the brand, the site and the tracking before spending a dollar on ads.' },
  { name: 'Launch & learn', when: 'First months', goal: 'Find the first profitable channel and the messages that convert.' },
  { name: 'Scale', when: 'Growth phase', goal: 'Pour fuel on what works and build owned demand so CAC holds as spend grows.' },
  { name: 'Capital & exit', when: 'Run-up to $10M', goal: 'Prove the model with clean numbers, raise the seed round, get acquisition-ready.' },
]

/** Which phases each workstream ran in (0-based, inclusive). */
export const workstreams: { name: string; from: number; to: number }[] = [
  { name: 'Brand & copy', from: 0, to: 3 },
  { name: 'Website & landing pages', from: 0, to: 3 },
  { name: 'Analytics & attribution', from: 0, to: 3 },
  { name: 'Paid media', from: 1, to: 3 },
  { name: 'UGC & creators', from: 1, to: 3 },
  { name: 'CRM & lifecycle', from: 1, to: 3 },
  { name: 'SEO & AEO', from: 2, to: 3 },
  { name: 'Investor story', from: 3, to: 3 },
]

export const principles = [
  { title: 'One scorecard', body: 'Every channel reported against the same numbers: cost to acquire a patient, conversion rate and revenue per patient.' },
  { title: 'Test every week', body: 'New creative, landing pages and offers went live weekly. Budget followed the winners.' },
  { title: 'Compliance built in', body: 'Claims and creative were reviewed inside the production process, not bolted on after.' },
  { title: 'Owned demand', body: 'Search, AI-search content, CRM and lifecycle grew revenue the brand didn’t have to rent from ad platforms.' },
]

/** Hard numbers, shown only once we have the real figure. */
export const metrics: { label: string; value: string | null; note?: string }[] = [
  { label: 'Blended ROAS', value: null },
  { label: 'Customer acquisition cost', value: null },
  { label: 'Monthly ad spend managed', value: null },
  { label: 'UGC creators / videos produced', value: null },
  { label: 'Organic traffic growth', value: null },
  { label: 'Email & SMS share of revenue', value: null },
]
