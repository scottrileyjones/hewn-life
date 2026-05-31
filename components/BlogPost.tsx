import Link from 'next/link'
import CalButton from '@/components/CalButton'

export interface BlogPostMeta {
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
}

interface Props {
  meta: BlogPostMeta
  children: React.ReactNode
}

export function BlogCta({ text = "Ready to stop reading and start growing?" }: { text?: string }) {
  return (
    <div className="my-12 rounded-3xl bg-[#6BAD3D] p-10 md:p-12 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 mb-4">Work with us</p>
      <h3 className="font-display font-bold text-[28px] md:text-[32px] text-white leading-tight mb-6 max-w-lg mx-auto">{text}</h3>
      <CalButton className="inline-flex items-center bg-white text-[#0D0D0D] font-body font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-200">
        Book a Free Discovery Call →
      </CalButton>
    </div>
  )
}

export default function BlogPost({ meta, children }: Props) {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-12 px-6 lg:px-12 border-b border-black/[0.06]">
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

      {/* Body */}
      <section className="py-16 px-6 lg:px-12">
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
