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
  slug?: string
}

export interface RelatedPost {
  title: string
  excerpt: string
  category: string
  href: string
  image: string
  date: string
  readTime: string
}

interface Props {
  meta: BlogPostMeta
  children: React.ReactNode
  relatedPosts?: RelatedPost[]
}

const IMG = (path: string) =>
  `https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_700,h_460,c_fill/${path}`

export const ALL_POSTS: RelatedPost[] = [
  {
    title: 'Answer Engine Optimization (AEO): How Small Businesses Get Found in AI Search',
    excerpt: 'Google isn\'t the only game in town anymore. Here\'s how to show up in ChatGPT, Perplexity, and AI Overviews.',
    category: 'SEO',
    href: '/blog/answer-engine-optimization-small-business',
    image: IMG('v1780207193/girl_online_shopping_lqod5j.jpg'),
    date: 'May 2026',
    readTime: '9 min read',
  },
  {
    title: 'Can AI Really Run Your Small Business Marketing? What\'s Actually Possible in 2026',
    excerpt: 'Not hype. Not fear. A straight answer about what AI can and can\'t do for your marketing right now.',
    category: 'AI & Marketing',
    href: '/blog/ai-marketing-for-small-business',
    image: IMG('v1780207388/data_team_ztea9x.jpg'),
    date: 'May 2026',
    readTime: '8 min read',
  },
  {
    title: 'How Much Does a Marketing Agency Cost for a Small Business in 2026?',
    excerpt: 'Real numbers, no fluff. What small businesses actually pay — and how to know if you\'re overpaying.',
    category: 'Pricing & Value',
    href: '/blog/how-much-does-a-marketing-agency-cost',
    image: IMG('v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg'),
    date: 'May 2026',
    readTime: '7 min read',
  },
  {
    title: 'Hiring a Marketing Agency vs. Doing It In-House: The Real Cost Comparison',
    excerpt: 'The math most businesses get wrong. Here\'s what in-house marketing actually costs.',
    category: 'Pricing & Value',
    href: '/blog/agency-vs-in-house-marketing-cost',
    image: IMG('v1780097464/soundtrap-c_S99FlDqSw-unsplash_mtpxgd.jpg'),
    date: 'May 2026',
    readTime: '7 min read',
  },
  {
    title: 'From Zero to Live in a Week: How Fast a Small Business Can Launch Modern Marketing',
    excerpt: 'Speed is now a real competitive advantage. Here\'s what\'s possible in 7 days.',
    category: 'AI & Marketing',
    href: '/blog/launch-marketing-fast',
    image: IMG('v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg'),
    date: 'May 2026',
    readTime: '6 min read',
  },
]

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

export default function BlogPost({ meta, children, relatedPosts }: Props) {
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

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 px-6 lg:px-12 border-t border-black/[0.06]">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89F92] mb-8">Keep Reading</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, i) => (
                <Link key={i} href={post.href} className="group">
                  <article>
                    <div className="relative aspect-[16/9] rounded-2xl mb-4 overflow-hidden">
                      <Image src={post.image} alt="" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 768px) 100vw, 340px" />
                    </div>
                    <p className="font-body text-[11px] uppercase tracking-[0.15em] text-[#8B5CF6] mb-2">{post.category}</p>
                    <h3 className="font-display font-semibold text-[17px] leading-tight text-[#0D0D0D] mb-2 group-hover:text-[#6BAD3D] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-[12px] text-black/40">{post.date} · {post.readTime}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
