'use client'
import { useState } from 'react'

/** Shown only on the signed review link: one tap sends the plan to the lead. */
export default function ApproveBar({ token, sig, name, status }: { token: string; sig: string; name: string; status: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(status === 'Sent' ? 'sent' : 'idle')
  async function approve() {
    setState('sending')
    const res = await fetch('/api/plan/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, sig }) })
    setState(res.ok ? 'sent' : 'error')
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-[15px] text-ink/80">
          {state === 'sent' ? <>Sent to {name}. Follow-ups are scheduled.</> : <>Review mode. Nothing has been sent to {name} yet.</>}
          {state === 'error' && <span className="ml-2 text-[#B5621C]">That didn’t work. Try again.</span>}
        </p>
        {state !== 'sent' && (
          <button onClick={approve} disabled={state === 'sending'}
            className="w-full rounded-full bg-forest px-6 py-3 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2 disabled:opacity-60 sm:w-auto">
            {state === 'sending' ? 'Sending…' : `Approve and send to ${name}`}
          </button>
        )}
      </div>
    </div>
  )
}
