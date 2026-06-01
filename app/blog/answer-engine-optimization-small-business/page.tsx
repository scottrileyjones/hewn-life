import type { Metadata } from 'next'
import BlogPost, { BlogCta, ALL_POSTS } from '@/components/BlogPost'

const related = ALL_POSTS.filter(p => p.href !== '/blog/answer-engine-optimization-small-business').slice(0, 3)

export const metadata: Metadata = {
  title: 'Answer Engine Optimization (AEO): How Small Businesses Get Found in AI Search',
  description: 'Google isn\'t the only game in town anymore. Here\'s how small businesses can show up in ChatGPT, Perplexity, and AI Overviews — before your competitors figure it out.',
  alternates: { canonical: 'https://www.hewn.life/blog/answer-engine-optimization-small-business' },
  openGraph: {
    title: 'Answer Engine Optimization (AEO): How Small Businesses Get Found in AI Search',
    description: 'Google isn\'t the only game in town anymore. Here\'s how small businesses can show up in ChatGPT, Perplexity, and AI Overviews — before your competitors figure it out.',
    url: 'https://www.hewn.life/blog/answer-engine-optimization-small-business',
    type: 'article',
    publishedTime: '2026-05-15',
    authors: ['Hewn Life'],
    images: [{ url: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1780207193/girl_online_shopping_lqod5j.jpg', width: 1200, height: 630 }],
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Answer Engine Optimization (AEO)?',
      acceptedAnswer: { '@type': 'Answer', text: 'Answer Engine Optimization (AEO) is the practice of structuring your web content so AI-powered search engines — like ChatGPT, Perplexity, and Google AI Overviews — can easily extract and cite your content as a direct answer. It involves clear question-and-answer formatting, FAQ sections, structured data markup, and leading with the answer rather than burying it.' },
    },
    {
      '@type': 'Question',
      name: 'How do I get my business to show up in ChatGPT and AI search results?',
      acceptedAnswer: { '@type': 'Answer', text: 'To show up in ChatGPT and AI search results: (1) Format your content with clear question headings and direct answers in the first two sentences. (2) Add FAQ sections to your key pages. (3) Get cited on other reputable sites. (4) Keep your Google Business Profile complete and accurate. (5) Use structured data (JSON-LD schema) on your pages. AI systems favor content that is structured, credible, and clearly answers specific questions.' },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between AEO and traditional SEO?',
      acceptedAnswer: { '@type': 'Answer', text: 'Traditional SEO optimizes for ranking in Google\'s 10 blue links by targeting keywords, building backlinks, and improving technical performance. AEO (Answer Engine Optimization) optimizes for being cited directly by AI systems like ChatGPT, Perplexity, and Google AI Overviews. AEO focuses on content structure, direct answers, and entity clarity rather than keyword density. Both are important — AEO is a layer on top of good SEO, not a replacement for it.' },
    },
    {
      '@type': 'Question',
      name: 'How long does AEO take to work for a small business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most small businesses see measurable improvements in AI search visibility within 4–8 weeks of implementing basic AEO practices. This includes adding FAQ sections, restructuring existing content to lead with direct answers, and ensuring consistent entity information across their site and Google Business Profile. More competitive niches may take longer.' },
    },
    {
      '@type': 'Question',
      name: 'Is AEO worth it for small businesses?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — small businesses are actually well-positioned for AEO. AI search systems favor geographic specificity and niche expertise, which is where small businesses can genuinely compete. A focused local business that structures its content well can outperform large national brands for local and niche queries in AI search, even without a massive backlink profile.' },
    },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Answer Engine Optimization (AEO): How Small Businesses Get Found in AI Search',
  description: 'Google isn\'t the only game in town anymore. Here\'s how small businesses can show up in ChatGPT, Perplexity, and AI Overviews — before your competitors figure it out.',
  image: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1780207193/girl_online_shopping_lqod5j.jpg',
  datePublished: '2026-05-15',
  author: { '@type': 'Organization', name: 'Hewn Life', url: 'https://www.hewn.life' },
  publisher: { '@type': 'Organization', name: 'Hewn Life', url: 'https://www.hewn.life' },
  url: 'https://www.hewn.life/blog/answer-engine-optimization-small-business',
  mainEntityOfPage: 'https://www.hewn.life/blog/answer-engine-optimization-small-business',
  keywords: 'answer engine optimization, AEO, AI search, small business SEO, ChatGPT visibility, Perplexity optimization',
}

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <BlogPost relatedPosts={related} meta={{
      category: 'SEO',
      title: 'Answer Engine Optimization (AEO): How Small Businesses Get Found in AI Search',
      excerpt: 'Google isn\'t the only game in town anymore. Here\'s how to show up in ChatGPT, Perplexity, and AI Overviews before your competitors figure it out.',
      date: 'May 2026',
      readTime: '9 min read',
      image: 'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_1400,h_788,c_fill/v1780207193/girl_online_shopping_lqod5j.jpg',
    }}>
      <p>
        Search is in the middle of the most significant structural shift since Google replaced the directory. For two decades, ranking in search meant ranking on Google. Today, a growing percentage of searches — especially research-intent queries — never reach Google at all. They go to ChatGPT, Perplexity, Claude, or they get answered directly by Google's own AI Overview before the user ever clicks a result.
      </p>
      <p>
        This is not a distant threat. It's already happening. And for small businesses that position early, it's a significant opportunity.
      </p>

      <div className="my-10 rounded-2xl border border-black/[0.07] bg-[#F9F7F4] overflow-hidden">
        <div className="px-7 py-5 border-b border-black/[0.07]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89F92]">Quick answers</p>
        </div>
        {[
          {
            q: 'What is Answer Engine Optimization (AEO)?',
            a: 'AEO is the practice of structuring your content so AI-powered search engines — ChatGPT, Perplexity, Google AI Overviews — can easily extract and cite it as a direct answer. It prioritizes clear question-and-answer formatting, structured data, and leading with the answer.',
          },
          {
            q: 'How do I get my business to show up in ChatGPT?',
            a: 'Use question-based headings with direct answers in the first two sentences. Add FAQ sections to key pages. Keep your Google Business Profile complete. Use JSON-LD schema markup. Get cited on credible external sites. AI systems favor structured, credible, direct content.',
          },
          {
            q: 'What\'s the difference between AEO and traditional SEO?',
            a: 'Traditional SEO targets keyword rankings in Google\'s blue links via backlinks and technical performance. AEO optimizes for being cited by AI systems directly. Both matter — AEO is a layer on top of good SEO, not a replacement.',
          },
          {
            q: 'How long does AEO take to work for a small business?',
            a: 'Most small businesses see measurable improvements in 4–8 weeks after restructuring content to lead with direct answers, adding FAQ sections, and cleaning up their Google Business Profile.',
          },
        ].map(({ q, a }, i) => (
          <div key={i} className="px-7 py-6 border-b border-black/[0.07] last:border-0">
            <p className="font-display font-semibold text-[16px] text-[#0D0D0D] mb-2">{q}</p>
            <p className="font-body text-sm text-[#6B6560] leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <h2>AEO and GEO — what's the actual difference?</h2>
      <p>
        You'll hear two terms thrown around here: <strong>Answer Engine Optimization (AEO)</strong> and <strong>Generative Engine Optimization (GEO)</strong>. They're closely related and some practitioners use them interchangeably, but there's a meaningful distinction worth understanding.
      </p>
      <p>
        AEO is about making it easy for a system to pull a direct answer from your page. Clear question-and-answer formatting, structured FAQs, direct declarative sentences near the top of a page. It's optimizing for the moment an AI or search engine asks: <em>does this page answer the query?</em>
      </p>
      <p>
        GEO goes a step further — it's about getting cited by large language models when they synthesize an answer. ChatGPT, Perplexity, and Claude all pull from the web to build responses. GEO is the practice of making your content the kind of source they trust: data-backed, clearly attributed, structured, and credible.
      </p>
      <p className="source-note">Source: <a href="https://www.jasper.ai/blog/geo-aeo" target="_blank" rel="noopener noreferrer">Jasper — GEO vs AEO vs SEO Guide 2026</a></p>

      <h2>Why small businesses have an edge right now</h2>
      <p>
        Here's the counterintuitive part: small and local businesses are actually well-positioned for this shift, not disadvantaged by it.
      </p>
      <p>
        Large national brands have the domain authority advantage in traditional SEO. But AI search is pulling toward geographic specificity, niche expertise, and locally relevant answers — areas where a focused small business can genuinely win.
      </p>
      <p>
        When someone asks ChatGPT "who's the best marketing agency for a small HVAC company in Denver," the answer doesn't come from the company with the biggest backlink profile. It comes from whoever has published clear, structured content that addresses that exact question — and whose online presence signals real expertise and credibility in that niche.
      </p>

      <div className="stat-callout">
        <span className="stat-number">4–8 weeks</span>
        <p>Typical time for small businesses to see measurable improvements in AI search visibility after implementing basic AEO/GEO practices — and most can start with free tools.</p>
      </div>
      <p className="source-note">Source: <a href="https://blog.hubspot.com/marketing/generative-engine-optimization-small-business" target="_blank" rel="noopener noreferrer">HubSpot — GEO for Small Business 2026</a></p>

      <h2>Five things you can do right now</h2>
      <p>
        This doesn't require a massive overhaul. It requires intentional content structure and consistency. Here's where to start:
      </p>
      <ul>
        <li><strong>Format your content for answers.</strong> Use real question headings (H2s that start with "what," "how," "why") and answer them in the first two sentences beneath each heading. Don't bury the answer at the end of a paragraph.</li>
        <li><strong>Add statistics and citations.</strong> LLMs favor content with attributed data. If you're writing about your industry, reference real numbers from credible sources. It signals that your content is trustworthy enough to synthesize from.</li>
        <li><strong>Build a robust FAQ section.</strong> On your homepage, service pages, and key blog posts. These are highly indexable by AI systems and directly address the question-and-answer format that AEO rewards.</li>
        <li><strong>Get your Google Business Profile in order.</strong> Local AI queries pull from GBP data heavily. Name, address, phone (NAP) consistency, review volume, and category accuracy all feed into how confidently an AI system will recommend you.</li>
        <li><strong>Think in entities, not just keywords.</strong> Traditional SEO optimizes for keywords. AI search understands entities — your business, what you do, where you're located, who you've worked with. The more consistently this information appears across your site and the web, the more authoritative your entity becomes.</li>
      </ul>

      <h2>The content format that wins in AI search</h2>
      <p>
        The first 150–200 words of any page now carry disproportionate weight. That's where AI systems determine what a page is about and whether it's usable as a source. The old SEO habit of burying your main point after a lengthy intro is actively hurting you in AI search.
      </p>
      <p>
        Lead with the answer. Use subheadings liberally. Structure your content the way a good textbook would — clear hierarchy, direct answers, supporting evidence. It's better writing anyway.
      </p>

      <blockquote>
        Businesses that thrive in AI search make themselves easy for AI to understand by publishing information that is structured, credible, and rooted in real experience.
      </blockquote>
      <p className="source-note">Source: <a href="https://blog.hubspot.com/marketing/answer-engine-optimization-trends" target="_blank" rel="noopener noreferrer">HubSpot — Answer Engine Optimization Trends 2026</a></p>

      <h2>How this fits into a broader SEO strategy</h2>
      <p>
        AEO and GEO aren't replacements for traditional SEO. Google still processes billions of searches a day, and ranking there still matters enormously. Think of AEO/GEO as a layer on top — the same content quality and topical authority that makes you rank on Google also makes you more likely to be cited by AI systems.
      </p>
      <p>
        If you're already investing in SEO, you're closer than you think. Schema markup, technical health, E-E-A-T signals, content depth — these are the same foundations that power AI search visibility. The gap is mostly in formatting and intentionality.
      </p>

      <BlogCta text="Want a content and SEO strategy built for both Google and AI search? Let's talk." />

      <p>
        This is one of the places where working with an agency that stays current on the technical landscape actually matters. The tactics are shifting quarterly. If your SEO strategy hasn't been revisited since 2024, it's missing the most important changes in the channel's history.
      </p>
      <p>
        Start with our <a href="/quiz">free marketing assessment</a> — it includes a look at your current digital presence and will give you a clear starting point for where search fits in your growth plan.
      </p>
    </BlogPost>
    </>
  )
}
