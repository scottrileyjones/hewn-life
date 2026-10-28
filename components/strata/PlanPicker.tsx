'use client'
import { useState } from 'react'
import Link from 'next/link'
import { plans } from '@/lib/services'
import { Check } from './Glyph'

/** Offer card: switch plan and billing period, see what is included. */
export default function PlanPicker() {
  const [slug, setSlug] = useState<(typeof plans)[number]['slug']>('wrought')
  const [annual, setAnnual] = useState(false)
  const plan = plans.find(p => p.slug === slug)!
  const price = annual ? plan.price.annual : plan.price.monthly

  return (
    <div>
      <p className="mt-2.5 font-body text-ink/70">{plan.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Plan">
        {plans.map(p => (
          <button
            key={p.slug}
            type="button"
            aria-pressed={p.slug === slug}
            onClick={() => setSlug(p.slug)}
            className={`rounded-full border px-3.5 py-2 font-body text-[13px] transition-colors ${
              p.slug === slug ? 'border-forest font-medium text-forest' : 'border-ink/[0.08] bg-white text-ink/70 hover:text-ink'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="mt-3.5 inline-flex gap-1 rounded-full border border-ink/[0.08] bg-white p-1" role="group" aria-label="Billing period">
        {[false, true].map(a => (
          <button
            key={String(a)}
            type="button"
            aria-pressed={annual === a}
            onClick={() => setAnnual(a)}
            className={`rounded-full px-3.5 py-1.5 font-body text-[13px] ${annual === a ? 'bg-forest text-mist' : 'text-ink/70'}`}
          >
            {a ? 'Yearly · save 20%' : 'Monthly'}
          </button>
        ))}
      </div>
      <p className="mt-5 font-display text-5xl font-medium tracking-[-0.04em] tabular-nums">
        ${price.toLocaleString()}
        <span className="font-body text-[15px] tracking-normal text-ink/55"> /month{annual ? ', billed yearly' : ''}</span>
      </p>
      <ul className="mt-5 grid gap-2.5">
        {plan.highlights.map(h => (
          <li key={h} className="grid grid-cols-[18px_minmax(0,1fr)] gap-2.5 font-body text-[15px]">
            <Check className="mt-[3px] h-[18px] w-[18px]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <Link href="/pricing" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">
        Choose {plan.name}
      </Link>
    </div>
  )
}
