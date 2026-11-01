/**
 * Onboarding plans for each package: the steps a new client moves through, in
 * order, grouped into five phases shown as the portal's progress tracker. Some
 * steps are ours (we sign them off); some are the client's (they submit a form
 * or files, then we sign them off once we've checked it).
 */
import { primaryActions } from '@/lib/intake'
import { CAL_URL } from '@/lib/cal'
import type { PlanId } from '@/lib/playbook'
import { isKit, lookup } from '@/lib/addons'

export const PHASES = [
  { id: 'received', label: 'Order received' },
  { id: 'kickoff', label: 'Getting to know you' },
  { id: 'building', label: 'Building' },
  { id: 'review', label: 'Your review' },
  { id: 'live', label: 'Live' },
] as const
export type PhaseId = typeof PHASES[number]['id']

export type StepField = {
  id: string
  label: string
  type: 'text' | 'textarea' | 'url' | 'email' | 'tel' | 'select'
  required?: boolean
  options?: string[]
  placeholder?: string
}

export type Step = {
  id: string
  title: string
  /** What the client sees under the title. */
  detail: string
  owner: 'hewn' | 'client'
  phase: PhaseId
  fields?: StepField[]
  /** Client can upload files on this step. */
  uploads?: { label: string; help: string }
  /** A client step done outside the portal, e.g. booking a call; we sign it off. */
  action?: { label: string; href: string }
}

export const PACKAGES: { id: PlanId; name: string }[] = [
  { id: 'website-in-a-day', name: 'Website in a Day' },
  { id: 'hewn', name: 'Hewn' },
  { id: 'wrought', name: 'Wrought' },
  { id: 'forged', name: 'Forged' },
]

