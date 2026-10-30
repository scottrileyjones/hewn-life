'use client'
import { usePathname } from 'next/navigation'

/** Renders children except on paths under `prefix` (e.g. the private CRM and HQ, which have their own chrome). */
export default function HideOn({ prefix, children }: { prefix: string | string[]; children: React.ReactNode }) {
  const pathname = usePathname()
  return [prefix].flat().some(p => pathname.startsWith(p)) ? null : <>{children}</>
}
