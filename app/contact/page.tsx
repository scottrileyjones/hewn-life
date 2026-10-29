import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'
import Terrain from '@/components/strata/Terrain'
import { PageHero, ForestBand, h2Class } from '@/components/strata/Page'
import ContactForm from '@/components/ContactForm'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Contact Hewn Life — Talk to a Real Strategist',
  description: 'Have a question or ready to get started? Reach out to Hewn Life. We respond fast — usually same day.',
  alternates: { canonical: 'https://www.hewn.life/contact' },
  openGraph: {
    title: 'Contact Hewn Life — Talk to a Real Strategist',
    description: 'Have a question or ready to get started? Reach out to Hewn Life. We respond fast — usually same day.',
    url: 'https://www.hewn.life/contact',
    images: [ogImage],
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you require long-term contracts?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. We work on monthly agreements. We earn your continued business by delivering results.' },
    },
    {
      '@type': 'Question',
      name: 'What businesses are the best fit for Hewn Life?',
      acceptedAnswer: { '@type': 'Answer', text: 'Established businesses doing $500K+ in annual revenue that are ready to invest in marketing as a growth driver — not a cost center.' },
    },
    {
      '@type': 'Question',
      name: 'Who will actually be doing my work?',
      acceptedAnswer: { '@type': 'Answer', text: 'The founder oversees every account directly. You are not handed off to a junior account manager. You get the experience you are paying for.' },
    },
    {
      '@type': 'Question',
      name: 'How is this different from hiring a freelancer?',
      acceptedAnswer: { '@type': 'Answer', text: 'A freelancer executes tasks. Hewn Life operates as your fractional CMO — strategic, embedded, and building systems that outlast any single deliverable.' },
    },
    {
      '@type': 'Question',
      name: 'What if I just need one specific project?',
      acceptedAnswer: { '@type': 'Answer', text: 'We offer clear à la carte flat-fee services for one-off needs. No retainer required.' },
    },
    {
      '@type': 'Question',
      name: "What's your process for getting started?",
      acceptedAnswer: { '@type': 'Answer', text: 'Book a discovery call. We do a deep-dive into your business (weeks 1–2), then launch a Foundation Sprint (weeks 3–8) to get your brand, website, and core systems live.' },
    },
  ],
}

export default function Contact() {
  return (
    <div className="bg-bone text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        pill="Let's talk"
        title={<>Tell us about your business. We&apos;ll tell you what&apos;s <em className="accent text-lime">possible.</em></>}
        lede="Book a free 30-minute discovery call. No pitch deck, no pressure. Just a direct conversation about your goals."
        scene="night" seed={52}
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-3.5 lg:grid-cols-5">
          <div className="rounded-[32px] border border-ink/[0.08] bg-white p-6 sm:p-10 lg:col-span-3">
            <h2 className={`${h2Class} mb-8 text-[clamp(26px,2.6vw,34px)]`}>Start the conversation</h2>
            <ContactForm />
          </div>
          <div className="flex flex-col gap-3.5 lg:col-span-2">
            <div className="rounded-[32px] bg-forest p-8 text-mist">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">What happens next</span>
              <ol className="mt-6 space-y-5">
                {[
                  'We review your submission within one business day.',
                  "You'll receive a link to book a 30-minute discovery call.",
                  'We come prepared with thoughts on your business, not a sales script.',
                  "If there's a fit, we outline a custom proposal within 48 hours.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-lime font-display text-sm font-medium text-forest">{i + 1}</span>
                    <p className="pt-0.5 font-body text-sm text-mist/85">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 border-t border-mist/15 pt-6">
                <a href="mailto:hello@hewnlife.com" className="block font-body text-sm text-mist transition-colors hover:text-lime">hello@hewnlife.com</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mt-2 block font-body text-sm text-mist/70 transition-colors hover:text-lime">LinkedIn</a>
              </div>
            </div>
            <div className="relative isolate flex min-h-[260px] flex-1 flex-col justify-end overflow-hidden rounded-[32px] p-8 text-mist">
              <Terrain scene="amber" seed={53} className="-z-20" />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(20,16,10,.7),transparent_80%)]" />
              <blockquote className="accent text-xl leading-snug">&ldquo;Every inquiry is reviewed personally by the founder. You will always talk to the person who will actually do your work.&rdquo;</blockquote>
              <p className="mt-3 font-body text-sm text-mist/80">The founder, Hewn Life</p>
            </div>
          </div>
        </div>
      </section>

      <ForestBand>
        <div className="mb-12 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">Common questions</span>
          <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Answers before you ask.</h2>
        </div>
        <FaqAccordion />
      </ForestBand>
      <div className="h-24" />
    </div>
  )
}
