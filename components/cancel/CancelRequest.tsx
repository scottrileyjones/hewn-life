'use client'
import { useState } from 'react'

const input = 'w-full rounded-[14px] border border-ink/[0.12] bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'

export default function CancelRequest() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setState('sending')
    const res = await fetch('/api/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) { setError(out.error || 'Something went wrong.'); setState('idle'); return }
    setState('sent')
  }

  if (state === 'sent') {
    return (
      <div role="status">
        <p className="font-display text-[22px] font-medium tracking-[-0.02em] text-ink">Check your inbox.</p>
        <p className="mt-2 font-body text-[15px] leading-relaxed text-ink/70">If <b>{email}</b> has an active plan, we’ve sent it a link to confirm the cancellation. It works for 24 hours. No email in a few minutes? Check spam, or email hello@hewn.life and we’ll cancel for you.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label htmlFor="cancel-email" className="block font-body text-sm text-ink">Email address on your subscription</label>
      <input id="cancel-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={input} placeholder="you@business.com" />
      {error && <p role="alert" className="rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className="w-full rounded-full bg-forest py-4 font-body font-medium text-mist transition hover:bg-forest-2 disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : 'Email me a cancellation link'}
      </button>
    </form>
  )
}
