'use client'
import { useEffect, useRef } from 'react'
import { scenes, noise1, fbm, mix, hexRgb, rng, type Scene, type SceneName } from '@/lib/strata'

let grainTile: HTMLCanvasElement | null = null
function grain() {
  if (grainTile) return grainTile
  grainTile = document.createElement('canvas')
  grainTile.width = grainTile.height = 160
  const g = grainTile.getContext('2d')!
  const d = g.createImageData(160, 160)
  const r = rng(99)
  for (let i = 0; i < d.data.length; i += 4) {
    const v = r() * 255
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v
    d.data[i + 3] = 24
  }
  g.putImageData(d, 0, 0)
  return grainTile
}

type Ctx = CanvasRenderingContext2D

function skyAndSun(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  const sky = c.createLinearGradient(0, 0, 0, H * sc.horizon + 40)
  sc.sky.forEach((col, i) => sky.addColorStop(i / (sc.sky.length - 1), col))
  c.fillStyle = sky
  c.fillRect(0, 0, W, H)

  if (sc.stars) {
    const r = rng(seed * 17 + 3)
    for (let i = 0; i < (W * H) / 2600; i++) {
      const x = r() * W
      const y = r() * H * sc.horizon * 0.95
      const a = 0.25 + r() * 0.6
      c.fillStyle = `rgba(240,244,236,${a * (1 - y / (H * sc.horizon))})`
      c.fillRect(x, y, r() < 0.08 ? 1.6 : 1, r() < 0.08 ? 1.6 : 1)
    }
  }

  const [sx, sy, scol, sa] = sc.sun
  const s = hexRgb(scol)
  const sun = c.createRadialGradient(W * sx, H * sy, 0, W * sx, H * sy, Math.max(W, H) * 0.6)
  sun.addColorStop(0, `rgba(${s},${sa})`)
  sun.addColorStop(0.07, `rgba(${s},${sa * 0.6})`)
  sun.addColorStop(0.32, `rgba(${s},${sa * 0.14})`)
  sun.addColorStop(1, `rgba(${s},0)`)
  c.fillStyle = sun
  c.fillRect(0, 0, W, H)
}

function fogBand(c: Ctx, sc: Scene, W: number, top: number, h: number, a: number) {
  const fog = c.createLinearGradient(0, top, 0, top + h)
  fog.addColorStop(0, `rgba(${sc.fog},0)`)
  fog.addColorStop(0.55, `rgba(${sc.fog},${a})`)
  fog.addColorStop(1, `rgba(${sc.fog},0)`)
  c.fillStyle = fog
  c.fillRect(0, top, W, h)
}

function fillUnder(c: Ctx, W: number, H: number, yAt: (x: number) => number, fill: string | CanvasGradient, step = 3) {
  c.beginPath()
  c.moveTo(0, H)
  for (let x = 0; x <= W; x += step) c.lineTo(x, yAt(x))
  c.lineTo(W, H)
  c.closePath()
  c.fillStyle = fill
  c.fill()
}

/** The original scene: distant ridges with engraved contours and fog. */
function ridges(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  for (let i = 0; i < sc.layers; i++) {
    const t = i / (sc.layers - 1)
    const n = noise1(seed * 31 + i * 7)
    const base = H * (sc.horizon + t * (0.98 - sc.horizon) * 0.78)
    const amp = H * (0.05 + 0.12 * (1 - Math.abs(t - 0.35)))
    const freq = 2.2 + i * 0.9
    const off = seed * 3.1 + i * 11
    const yAt = (x: number) => base - amp * (fbm(n, off + (x / W) * freq) - 0.25) * 1.6

    fillUnder(c, W, H, yAt, mix(sc.far, sc.near, Math.pow(t, 0.8)))

    if (i >= 2 && i <= sc.layers - 2) {
      c.strokeStyle = sc.contour
      c.lineWidth = 1
      for (let k = 1; k <= 5; k++) {
        c.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const y = yAt(x) + k * amp * 0.16 + Math.sin(x / 90 + k) * 2
          x ? c.lineTo(x, y) : c.moveTo(x, y)
        }
        c.stroke()
      }
    }
    fogBand(c, sc, W, base - amp, amp * 1.8, 0.18 * (1 - t))
  }
}

