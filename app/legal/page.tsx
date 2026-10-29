import Link from 'next/link'
import SectionEyebrow from '@/components/SectionEyebrow'
import { legalPages } from '@/components/LegalLayout'

export const metadata = {
  title: 'Legal — Hewn Life',
  description: 'Hewn Life’s terms, privacy, refunds and cancellations, cookies, results disclaimer, data processing addendum and accessibility statement.',
}

export default function Legal() {
  return (
    <div className="bg-bone">
      <section className="border-b border-ink/[0.08] px-6 pb-14 pt-36 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <SectionEyebrow text="Legal" light />
          <h1 className="mb-5 font-display text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-ink md:text-[56px]">Policies and terms</h1>
          <p className="font-body text-base leading-relaxed text-ink/70">Everything that governs how we work with you and handle your information, in one place. Questions? Email <a href="mailto:hello@hewn.life" className="text-forest underline underline-offset-2">hello@hewn.life</a>.</p>
        </div>
      </section>
      <section className="px-6 pb-24 pt-12 lg:px-12">
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {legalPages.map(p => (
            <Link key={p.href} href={p.href} className="group rounded-[24px] border border-ink/[0.08] bg-white p-6 transition hover:border-forest/30">
              <p className="font-display text-[19px] font-medium tracking-[-0.02em] text-ink">{p.label} <span className="text-forest transition group-hover:translate-x-0.5">→</span></p>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/65">{p.blurb}</p>
            </Link>
          ))}
          <Link href="/cancel" className="group rounded-[24px] border border-ink/[0.08] bg-white p-6 transition hover:border-forest/30">
            <p className="font-display text-[19px] font-medium tracking-[-0.02em] text-ink">Cancel a subscription <span className="text-forest">→</span></p>
            <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/65">Cancel your monthly plan online in two clicks.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
