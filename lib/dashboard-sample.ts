/**
 * Sample data for the public /dashboard demo.
 *
 * "Northline Home Services" is a fictional client. Numbers are generated
 * from a seeded PRNG so every render (server and client) is identical.
 */

export type Platform = 'Meta' | 'Google'

export interface Strategy {
  id: string
  name: string
  platform: Platform
  color: string
  /** Mean daily spend in dollars. */
  spend: number
  /** Mean cost per booked job in dollars. */
  cpa: number
}

export interface DayRow {
  date: string // ISO yyyy-mm-dd
  strategy: string
  spend: number
  jobs: number
  revenue: number
  clicks: number
  impressions: number
}

export const client = {
  name: 'Northline Home Services',
  account: 'Sample account',
  targetCpa: 150,
  avgJobValue: 640,
  start: '2026-09-25',
  days: 34,
}

export const strategies: Strategy[] = [
  { id: 'founder', name: 'Founder-led video', platform: 'Meta', color: '#6BAD3D', spend: 210, cpa: 118 },
  { id: 'nonbrand', name: 'Non-brand search', platform: 'Google', color: '#9DB98A', spend: 185, cpa: 172 },
  { id: 'seasonal', name: 'Seasonal tune-up offer', platform: 'Meta', color: '#D9893F', spend: 120, cpa: 205 },
  { id: 'ugc', name: 'UGC and customer stories', platform: 'Meta', color: '#C9CEC6', spend: 95, cpa: 104 },
  { id: 'brand', name: 'Brand search', platform: 'Google', color: '#5E7A62', spend: 42, cpa: 48 },
  { id: 'retarget', name: 'Retargeting', platform: 'Meta', color: '#D6F28B', spend: 38, cpa: 96 },
  { id: 'other', name: 'Other', platform: 'Meta', color: '#6B6560', spend: 22, cpa: 480 },
]

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function poisson(lambda: number, rand: () => number) {
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= rand()
  } while (p > L)
  return k - 1
}

function buildRows(): DayRow[] {
  const rand = mulberry32(20261028)
  const rows: DayRow[] = []
  const start = new Date(client.start + 'T00:00:00Z')
  for (let d = 0; d < client.days; d++) {
    const date = new Date(start.getTime() + d * 86400000)
    const iso = date.toISOString().slice(0, 10)
    const weekday = date.getUTCDay()
    const weekendDip = weekday === 0 || weekday === 6 ? 0.75 : 1
    // Spend ramps up as winners are scaled through the month.
    const ramp = 0.8 + (d / client.days) * 0.45
    for (const s of strategies) {
      const spend = Math.round(s.spend * ramp * weekendDip * (0.75 + rand() * 0.5))
      // Founder video and UGC get more efficient as creative iterates.
      const learning = s.id === 'founder' || s.id === 'ugc' ? 1.15 - (d / client.days) * 0.3 : 1
      const jobs = poisson(spend / (s.cpa * learning), rand)
      const revenue = Math.round(jobs * client.avgJobValue * (0.8 + rand() * 0.4))
      const cpc = s.platform === 'Google' ? 4.2 + rand() * 2 : 1.6 + rand() * 0.9
      const clicks = Math.round(spend / cpc)
      const ctr = s.platform === 'Google' ? 0.055 : 0.014
      const impressions = Math.round(clicks / (ctr * (0.8 + rand() * 0.4)))
      rows.push({ date: iso, strategy: s.id, spend, jobs, revenue, clicks, impressions })
    }
  }
  return rows
}

export const rows = buildRows()

export const pillarGrades = [
  { name: 'Strategy', grade: 'B', score: 3.0 },
  { name: 'Paid media', grade: 'B+', score: 3.3 },
  { name: 'Creative', grade: 'B-', score: 2.7 },
  { name: 'SEO + AEO', grade: 'C', score: 2.0 },
  { name: 'Creators', grade: 'C+', score: 2.3 },
  { name: 'Lifecycle', grade: 'B', score: 3.0 },
  { name: 'Data', grade: 'A-', score: 3.7 },
  { name: 'Social', grade: 'C+', score: 2.3 },
  { name: 'Brand', grade: 'B+', score: 3.3 },
]

export const topTests = [
  { title: 'Founder video: “the 3 noises your furnace makes”', body: 'The angle booking jobs at $98 each. Cut into three 15s hooks with captions and send to the tune-up page.', priority: 'High' },
  { title: 'Seasonal offer: lead with the guarantee, not the price', body: 'Clicks are cheap but checkout stalls. Move the no-surprise-pricing guarantee above the fold and retest.', priority: 'High' },
  { title: 'Non-brand search: split “emergency” from “install” intent', body: 'Emergency queries convert at half the cost. Give them their own ad group, call extension and landing page.', priority: 'Medium' },
]

export const benchmarks = [
  { name: 'Top-quartile peer', grade: 'A-', score: 3.64 },
  { name: 'Category leader', grade: 'A-', score: 3.6 },
  { name: 'Northline (you)', grade: 'B', score: 2.84, you: true },
  { name: 'Median peer', grade: 'C+', score: 2.31 },
  { name: 'Bottom-quartile peer', grade: 'C-', score: 1.7 },
]
