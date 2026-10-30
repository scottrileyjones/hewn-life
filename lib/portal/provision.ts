/**
 * Set up a client portal when someone buys: create the client, apply their
 * package's onboarding plan and email them a welcome link. Safe to run twice.
 */
import { findClient, saveClient } from './data'
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
  await sendPortalLink(saved.email, true)
}
