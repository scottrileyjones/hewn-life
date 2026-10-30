'use client'
import { useMemo, useState } from 'react'
import CrmHeader from './CrmHeader'
import { AREAS, OWNERS, STATUSES, type Area, type Owner, type Status, type Task, type TaskPatch } from '@/lib/hq/checklist'
import type { Revenue } from '@/lib/hq/revenue'

/** Grant Agreement 3.1 run-rate milestones. */
const MILESTONES = [250_000, 500_000, 1_000_000, 2_000_000, 3_000_000]

export type Funnel = { leads30: number; steps: [string, number][]; openValue: number; openDeals: number }

const money = (n: number) => `$${Math.round(n).toLocaleString()}`
const short = (n: number) => (n >= 1e6 ? `$${+(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`)
const dateLabel = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const daysUntil = (iso: string, today: string) => Math.round((new Date(`${iso}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 864e5)

const STATUS_STYLE: Record<Status, string> = {
  'To do': 'bg-sand text-ink/70',
  'In progress': 'bg-[#E4EEDA] text-forest',
  Waiting: 'bg-[#F6E7D4] text-[#7A4A12]',
  Done: 'bg-forest text-mist',
}

function Tile({ label, value, note, dark }: { label: string; value: string; note: string; dark?: boolean }) {
  return (
    <div className={`rounded-[20px] p-4 sm:p-5 ${dark ? 'bg-forest text-mist' : 'border border-ink/[0.08] bg-white'}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${dark ? 'text-lime' : 'text-ink/55'}`}>{label}</p>
      <p className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[30px]">{value}</p>
      <p className={`mt-0.5 font-body text-[12px] ${dark ? 'text-mist/70' : 'text-ink/55'}`}>{note}</p>
    </div>
  )
}

function Card({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{title}</p>
        {aside}
      </div>
      {children}
    </div>
  )
}

export default function Hq({ user, tasks: initial, revenue, funnel, today }: {
  user: string; tasks: Task[] | null; revenue: Revenue | null; funnel: Funnel | null; today: string
}) {
  const [tasks, setTasks] = useState<Task[]>(initial ?? [])
  const [owner, setOwner] = useState<Owner | 'All'>('All')
  const [showDone, setShowDone] = useState(false)
  const [view, setView] = useState<'priority' | 'area'>('priority')
  const [openId, setOpenId] = useState<string | null>(null)
  const [adding, setAdding] = useState<Area | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const me: Owner | null = user.startsWith('scott') ? 'Scott' : user.startsWith('jason') ? 'Jason' : null

  const stats = useMemo(() => {
    const done = tasks.filter(t => t.status === 'Done').length
    const open = tasks.filter(t => t.status !== 'Done')
    const dated = open.filter(t => t.due).map(t => ({ t, d: daysUntil(t.due, today) }))
    return {
      done, total: tasks.length,
      overdue: dated.filter(x => x.d < 0).map(x => x.t),
      soon: dated.filter(x => x.d >= 0 && x.d <= 14).sort((a, b) => a.d - b.d).map(x => x.t),
      inProgress: open.filter(t => t.status === 'In progress'),
      waiting: open.filter(t => t.status === 'Waiting'),
      byArea: AREAS.map(a => { const list = tasks.filter(t => t.area === a); return { area: a, done: list.filter(t => t.status === 'Done').length, total: list.length } }).filter(a => a.total),
      byOwner: OWNERS.map(o => ({ owner: o, open: open.filter(t => t.owner === o).length })),
    }
  }, [tasks, today])

  async function save(t: Task | null, patch: TaskPatch & { area?: Area }) {
    setError('')
    const prev = tasks
    if (t) setTasks(ts => ts.map(x => (x.id === t.id ? { ...x, ...patch } : x)))
    const order = t ? undefined : Math.max(0, ...tasks.filter(x => x.area === patch.area).map(x => x.order)) + 1
    const res = await fetch('/api/crm/checklist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t?.id ?? null, order, ...patch }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) { setTasks(prev); setError(out.error || 'Couldn’t save. Try again.'); return }
    setTasks(ts => (t ? ts.map(x => (x.id === t.id ? out.task : x)) : [...ts, out.task]))
  }

  async function remove(t: Task) {
    if (!confirm(`Delete “${t.task}”?`)) return
    const prev = tasks
    setTasks(ts => ts.filter(x => x.id !== t.id))
    const res = await fetch(`/api/crm/checklist?id=${encodeURIComponent(t.id)}`, { method: 'DELETE' })
    if (!res.ok) { setTasks(prev); setError('Couldn’t delete. Try again.') }
  }

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0
  const runRate = revenue?.runRate ?? 0
  const next = MILESTONES.find(m => runRate < m)
  const vested = MILESTONES.filter(m => runRate >= m).length
  // Milestones sit evenly on the track; the fill interpolates within the current segment.
  const seg = MILESTONES.findIndex(m => runRate < m)
  const prevMark = seg > 0 ? MILESTONES[seg - 1] : 0
  const fill = seg === -1 ? 100 : ((seg + (runRate - prevMark) / (MILESTONES[seg] - prevMark)) / MILESTONES.length) * 100
  const maxMonth = Math.max(1, ...(revenue?.months.map(m => m.amount) ?? [0]))

  const headline = [
    `${stats.done} of ${stats.total} startup tasks done`,
    stats.overdue.length ? `${stats.overdue.length} overdue` : null,
    stats.soon.length ? `${stats.soon.length} due in the next two weeks` : null,
    revenue ? (revenue.collected90 ? `${money(revenue.collected90)} collected in the last 90 days` : 'no revenue collected yet') : null,
    funnel ? `${funnel.leads30} new lead${funnel.leads30 === 1 ? '' : 's'} in 30 days` : null,
  ].filter(Boolean).join(' · ')

  function row(t: Task, rank?: number) {
    const d = t.due ? daysUntil(t.due, today) : null
                      const open = openId === t.id
                      return (
                        <li key={t.id} className="px-4 py-2.5 sm:px-5">
                          <div className="flex items-start gap-3">
                            {rank !== undefined && <span className="mt-0.5 w-6 shrink-0 text-right font-display text-[14px] font-semibold text-ink/40">{rank}</span>}
                            <input type="checkbox" checked={t.status === 'Done'} aria-label={`Mark “${t.task}” done`}
                              onChange={e => save(t, { status: e.target.checked ? 'Done' : 'To do' })}
                              className="mt-1 h-4 w-4 shrink-0 accent-forest" />
                            <button onClick={() => setOpenId(open ? null : t.id)} className="min-w-0 flex-1 text-left">
                              <p className={`font-body text-[14px] leading-snug ${t.status === 'Done' ? 'text-ink/45 line-through' : ''}`}>{t.task}</p>
                              <p className="mt-0.5 flex flex-wrap gap-x-2 font-body text-[12px] text-ink/55">
                                <span>{t.owner}</span>
                                {rank !== undefined && <span>· {t.area}</span>}
                                {t.due && t.status !== 'Done' && <span className={d !== null && d < 0 ? 'text-[#7A2E1E]' : ''}>· due {dateLabel(t.due)}</span>}
                                {t.notes && <span>· note</span>}
                              </p>
                            </button>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 font-body text-[11px] ${STATUS_STYLE[t.status]}`}>{t.status}</span>
                          </div>
                          {open && (
                            <div className="mt-3 grid gap-2 rounded-[14px] bg-bone p-3 font-body text-[13px] sm:grid-cols-3">
                              <label className="grid gap-1">Status
                                <select value={t.status} onChange={e => save(t, { status: e.target.value as Status })} className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1.5">
                                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                              </label>
                              <label className="grid gap-1">Owner
                                <select value={t.owner} onChange={e => save(t, { owner: e.target.value as Owner })} className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1.5">
                                  {OWNERS.map(o => <option key={o}>{o}</option>)}
                                </select>
                              </label>
                              <label className="grid gap-1">Due
                                <input type="date" value={t.due} onChange={e => save(t, { due: e.target.value })} className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1" />
                              </label>
                              <label className="grid gap-1 sm:col-span-3">Notes
                                <textarea defaultValue={t.notes} rows={2} onBlur={e => e.target.value !== t.notes && save(t, { notes: e.target.value })}
                                  className="rounded-[10px] border border-ink/[0.12] bg-white px-2 py-1.5" />
                              </label>
                              <div className="flex items-center justify-between sm:col-span-3">
                                <span className="text-[12px] text-ink/50">{t.updatedBy ? `Last changed by ${t.updatedBy.split('@')[0]}` : ''}</span>
                                <button onClick={() => remove(t)} className="text-[12px] text-[#7A2E1E] underline underline-offset-2">Delete</button>
                              </div>
                            </div>
                          )}
                        </li>
                      )
  }

  // Priority number among all open tasks, so it stays the same when filtering by owner.
  const rankOf = new Map(tasks.filter(t => t.status !== 'Done').sort((a, b) => a.order - b.order).map((t, i) => [t.id, i + 1]))
  const shown = tasks.filter(t => (owner === 'All' || t.owner === owner) && (showDone || t.status !== 'Done'))

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <CrmHeader active="hq" user={user} />

      <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-6 sm:px-6">
        <section aria-labelledby="report">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Executive report · {dateLabel(today)}, {today.slice(0, 4)}</p>
          <h1 id="report" className="mt-1 font-display text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Hewn Holdings at a glance</h1>
          <p className="mt-1 max-w-3xl font-body text-[15px] text-ink/70">{headline}.</p>
          {error && <p role="alert" className="mt-3 rounded-[14px] bg-[#F6E3DD] px-4 py-2.5 font-body text-sm text-[#7A2E1E]">{error}</p>}

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Tile dark label="Run-rate" value={revenue ? short(runRate) : '—'} note={revenue ? 'last 90 days of cash × 4' : 'Stripe unavailable'} />
            <Tile label="Monthly recurring" value={revenue ? money(revenue.mrr) : '—'} note={revenue ? `${revenue.activeSubs} active subscription${revenue.activeSubs === 1 ? '' : 's'}` : 'Stripe unavailable'} />
            <Tile label="Collected, 30 days" value={revenue ? money(revenue.collected30) : '—'} note="net of refunds" />
            <Tile label="Paying clients" value={revenue ? String(revenue.clients90) : '—'} note="paid in the last 90 days" />
            <Tile label="New leads" value={funnel ? String(funnel.leads30) : '—'} note="last 30 days" />
            <Tile label="Open pipeline" value={funnel ? money(funnel.openValue) : '—'} note={funnel ? `${funnel.openDeals} booked or in proposal` : 'CRM unavailable'} />
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            <Card title="Road to the vesting milestones" aside={<span className="font-body text-[12px] text-ink/55">{vested} of 5 reached</span>}>
              <div className="mt-6 px-1">
                <div className="relative h-2 rounded-full bg-sand">
                  <div className="h-2 rounded-full bg-ember" style={{ width: `${Math.max(fill, runRate ? 1.5 : 0)}%` }} />
                  {MILESTONES.map((m, i) => (
                    <span key={m} className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${runRate >= m ? 'border-forest bg-forest' : 'border-ink/25 bg-white'}`} style={{ left: `${((i + 1) / MILESTONES.length) * 100}%` }} />
                  ))}
                </div>
                <div className="relative mt-3 h-10">
                  {MILESTONES.map((m, i) => (
                    <div key={m} className="absolute -translate-x-1/2 text-center" style={{ left: `${((i + 1) / MILESTONES.length) * 100}%` }}>
                      <p className="font-display text-[14px] font-semibold">{short(m)}</p>
                      <p className="font-body text-[11px] text-ink/50">+5%</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 font-body text-[13px] text-ink/65">
                {next ? <>Next: <strong className="text-ink">{short(next)}</strong> run-rate, {money(next - runRate)} to go. </> : 'All five milestones reached. '}
                Each one vests 5% of the company to Jason once the run-rate holds for three straight months. This chart uses Stripe cash; the official number comes from the monthly books.
              </p>
            </Card>

            <Card title="Cash collected by month">
              <div className="mt-4 flex h-[132px] items-end gap-2">
                {(revenue?.months ?? []).map(m => (
                  <div key={m.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <p className="font-body text-[11px] text-ink/60">{m.amount ? short(m.amount) : ''}</p>
                    <div className="w-full rounded-t-[6px] bg-forest" style={{ height: `${m.amount ? Math.max(4, (m.amount / maxMonth) * 96) : 2}px`, opacity: m.amount ? 1 : 0.15 }} />
                    <p className="font-body text-[12px] text-ink/60">{m.label}</p>
                  </div>
                ))}
                {!revenue && <p className="self-center font-body text-sm text-ink/55">Stripe unavailable right now.</p>}
              </div>
            </Card>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <Card title="Startup readiness" aside={<span className="font-display text-[20px] font-semibold">{pct}%</span>}>
              <div className="mt-3 h-2 rounded-full bg-sand"><div className="h-2 rounded-full bg-ember" style={{ width: `${pct}%` }} /></div>
              <ul className="mt-4 space-y-2.5">
                {stats.byArea.map(a => (
                  <li key={a.area}>
                    <div className="flex justify-between font-body text-[13px]"><span>{a.area}</span><span className="text-ink/55">{a.done}/{a.total}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-sand"><div className="h-1.5 rounded-full bg-forest" style={{ width: `${(a.done / a.total) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Needs attention">
              <ul className="mt-3 divide-y divide-ink/[0.06]">
                {[...stats.overdue, ...stats.soon].slice(0, 6).map(t => {
                  const d = daysUntil(t.due, today)
                  return (
                    <li key={t.id} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="min-w-0"><p className="font-body text-[14px] leading-snug">{t.task}</p><p className="font-body text-[12px] text-ink/55">{t.owner}</p></div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 font-body text-[12px] ${d < 0 ? 'bg-[#F6E3DD] text-[#7A2E1E]' : d <= 3 ? 'bg-[#F6E7D4] text-[#7A4A12]' : 'bg-sand text-ink/70'}`}>
                        {d < 0 ? `${-d}d overdue` : d === 0 ? 'Today' : `${dateLabel(t.due)}`}
                      </span>
                    </li>
                  )
                })}
                {!stats.overdue.length && !stats.soon.length && <li className="py-2.5 font-body text-[14px] text-ink/55">Nothing due in the next two weeks.</li>}
              </ul>
              {stats.waiting.length > 0 && <p className="mt-2 font-body text-[12px] text-ink/55">{stats.waiting.length} waiting on someone else.</p>}
            </Card>

            <Card title="Pipeline, last 90 days">
              {funnel ? (
                <ul className="mt-3 space-y-2.5">
                  {funnel.steps.map(([label, n]) => (
                    <li key={label}>
                      <div className="flex justify-between font-body text-[13px]"><span>{label}</span><span className="font-semibold">{n}</span></div>
                      <div className="mt-1 h-1.5 rounded-full bg-sand"><div className={`h-1.5 rounded-full ${label === 'Won' ? 'bg-ember' : 'bg-forest'}`} style={{ width: `${funnel.steps[0][1] ? Math.max(2, (n / funnel.steps[0][1]) * 100) : 0}%` }} /></div>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 font-body text-sm text-ink/55">CRM data unavailable right now.</p>}
              <div className="mt-4 flex gap-4 border-t border-ink/[0.06] pt-3 font-body text-[13px]">
                {stats.byOwner.map(o => <span key={o.owner}><strong>{o.open}</strong> <span className="text-ink/55">open · {o.owner}</span></span>)}
              </div>
            </Card>
          </div>
        </section>

        <section aria-labelledby="checklist" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="checklist" className="font-display text-[24px] font-semibold tracking-[-0.02em]">Startup checklist</h2>
              <p className="font-body text-[13px] text-ink/60">Shared with Airtable. Changes save as you make them.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-body text-[13px]">
              <div className="flex rounded-full border border-ink/[0.12] bg-white p-0.5" role="group" aria-label="View">
                {([['priority', 'Priority order'], ['area', 'By area']] as const).map(([v, label]) => (
                  <button key={v} onClick={() => setView(v)} aria-pressed={view === v}
                    className={`rounded-full px-3 py-1.5 transition ${view === v ? 'bg-forest text-mist' : 'text-ink/70 hover:text-ink'}`}>{label}</button>
                ))}
              </div>
              <div className="flex rounded-full border border-ink/[0.12] bg-white p-0.5" role="group" aria-label="Owner">
                {(['All', ...OWNERS] as const).map(o => (
                  <button key={o} onClick={() => setOwner(o)} aria-pressed={owner === o}
                    className={`rounded-full px-3 py-1.5 transition ${owner === o ? 'bg-forest text-mist' : 'text-ink/70 hover:text-ink'}`}>{o === me ? `${o} (me)` : o}</button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-full border border-ink/[0.12] bg-white px-3 py-1.5">
                <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} className="accent-forest" /> Show done
              </label>
            </div>
          </div>
          {!initial && <p className="mt-3 rounded-[14px] bg-[#F6E3DD] px-4 py-2.5 font-body text-sm text-[#7A2E1E]">Couldn’t load the checklist from Airtable.</p>}

          {view === 'priority' && (
            <div className="mt-4 rounded-[20px] border border-ink/[0.08] bg-white">
              <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-3 sm:px-5">
                <p className="font-display text-[16px] font-semibold">Most important first</p>
                <span className="font-body text-[12px] text-ink/55">{stats.total - stats.done} open</span>
              </div>
              <ul className="divide-y divide-ink/[0.06]">
                {shown.slice().sort((a, b) => (a.status === 'Done' ? 1 : 0) - (b.status === 'Done' ? 1 : 0) || a.order - b.order).map(t => row(t, rankOf.get(t.id)))}
                {!shown.length && <li className="px-4 py-3 font-body text-[13px] text-ink/50 sm:px-5">Nothing open here.</li>}
              </ul>
            </div>
          )}

          <div className={`mt-4 grid gap-3 xl:grid-cols-2 ${view === 'area' ? '' : 'hidden'}`}>
            {AREAS.map(area => {
              const list = shown.filter(t => t.area === area)
              const all = tasks.filter(t => t.area === area)
              return (
                <div key={area} className="rounded-[20px] border border-ink/[0.08] bg-white">
                  <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-3 sm:px-5">
                    <p className="font-display text-[16px] font-semibold">{area}</p>
                    <span className="font-body text-[12px] text-ink/55">{all.filter(t => t.status === 'Done').length}/{all.length} done</span>
                  </div>
                  <ul className="divide-y divide-ink/[0.06]">
                    {list.map(t => row(t))}
                    {!list.length && <li className="px-4 py-3 font-body text-[13px] text-ink/50 sm:px-5">{all.length ? 'All done here.' : 'No tasks yet.'}</li>}
                    <li className="px-4 py-2.5 sm:px-5">
                      {adding === area ? (
                        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (draft.trim()) { save(null, { task: draft.trim(), area, owner: me ?? 'Both', status: 'To do' }); setDraft(''); setAdding(null) } }}>
                          <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} placeholder="New task" aria-label={`New task in ${area}`}
                            className="min-w-0 flex-1 rounded-full border border-ink/[0.12] px-3 py-1.5 font-body text-[14px] focus:border-forest focus:outline-none" />
                          <button className="rounded-full bg-forest px-4 py-1.5 font-body text-[13px] text-mist">Add</button>
                          <button type="button" onClick={() => setAdding(null)} className="font-body text-[13px] text-ink/60">Cancel</button>
                        </form>
                      ) : (
                        <button onClick={() => { setAdding(area); setDraft('') }} className="font-body text-[13px] text-forest hover:underline">+ Add task</button>
                      )}
                    </li>
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
