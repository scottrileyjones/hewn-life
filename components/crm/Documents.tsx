'use client'
import { useState } from 'react'
import Link from 'next/link'
import CrmHeader from './CrmHeader'
import type { Agreement } from '@/lib/agreements/data'
import type { InternalTerms } from '@/lib/agreements/internal'

const when = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
type Row = Agreement & { terms: InternalTerms }

/** HQ → Docs: internal documents and who still needs to sign. */
export default function Documents({ user, docs }: { user: string; docs: Row[] }) {
  const [note, setNote] = useState('')
  async function remind(id: string) {
    const res = await fetch('/api/crm/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'remind', id }) })
    const out = await res.json().catch(() => ({}))
    setNote(res.ok ? `Reminder sent to ${out.sent} signer${out.sent === 1 ? '' : 's'}.` : out.error || 'Couldn’t send.')
  }
  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <CrmHeader active="docs" user={user} />
      <main className="mx-auto max-w-[980px] px-4 pb-16 pt-6 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Company documents</p>
        <h1 className="mt-1 font-display text-[28px] font-semibold tracking-[-0.02em]">Docs to sign</h1>
        {note && <p role="status" className="mt-3 rounded-[12px] bg-[#E4EEDA] px-3 py-2 font-body text-[13px] text-forest">{note}</p>}
        <ul className="mt-5 space-y-3">
          {docs.map(d => {
            const sigs = [d.hewnSig, d.clientSig]
            const mine = d.terms.signers.findIndex(s => s.email === user)
            const needsMe = mine >= 0 && !sigs[mine] && d.status !== 'Void'
            return (
              <li key={d.id} className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-[17px] font-semibold tracking-[-0.01em]">{d.title}</p>
                    <ul className="mt-1.5 space-y-0.5 font-body text-[13px]">
                      {d.terms.signers.map((s, i) => (
                        <li key={s.email} className={sigs[i] ? 'text-forest' : 'text-ink/60'}>
                          {sigs[i] ? '✓' : '○'} {s.name}: {sigs[i] ? `signed ${when(sigs[i]!.at)}` : 'waiting'}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-body text-[13px]">
                    {d.status === 'Signed' && <a href={`/api/agreements/pdf?id=${d.id}&download=1`} className="text-forest underline underline-offset-2">Download PDF</a>}
                    {d.status !== 'Signed' && d.status !== 'Void' && <button onClick={() => remind(d.id)} className="text-ink/60 underline underline-offset-2">Remind</button>}
                    <Link href={`/hq/documents/${d.id}`} className={`rounded-full px-4 py-1.5 ${needsMe ? 'bg-forest text-mist' : 'border border-ink/15'}`}>{needsMe ? 'Review and sign' : 'Open'}</Link>
                  </div>
                </div>
              </li>
            )
          })}
          {!docs.length && <p className="font-body text-[14px] text-ink/55">Nothing to sign.</p>}
        </ul>
      </main>
    </div>
  )
}
