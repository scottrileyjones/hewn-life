'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { blackFriday, money, offerLive } from '@/lib/offer'

/** Where the bar never shows: pages with their own chrome, checkout, and the offer page itself. */
const HIDE = ['/crm', '/hq', '/portal', '/checkout', '/thank-you', '/plan', blackFriday.page]

export const PROMO_BAR_H = 40

/** True while the Black Friday bar is on screen at the top of this page. */
export function usePromoBar() {
  const pathname = usePathname()
  const [live, setLive] = useState(false)
  useEffect(() => { setLive(offerLive()) }, [])
  return live && !HIDE.some(p => pathname.startsWith(p))
}

/** A slim lime bar above the nav, sitewide until the offer ends. */
export default function PromoBar() {
  const show = usePromoBar()
  if (!show) return null
  return (
    <Link href={blackFriday.page} className="group relative z-[51] flex items-center justify-center gap-3 bg-lime px-4 font-body text-[13px] text-forest sm:text-sm" style={{ height: PROMO_BAR_H }}>
      <span className="truncate"><strong className="font-semibold">Black Friday:</strong> Website in a Day<span className="hidden sm:inline"> {blackFriday.percentOff}% off,</span> {money(blackFriday.price)}<span className="hidden sm:inline"> · ends {blackFriday.endsLabel}</span></span>
      <span className="flex-shrink-0 rounded-full bg-forest px-3 py-1 text-[12px] font-medium text-mist transition group-hover:bg-forest-2"><span className="hidden sm:inline">Claim offer</span><span className="sm:hidden">Claim</span> →</span>
    </Link>
  )
}