const S: Record<string, Step> = {
  order: { id: 'order', title: 'Order received', detail: 'Your order came through and your project is set up.', owner: 'hewn', phase: 'received' },
  welcome: { id: 'welcome', title: 'Your portal is ready', detail: 'Everything for your project lives here: progress, what we need from you, and messages.', owner: 'hewn', phase: 'received' },

  business: {
    id: 'business', title: 'Tell us about your business', owner: 'client', phase: 'kickoff',
    detail: 'The answers we build your site and messaging from. Ten minutes, and it saves a week of back-and-forth.',
    fields: [
      { id: 'business_name', label: 'Business name', type: 'text', required: true },
      { id: 'offers', label: 'Main products or services', type: 'textarea', required: true, placeholder: 'List the ones you most want to sell' },
      { id: 'ideal_customer', label: 'Your ideal customer', type: 'textarea', required: true, placeholder: 'Who they are and what they need' },
      { id: 'usp', label: 'What makes you different', type: 'textarea', required: true, placeholder: 'Why customers choose you over the alternatives' },
      { id: 'service_area', label: 'Where you serve', type: 'text', placeholder: 'City, region, or nationwide' },
      { id: 'primary_action', label: 'What visitors should do', type: 'select', required: true, options: primaryActions },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'The line you use most, if you have one' },
      { id: 'brand_words', label: 'Three words for your brand', type: 'text', placeholder: 'e.g. warm, expert, no-nonsense' },
      { id: 'competitors', label: 'Top competitors', type: 'text', placeholder: 'Names or websites' },
      { id: 'goal_90_days', label: 'Your 90-day goal', type: 'text', placeholder: 'e.g. 40 booked jobs a month' },
    ],
  },
  look: {
    id: 'look', title: 'Show us the look you want', owner: 'client', phase: 'kickoff',
    detail: 'A few sites you like (any industry) and anything you want us to avoid.',
    fields: [
      { id: 'reference_1', label: 'Reference site 1', type: 'url', required: true, placeholder: 'https://' },
      { id: 'reference_2', label: 'Reference site 2', type: 'url', placeholder: 'https://' },
      { id: 'reference_3', label: 'Reference site 3', type: 'url', placeholder: 'https://' },
      { id: 'reference_notes', label: 'What you like about them', type: 'textarea', placeholder: 'The photography, the colors, how simple it feels…' },
      { id: 'brand_colors', label: 'Brand colors', type: 'text', placeholder: 'Hex codes or names, if you have them' },
      { id: 'avoid', label: 'Anything to avoid', type: 'textarea', placeholder: 'Colors, styles, words or competitors you don’t want to look like' },
    ],
  },
  assets: {
    id: 'assets', title: 'Send your logo and photos', owner: 'client', phase: 'kickoff',
    detail: 'Your logo, plus photos of your work, team or place. No photos yet? Tell us and we’ll source or generate them.',
    uploads: { label: 'Logo and photos', help: 'PNG, JPG, SVG, WebP or PDF, up to 4 MB each. Bigger files or lots of photos: share a folder link instead.' },
    fields: [
      { id: 'folder', label: 'Folder link (Google Drive, Dropbox…)', type: 'url', placeholder: 'https://' },
      { id: 'asset_notes', label: 'Notes', type: 'textarea', placeholder: 'Which photo should lead, anything we shouldn’t use…' },
    ],
  },
  copy: {
    id: 'copy', title: 'Your copy and contact details', owner: 'client', phase: 'kickoff',
    detail: 'We can write every word for you from your answers, or use your own.',
    fields: [
      { id: 'copy_mode', label: 'Who writes the words?', type: 'select', required: true, options: ['Write it for me from my answers', 'I’ll provide my own copy', 'A mix of both'] },
      { id: 'public_phone', label: 'Phone to show on the site', type: 'tel' },
      { id: 'public_email', label: 'Email to show on the site', type: 'email' },
      { id: 'address', label: 'Address or service area to show', type: 'text' },
      { id: 'hours', label: 'Hours', type: 'text', placeholder: 'e.g. Mon–Fri 8–5' },
      { id: 'services_copy', label: 'Your own copy (optional)', type: 'textarea', placeholder: 'Paste anything you’ve already written' },
      { id: 'testimonials', label: 'Reviews or testimonials', type: 'textarea', placeholder: 'Paste a few, with names if you can' },
      { id: 'must_say', label: 'Anything we must say (or never say)', type: 'textarea' },
    ],
  },
  domain: {
    id: 'domain', title: 'Your domain', owner: 'client', phase: 'kickoff',
    detail: 'Where your site will live. We’ll email you simple steps to give us access.',
    fields: [
      { id: 'has_domain', label: 'Do you own a domain?', type: 'select', required: true, options: ['Yes, I own one', 'No, help me buy one'] },
      { id: 'domain', label: 'Domain', type: 'text', placeholder: 'yourbusiness.com' },
      { id: 'registrar', label: 'Where it’s registered', type: 'select', options: ['GoDaddy', 'Squarespace (was Google Domains)', 'Namecheap', 'Cloudflare', 'Wix', 'Other', 'Not sure'] },
      { id: 'current_website', label: 'Current website', type: 'url', placeholder: 'https://… (leave blank if none)' },
    ],
  },
  kickoff_call: {
    id: 'kickoff_call', title: 'Book your kickoff call', owner: 'client', phase: 'kickoff',
    detail: 'Thirty minutes to agree goals, priorities and the first 90 days.',
    action: { label: 'Book your kickoff call', href: CAL_URL },
  },
  access: {
    id: 'access', title: 'Give us access to your accounts', owner: 'client', phase: 'kickoff',
    detail: 'Invite hello@hewn.life to each account you have. Tell us what you have and what you need help with.',
    fields: [
      { id: 'google_business', label: 'Google Business Profile', type: 'select', options: ['Invited hello@hewn.life', 'I need help', 'Don’t have one'] },
      { id: 'analytics', label: 'Google Analytics / Search Console', type: 'select', options: ['Invited hello@hewn.life', 'I need help', 'Don’t have them'] },
      { id: 'social', label: 'Social accounts', type: 'textarea', placeholder: 'Which ones you have, and whether you’ve invited us' },
      { id: 'website_platform', label: 'Current website platform and login', type: 'text', placeholder: 'e.g. Squarespace; we’ll ask for access separately' },
    ],
  },
  ads: {
    id: 'ads', title: 'Ad accounts and budget', owner: 'client', phase: 'kickoff',
    detail: 'So we can plan and launch your paid campaigns.',
    fields: [
      { id: 'meta_ads', label: 'Meta (Facebook/Instagram) ad account', type: 'select', options: ['Shared with Hewn Life', 'I need help', 'Don’t have one'] },
      { id: 'google_ads', label: 'Google Ads account', type: 'select', options: ['Shared with Hewn Life', 'I need help', 'Don’t have one'] },
      { id: 'ad_budget', label: 'Monthly ad budget', type: 'text', required: true, placeholder: 'Paid to the platforms, separate from our fee' },
      { id: 'promote', label: 'Offers to promote first', type: 'textarea', required: true },
      { id: 'past_results', label: 'What’s worked (or not) before', type: 'textarea' },
    ],
  },
  growth: {
    id: 'growth', title: 'Reviews, referrals and creators', owner: 'client', phase: 'kickoff',
    detail: 'The raw material for your review, referral and creator programs.',
    fields: [
      { id: 'review_sites', label: 'Where customers review you', type: 'text', placeholder: 'Google, Yelp, Facebook…' },
      { id: 'referral_offer', label: 'A referral reward you’d offer', type: 'text', placeholder: 'e.g. $50 off for both' },
      { id: 'creators', label: 'Creators or partners you like', type: 'textarea' },
      { id: 'slack_emails', label: 'Who should be in your Slack channel', type: 'text', placeholder: 'Names and emails' },
    ],
  },

  build_start: { id: 'build_start', title: 'Brief reviewed and build started', detail: 'We’ve gone through everything you sent and started building.', owner: 'hewn', phase: 'building' },
  brand: { id: 'brand', title: 'Brand direction', detail: 'Colors, type and voice, set before we build.', owner: 'hewn', phase: 'building' },
  design: { id: 'design', title: 'Design and build your site', detail: 'Your pages, copy and contact or booking form, built mobile-first.', owner: 'hewn', phase: 'building' },
  seo: { id: 'seo', title: 'SEO and AI search foundation', detail: 'Search Console, your Google profile, schema and the pages AI assistants read.', owner: 'hewn', phase: 'building' },
  social: { id: 'social', title: 'Social profiles and content plan', detail: 'Profiles cleaned up and your first month of content planned.', owner: 'hewn', phase: 'building' },
  tracking: { id: 'tracking', title: 'Tracking and live dashboard', detail: 'Pixels, conversions and your dashboard, so every result is measured.', owner: 'hewn', phase: 'building' },
  email_crm: { id: 'email_crm', title: 'Email and CRM set up', detail: 'Your CRM and first email automations.', owner: 'hewn', phase: 'building' },
  programs: { id: 'programs', title: 'Review, referral and creator programs', detail: 'Set up and ready to switch on.', owner: 'hewn', phase: 'building' },

  site_review: {
    id: 'site_review', title: 'Review your site', owner: 'client', phase: 'review',
    detail: 'Look through it on your phone and computer. Approve it, or tell us what to change; one round of edits is included.',
    fields: [
      { id: 'decision', label: 'How does it look?', type: 'select', required: true, options: ['Looks great, launch it', 'I have edits'] },
      { id: 'edits', label: 'Edits', type: 'textarea', placeholder: 'Page, what to change, and to what' },
    ],
  },
  edits: { id: 'edits', title: 'Edits made', detail: 'Your changes are in.', owner: 'hewn', phase: 'review' },
  launch: { id: 'launch', title: 'Live on your domain', detail: 'Your site is live, secure and connected to your domain.', owner: 'hewn', phase: 'live' },
  handoff: { id: 'handoff', title: 'Handoff', detail: 'Your logins, a short guide and your first traffic snapshot.', owner: 'hewn', phase: 'live' },
  campaigns: { id: 'campaigns', title: 'First campaigns live', detail: 'Your first paid campaigns are running.', owner: 'hewn', phase: 'live' },
  strategy: { id: 'strategy', title: 'First report and strategy call', detail: 'Your first monthly report, and the plan for next month.', owner: 'hewn', phase: 'live' },
}

