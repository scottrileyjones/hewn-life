import type { Metadata } from 'next'
import BlogPost, { BlogCta, ALL_POSTS } from '@/components/BlogPost'

const related = ALL_POSTS.filter(p => p.href !== '/blog/how-much-does-a-marketing-agency-cost').slice(0, 3)

export const metadata: Metadata = {
  title: 'How Much Does a Marketing Agency Cost for a Small Business in 2026?',
  description: 'Real numbers, no fluff. What small businesses actually pay for marketing agencies in 2026 — and how to know if you\'re getting a good deal.',
  alternates: { canonical: 'https://www.hewn.life/blog/how-much-does-a-marketing-agency-cost' },
  openGraph: {
    title: 'How Much Does a Marketing Agency Cost for a Small Business in 2026?',
    description: 'Real numbers, no fluff. What small businesses actually pay for marketing agencies in 2026 — and how to know if you\'re getting a good deal.',
    url: 'https://www.hewn.life/blog/how-much-does-a-marketing-agency-cost',
    type: 'article',
    publishedTime: '2026-05-08',
    authors: ['Hewn Life'],
    images: [{ url: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg', width: 1200, height: 630 }],
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a marketing agency cost for a small business?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most small businesses ($500K–$5M in revenue), a full-service marketing agency retainer costs $2,000–$7,000 per month in 2026. Below $2,000/month you\'re typically getting freelance or template services. Above $7,000/month you\'re often paying for agency overhead rather than better results. AI-powered agencies can deliver full-service programs starting around $2,500/month.' },
    },
    {
      '@type': 'Question',
      name: 'What is included in a marketing agency retainer?',
      acceptedAnswer: { '@type': 'Answer', text: 'A full-service marketing agency retainer typically includes: brand strategy and creative direction, website management, SEO and content marketing, paid media management (Google, Meta), social media management, email marketing, marketing automation, and reporting. The exact mix depends on the agency and tier. Always confirm exactly what deliverables are included before signing.' },
    },
    {
      '@type': 'Question',
      name: 'Is hiring a marketing agency worth it for a small business?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most small businesses under $2M in revenue, a $2,500–$5,000/month agency relationship delivers better ROI than hiring in-house. A full-time marketing hire costs $97,000–$112,000 fully loaded and covers only one skill set. An agency covers strategy, creative, SEO, paid media, and analytics at a lower total cost.' },
    },
    {
      '@type': 'Question',
      name: 'What should I ask a marketing agency before hiring them?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ask: What specific metrics will you move in the first 90 days, and how will we measure them? This question separates performance-driven agencies from those that hide behind vague brand strategy language. Also ask about their AI tooling and workflow, who will actually be doing your work, and how they price — flat fee vs. percentage of ad spend makes a significant difference.' },
    },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.hewn.life' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.hewn.life/blog' },
    { '@type': 'ListItem', position: 3, name: 'How Much Does a Marketing Agency Cost?', item: 'https://www.hewn.life/blog/how-much-does-a-marketing-agency-cost' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'How Much Does a Marketing Agency Cost for a Small Business in 2026?',
  description: 'Real numbers, no fluff. What small businesses actually pay for marketing agencies in 2026 — and how to know if you\'re getting a good deal.',
  image: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg',
  datePublished: '2026-05-08',
  dateModified: '2026-05-08',
  author: { '@type': 'Person', name: 'Scott Jones', jobTitle: 'Founder', url: 'https://www.hewn.life/about' },
  publisher: { '@type': 'Organization', name: 'Hewn Life', url: 'https://www.hewn.life' },
  url: 'https://www.hewn.life/blog/how-much-does-a-marketing-agency-cost',
  mainEntityOfPage: 'https://www.hewn.life/blog/how-much-does-a-marketing-agency-cost',
  keywords: 'marketing agency cost, agency pricing, small business marketing budget, how much does an agency cost',
}

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <BlogPost relatedPosts={related} meta={{
      category: 'Pricing & Value',
      title: 'How Much Does a Marketing Agency Cost for a Small Business in 2026?',
      excerpt: 'Real numbers, no fluff. What small businesses actually pay — and how to know if you\'re overpaying.',
      date: 'May 2026',
      readTime: '7 min read',
      image: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1400,h_788,c_fill/v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg',
    }}>
      <p>
        If you've ever Googled "how much does a marketing agency cost" and ended up more confused than when you started, you're not alone. The range is absurd — from $500 a month to $50,000 a month — and most of the content out there is written by agencies with a vested interest in making their pricing look reasonable.
      </p>
      <p>
        So let's just be direct about it. Here's what the market actually looks like for small and mid-size businesses in 2026, and how to think about whether you're getting real value.
      </p>

      <div className="my-10 rounded-2xl border border-black/[0.07] bg-[#F9F7F4] overflow-hidden">
        <div className="px-7 py-5 border-b border-black/[0.07]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89F92]">Quick answers</p>
        </div>
        {[
          { q: 'How much does a marketing agency cost for a small business?', a: 'For most small businesses ($500K–$5M revenue), a full-service retainer runs $2,000–$7,000/month in 2026. AI-powered agencies can deliver full-service programs starting around $2,500/month. Below $2,000/month you\'re typically getting freelance or template services.' },
          { q: 'What\'s included in a marketing agency retainer?', a: 'Typically: brand strategy, website management, SEO and content, paid media (Google/Meta), social media, email marketing, automation, and reporting. Always confirm exact deliverables in writing before signing.' },
          { q: 'Is hiring an agency worth it for a small business?', a: 'For most businesses under $2M revenue, yes. A full-time hire costs $97K–$112K fully loaded and covers one skill set. An agency at $2,500–$5,000/month covers strategy, creative, SEO, paid media, and analytics at lower total cost.' },
          { q: 'What should I ask before hiring a marketing agency?', a: '"What specific metrics will you move in the first 90 days, and how will we measure them?" Good agencies answer specifically. Also ask who will actually do the work, how they use AI in their workflow, and whether they charge flat fees or percentage of spend.' },
        ].map(({ q, a }, i) => (
          <div key={i} className="px-7 py-6 border-b border-black/[0.07] last:border-0">
            <p className="font-display font-semibold text-[16px] text-[#0D0D0D] mb-2">{q}</p>
            <p className="font-body text-sm text-[#6B6560] leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <h2>The honest numbers</h2>
      <p>
        For most small businesses — say, $500K to $5M in annual revenue — a full-service marketing agency retainer lands somewhere between <strong>$2,000 and $7,000 per month</strong>. That's the realistic middle of the market for businesses that need strategy, execution, and some level of ongoing reporting.
      </p>
      <p>
        Below that range, you're generally getting a freelancer or a template-driven service that won't adapt to your business. Above it, you're often paying for account managers, overhead, and a fancy office — not better results.
      </p>

      <div className="stat-callout">
        <span className="stat-number">$36K–$84K</span>
        <p>What most small businesses pay annually for a full-service agency retainer. For comparison, a single in-house marketer costs $130K–$150K when you factor in salary, benefits, tools, and management overhead.</p>
      </div>
      <p className="source-note">Source: <a href="https://www.webfx.com/blog/marketing/marketing-agency-cost/" target="_blank" rel="noopener noreferrer">WebFX Marketing Agency Cost Guide 2026</a>, <a href="https://agencyradar.app/blog/in-house-marketing-vs-agency-cost" target="_blank" rel="noopener noreferrer">AgencyRadar Cost Breakdown 2026</a></p>

      <h2>What you're actually buying</h2>
      <p>
        The number is mostly meaningless without context. What matters is the ratio of strategic output to dollars spent. A $3,000/month retainer that gets you a dedicated strategist, content, ads management, and monthly reporting is a completely different product than a $3,000/month retainer that gets you a junior coordinator sending you reports you don't understand.
      </p>
      <p>
        Here's a rough breakdown of what different budget tiers typically buy in today's market:
      </p>
      <ul>
        <li><strong>Under $1,500/mo:</strong> One or two services, likely execution-only. Good for specific needs (e.g. social posting), not for growth.</li>
        <li><strong>$2,000–$4,000/mo:</strong> A foundation package — website, basic SEO, brand consistency. The right starting point for most businesses building from scratch.</li>
        <li><strong>$4,000–$7,000/mo:</strong> Full-funnel activation. SEO, paid media, email, content. This is where the compounding begins.</li>
        <li><strong>$7,000+/mo:</strong> Aggressive multi-channel execution, dedicated strategy, and serious scale. Appropriate when marketing is clearly the lever for growth.</li>
      </ul>

      <h2>Why traditional agency pricing feels broken</h2>
      <p>
        Most traditional agencies are built around billable hours, account teams, and percentage-of-spend models that misalign their incentives with yours. An agency that earns more when your ad spend increases isn't necessarily motivated to make your ads more efficient — they're motivated to make them bigger.
      </p>
      <p>
        The flat retainer model is better. You know exactly what you're paying, and the agency's job is to produce results within that constraint — not to expand scope every quarter.
      </p>

      <blockquote>
        The best agency relationships feel like a senior hire you can't afford. You're getting strategic thinking, execution capacity, and accountability — without the overhead of a full-time team.
      </blockquote>

      <h2>What AI has changed about pricing</h2>
      <p>
        This is the part most agencies don't talk about openly. AI-powered workflows have dramatically reduced the labor cost of content creation, ad copy iteration, SEO research, and reporting. A well-built AI-integrated agency can now produce work that would have taken a three-person team in 2022 with a fraction of the headcount.
      </p>
      <p>
        The agencies passing those efficiency gains to clients are offering better deliverables at lower price points. The ones that aren't are simply protecting margin. Worth asking your agency directly: where does AI fit into your workflow?
      </p>
      <p>
        At Hewn Life, it's the reason we can offer <a href="/pricing">full-service packages starting at $2,500/month</a> — not because we cut corners, but because our tools let us move faster without adding headcount.
      </p>

      <h2>The question to ask before signing anything</h2>
      <p>
        Forget the deck. Forget the case studies. Ask one thing: <em>What specific metrics will you move in the first 90 days, and how will we measure them?</em>
      </p>
      <p>
        A good agency will answer that question specifically. A bad one will pivot to talking about brand awareness, long-term strategy, or the complexity of your market. Those things matter, but not as the primary answer in month one.
      </p>

      <BlogCta text="Not sure what tier makes sense for your business? Take our 7-question ROI assessment." />

      <h2>Bottom line</h2>
      <p>
        For most small businesses under $2M in revenue, a $2,500–$5,000/month agency relationship delivers better ROI than hiring in-house. The math almost always works out that way, especially when you factor in the full cost of employment. The key is finding an agency that operates with real efficiency, prices transparently, and ties their work to outcomes you can measure.
      </p>
      <p>
        That's what we built Hewn Life around. If that sounds like what you've been looking for, start with <a href="/quiz">our free ROI assessment</a> — it takes seven minutes and gives you a real revenue projection based on your actual numbers.
      </p>
    </BlogPost>
    </>
  )
}
