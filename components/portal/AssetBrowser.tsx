'use client'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Glyph, Mark } from '@/components/strata/Glyph'
import { AssetBody, StatusPill, Thumb, UploadForm, kb } from './AssetBits'
import type { Asset } from '@/lib/portal/assets'
import { PILLARS, pillarOf, typeOf, type PillarGroup } from '@/lib/portal/taxonomy'

const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** Where the sidebar points: a smart view, a pillar, or one asset type in a pillar. */
type Place = { kind: 'all' } | { kind: 'review' } | { kind: 'recent' } | { kind: 'pillar'; key: string } | { kind: 'type'; id: string }

function PillarIcon({ p, size = 16, active }: { p: PillarGroup; size?: number; active?: boolean }) {
  const fg = active ? '#F4F2EC' : '#1E3826'
  const accent = active ? '#D6F28B' : '#6BAD3D'
  return p.glyph ? <Glyph name={p.glyph} fg={fg} accent={accent} size={size} /> : <Mark fg={fg} accent={accent} size={size} />
}

/**
 * The asset library as an app: pillars and their asset types in a sidebar,
 * a toolbar (search, status, grid/list, upload), the content grouped by
 * pillar and type, and a detail pane for the selected asset.
 */
export default function AssetBrowser({ assets, mode, onUpload, actions, reviewLabel, height = 'h-full' }: {
  assets: Asset[]
  mode: 'client' | 'team'
  onUpload: (fd: FormData) => Promise<string | null>
  /** Extra controls in the detail pane (approve, send, mark live…). */
  actions: (a: Asset) => ReactNode
  /** What the "waiting" smart view is called: "Needs your review" for clients, "With client" for us. */
  reviewLabel: string
  height?: string
}) {
  const [place, setPlace] = useState<Place>({ kind: 'all' })
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Any status')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { try { const v = localStorage.getItem('hewn-assets-view'); if (v === 'list' || v === 'grid') setView(v) } catch {} }, [])
  const pickView = (v: 'grid' | 'list') => { setView(v); try { localStorage.setItem('hewn-assets-view', v) } catch {} }

  const waiting = assets.filter(a => a.status === 'In review')
  const count = (pred: (a: Asset) => boolean) => assets.filter(pred).length

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const weekAgo = Date.now() - 14 * 864e5
    return assets.filter(a =>
      (place.kind === 'all'
        || (place.kind === 'review' && a.status === 'In review')
        || (place.kind === 'recent' && new Date(a.addedAt).getTime() >= weekAgo)
        || (place.kind === 'pillar' && pillarOf(a.category).key === place.key)
        || (place.kind === 'type' && a.category === place.id))
      && (status === 'Any status' || a.status === status)
      && (!q || [a.title, a.text, a.notes, a.link, typeOf(a.category).name, ...a.files.map(f => f.name)].join(' ').toLowerCase().includes(q)))
  }, [assets, place, query, status])

  // Group by pillar, then type, so the hierarchy is visible in the content too.
  const groups = useMemo(() => PILLARS.map(p => ({ p, types: p.types.map(t => ({ t, items: shown.filter(a => a.category === t.id) })).filter(g => g.items.length) })).filter(g => g.types.length), [shown])
  const sel = assets.find(a => a.id === selected) ?? null

  const crumb = place.kind === 'pillar' ? [PILLARS.find(p => p.key === place.key)!.name]
    : place.kind === 'type' ? [pillarOf(place.id).name, typeOf(place.id).name]
    : place.kind === 'review' ? [reviewLabel] : place.kind === 'recent' ? ['Recently added'] : []
  const defaultType = place.kind === 'type' ? place.id : place.kind === 'pillar' ? PILLARS.find(p => p.key === place.key)!.types[0].id : undefined
  const statuses = mode === 'team' ? ['Any status', 'Draft', 'Received', 'In review', 'Changes requested', 'Approved', 'Live', 'Archived'] : ['Any status', 'Received', 'In review', 'Changes requested', 'Approved', 'Live']

  const go = (p: Place) => { setPlace(p); setSelected(null); if (p.kind === 'pillar') setOpen(o => new Set(o).add(p.key)) }
  const navItem = (active: boolean) => `flex w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-left font-body text-[13px] ${active ? 'bg-forest text-mist' : 'text-ink/80 hover:bg-bone'}`
  const badge = (n: number, active: boolean) => n ? <span className={`ml-auto rounded-full px-1.5 text-[11px] tabular-nums ${active ? 'text-mist/80' : 'text-ink/45'}`}>{n}</span> : null

  const card = (a: Asset) => (
    <li key={a.id}>
      <button onClick={() => setSelected(a.id)} aria-pressed={selected === a.id}
        className={`w-full rounded-[14px] border bg-white p-2 text-left transition ${selected === a.id ? 'border-forest ring-1 ring-forest' : 'border-ink/[0.08] hover:border-forest/40'}`}>
        <Thumb a={a} compact />
        <p className="mt-1.5 truncate font-body text-[13px] font-medium">{a.title}</p>
        <p className="truncate font-body text-[11px] text-ink/50">{typeOf(a.category).name} · {day(a.updatedAt)}</p>
        <div className="mt-1"><StatusPill status={a.status} team={mode === 'team'} /></div>
      </button>
    </li>
  )
  const row = (a: Asset) => (
    <tr key={a.id} onClick={() => setSelected(a.id)} className={`cursor-pointer border-t border-ink/[0.06] ${selected === a.id ? 'bg-[#EEF4E6]' : 'hover:bg-bone/70'}`}>
      <td className="py-1.5 pl-3 pr-2"><Thumb a={a} small /></td>
      <td className="max-w-0 py-1.5 pr-3"><p className="truncate font-body text-[13px] font-medium">{a.title}</p><p className="truncate font-body text-[11px] text-ink/50">{a.files.length ? `${a.files.length} file${a.files.length > 1 ? 's' : ''} · ${kb(a.files.reduce((n, f) => n + f.size, 0))}` : a.link ? 'Link' : 'Text'}</p></td>
      <td className="hidden py-1.5 pr-3 font-body text-[12px] text-ink/65 md:table-cell">{typeOf(a.category).name}</td>
      <td className="py-1.5 pr-3"><StatusPill status={a.status} team={mode === 'team'} /></td>
      <td className="hidden py-1.5 pr-3 font-body text-[12px] text-ink/65 lg:table-cell">{a.source === 'Hewn' ? 'Hewn Life' : mode === 'team' ? 'Client' : 'You'}</td>
      <td className="hidden py-1.5 pr-3 text-right font-body text-[12px] tabular-nums text-ink/55 sm:table-cell">{day(a.updatedAt)}</td>
    </tr>
  )

  return (
    <div className={`flex ${height} min-h-0 overflow-hidden rounded-[16px] border border-ink/[0.08] bg-white`}>
      {/* Sidebar: smart views, then each pillar with its asset types */}
      <nav aria-label="Asset sections" className="hidden w-[228px] shrink-0 overflow-y-auto border-r border-ink/[0.08] bg-[#FBFAF7] p-2 md:block">
        <button onClick={() => go({ kind: 'all' })} className={navItem(place.kind === 'all')}>All assets{badge(assets.length, place.kind === 'all')}</button>
        <button onClick={() => go({ kind: 'review' })} className={navItem(place.kind === 'review')}>
          {reviewLabel}{waiting.length > 0 && <span className={`ml-auto rounded-full px-1.5 text-[11px] font-semibold ${place.kind === 'review' ? 'bg-lime text-forest' : 'bg-lime text-forest'}`}>{waiting.length}</span>}
        </button>
        <button onClick={() => go({ kind: 'recent' })} className={navItem(place.kind === 'recent')}>Recently added</button>
        <p className="mb-1 mt-3 px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">Pillars</p>
        {PILLARS.map(p => {
          const n = count(a => pillarOf(a.category).key === p.key)
          const activeP = place.kind === 'pillar' && place.key === p.key
          const expanded = open.has(p.key) || (place.kind === 'type' && pillarOf(place.id).key === p.key)
          return (
            <div key={p.key}>
              <div className="flex items-center">
                <button aria-label={expanded ? `Collapse ${p.name}` : `Expand ${p.name}`} aria-expanded={expanded}
                  onClick={() => setOpen(o => { const s = new Set(o); if (s.has(p.key)) s.delete(p.key); else s.add(p.key); return s })}
                  className="flex h-6 w-5 shrink-0 items-center justify-center text-[10px] text-ink/40">{expanded ? '▾' : '▸'}</button>
                <button onClick={() => go({ kind: 'pillar', key: p.key })} className={`${navItem(activeP)} ${n ? '' : 'opacity-60'}`}>
                  <PillarIcon p={p} active={activeP} /> <span className="truncate">{p.name}</span>{badge(n, activeP)}
                </button>
              </div>
              {expanded && (
                <div className="mb-1 ml-[34px] border-l border-ink/[0.08] pl-1.5">
                  {p.types.map(t => {
                    const active = place.kind === 'type' && place.id === t.id
                    return <button key={t.id} onClick={() => go({ kind: 'type', id: t.id })} className={`${navItem(active)} py-1 text-[12.5px]`}>{t.name}{badge(count(a => a.category === t.id), active)}</button>
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-ink/[0.08] px-3 py-2">
          <select aria-label="Section" className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1.5 font-body text-[13px] md:hidden"
            value={place.kind === 'type' ? `t:${place.id}` : place.kind === 'pillar' ? `p:${place.key}` : place.kind}
            onChange={e => { const v = e.target.value; go(v.startsWith('t:') ? { kind: 'type', id: v.slice(2) } : v.startsWith('p:') ? { kind: 'pillar', key: v.slice(2) } : { kind: v as 'all' | 'review' | 'recent' }) }}>
            <option value="all">All assets ({assets.length})</option>
            <option value="review">{reviewLabel} ({waiting.length})</option>
            <option value="recent">Recently added</option>
            {PILLARS.map(p => <optgroup key={p.key} label={p.name}><option value={`p:${p.key}`}>All {p.name}</option>{p.types.map(t => <option key={t.id} value={`t:${t.id}`}>{t.name}</option>)}</optgroup>)}
          </select>
          <p className="hidden min-w-0 truncate font-body text-[13px] md:block">
            <button onClick={() => go({ kind: 'all' })} className={crumb.length ? 'text-ink/50 hover:text-ink' : 'font-medium'}>All assets</button>
            {crumb.map((c, i) => <span key={c}> <span className="text-ink/30">/</span> {i === crumb.length - 1 ? <b className="font-medium">{c}</b> : <button onClick={() => place.kind === 'type' && go({ kind: 'pillar', key: pillarOf(place.id).key })} className="text-ink/50 hover:text-ink">{c}</button>}</span>)}
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" aria-label="Search assets"
              className="w-32 rounded-[10px] border border-ink/[0.12] px-2.5 py-1.5 font-body text-[13px] focus:border-forest focus:outline-none sm:w-44" />
            <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Status" className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1.5 font-body text-[13px]">
              {statuses.map(s => <option key={s} value={s}>{s === 'In review' ? reviewLabel : s}</option>)}
            </select>
            <div className="flex rounded-[10px] border border-ink/[0.12] p-0.5" role="group" aria-label="View">
              {(['grid', 'list'] as const).map(v => <button key={v} onClick={() => pickView(v)} aria-pressed={view === v} className={`rounded-[8px] px-2 py-1 font-body text-[12px] ${view === v ? 'bg-forest text-mist' : 'text-ink/60'}`}>{v === 'grid' ? 'Grid' : 'List'}</button>)}
            </div>
            <button onClick={() => setUploading(true)} className="rounded-[10px] bg-forest px-3 py-1.5 font-body text-[13px] font-medium text-mist">+ Upload</button>
          </div>
        </div>

        {place.kind === 'type' && <p className="border-b border-ink/[0.06] px-3 py-1.5 font-body text-[12px] text-ink/55">{typeOf(place.id).hint}</p>}

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {!shown.length ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center">
              <p className="font-body text-[14px] text-ink/60">{query || status !== 'Any status' ? 'Nothing matches.' : place.kind === 'review' ? 'Nothing waiting. All caught up.' : 'Nothing here yet.'}</p>
              {place.kind !== 'review' && !query && <button onClick={() => setUploading(true)} className="font-body text-[13px] text-forest underline underline-offset-2">Upload {crumb.length ? `to ${crumb[crumb.length - 1]}` : 'your first asset'}</button>}
            </div>
          ) : view === 'list' ? (
            <table className="w-full table-fixed">
              <colgroup><col className="w-[60px]" /><col /><col className="hidden w-[150px] md:table-column" /><col className="w-[130px]" /><col className="hidden w-[90px] lg:table-column" /><col className="hidden w-[70px] sm:table-column" /></colgroup>
              <thead><tr className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                <th className="pb-1.5 pl-3" /><th className="pb-1.5">Name</th><th className="hidden pb-1.5 md:table-cell">Type</th><th className="pb-1.5">Status</th><th className="hidden pb-1.5 lg:table-cell">From</th><th className="hidden pb-1.5 pr-3 text-right sm:table-cell">Updated</th>
              </tr></thead>
              <tbody>{groups.flatMap(g => g.types.flatMap(t => t.items.map(row)))}</tbody>
            </table>
          ) : (
            <div className="space-y-5">
              {groups.map(g => (
                <section key={g.p.key}>
                  {place.kind !== 'type' && place.kind !== 'pillar' && (
                    <h3 className="mb-2 flex items-center gap-2 font-display text-[14px] font-semibold"><PillarIcon p={g.p} size={16} /> {g.p.name} <span className="font-body text-[12px] font-normal text-ink/45">{g.types.reduce((n, t) => n + t.items.length, 0)}</span></h3>
                  )}
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(156px,1fr))] gap-2">{g.types.flatMap(t => t.items.map(card))}</ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail pane (overlay on small screens) */}
      {sel && (
        <aside aria-label={sel.title} className="fixed inset-0 z-50 flex flex-col bg-white lg:static lg:z-auto lg:w-[340px] lg:shrink-0 lg:border-l lg:border-ink/[0.08]">
          <div className="flex items-start justify-between gap-2 border-b border-ink/[0.08] px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">{pillarOf(sel.category).name} / {typeOf(sel.category).name}</p>
              <h3 className="font-display text-[17px] font-semibold leading-snug">{sel.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 font-body text-[11px] text-ink/50"><StatusPill status={sel.status} team={mode === 'team'} /> {sel.source === 'Hewn' ? 'Hewn Life' : mode === 'team' ? 'Client' : 'You'} · {day(sel.addedAt)}</div>
            </div>
            <button onClick={() => setSelected(null)} aria-label="Close" className="text-[22px] leading-none text-ink/45 hover:text-ink">×</button>
          </div>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {sel.files.some(f => f.type.startsWith('image/')) && <Thumb a={sel} tall />}
            <AssetBody a={sel} />
            {actions(sel)}
          </div>
        </aside>
      )}

      {uploading && (
        <div role="dialog" aria-modal="true" aria-label="Upload" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onClick={() => setUploading(false)}>
          <div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[20px] bg-bone p-3 sm:rounded-[20px]" onClick={e => e.stopPropagation()}>
            <UploadForm team={mode === 'team'} defaultCategory={defaultType} onCancel={() => setUploading(false)}
              onSubmit={async fd => { const err = await onUpload(fd); if (!err) setUploading(false); return err }} />
          </div>
        </div>
      )}
    </div>
  )
}
