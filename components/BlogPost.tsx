import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import PostCover from '@/components/strata/PostCover'
import { Pill } from '@/components/strata/Glyph'

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

export function BlogCta({ text = "Ready to stop reading and start growing?" }: { text?: string }) {
  return (
    <div className="not-prose relative isolate my-14 overflow-hidden rounded-[28px] text-mist">
      <Terrain scene="ember" seed={91} className="-z-20" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,16,10,.72),rgba(20,16,10,.25))]" />
      <div className="flex flex-col justify-center p-9 md:p-11">
        <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.22em] text-lime">Work with us</span>
        <span className="mb-6 block max-w-[22ch] font-display text-[26px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[30px]">{text}</span>
        <div>
          <CalButton className="inline-flex items-center rounded-full bg-white px-7 py-3.5 font-body font-medium text-ink transition-all duration-200 hover:bg-mist">
            Book a free discovery call →
          </CalButton>
        </div>
        <span className="mt-4 block font-body text-[12px] text-mist/70">No pitch decks. No pressure. Just a direct conversation.</span>
      </div>
    </div>
  )
}

export default function BlogPost({ meta, children, relatedPosts }: Props) {
  const href = meta.slug ? `/blog/${meta.slug}` : ALL_POSTS.find(p => p.title === meta.title)?.href ?? ''
  return (
    <div className="bg-bone text-ink">
      <section className="px-5 pb-10 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <Link href="/blog" className="font-body text-sm text-ink/60 transition-colors hover:text-ink">← Journal</Link>
            <span className="text-ink/25">/</span>
            <Pill>{meta.category}</Pill>
          </div>
          <h1 className="mb-5 font-display text-[36px] font-medium leading-[1.04] tracking-[-0.04em] md:text-[52px]">{meta.title}</h1>
          <p className="mb-6 max-w-2xl font-body text-lg leading-relaxed text-ink/70">{meta.excerpt}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{meta.date} · {meta.readTime} · By Hewn Life</p>
        </div>
      </section>

      <section className="mb-4 px-5">
        <div className="mx-auto max-w-4xl">
          <PostCover href={href} className="aspect-[16/9] rounded-[32px]" />
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="prose-hewn">{children}</div>
        </div>
      </section>

      {relatedPosts && relatedPosts.length > 0 && (
        <section className="border-t border-ink/[0.08] px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Keep reading</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map(post => (
                <Link key={post.href} href={post.href} className="group">
                  <article>
                    <PostCover href={post.href} category={post.category} className="mb-4 aspect-[16/10] rounded-[22px]" />
                    <h3 className="mb-2 line-clamp-2 font-display text-[17px] font-medium leading-tight transition-colors group-hover:text-forest">{post.title}</h3>
                    <p className="font-body text-[12px] text-ink/55">{post.date} · {post.readTime}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-ink/[0.08] px-5 py-12">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/blog" className="font-body text-sm text-ink/60 transition-colors hover:text-ink">← All articles</Link>
          <Link href="/quiz" className="font-body text-sm font-medium text-forest underline-offset-4 hover:underline">Take the ROI quiz →</Link>
        </div>
      </section>
    </div>
  )
}
