/**
 * Set up a client portal when someone buys: create the client, apply their
 * package's onboarding plan and email them a welcome link. Safe to run twice.
 */
import { addAssetUrls, findClient, saveClient, type PortalClient } from './data'
import { briefLogos, briefProgress, latestBrief } from './fromBrief'
import { isPackage, packageName } from './onboarding'
import { sendPortalLink } from './auth'

export async function provisionPortal(input: { email: string; tier?: string; name?: string; company?: string }) {
  const email = input.email.trim().toLowerCase()
  const tier = input.tier ?? ''
  if (!email || !isPackage(tier)) return
  const existing = await findClient(email)
  if (existing?.package) return
  const now = new Date().toISOString()
  const progress = { ...(existing?.progress ?? {}), order: { done: now, by: 'checkout' }, welcome: { done: now, by: 'checkout' } }
  const saved = await saveClient(existing?.id ?? null, {
    ...(existing ? {} : { email, name: input.name ?? '', company: input.company ?? '', status: 'Onboarding' as const }),
    plan: existing?.plan || packageName(tier),
    package: tier,
    progress,
  })
  await importBrief(saved).catch(err => console.error('Brief import failed:', err))
  await sendPortalLink(saved.email, true)
}

/** Fill a client's onboarding from the Website Brief they filled in before buying. Returns the updated client. */
export async function importBrief(client: PortalClient): Promise<PortalClient> {
  if (!client.package) return client
  const brief = await latestBrief(client.email)
  if (!brief) return client
  const logos = client.assets.some(a => a.name.startsWith('assets--')) ? [] : briefLogos(brief)
  const withLogo = await addAssetUrls(client, logos)
  const progress = briefProgress(client.package, withLogo.progress, brief, logos.map(l => l.filename))
  const company = typeof brief.fields['Business name'] === 'string' ? (brief.fields['Business name'] as string).trim() : ''
  return saveClient(client.id, { progress, ...(!client.company.trim() && company ? { company } : {}) })
}
