'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import CalButton from '@/components/CalButton'
import { client, strategies, rows, pillarGrades, topTests, benchmarks, type Platform } from '@/lib/dashboard-sample'

const RANGES = [
  { id: 'all', label: 'All time', days: client.days },
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '14', label: 'Last 14 days', days: 14 },
  { id: '30', label: 'Last 30 days', days: 30 },
] as const

const PLATFORMS: ('All' | Platform)[] = ['All', 'Meta', 'Google']

const card = 'rounded-2xl border border-white/[0.08] bg-white/[0.03]'
const eyebrow = 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/45'

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
const usdK = (n: number) => (n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'K' : usd(n))
const fmtDate = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

type Verdict = 'Scale' | 'Watch' | 'Cut or fix' | 'Cut'

function verdict(cpa: number | null): Verdict {
  if (cpa === null) return 'Cut'
  if (cpa <= client.targetCpa) return 'Scale'
  if (cpa <= client.targetCpa * 1.5) return 'Watch'
  return 'Cut or fix'
}

const verdictStyle: Record<Verdict, string> = {
  Scale: 'text-[#6BAD3D]',
  Watch: 'text-[#E0B84C]',
  'Cut or fix': 'text-[#E07A5F]',
  Cut: 'text-[#E07A5F]',
}

