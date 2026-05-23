import SectionEyebrow from '@/components/SectionEyebrow'
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
    excerpt: 'Most businesses lose 40% of their potential revenue to poor follow-up systems. Here\'s how to fix it in a week.',
    date: 'February 2026',
    readTime: '6 min read',
    featured: false,
  },
]

const featured = posts[0]
const grid = posts.slice(1)

export default function Blog() {
  return (
    <>
      {/* Section 5.1 — Hero */}
      <section className="bg-obsidian min-h-[60vh] flex items-end pb-24 relative overflow-hidden grain-overlay pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionEyebrow text="Insights" />
          <h1 className="font-display font-light italic text-[52px] md:text-[64px] leading-[1.08] text-cream max-w-3xl">
            Ideas on marketing, growth, and building businesses that actually work.
          </h1>
        </div>
      </section>

      {/* Section 5.2 — Featured Post */}
      <section className="bg-stone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <div className="aspect-[16/9] bg-marble rounded-2xl border border-black/[0.08] flex items-center justify-center">
                <p className="font-body text-sm text-slate">Featured Image</p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <SectionEyebrow text="Featured Post" light />
              <span className="inline-block bg-copper text-obsidian font-body text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {featured.category}
              </span>
              <h2 className="font-display font-medium text-[36px] leading-tight text-ink mb-4">
                {featured.title}
              </h2>
              <p className="font-body text-[12px] text-slate mb-4">{featured.date}</p>
              <p className="font-body text-base text-slate leading-relaxed mb-6">{featured.excerpt}</p>
              <Link href="/blog" className="font-body text-sm text-copper hover:underline underline-offset-4">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5.3 — Post Grid */}
      <section className="bg-stone pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="border-t border-black/10 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {grid.map((post, i) => (
                <article key={i} className="group cursor-pointer">
                  <div className="aspect-[16/9] bg-marble rounded-2xl border border-black/[0.08] mb-6 overflow-hidden group-hover:border-copper/30 transition-colors flex items-center justify-center">
                    <p className="font-body text-sm text-slate">Post Image</p>
                  </div>
                  <p className="font-body text-[11px] uppercase tracking-[0.15em] text-copper mb-2">{post.category}</p>
                  <h3 className="font-display font-medium text-[22px] leading-tight text-ink mb-3 group-hover:text-copper transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-slate leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <p className="font-body text-[12px] text-slate">
                    {post.date} · {post.readTime}
                  </p>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <button className="font-body text-sm text-slate hover:text-ink transition-colors flex items-center gap-2">
                ← Previous
              </button>
              <span className="font-body text-sm text-ash">Page 1 of 1</span>
              <button className="font-body text-sm text-slate hover:text-ink transition-colors flex items-center gap-2">
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5.4 — Blog CTA */}
      <section className="bg-charcoal py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <SectionEyebrow text="Ready to talk?" />
          <h2 className="font-display font-normal text-[44px] leading-tight text-cream mb-6 max-w-xl mx-auto">
            Stop reading. Start growing.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center bg-copper text-obsidian font-body font-medium px-8 py-4 rounded-full hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </>
  )
}
