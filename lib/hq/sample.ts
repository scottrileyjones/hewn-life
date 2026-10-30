/** Checklist and revenue for previewing HQ locally (PLAN_SAMPLE=1 only). */
import type { Task, Area, Owner, Status } from './checklist'
import type { Revenue } from './revenue'

// In priority order, matching the Airtable seed.
const rows: [string, Area, Owner, Status, string?, string?][] = [
  ['Sign the Operating Agreement', 'Legal & entity', 'Both', 'To do', '2026-11-01', 'Fill in the formation date and notice addresses first.'],
  ['Sign the Incentive Unit Grant Agreement', 'Legal & entity', 'Both', 'To do', '2026-11-01'],
  ['Sign the COO Role Letter', 'Legal & entity', 'Both', 'To do', '2026-11-01'],
  ['Confirm the EIN letter is on file', 'Legal & entity', 'Scott', 'To do', '2026-11-03'],
  ['Mail Jason’s 83(b) election to the IRS', 'Legal & entity', 'Jason', 'To do', '2026-11-10', 'Legal deadline: postmarked by Dec 1.'],
  ['Turn on Stripe renewal reminder emails', 'Delivery & ops', 'Scott', 'To do', '2026-11-04'],
  ['Business bank account in Hewn Holdings LLC’s name', 'Money & tax', 'Scott', 'To do', '2026-11-06'],
  ['Point Stripe payouts to the business account', 'Money & tax', 'Scott', 'To do', '2026-11-07'],
  ['Register the “Hewn Life” DBA with Utah', 'Legal & entity', 'Scott', 'To do', '2026-11-06'],
  ['Target list of the first 50 prospects', 'Sales', 'Jason', 'To do', '2026-11-07'],
  ['Proposal and statement-of-work template', 'Sales', 'Jason', 'To do', '2026-11-10'],
  ['Attorney review of the founding documents', 'Legal & entity', 'Scott', 'To do', '2026-11-13'],
  ['CPA: partnership tax setup, K-1s and guaranteed payments', 'Money & tax', 'Scott', 'To do', '2026-11-13'],
  ['Client onboarding checklist and kickoff template', 'Delivery & ops', 'Jason', 'To do', '2026-11-14'],
  ['Facebook page: username, Book now button, link Instagram', 'Brand & presence', 'Scott', 'In progress', '2026-11-03'],
  ['LinkedIn company page', 'Brand & presence', 'Scott', 'To do', '2026-11-05'],
  ['Add the real social links to the site footer', 'Brand & presence', 'Scott', 'Waiting', '2026-11-07'],
  ['Business insurance: general, professional (E&O) and cyber', 'Legal & entity', 'Scott', 'To do', '2026-11-20'],
  ['Partner certifications (Google Ads, Meta, etc.)', 'Sales', 'Jason', 'To do', '2026-11-21'],
  ['Close the first paying client', 'Sales', 'Jason', 'To do', '2026-12-15'],
  ['First monthly Net Revenue and Run-Rate statement to Jason', 'Money & tax', 'Scott', 'To do', '2026-12-30'],
  ['Set up quarterly estimated tax payments', 'Money & tax', 'Jason', 'To do', '2027-01-10'],
  ['Set up the Kaysville virtual mailbox', 'Legal & entity', 'Scott', 'Done'],
  ['Instagram account', 'Brand & presence', 'Scott', 'Done'],
  ['Case study page', 'Brand & presence', 'Scott', 'Done'],
  ['Discovery call booking under the Hewn Life name', 'Sales', 'Scott', 'Done'],
  ['Website live with checkout', 'Systems', 'Scott', 'Done'],
  ['CRM pipeline', 'Systems', 'Scott', 'Done'],
]

export const sampleTasks = (): Task[] => rows.map(([task, area, owner, status, due = '', notes = ''], i) => ({
  id: `sample${i}`, task, area, owner, status, due, notes, order: i, updatedBy: '', updatedAt: '',
}))

export const sampleRevenue = (): Revenue => ({
  mrr: 0, activeSubs: 0, collected30: 0, collected90: 0, runRate: 0, clients90: 0,
  months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map(label => ({ label, amount: 0 })),
})