function Sparkline({ values, color = '#F7F6F3', className = 'w-full h-8' }: { values: number[]; color?: string; className?: string }) {
  if (values.length < 2) return null
  const max = Math.max(...values, 1)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${30 - (v / max) * 26}`).join(' ')
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

function StackedBars({ days, series, metric, height = 160 }: {
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
        <div className="flex flex-col justify-between text-right font-mono text-[9px] text-white/35 w-9 flex-shrink-0">
          {[...ticks].reverse().map(t => <span key={t}>{metric(t)}</span>)}
        </div>
        <div className="relative flex-1 flex items-end gap-[2px] border-b border-white/10">
          {[0.5, 1].map(t => <span key={t} className="absolute inset-x-0 border-t border-dashed border-white/[0.06]" style={{ bottom: `${t * 100}%` }} />)}
          {days.map((d, i) => (
            <div key={d} className="relative flex-1 flex flex-col-reverse h-full justify-start group" title={`${fmtDate(d)} · ${metric(totals[i])}`}>
              {series.map(s => s.values[i] > 0 && (
                <span key={s.id} className="block w-full first:rounded-b-[1px] last:rounded-t-[2px]" style={{ height: `${(s.values[i] / max) * 100}%`, background: s.color }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between pl-11 mt-2 font-mono text-[9px] text-white/35">
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
      spendSeries: byStrategy.map(s => ({ id: s.id, color: s.color, values: daily('spend', s.id) })),
      jobSeries: byStrategy.map(s => ({ id: s.id, color: s.color, values: daily('jobs', s.id) })),
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
    <div className="min-h-screen bg-[#111814] text-[#F7F6F3]">
      {/* ── HEADER ── */}
      <header className="border-b-2 border-ember/70" style={{ background: 'linear-gradient(180deg, #17221B 0%, #111814 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Growth dashboard · paid, market, plan</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] rounded-full bg-amethyst/25 text-[#C4B5FD] px-2.5 py-1">Sample data</span>
          </div>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight">
            {client.name.split(' ')[0]} <span className="accent text-ember">Growth Engine</span>
          </h1>
          <p className="font-body text-xs text-white/45 mt-3">
            {fmtDate(view.days[0])} to {fmtDate(view.days[view.days.length - 1])}, 2026 · {client.account} · Target cost per booked job {usd(client.targetCpa)}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {[`${view.byStrategy.length} strategies live`, `${usdK(view.spend)} spent`, `${view.impressions.toLocaleString()} impressions`].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 font-body text-[11px] rounded-md border border-ember/40 px-2 py-1 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-ember" />{t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── FILTERS ── */}
      <div className="sticky top-16 z-30 bg-[#111814]/95 backdrop-blur border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
          <div className="flex gap-1 overflow-x-auto">
            {RANGES.map(r => (
              <button key={r.id} onClick={() => setRange(r.id)}
                className={`font-body text-xs rounded-md px-3 py-1.5 whitespace-nowrap transition-colors ${range === r.id ? 'bg-white text-iron' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 sm:ml-auto">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`font-body text-xs rounded-md px-3 py-1.5 border transition-colors ${platform === p ? 'border-ember text-ember' : 'border-white/10 text-white/60 hover:text-white'}`}>
                {p === 'All' ? 'All platforms' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* ── EXEC SUMMARY ── */}
        <section>
          <p className={eyebrow}>Executive summary · {platform === 'All' ? 'Meta and Google' : platform}</p>
          <h2 className="font-display font-semibold text-2xl mt-2">Every platform, <span className="accent text-copper">every strategy</span></h2>
          <ol className={`${card} mt-4 p-5 space-y-2 font-body text-sm text-white/80 list-decimal list-inside`}>
            <li>{usd(view.spend)} bought <b className="text-white">{view.jobs} booked jobs</b> at {usd(view.cpa)} each, {view.cpa <= client.targetCpa ? 'under' : `${(view.cpa / client.targetCpa).toFixed(1)}× over`} the {usd(client.targetCpa)} target.</li>
            {best && <li><b className="text-white">Scale:</b> {best.name} is the cheapest source of jobs at {usd(best.cpa!)} ({best.jobs} jobs on {usd(best.spend)}).</li>}
            {worst && <li><b className="text-white">Fix:</b> {worst.name} took {Math.round((worst.spend / view.spend) * 100)}% of spend at {worst.cpa ? usd(worst.cpa) + ' per job' : 'no jobs'}{overspend > 0 ? `, ${usd(overspend)} more than its jobs are worth at target` : ''}.</li>}
          </ol>
        </section>

        {/* ── KPI STRIP ── */}
        <section className={`${card} grid grid-cols-2 md:grid-cols-5 divide-white/[0.06] md:divide-x`}>
          {kpis.map(k => (
            <div key={k.label} className="p-4 border-b md:border-b-0 border-white/[0.06]">
              <p className="font-body text-[11px] text-white/50">{k.label}</p>
              <p className="font-display font-semibold text-2xl mt-1">{k.value}</p>
              {k.status && <p className={`font-body text-[10px] mt-0.5 ${verdictStyle[k.status]}`}>● {k.status} · target {usd(client.targetCpa)}</p>}
              <Sparkline values={k.spark} className="w-full h-7 mt-2 opacity-80" />
            </div>
          ))}
        </section>

        {/* ── BY STRATEGY ── */}
        <section className={`${card} p-5`}>
          <h3 className="font-display font-semibold text-base">By strategy</h3>
          <p className="font-body text-xs text-white/45 mt-1 max-w-2xl">Every campaign sorted into its creative strategy across both platforms. Verdicts compare cost per job with target: scale under it, watch within 1.5×, cut or fix above.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] font-body text-xs">
              <thead>
                <tr className="text-left text-white/40">
                  <th className="font-normal pb-3">Strategy</th>
                  <th className="font-normal pb-3 w-[26%]">Spend</th>
                  <th className="font-normal pb-3 text-right">Jobs</th>
                  <th className="font-normal pb-3 text-right">Cost / job</th>
                  <th className="font-normal pb-3 pl-6">Verdict</th>
                  <th className="font-normal pb-3 w-24">Trend</th>
                </tr>
              </thead>
              <tbody>
                {view.byStrategy.map(s => (
                  <tr key={s.id} className="border-t border-white/[0.05]">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <div>
                          <p className="text-white">{s.name}</p>
                          <p className="text-[10px] text-white/40">{s.platform}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 rounded-full" style={{ width: `${Math.max(4, (s.spend / view.byStrategy[0].spend) * 100)}%`, background: s.color }} />
                        <span className="text-white/70 whitespace-nowrap">{usd(s.spend)}</span>
                        <span className="text-white/35">{Math.round((s.spend / view.spend) * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-white/80">{s.jobs}</td>
                    <td className="py-3 text-right text-white/80">{s.cpa ? usd(s.cpa) : '—'}</td>
                    <td className={`py-3 pl-6 whitespace-nowrap ${verdictStyle[s.verdict]}`}>● {s.verdict}</td>
                    <td className="py-3"><Sparkline values={s.trend} color={s.color} className="w-24 h-6" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── BY DAY ── */}
        <section className={`${card} p-5`}>
          <h3 className="font-display font-semibold text-base">Spend and booked jobs by day</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {view.byStrategy.map(s => (
              <span key={s.id} className="inline-flex items-center gap-1.5 font-body text-[10px] text-white/55"><span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />{s.name}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div>
              <p className="font-body text-[11px] text-white/45 mb-2">Spend</p>
              <StackedBars days={view.days} series={view.spendSeries} metric={n => usdK(n)} />
            </div>
            <div>
              <p className="font-body text-[11px] text-white/45 mb-2">Booked jobs</p>
              <StackedBars days={view.days} series={view.jobSeries} metric={n => String(Math.round(n))} />
            </div>
          </div>
        </section>

        {/* ── BY PLATFORM ── */}
        <section className={`${card} p-5`}>
          <h3 className="font-display font-semibold text-base">By platform</h3>
          <div className="flex h-2 rounded-full overflow-hidden mt-4 bg-white/[0.06]">
            {view.byPlatform.map(p => (
              <span key={p.platform} style={{ width: `${(p.spend / view.spend) * 100}%`, background: p.platform === 'Meta' ? '#F7F6F3' : '#6B6560' }} />
            ))}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] font-body text-xs">
              <thead><tr className="text-left text-white/40"><th className="font-normal pb-2">Platform</th><th className="font-normal pb-2 text-right">Spend</th><th className="font-normal pb-2 text-right">Share</th><th className="font-normal pb-2 text-right">Jobs</th><th className="font-normal pb-2 text-right">Cost / job</th><th className="font-normal pb-2 text-right">ROAS</th></tr></thead>
              <tbody>
                {view.byPlatform.map(p => (
                  <tr key={p.platform} className="border-t border-white/[0.05] text-white/80">
                    <td className="py-2.5 flex items-center gap-2"><span className="w-2 h-2 rounded-sm" style={{ background: p.platform === 'Meta' ? '#F7F6F3' : '#6B6560' }} />{p.platform}</td>
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
          <p className="font-body text-[10px] text-white/35 mt-3">Jobs are booked appointments matched from the CRM; each platform is credited once per booking.</p>
        </section>

        {/* ── GRADE + TESTS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
          <div className={`${card} p-6 relative overflow-hidden`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)' }} />
            <p className={eyebrow}>Nine-pillar grade</p>
            <div className="flex items-end gap-4 mt-4">
              <span className="font-display font-semibold text-7xl leading-none text-ember">B</span>
              <div className="pb-1">
                <p className="font-display font-semibold text-2xl">2.84</p>
                <p className="font-body text-[11px] text-white/45">of 4.00 · top-quartile peers at 3.64</p>
              </div>
            </div>
            <p className="font-body text-sm text-white/70 mt-5">Graded against the best in class. <b className="text-white">Data and paid media are the strengths</b>; SEO, creators and social hold the grade down.</p>
          </div>
          <div className={`${card} p-6`}>
            <p className={eyebrow}>This week&apos;s top tests</p>
            <ol className="mt-4 space-y-5">
              {topTests.map((t, i) => (
                <li key={t.title} className="flex gap-4">
                  <span className="font-accent italic text-3xl leading-none text-copper w-5">{i + 1}</span>
                  <div>
                    <p className="font-body text-sm font-semibold text-white">{t.title}</p>
                    <p className="font-body text-xs text-white/55 mt-1">{t.body} <span className="text-white/35">· {t.priority} priority</span></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SCORECARD ── */}
        <section className="pt-6">
          <p className={eyebrow}>The scorecard</p>
          <h2 className="font-display font-semibold text-2xl mt-2">Run the function by <span className="accent text-copper">these numbers</span></h2>
          <p className="font-body text-xs text-white/45 mt-2 max-w-xl">Live tiles follow the filters above. Grey tiles name the data each one still needs.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {[
              { title: 'Acquisition', live: true, rows: [['Spend', usd(view.spend)], ['CPM', usd((view.spend / view.impressions) * 1000)], ['CPC', '$' + (view.spend / view.clicks).toFixed(2)], ['Cost per job', usd(view.cpa)], ['MER', view.roas.toFixed(2) + '×']] },
              { title: 'Economics', live: true, rows: [['Avg job value', usd(client.avgJobValue)], ['12-mo LTV', '$1,480'], ['LTV : CAC', (1480 / view.cpa).toFixed(1) + ' : 1'], ['Payback', view.cpa < 200 ? '1 job' : '2 jobs']] },
              { title: 'Retention', live: true, rows: [['Repeat rate (12 mo)', '38%'], ['Maintenance plans', '212'], ['Win-back revenue', '$9,840'], ['NRR', '112%']] },
              { title: 'Creative', live: true, rows: [['New ads delivering', '64 in 34 d'], ['Target', '20–40 / week'], ['Win rate', '14%']] },
              { title: 'Organic / AI search', live: false, rows: [['Organic sessions', '—'], ['AI citation share', '—'], ['AI-referral traffic', '—']], note: 'Connects once the first content cluster ships.' },
              { title: 'Creators', live: true, rows: [['Creator ads delivering', '11'], ['Code redemptions', '27'], ['Revenue per partner', '$1,906']] },
            ].map(t => (
              <div key={t.title} className={`${card} p-5 ${t.live ? '' : 'opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-sm">{t.title}</h3>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.14em] rounded-full px-2 py-0.5 ${t.live ? 'text-ember border border-ember/40' : 'text-white/40 border border-white/15'}`}>{t.live ? 'Live' : 'Not connected'}</span>
                </div>
                <dl className="space-y-2.5">
                  {t.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 font-body text-xs"><dt className="text-white/55">{k}</dt><dd className="text-white font-medium">{v}</dd></div>
                  ))}
                </dl>
                {t.note && <p className="font-body text-[10px] text-white/40 mt-4">{t.note}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── PILLAR GRADES + REPORT CARD ── */}
        <section className="pt-6">
          <p className={eyebrow}>Nine pillars</p>
          <h2 className="font-display font-semibold text-2xl mt-2">Where Northline stands, <span className="accent text-copper">pillar by pillar</span></h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mt-5">
            {pillarGrades.map(g => {
              const tone = g.score >= 3.3 ? '#6BAD3D' : g.score >= 2.7 ? '#3D7FA4' : g.score >= 2.2 ? '#B5621C' : '#A43D3D'
              return (
                <div key={g.name} className={`${card} p-3`}>
                  <p className="font-body text-[10px] text-white/55 h-7 leading-tight">{g.name}</p>
                  <p className="font-display font-semibold text-sm text-center rounded-md py-1.5 mt-2" style={{ background: tone + '33', color: tone }}>{g.grade}</p>
                </div>
              )
            })}
          </div>
          <div className={`${card} p-5 mt-4`}>
            <h3 className="font-display font-semibold text-sm mb-4">Report card vs. peers</h3>
            <div className="space-y-3">
              {benchmarks.map((b, i) => (
                <div key={b.name} className="grid grid-cols-[1fr_auto] sm:grid-cols-[180px_40px_1fr_44px] items-center gap-3 font-body text-xs">
                  <span className={b.you ? 'text-ember font-semibold' : 'text-white/80'}>{i + 1}. {b.name}</span>
                  <span className="hidden sm:block text-center rounded bg-white/[0.06] py-0.5 text-white/70">{b.grade}</span>
                  <span className="hidden sm:block h-2 rounded-full bg-white/[0.05] overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${(b.score / 4) * 100}%`, background: b.you ? '#6BAD3D' : '#3D4A3F' }} /></span>
                  <span className="text-right text-white/80">{b.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-3xl p-8 md:p-10 mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: 'linear-gradient(135deg, #3D4A3F 0%, #17221B 100%)' }}>
          <div>
            <p className={eyebrow}>Your numbers here</p>
            <h2 className="font-display font-semibold text-2xl mt-2">Every Hewn client gets this dashboard, live.</h2>
            <p className="font-body text-sm text-white/60 mt-2 max-w-lg">Meta, Google and your CRM in one view, refreshed daily, graded against best in class, with the next three tests already written.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <CalButton className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-6 py-3 rounded-full hover:brightness-110 transition whitespace-nowrap">Book a Discovery Call</CalButton>
            <Link href="/services" className="inline-flex items-center justify-center border border-white/20 text-white font-body font-medium px-6 py-3 rounded-full hover:border-white/50 transition whitespace-nowrap">See the services</Link>
          </div>
        </section>

        <p className="font-body text-[10px] text-white/30 pt-4">Sample data for a fictional client, generated for demonstration. Live client dashboards are built from the Meta Marketing API, Google Ads API and the client&apos;s CRM.</p>
      </main>
    </div>
  )
}
