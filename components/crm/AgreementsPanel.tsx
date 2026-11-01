'use client'
import { useEffect, useMemo, useState } from 'react'
import AgreementDoc from '@/components/agreements/AgreementDoc'
import { ADD_ONS, LIST_PRICE, PRODUCTS, addOnTotal, blankDeal, isRetainer, render, type Deal, type Product } from '@/lib/agreements/templates'
import type { Agreement } from '@/lib/agreements/data'
import type { PortalClient } from '@/lib/portal/data'

const when = (iso: string) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')
const STATUS_STYLE: Record<Agreement['status'], string> = { Sent: 'bg-sand text-ink/75', Viewed: 'bg-[#F6E7D4] text-[#7A4A12]', Signed: 'bg-lime text-forest', Void: 'bg-white text-ink/40 ring-1 ring-ink/10' }
const label = 'block font-body text-[12px] text-ink/65'
const input = 'mt-1 w-full rounded-[10px] border border-ink/[0.14] bg-white px-2.5 py-2 font-body text-[14px] text-ink focus:border-forest focus:outline-none'
const SIGNER_KEY = 'hewn-agreement-signer'

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/agreements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

/** HQ → Clients → Agreements: draft from a product, preview the exact text, countersign and send. */
export default function AgreementsPanel({ client, sample }: { client: PortalClient; sample?: Agreement[] }) {
  const [list, setList] = useState<Agreement[]>(sample ?? [])
  const [drafting, setDrafting] = useState(false)
  const [deal, setDeal] = useState<Deal>(() => blankDeal((client.plan as Product) && PRODUCTS.includes(client.plan as Product) ? client.plan as Product : 'Website in a Day', { company: client.company, name: client.name, email: client.email }))
  const [signer, setSigner] = useState({ name: '', title: 'Managing Member' })
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const doc = useMemo(() => render(deal), [deal])

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(SIGNER_KEY) || 'null'); if (s?.name) setSigner(s) } catch { /* private mode */ }
    if (sample) return
    call<{ agreements: Agreement[] }>({ action: 'list', email: client.email }).then(r => setList(r.agreements)).catch(e => setError(e.message))
  }, [client.email, sample])

  const set = <K extends keyof Deal>(k: K, v: Deal[K]) => setDeal(d => ({ ...d, [k]: v }))
  function pickProduct(p: Product) {
    setDeal(d => ({ ...blankDeal(p, { company: client.company, name: client.name, email: client.email }), clientLegalName: d.clientLegalName, clientEntity: d.clientEntity, clientAddress: d.clientAddress, signerName: d.signerName, signerTitle: d.signerTitle, signerEmail: d.signerEmail, effectiveDate: d.effectiveDate, startDate: d.startDate }))
  }
  function setBilling(b: 'monthly' | 'annual') {
    setDeal(d => ({ ...d, billing: b, fee: LIST_PRICE[d.product][b] ?? d.fee }))
  }
  function setQty(name: string, qty: number) {
    setDeal(d => {
      const addOns = [...d.addOns.filter(a => a.name !== name), ...(qty > 0 ? [{ name, qty }] : [])].sort((a, b) => ADD_ONS.findIndex(x => x.name === a.name) - ADD_ONS.findIndex(x => x.name === b.name))
      return { ...d, addOns, fee: addOnTotal(addOns) }
    })
  }

  async function send() {
    setBusy('send'); setError(''); setNote('')
    try {
      try { localStorage.setItem(SIGNER_KEY, JSON.stringify(signer)) } catch { /* private mode */ }
      if (sample) throw new Error('Preview mode: nothing is sent.')
      const r = await call<{ agreement: Agreement; emailed: boolean }>({ action: 'send', email: client.email, deal, signer: { ...signer, agree } })
      setList(l => [r.agreement, ...l]); setDrafting(false); setAgree(false)
      setNote(r.emailed ? `Signed and sent. ${client.email} has an email with a link to sign.` : 'Signed and saved, but the email didn’t send. Use Resend.')
    } catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }
  async function act(a: Agreement, action: 'resend' | 'void') {
    if (action === 'void' && !confirm('Withdraw this agreement? The client won’t be able to sign it.')) return
    setBusy(a.id); setError(''); setNote('')
    try {
      if (sample) throw new Error('Preview mode: nothing is sent.')
      const r = await call<{ agreement?: Agreement }>({ action, id: a.id })
      if (r.agreement) setList(l => l.map(x => (x.id === a.id ? r.agreement! : x)))
      setNote(action === 'resend' ? 'Reminder sent.' : 'Withdrawn.')
    } catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }

  const retainer = isRetainer(deal.product)
  return (
    <div className="max-w-[1180px] space-y-4">
      <section className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Agreements</p>
          {!drafting && <button onClick={() => { setDrafting(true); setNote(''); setError('') }} className="rounded-full bg-forest px-4 py-1.5 font-body text-[13px] text-mist">New agreement</button>}
        </div>
        {list.length ? (
          <ul className="mt-3 divide-y divide-ink/[0.06]">
            {list.map(a => (
              <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5">
                <span className={`rounded-full px-2 py-0.5 font-body text-[11px] font-medium ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                <span className="min-w-0 flex-1 font-body text-[14px]">
                  <span className="block truncate font-medium">{a.title}</span>
                  <span className="block text-[12px] text-ink/55">Sent {when(a.sentAt)}{a.viewedAt ? ` · opened ${when(a.viewedAt)}` : ''}{a.clientSig ? ` · signed by ${a.clientSig.name} ${when(a.clientSig.at)}` : ''}</span>
                </span>
                <span className="flex gap-3 font-body text-[13px]">
                  <a href={`/api/agreements/pdf?id=${a.id}`} target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-2">{a.status === 'Signed' ? 'Signed PDF' : 'PDF'}</a>
                  {(a.status === 'Sent' || a.status === 'Viewed') && <>
                    <button onClick={() => act(a, 'resend')} disabled={busy === a.id} className="text-forest underline underline-offset-2 disabled:opacity-50">Resend</button>
                    <button onClick={() => act(a, 'void')} disabled={busy === a.id} className="text-ink/55 underline underline-offset-2 disabled:opacity-50">Withdraw</button>
                  </>}
                </span>
              </li>
            ))}
          </ul>
        ) : !drafting && <p className="mt-3 font-body text-[13px] text-ink/55">No agreements yet. Start one, check the preview, then sign and send. The client signs in their portal.</p>}
        {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
        {note && <p role="status" className="mt-3 rounded-[12px] bg-[#E4EEDA] px-3 py-2 font-body text-[13px] text-forest">{note}</p>}
      </section>

      {drafting && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <section className="space-y-4 rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5 lg:sticky lg:top-[72px] lg:max-h-[calc(100dvh-90px)] lg:overflow-y-auto">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Product</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {PRODUCTS.map(p => (
                  <button key={p} type="button" onClick={() => pickProduct(p)} aria-pressed={deal.product === p}
                    className={`rounded-[10px] border px-2.5 py-2 text-left font-body text-[13px] ${deal.product === p ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] hover:border-forest/50'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="grid gap-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Client</p>
              <label className={label}>Legal business name<input className={input} value={deal.clientLegalName} onChange={e => set('clientLegalName', e.target.value)} placeholder="Acme Plumbing LLC" /></label>
              <label className={label}>Entity (optional)<input className={input} value={deal.clientEntity} onChange={e => set('clientEntity', e.target.value)} placeholder="a Utah limited liability company" /></label>
              <label className={label}>Business address<input className={input} value={deal.clientAddress} onChange={e => set('clientAddress', e.target.value)} /></label>
              <div className="grid grid-cols-2 gap-2">
                <label className={label}>Signer<input className={input} value={deal.signerName} onChange={e => set('signerName', e.target.value)} /></label>
                <label className={label}>Signer title<input className={input} value={deal.signerTitle} onChange={e => set('signerTitle', e.target.value)} /></label>
              </div>
              <label className={label}>Signer email<input className={input} value={deal.signerEmail} onChange={e => set('signerEmail', e.target.value)} /></label>
            </div>

            <div className="grid gap-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Terms</p>
              <div className="grid grid-cols-2 gap-2">
                <label className={label}>Effective date<input type="date" className={input} value={deal.effectiveDate} onChange={e => set('effectiveDate', e.target.value)} /></label>
                <label className={label}>Start date<input type="date" className={input} value={deal.startDate} onChange={e => set('startDate', e.target.value)} /></label>
              </div>
              {retainer && (
                <div className="grid grid-cols-2 gap-1 rounded-[10px] border border-ink/[0.12] p-0.5" role="group" aria-label="Billing">
                  {(['monthly', 'annual'] as const).map(b => (
                    <button key={b} type="button" onClick={() => setBilling(b)} aria-pressed={deal.billing === b} className={`rounded-[8px] py-1.5 font-body text-[13px] capitalize ${deal.billing === b ? 'bg-forest text-mist' : ''}`}>{b}</button>
                  ))}
                </div>
              )}
              {deal.product === 'Add-on services' ? (
                <div className="space-y-1.5">
                  {ADD_ONS.map(a => {
                    const qty = deal.addOns.find(x => x.name === a.name)?.qty ?? 0
                    return (
                      <label key={a.name} className="flex items-center gap-2 font-body text-[13px]">
                        <input type="number" min={0} max={50} value={qty} onChange={e => setQty(a.name, Number(e.target.value))} className="w-14 rounded-[8px] border border-ink/[0.14] px-2 py-1 text-[13px]" aria-label={`${a.name} quantity`} />
                        <span className="min-w-0 flex-1 truncate">{a.name}</span>
                        <span className="tabular-nums text-ink/55">${a.fee.toLocaleString()}</span>
                      </label>
                    )
                  })}
                  <p className="font-body text-[13px] font-medium">Total ${deal.fee.toLocaleString()}</p>
                </div>
              ) : (
                <label className={label}>{retainer ? 'Fee per month (USD)' : 'Fee (USD)'}
                  <input type="number" min={0} step="1" className={input} value={deal.fee || ''} onChange={e => set('fee', Number(e.target.value))} />
                  {retainer && LIST_PRICE[deal.product][deal.billing === 'annual' ? 'annual' : 'monthly'] !== deal.fee && <span className="mt-1 block text-[11px] text-[#7A4A12]">Custom price: the client is invoiced instead of sent to checkout.</span>}
                </label>
              )}
              {(deal.product === 'Wrought' || deal.product === 'Forged') && <label className={label}>Planned monthly ad budget (optional)<input className={input} value={deal.adBudget} onChange={e => set('adBudget', e.target.value)} placeholder="$3,000" /></label>}
              {deal.product === 'Custom project' && <>
                <label className={label}>Project name<input className={input} value={deal.projectTitle} onChange={e => set('projectTitle', e.target.value)} /></label>
                <label className={label}>Scope<textarea rows={4} className={input} value={deal.scope} onChange={e => set('scope', e.target.value)} placeholder="What we’re doing and why" /></label>
                <label className={label}>Deliverables (one per line)<textarea rows={4} className={input} value={deal.deliverables} onChange={e => set('deliverables', e.target.value)} /></label>
                <label className={label}>Schedule<textarea rows={2} className={input} value={deal.schedule} onChange={e => set('schedule', e.target.value)} placeholder="Milestones and dates" /></label>
                <label className={label}>Payment terms<textarea rows={2} className={input} value={deal.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} placeholder="50% on signing, 50% on delivery" /></label>
              </>}
              <label className={label}>Special terms (optional, one per line)<textarea rows={3} className={input} value={deal.specialTerms} onChange={e => set('specialTerms', e.target.value)} /></label>
            </div>

            <div className="grid gap-2.5 rounded-[14px] bg-bone p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Sign for Hewn Life</p>
              <div className="grid grid-cols-2 gap-2">
                <label className={label}>Your name<input className={input} value={signer.name} onChange={e => setSigner(s => ({ ...s, name: e.target.value }))} /></label>
                <label className={label}>Your title<input className={input} value={signer.title} onChange={e => setSigner(s => ({ ...s, title: e.target.value }))} /></label>
              </div>
              <label className="flex items-start gap-2 font-body text-[12px] leading-snug text-ink/70">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E3826]" />
                <span>I’m authorized to sign for Hewn Holdings LLC and sign this agreement electronically, as shown in the preview.</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button onClick={send} disabled={busy === 'send' || !agree || !signer.name.trim()} className="rounded-full bg-forest px-4 py-2 font-body text-[13px] text-mist disabled:opacity-40">{busy === 'send' ? 'Sending…' : 'Sign and send to client'}</button>
                <button onClick={() => setDrafting(false)} className="rounded-full px-3 py-2 font-body text-[13px] text-ink/60">Cancel</button>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-7">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Preview · exactly what the client signs</p>
            <AgreementDoc doc={doc} />
          </section>
        </div>
      )}
    </div>
  )
}
