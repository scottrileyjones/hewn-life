import { noise1, fbm, mix, rng, ridge, pathOf, colors } from '@/lib/strata'
import { strategies, rows, client } from '@/lib/dashboard-sample'

const label = { fontFamily: 'Inter Tight, Arial, sans-serif', fontSize: 11 }

/* ── Hero glass card sparkline ─────────────────────────────── */
export function HeroRidge() {
  const pts = ridge(77, 320, 8, (x, n) => 72 - (x / 320) * 48 - fbm(n, x / 40, 3) * 20)
  const line = pathOf(pts)
  const [lx, ly] = pts[pts.length - 1]
  return (
    <svg viewBox="0 0 320 84" className="my-2 block h-[84px] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="heroRidgeFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={colors.lime} stopOpacity=".5" />
          <stop offset="1" stopColor={colors.lime} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L320,84 L0,84 Z`} fill="url(#heroRidgeFill)" />
      {[1, 2, 3].map(k => <path key={k} d={pathOf(pts, k * 7)} fill="none" stroke={`rgba(244,242,236,${0.2 - k * 0.05})`} />)}
      <path d={line} fill="none" stroke={colors.lime} strokeWidth="2" />
      <circle cx={lx - 3} cy={ly} r="4" fill={colors.mist} />
    </svg>
  )
}

/* ── Payback: cumulative gross profit crossing CAC ─────────── */
export function PaybackChart({ cac = 300, gpPerMonth = 65 }: { cac?: number; gpPerMonth?: number }) {
  const X = (m: number) => 24 + (m / 12) * 260
  const Y = (v: number) => 176 - (v / 800) * 150
  const payback = cac / gpPerMonth
  let d = `M${X(0)},${Y(0)}`
  for (let m = 0; m <= 12; m += 0.25) d += ` L${X(m)},${Y(m * gpPerMonth)}`
  return (
    <svg viewBox="0 0 300 200" className="block h-auto w-full" role="img" aria-label={`Cumulative gross profit per customer passes the $${cac} acquisition cost at month ${payback.toFixed(1)}`}>
      <line x1="24" x2="284" y1={Y(cac)} y2={Y(cac)} stroke="rgba(244,242,236,.6)" strokeDasharray="4 4" />
      <text x="28" y={Y(cac) - 6} fill={colors.mist} style={label}>CAC ${cac}</text>
      <path d={`${d} L${X(12)},${Y(0)} Z`} fill="rgba(214,242,139,.22)" />
      <path d={d} fill="none" stroke={colors.lime} strokeWidth="2.4" />
      <line x1={X(payback)} x2={X(payback)} y1={Y(cac)} y2="176" stroke={colors.lime} />
      <rect x={X(payback) - 4} y={Y(cac) - 4} width="8" height="8" fill={colors.mist} />
      <line x1="24" x2="284" y1="176" y2="176" stroke="rgba(244,242,236,.45)" />
      {[0, payback, 12].map((m, i) => (
        <text key={i} x={X(m)} y="194" textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fill="rgba(244,242,236,.85)" style={label}>
          {i === 1 ? m.toFixed(1) : m} mo
        </text>
      ))}
    </svg>
  )
}

/* ── How-it-works step visuals ─────────────────────────────── */
const frame = (children: React.ReactNode) => (
  <svg viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
    <rect width="300" height="330" fill={colors.forest} />
    {children}
  </svg>
)

export const pillarGradeSample = [3.0, 3.3, 2.7, 2.0, 2.3, 3.0, 3.7, 2.3, 3.3]

export function StrataBars() {
  return frame(
    pillarGradeSample.map((g, i) => {
      const y = 40 + i * 28
      const n = noise1(70 + i)
      const xe = 28 + (g / 4) * 244
      let d = `M28,${y}`
      for (let x = 28; x <= xe; x += 6) d += ` L${x},${(y + fbm(n, x / 25, 2) * 4).toFixed(1)}`
      d += ` L${xe},${y + 22} L28,${y + 22} Z`
      return <path key={i} d={d} fill={mix(colors.forest2, colors.lime, g / 4)} />
    }),
  )
}

export function ElevationClimb() {
  const pts = ridge(14, 300, 5, (x, n) => 290 - (x / 300) * 200 - fbm(n, x / 40, 3) * 40)
  return frame(
    <>
      <path d={`${pathOf(pts)} L300,330 L0,330 Z`} fill={colors.forest2} />
      {[1, 2, 3, 4, 5].map(k => <path key={k} d={pathOf(pts, k * 10)} fill="none" stroke={`rgba(214,242,139,${0.3 - k * 0.045})`} />)}
      {[0.15, 0.5, 0.92].map(t => {
        const [x, y] = pts[Math.round(t * (pts.length - 1))]
        return (
          <g key={t}>
            <line x1={x} x2={x} y1={y} y2={y - 34} stroke={colors.lime} />
            <rect x={x - 4} y={y - 40} width="8" height="8" fill={colors.lime} />
          </g>
        )
      })}
    </>,
  )
}

export function CreativeGrid() {
  const r = rng(3)
  const tiles = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 26 + col * 64
      const y = 36 + row * 54
      const win = r() > 0.78
      const w1 = 18 + r() * 22
      const w2 = 10 + r() * 20
      tiles.push(
        <g key={`${row}-${col}`}>
          <rect x={x} y={y} width="54" height="44" rx="6" fill={win ? colors.lime : colors.forest2} />
          {win ? (
            <>
              <rect x={x + 16} y={y + 10} width="6" height="24" fill={colors.forest} />
              <rect x={x + 32} y={y + 10} width="6" height="24" fill={colors.forest} />
              <polygon points={`${x + 22},${y + 26} ${x + 32},${y + 21} ${x + 32},${y + 25} ${x + 22},${y + 30}`} fill={colors.forest} />
            </>
          ) : (
            <>
              <rect x={x + 8} y={y + 10} width={w1} height="4" fill="rgba(244,242,236,.35)" />
              <rect x={x + 8} y={y + 20} width={w2} height="4" fill="rgba(244,242,236,.2)" />
            </>
          )}
        </g>,
      )
    }
  }
  return frame(tiles)
}

/* ── Dashboard preview: the sample client, all time ────────── */
export function dashboardSummary() {
  const days = Array.from(new Set(rows.map(r => r.date))).sort()
  const top = strategies.slice(0, 5)
  const byDay = days.map(d => top.map(s => rows.find(r => r.date === d && r.strategy === s.id)!))
  const spend = rows.reduce((a, r) => a + r.spend, 0)
  const jobs = rows.reduce((a, r) => a + r.jobs, 0)
  const revenue = rows.reduce((a, r) => a + r.revenue, 0)
  const per = top.map(s => {
    const list = rows.filter(r => r.strategy === s.id)
    const sp = list.reduce((a, r) => a + r.spend, 0)
    const jb = list.reduce((a, r) => a + r.jobs, 0)
    return { ...s, sp, cpa: jb ? sp / jb : null }
  })
  return { days, top, byDay, spend, jobs, revenue, per }
}

export function verdictOf(cpa: number | null): [string, string] {
  if (cpa === null) return ['Cut', '#E8866B']
  if (cpa <= client.targetCpa) return ['Scale', '#8FCB5F']
  if (cpa <= client.targetCpa * 1.5) return ['Watch', '#E0B84C']
  return ['Cut or fix', '#E8866B']
}

export function RidgeChart() {
  const { days, top, byDay } = dashboardSummary()
  const W = 1000
  const topY = 18
  const bot = 214
  const X = (i: number) => 40 + (i * (W - 60)) / (days.length - 1)
  const totals = byDay.map(d => d.reduce((a, r) => a + r.spend, 0))
  const jobs = byDay.map(d => d.reduce((a, r) => a + r.jobs, 0))
  const maxS = Math.max(...totals) * 1.08
  const maxJ = Math.max(...jobs) * 1.15
  let acc = days.map(() => 0)
  const layers = top.map((s, si) => {
    acc = acc.map((v, i) => v + byDay[i][si].spend)
    return { s, upper: acc.slice() }
  })
  const yS = (v: number) => bot - (v / maxS) * (bot - topY)
  const fmt = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

  return (
    <svg viewBox="0 0 1000 240" className="mt-2.5 block h-auto w-full" role="img" aria-label="Daily spend by strategy as stacked ridgelines, booked jobs as a dashed line">
      {[0, 1, 2, 3, 4].map(g => {
        const y = bot - ((bot - topY) * g) / 4
        return (
          <g key={g}>
            <line x1="40" x2={W - 20} y1={y} y2={y} stroke={`rgba(244,242,236,${g ? 0.06 : 0.18})`} />
            {g > 0 && <text x="34" y={y + 4} textAnchor="end" fill="#8C938A" style={{ ...label, fontSize: 13 }}>${Math.round((maxS * g) / 4)}</text>}
          </g>
        )
      })}
      {layers.slice().reverse().map(({ s, upper }, ri) => {
        let d = `M${X(0)},${yS(upper[0])}`
        for (let i = 1; i < days.length; i++) {
          const cx = (X(i - 1) + X(i)) / 2
          d += ` C${cx},${yS(upper[i - 1])} ${cx},${yS(upper[i])} ${X(i)},${yS(upper[i])}`
        }
        d += ` L${X(days.length - 1)},${bot} L${X(0)},${bot} Z`
        return <path key={s.id} d={d} fill={s.color} fillOpacity={0.92 - ri * 0.06} stroke="#111814" strokeOpacity=".5" />
      })}
      <path d={jobs.map((j, i) => `${i ? 'L' : 'M'}${X(i)},${bot - (j / maxJ) * (bot - topY)}`).join(' ')} fill="none" stroke={colors.mist} strokeWidth="1.8" strokeDasharray="5 5" />
      {[0, Math.floor(days.length / 2), days.length - 1].map((i, k) => (
        <text key={i} x={X(i)} y="234" textAnchor={(['start', 'middle', 'end'] as const)[k]} fill="#8C938A" style={{ ...label, fontSize: 13 }}>{fmt(days[i])}</text>
      ))}
    </svg>
  )
}
