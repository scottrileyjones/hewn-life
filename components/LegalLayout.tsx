import SectionEyebrow from '@/components/SectionEyebrow'
import Link from 'next/link'

export interface LegalSection {
  heading: string
  body: string[]
  list?: string[]
}

interface LegalPageProps {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

const legalPages = [
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/refund', label: 'Refund Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
]

export default function LegalLayout({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-14 px-6 lg:px-12 bg-white border-b border-black/[0.06]">
        <div className="max-w-3xl mx-auto">
          <SectionEyebrow text="Legal" light />
          <h1 className="hero-heading text-[40px] md:text-[56px] text-[#0D0D0D] leading-[1.05] mb-5">
            {title}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 mb-6">Last updated: {updated}</p>
          <p className="font-body text-base text-[#6B6560] leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 md:py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto grid lg:grid-cols-[180px_1fr] gap-12 lg:gap-16 items-start">

          {/* Sidebar nav */}
          <aside className="lg:sticky lg:top-28">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/30 mb-4">Legal Documents</p>
            <nav className="flex flex-col gap-2.5">
              {legalPages.map(p => (
                <Link key={p.href} href={p.href} className="font-body text-sm text-[#6B6560] hover:text-[#8B5CF6] transition-colors">
                  {p.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            {sections.map((s, i) => (
              <div key={i} className="mb-10 last:mb-0">
                <h2 className="font-display font-semibold text-[20px] md:text-[22px] text-[#0D0D0D] mb-3 leading-snug">
                  {i + 1}. {s.heading}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="font-body text-[15px] text-[#4A453F] leading-relaxed mb-3 last:mb-0">{p}</p>
                ))}
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((item, k) => (
                      <li key={k} className="grid grid-cols-[14px_1fr] gap-2 items-start">
                        <span className="font-mono text-[11px] text-[#8B5CF6] mt-[3px]">—</span>
                        <span className="font-body text-[15px] text-[#4A453F] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Contact footer */}
            <div className="mt-14 pt-8 border-t border-black/[0.08]">
              <p className="font-body text-sm text-[#6B6560] leading-relaxed">
                Questions about this document? Contact us at{' '}
                <a href="mailto:hello@hewnlife.com" className="text-[#8B5CF6] hover:underline">hello@hewnlife.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
