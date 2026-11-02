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
  // Checkout galleries
  | 'teamPlanning'
  | 'cityWalkPhone'
  | 'kitchenMorning'
  | 'logoSketch'
  | 'bakerTablet'
  | 'brownstones'
  | 'officeWalk'
  | 'creatorFilming'
  | 'friendsWalking'
  | 'ownerPortrait'
  | 'cafePhone'
  | 'sketching'

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
  teamPlanning: { id: 'v1793575114/hewn-09-AdobeStock_315350012', alt: 'Two people planning a campaign at a wall of sketches and notes' },
  cityWalkPhone: { id: 'v1793575151/hewn-21-AdobeStock_223003575', alt: 'A man walking down a city street with a coffee and his phone', gravity: 'g_auto:faces' },
  kitchenMorning: { id: 'v1793575194/hewn-24-AdobeStock_1839128313', alt: 'A woman in a bright kitchen in the morning', gravity: 'g_auto:faces' },
  logoSketch: { id: 'v1793575155/hewn-11-AdobeStock_227745736', alt: 'A hand sketching logo ideas on paper' },
  bakerTablet: { id: 'v1793575192/hewn-23-AdobeStock_1080914151', alt: 'A smiling baker holding a tablet in his bakery', gravity: 'g_auto:faces' },
  brownstones: { id: 'v1793575099/hewn-42-AdobeStock_555190991', alt: 'A row of brownstones on a neighbourhood street' },
  officeWalk: { id: 'v1793575106/hewn-45-AdobeStock_493417736', alt: 'Two colleagues walking and talking through a bright office', gravity: 'g_auto:faces' },
  creatorFilming: { id: 'v1793575157/hewn-13-AdobeStock_444842611', alt: 'A creator filming herself on a phone on a tripod', gravity: 'g_auto:faces' },
  friendsWalking: { id: 'v1793575116/hewn-22-AdobeStock_1294643860', alt: 'Two men talking as they walk outside', gravity: 'g_auto:faces' },
  ownerPortrait: { id: 'v1793575161/hewn-15-AdobeStock_839435574', alt: 'A smiling business owner in a pink blazer', gravity: 'g_auto:faces' },
  cafePhone: { id: 'v1793575159/hewn-14-AdobeStock_1501505131', alt: 'A woman smiling at her phone in a café', gravity: 'g_auto:faces' },
  sketching: { id: 'v1793575153/hewn-10-AdobeStock_535693047', alt: 'Hands sketching ideas on paper' },
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
