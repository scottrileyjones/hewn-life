'use client'
import { useState } from 'react'
import PortalHeader from './PortalHeader'
import AssetBrowser from './AssetBrowser'
import type { Asset } from '@/lib/portal/assets'

/** The client's asset library, full screen like an app: sidebar of pillars, content, detail pane. */
export default function AssetLibrary({ email, assets: initial, preview }: { email: string; company: string; assets: Asset[]; preview?: boolean }) {
  const [assets, setAssets] = useState(initial)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function upload(fd: FormData) {
    if (preview) return 'Preview only: nothing is saved.'
    const res = await fetch('/api/portal/assets', { method: 'POST', body: fd })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) return out.error || 'Couldn’t upload. Try again.'
    setAssets(as => [out.asset, ...as])
    return null
  }

  async function review(a: Asset, decision: 'approve' | 'changes') {
    if (preview) { setMsg({ ok: false, text: 'Preview only: nothing is saved.' }); return }
    setBusy(decision); setMsg(null)
    const res = await fetch('/api/portal/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, decision, comment }) })
    const out = await res.json().catch(() => ({}))
    setBusy('')
    if (!res.ok) { setMsg({ ok: false, text: out.error || 'Couldn’t save. Try again.' }); return }
    setAssets(as => as.map(x => (x.id === a.id ? out.asset : x))); setComment('')
    setMsg({ ok: true, text: decision === 'approve' ? 'Approved. Thank you!' : 'Got it. We’ll make the changes and send it back.' })
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-bone text-ink">
      <PortalHeader wide email={email} active="assets" toReview={assets.filter(a => a.status === 'In review').length} />
      <main className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col px-2 pb-2 pt-2 sm:px-4 sm:pb-4">
        <AssetBrowser assets={assets} mode="client" reviewLabel="Needs your review" onUpload={upload}
          actions={a => (
            <>
              {msg && <p role="status" className={`rounded-[10px] px-3 py-2 font-body text-[13px] ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}
              {a.status === 'In review' && (
                <div className="rounded-[14px] bg-bone p-3">
                  <p className="font-body text-[13px] font-medium">Your review</p>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Comments (needed if you want changes)"
                    className="mt-2 w-full rounded-[10px] border border-ink/[0.12] bg-white px-3 py-2 font-body text-[13px] focus:border-forest focus:outline-none" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => review(a, 'approve')} disabled={!!busy} className="flex-1 rounded-[10px] bg-forest px-3 py-2 font-body text-[13px] font-medium text-mist disabled:opacity-50">{busy === 'approve' ? 'Saving…' : 'Approve'}</button>
                    <button onClick={() => review(a, 'changes')} disabled={!!busy} className="flex-1 rounded-[10px] border border-forest px-3 py-2 font-body text-[13px] font-medium text-forest disabled:opacity-50">{busy === 'changes' ? 'Sending…' : 'Request changes'}</button>
                  </div>
                </div>
              )}
            </>
          )} />
      </main>
    </div>
  )
}
