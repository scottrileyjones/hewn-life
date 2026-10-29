'use client'
import { useState } from 'react'
import CalButton from './CalButton'

const input = 'w-full rounded-[14px] border border-ink/[0.12] bg-white px-4 py-3 font-body text-sm text-ink transition-all placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'
const label = 'mb-2 block font-body text-sm text-ink'

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setState('sending')
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(out.error || 'Something went wrong.')
      setState('done')
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'Something went wrong.'} Please try again, or email hello@hewnlife.com.`)
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-4 font-display text-3xl font-medium tracking-[-0.03em] text-ink">Thank you.</h3>
        <p className="font-body text-ink/70">We&apos;ll review your message and be in touch within one business day.</p>
        <CalButton className="mt-7 inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">Book your call now</CalButton>
      </div>
    )
  }

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="c-revenue" className={label}>Annual revenue (approx.)</label>
          <select id="c-revenue" name="revenue" defaultValue="" className={input}>
            <option value="">Select range</option>
            <option>Under $500K</option>
            <option>$500K–$1M</option>
            <option>$1M–$5M</option>
            <option>$5M+</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <div>
          <label htmlFor="c-plan" className={label}>Which plan interests you?</label>
          <select id="c-plan" name="plan" defaultValue="" className={input}>
            <option value="">Select plan</option>
            <option>Website in a Day — $999</option>
            <option>Hewn — $2,500/mo</option>
            <option>Wrought — $5,000/mo</option>
            <option>Forged — $9,500/mo</option>
            <option>À la carte project</option>
            <option>Not sure yet</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-challenge" className={label}>What&apos;s your biggest marketing challenge right now? *</label>
        <textarea id="c-challenge" name="challenge" required rows={4} className={`${input} resize-none`} placeholder="Tell us what you're working on…" />
      </div>
      <div>
        <label htmlFor="c-source" className={label}>How did you hear about us?</label>
        <input id="c-source" name="source" type="text" className={input} placeholder="Optional" />
      </div>
      {error && <p role="alert" className="rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className="w-full rounded-full bg-forest py-4 font-body font-medium text-mist transition-all duration-300 hover:bg-forest-2 disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p className="text-center font-body text-[12px] text-ink/60">We respect your privacy. Your information is never shared or sold.</p>
    </form>
  )
}
