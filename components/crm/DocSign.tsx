'use client'
import { useState } from 'react'
import Link from 'next/link'
import CrmHeader from './CrmHeader'
import AgreementDoc from '@/components/agreements/AgreementDoc'
import type { Agreement } from '@/lib/agreements/data'
import type { InternalTerms } from '@/lib/agreements/internal'

const when = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
const input = 'mt-1 w-full rounded-[12px] border border-ink/[0.15] px-3 py-2.5 font-body text-[15px] text-ink focus:border-forest focus:outline-none'

/** One internal document: read it, then sign in your capacities. */
export default function DocSign({ user, doc: initial, terms, next }: { user: string; doc: Agreement; terms: InternalTerms; next?: { id: string; title: string } | null }) {
  const [d, setD] = useState(initial)
  const idx = terms.signers.findIndex(s => s.email === user)
  const me = idx >= 0 ? terms.signers[idx] : null
  const sigs = [d.hewnSig, d.clientSig]
  const [name, setName] = useState(me?.name ?? '')
  const [title, setTitle] = useState(me?.title ?? '')
  const [address, setAddress] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const canSign = me && !sigs[idx] && d.status !== 'Void'

  async function sign(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError('')
    const res = await fetch('/api/crm/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sign', id: d.id, name, title, address, consent, hash: d.hash }) })
    const out = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(out.error || 'Couldn’t sign. Try again.'); return }
    setD(out.agreement); setDone(true); window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <CrmHeader active="docs" user={user} />
      <main className="mx-auto max-w-[860px] px-4 pb-20 pt-6 sm:px-6">
        <Link href="/hq/documents" className="font-body text-[13px] text-ink/60 hover:text-ink">← All docs</Link>
        <section className={`mt-4 rounded-[24px] p-5 sm:p-6 ${d.status === 'Signed' ? 'bg-forest text-mist' : 'border border-ink/[0.08] bg-white'}`}>
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${d.status === 'Signed' ? 'text-lime' : 'text-ink/55'}`}>{d.status === 'Signed' ? 'Fully signed' : canSign ? 'Ready for your signature' : 'Waiting on signatures'}</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold tracking-[-0.02em]">{d.title}</h1>
          <ul className="mt-2 space-y-0.5 font-body text-[14px]">
            {terms.signers.map((s, i) => <li key={s.email}>{sigs[i] ? '✓' : '○'} {s.name} ({s.capacities.join('; ')}){sigs[i] ? `: signed ${when(sigs[i]!.at)}` : ': not signed yet'}</li>)}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {canSign && <a href="#sign" className="rounded-full bg-forest px-5 py-2 font-body text-[14px] text-mist">Go to signature</a>}
            {d.status === 'Signed' && <a href={`/api/agreements/pdf?id=${d.id}&download=1`} className="rounded-full bg-lime px-5 py-2 font-body text-[14px] font-medium text-forest">Download for my records</a>}
            {d.status === 'Signed' && <a href={`/api/agreements/pdf?id=${d.id}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-mist/40 px-5 py-2 font-body text-[14px] text-mist">View PDF</a>}
            {d.status !== 'Signed' && sigs.some(Boolean) && <a href={`/api/agreements/pdf?id=${d.id}&download=1`} className="rounded-full border border-ink/15 px-5 py-2 font-body text-[14px]">Download copy (signatures so far)</a>}
          </div>
        </section>

        <div className="mt-4 rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-8"><AgreementDoc doc={d.doc} /></div>

        {canSign && me && (
          <form id="sign" onSubmit={sign} className="mt-4 scroll-mt-4 rounded-[24px] border border-forest/25 bg-white p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Your signature</p>
            <p className="mt-2 font-body text-[14px] text-ink/75">You’re signing as: <b className="font-medium text-ink">{me.capacities.join('; ')}</b>.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="font-body text-[13px] text-ink/70">Full legal name<input value={name} onChange={e => setName(e.target.value)} className={input} required /></label>
              <label className="font-body text-[13px] text-ink/70">Title<input value={title} onChange={e => setTitle(e.target.value)} className={input} required /></label>
              {me.askAddress && <label className="font-body text-[13px] text-ink/70 sm:col-span-2">Notice address<input value={address} onChange={e => setAddress(e.target.value)} placeholder="Where formal notices under this agreement should go" className={input} required /></label>}
            </div>
            <div className="mt-4 rounded-[16px] bg-bone px-4 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-ink/45">Signature</p>
              <p className="mt-1 min-h-[40px] font-accent text-[30px] italic leading-tight text-forest">{name.trim() || <span className="text-ink/25">Type your name above</span>}</p>
              <p className="mt-2 border-t border-ink/10 pt-2 font-body text-[13px] text-ink/70">Date: <b className="font-medium text-ink">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</b> <span className="text-ink/50">(recorded when you sign)</span></p>
            </div>
            <label className="mt-4 flex items-start gap-2.5 font-body text-[13px] leading-snug text-ink/75">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E3826]" />
              <span>I’ve read this document. I sign it electronically, in each capacity listed above, and agree that typing my name is my signature with the same effect as signing on paper.</span>
            </label>
            {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
            <button disabled={busy || !consent || !name.trim().includes(' ') || !title.trim() || (me.askAddress && !address.trim())} className="mt-4 rounded-full bg-forest px-6 py-3 font-body text-[15px] font-medium text-mist disabled:opacity-40">{busy ? 'Signing…' : 'Sign'}</button>
            <p className="mt-3 font-body text-[11px] text-ink/50">Recorded with your signature: name, title, your @hewn.life login, the time, IP address and browser, and a fingerprint of this exact text.</p>
          </form>
        )}
      </main>

      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" role="dialog" aria-modal="true" aria-labelledby="signed-title" onClick={() => setDone(false)}>
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 text-ink shadow-2xl sm:p-7" onClick={e => e.stopPropagation()}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-[24px] text-forest" aria-hidden>✓</span>
            <h2 id="signed-title" className="mt-4 font-display text-[22px] font-semibold tracking-[-0.02em]">{d.status === 'Signed' ? 'Signed by everyone' : 'You’ve signed'}</h2>
            <p className="mt-2 font-body text-[15px] leading-relaxed text-ink/75">
              {d.status === 'Signed'
                ? <>{d.title} is complete. The signed PDF, with its signature certificate, is on its way to both of you by email.</>
                : <>Your signature on {d.title} is recorded. We’ve emailed {terms.signers.filter((_, i) => !sigs[i]).map(s => s.name.split(' ')[0]).join(' and ')} to sign; you’ll both get the signed PDF when they do.</>}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {d.status === 'Signed'
                ? <a href={`/api/agreements/pdf?id=${d.id}&download=1`} className="rounded-full bg-forest px-5 py-3 text-center font-body text-[15px] font-medium text-mist">Download for my records</a>
                : <a href={`/api/agreements/pdf?id=${d.id}&download=1`} className="rounded-full border border-ink/15 px-5 py-3 text-center font-body text-[15px]">Download a copy (signatures so far)</a>}
              {next
                ? <Link href={`/hq/documents/${next.id}`} className={`rounded-full px-5 py-3 text-center font-body text-[15px] ${d.status === 'Signed' ? 'border border-ink/15' : 'bg-forest font-medium text-mist'}`}>Next to sign: {next.title} →</Link>
                : <Link href="/hq/documents" className="rounded-full border border-ink/15 px-5 py-3 text-center font-body text-[15px]">Back to all docs</Link>}
              <button onClick={() => setDone(false)} className="py-1 font-body text-[13px] text-ink/55">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
