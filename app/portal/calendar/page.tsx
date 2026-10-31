import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import ClientCalendar from '@/components/calendar/ClientCalendar'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient } from '@/lib/portal/data'
import { clientSees, loadPosts } from '@/lib/portal/posts'
import { mediaFor } from '@/lib/portal/media'
import { clientVisible } from '@/lib/portal/assets'
import { libraryFor } from '@/lib/portal/library'
import { sampleAssets, sampleClient, samplePosts } from '@/lib/portal/sample'

export const metadata = { title: 'Content calendar', robots: { index: false, follow: false } }

export default async function Calendar() {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows a made-up client without signing in.
  if (process.env.PLAN_SAMPLE === '1') {
    const c = sampleClient()
    return <ClientCalendar email={c.email} company={c.company} posts={samplePosts().filter(clientSees)} media={[]} preview assetsToReview={sampleAssets().filter(a => a.status === 'In review').length} />
  }
  const email = currentClientEmail()
  if (!email) redirect('/portal/login')
  const client = await findClient(email)
  if (!client || client.status === 'Past') redirect('/portal/login')
  const [posts, media, library] = await Promise.all([loadPosts(client.email), mediaFor(client).catch(() => []), libraryFor(client).catch(() => [])])
  return <ClientCalendar email={client.email} company={client.company} posts={posts.filter(clientSees)} media={media}
    assetsToReview={library.filter(clientVisible).filter(a => a.status === 'In review').length} />
}
