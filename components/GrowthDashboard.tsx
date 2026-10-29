'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import { client, strategies, rows, pillarGrades, topTests, benchmarks, type Platform } from '@/lib/dashboard-sample'

const RANGES = [
  { id: 'all', label: 'All time', days: client.days },
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '14', label: 'Last 14 days', days: 14 },
  { id: '30', label: 'Last 30 days', days: 30 },
] as const

const PLATFORMS: ('All' | Platform)[] = ['All', 'Meta', 'Google']

const card = 'rounded-[22px] border border-ink/[0.08] bg-paper'
const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55'
const h2 = 'font-display text-[clamp(26px,3vw,36px)] font-medium leading-[1.08] tracking-[-0.03em] mt-2'

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
const usdK = (n: number) => (n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'K' : usd(n))
const fmtDate = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

// Strategy colors for a light page. The sample data's own colors are tuned for the
// dark homepage preview and wash out on paper.
const LIGHT: Record<string, string> = {
  founder: '#1E3826',
  nonbrand: '#6BAD3D',
  seasonal: '#D9893F',
  ugc: '#9AA650',
  brand: '#5E7A62',
  retarget: '#B5621C',
  other: '#9A9590',
}
const tint = (id: string, fallback: string) => LIGHT[id] ?? fallback
const PLATFORM_COLOR: Record<Platform, string> = { Meta: '#1E3826', Google: '#6BAD3D' }

type Verdict = 'Scale' | 'Watch' | 'Cut or fix' | 'Cut'

function verdict(cpa: number | null): Verdict {
  if (cpa === null) return 'Cut'
  if (cpa <= client.targetCpa) return 'Scale'
  if (cpa <= client.targetCpa * 1.5) return 'Watch'
  return 'Cut or fix'
}

const verdictChip: Record<Verdict, string> = {
  Scale: 'bg-lime text-forest',
  Watch: 'bg-[#F3E2CC] text-[#7A4A18]',
  'Cut or fix': 'bg-[#F6E3DD] text-[#7A2E1E]',
  Cut: 'bg-[#F6E3DD] text-[#7A2E1E]',
}
// The KPI strip sits on forest, so its status reads in light tones.
const verdictOnDark: Record<Verdict, string> = {
  Scale: 'text-lime',
  Watch: 'text-[#F0C08A]',
  'Cut or fix': 'text-[#F2A68C]',
  Cut: 'text-[#F2A68C]',
}

