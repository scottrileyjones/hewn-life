import type { Metadata } from 'next'
import IntakeForm from '@/components/IntakeForm'
import { PageHero } from '@/components/strata/Page'

export const metadata: Metadata = {
  title: 'Start your website brief',
  description: 'Send us three brands you love and a little about your business. We build a concept of your new website before your call.',
  alternates: { canonical: 'https://www.hewn.life/start' },
  robots: { index: false, follow: true },
}

const steps = [
  ['Send the brief', 'Three brands you love, your logo and a few lines about your business. About five minutes.'],
  ['We build your concept', 'Our team turns it into a working website in your brand before we meet.'],
  ['See it on the call', 'We walk you through it, plus what it becomes with each plan.'],
]

export default function StartPage() {
  return (
    <div className="bg-bone pb-24 text-ink">
      <PageHero
        pill="Website brief"
        title={<>Show us what you love. <em className="accent text-lime">We’ll build it first.</em></>}
        lede="Send three brands you’d borrow from and a little about your business. You’ll see a working concept of your new website on your exploration call."
        seed={95}
      />
      <section className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-16 lg:grid-cols-[1fr_2fr]">
        <aside className="lg:sticky lg:top-24">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">How it works</span>
          <ol className="mt-6 space-y-6">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="mt-1 h-5 w-[3px] flex-shrink-0 bg-ember" />
                <div>
                  <p className="font-display text-lg font-medium">{i + 1}. {t}</p>
                  <p className="mt-1 font-body text-sm text-ink/70">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
        <IntakeForm />
      </section>
    </div>
  )
}