const PLANS: Record<PlanId, string[]> = {
  'website-in-a-day': ['order', 'welcome', 'business', 'look', 'assets', 'copy', 'domain', 'build_start', 'design', 'site_review', 'edits', 'launch', 'handoff'],
  hewn: ['order', 'welcome', 'kickoff_call', 'business', 'look', 'assets', 'copy', 'domain', 'access', 'build_start', 'brand', 'design', 'seo', 'social', 'site_review', 'edits', 'launch', 'strategy'],
  wrought: ['order', 'welcome', 'kickoff_call', 'business', 'look', 'assets', 'copy', 'domain', 'access', 'ads', 'build_start', 'brand', 'design', 'seo', 'social', 'tracking', 'email_crm', 'site_review', 'edits', 'launch', 'campaigns', 'strategy'],
  forged: ['order', 'welcome', 'kickoff_call', 'business', 'look', 'assets', 'copy', 'domain', 'access', 'ads', 'growth', 'build_start', 'brand', 'design', 'seo', 'social', 'tracking', 'email_crm', 'programs', 'site_review', 'edits', 'launch', 'campaigns', 'strategy'],
}

/* ── À la carte add-ons ───────────────────────────────────────────────────
 * An add-on order is stored as package "addons:gbp,kit_found,…". Its plan is
 * the requirements for each thing bought (like a Fiverr order), then our work,
 * their review and delivery.
 */