/** Long wind-shaped dunes with ripple lines that follow each crest. */
function dunes(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  for (let i = 0; i < sc.layers; i++) {
    const t = i / (sc.layers - 1)
    const n = noise1(seed * 13 + i * 5)
    const base = H * (sc.horizon + t * (1.02 - sc.horizon) * 0.8)
    const amp = H * (0.04 + 0.09 * t)
    const phase = seed * 0.7 + i * 1.9
    const freq = 1.1 + (1 - t) * 1.4
    const yAt = (x: number) => {
      const u = (x / W) * freq * Math.PI * 2 + phase
      // Asymmetric crest: gentle windward slope, steep slip face.
      const wave = Math.sin(u) + 0.35 * Math.sin(2 * u + 0.6)
      return base - amp * wave - amp * 0.6 * (fbm(n, x / W * 2 + i, 3) - 0.5)
    }
    const top = base - amp * 1.6
    const g = c.createLinearGradient(0, top, 0, base + amp * 2)
    g.addColorStop(0, mix(sc.far, sc.near, Math.pow(t, 0.9) * 0.7))
    g.addColorStop(1, mix(sc.far, sc.near, Math.min(1, Math.pow(t, 0.9) + 0.25)))
    fillUnder(c, W, H, yAt, g)

    c.strokeStyle = sc.contour
    c.lineWidth = 1
    for (let k = 1; k <= 7; k++) {
      c.beginPath()
      for (let x = 0; x <= W; x += 4) {
        const y = yAt(x) + k * (4 + t * 9) + Math.sin(x / 40 + k * 1.3) * 1.2
        x ? c.lineTo(x, y) : c.moveTo(x, y)
      }
      c.stroke()
    }
    fogBand(c, sc, W, top, amp * 2.6, 0.16 * (1 - t))
  }
}

/** Flat-topped mesas whose faces show horizontal rock strata. */
function mesa(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  for (let i = 0; i < sc.layers; i++) {
    const t = i / (sc.layers - 1)
    const n = noise1(seed * 23 + i * 9)
    const base = H * (sc.horizon + t * (1 - sc.horizon) * 0.82)
    const amp = H * (0.1 + 0.12 * (1 - t))
    const freq = 1.6 + i * 0.6
    const off = seed * 2.3 + i * 13
    const steps = 4
    const yAt = (x: number) => {
      const r = fbm(n, off + (x / W) * freq, 4) * steps * 1.6
      const lo = Math.floor(r)
      const f = r - lo
      const plateau = (lo + Math.pow(f, 7)) / (steps * 1.6)
      return base - amp * (plateau - 0.2) * 2.2
    }
    const fill = mix(sc.far, sc.near, Math.pow(t, 0.75))
    c.save()
    c.beginPath()
    c.moveTo(0, H)
    for (let x = 0; x <= W; x += 2) c.lineTo(x, yAt(x))
    c.lineTo(W, H)
    c.closePath()
    c.fillStyle = fill
    c.fill()
    c.clip()
    // Strata: thin horizontal bands, slightly wavy, alternating light and dark.
    const band = 5 + t * 7
    for (let y = base - amp * 2; y < H; y += band) {
      const k = Math.round(y / band)
      c.strokeStyle = k % 3 === 0 ? sc.contour : `rgba(0,0,0,${0.08 + 0.06 * t})`
      c.lineWidth = k % 3 === 0 ? 1.2 : 0.8
      c.beginPath()
      for (let x = 0; x <= W; x += 6) {
        const yy = y + Math.sin(x / 140 + k) * 1.5
        x ? c.lineTo(x, yy) : c.moveTo(x, yy)
      }
      c.stroke()
    }
    c.restore()
    fogBand(c, sc, W, base - amp * 1.2, amp * 1.6, 0.2 * (1 - t))
  }
}

