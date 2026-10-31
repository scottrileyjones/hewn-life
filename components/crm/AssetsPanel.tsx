'use client'
import { useEffect, useMemo, useState } from 'react'
import AssetBrowser from '@/components/portal/AssetBrowser'
import type { Asset, AssetStatus } from '@/lib/portal/assets'
import type { PortalClient } from '@/lib/portal/data'
import { onboardingAssets } from '@/lib/portal/library'

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

/** The team's view of a client's asset library: the same browser the client sees, plus send, approve, live and archive. */
export default function AssetsPanel({ client, sample }: { client: PortalClient; sample?: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(sample ?? [])
  const [loading, setLoading] = useState(!sample)
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

  async function add(fd: FormData) {
    if (sample) return 'Preview only: nothing is saved.'
    fd.set('email', client.email)
    const res = await fetch('/api/crm/assets', { method: 'POST', body: fd })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) return out.error || 'Couldn’t save.'
    setAssets(as => [out.asset, ...as])
    setMsg({ ok: true, text: out.asset.status === 'In review' ? (out.alerted ? 'Sent to the client for review. They got an email.' : 'Saved for review, but the email failed.') : 'Saved as a draft. Only you can see it.' })
    return null
  }

  async function setStatus(a: Asset, status: AssetStatus, extra: { liveLink?: string } = {}) {
    if (sample) { setMsg({ ok: false, text: 'Preview only: nothing is saved.' }); return }
    setBusy(status); setMsg(null)
    try {
      const r = await call<{ asset: Asset; alerted: boolean }>({ action: 'status', id: a.id, status, comment, ...extra })
      setAssets(as => as.map(x => (x.id === a.id ? r.asset : x))); setComment('')
      setMsg({ ok: true, text: status === 'In review' || status === 'Live' ? (r.alerted ? `${status === 'Live' ? 'Marked live' : 'Sent for review'}. The client got an email.` : 'Saved, but the email failed.') : `Marked ${status.toLowerCase()}.` })
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  async function remove(a: Asset) {
    if (sample || !confirm(`Delete “${a.title}” for good?`)) return
    setBusy('delete')
    try { await call({ action: 'delete', id: a.id }); setAssets(as => as.filter(x => x.id !== a.id)) }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  const btn = 'rounded-[10px] px-3 py-1.5 font-body text-[13px] disabled:opacity-50'
  return (
    <div className="flex h-[calc(100dvh-170px)] min-h-[520px] flex-col">
      {loading && <p className="mb-2 font-body text-[13px] text-ink/55">Loading assets…</p>}
      <AssetBrowser assets={all} mode="team" reviewLabel="With client" onUpload={add}
        actions={a => {
          if (a.id.startsWith('onb-')) return <p className="font-body text-[12px] text-ink/50">Sent during onboarding. Re-upload it into a section to review or reuse it.</p>
          return (
            <div className="space-y-2 rounded-[14px] bg-bone p-3 font-body text-[13px]">
              {msg && <p role="status" className={`rounded-[10px] px-3 py-2 ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Note for the history (optional)" className="w-full rounded-[10px] border border-ink/[0.12] bg-white px-3 py-1.5" />
              {a.source === 'Hewn' && ['Draft', 'Changes requested', 'Approved', 'Received'].includes(a.status) && (
                <button onClick={() => setStatus(a, 'In review')} disabled={!!busy} className={`${btn} w-full bg-forest text-mist`}>{a.status === 'Changes requested' ? 'Send revised version for review' : 'Send to client for review'}</button>
              )}
              <div className="flex flex-wrap gap-2">
                {!['Approved', 'Live'].includes(a.status) && <button onClick={() => setStatus(a, 'Approved')} disabled={!!busy} className={`${btn} border border-forest text-forest`}>Mark approved</button>}
                {a.status !== 'Archived'
                  ? <button onClick={() => setStatus(a, 'Archived')} disabled={!!busy} className={`${btn} text-ink/55 underline underline-offset-2`}>Archive</button>
                  : <button onClick={() => setStatus(a, a.source === 'Hewn' ? 'Draft' : 'Received')} disabled={!!busy} className={`${btn} text-forest underline underline-offset-2`}>Restore</button>}
                <button onClick={() => remove(a)} disabled={!!busy} className={`${btn} text-[#7A2E1E] underline underline-offset-2`}>Delete</button>
              </div>
              {['Approved', 'Live'].includes(a.status) && (
                <div className="flex gap-2 border-t border-ink/[0.08] pt-2">
                  <input value={liveLink || a.liveLink} onChange={e => setLiveLink(e.target.value)} placeholder="Where it's live: https://" className="min-w-0 flex-1 rounded-[10px] border border-ink/[0.12] bg-white px-3 py-1.5" />
                  <button onClick={() => setStatus(a, 'Live', { liveLink: liveLink || a.liveLink })} disabled={!!busy} className={`${btn} bg-forest text-mist`}>{a.status === 'Live' ? 'Update' : 'Mark live'}</button>
                </div>
              )}
              <p className="text-[11px] text-ink/50">Drafts and archived items are hidden from the client. Sending for review and marking live email them.</p>
            </div>
          )
        }} />
    </div>
  )
}