const yesHelp = (verb = 'Invited hello@hewn.life') => [verb, 'I need help with this', 'I don’t have one']
const ADDON_REQS: Record<string, Step> = {
  gbp: {
    id: 'req_gbp', title: 'Your Google Business Profile', owner: 'client', phase: 'kickoff',
    detail: 'Invite hello@hewn.life as a Manager (on Google: your profile → ⋮ → Business Profile settings → People and access), then tell us what to list.',
    uploads: { label: 'Photos for your profile', help: 'Your work, team, storefront or vehicles. PNG, JPG or WebP, up to 4 MB each.' },
    fields: [
      { id: 'gbp_access', label: 'Your profile', type: 'select', required: true, options: yesHelp() },
      { id: 'gbp_link', label: 'Profile link or business name on Google', type: 'text' },
      { id: 'gbp_services', label: 'Services to list', type: 'textarea', required: true, placeholder: 'One per line, most important first' },
      { id: 'gbp_hours', label: 'Hours', type: 'text', placeholder: 'e.g. Mon–Fri 8–5' },
      { id: 'gbp_area', label: 'Area you serve', type: 'text', placeholder: 'Cities or radius' },
    ],
  },
  visibility: {
    id: 'req_visibility', title: 'Your business and competitors', owner: 'client', phase: 'kickoff',
    detail: 'What we compare you on across Google, Maps, ChatGPT and Gemini.',
    fields: [
      { id: 'vis_website', label: 'Your website', type: 'url', placeholder: 'https://' },
      { id: 'vis_services', label: 'Main services', type: 'textarea', required: true },
      { id: 'vis_area', label: 'Where you serve', type: 'text', required: true },
      { id: 'vis_competitors', label: 'Up to three competitors', type: 'textarea', required: true, placeholder: 'Names or websites' },
      { id: 'vis_questions', label: 'What customers ask before they buy', type: 'textarea', placeholder: 'e.g. Do you offer financing? How fast can you come out?' },
    ],
  },
  reviews: {
    id: 'req_reviews', title: 'How you reach your customers', owner: 'client', phase: 'kickoff',
    detail: 'So review requests go out at the right moment, from the right place.',
    uploads: { label: 'Your logo', help: 'For the QR card. PNG, SVG or PDF.' },
    fields: [
      { id: 'rev_site', label: 'Where reviews matter most', type: 'select', required: true, options: ['Google', 'Yelp', 'Facebook', 'Other'] },
      { id: 'rev_tool', label: 'Where your customer list lives', type: 'text', required: true, placeholder: 'e.g. Jobber, Square, Housecall Pro, a spreadsheet' },
      { id: 'rev_when', label: 'When to ask for a review', type: 'text', placeholder: 'e.g. the day after a job is finished' },
      { id: 'rev_notes', label: 'Anything else', type: 'textarea' },
    ],
  },
  ads_audit: {
    id: 'req_ads_audit', title: 'Your ad accounts', owner: 'client', phase: 'kickoff',
    detail: 'Invite hello@hewn.life with read access (or standard access if you want us to fix tracking), then tell us what a good result looks like.',
    fields: [
      { id: 'ads_google', label: 'Google Ads', type: 'select', required: true, options: yesHelp() },
      { id: 'ads_meta', label: 'Meta (Facebook/Instagram) ads', type: 'select', required: true, options: yesHelp() },
      { id: 'ads_spend', label: 'Monthly ad spend', type: 'text', required: true },
      { id: 'ads_goal', label: 'What counts as a result', type: 'textarea', required: true, placeholder: 'e.g. calls, booked jobs, online sales' },
    ],
  },
  creatives: {
    id: 'req_creatives', title: 'What your ads should sell', owner: 'client', phase: 'kickoff',
    detail: 'The offer, where the ads will run, and your brand files.',
    uploads: { label: 'Logo, photos or past ads', help: 'PNG, JPG, SVG or PDF, up to 4 MB each.' },
    fields: [
      { id: 'cr_offer', label: 'The offer', type: 'textarea', required: true, placeholder: 'What you’re promoting and why someone should act now' },
      { id: 'cr_platforms', label: 'Where the ads will run', type: 'text', required: true, placeholder: 'e.g. Facebook, Instagram, Google' },
      { id: 'cr_mix', label: 'Static or motion', type: 'select', options: ['Mostly static', 'Mostly motion', 'A mix'] },
      { id: 'cr_refs', label: 'Ads you like', type: 'textarea', placeholder: 'Links or descriptions' },
    ],
  },
  landing: {
    id: 'req_landing', title: 'Your landing page brief', owner: 'client', phase: 'kickoff',
    detail: 'One page, one job. Tell us the offer and what visitors should do.',
    uploads: { label: 'Logo and photos', help: 'PNG, JPG, SVG or WebP, up to 4 MB each.' },
    fields: [
      { id: 'lp_offer', label: 'The offer', type: 'textarea', required: true },
      { id: 'lp_action', label: 'What visitors should do', type: 'select', required: true, options: primaryActions },
      { id: 'lp_traffic', label: 'Where visitors come from', type: 'text', placeholder: 'e.g. Facebook ads, Google ads, a mailer' },
      { id: 'lp_domain', label: 'Your website or domain', type: 'text', placeholder: 'yourbusiness.com' },
    ],
  },
  email: {
    id: 'req_email', title: 'Your email sequence', owner: 'client', phase: 'kickoff',
    detail: 'Which tool we build in, and what the emails should achieve.',
    fields: [
      { id: 'em_tool', label: 'Email tool', type: 'select', required: true, options: ['Mailchimp', 'Klaviyo', 'Constant Contact', 'HubSpot', 'Other', 'None yet'] },
      { id: 'em_access', label: 'Access', type: 'select', required: true, options: ['Invited hello@hewn.life', 'I need help with this'] },
      { id: 'em_goal', label: 'Goal of the sequence', type: 'select', required: true, options: ['Welcome new subscribers', 'Turn leads into customers', 'Win back past customers', 'Something else'] },
      { id: 'em_offer', label: 'Offer or next step to point people to', type: 'textarea', required: true },
    ],
  },
  blog: {
    id: 'req_blog', title: 'Your blog posts', owner: 'client', phase: 'kickoff',
    detail: 'Topics you want to be found for. Leave them blank and we’ll research them.',
    fields: [
      { id: 'bl_site', label: 'Your website', type: 'url', required: true, placeholder: 'https://' },
      { id: 'bl_topics', label: 'Topics or searches to rank for', type: 'textarea' },
      { id: 'bl_audience', label: 'Who you’re writing for', type: 'textarea', required: true },
      { id: 'bl_publish', label: 'Publishing', type: 'select', required: true, options: ['I’ll give you access to publish', 'Send me the posts and I’ll publish'] },
    ],
  },
  video: {
    id: 'req_video', title: 'Your video', owner: 'client', phase: 'kickoff',
    detail: 'Share the video as a link; long videos are too big to upload here.',
    fields: [
      { id: 'vd_link', label: 'Link to the video', type: 'url', required: true, placeholder: 'Google Drive, Dropbox or YouTube' },
      { id: 'vd_platforms', label: 'Where the clips will go', type: 'text', required: true, placeholder: 'e.g. Instagram Reels, TikTok, YouTube Shorts' },
      { id: 'vd_notes', label: 'Moments to use or avoid', type: 'textarea' },
    ],
  },
  brand: {
    id: 'req_brand', title: 'Your brand today', owner: 'client', phase: 'kickoff',
    detail: 'What you have now and where you want it to go.',
    uploads: { label: 'Current logo and brand files', help: 'PNG, SVG, PDF or JPG, up to 4 MB each.' },
    fields: [
      { id: 'br_direction', label: 'Direction', type: 'select', required: true, options: ['Refresh my current logo', 'Open to a new look'] },
      { id: 'br_words', label: 'Three words for your brand', type: 'text', required: true },
      { id: 'br_refs', label: 'Brands or logos you like', type: 'textarea' },
      { id: 'br_avoid', label: 'Anything to avoid', type: 'textarea' },
    ],
  },
  copy: {
    id: 'req_copy', title: 'Your website copy brief', owner: 'client', phase: 'kickoff',
    detail: 'The answers we write your five pages from.',
    fields: [
      { id: 'cp_site', label: 'Current website', type: 'url', placeholder: 'https:// (blank if none)' },
      { id: 'cp_pages', label: 'The five pages', type: 'text', required: true, placeholder: 'e.g. Home, About, Services, Reviews, Contact' },
      { id: 'cp_offers', label: 'What you sell', type: 'textarea', required: true },
      { id: 'cp_customer', label: 'Your ideal customer', type: 'textarea', required: true },
      { id: 'cp_tone', label: 'How you want to sound', type: 'text', placeholder: 'e.g. friendly, expert, straight-talking' },
    ],
  },
}
const ADDON_TAIL: Step[] = [
  { id: 'addon_work', title: 'We’re on it', detail: 'Everything you sent is in and the work has started.', owner: 'hewn', phase: 'building' },
  {
    id: 'addon_review', title: 'Review your deliverables', owner: 'client', phase: 'review',
    detail: 'Check what we made in Assets. Approve it, or tell us what to change; one round of edits is included.',
    fields: [
      { id: 'decision', label: 'How does it look?', type: 'select', required: true, options: ['Approved, all good', 'I have edits'] },
      { id: 'edits', label: 'Edits', type: 'textarea', placeholder: 'What to change, and to what' },
    ],
  },
  { id: 'addon_delivered', title: 'Delivered', detail: 'Final files are in Assets, with anything you need to use them.', owner: 'hewn', phase: 'live' },
]

