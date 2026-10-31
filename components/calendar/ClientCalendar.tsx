'use client'
import { useState } from 'react'
import PortalHeader from '@/components/portal/PortalHeader'
import { AgendaList, MonthGrid, PlatformBadge, PostPreview, StatusTag, WeekGrid, addDays, longDate, startOfWeek } from './shared'
import type { Platform } from '@/lib/portal/platforms'
import type { Post } from '@/lib/portal/posts'
import type { MediaItem } from '@/lib/portal/media'

/** The client's content calendar: what's planned, what needs their approval, what's gone out. */
export default function ClientCalendar({ email, company, posts: initial, media, preview, assetsToReview }: {
  email: string; company: string; posts: Post[]; media: MediaItem[]; preview?: boolean; assetsToReview: number
}) {
  const [posts, setPosts] = useState(initial)
  const [view, setView] = useState<'month' | 'week'>('month')
  const [cursor, setCursor] = useState(() => new Date())
  const [openId, setOpenId] = useState<string | null>(null)
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const waiting = posts.filter(p => p.status === 'Client review')
  const open = posts.find(p => p.id === openId) ?? null
  const openMedia = open ? media.filter(m => open.assetIds.includes(m.id)) : []
  const step = (n: number) => setCursor(c => view === 'month' ? new Date(c.getFullYear(), c.getMonth() + n, 1) : addDays(c, 7 * n))
  const heading = view === 'month' ? cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : `${startOfWeek(cursor).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${addDays(startOfWeek(cursor), 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  async function review(decision: 'approve' | 'changes') {
    if (!open) return
    if (preview) { setMsg({ ok: false, text: 'Preview only: nothing is saved.' }); return }
    setBusy(decision); setMsg(null)
    const res = await fetch('/api/portal/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: open.id, decision, comment }) })
    const out = await res.json().catch(() => ({}))
    setBusy('')
    if (!res.ok) { setMsg({ ok: false, text: out.error || 'Couldn’t save. Try again.' }); return }
    setPosts(ps => ps.map(p => (p.id === open.id ? out.post : p))); setComment('')
    setMsg({ ok: true, text: decision === 'approve' ? 'Approved. We’ll post it on schedule.' : 'Got it. We’ll revise it and send it back.' })
  }

  const pick = (p: Post) => { setOpenId(p.id); setPlatform(p.platforms[0] ?? null); setMsg(null); setComment('') }

  return (
    <div className="flex h-[100dvh] flex-col bg-bone text-ink">
      <PortalHeader wide email={email} active="calendar" postsToReview={waiting.length} toReview={assetsToReview} />
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/[0.08] bg-white px-3 py-2 sm:px-5">
        <div className="flex items-center gap-1">
          <button onClick={() => step(-1)} aria-label="Previous" className="rounded-[8px] px-2 py-1 text-ink/60 hover:bg-bone">‹</button>
          <button onClick={() => setCursor(new Date())} className="rounded-[8px] border border-ink/[0.12] px-2.5 py-1 font-body text-[12px]">Today</button>
          <button onClick={() => step(1)} aria-label="Next" className="rounded-[8px] px-2 py-1 text-ink/60 hover:bg-bone">›</button>
        </div>
        <h1 className="font-display text-[17px] font-semibold">{heading}</h1>
        <div className="ml-auto flex items-center gap-2">
          {waiting.length > 0 && <button onClick={() => pick(waiting[0])} className="rounded-[10px] bg-lime px-3 py-1.5 font-body text-[13px] font-medium text-forest">{waiting.length} need{waiting.length === 1 ? 's' : ''} your review</button>}
          <div className="flex rounded-[10px] border border-ink/[0.12] p-0.5" role="group" aria-label="View">
            {(['month', 'week'] as const).map(v => <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`rounded-[8px] px-2.5 py-1 font-body text-[12px] capitalize ${view === v ? 'bg-forest text-mist' : 'text-ink/60'}`}>{v}</button>)}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-auto bg-white">
          <div className="md:hidden">
            <AgendaList from={view === 'month' ? new Date(cursor.getFullYear(), cursor.getMonth(), 1) : startOfWeek(cursor)} to={view === 'month' ? new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) : addDays(startOfWeek(cursor), 7)} posts={posts} onPick={pick} client />
          </div>
          <div className="hidden h-full min-w-[720px] md:block">
            {view === 'month' ? <MonthGrid cursor={cursor} posts={posts} onPick={pick} client /> : <WeekGrid cursor={cursor} posts={posts} onPick={pick} client />}
          </div>
        </main>
        {open && (
          <aside aria-label={open.title} className="fixed inset-0 z-40 flex flex-col bg-white md:static md:w-[400px] md:shrink-0 md:border-l md:border-ink/[0.08]">
            <div className="flex items-start gap-2 border-b border-ink/[0.08] px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">{open.format} · {open.scheduledAt ? longDate(open.scheduledAt) : 'Date to be set'}</p>
                <h2 className="font-display text-[17px] font-semibold leading-snug">{open.title}</h2>
                <div className="mt-1"><StatusTag status={open.status} client /></div>
              </div>
              <button onClick={() => setOpenId(null)} aria-label="Close" className="text-[22px] leading-none text-ink/45 hover:text-ink">×</button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <div className="flex flex-wrap gap-1.5">
                {open.platforms.map(p => <button key={p} onClick={() => setPlatform(p)} aria-pressed={platform === p} className={`flex items-center gap-1 rounded-full border px-2 py-1 font-body text-[12px] ${platform === p ? 'border-forest bg-[#EEF4E6]' : 'border-ink/[0.12]'}`}><PlatformBadge p={p} size={14} /> {p}</button>)}
              </div>
              {platform && <PostPreview post={open} platform={platform} media={openMedia} account={company || 'Your business'} />}
              {open.publishedLinks && <div className="font-body text-[13px]"><p className="font-medium">Posted</p>{open.publishedLinks.split('\n').filter(Boolean).map((l, i) => { const [label, url] = l.includes('|') ? l.split('|').map(s => s.trim()) : ['', l.trim()]; return <p key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-forest underline underline-offset-2">{label || url}</a></p> })}</div>}
              {open.feedback && <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">History</p><ul className="mt-1 space-y-0.5 font-body text-[12px] text-ink/65">{open.feedback.split('\n').map((l, i) => <li key={i}>{l}</li>)}</ul></div>}
            </div>
            {(open.status === 'Client review' || msg) && (
              <div className="space-y-2 border-t border-ink/[0.08] p-3 font-body text-[13px]">
                {msg && <p role="status" className={`rounded-[10px] px-3 py-2 ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}
                {open.status === 'Client review' && (
                  <>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Comments (needed if you want changes)"
                      className="w-full rounded-[10px] border border-ink/[0.12] px-3 py-2 focus:border-forest focus:outline-none" />
                    <div className="flex gap-2">
                      <button onClick={() => review('approve')} disabled={!!busy} className="flex-1 rounded-[10px] bg-forest px-3 py-2 font-medium text-mist disabled:opacity-50">{busy === 'approve' ? 'Saving…' : 'Approve'}</button>
                      <button onClick={() => review('changes')} disabled={!!busy} className="flex-1 rounded-[10px] border border-forest px-3 py-2 font-medium text-forest disabled:opacity-50">{busy === 'changes' ? 'Sending…' : 'Request changes'}</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
