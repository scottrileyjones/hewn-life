'use client'
import { useEffect, useRef } from 'react'
import { scenes, noise1, fbm, mix, hexRgb, rng, type SceneName } from '@/lib/strata'

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

  const sky = c.createLinearGradient(0, 0, 0, H * sc.horizon + 40)
  sc.sky.forEach((col, i) => sky.addColorStop(i / (sc.sky.length - 1), col))
  c.fillStyle = sky
  c.fillRect(0, 0, W, H)

  const [sx, sy, scol, sa] = sc.sun
  const s = hexRgb(scol)
  const sun = c.createRadialGradient(W * sx, H * sy, 0, W * sx, H * sy, Math.max(W, H) * 0.6)
  sun.addColorStop(0, `rgba(${s},${sa})`)
  sun.addColorStop(0.07, `rgba(${s},${sa * 0.6})`)
  sun.addColorStop(0.32, `rgba(${s},${sa * 0.14})`)
  sun.addColorStop(1, `rgba(${s},0)`)
  c.fillStyle = sun
  c.fillRect(0, 0, W, H)

  for (let i = 0; i < sc.layers; i++) {
    const t = i / (sc.layers - 1)
    const n = noise1(seed * 31 + i * 7)
    const base = H * (sc.horizon + t * (0.98 - sc.horizon) * 0.78)
    const amp = H * (0.05 + 0.12 * (1 - Math.abs(t - 0.35)))
    const freq = 2.2 + i * 0.9
    const off = seed * 3.1 + i * 11
    const yAt = (x: number) => base - amp * (fbm(n, off + (x / W) * freq) - 0.25) * 1.6

    c.beginPath()
    c.moveTo(0, H)
    for (let x = 0; x <= W; x += 3) c.lineTo(x, yAt(x))
    c.lineTo(W, H)
    c.closePath()
    c.fillStyle = mix(sc.far, sc.near, Math.pow(t, 0.8))
    c.fill()

    // Engraved contour lines on the middle ridges.
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

    const fog = c.createLinearGradient(0, base - amp, 0, base + amp * 0.8)
    fog.addColorStop(0, `rgba(${sc.fog},0)`)
    fog.addColorStop(0.55, `rgba(${sc.fog},${0.18 * (1 - t)})`)
    fog.addColorStop(1, `rgba(${sc.fog},0)`)
    c.fillStyle = fog
    c.fillRect(0, base - amp, W, amp * 1.8)
  }

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
