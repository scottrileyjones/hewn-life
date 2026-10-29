'use client'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { contours } from 'd3-contour'
import { createNoise2D } from 'simplex-noise'
import { fmtMoney } from '@/lib/growthMap'

/**
 * Growth map: a copper contour map drawn as SVG from a seeded heightfield.
 * The "You are here" marker sits at an elevation proportional to `score`, and a
 * dashed trail climbs through the waypoints to the summit. Labels are HTML
 * glass chips laid over the SVG.
 */

type Props = {
  /** Marketing health score, 0–100. Sets how high up the slope you stand. */
  score: number
  /** Added revenue a year at the summit. 0 or less hides the dollar legend. */
  summitValue: number
  /** Pillar names, in route order. */
  waypoints: string[]
  /** Seed for the terrain; use hashAnswers() so the same answers draw the same land. */
  seed?: number
  showLabels?: boolean
  /** Small chip in the top-left corner, e.g. "Growth map · Sample". */
  label?: string
  className?: string
}

const LEVELS = 16
const CELL = 5 // px per heightfield sample
const PAD = 2 // samples past each edge, so contour rings close off-canvas

type Pt = { x: number; y: number }

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Uniform Catmull-Rom through the points, as cubic Bézier segments. */
function catmullRom(p: Pt[]): string {
  if (p.length < 2) return ''
  let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += `C${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

function buildMap(w: number, h: number, score: number, nWaypoints: number, seed: number) {
  const rand = mulberry32(seed)
  const noise = createNoise2D(rand)
  const ar = w / h

  // Summit up and to the right, trailhead low on the left, nudged per seed.
  const S = { u: 0.74 + (rand() - 0.5) * 0.06, v: 0.38 + (rand() - 0.5) * 0.05 }
  const B = { u: 0.06 + rand() * 0.03, v: 0.92 - rand() * 0.02 }
  // Distance from the summit to the trailhead, so the mountain spans the climb.
  const R = Math.hypot((B.u - S.u) * ar, B.v - S.v) * 1.15

  // The mountain itself: a broad slope rising to the summit, then a rounded cap on top.
  const slope = (u: number, v: number) => Math.pow(Math.max(0, 1 - Math.hypot((u - S.u) * ar, v - S.v) / R), 0.85)
  const landform = (u: number, v: number) => {
    const d = Math.hypot((u - S.u) * ar, v - S.v)
    return slope(u, v) + 0.25 * Math.exp(-(d * d) / (2 * 0.12 * 0.12))
  }
  const height = (u: number, v: number) => {
    let n = 0, amp = 0.5, f = 1.8
    for (let o = 0; o < 4; o++) { n += amp * noise(u * ar * f + 11, v * f - 7); amp *= 0.5; f *= 2.1 }
    return landform(u, v) + 0.2 * n
  }

  // Heightfield over the frame plus a margin.
  const nx = Math.ceil(w / CELL) + 1 + PAD * 2
  const ny = Math.ceil(h / CELL) + 1 + PAD * 2
  const values = new Float64Array(nx * ny)
  let lo = Infinity, hi = -Infinity
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const z = height(((i - PAD) * CELL) / w, ((j - PAD) * CELL) / h)
      values[i + j * nx] = z
      if (z < lo) lo = z
      if (z > hi) hi = z
    }
  }
  const step = (hi - lo) / (LEVELS + 1)
  const thresholds = Array.from({ length: LEVELS }, (_, k) => lo + step * (k + 1))
  const toPx = (c: number) => (c - 0.5 - PAD) * CELL
  let thin = '', index = ''
  contours().size([nx, ny]).thresholds(thresholds)(Array.from(values)).forEach((mp, k) => {
    let d = ''
    for (const poly of mp.coordinates) for (const ring of poly) {
      d += ring.map((c, n) => `${n ? 'L' : 'M'}${toPx(c[0]).toFixed(1)},${toPx(c[1]).toFixed(1)}`).join('') + 'Z'
    }
    if ((k + 1) % 4 === 0) index += d
    else thin += d
  })

  // "You are here": the first point on the climb at the score's elevation.
  // Walk up the slope (no cap, no surface noise) to the score's share of the climb.
  const hB = slope(B.u, B.v), hS = slope(S.u, S.v)
  const target = hB + (Math.min(100, Math.max(0, score)) / 100) * (hS - hB) * 0.7
  let t = 0
  for (; t < 0.9; t += 0.005) if (slope(B.u + (S.u - B.u) * t, B.v + (S.v - B.v) * t) >= target) break
  const M = { x: (B.u + (S.u - B.u) * t) * w, y: (B.v + (S.v - B.v) * t) * h }
  const Sp = { x: S.u * w, y: S.v * h }

  // Waypoints wind between the marker and the summit.
  const len = Math.hypot(Sp.x - M.x, Sp.y - M.y)
  const nrm = { x: -(Sp.y - M.y) / len, y: (Sp.x - M.x) / len }
  const wps: Pt[] = Array.from({ length: nWaypoints }, (_, k) => {
    const f = (k + 1) / (nWaypoints + 1)
    const off = (k % 2 ? -1 : 1) * len * (0.13 + rand() * 0.06)
    return { x: M.x + (Sp.x - M.x) * f + nrm.x * off, y: M.y + (Sp.y - M.y) * f + nrm.y * off }
  })

  return { thin, index, marker: M, summit: Sp, wps, trail: catmullRom([M, ...wps, Sp]) }
}

type Box = { x: number; y: number; w: number; h: number }

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))

/** Puts each chip beside its point, at the spot that overlaps the least: other chips, dots, edges. */
function placeChips(items: { p: Pt; w: number; h: number }[], fixed: Box[], W: number, H: number): Box[] {
  const taken = [...fixed]
  const inside = { x: 8, y: 8, w: W - 16, h: H - 16 }
  return items.map(({ p, w, h }) => {
    const g = 20
    const spots: Box[] = [
      { x: p.x + g, y: p.y - h / 2, w, h }, { x: p.x - g - w, y: p.y - h / 2, w, h },
      { x: p.x - w / 2, y: p.y + 18, w, h }, { x: p.x - w / 2, y: p.y - 18 - h, w, h },
      { x: p.x + g - 6, y: p.y + 8, w, h }, { x: p.x - w - g + 6, y: p.y + 8, w, h },
      { x: p.x + g - 6, y: p.y - 8 - h, w, h }, { x: p.x - w - g + 6, y: p.y - 8 - h, w, h },
    ]
    let best = spots[0], bestCost = Infinity
    spots.forEach((s, i) => {
      const cost = taken.reduce((c, b) => c + overlap(s, b), 0) + (s.w * s.h - overlap(s, inside)) * 4 + i * 4
      if (cost < bestCost) { best = s; bestCost = cost }
    })
    taken.push(best)
    return best
  })
}

const chip = 'absolute border border-white/[0.22] bg-white/[0.14] text-bone shadow-glass backdrop-blur-md [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]'

export default function TerrainMap({ score, summitValue, waypoints, seed = 1, showLabels = false, label, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 358, h: 400 })
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width), h = Math.round(e.contentRect.height)
      if (w > 0 && h > 0) setSize(s => (s.w === w && s.h === h ? s : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const map = useMemo(() => buildMap(w, h, score, waypoints.length, seed), [w, h, score, waypoints.length, seed])
  const pct = (p: Pt) => ({ left: `${(p.x / w) * 100}%`, top: `${(p.y / h) * 100}%` })
  const perLine = summitValue > 0 ? fmtMoney(summitValue / LEVELS) : null
  const summitLabel = summitValue > 0 ? `+${fmtMoney(summitValue)}` : null

  const chips = useMemo(() => {
    if (!showLabels) return null
    const dot = (p: Pt, r: number): Box => ({ x: p.x - r, y: p.y - r, w: r * 2, h: r * 2 })
    const fixed: Box[] = [
      { x: w - 152, y: 12, w: 140, h: summitLabel ? 84 : 72 },
      { x: 12, y: h - 52, w: 40, h: 40 },
      { x: map.summit.x - 12, y: map.summit.y - 22, w: 24, h: 24 },
      dot(map.marker, 14),
      ...map.wps.map(p => dot(p, 13)),
    ]
    // Keep chips off the trail itself.
    const pts = [map.marker, ...map.wps, map.summit]
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1], n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 10)
      for (let s = 1; s < n; s++) fixed.push(dot({ x: a.x + ((b.x - a.x) * s) / n, y: a.y + ((b.y - a.y) * s) / n }, 4))
    }
    if (label) fixed.push({ x: 12, y: 14, w: label.length * 8 + 24, h: 26 })
    if (perLine) fixed.push({ x: w - 172, y: h - 40, w: 160, h: 28 })
    return placeChips([
      { p: map.marker, w: 104, h: 28 },
      ...waypoints.slice(0, map.wps.length).map((name, i) => ({ p: map.wps[i], w: name.length * 7.4 + 22, h: 24 })),
    ], fixed, w, h)
  }, [showLabels, map, waypoints, label, summitLabel, perLine, w, h])
  const at = (b: Box) => ({ left: b.x, top: b.y, width: b.w })

  const aria = `Growth map: a trail climbs from your position, health score ${score}, through ${waypoints.join(', ')} to the summit${
    summitLabel ? `, about ${summitLabel} a year in added revenue` : ''}.`

  return (
    <div ref={ref} role="img" aria-label={aria} className={`relative isolate overflow-hidden rounded-[24px] bg-[#5A3518] ${className}`}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 block h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id={`g1${uid}`} cx={`${(map.summit.x / w) * 100}%`} cy={`${(map.summit.y / h) * 100}%`} r="70%">
            <stop offset="0" stopColor="#C9844A" />
            <stop offset="0.55" stopColor="#9A5A2A" />
            <stop offset="1" stopColor="#5A3518" />
          </radialGradient>
          <filter id={`gr${uid}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed % 997} />
            <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.06  0 0 0 0 0.03  0 0 0 0.55 0" />
          </filter>
          <mask id={`m${uid}`} maskUnits="userSpaceOnUse">
            <path d={map.trail} pathLength={1} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" className="trail-draw" />
          </mask>
        </defs>
        <rect width={w} height={h} fill={`url(#g1${uid})`} />
        <rect width={w} height={h} filter={`url(#gr${uid})`} opacity="0.6" />
        <path d={map.thin} fill="none" stroke="#F7F6F3" strokeOpacity="0.3" strokeWidth="0.8" strokeLinejoin="round" />
        <path d={map.index} fill="none" stroke="#F7F6F3" strokeOpacity="0.55" strokeWidth="1.3" strokeLinejoin="round" />
        <g mask={`url(#m${uid})`}>
          <path d={map.trail} fill="none" stroke="#0D0D0D" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
          <path d={map.trail} fill="none" stroke="#F7F6F3" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
        </g>
      </svg>

      {/* Summit flag */}
      <svg width="22" height="20" viewBox="0 0 22 20" aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-full" style={pct(map.summit)}>
        <path d="M11 2 L20 18 L2 18 Z" fill="#6BAD3D" stroke="#0D0D0D" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>

      {/* Waypoints */}
      {map.wps.map((p, i) => (
        <div key={i}>
          <span className="absolute flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone font-display text-[11px] font-bold text-iron shadow-[0_2px_8px_rgba(0,0,0,0.35)]" style={pct(p)}>
            {i + 1}
          </span>
          {chips?.[i + 1] && waypoints[i] && (
            <span className={`${chip} whitespace-nowrap rounded-full px-2.5 py-[7px] text-center font-mono text-[10px] font-medium uppercase leading-none tracking-[0.14em]`} style={at(chips[i + 1])}>
              {waypoints[i]}
            </span>
          )}
        </div>
      ))}

      {/* You are here */}
      <span className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bone bg-ember shadow-[0_0_0_6px_rgba(107,173,61,0.28)]" style={pct(map.marker)} />
      {chips && (
        <span className={`${chip} rounded-full px-3 py-[8px] text-center font-body text-[12px] font-semibold leading-none`} style={at(chips[0])}>
          You are here
        </span>
      )}

      {showLabels && label && (
        <span className={`${chip} left-3 top-3.5 rounded-full px-2.5 py-[7px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-bone/90`}>
          {label}
        </span>
      )}

      {showLabels && (
        <div className={`${chip} right-3 top-3 flex w-[140px] flex-col gap-1 rounded-2xl px-3.5 py-3`}>
          <span className="font-mono text-[10px] font-medium uppercase leading-snug tracking-[0.2em] text-lime">Summit</span>
          {summitLabel ? (
            <>
              <span className="font-display text-[26px] font-bold leading-none tracking-[-0.02em]">{summitLabel}</span>
              <span className="font-body text-[12px] leading-snug text-bone/80">a year, within reach</span>
            </>
          ) : (
            <span className="font-display text-[18px] font-bold leading-tight">Your first customers</span>
          )}
        </div>
      )}

      {showLabels && perLine && (
        <div className={`${chip} bottom-3 right-3 flex items-center gap-2 rounded-full px-2.5 py-[7px]`}>
          <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden="true"><path d="M1 6 C5 1, 13 1, 17 6" fill="none" stroke="#F7F6F3" strokeWidth="1.3" /></svg>
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-bone/90">1 line ≈ {perLine} / yr</span>
        </div>
      )}

      {/* Compass mark: this is a map, not a chart. */}
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="absolute bottom-3 left-3 opacity-80">
        <circle cx="20" cy="20" r="15" fill="none" stroke="#F7F6F3" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M20 7 L24 21 L20 18 L16 21 Z" fill="#F7F6F3" />
        <path d="M20 33 L24 21 L20 24 L16 21 Z" fill="#F7F6F3" fillOpacity="0.35" />
      </svg>
    </div>
  )
}
