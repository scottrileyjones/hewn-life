import Link from 'next/link'

const posts = [
  {
    category: 'Brand Strategy',
    title: 'Why Your Brand is Your Most Valuable Business Asset',
    excerpt: 'Most business owners treat their brand as a logo and some colors. The businesses that win treat it as the foundation of every decision they make.',
    date: 'May 2026',
    readTime: '6 min read',
    featured: true,
  },
  {
    category: 'Lead Generation',
    title: 'The Local Business Lead Machine: A 90-Day Framework',
    excerpt: 'A systematic approach to generating qualified local leads without relying on referrals or word-of-mouth alone.',
    date: 'April 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    category: 'AI & Marketing',
    title: 'How AI is Changing What Small Businesses Can Afford',
    excerpt: 'For the first time in history, small businesses can access Fortune 500-level marketing capabilities at a fraction of the cost.',
    date: 'April 2026',
    readTime: '5 min read',
    featured: false,
  },
  {
    category: 'Pricing & Value',
    title: 'Why Traditional Agency Pricing is Broken',
    excerpt: 'Percentage of spend, hourly billing, and bloated retainers — the old model benefits the agency, not the client.',
    date: 'March 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    category: 'SEO',
    title: 'Local SEO in 2026: What Actually Moves the Needle',
    excerpt: 'Google Maps, review velocity, and E-E-A-T signals — a plain-English guide to local search dominance.',
    date: 'March 2026',
    readTime: '9 min read',
    featured: false,
  },
  {
    category: 'Customer Experience',
    title: 'The Follow-Up That Saves the Sale',
    excerpt: "Most businesses lose 40% of their potential revenue to poor follow-up systems. Here's how to fix it in a week.",
    date: 'February 2026',
    readTime: '6 min read',
    featured: false,
  },
]

const featured = posts[0]
const grid = posts.slice(1)

export default function Blog() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-up max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#E9D5FF] text-[#6D28D9] rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="font-body text-xs font-medium tracking-wide">Insights</span>
          </div>
          <h1 className="hero-heading text-[48px] md:text-[64px] text-[#0D0D0D] leading-[0.98]">
            Ideas on marketing, growth, and building businesses that actually{' '}
            <span className="accent" style={{ color: '#6BAD3D' }}>work.</span>
          </h1>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <div className="aspect-[16/9] bg-[#F0F7EB] rounded-3xl flex items-center justify-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6BAD3D]/40">Featured Image</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <span className="inline-block bg-[#E9D5FF] text-[#6D28D9] font-body text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wider mb-5">
              {featured.category}
            </span>
            <h2 className="font-display font-bold text-[32px] leading-tight text-[#0D0D0D] mb-4">
              {featured.title}
            </h2>
            <p className="font-body text-[12px] text-[#6B6560] mb-4">{featured.date} · {featured.readTime}</p>
            <p className="font-body text-base text-[#6B6560] leading-relaxed mb-6">{featured.excerpt}</p>
            <Link href="/blog" className="font-body text-sm font-medium text-[#6BAD3D] hover:underline underline-offset-4">
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
              <article key={i} className="group cursor-pointer">
                <div className="aspect-[16/9] bg-[#F7F6F3] rounded-2xl mb-6 overflow-hidden group-hover:bg-[#F0F7EB] transition-colors flex items-center justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/20">Post Image</p>
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
          <h2 className="font-display font-bold text-[40px] leading-tight text-white mb-8 max-w-xl mx-auto">
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
