'use client'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** The final value to display, e.g. "30", "10M+", "$1,000", "3×", "100s", "48h" */
  value: string
  className?: string
  duration?: number
}

/**
 * Parses a display value into an optional prefix, a numeric part, and a suffix,
 * then counts the numeric part up from zero when scrolled into view.
 * Non-numeric values (e.g. "real-time") render as-is without animation.
 */
export default function CountUp({ value, className, duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)
  const [display, setDisplay] = useState<string>(() => initialFor(value))

  // Parse prefix / number / suffix
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)

  useEffect(() => {
    const el = ref.current
    if (!el || !match) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [match])

  useEffect(() => {
    if (!started || !match) return
    const [, prefix, numStr, suffix] = match
    const hasComma = numStr.includes(',')
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
    const target = parseFloat(numStr.replace(/,/g, ''))

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const current = target * eased
      const formatted = decimals > 0
        ? current.toFixed(decimals)
        : Math.round(current).toLocaleString(hasComma ? 'en-US' : undefined)
      setDisplay(`${prefix}${hasComma ? formatted : (decimals > 0 ? formatted : Math.round(current).toString())}${suffix}`)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value) // snap to exact final string
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, match, value, duration])

  // Non-numeric — render plainly
  if (!match) return <span className={className}>{value}</span>

  return <span ref={ref} className={className}>{display}</span>
}

function initialFor(value: string): string {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return value
  const [, prefix, numStr, suffix] = match
  const zero = numStr.includes('.') ? (0).toFixed(numStr.split('.')[1].length) : '0'
  return `${prefix}${zero}${suffix}`
}
