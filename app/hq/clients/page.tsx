import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Clients from '@/components/crm/Clients'
import { currentUser } from '@/lib/crm/auth'
import { loadClients } from '@/lib/portal/data'
import { sampleAssets, sampleClient, sampleMessages } from '@/lib/portal/sample'

export const metadata = { title: 'Clients', robots: { index: false, follow: false } }

export default async function ClientsPage({ searchParams }: { searchParams: { c?: string } }) {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows a made-up client without signing in.
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'preview@hewn.life' : null)
  if (!user) redirect('/crm/login')
  const clients = sample ? [sampleClient()] : await loadClients().catch(err => { console.error('Clients load failed:', err); return null })
  return <Clients user={user} clients={clients} selected={(searchParams.c || '').toLowerCase()} sampleThread={sample ? sampleMessages() : undefined} sampleAssets={sample ? sampleAssets() : undefined} />
}