function Sparkline({ values, color = '#D6F28B', className = 'w-full h-8' }: { values: number[]; color?: string; className?: string }) {
  if (values.length < 2) return null
  const max = Math.max(...values, 1)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${30 - (v / max) * 26}`).join(' ')
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

function StackedBars({ days, series, metric, height = 170 }: {
  days: string[]
  series: { id: string; color: string; values: number[] }[]
  metric: (n: number) => string
  height?: number
}) {
  const totals = days.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0))
  const max = Math.max(...totals, 1)
  const ticks = [0, 0.5, 1].map(t => t * max)
  return (
    <div>
      <div className="relative flex gap-2" style={{ height }}>
        <div className="flex w-9 flex-shrink-0 flex-col justify-between text-right font-mono text-[10px] text-ink/45">
          {[...ticks].reverse().map(t => <span key={t}>{metric(t)}</span>)}
        </div>
        <div className="relative flex flex-1 items-end gap-[2px] border-b border-ink/15">
          {[0.5, 1].map(t => <span key={t} className="absolute inset-x-0 border-t border-dashed border-ink/[0.08]" style={{ bottom: `${t * 100}%` }} />)}
          {days.map((d, i) => (
            <div key={d} className="relative flex h-full flex-1 flex-col-reverse justify-start" title={`${fmtDate(d)} · ${metric(totals[i])}`}>
              {series.map(s => s.values[i] > 0 && (
                <span key={s.id} className="block w-full first:rounded-b-[1px] last:rounded-t-[2px]" style={{ height: `${(s.values[i] / max) * 100}%`, background: s.color }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between pl-11 font-mono text-[10px] text-ink/45">
        {days.filter((_, i) => i % Math.ceil(days.length / 6) === 0).map(d => <span key={d}>{fmtDate(d)}</span>)}
      </div>
    </div>
  )
}

export default function GrowthDashboard() {
  const [range, setRange] = useState<(typeof RANGES)[number]['id']>('all')
  const [platform, setPlatform] = useState<'All' | Platform>('All')

  const view = useMemo(() => {
    const allDays = Array.from(new Set(rows.map(r => r.date))).sort()
    const days = allDays.slice(-RANGES.find(r => r.id === range)!.days)
    const strats = strategies.filter(s => platform === 'All' || s.platform === platform)
    const ids = new Set(strats.map(s => s.id))
    const inView = rows.filter(r => ids.has(r.strategy) && days.includes(r.date))

    const sum = (key: 'spend' | 'jobs' | 'revenue' | 'clicks' | 'impressions', list = inView) => list.reduce((a, r) => a + r[key], 0)
    const daily = (key: 'spend' | 'jobs' | 'revenue', id?: string) =>
      days.map(d => inView.filter(r => r.date === d && (!id || r.strategy === id)).reduce((a, r) => a + r[key], 0))

    const spend = sum('spend')
    const jobs = sum('jobs')
    const revenue = sum('revenue')

    const byStrategy = strats.map(s => {
      const list = inView.filter(r => r.strategy === s.id)
      const sSpend = sum('spend', list)
      const sJobs = sum('jobs', list)
      const cpa = sJobs ? sSpend / sJobs : null
      return { ...s, spend: sSpend, jobs: sJobs, revenue: sum('revenue', list), cpa, verdict: verdict(cpa), trend: daily('spend', s.id) }
    }).sort((a, b) => b.spend - a.spend)

    const byPlatform = (['Meta', 'Google'] as Platform[])
      .filter(p => platform === 'All' || p === platform)
      .map(p => {
        const list = inView.filter(r => strategies.find(s => s.id === r.strategy)!.platform === p)
        const pSpend = sum('spend', list)
        const pJobs = sum('jobs', list)
        return { platform: p, spend: pSpend, jobs: pJobs, cpa: pJobs ? pSpend / pJobs : 0, roas: pSpend ? sum('revenue', list) / pSpend : 0 }
      })

    return {
      days, spend, jobs, revenue, byStrategy, byPlatform,
      cpa: jobs ? spend / jobs : 0,
      roas: spend ? revenue / spend : 0,
      clicks: sum('clicks'), impressions: sum('impressions'),
      dailySpend: daily('spend'), dailyJobs: daily('jobs'), dailyRevenue: daily('revenue'),
      spendSeries: byStrategy.map(s => ({ id: s.id, color: tint(s.id, s.color), values: daily('spend', s.id) })),
      jobSeries: byStrategy.map(s => ({ id: s.id, color: tint(s.id, s.color), values: daily('jobs', s.id) })),
    }
  }, [range, platform])

  const best = view.byStrategy.filter(s => s.cpa !== null).sort((a, b) => a.cpa! - b.cpa!)[0]
  const worst = [...view.byStrategy].filter(s => s.verdict !== 'Scale').sort((a, b) => b.spend - a.spend)[0]
  const overspend = worst && worst.cpa ? worst.spend - worst.jobs * client.targetCpa : 0

  const kpis = [
    { label: 'Spend', value: usdK(view.spend), spark: view.dailySpend },
    { label: 'Booked jobs', value: view.jobs.toLocaleString(), spark: view.dailyJobs },
    { label: 'Cost per job', value: usd(view.cpa), spark: view.dailySpend.map((s, i) => (view.dailyJobs[i] ? s / view.dailyJobs[i] : 0)), status: verdict(view.cpa) },
    { label: 'Revenue', value: usdK(view.revenue), spark: view.dailyRevenue },
    { label: 'ROAS', value: view.roas.toFixed(2) + '×', spark: view.dailyRevenue.map((r, i) => (view.dailySpend[i] ? r / view.dailySpend[i] : 0)) },
  ]

  return (
    <div className="bg-bone pb-24 pt-20 text-ink">
      {/* ── HEADER ── */}
      <div className="mx-auto max-w-[1400px] px-5">
        <header className="relative isolate overflow-hidden rounded-[32px] text-mist">
          <Terrain scene="highland" seed={9} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(14,22,18,.82) 0%, rgba(14,22,18,.45) 60%, rgba(14,22,18,.2) 100%)' }} />
          <div className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-8 lg:pt-24">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">Growth dashboard · paid, market, plan</span>
              <span className="rounded-full bg-lime px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-forest">Sample data</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(40px,5vw,64px)] font-medium leading-none tracking-[-0.045em]">
              {client.name.split(' ')[0]} <em className="accent text-lime">Growth Engine</em>
            </h1>
            <p className="mt-4 font-body text-sm text-mist/75">
              {fmtDate(view.days[0])} to {fmtDate(view.days[view.days.length - 1])}, 2026 · {client.account} · Target cost per booked job {usd(client.targetCpa)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[`${view.byStrategy.length} strategies live`, `${usdK(view.spend)} spent`, `${view.impressions.toLocaleString()} impressions`].map(t => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-mist/20 bg-mist/10 px-3 py-1.5 font-body text-[13px] text-mist backdrop-blur">
                  <span className="h-3 w-[3px] bg-lime" />{t}
                </span>
              ))}
            </div>
          </div>
        </header>
      </div>

      {/* ── FILTERS ── */}
      <div className="sticky top-16 z-30 mt-3 border-b border-ink/[0.06] bg-bone/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 py-3 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {RANGES.map(r => (
              <button key={r.id} onClick={() => setRange(r.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-body text-[13px] font-medium transition-colors ${range === r.id ? 'bg-forest text-mist' : 'text-ink/65 hover:bg-ink/[0.05] hover:text-ink'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 sm:ml-auto">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`rounded-full border px-3.5 py-1.5 font-body text-[13px] font-medium transition-colors ${platform === p ? 'border-forest bg-forest text-mist' : 'border-ink/15 text-ink/65 hover:border-ink/35 hover:text-ink'}`}>
                {p === 'All' ? 'All platforms' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-4 px-5 py-10 sm:px-6">
        {/* ── EXEC SUMMARY ── */}
        <section>
          <p className={eyebrow}>Executive summary · {platform === 'All' ? 'Meta and Google' : platform}</p>
          <h2 className={h2}>Every platform, <em className="accent text-forest">every strategy</em></h2>
          <ol className={`${card} mt-5 list-inside list-decimal space-y-2.5 p-6 font-body text-[15px] text-ink/80`}>
            <li>{usd(view.spend)} bought <b className="font-medium text-ink">{view.jobs} booked jobs</b> at {usd(view.cpa)} each, {view.cpa <= client.targetCpa ? 'under' : `${(view.cpa / client.targetCpa).toFixed(1)}× over`} the {usd(client.targetCpa)} target.</li>
            {best && <li><b className="font-medium text-ink">Scale:</b> {best.name} is the cheapest source of jobs at {usd(best.cpa!)} ({best.jobs} jobs on {usd(best.spend)}).</li>}
            {worst && <li><b className="font-medium text-ink">Fix:</b> {worst.name} took {Math.round((worst.spend / view.spend) * 100)}% of spend at {worst.cpa ? usd(worst.cpa) + ' per job' : 'no jobs'}{overspend > 0 ? `, ${usd(overspend)} more than its jobs are worth at target` : ''}.</li>}
          </ol>
        </section>

        {/* ── KPI STRIP (the dark band) ── */}
        <section className="grid grid-cols-2 overflow-hidden rounded-[22px] bg-forest text-mist md:grid-cols-5 md:divide-x md:divide-mist/10">
          {kpis.map(k => (
            <div key={k.label} className="border-b border-mist/10 p-5 md:border-b-0">
              <p className="font-body text-[13px] text-mist/65">{k.label}</p>
              <p className="mt-1 font-display text-[28px] font-medium tracking-[-0.03em] tabular-nums">{k.value}</p>
              {k.status && <p className={`mt-0.5 font-body text-[12px] ${verdictOnDark[k.status]}`}>● {k.status} · target {usd(client.targetCpa)}</p>}
              <Sparkline values={k.spark} className="mt-2 h-7 w-full" />
            </div>
          ))}
        </section>

        {/* ── BY STRATEGY ── */}
        <section className={`${card} p-6`}>
          <h3 className="font-display text-lg font-medium">By strategy</h3>
          <p className="mt-1 max-w-2xl font-body text-[13px] text-ink/60">Every campaign sorted into its creative strategy across both platforms. Verdicts compare cost per job with target: scale under it, watch within 1.5×, cut or fix above.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] font-body text-[13px] tabular-nums">
              <thead>
                <tr className="text-left text-ink/50">
                  <th className="pb-3 font-normal">Strategy</th>
                  <th className="w-[26%] pb-3 font-normal">Spend</th>
                  <th className="pb-3 text-right font-normal">Jobs</th>
                  <th className="pb-3 text-right font-normal">Cost / job</th>
                  <th className="pb-3 pl-6 font-normal">Verdict</th>
                  <th className="w-24 pb-3 font-normal">Trend</th>
                </tr>
              </thead>
              <tbody>
                {view.byStrategy.map(s => {
                  const c = tint(s.id, s.color)
                  return (
                    <tr key={s.id} className="border-t border-ink/[0.07]">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: c }} />
                          <div>
                            <p className="text-ink">{s.name}</p>
                            <p className="text-[11px] text-ink/50">{s.platform}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 rounded-full" style={{ width: `${Math.max(4, (s.spend / view.byStrategy[0].spend) * 100)}%`, background: c }} />
                          <span className="whitespace-nowrap text-ink/80">{usd(s.spend)}</span>
                          <span className="text-ink/45">{Math.round((s.spend / view.spend) * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-ink/80">{s.jobs}</td>
                      <td className="py-3 text-right text-ink/80">{s.cpa ? usd(s.cpa) : '—'}</td>
                      <td className="py-3 pl-6"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium ${verdictChip[s.verdict]}`}>{s.verdict}</span></td>
                      <td className="py-3"><Sparkline values={s.trend} color={c} className="h-6 w-24" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── BY DAY ── */}
        <section className={`${card} p-6`}>
          <h3 className="font-display text-lg font-medium">Spend and booked jobs by day</h3>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {view.byStrategy.map(s => (
              <span key={s.id} className="inline-flex items-center gap-1.5 font-body text-[12px] text-ink/65"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: tint(s.id, s.color) }} />{s.name}</span>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-body text-[13px] text-ink/60">Spend</p>
              <StackedBars days={view.days} series={view.spendSeries} metric={n => usdK(n)} />
            </div>
            <div>
              <p className="mb-2 font-body text-[13px] text-ink/60">Booked jobs</p>
              <StackedBars days={view.days} series={view.jobSeries} metric={n => String(Math.round(n))} />
            </div>
          </div>
        </section>

        {/* ── BY PLATFORM ── */}
        <section className={`${card} p-6`}>
          <h3 className="font-display text-lg font-medium">By platform</h3>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-ink/[0.06]">
            {view.byPlatform.map(p => (
              <span key={p.platform} style={{ width: `${(p.spend / view.spend) * 100}%`, background: PLATFORM_COLOR[p.platform] }} />
            ))}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] font-body text-[13px] tabular-nums">
              <thead><tr className="text-left text-ink/50"><th className="pb-2 font-normal">Platform</th><th className="pb-2 text-right font-normal">Spend</th><th className="pb-2 text-right font-normal">Share</th><th className="pb-2 text-right font-normal">Jobs</th><th className="pb-2 text-right font-normal">Cost / job</th><th className="pb-2 text-right font-normal">ROAS</th></tr></thead>
              <tbody>
                {view.byPlatform.map(p => (
                  <tr key={p.platform} className="border-t border-ink/[0.07] text-ink/80">
                    <td className="flex items-center gap-2 py-2.5 text-ink"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: PLATFORM_COLOR[p.platform] }} />{p.platform}</td>
                    <td className="py-2.5 text-right">{usd(p.spend)}</td>
                    <td className="py-2.5 text-right">{Math.round((p.spend / view.spend) * 100)}%</td>
                    <td className="py-2.5 text-right">{p.jobs}</td>
                    <td className="py-2.5 text-right">{usd(p.cpa)}</td>
                    <td className="py-2.5 text-right">{p.roas.toFixed(2)}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-body text-[12px] text-ink/50">Jobs are booked appointments matched from the CRM; each platform is credited once per booking.</p>
        </section>

        {/* ── GRADE + TESTS ── */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_3fr]">
          <div className="relative isolate overflow-hidden rounded-[22px] p-7 text-mist">
            <Terrain scene="canyon" seed={4} className="-z-20" />
            <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(160deg, rgba(20,16,10,.72), rgba(20,16,10,.45))' }} />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">Nine-pillar grade</p>
            <div className="mt-4 flex items-end gap-4">
              <span className="font-display text-[88px] font-medium leading-none tracking-[-0.04em] text-lime">B</span>
              <div className="pb-2">
                <p className="font-display text-[28px] font-medium tabular-nums">2.84</p>
                <p className="font-body text-[13px] text-mist/70">of 4.00 · top-quartile peers at 3.64</p>
              </div>
            </div>
            <p className="mt-5 font-body text-[15px] text-mist/85">Graded against the best in class. <b className="font-medium text-mist">Data and paid media are the strengths</b>; SEO, creators and social hold the grade down.</p>
          </div>
          <div className={`${card} p-7`}>
            <p className={eyebrow}>This week&apos;s top tests</p>
            <ol className="mt-5 space-y-5">
              {topTests.map((t, i) => (
                <li key={t.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest font-display text-sm font-medium text-mist">{i + 1}</span>
                  <div>
                    <p className="font-body text-[15px] font-medium text-ink">{t.title}</p>
                    <p className="mt-1 font-body text-[13px] text-ink/65">{t.body} <span className="text-ink/45">· {t.priority} priority</span></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SCORECARD ── */}
        <section className="pt-8">
          <p className={eyebrow}>The scorecard</p>
          <h2 className={h2}>Run the function by <em className="accent text-forest">these numbers</em></h2>
          <p className="mt-2 max-w-xl font-body text-[14px] text-ink/60">Live tiles follow the filters above. Grey tiles name the data each one still needs.</p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Acquisition', live: true, rows: [['Spend', usd(view.spend)], ['CPM', usd((view.spend / view.impressions) * 1000)], ['CPC', '$' + (view.spend / view.clicks).toFixed(2)], ['Cost per job', usd(view.cpa)], ['MER', view.roas.toFixed(2) + '×']] },
              { title: 'Economics', live: true, rows: [['Avg job value', usd(client.avgJobValue)], ['12-mo LTV', '$1,480'], ['LTV : CAC', (1480 / view.cpa).toFixed(1) + ' : 1'], ['Payback', view.cpa < 200 ? '1 job' : '2 jobs']] },
              { title: 'Retention', live: true, rows: [['Repeat rate (12 mo)', '38%'], ['Maintenance plans', '212'], ['Win-back revenue', '$9,840'], ['NRR', '112%']] },
              { title: 'Creative', live: true, rows: [['New ads delivering', '64 in 34 d'], ['Target', '20–40 / week'], ['Win rate', '14%']] },
              { title: 'Organic / AI search', live: false, rows: [['Organic sessions', '—'], ['AI citation share', '—'], ['AI-referral traffic', '—']], note: 'Connects once the first content cluster ships.' },
              { title: 'Creators', live: true, rows: [['Creator ads delivering', '11'], ['Code redemptions', '27'], ['Revenue per partner', '$1,906']] },
            ].map(t => (
              <div key={t.title} className={`${card} p-6 ${t.live ? '' : 'bg-transparent'}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-[16px] font-medium">{t.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${t.live ? 'bg-lime text-forest' : 'border border-ink/15 text-ink/50'}`}>{t.live ? 'Live' : 'Not connected'}</span>
                </div>
                <dl className="space-y-2.5 tabular-nums">
                  {t.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 font-body text-[13px]"><dt className="text-ink/60">{k}</dt><dd className={`font-medium ${t.live ? 'text-ink' : 'text-ink/40'}`}>{v}</dd></div>
                  ))}
                </dl>
                {t.note && <p className="mt-4 font-body text-[12px] text-ink/50">{t.note}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── PILLAR GRADES + REPORT CARD ── */}
        <section className="pt-8">
          <p className={eyebrow}>Nine pillars</p>
          <h2 className={h2}>Where Northline stands, <em className="accent text-forest">pillar by pillar</em></h2>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
            {pillarGrades.map(g => {
              const tone = g.score >= 3.3 ? 'bg-lime text-forest' : g.score >= 2.7 ? 'bg-sand text-forest' : g.score >= 2.2 ? 'bg-[#F3E2CC] text-[#7A4A18]' : 'bg-[#F6E3DD] text-[#7A2E1E]'
              return (
                <div key={g.name} className={`${card} p-3`}>
                  <p className="h-8 font-body text-[12px] leading-tight text-ink/65">{g.name}</p>
                  <p className={`mt-2 rounded-[10px] py-1.5 text-center font-display text-[15px] font-medium ${tone}`}>{g.grade}</p>
                </div>
              )
            })}
          </div>
          <div className={`${card} mt-3 p-6`}>
            <h3 className="mb-4 font-display text-[16px] font-medium">Report card vs. peers</h3>
            <div className="space-y-3">
              {benchmarks.map((b, i) => (
                <div key={b.name} className="grid grid-cols-[1fr_auto] items-center gap-3 font-body text-[13px] tabular-nums sm:grid-cols-[200px_44px_1fr_44px]">
                  <span className={b.you ? 'font-medium text-forest' : 'text-ink/80'}>{i + 1}. {b.name}</span>
                  <span className={`hidden rounded-full py-0.5 text-center sm:block ${b.you ? 'bg-lime text-forest' : 'bg-ink/[0.06] text-ink/70'}`}>{b.grade}</span>
                  <span className="hidden h-2.5 overflow-hidden rounded-full bg-ink/[0.06] sm:block"><span className="block h-full rounded-full" style={{ width: `${(b.score / 4) * 100}%`, background: b.you ? '#1E3826' : 'rgba(13,13,13,.22)' }} /></span>
                  <span className={`text-right ${b.you ? 'font-medium text-forest' : 'text-ink/80'}`}>{b.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative isolate mt-10 flex flex-col justify-between gap-6 overflow-hidden rounded-[32px] p-8 text-mist md:flex-row md:items-center md:p-12">
          <Terrain scene="ember" seed={19} className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.72), rgba(20,16,10,.3))' }} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">Your numbers here</p>
            <h2 className="mt-2 font-display text-[clamp(26px,3vw,36px)] font-medium leading-[1.08] tracking-[-0.03em]">Every Hewn client gets this dashboard, live.</h2>
            <p className="mt-2 max-w-lg font-body text-[15px] text-mist/80">Meta, Google and your CRM in one view, refreshed daily, graded against best in class, with the next three tests already written.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CalButton className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-6 py-3.5 font-body font-medium text-ink transition hover:bg-mist">Book a discovery call</CalButton>
            <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body font-medium text-mist backdrop-blur transition hover:bg-mist/20">See the services</Link>
          </div>
        </section>

        <p className="pt-4 font-body text-[12px] text-ink/50">Sample data for a fictional client, generated for demonstration. Live client dashboards are built from the Meta Marketing API, Google Ads API and the client&apos;s CRM.</p>
      </main>
    </div>
  )
}
