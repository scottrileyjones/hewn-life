import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'
import Link from 'next/link'
import PostCover from '@/components/strata/PostCover'
import { PageHero, ClosePanel } from '@/components/strata/Page'

export const metadata: Metadata = {
  title: 'Marketing Insights & Strategy — The Hewn Life Blog',
  description: 'Practical marketing strategy for small and mid-size businesses. AI marketing, SEO, agency costs, and growth tactics from the team at Hewn Life.',
  alternates: { canonical: 'https://www.hewn.life/blog' },
  openGraph: {
    title: 'Marketing Insights & Strategy — The Hewn Life Blog',
    description: 'Practical marketing strategy for small and mid-size businesses. AI marketing, SEO, agency costs, and growth tactics from the team at Hewn Life.',
    url: 'https://www.hewn.life/blog',
    images: [ogImage],
  },
}

const IMG = (path: string, w: number, h: number) =>
  `https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_${w},h_${h},c_fill/${path}`

const posts = [
  {
    category: 'SEO',
    title: 'Answer Engine Optimization (AEO): How Small Businesses Get Found in AI Search',
    excerpt: 'Google isn\'t the only game in town anymore. Here\'s how to show up in ChatGPT, Perplexity, and AI Overviews before your competitors figure it out.',
    date: 'May 2026',
    readTime: '9 min read',
    featured: true,
    href: '/blog/answer-engine-optimization-small-business',
    image: IMG('v1780207193/girl_online_shopping_lqod5j.jpg', 1000, 562),
  },
  {
    category: 'AI & Marketing',
    title: 'Can AI Really Run Your Small Business Marketing? What\'s Actually Possible in 2026',
    excerpt: 'Not hype. Not fear. A straight answer about what AI can and can\'t do for your marketing right now.',
    date: 'May 2026',
    readTime: '8 min read',
    featured: false,
    href: '/blog/ai-marketing-for-small-business',
    image: IMG('v1780207388/data_team_ztea9x.jpg', 700, 460),
  },
  {
    category: 'Pricing & Value',
    title: 'How Much Does a Marketing Agency Cost for a Small Business in 2026?',
    excerpt: 'Real numbers, no fluff. What small businesses actually pay — and how to know if you\'re overpaying.',
    date: 'May 2026',
    readTime: '7 min read',
    featured: false,
    href: '/blog/how-much-does-a-marketing-agency-cost',
    image: IMG('v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg', 700, 460),
  },
  {
    category: 'Pricing & Value',
    title: 'Hiring a Marketing Agency vs. Doing It In-House: The Real Cost Comparison',
    excerpt: 'The math most businesses get wrong. Here\'s what in-house marketing actually costs — and why the agency case is stronger than it looks.',
    date: 'May 2026',
    readTime: '7 min read',
    featured: false,
    href: '/blog/agency-vs-in-house-marketing-cost',
    image: IMG('v1780097464/soundtrap-c_S99FlDqSw-unsplash_mtpxgd.jpg', 700, 460),
  },
  {
    category: 'AI & Marketing',
    title: 'From Zero to Live in a Week: How Fast a Small Business Can Launch Modern Marketing',
    excerpt: 'Speed is now a real competitive advantage. Here\'s what\'s possible in 7 days when you have the right team and the right tools.',
    date: 'May 2026',
    readTime: '6 min read',
    featured: false,
    href: '/blog/launch-marketing-fast',
    image: IMG('v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg', 700, 460),
  },
]

const featured = posts[0]
const grid = posts.slice(1)

export default function Blog() {
  return (
    <div className="bg-bone text-ink">
      <PageHero
        pill="Journal"
        title={<>Ideas on marketing, growth and businesses that actually <em className="accent text-lime">work.</em></>}
        scene="forest" seed={88}
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <Link href={featured.href} className="group grid items-center gap-10 lg:grid-cols-5">
          <PostCover href={featured.href} category={featured.category} className="aspect-[16/9] rounded-[32px] lg:col-span-3" />
          <div className="lg:col-span-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Featured · {featured.date} · {featured.readTime}</span>
            <h2 className="mt-4 font-display text-[32px] font-medium leading-tight tracking-[-0.03em] transition-colors group-hover:text-forest">{featured.title}</h2>
            <p className="mt-4 font-body leading-relaxed text-ink/70">{featured.excerpt}</p>
            <span className="mt-6 inline-flex font-body text-sm font-medium text-forest underline underline-offset-4">Read the article →</span>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 border-t border-ink/[0.08] pt-16 md:grid-cols-2 lg:grid-cols-3">
          {grid.map(post => (
            <Link key={post.href} href={post.href} className="group">
              <article>
                <PostCover href={post.href} category={post.category} className="mb-5 aspect-[16/10] rounded-[22px]" />
                <h3 className="mb-3 font-display text-[22px] font-medium leading-tight tracking-[-0.02em] transition-colors group-hover:text-forest">{post.title}</h3>
                <p className="mb-4 line-clamp-2 font-body text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
                <p className="font-body text-[12px] text-ink/55">{post.date} · {post.readTime}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <ClosePanel title="Stop reading. Start growing." seed={89} />
    </div>
  )
}
