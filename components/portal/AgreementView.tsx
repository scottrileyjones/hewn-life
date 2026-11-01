'use client'
import { useState } from 'react'
import Link from 'next/link'
import AgreementDoc from '@/components/agreements/AgreementDoc'
import PortalHeader from './PortalHeader'
import type { Agreement } from '@/lib/agreements/data'

const when = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

/** The client reads the agreement and signs it by typing their name. */
export default function AgreementView({ email, agreement: initial, payUrl: initialPay }: { email: string; agreement: Agreement; payUrl: string | null }) {
  const [a, setA] = useState(initial)
  const [payUrl, setPayUrl] = useState(initialPay)
  const [name, setName] = useState(initial.deal.signerName || '')
  const [title, setTitle] = useState(initial.deal.signerTitle || '')
  const [consent, setConsent] = useState(false)
  const [authority, setAuthority] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const legal = a.deal.clientLegalName || a.company
  const ready = name.trim().includes(' ') && title.trim() && consent && authority

  async function sign(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError('')
    const res = await fetch('/api/portal/agreements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, name, title, consent, authority, hash: a.hash }) })
    const out = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(out.error || 'Couldn’t sign. Try again.'); return }
    setA(out.agreement); setPayUrl(out.payUrl ?? null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const signed = a.status === 'Signed'
  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <PortalHeader email={email} active="overview" />
      <main className="mx-auto max-w-[860px] px-4 pb-20 pt-6 sm:px-6">
        <Link href="/portal" className="font-body text-[13px] text-ink/60 hover:text-ink">← Back to your portal</Link>

        {signed ? (
          <section className="mt-4 rounded-[24px] bg-forest p-6 text-mist sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Signed</p>
            <h1 className="mt-2 font-display text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]">Thank you{a.clientSig ? `, ${a.clientSig.name.split(' ')[0]}` : ''}. You’re all set.</h1>
            <p className="mt-2 font-body text-[15px] text-mist/80">Signed {a.clientSig ? when(a.clientSig.at) : ''}. A copy with its signature certificate is on its way to {a.clientEmail}.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {payUrl && <a href={payUrl} className="rounded-full bg-lime px-5 py-2.5 font-body text-[14px] font-medium text-forest">Set up billing →</a>}
              <a href={`/api/agreements/pdf?id=${a.id}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-mist/40 px-5 py-2.5 font-body text-[14px] text-mist hover:bg-mist/10">Download signed PDF</a>
            </div>
          </section>
        ) : a.status === 'Void' ? (
          <p className="mt-4 rounded-[16px] bg-sand px-4 py-3 font-body text-[14px]">This agreement was withdrawn. Message us in your portal and we’ll send the current one.</p>
        ) : (
          <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-ink/[0.08] bg-white p-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Ready for your signature</p>
              <h1 className="mt-1 font-display text-[22px] font-semibold tracking-[-0.02em]">{a.title}</h1>
              {a.hewnSig && <p className="mt-1 font-body text-[13px] text-ink/60">Hewn Life signed on {when(a.hewnSig.at)}.</p>}
            </div>
            <a href="#sign" className="rounded-full bg-forest px-5 py-2.5 font-body text-[14px] font-medium text-mist">Go to signature</a>
          </section>
        )}

        <div className="mt-4 rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-8">
          <AgreementDoc doc={a.doc} />
        </div>

        {!signed && a.status !== 'Void' && (
          <form id="sign" onSubmit={sign} className="mt-4 scroll-mt-4 rounded-[24px] border border-forest/25 bg-white p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Sign for {legal}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="font-body text-[13px] text-ink/70">Full name
                <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required className="mt-1 w-full rounded-[12px] border border-ink/[0.15] px-3 py-2.5 font-body text-[15px] text-ink focus:border-forest focus:outline-none" />
              </label>
              <label className="font-body text-[13px] text-ink/70">Title
                <input value={title} onChange={e => setTitle(e.target.value)} autoComplete="organization-title" placeholder="e.g. Owner" required className="mt-1 w-full rounded-[12px] border border-ink/[0.15] px-3 py-2.5 font-body text-[15px] text-ink focus:border-forest focus:outline-none" />
              </label>
            </div>
            <div className="mt-4 rounded-[16px] bg-bone px-4 py-3" aria-live="polite">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-ink/45">Your signature</p>
              <p className="mt-1 min-h-[40px] font-accent text-[30px] italic leading-tight text-forest">{name.trim() || <span className="text-ink/25">Type your name above</span>}</p>
            </div>
            <label className="mt-4 flex items-start gap-2.5 font-body text-[13px] leading-snug text-ink/75">
              <input type="checkbox" checked={authority} onChange={e => setAuthority(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E3826]" />
              <span>I’m authorized to sign this agreement for {legal}, and I’ve read it.</span>
            </label>
            <label className="mt-2.5 flex items-start gap-2.5 font-body text-[13px] leading-snug text-ink/75">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E3826]" />
              <span>I agree to sign electronically, and that typing my name above is my signature, with the same effect as signing on paper.</span>
            </label>
            {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
            <button disabled={busy || !ready} className="mt-4 w-full rounded-full bg-forest px-5 py-3 font-body text-[15px] font-medium text-mist disabled:opacity-40 sm:w-auto">{busy ? 'Signing…' : 'Sign agreement'}</button>
            <p className="mt-3 font-body text-[11px] leading-snug text-ink/50">We record your name, email, the time, your IP address and browser with your signature, and a fingerprint of this exact text, on a certificate attached to your signed copy.</p>
          </form>
        )}
      </main>
    </div>
  )
}
