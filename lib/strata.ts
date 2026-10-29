/**
 * Strata: the Hewn graphic language.
 *
 * Seeded noise (so server and client draw identical shapes), the custom
 * glyph set cut from the H mark, and the colour scenes the terrain canvas
 * paints. Everything here is pure data or pure functions.
 */

export const colors = {
  bone: '#F7F6F3',
  paper: '#FFFFFF',
  sand: '#E9E5DB',
  ink: '#0D0D0D',
  forest: '#1E3826',
  forest2: '#2A4A32',
  lichen: '#6BAD3D',
  lime: '#D6F28B',
  dawn: '#D9893F',
  mist: '#F4F2EC',
}

/* ── Seeded noise ───────────────────────────────────────────── */

export function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function noise1(seed: number) {
  const r = rng(seed)
  const pts = Array.from({ length: 512 }, r)
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number) => {
    const i = Math.floor(x)
    const f = x - i
    const a = pts[((i % 512) + 512) % 512]
    const b = pts[(((i + 1) % 512) + 512) % 512]
    return a + (b - a) * smooth(f)
  }
}

export function fbm(n: (x: number) => number, x: number, octaves = 5) {
  let v = 0
  let amp = 0.5
  let freq = 1
  for (let o = 0; o < octaves; o++) {
    v += amp * n(x * freq)
    amp *= 0.5
    freq *= 2.03
  }
  return v
}

