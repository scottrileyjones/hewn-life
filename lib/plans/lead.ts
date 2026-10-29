/** Website briefs (the /start form, Website in a Day, Cal.com booking questions) as plan leads. */
import { intakeFields } from '@/lib/intake'
import type { LeadInput, LeadSource } from './deck'

const SKIP = new Set(['name', 'email', 'phone', 'business_name', 'logo'])

export function briefLead(answers: Record<string, string>, source: LeadSource): LeadInput {
  const labeled: Record<string, string> = {}
  for (const f of intakeFields) {
    const v = answers[f.id]
    if (!SKIP.has(f.id) && typeof v === 'string' && v.trim()) labeled[f.label] = v.trim()
  }
  return {
    source,
    name: answers.name || '',
    company: answers.business_name || '',
    email: answers.email || '',
    // Briefs carry no marketing opt-in, so they get the plan once and no follow-up.
    consent: false,
    answers: labeled,
  }
}
