import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.hewn.life'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/website-in-a-week`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = [
    'answer-engine-optimization-small-business',
    'ai-marketing-for-small-business',
    'how-much-does-a-marketing-agency-cost',
    'agency-vs-in-house-marketing-cost',
    'launch-marketing-fast',
  ].map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date('2026-05-01'),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