/** Close, rolling hills with furrow lines that follow the slope. */
function hills(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  for (let i = 0; i < sc.layers; i++) {
    const t = i / (sc.layers - 1)
    const n = noise1(seed * 19 + i * 11)
    const base = H * (sc.horizon + t * (1.08 - sc.horizon) * 0.78)
    const amp = H * (0.07 + 0.1 * t)
    const off = seed * 1.7 + i * 5
    const freq = 0.9 + (1 - t) * 1.1
    const yAt = (x: number) => base - amp * (fbm(n, off + (x / W) * freq, 2) - 0.45) * 2.4
    const g = c.createLinearGradient(0, base - amp, 0, base + amp * 2.5)
    g.addColorStop(0, mix(sc.far, sc.near, Math.pow(t, 1.1) * 0.75))
    g.addColorStop(1, mix(sc.far, sc.near, Math.min(1, Math.pow(t, 1.1) + 0.3)))
    fillUnder(c, W, H, yAt, g)
    c.strokeStyle = sc.contour
    c.lineWidth = 1
    const rows = 4 + Math.round(t * 6)
    for (let k = 1; k <= rows; k++) {
      c.beginPath()
      for (let x = 0; x <= W; x += 4) {
        const y = yAt(x) + k * (5 + t * 10) * (1 + k * 0.06)
        x ? c.lineTo(x, y) : c.moveTo(x, y)
      }
      c.stroke()
    }
    fogBand(c, sc, W, base - amp * 1.4, amp * 2.2, 0.2 * (1 - t))
  }
}

function noise2(seed: number) {
  const r = rng(seed)
  const N = 64
  const g = Array.from({ length: N * N }, r)
  const at = (i: number, j: number) => g[(((j % N) + N) % N) * N + (((i % N) + N) % N)]
  const sm = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const i = Math.floor(x), j = Math.floor(y)
    const fx = sm(x - i), fy = sm(y - j)
    const a = at(i, j) + (at(i + 1, j) - at(i, j)) * fx
    const b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * fx
    return a + (b - a) * fy
  }
}

/**
 * Sample a scalar field on a grid, fill it in bands and trace isolines through it
 * (marching squares). Shared by the survey map and the wood rings.
 */
function isoMap(
  c: Ctx, W: number, H: number,
  field: (x: number, y: number) => number,
  isos: number[],
  fillFor: (v: number) => string,
  lineFor: (iso: number, k: number) => [string, number],
  cell = 6,
) {
  const cols = Math.ceil(W / cell) + 1
  const rows = Math.ceil(H / cell) + 1
  const v: number[] = []
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) v.push(field(i * cell, j * cell))
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      c.fillStyle = fillFor(v[j * cols + i])
      c.fillRect(i * cell, j * cell, cell + 0.5, cell + 0.5)
    }
  }
  isos.forEach((iso, k) => {
    const [color, width] = lineFor(iso, k)
    c.strokeStyle = color
    c.lineWidth = width
    c.beginPath()
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = v[j * cols + i], b = v[j * cols + i + 1], d = v[(j + 1) * cols + i], e = v[(j + 1) * cols + i + 1]
        const x = i * cell, y = j * cell
        const pts: [number, number][] = []
        const lerp = (p: number, q: number) => (iso - p) / (q - p)
        if ((a < iso) !== (b < iso)) pts.push([x + cell * lerp(a, b), y])
        if ((b < iso) !== (e < iso)) pts.push([x + cell, y + cell * lerp(b, e)])
        if ((d < iso) !== (e < iso)) pts.push([x + cell * lerp(d, e), y + cell])
        if ((a < iso) !== (d < iso)) pts.push([x, y + cell * lerp(a, d)])
        if (pts.length >= 2) { c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[1][0], pts[1][1]) }
        if (pts.length === 4) { c.moveTo(pts[2][0], pts[2][1]); c.lineTo(pts[3][0], pts[3][1]) }
      }
    }
    c.stroke()
  })
}

function lightFrom(c: Ctx, sc: Scene, W: number, H: number, strength: number) {
  const [sx, sy, scol, sa] = sc.sun
  const glow = c.createRadialGradient(W * sx, H * sy, 0, W * sx, H * sy, Math.max(W, H) * 0.7)
  glow.addColorStop(0, `rgba(${hexRgb(scol)},${sa * strength})`)
  glow.addColorStop(1, `rgba(${hexRgb(scol)},0)`)
  c.fillStyle = glow
  c.fillRect(0, 0, W, H)
}

