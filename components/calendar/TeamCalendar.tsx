'use client'
import { useEffect, useMemo, useState } from 'react'
import CrmHeader from '@/components/crm/CrmHeader'
import { AgendaList, MonthGrid, PlatformBadge, PostPreview, StatusTag, WeekGrid, addDays, longDate, startOfWeek } from './shared'
import { FORMATS, PLATFORMS, RULES, checkPost, type Format, type Platform } from '@/lib/portal/platforms'
import type { Post, PostStatus } from '@/lib/portal/posts'
import type { MediaItem } from '@/lib/portal/media'

type ClientRef = { email: string; name: string; company: string }

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalInput = (iso: string) => { if (!iso) return { date: '', time: '09:00' }; const d = new Date(iso); return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` } }
const fromLocalInput = (date: string, time: string) => (date ? new Date(`${date}T${time || '09:00'}`).toISOString() : '')

type Draft = { id: string | null; email: string; title: string; caption: string; platforms: Platform[]; format: Format; date: string; time: string; assetIds: string[]; overrides: Partial<Record<Platform, string>>; notes: string; status: PostStatus; feedback: string; publishedLinks: string }
const blank = (email: string, date = ''): Draft => ({ id: null, email, title: '', caption: '', platforms: ['Instagram', 'Facebook'], format: 'Post', date, time: '09:00', assetIds: [], overrides: {}, notes: '', status: 'Draft', feedback: '', publishedLinks: '' })
const fromPost = (p: Post): Draft => ({ id: p.id, email: p.clientEmail, title: p.title, caption: p.caption, platforms: p.platforms, format: p.format, ...toLocalInput(p.scheduledAt), assetIds: p.assetIds, overrides: p.overrides, notes: p.notes, status: p.status, feedback: p.feedback, publishedLinks: p.publishedLinks })

/** HQ → Calendar: every client's posts on one calendar, with a composer for one-to-many posts. */
export default function TeamCalendar({ user, clients, posts: initial, selected, sampleMedia }: { user: string; clients: ClientRef[]; posts: Post[]; selected: string; sampleMedia?: Record<string, MediaItem[]> }) {
  const [posts, setPosts] = useState(initial)
  const [client, setClient] = useState(selected)
  const [view, setView] = useState<'month' | 'week'>('month')
  const [cursor, setCursor] = useState(() => new Date())
  const [status, setStatus] = useState('Active')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [media, setMedia] = useState<Record<string, MediaItem[]>>(sampleMedia ?? {})
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [previewOn, setPreviewOn] = useState<Platform>('Instagram')
  const [overrideOpen, setOverrideOpen] = useState<Platform | null>(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const sample = !!sampleMedia

  const byEmail = useMemo(() => Object.fromEntries(clients.map(c => [c.email, c])), [clients])
  const nameOf = (email: string) => byEmail[email]?.company || byEmail[email]?.name || email
  const visible = posts.filter(p => (!client || p.clientEmail === client) && (status === 'All' || (status === 'Active' ? p.status !== 'Archived' : p.status === status)))
  const unscheduled = visible.filter(p => !p.scheduledAt)
  const drafts = posts.filter(p => p.clientEmail === client && ['Idea', 'Draft', 'Changes requested'].includes(p.status))

  // Load a client's media the first time a post for them is opened.
  useEffect(() => {
    const e = draft?.email
    if (!e || media[e] || sample) return
    call<{ media: MediaItem[] }>({ action: 'media', email: e }).then(r => setMedia(m => ({ ...m, [e]: r.media }))).catch(() => setMedia(m => ({ ...m, [e]: [] })))
  }, [draft?.email, media, sample])

  const draftMedia = draft ? (media[draft.email] ?? []).filter(m => draft.assetIds.includes(m.id)) : []
  const issues = draft ? checkPost({ caption: draft.caption, overrides: draft.overrides, platforms: draft.platforms }, draftMedia.flatMap(m => m.files)) : []

  const step = (n: number) => setCursor(c => view === 'month' ? new Date(c.getFullYear(), c.getMonth() + n, 1) : addDays(c, 7 * n))
  const heading = view === 'month'
    ? cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : `${startOfWeek(cursor).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${addDays(startOfWeek(cursor), 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  function openNew(d?: Date) {
    const email = client || clients[0]?.email || ''
    const date = d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : ''
    setDraft(blank(email, date)); setTab('edit'); setMsg(null)
  }

  async function save(nextStatus?: PostStatus, extra: { publishedLinks?: string } = {}) {
    if (!draft) return
    if (sample) { setMsg({ ok: false, text: 'Preview only: nothing is saved.' }); return }
    setBusy(nextStatus || 'save'); setMsg(null)
    try {
      const body = { title: draft.title, caption: draft.caption, platforms: draft.platforms, format: draft.format, scheduledAt: fromLocalInput(draft.date, draft.time), assetIds: draft.assetIds, overrides: draft.overrides, notes: draft.notes }
      let { post } = await call<{ post: Post }>({ action: 'save', id: draft.id, email: draft.email, post: body })
      let alerted = false
      if (nextStatus && nextStatus !== post.status) {
        const r = await call<{ post: Post; alerted: boolean }>({ action: 'status', id: post.id, status: nextStatus, ...extra })
        post = r.post; alerted = r.alerted
      }
      setPosts(ps => [...ps.filter(p => p.id !== post.id), post])
      setDraft(fromPost(post))
      setMsg({ ok: true, text: nextStatus === 'Client review' ? (alerted ? 'Sent to the client for review. They got an email.' : 'Sent for review, but the email failed.') : nextStatus ? `Marked ${nextStatus.toLowerCase()}.` : 'Saved.' })
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  async function sendAll() {
    if (sample || !client || !drafts.length) return
    if (!confirm(`Send ${drafts.length} post${drafts.length > 1 ? 's' : ''} to ${nameOf(client)} for review? They get one email.`)) return
    setBusy('batch')
    try {
      const r = await call<{ posts: Post[]; alerted: boolean }>({ action: 'review', email: client, ids: drafts.map(p => p.id) })
      setPosts(ps => ps.map(p => r.posts.find(x => x.id === p.id) ?? p))
      setMsg({ ok: true, text: `${r.posts.length} sent for review.${r.alerted ? ' The client got one email.' : ''}` })
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  async function remove() {
    if (!draft?.id || sample || !confirm('Delete this post for good?')) return
    setBusy('delete')
    try { await call({ action: 'delete', id: draft.id }); setPosts(ps => ps.filter(p => p.id !== draft.id)); setDraft(null) }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  const set = (patch: Partial<Draft>) => setDraft(d => (d ? { ...d, ...patch } : d))
  const input = 'w-full rounded-[10px] border border-ink/[0.12] bg-white px-3 py-2 font-body text-[13px] focus:border-forest focus:outline-none'

  return (
    <div className="flex h-[100dvh] flex-col bg-bone text-ink">
      <CrmHeader active="calendar" user={user} />
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/[0.08] bg-white px-4 py-2 sm:px-6">
        <select value={client} onChange={e => setClient(e.target.value)} aria-label="Client" className="rounded-[10px] border border-ink/[0.12] bg-white px-2.5 py-1.5 font-body text-[13px]">
          <option value="">All clients</option>
          {clients.map(c => <option key={c.email} value={c.email}>{c.company || c.name || c.email}</option>)}
        </select>
        <div className="flex items-center gap-1">
          <button onClick={() => step(-1)} aria-label="Previous" className="rounded-[8px] px-2 py-1 text-ink/60 hover:bg-bone">‹</button>
          <button onClick={() => setCursor(new Date())} className="rounded-[8px] border border-ink/[0.12] px-2.5 py-1 font-body text-[12px]">Today</button>
          <button onClick={() => step(1)} aria-label="Next" className="rounded-[8px] px-2 py-1 text-ink/60 hover:bg-bone">›</button>
        </div>
        <h1 className="font-display text-[17px] font-semibold">{heading}</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {client && drafts.length > 0 && <button onClick={sendAll} disabled={!!busy} className="rounded-[10px] border border-forest px-3 py-1.5 font-body text-[13px] text-forest disabled:opacity-50">Send {drafts.length} draft{drafts.length > 1 ? 's' : ''} for review</button>}
          <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Status" className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1.5 font-body text-[13px]">
            {['Active', 'All', 'Idea', 'Draft', 'Client review', 'Changes requested', 'Approved', 'Scheduled', 'Published', 'Archived'].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex rounded-[10px] border border-ink/[0.12] p-0.5" role="group" aria-label="View">
            {(['month', 'week'] as const).map(v => <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`rounded-[8px] px-2.5 py-1 font-body text-[12px] capitalize ${view === v ? 'bg-forest text-mist' : 'text-ink/60'}`}>{v}</button>)}
          </div>
          <button onClick={() => openNew()} disabled={!clients.length} className="rounded-[10px] bg-forest px-3 py-1.5 font-body text-[13px] font-medium text-mist disabled:opacity-40">+ New post</button>
        </div>
      </div>
      {msg && !draft && <p role="status" className={`mx-4 mt-2 rounded-[10px] px-3 py-2 font-body text-[13px] sm:mx-6 ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-auto bg-white">
          <div className="md:hidden">
            <AgendaList from={view === 'month' ? new Date(cursor.getFullYear(), cursor.getMonth(), 1) : startOfWeek(cursor)} to={view === 'month' ? new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) : addDays(startOfWeek(cursor), 7)} posts={visible} onPick={p => { setDraft(fromPost(p)); setTab('edit'); setMsg(null) }} label={client ? undefined : p => nameOf(p.clientEmail)} />
          </div>
          <div className="hidden h-full min-w-[720px] md:block">
            {view === 'month'
              ? <MonthGrid cursor={cursor} posts={visible} onPick={p => { setDraft(fromPost(p)); setTab('edit'); setMsg(null) }} onDay={openNew} label={client ? undefined : p => nameOf(p.clientEmail)} />
              : <WeekGrid cursor={cursor} posts={visible} onPick={p => { setDraft(fromPost(p)); setTab('edit'); setMsg(null) }} onDay={openNew} label={client ? undefined : p => nameOf(p.clientEmail)} />}
          </div>
        </main>

        {!draft && (
          <aside className="hidden w-[260px] shrink-0 overflow-y-auto border-l border-ink/[0.08] bg-[#FBFAF7] p-3 xl:block" aria-label="Unscheduled">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">Unscheduled · {unscheduled.length}</p>
            <ul className="mt-2 space-y-1.5">
              {unscheduled.map(p => (
                <li key={p.id}>
                  <button onClick={() => { setDraft(fromPost(p)); setTab('edit') }} className="w-full rounded-[10px] border border-ink/[0.08] bg-white p-2 text-left hover:border-forest/40">
                    <p className="truncate font-body text-[13px] font-medium">{p.title}</p>
                    {!client && <p className="truncate font-body text-[11px] text-ink/50">{nameOf(p.clientEmail)}</p>}
                    <div className="mt-1 flex items-center gap-1"><StatusTag status={p.status} />{p.platforms.slice(0, 4).map(pl => <PlatformBadge key={pl} p={pl} size={14} />)}</div>
                  </button>
                </li>
              ))}
              {!unscheduled.length && <li className="font-body text-[12px] text-ink/50">Ideas and drafts without a date show here.</li>}
            </ul>
          </aside>
        )}

        {draft && (
          <aside aria-label="Post" className="fixed inset-0 z-40 flex flex-col bg-white md:static md:w-[440px] md:shrink-0 md:border-l md:border-ink/[0.08]">
            <div className="flex items-center gap-2 border-b border-ink/[0.08] px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">{draft.id ? nameOf(draft.email) : 'New post'}</p>
                <div className="mt-0.5"><StatusTag status={draft.status} /></div>
              </div>
              <div className="flex rounded-[10px] border border-ink/[0.12] p-0.5 font-body text-[12px]">
                {(['edit', 'preview'] as const).map(t => <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`rounded-[8px] px-2.5 py-1 capitalize ${tab === t ? 'bg-forest text-mist' : 'text-ink/60'}`}>{t}</button>)}
              </div>
              <button onClick={() => setDraft(null)} aria-label="Close" className="text-[22px] leading-none text-ink/45 hover:text-ink">×</button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 font-body text-[13px]">
              {tab === 'edit' ? (
                <>
                  {!draft.id && (
                    <label className="grid gap-1 text-ink/60">Client
                      <select className={input} value={draft.email} onChange={e => set({ email: e.target.value, assetIds: [] })}>{clients.map(c => <option key={c.email} value={c.email}>{c.company || c.name || c.email}</option>)}</select>
                    </label>
                  )}
                  <label className="grid gap-1 text-ink/60">Title (internal)<input className={input} value={draft.title} onChange={e => set({ title: e.target.value })} placeholder="e.g. Water heater myths carousel" /></label>
                  <div>
                    <p className="mb-1 text-ink/60">Platforms</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PLATFORMS.map(p => {
                        const on = draft.platforms.includes(p)
                        return (
                          <button key={p} type="button" onClick={() => set({ platforms: on ? draft.platforms.filter(x => x !== p) : [...draft.platforms, p] })} aria-pressed={on}
                            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[12px] ${on ? 'border-forest bg-[#EEF4E6]' : 'border-ink/[0.12] text-ink/55'}`}>
                            <PlatformBadge p={p} size={14} dim={!on} /> {p}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <label className="grid gap-1 text-ink/60">Caption
                    <textarea rows={6} className={input} value={draft.caption} onChange={e => set({ caption: e.target.value })} placeholder="One caption for every platform. Tailor any platform below." />
                  </label>
                  {draft.platforms.length > 0 && (
                    <ul className="divide-y divide-ink/[0.06] rounded-[10px] border border-ink/[0.08]">
                      {draft.platforms.map(p => {
                        const text = draft.overrides[p] ?? draft.caption
                        const over = text.length > RULES[p].maxChars
                        return (
                          <li key={p} className="px-2.5 py-1.5">
                            <div className="flex items-center gap-2">
                              <PlatformBadge p={p} size={14} />
                              <span className="flex-1 text-[12px]">{p}{draft.overrides[p] !== undefined && <span className="ml-1 text-forest">· own caption</span>}</span>
                              <span className={`text-[11px] tabular-nums ${over ? 'font-semibold text-[#7A2E1E]' : 'text-ink/45'}`}>{text.length.toLocaleString()}/{RULES[p].maxChars.toLocaleString()}</span>
                              <button type="button" onClick={() => setOverrideOpen(overrideOpen === p ? null : p)} className="text-[11px] text-forest underline underline-offset-2">{overrideOpen === p ? 'Done' : 'Tailor'}</button>
                            </div>
                            {overrideOpen === p && (
                              <div className="mt-1.5">
                                <textarea rows={3} className={input} value={draft.overrides[p] ?? draft.caption} onChange={e => set({ overrides: { ...draft.overrides, [p]: e.target.value } })} />
                                <p className="mt-1 text-[11px] text-ink/50">Best shape: {RULES[p].shape}. {draft.overrides[p] !== undefined && <button type="button" onClick={() => { const o = { ...draft.overrides }; delete o[p]; set({ overrides: o }) }} className="text-forest underline">Use the main caption</button>}</p>
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {issues.length > 0 && <ul className="space-y-0.5 rounded-[10px] bg-[#FBF3E8] px-3 py-2 text-[12px] text-[#7A4A12]">{issues.map((i, n) => <li key={n}><b>{i.platform}</b> {i.text}</li>)}</ul>}
                  <div className="grid grid-cols-3 gap-2">
                    <label className="grid gap-1 text-ink/60">Date<input type="date" className={input} value={draft.date} onChange={e => set({ date: e.target.value })} /></label>
                    <label className="grid gap-1 text-ink/60">Time<input type="time" className={input} value={draft.time} onChange={e => set({ time: e.target.value })} /></label>
                    <label className="grid gap-1 text-ink/60">Format<select className={input} value={draft.format} onChange={e => set({ format: e.target.value as Format })}>{FORMATS.map(f => <option key={f}>{f}</option>)}</select></label>
                  </div>
                  <div>
                    <p className="mb-1 text-ink/60">Media from {nameOf(draft.email)}’s assets</p>
                    {!(draft.email in media) && !sample ? <p className="text-[12px] text-ink/50">Loading…</p> : (media[draft.email] ?? []).length === 0
                      ? <p className="text-[12px] text-ink/50">No images or videos in their asset library yet. Upload them in Clients → Assets.</p>
                      : (
                        <ul className="grid grid-cols-4 gap-1.5">
                          {(media[draft.email] ?? []).map(m => {
                            const on = draft.assetIds.includes(m.id)
                            const f = m.files[0]
                            return (
                              <li key={m.id}>
                                <button type="button" onClick={() => set({ assetIds: on ? draft.assetIds.filter(x => x !== m.id) : [...draft.assetIds, m.id] })} aria-pressed={on} title={m.title}
                                  className={`relative block aspect-square w-full overflow-hidden rounded-[8px] border-2 ${on ? 'border-forest' : 'border-transparent'}`}>
                                  {f.type.startsWith('video/') ? <span className="flex h-full w-full items-center justify-center bg-ink text-[10px] text-mist">▶ video</span> : <img src={f.thumb || f.url} alt={m.title} className="h-full w-full bg-bone object-cover" />}
                                  {on && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[10px] text-mist">{draft.assetIds.indexOf(m.id) + 1}</span>}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                  </div>
                  <label className="grid gap-1 text-ink/60">Notes (internal)<input className={input} value={draft.notes} onChange={e => set({ notes: e.target.value })} /></label>
                  {draft.feedback && <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">History</p><ul className="mt-1 space-y-0.5 text-[12px] text-ink/65">{draft.feedback.split('\n').map((l, i) => <li key={i}>{l}</li>)}</ul></div>}
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {draft.platforms.map(p => <button key={p} onClick={() => setPreviewOn(p)} aria-pressed={previewOn === p} className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[12px] ${previewOn === p ? 'border-forest bg-[#EEF4E6]' : 'border-ink/[0.12]'}`}><PlatformBadge p={p} size={14} /> {p}</button>)}
                  </div>
                  {draft.platforms.length ? <PostPreview post={draft} platform={draft.platforms.includes(previewOn) ? previewOn : draft.platforms[0]} media={draftMedia} account={nameOf(draft.email)} /> : <p className="text-ink/50">Pick a platform to preview.</p>}
                  {draft.date && <p className="text-[12px] text-ink/55">Goes out {longDate(fromLocalInput(draft.date, draft.time))} (your time).</p>}
                </>
              )}
            </div>

            <div className="space-y-2 border-t border-ink/[0.08] p-3 font-body text-[13px]">
              {msg && <p role="status" className={`rounded-[10px] px-3 py-2 ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => save()} disabled={!!busy} className="rounded-[10px] border border-forest px-3 py-1.5 text-forest disabled:opacity-50">{busy === 'save' ? 'Saving…' : 'Save'}</button>
                {['Idea', 'Draft', 'Changes requested'].includes(draft.status) && <button onClick={() => save('Client review')} disabled={!!busy || !draft.platforms.length} className="flex-1 rounded-[10px] bg-forest px-3 py-1.5 text-mist disabled:opacity-50">{busy === 'Client review' ? 'Sending…' : 'Send to client for review'}</button>}
                {draft.status === 'Approved' && <button onClick={() => save('Scheduled')} disabled={!!busy || !draft.date} className="flex-1 rounded-[10px] bg-forest px-3 py-1.5 text-mist disabled:opacity-50">Mark scheduled</button>}
                {['Approved', 'Scheduled'].includes(draft.status) && (
                  <button onClick={() => { const links = prompt('Where did it post? One per line, e.g. Instagram | https://…', draft.publishedLinks); if (links !== null) save('Published', { publishedLinks: links }) }} disabled={!!busy} className="rounded-[10px] border border-forest px-3 py-1.5 text-forest disabled:opacity-50">Mark posted</button>
                )}
              </div>
              {draft.id && (
                <div className="flex flex-wrap gap-3 text-[12px]">
                  {!['Approved', 'Scheduled', 'Published'].includes(draft.status) && <button onClick={() => save('Approved')} disabled={!!busy} className="text-forest underline underline-offset-2">Approve internally</button>}
                  {draft.status !== 'Archived' && <button onClick={() => save('Archived')} disabled={!!busy} className="text-ink/55 underline underline-offset-2">Archive</button>}
                  <button onClick={remove} disabled={!!busy} className="text-[#7A2E1E] underline underline-offset-2">Delete</button>
                </div>
              )}
              <p className="text-[11px] text-ink/45">Posting is by hand for now: once a post is approved, publish it and mark it posted. Direct posting switches on as each platform approves our app.</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
