import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Board from '@/components/crm/Board'
import { currentUser } from '@/lib/crm/auth'
import { loadContacts } from '@/lib/crm/data'
import { reviewUrl } from '@/lib/plans/email'
import { sampleContacts } from '@/lib/crm/sample'

export const metadata = { title: 'CRM — Hewn Life', robots: { index: false, follow: false } }

export default async function Crm() {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows made-up contacts without signing in.
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'preview@hewn.life' : null)
  if (!user) redirect('/crm/login')
  const contacts = sample ? sampleContacts() : await loadContacts()
  // Signed review links, so opening a plan from here doesn't count as the lead opening it.
  const initial = contacts.map(c => ({ ...c, planLink: c.plan?.token ? reviewUrl(c.plan.token) : null }))
  return <Board initial={initial} user={user} />
}
