'use client'
import { useState } from 'react'
import Link from 'next/link'
import CalButton from './CalButton'
import { REVENUE_STOPS, revenueLabel, revenueValue, revenueStage, questions, tiers, computeResult, computeScore, getServices, computeHealthScore } from '@/lib/quiz'

const input = 'w-full rounded-[14px] border border-ink/[0.12] bg-white px-4 py-3 font-body text-sm text-ink transition-all placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'
const label = 'mb-2 block font-body text-sm text-ink'

type Readout = {
  email: string
  tier: keyof typeof tiers
  health: ReturnType<typeof computeHealthScore>
  services: ReturnType<typeof getServices>
}

/**
 * The contact form asks the ROI calculator's questions, saves the lead the
 * same way (which also starts their personal growth plan), then reads out
 * the result on the spot.
 */
export default function ContactForm() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revenueIdx, setRevenueIdx] = useState(-1)
  const [state, setState] = useState<'idle' | 'sending'>('idle')
  const [error, setError] = useState('')
  const [readout, setReadout] = useState<Readout | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const missing = questions.find(q => !answers[q.id])
    if (missing) {
      setError(`Please answer: ${missing.question}`)
      return
    }
    const form = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>
    const scored = revenueIdx >= 0 ? { ...answers, stage: revenueStage(revenueIdx) } : answers
    const tier = computeResult(scored)
    const services = getServices(scored)
    const readable: Record<string, string> = {}
    questions.forEach(q => {
      const opt = q.options.find(o => o.value === answers[q.id])
      if (opt) readable[q.question] = opt.label
    })

    setState('sending')
    try {
      const res = await fetch('/api/quiz-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Contact form',
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          consent: form.consent === 'on',
          tier: tiers[tier].name,
          services: services.map(s => s.label),
          answers: readable,
          score: computeScore(scored),
          annualRevenue: revenueIdx >= 0 ? revenueValue(revenueIdx) : undefined,
          annualRevenueLabel: revenueIdx >= 0 ? revenueLabel(revenueIdx) : '',
        }),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(out.error || 'Something went wrong.')
      setReadout({ email: form.email, tier, health: computeHealthScore(scored), services })
      requestAnimationFrame(() => document.getElementById('contact-readout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'Something went wrong.'} Please try again, or email hello@hewn.life.`)
    } finally {
      setState('idle')
    }
  }

  if (readout) return <ReadoutView {...readout} />

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={label}>Full name *</label>
          <input id="c-name" name="name" type="text" required autoComplete="name" className={input} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="c-company" className={label}>Business name *</label>
          <input id="c-company" name="company" type="text" required autoComplete="organization" className={input} placeholder="Your business" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="c-email" className={label}>Email address *</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={input} placeholder="you@business.com" />
        </div>
        <div>
          <label htmlFor="c-phone" className={label}>Phone number</label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" className={input} placeholder="Optional" />
        </div>
      </div>
      <div>
        <label htmlFor="c-revenue" className={label}>Annual revenue (approx.)</label>
        <select id="c-revenue" value={revenueIdx} onChange={e => setRevenueIdx(Number(e.target.value))} className={input}>
          <option value={-1}>Select range</option>
          {REVENUE_STOPS.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
        </select>
      </div>

      {questions.map((q, qi) => (
        <fieldset key={q.id}>
          <legend className={label}>{qi + 1}. {q.question} *</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {q.options.map(o => {
              const on = answers[q.id] === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: o.value }))}
                  className={`rounded-[14px] border px-4 py-3 text-left font-body text-sm transition ${on ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] bg-white text-ink hover:border-forest/40'}`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <label htmlFor="c-notes" className={label}>Anything else we should know?</label>
        <textarea id="c-notes" name="notes" rows={4} className={`${input} resize-none`} placeholder="What you sell, who you sell to, what you've tried…" />
      </div>
      <label className="flex items-start gap-3 font-body text-[13px] leading-relaxed text-ink/70">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 flex-shrink-0 accent-forest" />
        <span>I agree to receive my results and occasional marketing communications from Hewn Life, and consent to my information being used as described in the <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-2">privacy policy</Link>. I can unsubscribe anytime.</span>
      </label>
      {error && <p role="alert" className="rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className="w-full rounded-full bg-forest py-4 font-body font-medium text-mist transition-all duration-300 hover:bg-forest-2 disabled:opacity-60">
        {state === 'sending' ? 'Reading your answers…' : 'Get my readout'}
      </button>
      <p className="text-center font-body text-[12px] text-ink/60">We respect your privacy. Your information is never shared or sold.</p>
    </form>
  )
}

function ReadoutView({ email, tier, health, services }: Readout) {
  const t = tiers[tier]
  return (
    <div id="contact-readout" className="scroll-mt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest">Your readout</p>
      <div className="mt-4 flex items-end gap-4">
        <p className="font-display text-[64px] font-semibold leading-none tracking-[-0.03em] text-ink">{health.overall}</p>
        <p className="pb-2 font-body text-sm text-ink/60">/ 100 marketing health score</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {health.categories.map(c => (
          <div key={c.label}>
            <div className="flex justify-between font-body text-sm text-ink"><span>{c.label}</span><span className="font-medium">{c.score}</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-sand"><div className="h-2 rounded-full bg-forest" style={{ width: `${c.score}%` }} /></div>
            <p className="mt-1.5 font-body text-[12px] leading-snug text-ink/60">{c.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[24px] bg-lime p-6 text-forest">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Where we&apos;d start</p>
        <p className="mt-2 font-display text-[28px] font-semibold">{t.name} <span className="font-body text-[15px] font-normal opacity-70">{t.price}</span></p>
        <p className="mt-1 font-body text-[15px]">{t.tagline}</p>
      </div>

      {services.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">Where to focus first</p>
          <ul className="mt-3 divide-y divide-ink/[0.08]">
            {services.slice(0, 3).map(s => (
              <li key={s.label} className="py-3">
                <p className="font-body text-[15px] font-medium text-ink">{s.label}</p>
                <p className="font-body text-sm text-ink/65">{s.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-[20px] border border-ink/[0.08] bg-bone p-5">
        <p className="font-body text-[15px] text-ink">Your personal growth plan is on its way to <b>{email}</b>: your top challenges, how we&apos;d address them and a 90-day roadmap.</p>
        <CalButton className="mt-4 inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">Book a call to walk through it</CalButton>
      </div>
    </div>
  )
}
