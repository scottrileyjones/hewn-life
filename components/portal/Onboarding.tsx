'use client'
import { useState } from 'react'
import type { Step, StepStatus, track as trackFn } from '@/lib/portal/onboarding'
import type { PortalAsset } from '@/lib/portal/data'

type Tracked = ReturnType<typeof trackFn>

const day = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '')

/** The progress bar across the top: five phases, the current one highlighted. */
export function Tracker({ t, note }: { t: Tracked; note: string }) {
  const currentIdx = t.phases.findIndex(p => p.current)
  const reached = currentIdx === -1 ? t.phases.length - 1 : currentIdx
  const fill = t.phases.length > 1 ? (reached / (t.phases.length - 1)) * 100 : 100
  const complete = !t.current
  return (
    <section className="rounded-[24px] bg-forest p-6 text-mist sm:p-7" aria-label="Project progress">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Your project</h2>
        <p className="font-body text-[13px] text-mist/70">Step {Math.min(t.done + (complete ? 0 : 1), t.total)} of {t.total}</p>
      </div>

      <ol className="relative mt-6 grid" style={{ gridTemplateColumns: `repeat(${t.phases.length}, minmax(0, 1fr))` }}>
        <div aria-hidden className="absolute left-[10%] right-[10%] top-[15px] h-1 rounded-full bg-mist/15" />
        <div aria-hidden className="absolute left-[10%] top-[15px] h-1 rounded-full bg-lime transition-all" style={{ width: `${fill * 0.8}%` }} />
        {t.phases.map(p => (
          <li key={p.id} className="relative flex flex-col items-center text-center" aria-current={p.current ? 'step' : undefined}>
            <span className={`relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 font-body text-[14px] font-semibold
              ${p.done ? 'border-lime bg-lime text-forest' : p.current ? 'border-lime bg-forest text-lime' : 'border-mist/25 bg-forest text-mist/40'}`}>
              {p.done ? '✓' : p.current ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-lime" /> : ''}
            </span>
            <span className={`mt-2 px-1 font-body text-[11px] leading-tight sm:text-[13px] ${p.current ? 'font-semibold text-mist' : p.done ? 'text-mist/85' : 'text-mist/45'}`}>{p.label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 border-t border-mist/15 pt-5">
        <p className="font-display text-[20px] leading-snug tracking-[-0.01em] sm:text-[24px]">
          {complete ? 'All done. Your project is complete.' : t.yourTurn.length ? `Your turn: ${t.yourTurn[0].step.title.toLowerCase()}.` : `We’re on it: ${t.current!.title.toLowerCase()}.`}
        </p>
        {note && <p className="mt-2 whitespace-pre-line font-body text-[15px] leading-relaxed text-mist/80">{note}</p>}
      </div>
    </section>
  )
}

function StepForm({ step, prior, onSaved }: { step: Step; prior?: Record<string, string>; onSaved: (out: { progress: unknown; assets: PortalAsset[] }) => void }) {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const input = 'w-full rounded-[12px] border border-ink/[0.12] bg-white px-3.5 py-2.5 font-body text-[15px] focus:border-forest focus:outline-none'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true); setError('')
    const fd = new FormData(e.currentTarget)
    fd.set('step', step.id)
    fd.delete('files')
    files.forEach(f => fd.append('files', f))
    const res = await fetch('/api/portal/step', { method: 'POST', body: fd })
    const out = await res.json().catch(() => ({}))
    setSending(false)
    if (!res.ok) { setError(out.error || 'Couldn’t send. Try again.'); return }
    onSaved(out)
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      {step.fields?.map(f => (
        <label key={f.id} className="block">
          <span className="mb-1.5 block font-body text-[14px] font-medium">{f.label}{f.required && <span className="text-ember"> *</span>}</span>
          {f.type === 'textarea' ? (
            <textarea name={f.id} rows={3} required={f.required} defaultValue={prior?.[f.id]} placeholder={f.placeholder} className={input} />
          ) : f.type === 'select' ? (
            <select name={f.id} required={f.required} defaultValue={prior?.[f.id] ?? ''} className={input}>
              <option value="" disabled>Choose…</option>
              {f.options?.map(o => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input name={f.id} type={f.type} required={f.required} defaultValue={prior?.[f.id]} placeholder={f.placeholder} className={input} />
          )}
        </label>
      ))}
      {step.uploads && (
        <div>
          <span className="mb-1.5 block font-body text-[14px] font-medium">{step.uploads.label}</span>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-ink/[0.15] bg-bone px-4 py-6 text-center hover:border-forest">
            <span className="font-body text-[14px] font-medium text-forest">Choose files</span>
            <span className="mt-1 font-body text-[12px] text-ink/55">{step.uploads.help}</span>
            <input type="file" multiple accept="image/*,application/pdf" className="sr-only" onChange={e => setFiles(Array.from(e.target.files ?? []))} />
          </label>
          {files.length > 0 && <ul className="mt-2 space-y-1 font-body text-[13px] text-ink/70">{files.map(f => <li key={f.name}>📎 {f.name} ({Math.round(f.size / 1024)} KB)</li>)}</ul>}
        </div>
      )}
      {error && <p role="alert" className="rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
      <button disabled={sending} className="rounded-full bg-forest px-6 py-3 font-body text-[15px] font-medium text-mist disabled:opacity-60">{sending ? 'Sending…' : 'Send to Hewn Life'}</button>
    </form>
  )
}

/** Client steps they can do now, each opening into its form. */
export function YourTurn({ t, onSaved }: { t: Tracked; onSaved: (out: { progress: unknown; assets: PortalAsset[] }) => void }) {
  const [open, setOpen] = useState<string | null>(t.yourTurn.find(r => !r.step.action)?.step.id ?? null)
  if (!t.yourTurn.length) return null
  return (
    <section className="rounded-[24px] border-2 border-lime bg-white p-5 sm:p-6" aria-label="Your turn">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em]">Your turn</h2>
        <span className="rounded-full bg-lime px-2.5 py-0.5 font-body text-[12px] font-medium text-forest">{t.yourTurn.length} to do</span>
      </div>
      <p className="mt-1 font-body text-[14px] text-ink/60">These load straight into your build. The sooner they’re in, the sooner you’re live.</p>
      <ul className="mt-4 divide-y divide-ink/[0.06]">
        {t.yourTurn.map(({ step, state }) => (
          <li key={step.id} className="py-3">
            {step.action ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-body text-[16px] font-medium">{step.title}</p><p className="font-body text-[13px] text-ink/60">{step.detail}</p></div>
                <a href={step.action.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-forest px-4 py-2 font-body text-[14px] text-mist">{step.action.label}</a>
              </div>
            ) : (
              <>
                <button onClick={() => setOpen(open === step.id ? null : step.id)} aria-expanded={open === step.id} className="flex w-full items-start justify-between gap-3 text-left">
                  <span><span className="block font-body text-[16px] font-medium">{step.title}</span><span className="block font-body text-[13px] text-ink/60">{step.detail}</span></span>
                  <span aria-hidden className="mt-1 font-body text-[18px] text-ink/40">{open === step.id ? '−' : '+'}</span>
                </button>
                {open === step.id && <StepForm step={step} prior={state.data} onSaved={out => { setOpen(null); onSaved(out) }} />}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

const ICON: Record<StepStatus, string> = { done: '✓', submitted: '…', current: '●', waiting: '' }
const LABEL: Record<StepStatus, string> = { done: 'Done', submitted: 'Received, we’re checking it', current: 'In progress', waiting: 'Coming up' }

/** Every step, top to bottom, with when it was done. */
export function Timeline({ t }: { t: Tracked }) {
  const theirs = new Set(t.yourTurn.map(r => r.step.id))
  return (
    <section className="rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-6" aria-label="All steps">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Every step</h2>
      <ol className="mt-4">
        {t.rows.map(({ step, state, status }, i) => (
          <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < t.rows.length - 1 && <span aria-hidden className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${status === 'done' ? 'bg-forest' : 'bg-ink/10'}`} />}
            <span className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold
              ${status === 'done' ? 'bg-forest text-mist' : status === 'submitted' ? 'bg-[#F6E7D4] text-[#7A4A12]' : status === 'current' || theirs.has(step.id) ? 'border-2 border-forest bg-lime text-forest' : 'border-2 border-ink/15 bg-white'}`}>{theirs.has(step.id) ? '!' : ICON[status]}</span>
            <div className="min-w-0">
              <p className={`font-body text-[15px] leading-snug ${status === 'waiting' && !theirs.has(step.id) ? 'text-ink/50' : 'font-medium'}`}>
                {step.title}{step.owner === 'client' && status !== 'done' && <span className="ml-2 rounded-full bg-lime/70 px-2 py-0.5 align-middle font-body text-[10px] font-medium text-forest">You</span>}
              </p>
              <p className="font-body text-[12px] text-ink/50">{status === 'done' ? `Done ${day(state.done)}` : status === 'submitted' ? `Sent ${day(state.submitted)} · ${LABEL.submitted}` : theirs.has(step.id) ? 'Your turn' : LABEL[status]}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
