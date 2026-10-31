'use client'
import { useState } from 'react'
import { CATEGORIES, type Asset, type AssetStatus } from '@/lib/portal/assets'

export const STATUS_LABEL: Record<AssetStatus, string> = {
  Draft: 'Draft', Received: 'Received', 'In review': 'Needs your review', 'Changes requested': 'Changes requested', Approved: 'Approved', Live: 'Live', Archived: 'Archived',
}
const STATUS_STYLE: Record<AssetStatus, string> = {
  Draft: 'bg-sand text-ink/60', Received: 'bg-sand text-ink/70', 'In review': 'bg-lime text-forest', 'Changes requested': 'bg-[#F6E7D4] text-[#7A4A12]',
  Approved: 'bg-[#E4EEDA] text-forest', Live: 'bg-forest text-mist', Archived: 'bg-sand text-ink/40',
}

export function StatusPill({ status, team }: { status: AssetStatus; team?: boolean }) {
  const label = team && status === 'In review' ? 'With client' : STATUS_LABEL[status]
  return <span className={`inline-block rounded-full px-2 py-0.5 font-body text-[11px] font-medium ${STATUS_STYLE[status]}`}>{label}</span>
}

const ext = (name: string) => (name.split('.').pop() || '').toUpperCase().slice(0, 4)
export const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

/** The card's picture: first image, a file badge, the link host, or the start of the text. */
export function Thumb({ a, tall, small }: { a: Asset; tall?: boolean; small?: boolean }) {
  const img = a.files.find(f => f.type.startsWith('image/'))
  if (small) {
    const label = img ? '' : a.files[0] ? ext(a.files[0].name) || 'FILE' : a.link ? '↗' : 'Aa'
    return img
      ? <img src={img.thumb || img.url} alt="" className="h-11 w-11 shrink-0 rounded-[10px] bg-bone object-cover" loading="lazy" />
      : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-bone font-mono text-[11px] font-bold text-forest/70">{label}</span>
  }
  const h = tall ? 'h-56' : 'h-32'
  if (img) return <img src={img.thumb || img.url} alt="" className={`${h} w-full rounded-[14px] bg-bone object-contain`} loading="lazy" />
  if (a.files[0]) return <div className={`${h} flex w-full items-center justify-center rounded-[14px] bg-bone font-mono text-[18px] font-bold text-forest/70`}>{ext(a.files[0].name) || 'FILE'}</div>
  if (a.link) { let host = a.link; try { host = new URL(a.link).host } catch {} return <div className={`${h} flex w-full flex-col items-center justify-center gap-1 rounded-[14px] bg-bone px-3 text-center`}><span aria-hidden className="text-[22px]">↗</span><span className="truncate font-body text-[13px] text-forest">{host}</span></div> }
  return <div className={`${h} w-full overflow-hidden rounded-[14px] bg-bone p-3 font-body text-[12px] leading-snug text-ink/70`}>{a.text.slice(0, 260)}</div>
}

