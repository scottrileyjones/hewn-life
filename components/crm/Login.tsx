'use client'
import { useState } from 'react'

export default function CrmLogin({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setState('sending')
    const res = await fetch('/api/crm/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) { setError(out.error || 'Something went wrong.'); setState('idle'); return }
    setState('sent')
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-bone px-4">
      <div className="w-full max-w-sm rounded-[28px] border border-ink/[0.08] bg-white p-8">
        <p className="font-display text-[22px] font-semibold tracking-[-0.02em]">hewn<span className="accent text-ember">life</span> <span className="font-body text-[16px] font-normal text-ink/50">CRM</span></p>
        {state === 'sent' ? (
          <p role="status" className="mt-4 font-body text-[15px] leading-relaxed text-ink/75">If <b>{email}</b> has access, a sign-in link is on its way. It works for 20 minutes.</p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            {expired && <p className="rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">That link expired. Get a new one.</p>}
            <label htmlFor="crm-email" className="block font-body text-sm text-ink">Your @hewn.life email</label>
            <input id="crm-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-[14px] border border-ink/[0.12] px-4 py-3 font-body text-sm focus:border-forest focus:outline-none" placeholder="you@hewn.life" />
            {error && <p role="alert" className="font-body text-[13px] text-[#7A2E1E]">{error}</p>}
            <button disabled={state === 'sending'} className="w-full rounded-full bg-forest py-3.5 font-body text-[15px] font-medium text-mist disabled:opacity-60">
              {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
