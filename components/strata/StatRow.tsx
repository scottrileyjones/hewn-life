import StatCard from '@/components/strata/StatCard'
import { Pill } from '@/components/strata/Glyph'
import { h2Class } from '@/components/strata/Page'
import type { Slide } from '@/lib/gallery'

type Card = Extract<Slide, { kind: 'stat' | 'list' }>

/**
 * A row of service cards with one sourced stat each, the same cards as the
 * checkout gallery. Four across on desktop; a swipeable row on phones.
 */
export default function StatRow({ eyebrow, title, sub, cards, className = 'py-24' }: { eyebrow: string; title: string; sub?: string; cards: Card[]; className?: string }) {
  return (
    <section className={`mx-auto max-w-7xl px-5 ${className}`}>
      <div className="mb-10 max-w-[640px]">
        <Pill>{eyebrow}</Pill>
        <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.6vw,50px)]`}>{title}</h2>
        {sub && <p className="mt-3.5 font-body text-[17px] text-ink/70">{sub}</p>}
      </div>
      <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {cards.map(c => (
          <li key={c.service} className="aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-[22px] sm:w-[44%] lg:w-auto" style={{ containerType: 'inline-size' }}>
            <StatCard s={c} sizes="(min-width: 1024px) 300px, 78vw" />
          </li>
        ))}
      </ul>
    </section>
  )
}
