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
  /** Plain-English bullets shown above the full text. Not a substitute for it. */
  summary?: string[]
  sections: LegalSection[]
}

export const legalPages = [
  { href: '/legal/terms', label: 'Terms of Service', blurb: 'The agreement for using our site and buying our services.' },
  { href: '/legal/privacy', label: 'Privacy Policy', blurb: 'What we collect, why, who we share it with and your choices.' },
  { href: '/legal/refund', label: 'Refunds & Cancellations', blurb: 'How billing, renewals, cancelling and refunds work.' },
  { href: '/legal/cookies', label: 'Cookie Policy', blurb: 'The cookies and tags on this site, and how to change your choice.' },
  { href: '/legal/results-disclaimer', label: 'Results Disclaimer', blurb: 'How to read our track record, figures and projections.' },
  { href: '/legal/dpa', label: 'Data Processing Addendum', blurb: 'How we handle your customers’ data when we work for you.' },
  { href: '/legal/accessibility', label: 'Accessibility', blurb: 'Our commitment to an accessible site, and how to reach us.' },
]

export default function LegalLayout({ title, updated, intro, summary, sections }: LegalPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-14 px-6 lg:px-12 bg-bone border-b border-ink/[0.08]">
        <div className="max-w-3xl mx-auto">
          <SectionEyebrow text="Legal" light />
          <h1 className="font-display font-medium tracking-[-0.04em] text-[40px] md:text-[56px] text-ink leading-[1.05] mb-5">
            {title}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55 mb-6">Last updated: {updated}</p>
          <p className="font-body text-base text-ink/70 leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-bone pb-24 pt-12 md:pt-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto grid lg:grid-cols-[180px_1fr] gap-12 lg:gap-16 items-start">

          {/* Sidebar nav */}
          <aside className="lg:sticky lg:top-28">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55 mb-4">Legal Documents</p>
            <nav className="flex flex-col gap-2.5">
              {legalPages.map(p => (
                <Link key={p.href} href={p.href} className="font-body text-sm text-ink/70 hover:text-forest transition-colors">
                  {p.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 rounded-[28px] border border-ink/[0.08] bg-white p-7 sm:p-10">
            {summary && (
              <div className="mb-10 rounded-[20px] bg-stone p-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-forest">The short version</p>
                <ul className="space-y-2">
                  {summary.map((item, k) => (
                    <li key={k} className="font-body text-[15px] leading-relaxed text-ink/80">{item}</li>
                  ))}
                </ul>
                <p className="mt-3 font-body text-[12px] text-ink/55">This summary is for convenience. The full text below is what applies.</p>
              </div>
            )}
            {sections.map((s, i) => (
              <div key={i} className="mb-10 last:mb-0">
                <h2 className="font-display font-medium tracking-[-0.02em] text-[20px] md:text-[22px] text-ink mb-3 leading-snug">
                  {i + 1}. {s.heading}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="font-body text-[15px] text-ink/80 leading-relaxed mb-3 last:mb-0">{p}</p>
                ))}
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((item, k) => (
                      <li key={k} className="grid grid-cols-[14px_1fr] gap-2 items-start">
                        <span className="mt-[7px] h-3 w-[3px] bg-ember" />
                        <span className="font-body text-[15px] text-ink/80 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Contact footer */}
            <div className="mt-14 pt-8 border-t border-ink/[0.08]">
              <p className="font-body text-sm text-ink/70 leading-relaxed mb-4">
                Questions about this document? Contact us at{' '}
                <a href="mailto:hello@hewn.life" className="text-forest underline underline-offset-2">hello@hewn.life</a>.
              </p>
              <address className="font-body text-sm text-ink/70 not-italic leading-relaxed">
                <span className="font-semibold text-ink">Hewn Holdings LLC</span><br />
                389 N 1500 E<br />
                Layton, UT 84040<br />
                United States
              </address>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
