'use client'
import { useMemo, useState } from 'react'
import type { Contact, Stage } from '@/lib/crm/data'

const STAGES: Stage[] = ['New', 'Plan sent', 'Opened', 'Booked', 'Proposal', 'Won', 'Lost']
const RANK: Record<Stage, number> = { New: 0, 'Plan sent': 1, Opened: 2, Booked: 3, Proposal: 4, Won: 5, Lost: -1 }

export type BoardContact = Contact & { planLink: string | null }

const ago = (iso: string) => {
  if (!iso) return ''
  const d = (Date.now() - new Date(iso).getTime()) / 864e5
  if (d < 1 / 24) return 'just now'
  if (d < 1) return `${Math.round(d * 24)}h ago`
  if (d < 30) return `${Math.round(d)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
const when = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const money = (n: number) => `$${n.toLocaleString()}`

/** Furthest stage a contact has reached, so Lost deals still count for the steps they got through. */
const reached = (c: Contact) => Math.max(RANK[c.stage], RANK[c.autoStage])

export default function Board({ initial, user }: { initial: BoardContact[]; user: string }) {
  const [contacts, setContacts] = useState(initial)
  const [query, setQuery] = useState('')
  const [days, setDays] = useState<0 | 30 | 90>(0)
  const [openEmail, setOpenEmail] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<Stage | null>(null)
  const [error, setError] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const since = days ? Date.now() - days * 864e5 : 0
    return contacts.filter(c =>
      (!since || new Date(c.firstSeen || c.lastActivity).getTime() >= since) &&
      (!q || [c.name, c.company, c.email, ...c.sources].join(' ').toLowerCase().includes(q)))
  }, [contacts, query, days])

  const funnel = useMemo(() => {
    const steps: [string, number][] = [
      ['Leads', visible.length],
      ['Plan sent', visible.filter(c => reached(c) >= 1).length],
      ['Opened', visible.filter(c => reached(c) >= 2).length],
      ['Booked', visible.filter(c => reached(c) >= 3).length],
      ['Won', visible.filter(c => c.stage === 'Won').length],
    ]
    return steps.map(([label, n], i) => ({ label, n, of: i ? steps[i - 1][1] : n }))
  }, [visible])

  const openValue = visible.filter(c => !['Won', 'Lost'].includes(c.stage)).reduce((s, c) => s + (c.value ?? 0), 0)
  const wonValue = visible.filter(c => c.stage === 'Won').reduce((s, c) => s + (c.value ?? 0), 0)

  async function save(c: BoardContact, patch: { stage?: Stage; notes?: string; value?: number | null }) {
    setError('')
    const prev = contacts
    setContacts(cs => cs.map(x => x.email !== c.email ? x : {
      ...x,
      ...(patch.stage ? { stage: patch.stage, manual: { id: x.pipelineId ?? '', stage: patch.stage, at: new Date().toISOString(), by: user } } : {}),
      ...(patch.notes !== undefined ? { crmNotes: patch.notes } : {}),
      ...(patch.value !== undefined ? { value: patch.value } : {}),
    }))
    const res = await fetch('/api/crm/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: c.email, pipelineId: c.pipelineId, ...patch }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) { setContacts(prev); setError(out.error || 'Couldn’t save. Try again.'); return }
    setContacts(cs => cs.map(x => x.email === c.email ? { ...x, pipelineId: out.pipelineId } : x))
  }

  const open = contacts.find(c => c.email === openEmail) ?? null

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/[0.08] bg-bone/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <p className="mr-2 font-display text-[18px] font-semibold tracking-[-0.02em]">hewn<span className="accent text-ember">life</span> <span className="font-body text-[14px] font-normal text-ink/50">CRM</span></p>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, company, email" aria-label="Search contacts"
            className="min-w-0 flex-1 rounded-full border border-ink/[0.12] bg-white px-4 py-2 font-body text-sm focus:border-forest focus:outline-none sm:max-w-xs" />
          <div className="flex rounded-full border border-ink/[0.12] bg-white p-0.5 font-body text-[13px]" role="group" aria-label="Time period">
            {([[0, 'All time'], [90, '90 days'], [30, '30 days']] as const).map(([d, label]) => (
              <button key={d} onClick={() => setDays(d)} aria-pressed={days === d}
                className={`rounded-full px-3 py-1.5 transition ${days === d ? 'bg-forest text-mist' : 'text-ink/70 hover:text-ink'}`}>{label}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 font-body text-[13px] text-ink/60">
            <span className="hidden sm:inline">{user}</span>
            <form action="/api/crm/logout" method="post"><button className="underline underline-offset-2 hover:text-ink">Sign out</button></form>
          </div>
        </div>
      </header>

      <section className="px-4 pt-5 sm:px-6" aria-label="Funnel">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Funnel</p>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-4">
              {funnel.map((s, i) => {
                const pct = s.of ? Math.round((s.n / s.of) * 100) : 0
                const width = funnel[0].n ? Math.max(4, (s.n / funnel[0].n) * 100) : 4
                return (
                  <div key={s.label} className="min-w-0">
                    <p className="truncate font-body text-[12px] text-ink/60">{s.label}</p>
                    <p className="font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[30px]">{s.n}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-sand"><div className={`h-1.5 rounded-full ${i === funnel.length - 1 ? 'bg-ember' : 'bg-forest'}`} style={{ width: `${width}%` }} /></div>
                    <p className="mt-1 font-body text-[12px] text-ink/55">{i === 0 ? ' ' : `${pct}% of ${funnel[i - 1].label.toLowerCase()}`}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
            <div className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Open pipeline</p>
              <p className="mt-2 font-display text-[26px] font-semibold tracking-[-0.02em]">{money(openValue)}</p>
              <p className="font-body text-[12px] text-ink/55">deal value set on open cards</p>
            </div>
            <div className="rounded-[20px] bg-forest p-4 text-mist sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Won</p>
              <p className="mt-2 font-display text-[26px] font-semibold tracking-[-0.02em]">{money(wonValue)}</p>
              <p className="font-body text-[12px] text-mist/70">deal value, this period</p>
            </div>
          </div>
        </div>
        {error && <p role="alert" className="mt-3 rounded-[14px] bg-[#F6E3DD] px-4 py-2.5 font-body text-sm text-[#7A2E1E]">{error}</p>}
      </section>

      <section className="overflow-x-auto px-4 pb-10 pt-5 sm:px-6" aria-label="Pipeline">
        <div className="flex min-w-max gap-3 2xl:min-w-0">
          {STAGES.map(stage => {
            const cards = visible.filter(c => c.stage === stage)
            const total = cards.reduce((s, c) => s + (c.value ?? 0), 0)
            return (
              <div key={stage}
                onDragOver={e => { e.preventDefault(); setOver(stage) }}
                onDragLeave={() => setOver(o => (o === stage ? null : o))}
                onDrop={e => {
                  e.preventDefault(); setOver(null)
                  const c = contacts.find(x => x.email === dragging)
                  if (c && c.stage !== stage) save(c, { stage })
                  setDragging(null)
                }}
                className={`flex w-[230px] flex-col rounded-[20px] p-2.5 transition 2xl:w-auto 2xl:min-w-0 2xl:flex-1 ${over === stage ? 'bg-lime/40 ring-2 ring-forest/30' : 'bg-stone'}`}>
                <div className="flex items-baseline justify-between px-1.5 pb-2 pt-1">
                  <p className="font-body text-[14px] font-medium">{stage} <span className="text-ink/45">{cards.length}</span></p>
                  {total > 0 && <p className="font-body text-[12px] text-ink/55">{money(total)}</p>}
                </div>
                <div className="flex min-h-[120px] flex-col gap-2">
                  {cards.map(c => (
                    <button key={c.email} draggable
                      onDragStart={() => setDragging(c.email)} onDragEnd={() => { setDragging(null); setOver(null) }}
                      onClick={() => setOpenEmail(c.email)}
                      className={`rounded-[14px] border bg-white p-3 text-left shadow-sm transition hover:border-forest/30 ${dragging === c.email ? 'opacity-50' : ''} ${c.stage === 'Lost' ? 'border-ink/[0.06] opacity-70' : 'border-ink/[0.08]'}`}>
                      <p className="truncate font-body text-[14px] font-medium">{c.company || c.name}</p>
                      {c.company && <p className="truncate font-body text-[12px] text-ink/60">{c.name}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {c.sources.slice(0, 2).map(s => <span key={s} className="rounded-full bg-bone px-2 py-0.5 font-body text-[11px] text-ink/70">{s}</span>)}
                        {c.tier && !c.sources.includes(c.tier) && <span className="rounded-full bg-lime px-2 py-0.5 font-body text-[11px] text-forest">{c.tier}</span>}
                      </div>
                      <div className="mt-2 flex items-center justify-between font-body text-[11px] text-ink/50">
                        <span>{ago(c.lastActivity)}</span>
                        <span className="flex items-center gap-2">
                          {c.value ? <span className="text-ink/70">{money(c.value)}</span> : null}
                          {c.manual && c.stage === c.manual.stage && <span title={`Stage set by hand by ${c.manual.by}`} className="rounded-full bg-bone px-1.5 py-0.5 text-[10px] text-ink/60">manual</span>}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {open && <Drawer key={open.email} c={open} onClose={() => setOpenEmail(null)} onSave={patch => save(open, patch)} />}
    </div>
  )
}

function Drawer({ c, onClose, onSave }: { c: BoardContact; onClose: () => void; onSave: (p: { stage?: Stage; notes?: string; value?: number | null }) => void }) {
  const [notes, setNotes] = useState(c.crmNotes)
  const [value, setValue] = useState(c.value?.toString() ?? '')
  const field = 'w-full rounded-[12px] border border-ink/[0.12] bg-white px-3 py-2 font-body text-sm focus:border-forest focus:outline-none'
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/20" onClick={onClose} role="dialog" aria-modal="true" aria-label={c.name}>
      <aside className="h-full w-full max-w-[460px] overflow-y-auto bg-bone p-5 shadow-2xl sm:p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{c.company ? 'Company' : 'Contact'}</p>
            <h2 className="mt-1 truncate font-display text-[24px] font-semibold tracking-[-0.02em]">{c.company || c.name}</h2>
            {c.company && <p className="font-body text-[15px] text-ink/65">{c.name}</p>}
          </div>
          <button onClick={onClose} className="rounded-full border border-ink/15 px-3 py-1 font-body text-sm" aria-label="Close">Close</button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`mailto:${c.email}`} className="rounded-full bg-forest px-4 py-2 font-body text-[13px] text-mist">Email</a>
          {c.phone && <a href={`tel:${c.phone}`} className="rounded-full border border-forest/25 px-4 py-2 font-body text-[13px] text-forest">Call</a>}
          {c.planLink && <a href={c.planLink} target="_blank" rel="noopener noreferrer" className="rounded-full border border-forest/25 px-4 py-2 font-body text-[13px] text-forest">View growth plan</a>}
          {c.planLink && <a href={`${c.planLink}&print=1`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-forest/25 px-4 py-2 font-body text-[13px] text-forest">Download PDF</a>}
        </div>

        <dl className="mt-5 grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 font-body text-[13px]">
          <dt className="text-ink/50">Company</dt><dd>{c.company || '—'}</dd>
          <dt className="text-ink/50">Contact</dt><dd>{c.name}</dd>
          <dt className="text-ink/50">Email</dt><dd className="truncate">{c.email}</dd>
          {c.phone && <><dt className="text-ink/50">Phone</dt><dd>{c.phone}</dd></>}
          {c.state && <><dt className="text-ink/50">State</dt><dd>{c.state}</dd></>}
          <dt className="text-ink/50">Source</dt><dd>{c.sources.join(', ') || '—'}</dd>
          {c.revenue && <><dt className="text-ink/50">Revenue</dt><dd>{c.revenue}</dd></>}
          {c.tier && <><dt className="text-ink/50">Recommended</dt><dd>{c.tier}</dd></>}
          {c.score !== null && <><dt className="text-ink/50">Quiz score</dt><dd>{c.score}</dd></>}
          <dt className="text-ink/50">Marketing OK</dt><dd>{c.consent ? 'Yes' : 'No'}</dd>
          <dt className="text-ink/50">First seen</dt><dd>{c.firstSeen ? when(c.firstSeen) : '—'}</dd>
        </dl>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-[16px] border border-ink/[0.08] bg-white p-4">
          <label className="font-body text-[12px] text-ink/60">Stage
            <select value={c.stage} onChange={e => onSave({ stage: e.target.value as Stage })} className={`${field} mt-1`}>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="font-body text-[12px] text-ink/60">Deal value ($)
            <input inputMode="numeric" value={value} onChange={e => setValue(e.target.value.replace(/[^\d]/g, ''))}
              onBlur={() => { const v = value ? Number(value) : null; if (v !== c.value) onSave({ value: v }) }} className={`${field} mt-1`} placeholder="e.g. 5000" />
          </label>
          <p className="col-span-2 font-body text-[12px] text-ink/50">
            {c.manual && c.stage === c.manual.stage ? `Set by hand by ${c.manual.by.split('@')[0]}. Moves on automatically if something newer happens.` : `Set automatically from activity.`}
          </p>
          <label className="col-span-2 font-body text-[12px] text-ink/60">Notes
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => notes !== c.crmNotes && onSave({ notes })} rows={4} className={`${field} mt-1 resize-y`} placeholder="Call notes, next steps…" />
          </label>
        </div>

        {c.plan?.summary && (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Plan summary</p>
            <p className="mt-2 font-body text-[14px] leading-relaxed text-ink/80">{c.plan.summary}</p>
          </div>
        )}

        {Object.keys(c.answers).length > 0 && (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">What they told us</p>
            <dl className="mt-2 space-y-2 font-body text-[13px]">
              {Object.entries(c.answers).map(([q, a]) => <div key={q}><dt className="text-ink/50">{q}</dt><dd className="text-ink/85">{a}</dd></div>)}
            </dl>
            {c.notes && <p className="mt-2 whitespace-pre-line font-body text-[13px] text-ink/80">{c.notes}</p>}
          </div>
        )}

        <div className="mt-5 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Timeline</p>
          <ol className="mt-2 space-y-2 border-l border-ink/10 pl-4">
            {c.events.map((e, i) => (
              <li key={i} className="relative font-body text-[13px]">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-forest" />
                <span className="text-ink/85">{e.label}</span> <span className="text-ink/45">· {when(e.at)}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  )
}
