import { Mark } from '@/components/strata/Glyph'
import { colors } from '@/lib/strata'

/**
 * Progress drawn as land: the assessment is a climb, one waypoint per answer,
 * with the summit as the finished plan.
 */
export function Climb({ step, labels }: { step: number; labels: string[] }) {
  const n = labels.length
  const W = 300, H = 190
  const pts = labels.map((_, i) => {
    const x = 16 + (i * (W - 32)) / (n - 1)
    // Rising profile with a couple of false summits.
    const rise = i / (n - 1)
    const y = 170 - rise * 132 + Math.sin(i * 2.1) * 10 * (1 - rise)
    return [x, y] as const
  })
  const line = (to: number) => pts.slice(0, to + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y.toFixed(1)}`).join(' ')
  const reached = Math.max(0, Math.min(n - 1, step - 1))
  const area = `${line(reached)} L${pts[reached][0]},${H} L${pts[0][0]},${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Step ${step} of ${n}`}>
      <defs>
        <linearGradient id="climb-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={colors.lime} stopOpacity="0.28" />
          <stop offset="1" stopColor={colors.lime} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke={colors.mist} strokeOpacity="0.07" />
      ))}
      <path d={line(n - 1)} fill="none" stroke={colors.mist} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d={area} fill="url(#climb-fill)" />
      <path d={line(reached)} fill="none" stroke={colors.lime} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{ transition: 'd .5s' }} />
      {pts.map(([x, y], i) => (
        <g key={i}>
          {i === reached && <circle cx={x} cy={y} r="11" fill={colors.lime} fillOpacity="0.18" />}
          <circle cx={x} cy={y} r={i === reached ? 5.5 : 3.5} fill={i <= reached ? colors.lime : colors.forest} stroke={i <= reached ? colors.lime : colors.mist} strokeOpacity={i <= reached ? 1 : 0.35} strokeWidth="1.5" />
        </g>
      ))}
      {/* Summit flag */}
      <path d={`M${pts[n - 1][0]},${pts[n - 1][1] - 6} v-22 l14,6 l-14,6`} fill={step >= n ? colors.lime : 'none'} stroke={step >= n ? colors.lime : colors.mist} strokeOpacity={step >= n ? 1 : 0.4} strokeWidth="1.5" />
    </svg>
  )
}

/** Shared layout for every assessment step: the climb on the left, the question on the right. */
export default function StepFrame({
  step, labels, title, subtitle, children, onBack, next,
}: {
  step: number
  labels: string[]
  title: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  onBack?: () => void
  next: React.ReactNode
}) {
  const total = labels.length
  return (
    <main className="min-h-screen bg-bone px-5 pb-16 pt-24 text-ink md:pb-24">
      <div className="mx-auto grid max-w-6xl items-start gap-3.5 lg:grid-cols-[340px_1fr]">
        <aside className="hidden rounded-[32px] bg-forest p-8 text-mist lg:sticky lg:top-24 lg:block">
          <div className="flex items-center gap-2.5">
            <Mark fg={colors.mist} accent={colors.lime} size={22} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/75">Growth assessment</span>
          </div>
          <p className="mt-8 font-display text-[44px] font-medium leading-none tracking-[-0.04em] tabular-nums">
            {step}<span className="text-mist/40">/{total}</span>
          </p>
          <p className="mt-2 font-body text-sm text-mist/70">{labels[step - 1]}</p>
          <div className="mt-8"><Climb step={step} labels={labels} /></div>
          <p className="mt-6 border-t border-mist/15 pt-5 font-body text-[13px] leading-relaxed text-mist/70">
            Each answer lays down a layer of your plan. At the top: your health score, the services you need and the revenue on the table.
          </p>
        </aside>

        <section className="rounded-[32px] border border-ink/[0.08] bg-paper p-6 sm:p-10 lg:min-h-[560px] lg:p-14">
          {/* Phone progress: one stratum per step. */}
          <div className="mb-8 lg:hidden">
            <div className="mb-2.5 flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
              <span>Step {step} of {total}</span>
              <span>{labels[step - 1]}</span>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
              {labels.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full ${i < step ? 'bg-forest' : 'bg-ink/10'}`} />
              ))}
            </div>
          </div>

          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55 lg:block">Question {step}</span>
          <h2 className="mt-3 text-balance font-display text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.08] tracking-[-0.03em]">{title}</h2>
          {subtitle && <p className="mt-3 font-body text-[16px] text-ink/65">{subtitle}</p>}

          <div className="mt-9">{children}</div>

          <div className="mt-10 flex items-center justify-between border-t border-ink/[0.08] pt-6">
            {onBack ? (
              <button onClick={onBack} className="font-body text-[15px] font-medium text-ink/60 transition-colors hover:text-ink">← Back</button>
            ) : <span />}
            {next}
          </div>
        </section>
      </div>
    </main>
  )
}

export const nextBtn = 'inline-flex items-center justify-center rounded-full bg-forest px-8 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2 disabled:cursor-not-allowed disabled:bg-ink/[0.08] disabled:text-ink/35'
