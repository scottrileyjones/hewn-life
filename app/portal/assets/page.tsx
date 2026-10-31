import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import AssetLibrary from '@/components/portal/AssetLibrary'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient } from '@/lib/portal/data'
import { clientVisible } from '@/lib/portal/assets'
import { libraryFor } from '@/lib/portal/library'
import { sampleAssets, sampleClient } from '@/lib/portal/sample'

export const metadata = { title: 'Your assets', robots: { index: false, follow: false } }

export default async function Assets() {
  noStore()
  // PLAN_SAMPLE=1 (local previews only) shows a made-up client without signing in.
  if (process.env.PLAN_SAMPLE === '1') { const c = sampleClient(); return <AssetLibrary email={c.email} company={c.company} assets={sampleAssets()} preview /> }
  const email = currentClientEmail()
  if (!email) redirect('/portal/login')
  const client = await findClient(email)
  if (!client || client.status === 'Past') redirect('/portal/login')
  const assets = (await libraryFor(client)).filter(clientVisible)
  return <AssetLibrary email={client.email} company={client.company} assets={assets} />
}
