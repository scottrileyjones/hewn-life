'use client'
import { useState } from 'react'

export default function CancelConfirm({ e, x, s, plans }: { e: string; x: string; s: string; plans: { plan: string; until: string }[] }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function confirm() {
    setError('')
    setState('sending')
    const res = await fetch('/api/cancel/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e, x, s }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) { setError(out.error || 'Something went wrong.'); setState('idle'); return }
    setState('done')
  }

  if (state === 'done') {
    return (
      <div role="status">
        <p className="font-display text-[22px] font-medium tracking-[-0.02em] text-ink">Your subscription is cancelled.</p>
        <ul className="mt-3 space-y-1 font-body text-[15px] text-ink/75">
          {plans.map(p => <li key={p.plan}>{p.plan}: active until {p.until}, then no further charges.</li>)}
        </ul>
        <p className="mt-3 font-body text-[15px] text-ink/70">We’ve emailed you a confirmation. Changed your mind? Reply to it before then.</p>
      </div>
    )
  }

  return (
    <div>
      <ul className="space-y-2 font-body text-[15px] text-ink/80">
        {plans.map(p => <li key={p.plan}><b>{p.plan}</b> stays active until {p.until}. You won’t be charged again.</li>)}
      </ul>
      {error && <p role="alert" className="mt-4 rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{error}</p>}
      <button onClick={confirm} disabled={state === 'sending'} className="mt-6 w-full rounded-full bg-forest py-4 font-body font-medium text-mist transition hover:bg-forest-2 disabled:opacity-60">
        {state === 'sending' ? 'Cancelling…' : 'Cancel my plan'}
      </button>
      <p className="mt-3 text-center font-body text-[13px] text-ink/60">Want to change plans instead? Email hello@hewn.life.</p>
    </div>
  )
}
