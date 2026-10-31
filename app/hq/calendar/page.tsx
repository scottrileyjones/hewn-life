import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import TeamCalendar from '@/components/calendar/TeamCalendar'
import { currentUser } from '@/lib/crm/auth'
import { loadClients } from '@/lib/portal/data'
import { loadPosts } from '@/lib/portal/posts'
import { sampleAssets, sampleClient, samplePosts } from '@/lib/portal/sample'

export const metadata = { title: 'Calendar', robots: { index: false, follow: false } }

export default async function CalendarPage({ searchParams }: { searchParams: { c?: string } }) {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows a made-up client without signing in.
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'preview@hewn.life' : null)
  if (!user) redirect('/crm/login')
  if (sample) {
    const c = sampleClient()
    const media = sampleAssets().filter(a => a.files.length).map(a => ({ id: a.id, title: a.title, category: a.category, status: a.status, files: a.files.map(f => ({ name: f.name, url: f.url, type: f.type, thumb: f.thumb })) }))
    return <TeamCalendar user={user} clients={[{ email: c.email, name: c.name, company: c.company }]} posts={samplePosts()} selected="" sampleMedia={{ [c.email]: media }} />
  }
  const [clients, posts] = await Promise.all([loadClients().catch(() => []), loadPosts().catch(err => { console.error('Calendar load failed:', err); return [] })])
  return <TeamCalendar user={user} clients={clients.filter(c => c.status !== 'Past').map(c => ({ email: c.email, name: c.name, company: c.company }))} posts={posts} selected={(searchParams.c || '').toLowerCase()} />
}