/** A top-down survey map: banded elevation with isolines, the plan before the build. */
function topo(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  const n = noise2(seed * 29 + 5)
  const scale = 3.2 / Math.max(W, H)
  const field = (x: number, y: number) => {
    let v = 0, a = 0.5, f = 1
    for (let o = 0; o < 4; o++) { v += a * n((x * scale + seed) * f, (y * scale + seed * 0.5) * f); a *= 0.5; f *= 2.1 }
    return v
  }
  const L = sc.layers
  isoMap(c, W, H, field,
    Array.from({ length: L - 1 }, (_, i) => (i + 1) / L),
    // Smooth elevation shading; the isolines carry the banding.
    v => mix(sc.near, sc.far, Math.min(1, Math.max(0, (v - 0.2) * 1.7))),
    (_, k) => [sc.contour, (k + 1) % 4 === 0 ? 1.6 : 0.9], 3)
  lightFrom(c, sc, W, H, 0.5)
}

/** The end grain of a cut log: growth rings, a few checks splitting from the heart. */
function rings(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  const n = noise2(seed * 37 + 2)
  const cx = W * 0.82, cy = H * 0.62
  const spacing = Math.max(W, H) / sc.layers
  const field = (x: number, y: number) => {
    const dx = x - cx, dy = (y - cy) * 1.15
    const ang = Math.atan2(dy, dx)
    const warp = (n(Math.cos(ang) * 2 + 7, Math.sin(ang) * 2 + 3) - 0.5) * 1.6 + (n(x / 140, y / 140) - 0.5) * 0.5
    return Math.hypot(dx, dy) / spacing + warp
  }
  isoMap(c, W, H, field,
    Array.from({ length: sc.layers + 6 }, (_, i) => i + 1),
    v => {
      // Earlywood is pale, latewood darkens toward each ring line.
      // Continuous across each ring line, so the bands don't step.
      const f = v - Math.floor(v)
      const late = Math.pow(f, 4) * (1 - f) * 8
      return mix(sc.far, sc.near, 0.15 + late * 0.5 + Math.min(0.3, v / (sc.layers * 3)))
    },
    (_, k) => [sc.contour, k % 5 === 4 ? 1.8 : 1.1], 2.5)
  // Radial checks: drying cracks from the heart.
  const r = rng(seed * 5 + 9)
  c.strokeStyle = 'rgba(20,10,5,0.55)'
  for (let k = 0; k < 3; k++) {
    const ang = Math.PI * (0.9 + r() * 0.7)
    const len = Math.max(W, H) * (0.05 + r() * 0.08)
    c.lineWidth = 1.5
    c.beginPath()
    c.moveTo(cx, cy)
    for (let d = 0; d <= len; d += 8) {
      const a = ang + Math.sin(d / 40 + k) * 0.03
      c.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d)
    }
    c.stroke()
  }
  lightFrom(c, sc, W, H, 0.4)
}

/** Ridges of pine in layered mist: growth, one row behind the next. */
function forest(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  for (let i = 0; i < sc.layers; i++) {
    const t = i / (sc.layers - 1)
    const n = noise1(seed * 43 + i * 13)
    const base = H * (sc.horizon + t * (1.02 - sc.horizon) * 0.8)
    const amp = H * (0.04 + 0.08 * t)
    const off = seed * 1.3 + i * 7
    const yAt = (x: number) => base - amp * (fbm(n, off + (x / W) * (1.4 + i * 0.4), 3) - 0.4) * 2
    const fill = mix(sc.far, sc.near, Math.pow(t, 0.7))
    const r = rng(seed * 101 + i)
    c.beginPath()
    c.moveTo(0, H)
    const step = 5 + t * 9
    for (let x = -step; x <= W + step; x += step * (0.6 + r() * 0.8)) {
      const y = yAt(Math.max(0, x))
      const h = (10 + t * 34) * (0.55 + r() * 0.9)
      const w = h * 0.34
      c.lineTo(x - w, y)
      c.lineTo(x, y - h)
      c.lineTo(x + w, y)
    }
    c.lineTo(W, H)
    c.closePath()
    c.fillStyle = fill
    c.fill()
    fogBand(c, sc, W, base - amp * 2 - 40 * t, amp * 3 + 60, 0.32 * (1 - t))
  }
}

