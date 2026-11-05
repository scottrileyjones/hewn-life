import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Flows from '@/components/crm/Flows'
import { currentUser } from '@/lib/crm/auth'
import { loadFlows, loadRuns, type Run } from '@/lib/flows/engine'
import { DEFAULT_FLOWS } from '@/lib/flows/defaults'

export const metadata = { title: 'Flows', robots: { index: false, follow: false } }

const ago = (h: number) => new Date(Date.now() - h * 3600e3).toISOString()

export default async function FlowsPage() {
  noStore()
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = (await currentUser()) ?? (sample ? 'preview@hewn.life' : null)
  if (!user) redirect('/crm/login?next=/hq/flows')
  if (sample) {
    const runs: Run[] = [
      { id: 'r1', flow: 'checkout_abandoned', email: 'marco@ridgeroofing.com', name: 'Marco Diaz', company: 'Ridge Roofing', phone: '', context: { plan: 'Website in a Day' }, step: 1, nextAt: ago(-20), status: 'Active', log: '', createdAt: ago(4) },
      { id: 'r2', flow: 'checkout_abandoned', email: 'priya@glowmedspa.com', name: 'Priya Patel', company: 'Glow Med Spa', phone: '', context: { plan: 'Hewn' }, step: 3, nextAt: '', status: 'Exited', log: '', createdAt: ago(70) },
    ]
    return <Flows user={user} flows={DEFAULT_FLOWS.map((f, i) => (i === 0 ? { ...f, status: 'Active' } : f))} sampleRuns={runs} />
  }
  return <Flows user={user} flows={await loadFlows()} />
}
