/**
 * Checkout galleries: the swipeable slides at the top of the order summary.
 *
 * One gallery per plan, add-on and kit, keyed by the checkout `tier` (plans) or
 * the catalog SKU (add-ons and kits). Every claim here repeats what the pricing
 * page or the catalog in lib/addons.ts already promises: no results, reviews or
 * numbers that aren't ours. Mockups use example content and say so on the slide.
 *
 * Headlines mark highlighted words with [brackets]; they render in a pill.
 */
import type { PhotoKey } from '@/lib/photos'
import type { PlatformKey } from '@/lib/platforms'
import type { LineIconName } from '@/components/checkout/LineIcon'

export type Feature = { icon: LineIconName; title: string; text: string }
/** The frosted card floating over a hero photo (the brand's data-meets-image move). */
export type Glass = { logo?: PlatformKey; icon?: LineIconName; label: string; sub: string }
export type Result = 'wrought' | 'website'

export type Slide =
  | { kind: 'hero'; photo: PhotoKey; tag: string; head: string; sub: string; glass?: Glass }
  | { kind: 'features'; head: string; items: Feature[]; note?: string }
  | { kind: 'platforms'; head: string; sub: string; logos: PlatformKey[] }
  | { kind: 'result'; head: string; result: Result }
  | { kind: 'steps'; head: string; steps: { when: string; what: string }[] }

const planSteps = (two: string, three: string) => [
  { when: 'Within 48 hours', what: 'Your onboarding call is booked' },
  { when: 'Week one', what: two },
  { when: 'Month one', what: three },
]

const GALLERIES: Record<string, Slide[]> = {
  wrought: [
    { kind: 'hero', photo: 'coastPhone', tag: 'Wrought · monthly plan', head: 'Your full [marketing] [engine].', sub: 'Everything in Hewn, plus paid media, funnels, automation and a CRM.', glass: { logo: 'googleAds', label: 'Search campaign', sub: 'Live' } },
    { kind: 'features', head: 'What’s [included]', note: 'Plus everything in Hewn: brand, website, SEO and local listings.', items: [
      { icon: 'megaphone', title: 'Paid media', text: 'Google and Meta campaigns, managed for you.' },
      { icon: 'layout', title: 'Sales funnels', text: 'Landing pages, offers and conversion paths.' },
      { icon: 'mail', title: 'Automation', text: 'Nurture sequences that follow up for you.' },
      { icon: 'pipeline', title: 'CRM setup', text: 'Your pipeline and sales process, connected.' },
    ] },
    { kind: 'platforms', head: 'Running where your [customers] are.', sub: 'We build and manage your campaigns inside the platforms you already know.', logos: ['googleAds', 'meta', 'instagram', 'facebook'] },
    { kind: 'result', head: 'From first click to [booked].', result: 'wrought' },
    { kind: 'steps', head: 'How it [starts]', steps: planSteps('Full audit and strategy session', 'Campaigns live within the first month') },
  ],
  'website-in-a-day': [
    { kind: 'hero', photo: 'cafeOwner', tag: 'Website in a Day', head: 'Your website, [live] in [24 hours].', sub: 'Custom design and copy from your brief. Built, hosted and yours to keep.', glass: { icon: 'globe', label: 'yourbusiness.com', sub: 'Live in 24 hours' } },
    { kind: 'features', head: 'What’s [included]', note: 'Plus an SEO-ready technical foundation.', items: [
      { icon: 'layout', title: 'Custom design', text: 'Made from your brief, for mobile and desktop.' },
      { icon: 'pen', title: 'Copy written for you', text: 'Every word written from your brief.' },
      { icon: 'globe', title: 'Hosted on your domain', text: 'Built, hosted and connected for you.' },
      { icon: 'calendar', title: 'Contact or booking form', text: 'Customers reach you straight from the site.' },
    ] },
    { kind: 'result', head: 'A real site, on [every] screen.', result: 'website' },
    { kind: 'steps', head: 'Three steps. [One day.]', steps: [
      { when: 'Today', what: 'Brief received. We start when payment clears' },
      { when: 'Within 24 hours', what: 'Your site is live' },
      { when: 'Then', what: 'One round of edits, on us' },
    ] },
  ],
}

/** The gallery for a checkout: a plan tier, or the SKUs in an à la carte cart. */
export function galleryFor(tier: string, skus: string[]): Slide[] {
  if (GALLERIES[tier]) return GALLERIES[tier]
  if (skus.length === 1 && GALLERIES[skus[0]]) return GALLERIES[skus[0]]
  return []
}