/** Everything in an asset: files to open, the link, the text (copyable), notes and review history. */
export function AssetBody({ a }: { a: Asset }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="space-y-3 font-body text-[14px]">
      {a.files.length > 0 && (
        <ul className="space-y-1.5">
          {a.files.map(f => (
            <li key={f.id || f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-2">📎 {f.name}</a> <span className="text-[12px] text-ink/45">{kb(f.size)}</span></li>
          ))}
        </ul>
      )}
      {a.link && <p><a href={a.link} target="_blank" rel="noopener noreferrer" className="break-all text-forest underline underline-offset-2">{a.link}</a></p>}
      {a.text && (
        <div className="relative rounded-[12px] bg-bone p-3">
          <p className="whitespace-pre-line pr-14 leading-relaxed">{a.text}</p>
          <button type="button" onClick={() => { navigator.clipboard.writeText(a.text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-[11px] text-forest">{copied ? 'Copied' : 'Copy'}</button>
        </div>
      )}
      {a.liveLink && <p className="text-[13px]">Live at <a href={a.liveLink} target="_blank" rel="noopener noreferrer" className="break-all text-forest underline underline-offset-2">{a.liveLink}</a></p>}
      {a.notes && <p className="whitespace-pre-line text-[13px] text-ink/70"><span className="font-medium text-ink">Notes:</span> {a.notes}</p>}
      {a.feedback && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">History</p>
          <ul className="mt-1 space-y-1 text-[12px] text-ink/65">{a.feedback.split('\n').map((l, i) => <li key={i}>{l}</li>)}</ul>
        </div>
      )}
    </div>
  )
}

/** Add an asset: a section, then files, a link or text (any mix). */
export function UploadForm({ defaultCategory, onSubmit, team, onCancel }: {
  defaultCategory?: string
  team?: boolean
  onSubmit: (fd: FormData) => Promise<string | null>
  onCancel: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [sending, setSending] = useState('')
  const [error, setError] = useState('')
  const [cat, setCat] = useState(defaultCategory || 'Photos')
  const input = 'w-full rounded-[12px] border border-ink/[0.12] bg-white px-3.5 py-2.5 font-body text-[14px] focus:border-forest focus:outline-none'

  async function submit(form: HTMLFormElement, review: boolean) {
    if (!form.reportValidity()) return
    const fd = new FormData(form)
    fd.delete('files')
    files.forEach(f => fd.append('files', f))
    if (review) fd.set('review', '1')
    setSending(review ? 'review' : 'save'); setError('')
    const err = await onSubmit(fd)
    setSending('')
    if (err) setError(err)
  }

  return (
    <form onSubmit={e => { e.preventDefault(); submit(e.currentTarget, false) }} className="space-y-3 rounded-[18px] border border-ink/[0.08] bg-white p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 font-body text-[13px] font-medium">Section
          <select name="category" value={cat} onChange={e => setCat(e.target.value)} className={input}>{CATEGORIES.map(c => <option key={c.id}>{c.id}</option>)}</select>
        </label>
        <label className="grid gap-1 font-body text-[13px] font-medium"><span>Name <span className="font-normal text-ink/45">(optional)</span></span>
          <input name="title" placeholder="e.g. Spring promo ad, Logo (white)" className={input} />
        </label>
      </div>
      <p className="font-body text-[12px] text-ink/55">{CATEGORIES.find(c => c.id === cat)?.hint}</p>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-ink/[0.15] bg-bone px-4 py-5 text-center hover:border-forest">
        <span className="font-body text-[14px] font-medium text-forest">Choose files</span>
        <span className="mt-1 font-body text-[12px] text-ink/55">Images, PDFs, docs or short videos, up to 4 MB each. Bigger files: paste a link below.</span>
        <input type="file" multiple className="sr-only" onChange={e => setFiles(Array.from(e.target.files ?? []))} />
      </label>
      {files.length > 0 && <ul className="space-y-1 font-body text-[13px] text-ink/70">{files.map(f => <li key={f.name}>📎 {f.name} ({kb(f.size)})</li>)}</ul>}
      <label className="grid gap-1 font-body text-[13px] font-medium"><span>Link <span className="font-normal text-ink/45">(Drive, Dropbox, Figma, a landing page…)</span></span>
        <input name="link" type="url" placeholder="https://" className={input} />
      </label>
      <label className="grid gap-1 font-body text-[13px] font-medium"><span>Text <span className="font-normal text-ink/45">(copy, keywords, ad text…)</span></span>
        <textarea name="text" rows={3} className={input} />
      </label>
      <label className="grid gap-1 font-body text-[13px] font-medium"><span>Notes <span className="font-normal text-ink/45">(optional)</span></span>
        <input name="notes" placeholder={team ? 'What to look for' : 'Anything we should know about it'} className={input} />
      </label>
      {error && <p role="alert" className="rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {team ? (
          <>
            <button type="button" disabled={!!sending} onClick={e => submit(e.currentTarget.form!, true)}
              className="rounded-full bg-forest px-5 py-2.5 font-body text-[14px] text-mist disabled:opacity-50">{sending === 'review' ? 'Sending…' : 'Send to client for review'}</button>
            <button type="button" disabled={!!sending} onClick={e => submit(e.currentTarget.form!, false)}
              className="rounded-full border border-forest px-5 py-2.5 font-body text-[14px] text-forest disabled:opacity-50">{sending === 'save' ? 'Saving…' : 'Save as draft'}</button>
          </>
        ) : (
          <button disabled={!!sending} className="rounded-full bg-forest px-5 py-2.5 font-body text-[14px] text-mist disabled:opacity-50">{sending ? 'Uploading…' : 'Add to my assets'}</button>
        )}
        <button type="button" onClick={onCancel} className="px-2 font-body text-[13px] text-ink/60">Cancel</button>
      </div>
    </form>
  )
}