/** The add-on SKUs in an "addons:…" package, with kits opened up into their items. */
export function addonItems(pkg: string): string[] {
  if (!pkg.startsWith('addons:')) return []
  const out: string[] = []
  for (const sku of pkg.slice(7).split(',')) {
    const x = lookup(sku)
    for (const s of x ? (isKit(x) ? x.includes : [sku]) : []) if (!out.includes(s) && ADDON_REQS[s]) out.push(s)
  }
  return out
}
export const addonPackage = (skus: string[]) => `addons:${skus.join(',')}`

export const isPackage = (v: string) => v in PLANS || addonItems(v).length > 0
export const stepsFor = (pkg: string): Step[] => {
  if (pkg in PLANS) return PLANS[pkg as PlanId].map(id => S[id])
  const items = addonItems(pkg)
  return items.length ? [S.order, S.welcome, ...items.map(s => ADDON_REQS[s]), ...ADDON_TAIL] : []
}
export const packageName = (pkg: string) => {
  if (pkg.startsWith('addons:')) return pkg.slice(7).split(',').map(s => lookup(s)?.name).filter(Boolean).join(' + ')
  return PACKAGES.find(p => p.id === pkg)?.name ?? ''
}

/** What has happened on one step. Kept as JSON on the client's Airtable row. */
export type StepState = {
  /** Client sent their part. */
  submitted?: string
  /** Signed off by the team. */
  done?: string
  by?: string
  data?: Record<string, string>
  files?: string[]
}
export type Progress = Record<string, StepState>

