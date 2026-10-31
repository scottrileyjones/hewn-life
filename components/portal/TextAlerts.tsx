'use client'
import { useState } from 'react'
import { CONSENT_TEXT, prettyPhone } from '@/lib/smsText'

/** Portal card where a client turns project texts on or off. The box is never pre-ticked. */
export default function TextAlerts({ mobile: initialMobile, on: initialOn }: { mobile: string; on: boolean }) {
  const [on, setOn] = useState(initialOn)
  const [mobile, setMobile] = useState(initialMobile)
  const [draft, setDraft] = useState(initialMobile ? prettyPhone(initialMobile) : '')
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  async function save(optIn: boolean) {
    setBusy(true); setError(''); setNote('')
    const res = await fetch('/api/portal/sms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ optIn, mobile: draft, agreed }) })
    const out = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(out.error || 'Couldn’t save. Try again.'); return }
    setOn(out.smsOptIn); setMobile(out.mobile || ''); setAgreed(false)
    setNote(optIn ? (out.sent ? 'You’re in. We just sent a confirmation text.' : 'You’re in. Texts start as soon as our number is live.') : 'Texts are off. You’ll still get emails.')
  }

  return (
    <section className="rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-6">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Text alerts</h2>
      {on ? (
        <>
          <p className="mt-3 font-body text-[15px] leading-snug">Texts go to <b>{prettyPhone(mobile)}</b> when something needs you or a step is done.</p>
          <button onClick={() => save(false)} disabled={busy} className="mt-3 w-full rounded-full border border-ink/[0.15] px-4 py-2.5 font-body text-[14px] text-ink/75 hover:border-ink/40 disabled:opacity-50">{busy ? 'Saving…' : 'Turn texts off'}</button>
        </>
      ) : (
        <form onSubmit={e => { e.preventDefault(); save(true) }}>
          <p className="mt-3 font-body text-[15px] leading-snug">Get a text when something needs you or a step is done.</p>
          <label htmlFor="sms-mobile" className="mt-3 block font-body text-[13px] text-ink/70">Mobile number</label>
          <input id="sms-mobile" type="tel" inputMode="tel" autoComplete="tel" value={draft} onChange={e => setDraft(e.target.value)} placeholder="(801) 555-0100"
            className="mt-1 w-full rounded-[12px] border border-ink/[0.12] bg-white px-3 py-2.5 font-body text-[15px] focus:border-forest focus:outline-none" />
          <label className="mt-3 flex items-start gap-2.5 font-body text-[12px] leading-snug text-ink/65">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E3826]" />
            <span>{CONSENT_TEXT} See our <a href="/legal/sms" target="_blank" className="underline underline-offset-2">SMS Terms</a> and <a href="/legal/privacy" target="_blank" className="underline underline-offset-2">Privacy Policy</a>.</span>
          </label>
          <button disabled={busy || !agreed || !draft.trim()} className="mt-3 w-full rounded-full bg-forest px-4 py-2.5 font-body text-[14px] font-medium text-mist disabled:opacity-50">{busy ? 'Saving…' : 'Turn on texts'}</button>
        </form>
      )}
      {error && <p role="alert" className="mt-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
      {note && <p role="status" className="mt-2 font-body text-[13px] text-forest">{note}</p>}
      <p className="mt-3 font-body text-[11px] leading-snug text-ink/50">Our texts never ask for payment, passwords or codes.</p>
    </section>
  )
}
