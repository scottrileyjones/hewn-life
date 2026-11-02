'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Pill } from '@/components/strata/Glyph'
import { h2Class } from '@/components/strata/Page'
import { plans } from '@/lib/services'
import { introOf } from '@/lib/gallery'
import { lookup, isKit, kitListPrice } from '@/lib/addons'
import { planCheckout, itemCheckout } from '@/lib/buy'
import { blackFriday, money, offerLive } from '@/lib/offer'

/** Popular one-time pieces for people not ready for a plan. */
const STARTERS = ['gbp', 'landing', 'kit_found']

/**
 * "Pick a plan, or start with one piece": the buying moment at the end of a
 * page. Every row goes straight to checkout.
 */
export default function BuyChoice({ title = 'Pick a plan. Check out today.', className = 'pb-24' }: { title?: string; className?: string }) {
  const [offer, setOffer] = useState(false)
  useEffect(() => { setOffer(offerLive()) }, [])
  const starters = STARTERS.map(s => lookup(s)!).filter(Boolean)

  return (
    <section className={`mx-auto max-w-7xl px-5 ${className}`}>
      <div className="grid items-stretch gap-3.5 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-[28px] border border-ink/[0.08] bg-white p-7 sm:p-9">
          <Pill>Ready when you are</Pill>
          <h2 className={`${h2Class} mt-4 text-[clamp(28px,3vw,40px)]`}>{title}</h2>
          <p className="mt-2.5 font-body text-[16px] text-ink/70">Flat monthly fees, no contracts, onboarding within 48 hours.</p>
          <ul className="mt-6 border-t border-ink/[0.08]">
            {plans.map(p => {
              const intro = introOf(p.slug)
              return (
                <li key={p.slug} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-ink/[0.08] py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className="font-display text-[22px] font-medium tracking-[-0.03em]">{p.name}</span>
                      <span className="rounded-full bg-forest px-3 py-1 font-body text-[13px] font-semibold tabular-nums text-white">${p.price.monthly.toLocaleString()}<span className="font-medium text-white/75">/mo</span></span>
                      {intro?.badge && <span className="rounded-full bg-lime px-2.5 py-1 font-body text-[11px] font-semibold text-forest">{intro.badge}</span>}
                    </div>
                    <p className="mt-1 font-body text-[13px] text-ink/60">{p.tagline}</p>
                  </div>
                  <Link href={planCheckout(p.slug)} className="flex-shrink-0 rounded-full bg-forest px-5 py-2.5 font-body text-sm font-medium text-mist transition hover:bg-forest-2">Get {p.name} →</Link>
                </li>
              )
            })}
          </ul>
          <Link href="/pricing#plans" className="mt-5 inline-flex rounded-full border border-ink/15 px-5 py-2.5 font-body text-sm font-medium text-ink transition hover:border-ink/30">Compare everything in each plan</Link>
        </div>

        <div className="flex flex-col rounded-[28px] bg-forest p-7 text-mist sm:p-9">
          <p className="font-display text-[clamp(26px,2.6vw,34px)] font-medium leading-tight tracking-[-0.03em]">Not ready for a plan?</p>
          <p className="mt-2 font-body text-[15px] text-mist/70">Start with one piece. Fixed prices, paid once.</p>
          <ul className="mt-6 border-t border-mist/[0.14]">
            <li className="flex items-center justify-between gap-4 border-b border-mist/[0.14] py-4">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-body text-[15px] font-medium">Website in a Day
                  {offer && <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-forest">Black Friday · {blackFriday.percentOff}% off</span>}
                </p>
                <p className="mt-0.5 font-body text-[13px] text-mist/60">A custom site, live within 24 hours.</p>
              </div>
              <Link href={offer ? blackFriday.page : '/website-in-a-day#order'} className="flex-shrink-0 rounded-full bg-lime px-4 py-2 font-body text-[13px] font-semibold tabular-nums text-forest transition hover:bg-white">
                {offer ? <><s className="mr-1 font-medium opacity-60">$999</s>{money(blackFriday.price)}</> : 'Buy · $999'}
              </Link>
            </li>
            {starters.map(it => (
              <li key={it.sku} className="flex items-center justify-between gap-4 border-b border-mist/[0.14] py-4">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-body text-[15px] font-medium">{it.name}
                    {isKit(it) && <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-forest">Save ${(kitListPrice(it) - it.fee).toLocaleString()}</span>}
                  </p>
                  <p className="mt-0.5 line-clamp-1 font-body text-[13px] text-mist/60">{isKit(it) ? it.pitch : it.detail}</p>
                </div>
                <Link href={itemCheckout(it.sku)} className="flex-shrink-0 rounded-full bg-lime px-4 py-2 font-body text-[13px] font-semibold tabular-nums text-forest transition hover:bg-white">Buy · ${it.fee.toLocaleString()}</Link>
              </li>
            ))}
          </ul>
          <Link href="/pricing#a-la-carte" className="mt-7 inline-flex self-start rounded-full border border-mist/25 px-5 py-2.5 font-body text-sm font-medium text-mist transition hover:bg-mist/10">Shop all à la carte →</Link>
        </div>
      </div>
    </section>
  )
}
