/** Social platforms the calendar posts to, with the limits each one enforces. */
export const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'Google Business', 'X', 'YouTube', 'Threads', 'Pinterest'] as const
export type Platform = typeof PLATFORMS[number]

export const FORMATS = ['Post', 'Carousel', 'Reel / short video', 'Story', 'Text'] as const
export type Format = typeof FORMATS[number]

type Rule = { short: string; color: string; maxChars: number; needsMedia?: boolean; needsVideo?: boolean; shape: string }

/** Caption limits and media rules, from each platform's published limits. */
export const RULES: Record<Platform, Rule> = {
  Instagram: { short: 'IG', color: '#C13584', maxChars: 2200, needsMedia: true, shape: '4:5 feed, 9:16 Reels/Stories' },
  Facebook: { short: 'FB', color: '#1877F2', maxChars: 63206, shape: '4:5 or 1:1, 9:16 Reels' },
  LinkedIn: { short: 'in', color: '#0A66C2', maxChars: 3000, shape: '1.91:1 or 1:1' },
  TikTok: { short: 'TT', color: '#111111', maxChars: 2200, needsMedia: true, needsVideo: true, shape: '9:16 video' },
  'Google Business': { short: 'G', color: '#34A853', maxChars: 1500, shape: '4:3 or 1:1' },
  X: { short: 'X', color: '#000000', maxChars: 280, shape: '16:9 or 1:1' },
  YouTube: { short: 'YT', color: '#FF0000', maxChars: 5000, needsMedia: true, needsVideo: true, shape: '9:16 Shorts, 16:9 video' },
  Threads: { short: '@', color: '#000000', maxChars: 500, shape: '4:5 or 1:1' },
  Pinterest: { short: 'P', color: '#E60023', maxChars: 500, needsMedia: true, shape: '2:3 vertical' },
}

export type Issue = { platform: Platform; text: string }

/** What would stop a post going out on each platform: caption too long, or missing media or video. */
export function checkPost(p: { caption: string; overrides: Partial<Record<Platform, string>>; platforms: Platform[] }, media: { type: string }[]): Issue[] {
  const hasMedia = media.length > 0
  const hasVideo = media.some(m => m.type.startsWith('video/'))
  const issues: Issue[] = []
  for (const pl of p.platforms) {
    const r = RULES[pl]
    const text = p.overrides[pl] ?? p.caption
    if (text.length > r.maxChars) issues.push({ platform: pl, text: `${text.length - r.maxChars} characters over the ${r.maxChars.toLocaleString()} limit` })
    if (r.needsVideo && !hasVideo) issues.push({ platform: pl, text: 'needs a video' })
    else if (r.needsMedia && !hasMedia) issues.push({ platform: pl, text: 'needs an image or video' })
  }
  return issues
}
