import Link from 'next/link'
import Image from 'next/image'

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
  {
    category: 'Brand Strategy',
    title: 'Why Your Brand is Your Most Valuable Business Asset',
    excerpt: 'Most business owners treat their brand as a logo and some colors. The businesses that win treat it as the foundation of every decision they make.',
    date: 'April 2026',
    readTime: '6 min read',
    featured: false,
    href: '/blog',
    image: IMG('v1780097464/collabstr-bM2nm41YaeA-unsplash_gspy6l.jpg', 700, 460),
  },
]

const featured = posts[0]
const grid = posts.slice(1)

export default function Blog() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-up max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#E9D5FF] text-[#6D28D9] rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="font-body text-xs font-medium tracking-wide">Insights</span>
          </div>
          <h1 className="hero-heading fluid-hero text-[#0D0D0D] leading-[0.98]">
            Ideas on marketing, growth, and building businesses that actually{' '}
            <span className="accent" style={{ color: '#6BAD3D' }}>work.</span>
          </h1>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <Link href={featured.href} className="lg:col-span-3 group block">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
              <Image src={featured.image} alt="" fill priority className="object-cover group-hover:scale-[1.02] transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 720px" />
            </div>
          </Link>
          <div className="lg:col-span-2">
            <span className="inline-block bg-[#E9D5FF] text-[#6D28D9] font-body text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wider mb-5">
              {featured.category}
            </span>
            <h2 className="font-display font-bold text-[32px] leading-tight text-[#0D0D0D] mb-4">
              {featured.title}
            </h2>
            <p className="font-body text-[12px] text-[#6B6560] mb-4">{featured.date} · {featured.readTime}</p>
            <p className="font-body text-base text-[#6B6560] leading-relaxed mb-6">{featured.excerpt}</p>
            <Link href={featured.href} className="font-body text-sm font-medium text-[#6BAD3D] hover:underline underline-offset-4">
              Read More →
            </Link>
          </div>
        </div>
      </section>

      {/* ── POST GRID ── */}
      <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="border-t border-black/[0.06] pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grid.map((post, i) => (
              <Link key={i} href={post.href} className="group">
              <article className="group cursor-pointer">
                <div className="relative aspect-[16/9] rounded-2xl mb-6 overflow-hidden">
                  <Image src={post.image} alt="" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 768px) 100vw, 380px" />
                </div>
                <p className="font-body text-[11px] uppercase tracking-[0.15em] text-[#8B5CF6] mb-2">{post.category}</p>
                <h3 className="font-display font-semibold text-[22px] leading-tight text-[#0D0D0D] mb-3 group-hover:text-[#6BAD3D] transition-colors">
                  {post.title}
                </h3>
                <p className="font-body text-sm text-[#6B6560] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <p className="font-body text-[12px] text-black/40">
                  {post.date} · {post.readTime}
                </p>
              </article>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-16">
            <button className="font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors">
              ← Previous
            </button>
            <span className="font-body text-sm text-black/30">Page 1 of 1</span>
            <button className="font-body text-sm text-[#6B6560] hover:text-[#0D0D0D] transition-colors">
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* ── BLOG CTA ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="bg-[#6BAD3D] rounded-3xl p-12 md:p-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 mb-6">Ready to talk?</p>
          <h2 className="font-display font-bold fluid-h2 leading-tight text-white mb-8 max-w-xl mx-auto">
            Stop reading. Start growing.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-[#0D0D0D] font-body font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-200"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>

    </div>
  )
}
