import SectionEyebrow from '@/components/SectionEyebrow'
import ContactForm from '@/components/ContactForm'
import FaqAccordion from '@/components/FaqAccordion'

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="bg-obsidian min-h-[65vh] flex items-end pb-24 relative overflow-hidden grain-overlay pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Let's Talk" />
          </div>
          <h1 className="font-display font-light italic text-[56px] md:text-[72px] leading-[1.08] text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            Tell us about your business. We&apos;ll tell you what&apos;s possible.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            Book a free 30-minute discovery call. No pitch deck. No pressure. Just a direct conversation about your goals.
          </p>
        </div>
      </section>

      {/* Split Form + Info */}
      <section className="bg-stone py-24 md:py-32">
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
                    <span className="font-display font-semibold text-2xl text-copper flex-shrink-0 leading-none">{i + 1}.</span>
                    <p className="font-body text-sm text-slate leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="border-t border-black/10 pt-8 mb-8">
                <a href="mailto:hello@hewnlife.com" className="font-body text-sm text-ink hover:text-copper transition-colors block mb-3">
                  hello@hewnlife.com
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-ash hover:text-copper transition-colors flex items-center gap-2">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>

              <div className="bg-marble rounded-2xl p-6 border border-black/[0.08]">
                <blockquote className="font-display italic text-lg text-ink mb-4">
                  &ldquo;Every inquiry is reviewed personally by the founder. You will always talk to the person who will actually be doing your work.&rdquo;
                </blockquote>
                <p className="font-body text-sm text-slate">— Scott Jones, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-charcoal py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="Common Questions" />
            <h2 className="font-display font-normal italic text-[40px] leading-tight text-cream">
              Answers before you ask.
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>
    </>
  )
}
