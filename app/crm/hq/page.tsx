import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Hq, { type Funnel } from '@/components/crm/Hq'
import { currentUser } from '@/lib/crm/auth'
import { loadContacts, type Contact } from '@/lib/crm/data'
import { sampleContacts } from '@/lib/crm/sample'
import { loadTasks } from '@/lib/hq/checklist'
import { loadRevenue } from '@/lib/hq/revenue'
import { sampleRevenue, sampleTasks } from '@/lib/hq/sample'

export const metadata = { title: 'HQ — Hewn Life', robots: { index: false, follow: false } }

const RANK: Record<Contact['stage'], number> = { New: 0, 'Plan sent': 1, Opened: 2, Booked: 3, Proposal: 4, Won: 5, Lost: -1 }

function funnel(contacts: Contact[]): Funnel {
  const since = Date.now() - 90 * 864e5
  const recent = contacts.filter(c => new Date(c.firstSeen || c.lastActivity).getTime() >= since)
  const reached = (c: Contact) => Math.max(RANK[c.stage], RANK[c.autoStage])
  return {
    leads30: contacts.filter(c => new Date(c.firstSeen || c.lastActivity).getTime() >= Date.now() - 30 * 864e5).length,
    steps: [
      ['Leads', recent.length],
      ['Plan sent', recent.filter(c => reached(c) >= 1).length],
      ['Opened', recent.filter(c => reached(c) >= 2).length],
      ['Booked', recent.filter(c => reached(c) >= 3).length],
      ['Won', recent.filter(c => c.stage === 'Won').length],
    ],
    openValue: contacts.filter(c => !['Won', 'Lost'].includes(c.stage)).reduce((s, c) => s + (c.value ?? 0), 0),
    openDeals: contacts.filter(c => ['Booked', 'Proposal'].includes(c.stage)).length,
  }
}

/** Run a loader without letting one failing source take down the whole report. */
async function safe<T>(label: string, run: () => Promise<T>): Promise<T | null> {
  try { return await run() } catch (err) { console.error(`HQ: ${label} failed:`, err); return null }
}

export default async function HqPage() {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows sample data without signing in.
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'preview@hewn.life' : null)
  if (!user) redirect('/crm/login')
  const [tasks, revenue, contacts] = sample
    ? [sampleTasks(), sampleRevenue(), sampleContacts()]
    : await Promise.all([safe('checklist', loadTasks), safe('Stripe', loadRevenue), safe('contacts', loadContacts)])
  return <Hq user={user} tasks={tasks} revenue={revenue} funnel={contacts ? funnel(contacts) : null} today={new Date().toLocaleDateString('en-CA', { timeZone: 'America/Denver' })} />
}
