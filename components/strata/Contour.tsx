'use client'
import { useEffect, useRef } from 'react'
import { noise1, fbm, mix, colors } from '@/lib/strata'

/** Topographic funnel: rings from cold attention at the edge to the summit. */
export default function Contour({ seed = 5, className = '' }: { seed?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const render = () => {
      const W = cv.clientWidth
      const H = cv.clientHeight
      if (!W) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = W * dpr
      cv.height = H * dpr
      const c = cv.getContext('2d')!
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.fillStyle = colors.forest
      c.fillRect(0, 0, W, H)
      const cx = W * 0.55
      const cy = H * 0.5
      const R = Math.min(W, H) * 0.7
      const rings = 24
      const n = noise1(seed)
      for (let k = 0; k < rings; k++) {
        const t = k / rings
        const r = R * (1 - t)
        c.beginPath()
        for (let a = 0; a <= 360; a += 3) {
          const th = (a * Math.PI) / 180
          const w = 1 + 0.22 * (fbm(n, th * 1.3 + k * 0.17, 4) - 0.45)
          const x = cx + Math.cos(th) * r * w * 1.25
          const y = cy + Math.sin(th) * r * w * 0.75
          a ? c.lineTo(x, y) : c.moveTo(x, y)
        }
        c.closePath()
        c.fillStyle = mix(colors.forest2, colors.lime, Math.pow(t, 1.6))
        c.globalAlpha = 0.35 + t * 0.6
        c.fill()
        c.globalAlpha = 1
        c.strokeStyle = 'rgba(244,242,236,.22)'
        c.lineWidth = k % 5 === 0 ? 1.3 : 0.6
        c.stroke()
      }
      // The mark at the summit.
      c.save()
      c.translate(cx, cy)
      c.fillStyle = colors.forest
      c.fillRect(-11, -10, 5, 20)
      c.fillRect(6, -10, 5, 20)
      c.beginPath()
      c.moveTo(-6, 6)
      c.lineTo(6, 1)
      c.lineTo(6, 5)
      c.lineTo(-6, 10)
      c.closePath()
      c.fill()
      c.restore()
    }
    render()
    const ro = new ResizeObserver(render)
    ro.observe(cv)
    return () => ro.disconnect()
  }, [seed])

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />
}
