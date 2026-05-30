import CalButton from './CalButton'

interface CtaBannerProps {
  headline?: string
  body?: string
  buttonText?: string
}

export default function CtaBanner({
  headline = "Ready to carve out something beautiful?",
  body = "Book a free 30-minute discovery call. No pitch decks. No pressure. Just a direct conversation about your business and what's possible.",
  buttonText = "Book Your Discovery Call"
}: CtaBannerProps) {
  return (
    <section className="bg-moss py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="font-display font-bold text-[52px] leading-tight text-bone mb-6 max-w-2xl mx-auto">
          {headline}
        </h2>
        <p className="font-body text-base text-bone/70 max-w-xl mx-auto mb-10">
          {body}
        </p>
        <CalButton className="inline-flex items-center bg-[#8B5CF6] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#7C3AED] transition-all duration-300">
          {buttonText}
        </CalButton>
      </div>
    </section>
  )
}
