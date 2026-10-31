/** A client's full library: the asset table plus files sent during onboarding steps. */
import { loadAssets, type Asset } from './assets'
import { stepsFor } from './onboarding'
import type { PortalClient } from './data'

/** Onboarding uploads live on the client row; show them in the library as their own read-only items. */
export function onboardingAssets(c: PortalClient): Asset[] {
  const steps = stepsFor(c.package)
  return c.assets.map(f => {
    const stepId = f.name.split('--')[0]
    const step = steps.find(s => s.id === stepId)
    const at = c.progress[stepId]?.submitted || c.lastLogin || new Date(0).toISOString()
    return {
      id: `onb-${f.id}`, clientEmail: c.email, title: f.name.slice(stepId.length + 2) || f.name, category: 'Logos & brand', source: 'Client', status: 'Received',
      files: [{ id: f.id, name: f.name.slice(stepId.length + 2) || f.name, url: f.url, type: f.type, size: f.size, thumb: '' }],
      link: '', text: '', notes: step ? `Sent in onboarding: ${step.title}` : 'Sent in onboarding', feedback: '', liveLink: '', addedBy: c.email, addedAt: at, updatedAt: at,
    }
  })
}

export async function libraryFor(c: PortalClient): Promise<Asset[]> {
  const rows = await loadAssets(c.email)
  return [...rows, ...onboardingAssets(c)].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}
