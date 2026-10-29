'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * One question per card, like the ROI calculator, for every form on the site.
 * A step is either a single choice (big option cards that move on when tapped)
 * or a few related inputs. Required fields are checked per step, so nobody
 * scrolls a long form or hits a wall of errors at the end.
 */

export type FlowOption = { label: string; value?: string; hint?: string }

export type FlowField = {
  name: string
  label?: string
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'file' | 'checkbox'
  required?: boolean
  placeholder?: string
  help?: string
  accept?: string
  maxBytes?: number
  autoComplete?: string
}

export type FlowStep = {
  id: string
  title: string
  subtitle?: string
  /** A single-choice question shown as cards. */
  choice?: { name: string; options: FlowOption[]; required?: boolean }
  fields?: FlowField[]
}

const input = 'w-full rounded-[14px] border border-ink/[0.12] bg-white px-4 py-3.5 font-body text-[16px] text-ink transition placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i

export default function CardFlow({
  steps, values, onChange, onSubmit, submitLabel, sending, error, finePrint, eyebrow,
}: {
  steps: FlowStep[]
  values: Record<string, string>
  onChange: (name: string, value: string, file?: File | null) => void
  onSubmit: () => void
  submitLabel: string
  sending?: boolean
  error?: string
  finePrint?: React.ReactNode
  eyebrow?: string
}) {
  const [i, setI] = useState(0)
  const [stepError, setStepError] = useState('')
  const [fileNames, setFileNames] = useState<Record<string, string>>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const firstInput = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const step = steps[i]
  const last = i === steps.length - 1

  useEffect(() => {
    setStepError('')
    // Keep the card in view on phones, and put the cursor in the first box.
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (i > 0 && (top < 0 || top > window.innerHeight * 0.5)) rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (i > 0) firstInput.current?.focus({ preventScroll: true })
  }, [i])

  function problem(s: FlowStep): string {
    if (s.choice?.required && !values[s.choice.name]) return 'Pick one to continue.'
    for (const f of s.fields ?? []) {
      const v = (values[f.name] ?? '').trim()
      if (f.type === 'checkbox') { if (f.required && v !== 'on') return 'Please tick the box to continue.'; continue }
      if (f.type === 'file') continue
      if (f.required && !v) return `Please add ${f.label ? f.label.toLowerCase() : 'this'}.`
      if (v && f.type === 'email' && !EMAIL.test(v)) return 'That email doesn’t look right.'
      if (v && f.type === 'url' && !URL_RE.test(v)) return `${f.label ?? 'That link'} doesn’t look like a web address.`
    }
    return ''
  }

  function next() {
    const p = problem(step)
    if (p) { setStepError(p); return }
    if (last) onSubmit()
    else setI(n => n + 1)
  }

  function choose(name: string, value: string) {
    onChange(name, value)
    setStepError('')
    // A short pause so the tap registers before the next card.
    if (!last) setTimeout(() => setI(n => Math.min(n + 1, steps.length - 1)), 220)
  }

  const pct = Math.round(((i + 1) / steps.length) * 100)
  let focusAssigned = false
  const ref = <T extends HTMLInputElement | HTMLTextAreaElement>(el: T | null) => {
    if (el && !focusAssigned) { firstInput.current = el; focusAssigned = true }
  }

  return (
    <div ref={rootRef} className="scroll-mt-24 rounded-[28px] border border-ink/[0.08] bg-white p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">{eyebrow ? `${eyebrow} · ` : ''}{i + 1} of {steps.length}</p>
        {i > 0 && <button type="button" onClick={() => setI(n => n - 1)} className="font-body text-sm text-ink/60 underline-offset-2 hover:text-ink hover:underline">← Back</button>}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-sand" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress">
        <div className="h-1.5 rounded-full bg-forest transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <form
        key={step.id}
        className="animate-fade-up mt-8"
        onSubmit={e => { e.preventDefault(); next() }}
        noValidate
      >
        <h3 className="font-display text-[clamp(24px,2.4vw,32px)] font-medium leading-[1.15] tracking-[-0.03em] text-ink">{step.title}</h3>
        {step.subtitle && <p className="mt-2 font-body text-[15px] text-ink/65">{step.subtitle}</p>}

        {step.choice && (
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={step.title}>
            {step.choice.options.map(o => {
              const v = o.value ?? o.label
              const on = values[step.choice!.name] === v
              return (
                <button key={v} type="button" role="radio" aria-checked={on} onClick={() => choose(step.choice!.name, v)}
                  className={`rounded-[18px] border px-5 py-4 text-left font-body text-[15px] transition ${on ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] bg-white text-ink hover:border-forest/50 hover:bg-bone'}`}>
                  {o.label}
                  {o.hint && <span className={`mt-0.5 block text-[13px] ${on ? 'text-mist/75' : 'text-ink/55'}`}>{o.hint}</span>}
                </button>
              )
            })}
          </div>
        )}

        {step.fields && (
          <div className="mt-6 space-y-4">
            {step.fields.map(f => {
              const id = `flow-${f.name}`
              const label = f.label && f.type !== 'checkbox' && (
                <label htmlFor={id} className="mb-2 block font-body text-sm font-medium text-ink">
                  {f.label}{f.required ? '' : <span className="font-normal text-ink/45"> (optional)</span>}
                </label>
              )
              if (f.type === 'checkbox') return (
                <label key={f.name} className="flex items-start gap-3 font-body text-[13px] leading-relaxed text-ink/70">
                  <input type="checkbox" checked={values[f.name] === 'on'} onChange={e => onChange(f.name, e.target.checked ? 'on' : '')} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest" />
                  <span>{f.help}</span>
                </label>
              )
              if (f.type === 'textarea') return (
                <div key={f.name}>{label}
                  <textarea ref={ref} id={id} rows={4} value={values[f.name] ?? ''} placeholder={f.placeholder} onChange={e => onChange(f.name, e.target.value)} className={`${input} resize-y`} />
                  {f.help && <p className="mt-1.5 font-body text-xs text-ink/55">{f.help}</p>}
                </div>
              )
              if (f.type === 'file') return (
                <div key={f.name}>{label}
                  <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border border-dashed border-ink/25 bg-white px-4 py-5 font-body text-sm transition hover:border-forest">
                    <span className={fileNames[f.name] ? 'text-ink' : 'text-ink/55'}>{fileNames[f.name] || 'Choose a file'}</span>
                    <span className="rounded-full bg-forest px-3.5 py-1.5 font-medium text-mist">Browse</span>
                  </label>
                  <input id={id} type="file" accept={f.accept} className="sr-only" onChange={e => {
                    const file = e.target.files?.[0] ?? null
                    if (file && f.maxBytes && file.size > f.maxBytes) { setStepError('That file is too big. Please choose a smaller one.'); return }
                    setFileNames(n => ({ ...n, [f.name]: file?.name ?? '' }))
                    onChange(f.name, file?.name ?? '', file)
                  }} />
                  {f.help && <p className="mt-1.5 font-body text-xs text-ink/55">{f.help}</p>}
                </div>
              )
              return (
                <div key={f.name}>{label}
                  <input ref={ref} id={id} type={f.type} value={values[f.name] ?? ''} placeholder={f.placeholder} autoComplete={f.autoComplete}
                    inputMode={f.type === 'url' ? 'url' : undefined} onChange={e => onChange(f.name, e.target.value)} className={input} />
                  {f.help && <p className="mt-1.5 font-body text-xs text-ink/55">{f.help}</p>}
                </div>
              )
            })}
          </div>
        )}

        {(stepError || (last && error)) && (
          <p role="alert" className="mt-5 rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{stepError || error}</p>
        )}

        {(!step.choice || last || values[step.choice.name]) && (
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={sending}
              className="rounded-full bg-forest px-7 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2 disabled:opacity-60">
              {last ? (sending ? 'Sending…' : submitLabel) : 'Next →'}
            </button>
            {!last && !step.choice && (step.fields ?? []).every(f => !f.required) && (
              <button type="button" onClick={() => setI(n => n + 1)} className="font-body text-sm text-ink/55 hover:text-ink">Skip</button>
            )}
            {!step.choice && <span className="hidden font-body text-xs text-ink/40 sm:inline">or press Enter</span>}
          </div>
        )}
        {last && finePrint && <div className="mt-5 font-body text-xs leading-relaxed text-ink/55">{finePrint}</div>}
      </form>
    </div>
  )
}
