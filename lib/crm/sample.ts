/** Made-up contacts for previewing the CRM locally (PLAN_SAMPLE=1 only). */
import type { Contact, Stage } from './data'

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 864e5).toISOString()

function c(name: string, company: string, source: string, stage: Stage, age: number, extra: Partial<Contact> = {}): Contact {
  const email = `${name.split(' ')[0].toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`
  const events = [{ at: d(age), label: source === 'Contact form' ? 'Sent the contact form' : 'Took the ROI calculator' }]
  if (stage !== 'New') events.unshift({ at: d(age - 0.01), label: 'Growth plan emailed' })
  if (['Opened', 'Booked', 'Proposal', 'Won', 'Lost'].includes(stage)) events.unshift({ at: d(age - 0.5), label: 'Opened their growth plan' })
  if (['Booked', 'Proposal', 'Won'].includes(stage)) events.unshift({ at: d(age - 1), label: 'Booked a call' })
  return {
    email, name, company, phone: '(801) 555-0142', state: 'UT', sources: [source], firstSeen: d(age), lastActivity: events[0].at,
    tier: 'Wrought', score: 14, revenue: '$1,000,000', consent: true,
    answers: { 'Goal (90 days)': 'Generate consistent inbound leads', 'Biggest challenge': 'We get traffic but nothing converts', 'Monthly budget': '$3,000–$6,000 / mo' },
    notes: '', plan: { token: 'sample', status: 'Sent', by: 'Claude', recommended: 'Wrought', summary: `${company} has steady referrals but paid leads cost more each season. The plan: fix the pages that leak, test new creative weekly, and track every dollar on one dashboard.` },
    stage, autoStage: stage, manual: null, value: null, crmNotes: '', pipelineId: null, events, ...extra,
  }
}

export const sampleContacts = (): Contact[] => [
  c('Maya Torres', 'Torres Home Comfort', 'Quiz', 'Booked', 3, { value: 5000 }),
  c('Devon Price', 'Price Dental Group', 'Contact form', 'Opened', 2, { tier: 'Forged' }),
  c('Alana Kim', 'Kim Skin Studio', 'Quiz', 'Plan sent', 1, { tier: 'Hewn' }),
  c('Rafael Ortiz', 'Ortiz Landscaping', 'Website in a Day', 'New', 0.2, { tier: 'Website in a Day', sources: ['Website in a Day'] }),
  c('Grace Liu', 'Lumen Candle Co', 'Quiz', 'Proposal', 9, { value: 9500, tier: 'Forged', manual: { id: '', stage: 'Proposal', at: d(4), by: 'jason@hewn.life' } }),
  c('Owen Hart', 'Hart & Co Realty', 'Contact form', 'Won', 21, { value: 2500, tier: 'Hewn' }),
  c('Priya Nair', 'Nair Telehealth', 'Quiz', 'Opened', 6, { tier: 'Wrought' }),
  c('Sam Becker', 'Becker Bikes', 'Quiz', 'Plan sent', 4, { tier: 'Hewn' }),
  c('Lena Fischer', 'Fischer Bakery', 'Contact form', 'Lost', 30, { autoStage: 'Opened', manual: { id: '', stage: 'Lost', at: d(12), by: 'scott@hewn.life' } }),
  c('Marcus Reed', 'Reed Fitness', 'Quiz', 'New', 0.5, { tier: 'Hewn' }),
  c('Tess Morgan', 'Morgan Creative', 'Quiz', 'Plan sent', 8, { tier: 'Wrought' }),
]
