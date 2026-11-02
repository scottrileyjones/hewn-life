import Link from 'next/link'
import Photo from '@/components/strata/Photo'
import PlanHead from '@/components/strata/PlanHead'
import { Pill } from '@/components/strata/Glyph'
import { h2Class } from '@/components/strata/Page'
import { plans, tierNames, type TierSlug } from '@/lib/services'
import { coverFor, introOf } from '@/lib/gallery'
import { kitListPrice } from '@/lib/addons'
import { planCheckout, itemCheckout, pillarItems, isKit } from '@/lib/buy'

/**
 * The end of every service playbook: the plan that includes it, straight to
 * checkout, and the matching à la carte pieces for anyone not ready for a plan.
 */
export default function BuyBlock({ pillar, tier }: { pillar: string; tier: TierSlug }) {
  const plan = plans.find(p => p.slug === tier)!
  const intro = introOf(tier)
  const cover = coverFor(tier)
  const items = pillarItems(pillar)

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24">
      <div className="mb-10 max-w-[640px]">
        <Pill>Get this playbook</Pill>
        <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.6vw,50px)]`}>Ready to put it to work?</h2>
        <p className="mt-3.5 font-body text-[17px] text-ink/70">It comes with the {tierNames[tier]} plan and up, or start with one piece today.</p>
      </div>
      <div className="grid items-stretch gap-3.5 lg:grid-cols-2">
        {/* The plan */}
        <div className="flex flex-col overflow-hidden rounded-[28px] border border-ink/[0.08] bg-white">
          {cover && (
            <div className="p-3 pb-0">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] bg-sand">
                <Photo name={cover} w={960} h={540} sizes="(min-width: 1024px) 600px, 92vw" film={false} />
              </div>
            </div>
          )}
          <div className="flex flex-1 flex-col p-7 sm:p-8">
            <PlanHead name={plan.name} price={plan.price.monthly} badge={intro?.badge} eyebrow={`Included in ${plan.name}${tier === 'forged' ? '' : ' and up'}`} />
            {intro && <p className="mt-1.5 font-body text-[15px] leading-relaxed text-ink/70">{intro.blurb}</p>}
            <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
              <Link href={planCheckout(tier)} className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">
                Get {plan.name} · ${plan.price.monthly.toLocaleString()}/mo
              </Link>
              <Link href="/pricing#plans" className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:border-ink/30">
                Compare plans
              </Link>
            </div>
          </div>
        </div>

        {/* One piece at a time */}
        {items.length > 0 && (
          <div className="flex flex-col rounded-[28px] bg-forest p-7 text-mist sm:p-8">
            <p className="font-display text-[26px] font-medium leading-tight tracking-[-0.03em]">Or start with one piece.</p>
            <p className="mt-1.5 font-body text-[15px] text-mist/70">Fixed prices, paid once. No contract.</p>
            <ul className="mt-6 border-t border-mist/[0.14]">
              {items.map(it => {
                const kit = isKit(it)
                return (
                  <li key={it.sku} className="flex items-center justify-between gap-4 border-b border-mist/[0.14] py-4">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-body text-[15px] font-medium">
                        {it.name}
                        {kit && <span className="rounded-full bg-lime px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.04em] text-forest">Save ${(kitListPrice(it) - it.fee).toLocaleString()}</span>}
                      </p>
                      <p className="mt-0.5 line-clamp-1 font-body text-[13px] text-mist/60">{kit ? it.pitch : it.detail}</p>
                    </div>
                    <Link href={itemCheckout(it.sku)} className="flex-shrink-0 rounded-full bg-lime px-4 py-2 font-body text-[13px] font-semibold tabular-nums text-forest transition hover:bg-white">
                      Buy · ${it.fee.toLocaleString()}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Link href="/pricing#a-la-carte" className="mt-auto inline-flex self-start rounded-full border border-mist/25 px-5 py-2.5 pt-2.5 font-body text-sm font-medium text-mist transition hover:bg-mist/10" style={{ marginTop: 28 }}>
              See all à la carte →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
