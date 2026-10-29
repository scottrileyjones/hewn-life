import type { Metadata } from 'next'
import Link from 'next/link'
import Terrain from '@/components/strata/Terrain'
import { PageHero } from '@/components/strata/Page'
import { outcomes } from '@/lib/caseStudy'

export const metadata: Metadata = {
  title: 'Case studies — Hewn Life',
  description: 'What our team has built and the results behind it.',
}

export default function CaseStudies() {
  return (
    <div className="bg-bone pb-24 text-ink">
      <PageHero pill="Case studies" title={<>Not our <em className="accent text-lime">first climb.</em></>} lede="The work our team has done, told in full. Clients are anonymous; the results are real." scene="sage" seed={9} />
      <div className="mx-auto max-w-[1400px] px-5 pt-3.5">
        <Link href="/case-studies/telehealth" className="group grid overflow-hidden rounded-[32px] border border-ink/[0.08] bg-white transition hover:border-forest/30 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[260px]"><Terrain scene="valley" seed={24} /></div>
          <div className="p-7 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest">Healthcare · Telehealth</p>
            <h2 className="mt-3 font-display text-[clamp(28px,3vw,40px)] font-medium leading-[1.1] tracking-[-0.03em]">Zero to $10M a year: building a national telehealth brand from the ground up.</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {outcomes.map(o => (
                <div key={o.value}>
                  <p className="font-display text-[26px] font-semibold leading-none text-forest">{o.value}</p>
                  <p className="mt-1 font-body text-[13px] text-ink/60">{o.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 font-body text-[15px] font-medium text-forest">Read the case study <span className="inline-block transition group-hover:translate-x-0.5">→</span></p>
          </div>
        </Link>
      </div>
    </div>
  )
}