export function parseProgress(raw: string): Progress {
  try { const p = JSON.parse(raw); return p && typeof p === 'object' ? p as Progress : {} } catch { return {} }
}

export type StepStatus = 'done' | 'submitted' | 'current' | 'waiting'

/** Each step with its status: done, sent by the client and awaiting sign-off, the current one, or still to come. */
export function track(pkg: string, progress: Progress) {
  const steps = stepsFor(pkg)
  const firstOpen = steps.findIndex(s => !progress[s.id]?.done)
  const rows = steps.map((s, i) => {
    const st = progress[s.id] ?? {}
    const status: StepStatus = st.done ? 'done' : st.submitted ? 'submitted' : i === firstOpen ? 'current' : 'waiting'
    return { step: s, state: st, status }
  })
  const current = firstOpen === -1 ? null : steps[firstOpen]
  const phases = PHASES.map(p => {
    const inPhase = rows.filter(r => r.step.phase === p.id)
    const done = inPhase.length > 0 && inPhase.every(r => r.status === 'done')
    return { ...p, done, current: !done && current?.phase === p.id, steps: inPhase.length }
  }).filter(p => p.steps > 0)
  const done = rows.filter(r => r.status === 'done').length
  // A client step opens once everything in earlier phases is done or sent (e.g. site review waits for the build).
  const order = PHASES.map(p => p.id)
  const open = (phase: PhaseId) => rows.every(r => order.indexOf(r.step.phase) >= order.indexOf(phase) || r.status === 'done' || r.status === 'submitted')
  const yourTurn = rows.filter(r => r.step.owner === 'client' && r.status !== 'done' && r.status !== 'submitted' && open(r.step.phase))
  return { rows, phases, current, done, total: rows.length, yourTurn }
}
