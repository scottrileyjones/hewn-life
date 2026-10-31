'use client'
import { useEffect, useMemo, useState } from 'react'
import { AssetBody, StatusPill, Thumb, UploadForm } from '@/components/portal/AssetBits'
import { CATEGORIES, type Asset, type AssetStatus } from '@/lib/portal/assets'
import type { PortalClient } from '@/lib/portal/data'
import { onboardingAssets } from '@/lib/portal/library'

const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

const FILTERS = ['Open', 'With client', 'Changes requested', 'Approved', 'Live', 'From client', 'All'] as const
type Filter = typeof FILTERS[number]
const match = (a: Asset, f: Filter) =>
  f === 'All' ? a.status !== 'Archived'
    : f === 'Open' ? ['Draft', 'Received', 'Changes requested', 'Approved'].includes(a.status)
    : f === 'With client' ? a.status === 'In review'
    : f === 'From client' ? a.source === 'Client' && a.status !== 'Archived'
    : a.status === f

/** The team's view of a client's asset library: add, send for review, mark live, archive. */
export default function AssetsPanel({ client, sample }: { client: PortalClient; sample?: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(sample ?? [])
  const [loading, setLoading] = useState(!sample)
  const [filter, setFilter] = useState<Filter>('Open')
  const [section, setSection] = useState('All')
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [liveLink, setLiveLink] = useState('')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    if (sample) return
    setLoading(true)
    call<{ assets: Asset[] }>({ action: 'list', email: client.email })
      .then(r => setAssets(r.assets)).catch(e => setMsg({ ok: false, text: e.message })).finally(() => setLoading(false))
  }, [client.email, sample])

  const all = useMemo(() => [...assets, ...onboardingAssets(client)], [assets, client])
  const shown = all.filter(a => match(a, filter) && (section === 'All' || a.category === section))
  const open = all.find(a => a.id === openId) ?? null
  const counts = Object.fromEntries(FILTERS.map(f => [f, all.filter(a => match(a, f)).length]))

  async function add(fd: FormData) {
    if (sample) return 'Preview only: nothing is saved.'
    fd.set('email', client.email)
    const res = await fetch('/api/crm/assets', { method: 'POST', body: fd })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) return out.error || 'Couldn’t save.'
    setAssets(as => [out.asset, ...as]); setAdding(false)
    setMsg({ ok: true, text: out.asset.status === 'In review' ? (out.alerted ? 'Sent to the client for review. They got an email.' : 'Saved for review, but the email failed.') : 'Saved as a draft. Only you can see it.' })
    return null
  }

  async function setStatus(a: Asset, status: AssetStatus, extra: { liveLink?: string } = {}) {
    if (sample) { setMsg({ ok: false, text: 'Preview only: nothing is saved.' }); return }
    setBusy(status); setMsg(null)
    try {
      const r = await call<{ asset: Asset; alerted: boolean }>({ action: 'status', id: a.id, status, comment, ...extra })
      setAssets(as => as.map(x => (x.id === a.id ? r.asset : x))); setComment(''); setLiveLink('')
      setMsg({ ok: true, text: status === 'In review' || status === 'Live' ? (r.alerted ? `${status === 'Live' ? 'Marked live' : 'Sent for review'}. The client got an email.` : 'Saved, but the email failed.') : `Marked ${status.toLowerCase()}.` })
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  async function remove(a: Asset) {
    if (sample || !confirm(`Delete “${a.title}” for good?`)) return
    setBusy('delete')
    try { await call({ action: 'delete', id: a.id }); setAssets(as => as.filter(x => x.id !== a.id)); setOpenId(null) }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  const readOnly = open?.id.startsWith('onb-')

  return (
    <section className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5 xl:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Assets</p>
          <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em]">{loading ? 'Loading…' : `${counts.All} in the library`}{counts['With client'] ? ` · ${counts['With client']} with the client` : ''}</h2>
        </div>
        {!adding && <button onClick={() => { setAdding(true); setMsg(null) }} className="rounded-full bg-forest px-4 py-2 font-body text-[13px] text-mist">+ Add asset</button>}
      </div>
      {msg && <p role="status" className={`mt-3 rounded-[12px] px-3 py-2 font-body text-[13px] ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}
      {adding && <div className="mt-3"><UploadForm team defaultCategory={section === 'All' ? undefined : section} onSubmit={add} onCancel={() => setAdding(false)} /></div>}

      <div className="mt-4 flex flex-wrap gap-1.5 font-body text-[12px]">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`rounded-full border px-2.5 py-1 ${filter === f ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] text-ink/70'}`}>{f} {counts[f] || ''}</button>
        ))}
        <select value={section} onChange={e => setSection(e.target.value)} className="ml-auto rounded-full border border-ink/[0.12] bg-white px-2.5 py-1" aria-label="Section">
          <option>All</option>{CATEGORIES.map(c => <option key={c.id}>{c.id}</option>)}
        </select>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.1fr]">
        <ul className="divide-y divide-ink/[0.06] rounded-[14px] border border-ink/[0.06]">
          {shown.map(a => (
            <li key={a.id}>
              <button onClick={() => { setOpenId(a.id); setComment(''); setLiveLink(a.liveLink) }} className={`flex w-full items-center gap-3 px-3 py-2 text-left ${openId === a.id ? 'bg-bone' : 'hover:bg-bone/60'}`}>
                <Thumb a={a} small />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-body text-[14px] font-medium">{a.title}</span>
                  <span className="block truncate font-body text-[12px] text-ink/55">{a.category} · {a.source === 'Hewn' ? 'Hewn' : 'Client'} · {day(a.updatedAt)}</span>
                </span>
                <StatusPill status={a.status} team />
              </button>
            </li>
          ))}
          {!shown.length && <li className="px-3 py-4 font-body text-[13px] text-ink/55">{loading ? 'Loading…' : 'Nothing here.'}</li>}
        </ul>

        {open ? (
          <div className="rounded-[14px] border border-ink/[0.06] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{open.category} · {open.source === 'Hewn' ? `Hewn${open.addedBy ? ` (${open.addedBy.split('@')[0]})` : ''}` : 'From the client'}</p>
                <h3 className="font-display text-[18px] font-semibold">{open.title}</h3>
              </div>
              <StatusPill status={open.status} team />
            </div>
            {open.files.some(f => f.type.startsWith('image/')) && <div className="mt-3"><Thumb a={open} tall /></div>}
            <div className="mt-3"><AssetBody a={open} /></div>
            {!readOnly && (
              <div className="mt-4 space-y-2 rounded-[12px] bg-bone p-3 font-body text-[13px]">
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Note for the history (optional)" className="w-full rounded-[10px] border border-ink/[0.12] bg-white px-3 py-1.5" />
                <div className="flex flex-wrap gap-2">
                  {open.source === 'Hewn' && ['Draft', 'Changes requested', 'Approved'].includes(open.status) && (
                    <button onClick={() => setStatus(open, 'In review')} disabled={!!busy} className="rounded-full bg-forest px-3 py-1.5 text-mist disabled:opacity-50">{open.status === 'Changes requested' ? 'Send revised version for review' : 'Send to client for review'}</button>
                  )}
                  {open.status !== 'Approved' && open.status !== 'Live' && <button onClick={() => setStatus(open, 'Approved')} disabled={!!busy} className="rounded-full border border-forest px-3 py-1.5 text-forest disabled:opacity-50">Mark approved</button>}
                  {open.status !== 'Archived' && <button onClick={() => setStatus(open, 'Archived')} disabled={!!busy} className="rounded-full px-2 py-1.5 text-ink/55 underline underline-offset-2 disabled:opacity-50">Archive</button>}
                  {open.status === 'Archived' && <button onClick={() => setStatus(open, 'Received')} disabled={!!busy} className="rounded-full px-2 py-1.5 text-forest underline underline-offset-2">Restore</button>}
                  <button onClick={() => remove(open)} disabled={!!busy} className="rounded-full px-2 py-1.5 text-[#7A2E1E] underline underline-offset-2 disabled:opacity-50">Delete</button>
                </div>
                {['Approved', 'Live'].includes(open.status) && (
                  <div className="flex flex-wrap gap-2 border-t border-ink/[0.08] pt-2">
                    <input value={liveLink} onChange={e => setLiveLink(e.target.value)} placeholder="Where it's live: https://" className="min-w-0 flex-1 rounded-[10px] border border-ink/[0.12] bg-white px-3 py-1.5" />
                    <button onClick={() => setStatus(open, 'Live', { liveLink })} disabled={!!busy} className="rounded-full bg-forest px-3 py-1.5 text-mist disabled:opacity-50">{open.status === 'Live' ? 'Update live link' : 'Mark live'}</button>
                  </div>
                )}
                <p className="text-[12px] text-ink/50">Drafts and archived items are hidden from the client. Sending for review and marking live email them.</p>
              </div>
            )}
            {readOnly && <p className="mt-3 font-body text-[12px] text-ink/50">Sent during onboarding. Add it to a section with “+ Add asset” if you want to review or reuse it.</p>}
          </div>
        ) : (
          <div className="rounded-[14px] border border-dashed border-ink/[0.15] p-6 font-body text-[13px] text-ink/55">Pick an asset to review, send or mark live.</div>
        )}
      </div>
    </section>
  )
}
