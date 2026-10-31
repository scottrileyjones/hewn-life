'use client'
import { useMemo, useState } from 'react'
import PortalHeader from './PortalHeader'
import { AssetBody, StatusPill, Thumb, UploadForm } from './AssetBits'
import { CATEGORIES, type Asset } from '@/lib/portal/assets'

const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** The client's asset library: what needs their review, every section, and uploads. */
export default function AssetLibrary({ email, company, assets: initial, preview }: { email: string; company: string; assets: Asset[]; preview?: boolean }) {
  const [assets, setAssets] = useState(initial)
  const [section, setSection] = useState<string>('All')
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  const toReview = assets.filter(a => a.status === 'In review')
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map(c => [c.id, assets.filter(a => a.category === c.id).length])), [assets])
  const shown = section === 'All' ? assets : assets.filter(a => a.category === section)
  const open = assets.find(a => a.id === openId) ?? null

  async function upload(fd: FormData) {
    if (preview) return 'Preview only: nothing is saved.'
    const res = await fetch('/api/portal/assets', { method: 'POST', body: fd })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) return out.error || 'Couldn’t upload. Try again.'
    setAssets(as => [out.asset, ...as]); setAdding(false); setNote('Added. We’ve been notified.')
    return null
  }

  async function review(a: Asset, decision: 'approve' | 'changes') {
    if (preview) { setError('Preview only: nothing is saved.'); return }
    setBusy(decision); setError('')
    const res = await fetch('/api/portal/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, decision, comment }) })
    const out = await res.json().catch(() => ({}))
    setBusy('')
    if (!res.ok) { setError(out.error || 'Couldn’t save. Try again.'); return }
    setAssets(as => as.map(x => (x.id === a.id ? out.asset : x))); setComment('')
    setNote(decision === 'approve' ? 'Approved. Thank you!' : 'Got it. We’ll make the changes and send it back.')
  }

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <PortalHeader email={email} active="assets" toReview={toReview.length} />
      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{company || 'Your account'}</p>
            <h1 className="mt-1 font-display text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">Your assets</h1>
            <p className="mt-1 max-w-xl font-body text-[15px] text-ink/65">Everything for your brand in one place: what you send us and what we make for you. Review and approve our work here.</p>
          </div>
          {!adding && <button onClick={() => { setAdding(true); setNote('') }} className="rounded-full bg-forest px-5 py-3 font-body text-[15px] font-medium text-mist">+ Add an asset</button>}
        </div>
        {note && <p role="status" className="mt-4 rounded-[14px] bg-[#E4EEDA] px-4 py-2.5 font-body text-sm text-forest">{note}</p>}
        {adding && <div className="mt-5"><UploadForm defaultCategory={section === 'All' ? undefined : section} onSubmit={upload} onCancel={() => setAdding(false)} /></div>}

        {toReview.length > 0 && (
          <section className="mt-6 rounded-[24px] border-2 border-lime bg-white p-5 sm:p-6" aria-label="Needs your review">
            <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em]">Needs your review <span className="ml-1 rounded-full bg-lime px-2 py-0.5 align-middle font-body text-[12px] text-forest">{toReview.length}</span></h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {toReview.map(a => (
                <li key={a.id}><button onClick={() => setOpenId(a.id)} className="w-full text-left"><Thumb a={a} /><p className="mt-2 font-body text-[15px] font-medium">{a.title}</p><p className="font-body text-[12px] text-ink/55">{a.category} · sent {day(a.updatedAt)}</p></button></li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-6 flex flex-wrap gap-1.5 font-body text-[13px]" aria-label="Sections">
          {['All', ...CATEGORIES.map(c => c.id)].map(id => (
            <button key={id} onClick={() => setSection(id)} aria-pressed={section === id}
              className={`rounded-full border px-3 py-1.5 ${section === id ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] bg-white text-ink/75 hover:text-ink'}`}>
              {id}{id === 'All' ? ` ${assets.length}` : counts[id] ? ` ${counts[id]}` : ''}
            </button>
          ))}
        </nav>
        {section !== 'All' && <p className="mt-2 font-body text-[13px] text-ink/55">{CATEGORIES.find(c => c.id === section)?.hint}</p>}

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map(a => (
            <li key={a.id}>
              <button onClick={() => setOpenId(a.id)} className="w-full rounded-[20px] border border-ink/[0.08] bg-white p-3 text-left hover:border-forest/40">
                <Thumb a={a} />
                <p className="mt-2 truncate font-body text-[14px] font-medium">{a.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <StatusPill status={a.status} />
                  <span className="font-body text-[12px] text-ink/55">{a.category} · {a.source === 'Hewn' ? 'Hewn Life' : 'You'} · {day(a.addedAt)}</span>
                </div>
              </button>
            </li>
          ))}
          {!shown.length && (
            <li className="rounded-[20px] border border-dashed border-ink/[0.15] p-6 font-body text-[14px] text-ink/55 sm:col-span-2 lg:col-span-4">
              Nothing here yet. <button onClick={() => setAdding(true)} className="text-forest underline underline-offset-2">Add {section === 'All' ? 'your first asset' : `to ${section}`}</button>
            </li>
          )}
        </ul>
      </main>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" onClick={() => setOpenId(null)}>
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[24px] bg-white p-5 sm:rounded-[24px] sm:p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{open.category} · {open.source === 'Hewn' ? 'From Hewn Life' : 'From you'}</p>
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{open.title}</h2>
              </div>
              <button onClick={() => setOpenId(null)} aria-label="Close" className="text-[22px] leading-none text-ink/50">×</button>
            </div>
            <div className="mt-2"><StatusPill status={open.status} /></div>
            {open.files.some(f => f.type.startsWith('image/')) && <div className="mt-4"><Thumb a={open} tall /></div>}
            <div className="mt-4"><AssetBody a={open} /></div>
            {open.status === 'In review' && (
              <div className="mt-5 rounded-[16px] bg-bone p-4">
                <p className="font-body text-[14px] font-medium">Your review</p>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Comments (needed if you want changes)"
                  className="mt-2 w-full rounded-[12px] border border-ink/[0.12] bg-white px-3 py-2 font-body text-[14px] focus:border-forest focus:outline-none" />
                {error && <p role="alert" className="mt-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => review(open, 'approve')} disabled={!!busy} className="rounded-full bg-forest px-5 py-2.5 font-body text-[14px] text-mist disabled:opacity-50">{busy === 'approve' ? 'Saving…' : 'Approve'}</button>
                  <button onClick={() => review(open, 'changes')} disabled={!!busy} className="rounded-full border border-forest px-5 py-2.5 font-body text-[14px] text-forest disabled:opacity-50">{busy === 'changes' ? 'Sending…' : 'Request changes'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
