'use client'
import { useState } from 'react'

export default function PortalLogin({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setState('sending')
    const res = await fetch('/api/portal/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) { setError(out.error || 'Something went wrong.'); setState('idle'); return }
    setState('sent')
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-bone px-4">
      <div className="w-full max-w-sm rounded-[28px] border border-ink/[0.08] bg-white p-8">
        <p className="font-display text-[22px] font-semibold tracking-[-0.02em]">hewn<span className="accent text-ember">life</span></p>
        <h1 className="mt-4 font-display text-[24px] font-semibold tracking-[-0.02em]">Client portal</h1>
        {state === 'sent' ? (
          <p role="status" className="mt-3 font-body text-[15px] leading-relaxed text-ink/75">If <b>{email}</b> is set up for the portal, a sign-in link is on its way. It works for 24 hours.</p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            {expired && <p className="rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">That link expired. Get a new one.</p>}
            <p className="font-body text-[14px] leading-relaxed text-ink/65">Enter the email you work with us from and we’ll send you a sign-in link. No password needed.</p>
            <label htmlFor="portal-email" className="sr-only">Email</label>
            <input id="portal-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-[14px] border border-ink/[0.12] px-4 py-3 font-body text-sm focus:border-forest focus:outline-none" placeholder="you@yourcompany.com" />
            {error && <p role="alert" className="font-body text-[13px] text-[#7A2E1E]">{error}</p>}
            <button disabled={state === 'sending'} className="w-full rounded-full bg-forest py-3.5 font-body text-[15px] font-medium text-mist disabled:opacity-60">
              {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
            </button>
          </form>
        )}
        <p className="mt-6 font-body text-[12px] text-ink/50">Not a client yet? <a href="/" className="text-forest">Visit hewn.life</a></p>
      </div>
    </div>
  )
}
