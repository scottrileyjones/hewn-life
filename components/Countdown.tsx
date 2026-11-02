'use client'
import { useEffect, useState } from 'react'

/** Days, hours, minutes and seconds to `to`, ticking each second. Renders nothing until mounted (no hydration mismatch). */
export default function Countdown({ to, ended = 'Offer ended', className = '' }: { to: Date; ended?: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  if (now === null) return <span className={className} aria-hidden="true">&nbsp;</span>
  const ms = to.getTime() - now
  if (ms <= 0) return <span className={className}>{ended}</span>
  const s = Math.floor(ms / 1000)
  const parts: [number, string][] = [[Math.floor(s / 86400), 'd'], [Math.floor(s / 3600) % 24, 'h'], [Math.floor(s / 60) % 60, 'm'], [s % 60, 's']]
  return (
    <span className={`tabular-nums ${className}`} role="timer" aria-label="Time left in the offer">
      {parts.map(([n, u]) => <span key={u} className="mr-1.5 last:mr-0">{String(n).padStart(2, '0')}{u}</span>)}
    </span>
  )
}
