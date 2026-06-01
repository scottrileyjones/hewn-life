import type { Metadata } from 'next'
import SectionEyebrow from '@/components/SectionEyebrow'
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {/* Hero */}
      <section className="flex items-start md:items-end pt-20 md:pt-40 pb-16 md:pb-24 relative overflow-hidden" style={{background: `radial-gradient(ellipse at 70% 30%, rgba(124,181,80,0.10) 0%, transparent 55%), #1A1815`}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Let's Talk" />
          </div>
          <h1 className="hero-heading fluid-hero text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            Tell us about your business. We&apos;ll tell you what&apos;s <span style={{color: '#6BAD3D'}} className="accent">possible.</span>
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            Book a free 30-minute discovery call. No pitch deck. No pressure. Just a direct conversation about your goals.
          </p>
        </div>
      </section>

      {/* Split Form + Info */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <h3 className="font-display font-medium text-[28px] text-ink mb-8">
                What happens next
              </h3>
              <ol className="space-y-6 mb-10">
                {[
                  'We review your submission within one business day.',
                  "You'll receive a link to book a 30-minute discovery call.",
                  "We come prepared with thoughts on your business — not a sales script.",
                  "If there's a fit, we outline a custom proposal within 48 hours.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-display font-semibold text-2xl text-ember flex-shrink-0 leading-none">{i + 1}.</span>
                    <p className="font-body text-sm text-slate leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="border-t border-black/10 pt-8 mb-8">
                <a href="mailto:hello@hewnlife.com" className="font-body text-sm text-ink hover:text-ember transition-colors block mb-3">
                  hello@hewnlife.com
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-ash hover:text-ember transition-colors flex items-center gap-2">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>

              <div className="bg-oat rounded-2xl p-6 border border-black/[0.08]">
                <blockquote className="font-display text-lg text-ink mb-4">
                  &ldquo;Every inquiry is reviewed personally by the founder. You will always talk to the person who will actually be doing your work.&rdquo;
                </blockquote>
                <p className="font-body text-sm text-slate">— Scott Jones, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="Common Questions" />
            <h2 className="font-display font-normal italic fluid-h2 leading-tight text-cream">
              Answers before you ask.
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>
    </>
  )
}