const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
export const hexRgb = (h: string) => hex(h).join(',')
export function mix(a: string, b: string, t: number) {
  const A = hex(a)
  const B = hex(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`
}

/* ── Glyphs: built from the mark's uprights and its 24° cut ─── */

export type GlyphKey = 'strategy' | 'media' | 'creative' | 'seo' | 'creators' | 'lifecycle' | 'data' | 'social' | 'brand'

type Upright = { u: [number, number, number, number]; accent?: boolean }
type Cut = { c: [number, number, number, number, number]; accent?: boolean }
export type GlyphPart = Upright | Cut

export const glyphs: Record<GlyphKey, GlyphPart[]> = {
  strategy: [{ u: [14, 30, 18, 56] }, { u: [68, 14, 18, 72] }, { c: [32, 56, 68, 40, 12], accent: true }, { c: [68, 30, 90, 20, 8], accent: true }],
  media: [{ u: [10, 58, 14, 28] }, { u: [43, 40, 14, 46] }, { u: [76, 14, 14, 72] }, { c: [24, 62, 76, 38, 9], accent: true }],
  creative: [{ u: [14, 14, 18, 72] }, { c: [32, 70, 86, 46, 10], accent: true }, { c: [32, 52, 86, 28, 10] }, { c: [32, 34, 86, 10, 10] }],
  seo: [{ u: [14, 14, 18, 72] }, { u: [68, 14, 18, 72] }, { c: [32, 58, 68, 42, 12] }, { u: [36, 14, 28, 10], accent: true }],
  creators: [{ u: [10, 40, 16, 46] }, { u: [42, 22, 16, 64], accent: true }, { u: [74, 40, 16, 46] }, { c: [26, 56, 42, 49, 10] }, { c: [58, 49, 74, 56, 10] }],
  lifecycle: [{ u: [14, 14, 18, 72] }, { u: [68, 14, 18, 72] }, { c: [32, 40, 68, 24, 10], accent: true }, { c: [32, 76, 68, 60, 10], accent: true }],
  data: [{ u: [14, 14, 6, 72] }, { u: [14, 80, 72, 6] }, { c: [26, 70, 86, 32, 9], accent: true }, { u: [44, 54, 6, 26] }, { u: [64, 44, 6, 36] }],
  social: [{ u: [14, 14, 18, 72] }, { u: [41, 14, 18, 72] }, { u: [68, 14, 18, 72] }, { c: [14, 66, 86, 34, 9], accent: true }],
  brand: [{ u: [14, 14, 18, 72] }, { u: [68, 14, 18, 72] }, { c: [32, 58, 68, 42, 12], accent: true }],
}

/* ── Terrain scenes ─────────────────────────────────────────── */

export type SceneName =
  | 'amber' | 'ember' | 'sage' | 'valley'
  | 'forge' | 'canyon' | 'topo' | 'woodgrain' | 'forest' | 'meadow' | 'night' | 'highland' | 'harvest'

/**
 * How the land is drawn. Every form shares the light, contours and grain, and each
 * speaks to the craft: stone carved, wood grown, metal forged, ground surveyed.
 */
export type SceneForm = 'ridges' | 'dunes' | 'mesa' | 'hills' | 'topo' | 'forest' | 'rings' | 'forge'

export interface Scene {
  sky: string[]
  far: string
  near: string
  /** x, y as fractions of the canvas; colour; peak alpha */
  sun: [number, number, string, number]
  layers: number
  fog: string
  contour: string
  horizon: number
  /** Defaults to ridges, the original mountain scene. */
  form?: SceneForm
  /** Scatter stars in the sky (night scenes). */
  stars?: boolean
}

export const scenes: Record<SceneName, Scene> = {
  amber: { sky: ['#1A120B', '#3A2414', '#8C5426', '#E3A15C'], far: '#9B7A57', near: '#140F0A', sun: [0.7, 0.52, '#FFD59A', 1], layers: 7, fog: '255,214,160', contour: 'rgba(255,230,200,0.10)', horizon: 0.55 },
  ember: { sky: ['#120B06', '#2B1A0E', '#7A4520', '#D9893F'], far: '#7B5A3E', near: '#120B06', sun: [0.32, 0.6, '#FFC27A', 1], layers: 6, fog: '255,200,140', contour: 'rgba(255,220,180,0.08)', horizon: 0.6 },
  sage: { sky: ['#C9D3C2', '#DCE2D4', '#EDEFE6', '#F4F2EC'], far: '#B7C4AF', near: '#2A4A32', sun: [0.7, 0.25, '#FFFFFF', 0.6], layers: 7, fog: '244,242,236', contour: 'rgba(30,56,38,0.10)', horizon: 0.42 },
  valley: { sky: ['#4E6A52', '#7D9479', '#B8C4AE', '#E6DCC4'], far: '#93A58A', near: '#1E3826', sun: [0.62, 0.48, '#FFF2D6', 0.9], layers: 8, fog: '244,242,236', contour: 'rgba(244,242,236,0.12)', horizon: 0.5 },
  // Page headers: one form and palette per page, same graphic language.
  forge: { form: 'forge', sky: ['#0A0706', '#1A100B', '#2E1A10', '#4A2814'], far: '#3A2A22', near: '#0B0807', sun: [0.62, 0.66, '#FF9A3C', 0.85], layers: 5, fog: '255,150,70', contour: 'rgba(255,190,140,0.08)', horizon: 0.5 },
  woodgrain: { form: 'rings', sky: ['#2A1A10', '#4A2E1A', '#7A4E2C', '#B07A48'], far: '#C08A56', near: '#3A2214', sun: [0.3, 0.3, '#FFDDB0', 0.45], layers: 26, fog: '255,220,180', contour: 'rgba(40,20,10,0.38)', horizon: 0 },
  forest: { form: 'forest', sky: ['#1A2620', '#33463A', '#6E8270', '#C4CDB8'], far: '#6E8270', near: '#0E1612', sun: [0.66, 0.4, '#F4F2EC', 0.7], layers: 6, fog: '228,234,222', contour: 'rgba(240,244,236,0.08)', horizon: 0.42 },
  canyon: { form: 'mesa', sky: ['#1E120C', '#4A2616', '#A4552C', '#E59A62'], far: '#B0673E', near: '#1C0F09', sun: [0.28, 0.5, '#FFD0A0', 0.9], layers: 6, fog: '255,196,150', contour: 'rgba(255,214,180,0.12)', horizon: 0.42 },
  topo: { form: 'topo', sky: ['#14251A', '#1E3826', '#2A4A32', '#3D5A42'], far: '#2A4A32', near: '#132318', sun: [0.75, 0.3, '#D6F28B', 0.35], layers: 14, fog: '214,242,139', contour: 'rgba(214,242,139,0.32)', horizon: 0 },
  meadow: { form: 'hills', sky: ['#24301A', '#4E5A28', '#A8984A', '#EAD48E'], far: '#9AA650', near: '#101A0A', sun: [0.72, 0.4, '#FFF0C0', 1], layers: 5, fog: '250,236,190', contour: 'rgba(250,240,200,0.24)', horizon: 0.46 },
  night: { form: 'ridges', stars: true, sky: ['#05080A', '#0B1512', '#16261E', '#2A4034'], far: '#2E4638', near: '#050806', sun: [0.74, 0.24, '#E6F0DC', 0.55], layers: 6, fog: '200,220,205', contour: 'rgba(214,242,200,0.07)', horizon: 0.58 },
  highland: { form: 'ridges', sky: ['#18242A', '#34484C', '#6E8580', '#C2CCC0'], far: '#7E928A', near: '#121A1C', sun: [0.4, 0.46, '#F4F2EC', 0.8], layers: 8, fog: '230,236,230', contour: 'rgba(240,244,238,0.10)', horizon: 0.48 },
  harvest: { form: 'dunes', sky: ['#2A1E0C', '#6A4A18', '#C08A34', '#F0CE80'], far: '#C49448', near: '#2A1A08', sun: [0.62, 0.38, '#FFF0C8', 1], layers: 5, fog: '255,236,190', contour: 'rgba(255,240,210,0.13)', horizon: 0.5 },
}

/** A ridge of `points` samples across `width`, for small SVG charts. */
export function ridge(seed: number, width: number, step: number, fn: (x: number, n: (x: number) => number) => number) {
  const n = noise1(seed)
  const pts: [number, number][] = []
  for (let x = 0; x <= width; x += step) pts.push([x, fn(x, n)])
  return pts
}

export const pathOf = (pts: [number, number][], dy = 0) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${(y + dy).toFixed(1)}`).join(' ')
