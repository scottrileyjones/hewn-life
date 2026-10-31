'use client'
import { RULES, type Platform } from '@/lib/portal/platforms'
import type { Post, PostStatus } from '@/lib/portal/posts'
import type { MediaItem } from '@/lib/portal/media'

export const STATUS_STYLE: Record<PostStatus, string> = {
  Idea: 'bg-white border-dashed border-ink/25 text-ink/60',
  Draft: 'bg-sand border-sand text-ink/75',
  'Client review': 'bg-lime border-lime text-forest',
  'Changes requested': 'bg-[#F6E7D4] border-[#F6E7D4] text-[#7A4A12]',
  Approved: 'bg-[#E4EEDA] border-[#E4EEDA] text-forest',
  Scheduled: 'bg-[#DCE8F5] border-[#DCE8F5] text-[#1C3F66]',
  Published: 'bg-forest border-forest text-mist',
  Archived: 'bg-white border-ink/10 text-ink/35',
}
export const CLIENT_LABEL: Partial<Record<PostStatus, string>> = { 'Client review': 'Needs your review' }

export function StatusTag({ status, client }: { status: PostStatus; client?: boolean }) {
  return <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 font-body text-[11px] font-medium ${STATUS_STYLE[status]}`}>{(client && CLIENT_LABEL[status]) || status}</span>
}

export function PlatformBadge({ p, size = 18, dim }: { p: Platform; size?: number; dim?: boolean }) {
  const r = RULES[p]
  return (
    <span title={p} aria-label={p} className={`inline-flex shrink-0 items-center justify-center rounded-[5px] font-body font-bold text-white ${dim ? 'opacity-30' : ''}`}
      style={{ background: r.color, width: size, height: size, fontSize: size * 0.48 }}>{r.short}</span>
  )
}

/* ── Dates ─────────────────────────────────────────── */
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const startOfWeek = (d: Date) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - x.getDay()); return x }
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(':00', '').replace(' ', '').toLowerCase()
export const longDate = (iso: string) => new Date(iso).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Chip({ post, onPick, label, client }: { post: Post; onPick: (p: Post) => void; label?: string; client?: boolean }) {
  return (
    <button onClick={e => { e.stopPropagation(); onPick(post) }} title={post.title}
      className={`flex w-full items-center gap-1 overflow-hidden rounded-[6px] border px-1.5 py-[3px] text-left font-body text-[11px] leading-tight ${STATUS_STYLE[post.status]}`}>
      {post.scheduledAt && <span className="shrink-0 font-semibold tabular-nums">{timeLabel(post.scheduledAt)}</span>}
      <span className="min-w-0 flex-1 truncate">{label ? <b className="font-semibold">{label} · </b> : null}{post.title}</span>
      <span className="flex shrink-0 gap-0.5">{post.platforms.slice(0, 3).map(p => <PlatformBadge key={p} p={p} size={11} />)}</span>
      {client && post.status === 'Client review' && <span className="sr-only">Needs your review</span>}
    </button>
  )
}

/** A month: six weeks of days, each with its posts. Click a day to add a post there. */
export function MonthGrid({ cursor, posts, onPick, onDay, label, client }: {
  cursor: Date; posts: Post[]; onPick: (p: Post) => void; onDay?: (d: Date) => void; label?: (p: Post) => string; client?: boolean
}) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const start = startOfWeek(first)
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i))
  const byDay = new Map<string, Post[]>()
  for (const p of posts) if (p.scheduledAt) { const k = dayKey(new Date(p.scheduledAt)); byDay.set(k, [...(byDay.get(k) ?? []), p]) }
  const today = dayKey(new Date())
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-7 border-b border-ink/[0.08]">{WEEKDAYS.map(d => <p key={d} className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{d}</p>)}</div>
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
        {days.map(d => {
          const k = dayKey(d)
          const list = byDay.get(k) ?? []
          const inMonth = d.getMonth() === cursor.getMonth()
          return (
            <div key={k} onClick={() => onDay?.(d)} role={onDay ? 'button' : undefined} aria-label={onDay ? `Add a post on ${d.toDateString()}` : undefined}
              className={`group min-h-[84px] overflow-hidden border-b border-r border-ink/[0.06] p-1 ${inMonth ? 'bg-white' : 'bg-[#FBFAF7]'} ${onDay ? 'cursor-pointer hover:bg-[#F7FAF2]' : ''}`}>
              <div className="mb-0.5 flex items-center justify-between px-0.5">
                <span className={`font-body text-[12px] tabular-nums ${k === today ? 'flex h-5 w-5 items-center justify-center rounded-full bg-forest font-semibold text-mist' : inMonth ? 'text-ink/70' : 'text-ink/30'}`}>{d.getDate()}</span>
                {onDay && <span className="font-body text-[14px] leading-none text-forest opacity-0 group-hover:opacity-100">+</span>}
              </div>
              <div className="space-y-0.5">
                {list.slice(0, 3).map(p => <Chip key={p.id} post={p} onPick={onPick} label={label?.(p)} client={client} />)}
                {list.length > 3 && <p className="px-1 font-body text-[11px] text-ink/50">+{list.length - 3} more</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** A week: seven columns, posts listed by time. */
export function WeekGrid({ cursor, posts, onPick, onDay, label, client }: {
  cursor: Date; posts: Post[]; onPick: (p: Post) => void; onDay?: (d: Date) => void; label?: (p: Post) => string; client?: boolean
}) {
  const start = startOfWeek(cursor)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const today = dayKey(new Date())
  return (
    <div className="grid h-full min-h-0 grid-cols-7">
      {days.map(d => {
        const k = dayKey(d)
        const list = posts.filter(p => p.scheduledAt && dayKey(new Date(p.scheduledAt)) === k)
        return (
          <div key={k} className="flex min-h-0 flex-col border-r border-ink/[0.06]">
            <div className={`border-b border-ink/[0.08] px-2 py-1.5 ${k === today ? 'bg-[#F1F8E9]' : ''}`}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{WEEKDAYS[d.getDay()]}</p>
              <p className={`font-display text-[18px] font-semibold leading-tight ${k === today ? 'text-forest' : ''}`}>{d.getDate()}</p>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-1">
              {list.map(p => <Chip key={p.id} post={p} onPick={onPick} label={label?.(p)} client={client} />)}
              {onDay && <button onClick={() => onDay(d)} className="w-full rounded-[6px] border border-dashed border-ink/15 py-1 font-body text-[11px] text-ink/45 hover:border-forest hover:text-forest">+ Add</button>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** How the post will look: a simple platform card with the caption for that platform and the first image or video. */
export function PostPreview({ post, platform, media, account }: { post: Pick<Post, 'caption' | 'overrides'>; platform: Platform; media: MediaItem[]; account: string }) {
  const caption = post.overrides[platform] ?? post.caption
  const file = media.flatMap(m => m.files)[0]
  const tall = ['TikTok', 'YouTube', 'Pinterest'].includes(platform)
  return (
    <div className="overflow-hidden rounded-[14px] border border-ink/[0.1] bg-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest font-display text-[12px] font-semibold text-mist">{account.slice(0, 1).toUpperCase()}</span>
        <p className="min-w-0 flex-1 truncate font-body text-[13px] font-semibold">{account}</p>
        <PlatformBadge p={platform} size={16} />
      </div>
      {file && (file.type.startsWith('video/')
        ? <video src={file.url} className={`w-full bg-ink object-cover ${tall ? 'aspect-[9/16] max-h-[360px]' : 'aspect-square'}`} muted controls preload="metadata" />
        : <img src={file.thumb || file.url} alt="" className={`w-full bg-bone object-cover ${tall ? 'aspect-[9/16] max-h-[360px]' : platform === 'LinkedIn' || platform === 'X' ? 'aspect-[1.91/1]' : 'aspect-[4/5]'}`} />)}
      <p className="whitespace-pre-line px-3 py-2.5 font-body text-[13px] leading-relaxed">{caption || <span className="text-ink/40">No caption yet</span>}</p>
    </div>
  )
}

/** Phones: the period's posts as a list by day instead of a grid. */
export function AgendaList({ from, to, posts, onPick, label, client }: { from: Date; to: Date; posts: Post[]; onPick: (p: Post) => void; label?: (p: Post) => string; client?: boolean }) {
  const inRange = posts.filter(p => p.scheduledAt && new Date(p.scheduledAt) >= from && new Date(p.scheduledAt) < to)
  const days = Array.from(new Set(inRange.map(p => dayKey(new Date(p.scheduledAt))))).sort()
  if (!days.length) return <p className="p-6 text-center font-body text-[14px] text-ink/55">Nothing scheduled in this period.</p>
  return (
    <div className="divide-y divide-ink/[0.06]">
      {days.map(k => (
        <section key={k} className="px-3 py-2.5">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">{new Date(`${k}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <ul className="space-y-1.5">
            {inRange.filter(p => dayKey(new Date(p.scheduledAt)) === k).map(p => (
              <li key={p.id}>
                <button onClick={() => onPick(p)} className="flex w-full items-center gap-2 rounded-[12px] border border-ink/[0.08] bg-white p-2.5 text-left">
                  <span className="w-12 shrink-0 font-body text-[12px] font-semibold tabular-nums text-ink/70">{timeLabel(p.scheduledAt)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-body text-[14px] font-medium">{p.title}</span>
                    {label && <span className="block truncate font-body text-[11px] text-ink/50">{label(p)}</span>}
                    <span className="mt-1 flex items-center gap-1"><StatusTag status={p.status} client={client} />{p.platforms.slice(0, 4).map(pl => <PlatformBadge key={pl} p={pl} size={14} />)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
