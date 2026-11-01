/**
 * Capture a client's current website for their design build: discover the
 * pages in its menu, and make full-page screenshot links for each (desktop and
 * phone) through ScreenshotOne. Links are signed, so nobody else can spend our
 * screenshots, and cached for 30 days; the Figma build copies them in.
 */
import { createHmac } from 'crypto'

export type CapturedPage = { title: string; url: string; desktop: string; mobile: string }
export type NavLink = { label: string; url: string }

const MAX_PAGES = 8

export const screenshotsConfigured = () => Boolean(process.env.SCREENSHOTONE_ACCESS_KEY && process.env.SCREENSHOTONE_SECRET_KEY)

/** A signed ScreenshotOne link for a full-page capture at one width. */
export function screenshotUrl(pageUrl: string, width: 1440 | 390) {
  const q = new URLSearchParams({
    access_key: process.env.SCREENSHOTONE_ACCESS_KEY || '',
    url: pageUrl,
    full_page: 'true',
    viewport_width: String(width),
    viewport_height: width === 390 ? '844' : '900',
    device_scale_factor: width === 390 ? '2' : '1',
    ...(width === 390 ? { viewport_mobile: 'true', viewport_has_touch: 'true' } : {}),
    format: 'jpg',
    image_quality: '80',
    block_cookie_banners: 'true',
    block_banners_by_heuristics: 'true',
    block_chats: 'true',
    block_ads: 'true',
    // Scroll first so lazy-loaded images are in the capture.
    full_page_scroll: 'true',
    wait_until: 'networkidle2',
    delay: '2',
    timeout: '60',
    cache: 'true',
    cache_ttl: '2592000',
  })
  const signature = createHmac('sha256', process.env.SCREENSHOTONE_SECRET_KEY || '').update(q.toString()).digest('hex')
  return `https://api.screenshotone.com/take?${q}&signature=${signature}`
}

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, '’').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
const text = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

/** Normalise what a client typed ("acme.com", "https://acme.com/") into a homepage URL, or null. */
export function homepage(raw: string): string | null {
  const v = raw.trim()
  if (!v || /\s/.test(v)) return null
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    if (!u.hostname.includes('.')) return null
    return `${u.protocol}//${u.host}/`
  } catch { return null }
}

/** The links in a site's main menu (its <nav>, else its <header>), same site only. */
export function menuLinks(html: string, base: string): NavLink[] {
  const block = html.match(/<nav[\s\S]*?<\/nav>/gi)?.join(' ') || html.match(/<header[\s\S]*?<\/header>/i)?.[0] || ''
  const host = new URL(base).host.replace(/^www\./, '')
  const out: NavLink[] = []
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  for (let m = re.exec(block); m; m = re.exec(block)) {
    if (m[1].startsWith('#')) continue
    let url: URL
    try { url = new URL(decode(m[1]), base) } catch { continue }
    if (!/^https?:$/.test(url.protocol) || url.host.replace(/^www\./, '') !== host) continue
    if (/\.(pdf|jpe?g|png|zip)$/i.test(url.pathname) || /\/(cart|account|login|wp-admin)/i.test(url.pathname)) continue
    url.search = ''; url.hash = ''
    const label = text(m[2]) || (m[0].match(/aria-label\s*=\s*["']([^"']+)/i)?.[1] ?? '')
    if (!out.some(l => l.url === url.href)) out.push({ label: label.slice(0, 60) || url.pathname, url: url.href })
  }
  return out
}

/** Fetch the homepage, read its menu, and make screenshot links for the homepage and its menu pages. */
export async function captureSite(raw: string): Promise<{ website: string; nav: NavLink[]; pages: CapturedPage[] } | null> {
  const home = homepage(raw)
  if (!home) return null
  let html = '', finalUrl = home
  try {
    const res = await fetch(home, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HewnLifeBot/1.0; +https://www.hewn.life)' }, signal: AbortSignal.timeout(15000) })
    finalUrl = res.url || home
    html = res.ok ? (await res.text()).slice(0, 2_000_000) : ''
  } catch { /* unreachable: still try a screenshot of what they gave us */ }
  const nav = html ? menuLinks(html, finalUrl) : []
  const title = text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || 'Home'
  const seen = new Set<string>()
  const pages: CapturedPage[] = []
  for (const p of [{ label: title, url: finalUrl }, ...nav]) {
    const key = p.url.replace(/\/$/, '')
    if (seen.has(key) || pages.length >= MAX_PAGES) continue
    seen.add(key)
    pages.push({ title: pages.length ? p.label : `Home · ${title}`, url: p.url, desktop: screenshotUrl(p.url, 1440), mobile: screenshotUrl(p.url, 390) })
  }
  return { website: finalUrl, nav, pages }
}
