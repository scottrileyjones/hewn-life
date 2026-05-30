'use client'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** The final value to display, e.g. "30", "10M+", "$1,000", "3×", "100s", "48h" */
  value: string
  className?: string
  duration?: number
}

// Parse a display value into prefix / numeric / suffix.
function parse(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  const target = parseFloat(numStr.replace(/,/g, ''))
  return { prefix, suffix, decimals, target }
}

function format(n: number, decimals: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Counts the numeric part of `value` up from zero when scrolled into view.
 * Non-numeric values (e.g. "real-time") render as-is without animation.
 */
export default function CountUp({ value, className, duration = 2200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const parsed = parse(value)
  const [display, setDisplay] = useState<string>(
    parsed ? `${parsed.prefix}${format(0, parsed.decimals)}${parsed.suffix}` : value
  )

  useEffect(() => {
    const el = ref.current
    if (!el || !parsed) return

    let raf = 0
    let cancelled = false

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        if (cancelled) return
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic — slows toward the end
        const current = parsed.target * eased
        setDisplay(`${parsed.prefix}${format(current, parsed.decimals)}${parsed.suffix}`)
        if (t < 1) raf = requestAnimationFrame(tick)
        else setDisplay(value) // snap to exact final string
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  if (!parsed) return <span className={className}>{value}</span>

  return <span ref={ref} className={className}>{display}</span>
}
