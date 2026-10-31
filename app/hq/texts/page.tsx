import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Texts from '@/components/crm/Texts'
import { currentUser } from '@/lib/crm/auth'
import { audienceFor, loadCampaigns, loadSubscribers, type Campaign, type Subscriber } from '@/lib/smsMarketing'
import { smsConfigured, teamNumbers } from '@/lib/sms'

export const metadata = { title: 'Texts', robots: { index: false, follow: false } }

const ago = (h: number) => new Date(Date.now() - h * 3600e3).toISOString()

export default async function TextsPage() {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows made-up subscribers without signing in.
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'preview@hewn.life' : null)
  if (!user) redirect('/crm/login')
  if (sample) {
    const subs: Subscriber[] = [
      { id: 's1', mobile: '+18015550100', name: 'Jane Smith', email: 'jane@acmeplumbing.com', company: 'Acme Plumbing', source: 'Client portal', marketing: true, lastText: ago(70) },
      { id: 's2', mobile: '+13855550123', name: 'Marco Diaz', email: 'marco@ridgeroofing.com', company: 'Ridge Roofing', source: 'ROI calculator', marketing: true, lastText: '' },
      { id: 's3', mobile: '+18015550188', name: 'Priya Patel', email: 'priya@glowmedspa.com', company: 'Glow Med Spa', source: 'Website brief', marketing: true, lastText: ago(70) },
      { id: 's4', mobile: '+14355550147', name: 'Tom Becker', email: 'tom@beckerhvac.com', company: 'Becker HVAC', source: 'Contact form', marketing: false, lastText: ago(200) },
    ]
    const campaigns: Campaign[] = [{ id: 'c1', message: 'Hewn Life: Beta spots are open. Website in a Day for $250 with code BETA250: hewn.life/website-in-a-day Reply STOP to opt out.', audience: 'Leads', sentAt: ago(70), sentBy: 'scott@hewn.life', sent: 2, skipped: 0 }]
    return <Texts user={user} subscribers={subs} counts={{ Everyone: 3, Leads: 2, Clients: 1 }} campaigns={campaigns} configured teamPhones={2} />
  }
  const [subs, campaigns] = await Promise.all([loadSubscribers().catch(() => []), loadCampaigns().catch(() => [])])
  const [everyone, clients] = await Promise.all([audienceFor('Everyone', subs), audienceFor('Clients', subs)])
  return <Texts user={user} subscribers={subs} counts={{ Everyone: everyone.length, Leads: everyone.length - clients.length, Clients: clients.length }} campaigns={campaigns} configured={smsConfigured()} teamPhones={teamNumbers().length} />
}
