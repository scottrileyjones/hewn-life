import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Dashboard from '@/components/portal/Dashboard'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient, loadMessages, touchClient } from '@/lib/portal/data'
import { sampleClient, sampleMessages } from '@/lib/portal/sample'

export const metadata = { title: 'Client portal', robots: { index: false, follow: false } }

export default async function Portal({ searchParams }: { searchParams: { billing?: string } }) {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows a made-up client without signing in.
  if (process.env.PLAN_SAMPLE === '1') return <Dashboard client={sampleClient()} messages={sampleMessages()} billing={searchParams.billing} />
  const email = currentClientEmail()
  if (!email) redirect('/portal/login')
  const client = await findClient(email)
  if (!client || client.status === 'Past') redirect('/portal/login')
  const messages = await loadMessages(client.email)
  // Record the visit, at most once an hour, without slowing the page.
  if (!client.lastLogin || Date.now() - new Date(client.lastLogin).getTime() > 3600e3) touchClient(client.id, 'Last login').catch(() => {})
  return <Dashboard client={client} messages={messages} billing={searchParams.billing} />
}
