/**
 * The website brief: everything we need to build a prospect's concept site
 * before the exploration call.
 *
 * One definition feeds the /start form, the intake API, the Cal.com webhook
 * and docs/sales/intake-forms.md. `id` doubles as the Cal.com booking
 * question identifier; `label` is the Airtable column name.
 */

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'file'

export interface IntakeField {
  id: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  help?: string
  options?: string[]
}

export interface IntakeSection {
  title: string
  intro: string
  fields: IntakeField[]
}

export const primaryActions = ['Call us', 'Book an appointment', 'Buy online', 'Request a quote', 'Visit in person', 'Join a list or waitlist']
export const revenueRanges = ['Under $500K', '$500K–$1M', '$1M–$5M', '$5M+', 'Prefer not to say']
export const planInterest = ['Website in a Week ($1,000)', 'Hewn ($2,500/mo)', 'Wrought ($5,000/mo)', 'Forged ($9,500/mo)', 'Not sure yet']

export const intakeSections: IntakeSection[] = [
  {
    title: 'About you',
    intro: 'So we know who we are building for.',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your full name' },
      { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@business.com' },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: 'Optional' },
      { id: 'business_name', label: 'Business name', type: 'text', required: true },
      { id: 'current_website', label: 'Current website', type: 'url', placeholder: 'https://… (leave blank if you have none)' },
    ],
  },
  {
    title: 'The look',
    intro: 'Three websites or brands you would love to borrow from. They don’t have to be in your industry.',
    fields: [
      { id: 'reference_1', label: 'Reference site 1', type: 'url', required: true, placeholder: 'https://' },
      { id: 'reference_2', label: 'Reference site 2', type: 'url', required: true, placeholder: 'https://' },
      { id: 'reference_3', label: 'Reference site 3', type: 'url', required: true, placeholder: 'https://' },
      { id: 'reference_notes', label: 'What you like about them', type: 'textarea', placeholder: 'The photography, the colors, how simple it feels…' },
      { id: 'logo', label: 'Logo', type: 'file', help: 'PNG, JPG, SVG or PDF, up to 5 MB.' },
      { id: 'brand_colors', label: 'Brand colors', type: 'text', placeholder: 'Hex codes or names, if you have them' },
    ],
  },
  {
    title: 'The brand',
    intro: 'In your own words. Rough is fine; we will sharpen it.',
    fields: [
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'The line you use most, if you have one' },
      { id: 'usp', label: 'What makes you different', type: 'textarea', required: true, placeholder: 'Why customers choose you over the alternatives' },
      { id: 'brand_words', label: 'Three words for your brand', type: 'text', placeholder: 'e.g. warm, expert, no-nonsense' },
    ],
  },
  {
    title: 'The market',
    intro: 'Who you serve and who you compete with.',
    fields: [
      { id: 'ideal_customer', label: 'Ideal customer', type: 'textarea', required: true, placeholder: 'Who they are and what they need' },
      { id: 'service_area', label: 'Where you serve', type: 'text', placeholder: 'City, region, or nationwide' },
      { id: 'offers', label: 'Main products or services', type: 'textarea', required: true, placeholder: 'List the ones you most want to sell' },
      { id: 'competitors', label: 'Top competitors', type: 'text', placeholder: 'Names or websites' },
    ],
  },
  {
    title: 'The goal',
    intro: 'What the website has to do for you.',
    fields: [
      { id: 'primary_action', label: 'What visitors should do', type: 'select', required: true, options: primaryActions },
      { id: 'goal_90_days', label: '90-day goal', type: 'text', placeholder: 'e.g. 40 booked jobs a month' },
      { id: 'revenue_range', label: 'Annual revenue', type: 'select', options: revenueRanges },
      { id: 'plan_interest', label: 'Interested in', type: 'select', options: planInterest },
    ],
  },
]

export const intakeFields = intakeSections.flatMap(s => s.fields)

export const LOGO_MAX_BYTES = 5 * 1024 * 1024
export const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf']
