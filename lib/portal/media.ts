/** Media a post can use: every file in a client's asset library (and onboarding uploads), keyed by asset id. */
import { loadAssets } from './assets'
import { onboardingAssets } from './library'
import type { PortalClient } from './data'

export type MediaFile = { name: string; url: string; type: string; thumb: string }
export type MediaItem = { id: string; title: string; category: string; status: string; files: MediaFile[] }

export async function mediaFor(c: PortalClient): Promise<MediaItem[]> {
  const assets = [...await loadAssets(c.email), ...onboardingAssets(c)]
  return assets
    .filter(a => a.status !== 'Archived' && a.files.some(f => f.type.startsWith('image/') || f.type.startsWith('video/')))
    .map(a => ({ id: a.id, title: a.title, category: a.category, status: a.status, files: a.files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/')).map(f => ({ name: f.name, url: f.url, type: f.type, thumb: f.thumb })) }))
}
