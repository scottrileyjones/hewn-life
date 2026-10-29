/**
 * Licensed Adobe Stock photography, hosted in the "Hewn Life Website" folder
 * on Cloudinary. Photos sit alongside the generated terrain and glyphs, never
 * in place of them: terrain owns heroes and closing panels, photos show the
 * people and craft the work is for.
 */

const CLOUD = 'https://res.cloudinary.com/dsx2wcqte/image/upload'

export type PhotoKey =
  | 'cafeOwner'
  | 'baristas'
  | 'creator'
  | 'teamMeeting'
  | 'leatherArtisan'
  | 'clayHands'
  | 'woodCarving'
  | 'rockStrata'
  | 'foliage'
  | 'coastPhone'

type Photo = { id: string; alt: string; gravity?: string }

export const photos: Record<PhotoKey, Photo> = {
  cafeOwner: { id: 'v1793234720/AdobeStock_2168699755_av5jgr', alt: 'A café owner opening the front door beside an open sign', gravity: 'g_auto:faces' },
  baristas: { id: 'v1793234574/AdobeStock_301217951_y5anhb', alt: 'Two café staff making drinks at the espresso machine', gravity: 'g_auto:faces' },
  creator: { id: 'v1793234643/AdobeStock_1925539446_lrgx9m', alt: 'A creator filming a video in a bright home studio', gravity: 'g_auto:faces' },
  teamMeeting: { id: 'v1793234804/AdobeStock_181374392_xhct8q', alt: 'A small team working through a plan around a wooden table', gravity: 'g_auto:faces' },
  leatherArtisan: { id: 'v1793234254/AdobeStock_265218395_ojhdw6', alt: 'An artisan cutting leather for a bag in a sunlit workshop' },
  clayHands: { id: 'v1793234175/AdobeStock_2220011334_pq81dy', alt: 'Hands shaping a raw clay bowl on a potter’s wheel' },
  woodCarving: { id: 'v1793234143/AdobeStock_2179940499_jy5dpe', alt: 'Hands carving a wooden sculpture with a knife' },
  rockStrata: { id: 'v1793234450/AdobeStock_2187810424_mhixbr', alt: 'A layered red rock wall, the strata laid down over time' },
  foliage: { id: 'v1793234537/AdobeStock_2223507264_gbpel2', alt: 'Soft green foliage in warm light' },
  coastPhone: { id: 'v1793233385/AdobeStock_2074439565_j443st', alt: 'A woman checking her phone beside her car on the coast at sunset', gravity: 'g_auto:faces' },
}

/** Delivery URL cropped to w×h, graded slightly cooler and softer so the set reads as one. */
export function photoUrl(key: PhotoKey, w: number, h: number) {
  const p = photos[key]
  return `${CLOUD}/c_fill,${p.gravity ?? 'g_auto'},w_${w},h_${h}/e_vibrance:-20/f_auto,q_auto/${p.id}.jpg`
}

/** srcset at 1×, 1.5× and 2× of a base size, keeping the aspect ratio. */
export function photoSrcSet(key: PhotoKey, w: number, h: number) {
  return [1, 1.5, 2].map(s => `${photoUrl(key, Math.round(w * s), Math.round(h * s))} ${Math.round(w * s)}w`).join(', ')
}

/** One photo per pillar, shown under the playbook title. */
export const pillarPhotos: Record<string, PhotoKey> = {
  strategy: 'teamMeeting',
  'performance-media': 'coastPhone',
  'creative-production': 'woodCarving',
  'seo-aeo': 'cafeOwner',
  creators: 'creator',
  lifecycle: 'baristas',
  'data-attribution': 'rockStrata',
  social: 'leatherArtisan',
  brand: 'clayHands',
}
