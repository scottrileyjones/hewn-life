'use client'
import { useEffect, useMemo, useState } from 'react'
import CrmHeader from './CrmHeader'
import OnboardingPanel from './OnboardingPanel'
import { CLIENT_STATUSES, formatLinks, type ClientStatus, type PortalClient, type PortalMessage } from '@/lib/portal/data'

const when = (iso: string) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')
/** The client wrote after our last message, so they're waiting on us. */
const waiting = (c: PortalClient) => Boolean(c.lastClientMessage && (!c.lastTeamMessage || c.lastClientMessage > c.lastTeamMessage))

type Form = { email: string; name: string; company: string; plan: string; status: ClientStatus; projectStatus: string; nextSteps: string; links: string }
const blank: Form = { email: '', name: '', company: '', plan: '', status: 'Onboarding', projectStatus: '', nextSteps: '', links: '' }
const toForm = (c: PortalClient): Form => ({ email: c.email, name: c.name, company: c.company, plan: c.plan, status: c.status, projectStatus: c.projectStatus, nextSteps: c.nextSteps, links: formatLinks(c.links) })

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

export default function Clients({ user, clients: initial, selected, sampleThread }: { user: string; clients: PortalClient[] | null; selected: string; sampleThread?: PortalMessage[] }) {
  const [clients, setClients] = useState(initial ?? [])
  const [openEmail, setOpenEmail] = useState<string | 'new' | null>(selected || initial?.[0]?.email || null)
  const [form, setForm] = useState<Form>(blank)
  const [thread, setThread] = useState<PortalMessage[]>([])
  const [draft, setDraft] = useState('')
  const [kind, setKind] = useState<'Message' | 'Update'>('Message')
  const [busy, setBusy] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const open = useMemo(() => clients.find(c => c.email === openEmail) ?? null, [clients, openEmail])

  useEffect(() => {
    setNote(''); setError(''); setDraft('')
    setForm(open ? toForm(open) : blank)
    if (!open) { setThread([]); return }
    if (sampleThread) { setThread(sampleThread); return }
    call<{ messages: PortalMessage[] }>({ action: 'thread', email: open.email }).then(r => setThread(r.messages)).catch(e => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEmail])

  async function save(invite = false) {
    setBusy(invite ? 'invite' : 'save'); setError(''); setNote('')
    try {
      const patch = open ? form : { ...form, email: form.email.trim().toLowerCase() }
      const { client } = await call<{ client: PortalClient }>({ action: 'save', id: open?.id ?? null, patch, invite })
      setClients(cs => (open ? cs.map(c => (c.id === client.id ? client : c)) : [...cs, client]).sort((a, b) => a.company.localeCompare(b.company)))
      setOpenEmail(client.email)
      setNote(invite ? `Saved and sent a portal invite to ${client.email}.` : 'Saved. The client sees this the next time they open the portal.')
    } catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }

  async function invite() {
    if (!open) return
    setBusy('invite'); setError(''); setNote('')
    try { await call({ action: 'invite', email: open.email }); setNote(`Portal invite sent to ${open.email}.`) }
    catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }

  async function post(e: React.FormEvent) {
    e.preventDefault()
    if (!open || !draft.trim()) return
    setBusy('post'); setError(''); setNote('')
    try {
      const r = await call<{ message: PortalMessage; alerted: boolean }>({ action: 'post', email: open.email, body: draft, kind })
      setThread(t => [...t, r.message]); setDraft('')
      setClients(cs => cs.map(c => (c.id === open.id ? { ...c, lastTeamMessage: r.message.at } : c)))
      setNote(r.alerted ? `Posted. ${open.name || open.email} got an email alert.` : 'Posted, but the email alert failed.')
    } catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }

  const input = 'w-full rounded-[12px] border border-ink/[0.12] bg-white px-3 py-2 font-body text-[14px] focus:border-forest focus:outline-none'
  const label = 'grid gap-1 font-body text-[12px] text-ink/60'

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <CrmHeader active="clients" user={user} />
      <main className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[20px] border border-ink/[0.08] bg-white">
          <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-3">
            <p className="font-display text-[16px] font-semibold">Portal clients</p>
            <button onClick={() => setOpenEmail('new')} className="rounded-full bg-forest px-3 py-1.5 font-body text-[12px] text-mist">+ Add client</button>
          </div>
          {!initial && <p className="px-4 py-3 font-body text-[13px] text-[#7A2E1E]">Couldn’t load clients from Airtable.</p>}
          <ul className="divide-y divide-ink/[0.06]">
            {clients.map(c => (
              <li key={c.id}>
                <button onClick={() => setOpenEmail(c.email)} className={`flex w-full items-start justify-between gap-2 px-4 py-3 text-left ${openEmail === c.email ? 'bg-bone' : 'hover:bg-bone/60'}`}>
                  <span className="min-w-0">
                    <span className="block truncate font-body text-[14px] font-medium">{c.company || c.name || c.email}</span>
                    <span className="block truncate font-body text-[12px] text-ink/55">{c.name || c.email} · {c.status}</span>
                  </span>
                  {waiting(c) && <span className="mt-1 shrink-0 rounded-full bg-ember px-2 py-0.5 font-body text-[10px] text-white">Replied</span>}
                </button>
              </li>
            ))}
            {!clients.length && initial && <li className="px-4 py-3 font-body text-[13px] text-ink/55">No clients yet. Add one to give them a portal.</li>}
          </ul>
        </aside>

        {openEmail ? (
          <div className="grid content-start gap-4 xl:grid-cols-[1fr_1fr]">
            {open && <OnboardingPanel key={open.id} client={open} sample={!!sampleThread} onChange={c => setClients(cs => cs.map(x => (x.id === c.id ? c : x)))} />}
            <section className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{open ? 'Client' : 'New client'}</p>
                  <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{open ? open.company || open.name || open.email : 'Give a client a portal'}</h1>
                  {open && <p className="font-body text-[12px] text-ink/55">{open.lastLogin ? `Last opened the portal ${when(open.lastLogin)}` : 'Hasn’t opened the portal yet'}</p>}
                </div>
                {open && <button onClick={invite} disabled={!!busy} className="shrink-0 rounded-full border border-forest px-3 py-1.5 font-body text-[12px] text-forest disabled:opacity-50">{busy === 'invite' ? 'Sending…' : 'Send portal link'}</button>}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={label}>Company<input className={input} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></label>
                <label className={label}>Contact name<input className={input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
                <label className={label}>Email (their login)<input className={input} type="email" value={form.email} disabled={!!open} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></label>
                <label className={label}>Plan<input className={input} value={form.plan} placeholder="e.g. Website in a Day, Wrought" onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} /></label>
                <label className={label}>Status
                  <select className={input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ClientStatus }))}>{CLIENT_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
                </label>
                <label className={`${label} sm:col-span-2`}>Where things stand (the big green card)<textarea rows={3} className={input} value={form.projectStatus} onChange={e => setForm(f => ({ ...f, projectStatus: e.target.value }))} /></label>
                <label className={`${label} sm:col-span-2`}>Next steps (one per line)<textarea rows={4} className={input} value={form.nextSteps} onChange={e => setForm(f => ({ ...f, nextSteps: e.target.value }))} /></label>
                <label className={`${label} sm:col-span-2`}>Links (one per line: Label | https://…)<textarea rows={3} className={input} value={form.links} placeholder="Your website | https://example.com" onChange={e => setForm(f => ({ ...f, links: e.target.value }))} /></label>
              </div>
              {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
              {note && <p role="status" className="mt-3 rounded-[12px] bg-[#E4EEDA] px-3 py-2 font-body text-[13px] text-forest">{note}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => save(false)} disabled={!!busy} className="rounded-full bg-forest px-5 py-2 font-body text-[14px] text-mist disabled:opacity-50">{busy === 'save' ? 'Saving…' : 'Save'}</button>
                {!open && <button onClick={() => save(true)} disabled={!!busy} className="rounded-full border border-forest px-5 py-2 font-body text-[14px] text-forest disabled:opacity-50">Save and send invite</button>}
              </div>
            </section>

            {open && (
              <section className="flex flex-col rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Messages and updates</p>
                <div className="mt-3 max-h-[560px] flex-1 space-y-3 overflow-y-auto pr-1">
                  {thread.map(m => (
                    <div key={m.id} className={`flex ${m.from === 'Hewn' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[88%] rounded-[16px] px-3.5 py-2.5 ${m.kind === 'Update' ? 'border border-ember/40 bg-[#F1F8E9]' : m.from === 'Hewn' ? 'bg-forest text-mist' : 'bg-bone'}`}>
                        {m.kind === 'Update' && <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-forest">Update</p>}
                        <p className="whitespace-pre-line font-body text-[14px] leading-relaxed">{m.body}</p>
                        <p className={`mt-1 font-body text-[11px] ${m.from === 'Hewn' && m.kind === 'Message' ? 'text-mist/60' : 'text-ink/50'}`}>{m.from === 'Hewn' ? m.author.split('@')[0] : 'Client'} · {when(m.at)}</p>
                      </div>
                    </div>
                  ))}
                  {!thread.length && <p className="font-body text-[13px] text-ink/55">No messages yet.</p>}
                </div>
                <form onSubmit={post} className="mt-3 border-t border-ink/[0.06] pt-3">
                  <div className="mb-2 flex rounded-full border border-ink/[0.12] bg-white p-0.5 font-body text-[12px]" role="group" aria-label="Post as">
                    {(['Message', 'Update'] as const).map(k => (
                      <button type="button" key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
                        className={`flex-1 rounded-full px-3 py-1.5 ${kind === k ? 'bg-forest text-mist' : 'text-ink/70'}`}>{k === 'Message' ? 'Message' : 'Project update'}</button>
                    ))}
                  </div>
                  <textarea rows={3} value={draft} onChange={e => setDraft(e.target.value)} placeholder={kind === 'Update' ? 'e.g. Your site is live at …' : `Message ${open.name || 'the client'}`}
                    className="w-full resize-none rounded-[14px] border border-ink/[0.12] px-3 py-2.5 font-body text-[14px] focus:border-forest focus:outline-none" />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-body text-[12px] text-ink/50">They get an email alert.</p>
                    <button disabled={busy === 'post' || !draft.trim()} className="rounded-full bg-forest px-4 py-2 font-body text-[13px] text-mist disabled:opacity-50">{busy === 'post' ? 'Posting…' : kind === 'Update' ? 'Post update' : 'Send'}</button>
                  </div>
                </form>
              </section>
            )}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-ink/[0.15] p-8 font-body text-[14px] text-ink/55">Pick a client, or add one to give them a portal.</div>
        )}
      </main>
    </div>
  )
}
