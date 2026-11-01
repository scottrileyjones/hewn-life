/**
 * The à la carte shop: one-time add-ons, grouped into sections, and kits that
 * bundle a section's items for less. Prices here are for display; checkout
 * charges the Stripe price itself (server-side), so the two must match.
 * Browser-safe: used by the pricing page, checkout, the API and agreements.
 */
import type { GlyphKey } from '@/lib/strata'

export type AddOn = { sku: string; name: string; detail: string; fee: number; priceId: string }
export type Kit = { sku: string; name: string; pitch: string; includes: string[]; fee: number; priceId: string }
export type Section = { key: string; title: string; blurb: string; glyph: GlyphKey; kit: string; items: string[] }

export const ADDONS: AddOn[] = [
  { sku: 'gbp', name: 'Google Business Profile Tune-Up', fee: 395, priceId: 'price_1UX2tvIQRRcdxnwWeoB5TKEJ',
    detail: 'Your profile fully filled out and optimized: categories, services, photos, description and first posts, with your details matched across the main directories.' },
  { sku: 'visibility', name: 'AI & Local Visibility Audit', fee: 595, priceId: 'price_1UX2u0IQRRcdxnwWMqaLIbHG',
    detail: 'How you show up on Google, Maps, ChatGPT and Gemini next to your competitors, with a ranked list of fixes.' },
  { sku: 'reviews', name: 'Review Engine Setup', fee: 495, priceId: 'price_1UX2u7IQRRcdxnwW9We57kyY',
    detail: 'Automatic review requests by text and email after each job, a QR card for your counter, and reply templates.' },
  { sku: 'ads_audit', name: 'Ads Audit + Tracking Fix', fee: 495, priceId: 'price_1UX2uEIQRRcdxnwWyod6ntOx',
    detail: 'Your Google and Meta accounts reviewed for wasted spend, and conversion tracking fixed so you can see which ads work.' },
  { sku: 'creatives', name: 'Ad Creative Pack', fee: 800, priceId: 'price_1UX2uKIQRRcdxnwW8zqbpek3',
    detail: '8 ad creatives, static or motion, sized for any platform.' },
  { sku: 'landing', name: 'Landing Page in a Day', fee: 695, priceId: 'price_1UX2uRIQRRcdxnwW1FhgFf1O',
    detail: 'One focused page for an ad or offer, designed, written and live within 24 hours of your brief.' },
  { sku: 'email', name: 'Email Automation Build-Out', fee: 1200, priceId: 'price_1UX2uUIQRRcdxnwWzKQZyG09',
    detail: 'A 6-email welcome, nurture or sales sequence, written and built in your email tool.' },
  { sku: 'blog', name: 'SEO Blog Pack', fee: 1200, priceId: 'price_1UX2uaIQRRcdxnwWQ2jy8HKP',
    detail: '4 posts of 1,200 to 1,500 words, keyword-researched and ready to publish.' },
  { sku: 'video', name: 'Video Clip Pack', fee: 495, priceId: 'price_1UX2uhIQRRcdxnwWpuZOh4Ix',
    detail: 'One video turned into 10 captioned short clips for Reels, TikTok and Shorts.' },
  { sku: 'brand', name: 'Brand Identity Refresh', fee: 1950, priceId: 'price_1UX2uzIQRRcdxnwWQzBFzTCA',
    detail: 'Your logo, colors and type refreshed, delivered with a style guide and ready-to-use files.' },
  { sku: 'copy', name: 'Full Website Copy', fee: 1250, priceId: 'price_1UX2v1IQRRcdxnwWsGXnAoK7',
    detail: 'Five pages written, structured and optimized to turn visitors into calls.' },
]

export const KITS: Kit[] = [
  { sku: 'kit_found', name: 'Get Found Kit', pitch: 'Show up when locals search, and look like the obvious choice.', includes: ['gbp', 'visibility', 'reviews'], fee: 1195, priceId: 'price_1UX2v4IQRRcdxnwWwvOwayR5' },
  { sku: 'kit_ads', name: 'Ad Launch Kit', pitch: 'Ads that are tracked, look the part and land on a page built to convert.', includes: ['ads_audit', 'creatives', 'landing'], fee: 1595, priceId: 'price_1UX2vAIQRRcdxnwWOqNmwTIJ' },
  { sku: 'kit_content', name: 'Content Engine Kit', pitch: 'A month of posts, clips and emails that keep you top of mind.', includes: ['email', 'blog', 'video'], fee: 2295, priceId: 'price_1UX2vDIQRRcdxnwWc9ECw0nR' },
  { sku: 'kit_brand', name: 'Brand Makeover Kit', pitch: 'A fresh look and the words to match.', includes: ['brand', 'copy'], fee: 2595, priceId: 'price_1UX2vGIQRRcdxnwWIkQNohC6' },
]

export const SECTIONS: Section[] = [
  { key: 'found', title: 'Get found', blurb: 'Show up on Google, Maps and AI answers.', glyph: 'seo', kit: 'kit_found', items: ['gbp', 'visibility', 'reviews'] },
  { key: 'ads', title: 'Win the click', blurb: 'Ads you can measure, and a page that converts.', glyph: 'media', kit: 'kit_ads', items: ['ads_audit', 'creatives', 'landing'] },
  { key: 'content', title: 'Stay top of mind', blurb: 'Content and email that keep customers coming back.', glyph: 'lifecycle', kit: 'kit_content', items: ['email', 'blog', 'video'] },
  { key: 'brand', title: 'Look the part', blurb: 'A brand and words that match the work you do.', glyph: 'creative', kit: 'kit_brand', items: ['brand', 'copy'] },
]

const bySku = new Map<string, AddOn | Kit>([...ADDONS, ...KITS].map(x => [x.sku, x]))
export const lookup = (sku: string) => bySku.get(sku)
export const isKit = (x: AddOn | Kit): x is Kit => 'includes' in x
/** What a kit's items cost on their own. */
export const kitListPrice = (k: Kit) => k.includes.reduce((t, s) => t + (lookup(s)?.fee ?? 0), 0)

/**
 * Tidy a cart: drop unknown or repeated SKUs, drop items a chosen kit already
 * covers, and swap in a kit wherever every one of its items was picked.
 */
export function normalizeCart(skus: string[]): string[] {
  let cart = skus.filter((s, i) => bySku.has(s) && skus.indexOf(s) === i)
  for (const k of KITS) {
    if (!cart.includes(k.sku) && k.includes.every(s => cart.includes(s))) cart.push(k.sku)
    if (cart.includes(k.sku)) cart = cart.filter(s => !k.includes.includes(s))
  }
  return cart
}

export function cartTotals(skus: string[]) {
  const lines = normalizeCart(skus).map(s => lookup(s)!)
  const total = lines.reduce((t, x) => t + x.fee, 0)
  const list = lines.reduce((t, x) => t + (isKit(x) ? kitListPrice(x) : x.fee), 0)
  return { lines, total, saved: list - total }
}

/** The nearest kit a cart is one item away from, to nudge with. */
export function kitNudge(skus: string[]) {
  const cart = normalizeCart(skus)
  for (const k of KITS) {
    if (cart.includes(k.sku)) continue
    const missing = k.includes.filter(s => !cart.includes(s))
    if (missing.length === 1 && k.includes.length > 1) {
      const have = k.includes.filter(s => cart.includes(s)).reduce((t, s) => t + lookup(s)!.fee, 0)
      return { kit: k, add: lookup(missing[0]) as AddOn, extra: k.fee - have, saves: kitListPrice(k) - k.fee }
    }
  }
  return null
}