/** Dark stone split by molten seams, sparks lifting off the heat. */
function forge(c: Ctx, sc: Scene, W: number, H: number, seed: number) {
  ridges(c, { ...sc, contour: sc.contour }, W, H, seed)
  const r = rng(seed * 11 + 4)
  const [, , scol] = sc.sun
  const hot = hexRgb(scol)
  const seam = (x: number, y: number, ang: number, len: number, depth: number) => {
    const pts: [number, number][] = [[x, y]]
    for (let d = 0; d < len; d += 10) {
      ang += (r() - 0.5) * 0.28 - Math.sin(ang) * 0.15
      x += Math.cos(ang) * 10
      y += Math.sin(ang) * 10
      pts.push([x, y])
      if (depth < 2 && r() < 0.05) seam(x, y, ang + (r() < 0.5 ? 0.9 : -0.9), len * 0.4, depth + 1)
    }
    const path = () => { c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))) }
    c.save()
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.shadowColor = `rgba(${hot},0.9)`
    c.shadowBlur = 18 - depth * 5
    path(); c.strokeStyle = `rgba(${hot},0.8)`; c.lineWidth = 3 - depth; c.stroke()
    c.shadowBlur = 0
    path(); c.strokeStyle = 'rgba(255,232,190,0.9)'; c.lineWidth = 1 - depth * 0.3; c.stroke()
    c.restore()
  }
  // Keep the seams inside the near rock, running along it rather than up into the sky.
  c.save()
  c.beginPath()
  c.rect(0, H * 0.7, W, H * 0.3)
  c.clip()
  for (let k = 0; k < 7; k++) {
    const x = W * (0.25 + r() * 0.75)
    const y = H * (0.76 + r() * 0.2)
    const pool = c.createRadialGradient(x, y, 0, x, y, H * 0.16)
    pool.addColorStop(0, `rgba(${hot},0.35)`)
    pool.addColorStop(1, `rgba(${hot},0)`)
    c.fillStyle = pool
    c.fillRect(x - H * 0.16, y - H * 0.16, H * 0.32, H * 0.32)
    seam(x, y, (r() < 0.5 ? 0 : Math.PI) + (r() - 0.5) * 0.5, W * (0.15 + r() * 0.2), 0)
  }
  c.restore()
  // Heat haze along the bottom and sparks rising through it.
  const heat = c.createLinearGradient(0, H * 0.55, 0, H)
  heat.addColorStop(0, `rgba(${hot},0)`)
  heat.addColorStop(1, `rgba(${hot},0.22)`)
  c.fillStyle = heat
  c.fillRect(0, H * 0.55, W, H * 0.45)
  for (let k = 0; k < 140; k++) {
    const x = W * (0.3 + r() * 0.7)
    const y = H * (0.15 + r() * 0.8)
    const a = (0.2 + r() * 0.7) * (y / H)
    c.fillStyle = `rgba(255,${180 + Math.round(r() * 60)},120,${a})`
    const s = r() < 0.15 ? 2.2 : 1.2
    c.fillRect(x, y, s, s * (1 + r() * 2.5))
  }
}

const forms = { ridges, dunes, mesa, hills, topo, forest, rings, forge }

function draw(cv: HTMLCanvasElement, name: SceneName, seed: number) {
  const sc = scenes[name]
  const W = cv.clientWidth
  const H = cv.clientHeight
  if (!W || !H) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = Math.round(W * dpr)
  cv.height = Math.round(H * dpr)
  const c = cv.getContext('2d')!
  c.setTransform(dpr, 0, 0, dpr, 0, 0)

  const form = sc.form ?? 'ridges'
  if (form !== 'topo' && form !== 'rings') skyAndSun(c, sc, W, H, seed)
  forms[form](c, sc, W, H, seed)

  c.globalCompositeOperation = 'overlay'
  c.fillStyle = c.createPattern(grain(), 'repeat')!
  c.fillRect(0, 0, W, H)
  c.globalCompositeOperation = 'source-over'
}

/** Generated landscape that fills its positioned parent. Decorative. */
export default function Terrain({ scene, seed, className = '' }: { scene: SceneName; seed: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const render = () => draw(cv, scene, seed)
    render()
    const ro = new ResizeObserver(render)
    ro.observe(cv)
    return () => ro.disconnect()
  }, [scene, seed])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ background: scenes[scene].sky[1] }}
    />
  )
}
