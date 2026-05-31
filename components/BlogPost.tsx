import Link from 'next/link'
import Image from 'next/image'
import CalButton from '@/components/CalButton'

export interface BlogPostMeta {
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image?: string
}

interface Props {
  meta: BlogPostMeta
  children: React.ReactNode
}

const CTA_IMAGE =
  'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_900,c_fill/v1780097464/collabstr-bM2nm41YaeA-unsplash_gspy6l.jpg'

export function BlogCta({ text = "Ready to stop reading and start growing?" }: { text?: string }) {
  return (
    <div className="my-14 overflow-hidden rounded-[28px] bg-[#1A1815] grid md:grid-cols-[1.4fr_1fr]">
      {/* Copy — uses div/span to stay out of prose styling */}
      <div className="p-9 md:p-11 flex flex-col justify-center">
        <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[#8FC765] mb-4">Work with us</span>
        <span className="block font-display font-semibold text-[26px] md:text-[30px] text-white leading-[1.15] mb-6">{text}</span>
        <div>
          <CalButton className="inline-flex items-center bg-[#8B5CF6] text-white font-body font-semibold px-7 py-3.5 rounded-full hover:bg-[#7C3AED] transition-all duration-200 hover:-translate-y-0.5">
            Book a Free Discovery Call →
          </CalButton>
        </div>
        <span className="block font-body text-[12px] text-white/40 mt-4">No pitch decks. No pressure. Just a direct conversation.</span>
      </div>
      {/* Image */}
      <div className="relative min-h-[220px] md:min-h-full">
        <Image src={CTA_IMAGE} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 360px" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1815] via-[#1A1815]/20 to-transparent" />
      </div>
    </div>
  )
}

export default function BlogPost({ meta, children }: Props) {
  const heroImage = meta.image
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-10 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92] hover:text-[#6B6560] transition-colors">
              ← Blog
            </Link>
            <span className="text-black/20">/</span>
            <span className="inline-block bg-[#E9D5FF] text-[#6D28D9] font-body text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">
              {meta.category}
            </span>
          </div>
          <h1 className="hero-heading text-[36px] md:text-[52px] text-[#0D0D0D] leading-[1.04] mb-5">
            {meta.title}
          </h1>
          <p className="font-body text-lg text-[#6B6560] leading-relaxed mb-6 max-w-2xl">{meta.excerpt}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89F92]">
            {meta.date} · {meta.readTime} · By Hewn Life
          </p>
        </div>
      </section>

      {/* Hero image */}
      {heroImage && (
        <section className="px-6 lg:px-12 mb-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
              <Image src={heroImage} alt="" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" />
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose-hewn">
            {children}
          </div>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-12 px-6 lg:px-12 border-t border-black/[0.06]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/blog" className="font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors">
            ← All Articles
          </Link>
          <Link href="/quiz" className="font-body text-sm font-medium text-[#8B5CF6] hover:underline underline-offset-4">
            Take the ROI Quiz →
          </Link>
        </div>
      </section>
    </div>
  )
}
