'use client'
import { usePathname } from 'next/navigation'

/** Renders children except on paths under `prefix` (e.g. the private CRM, which has its own chrome). */
export default function HideOn({ prefix, children }: { prefix: string; children: React.ReactNode }) {
  const pathname = usePathname()
  return pathname.startsWith(prefix) ? null : <>{children}</>
}
