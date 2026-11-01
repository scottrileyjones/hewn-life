'use client'
import { useEffect, useMemo, useState } from 'react'
import CrmHeader from './CrmHeader'
import { fill, type Flow, type FlowKey, type Step } from '@/lib/flows/defaults'
import type { Run } from '@/lib/flows/engine'

const label = 'block font-body text-[12px] text-ink/65'
const input = 'mt-1 w-full rounded-[10px] border border-ink/[0.14] bg-white px-2.5 py-2 font-body text-[14px] text-ink focus:border-forest focus:outline-none'
const when = (iso: string) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')
const SAMPLE_VARS = { first_name: 'Jane', company: 'Acme Plumbing', plan: 'Website in a Day', checkout_link: 'https://www.hewn.life/checkout?…', portal_link: 'https://www.hewn.life/portal', book_link: 'https://cal.com/hewn-life', pricing_link: 'https://www.hewn.life/pricing' }
const TAGS = ['first_name', 'company', 'plan', 'checkout_link', 'portal_link', 'book_link', 'pricing_link']
const STATUS_STYLE: Record<Run['status'], string> = { Active: 'bg-lime text-forest', Completed: 'bg-[#E4EEDA] text-forest', Exited: 'bg-sand text-ink/65', Unsubscribed: 'bg-[#F6E3DD] text-[#7A2E1E]' }

function waitLabel(h: number) {
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'}`
  const d = Math.round((h / 24) * 10) / 10
  return `${d} day${d === 1 ? '' : 's'}`
}

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/flows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

/** HQ → Flows: lifecycle sequences that send themselves, and who's in each one. */
export default function Flows({ user, flows: initial, sampleRuns }: { user: string; flows: Flow[]; sampleRuns?: Run[] }) {
  const [flows, setFlows] = useState(initial)
  const [key, setKey] = useState<FlowKey>(initial[0].key)
  const flow = flows.find(f => f.key === key)!
  const [draft, setDraft] = useState<Flow>(flow)
  const [open, setOpen] = useState(0)
  const [runs, setRuns] = useState<Run[]>(sampleRuns?.filter(r => r.flow === key) ?? [])
  const [busy, setBusy] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const dirty = JSON.stringify(draft) !== JSON.stringify(flow)

  useEffect(() => {
    setDraft(flows.find(f => f.key === key)!); setOpen(0); setNote(''); setError('')
    if (sampleRuns) { setRuns(sampleRuns.filter(r => r.flow === key)); return }
    call<{ runs: Run[] }>({ action: 'runs', key }).then(r => setRuns(r.runs)).catch(e => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setStep = (i: number, patch: Partial<Step>) => setDraft(d => ({ ...d, steps: d.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) }))
  const move = (i: number, by: number) => setDraft(d => { const s = [...d.steps]; const [x] = s.splice(i, 1); s.splice(i + by, 0, x); return { ...d, steps: s } })

  async function save(status?: Flow['status']) {
    setBusy('save'); setError(''); setNote('')
    try {
      const next = { ...draft, status: status ?? draft.status }
      if (sampleRuns) throw new Error('Preview mode: nothing is saved.')
      const r = await call<{ flow: Flow }>({ action: 'save', flow: next })
      setFlows(fs => fs.map(f => (f.key === key ? { ...f, ...r.flow } : f))); setDraft({ ...draft, ...r.flow })
      setNote(status === 'Active' ? 'Switched on. New people join from now; nothing is sent to anyone retroactively.' : status === 'Paused' ? 'Paused. Nobody new joins and nothing sends until you switch it back on.' : 'Saved.')
    } catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }
  async function act(body: object, done: (r: Record<string, unknown>) => string) {
    setBusy(JSON.stringify(body)); setError(''); setNote('')
    try {
      if (sampleRuns) throw new Error('Preview mode: nothing is sent.')
      setNote(done(await call<Record<string, unknown>>(body)))
    } catch (e) { setError((e as Error).message) } finally { setBusy('') }
  }

  const step = draft.steps[open]
  const preview = useMemo(() => step ? { subject: fill(step.subject, SAMPLE_VARS), body: fill(step.body, SAMPLE_VARS) } : null, [step])
  const active = runs.filter(r => r.status === 'Active').length
  let elapsed = 0

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <CrmHeader active="flows" user={user} />
      <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Lifecycle</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold tracking-[-0.02em]">Flows</h1>
            <p className="mt-1 max-w-[60ch] font-body text-[14px] text-ink/65">Emails and texts that send themselves when something happens, and stop when the person converts or unsubscribes.</p>
          </div>
          <button onClick={() => act({ action: 'run' }, r => `Ran due steps: ${r.sent} sent, ${r.skipped} skipped, ${r.waiting} waiting.`)} disabled={!!busy} className="rounded-full border border-ink/15 bg-white px-4 py-2 font-body text-[13px] disabled:opacity-50">Send due steps now</button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <nav className="min-w-0 space-y-2" aria-label="Flows">
            {flows.map(f => (
              <button key={f.key} onClick={() => setKey(f.key)} aria-current={f.key === key}
                className={`w-full rounded-[18px] border p-4 text-left transition ${f.key === key ? 'border-forest bg-white shadow-sm' : 'border-ink/[0.08] bg-white/60 hover:bg-white'}`}>
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-[16px] font-semibold tracking-[-0.01em]">{f.name}</span>
                  <span className={`rounded-full px-2 py-0.5 font-body text-[11px] font-medium ${f.status === 'Active' ? 'bg-lime text-forest' : 'bg-sand text-ink/60'}`}>{f.status === 'Active' ? 'On' : 'Paused'}</span>
                </span>
                <span className="mt-1 block font-body text-[12px] leading-snug text-ink/55">{f.trigger}</span>
                <span className="mt-1.5 block font-body text-[12px] text-ink/45">{f.steps.length} step{f.steps.length === 1 ? '' : 's'}</span>
              </button>
            ))}
          </nav>

          <div className="min-w-0 space-y-4">
            <section className="rounded-[22px] border border-ink/[0.08] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} aria-label="Flow name" className="w-full bg-transparent font-display text-[22px] font-semibold tracking-[-0.02em] focus:outline-none" />
                  <p className="mt-1 font-body text-[13px] text-ink/65"><b className="font-medium text-ink">Starts when:</b> {draft.trigger} <b className="ml-2 font-medium text-ink">Stops when:</b> {draft.exits}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dirty && <button onClick={() => save()} disabled={!!busy} className="rounded-full border border-forest px-4 py-2 font-body text-[13px] text-forest disabled:opacity-50">{busy === 'save' ? 'Saving…' : 'Save changes'}</button>}
                  {flow.status === 'Active'
                    ? <button onClick={() => save('Paused')} disabled={!!busy} className="rounded-full bg-sand px-4 py-2 font-body text-[13px] disabled:opacity-50">Pause</button>
                    : <button onClick={() => save('Active')} disabled={!!busy} className="rounded-full bg-forest px-4 py-2 font-body text-[13px] text-mist disabled:opacity-50">Switch on</button>}
                </div>
              </div>
              {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
              {note && <p role="status" className="mt-3 rounded-[12px] bg-[#E4EEDA] px-3 py-2 font-body text-[13px] text-forest">{note}</p>}

              <ol className="mt-5 space-y-2">
                {draft.steps.map((s, i) => {
                  elapsed += s.waitHours
                  return (
                    <li key={s.id}>
                      <button onClick={() => setOpen(i)} className={`flex w-full items-center gap-3 rounded-[14px] border px-3 py-2.5 text-left ${open === i ? 'border-forest bg-[#F4F8EF]' : 'border-ink/[0.08] hover:bg-bone'}`}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest font-mono text-[11px] text-mist">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-body text-[14px] font-medium">{s.channel === 'sms' ? `Text: ${s.body.slice(0, 60)}` : s.subject || 'Untitled email'}</span>
                          <span className="block font-body text-[12px] text-ink/55">{s.channel === 'sms' ? 'Text' : 'Email'} · {waitLabel(s.waitHours)} after {i ? 'the last step' : 'they join'} · day {Math.round((elapsed / 24) * 10) / 10}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
              <button onClick={() => { setDraft(d => ({ ...d, steps: [...d.steps, { id: `n${Date.now().toString(36)}`, waitHours: 48, channel: 'email', subject: '', body: 'Hi {{first_name}},\n\n\n\nThe Hewn Life team' }] })); setOpen(draft.steps.length) }} className="mt-2 font-body text-[13px] text-forest underline underline-offset-2">+ Add a step</button>
            </section>

            {step && (
              <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="space-y-3 rounded-[22px] border border-ink/[0.08] bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Step {open + 1}</p>
                    <div className="flex gap-3 font-body text-[12px]">
                      {open > 0 && <button onClick={() => { move(open, -1); setOpen(open - 1) }} className="text-ink/60 underline">Move up</button>}
                      {open < draft.steps.length - 1 && <button onClick={() => { move(open, 1); setOpen(open + 1) }} className="text-ink/60 underline">Move down</button>}
                      {draft.steps.length > 1 && <button onClick={() => { setDraft(d => ({ ...d, steps: d.steps.filter((_, j) => j !== open) })); setOpen(Math.max(0, open - 1)) }} className="text-[#7A2E1E] underline">Delete step</button>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={label}>Wait
                      <div className="mt-1 flex gap-1.5">
                        <input type="number" min={0} aria-label="Wait amount" value={step.waitHours % 24 === 0 && step.waitHours >= 24 ? step.waitHours / 24 : step.waitHours}
                          onChange={e => setStep(open, { waitHours: Math.max(0, Math.round(Number(e.target.value))) * (step.waitHours % 24 === 0 && step.waitHours >= 24 ? 24 : 1) })} className={`${input} mt-0 w-20`} />
                        <select aria-label="Wait unit" value={step.waitHours % 24 === 0 && step.waitHours >= 24 ? 'days' : 'hours'}
                          onChange={e => setStep(open, { waitHours: e.target.value === 'days' ? Math.max(1, Math.round(step.waitHours)) * 24 : Math.max(1, Math.round(step.waitHours / 24)) })} className={`${input} mt-0`}>
                          <option value="hours">hours</option><option value="days">days</option>
                        </select>
                      </div>
                    </div>
                    <label className={label}>Send as
                      <select value={step.channel} onChange={e => setStep(open, { channel: e.target.value as Step['channel'] })} className={input}><option value="email">Email</option><option value="sms">Text (SMS subscribers only)</option></select>
                    </label>
                  </div>
                  {step.channel === 'email' && <label className={label}>Subject<input value={step.subject} onChange={e => setStep(open, { subject: e.target.value })} className={input} /></label>}
                  <label className={label}>{step.channel === 'email' ? 'Email' : 'Text'}<textarea rows={step.channel === 'email' ? 14 : 4} value={step.body} onChange={e => setStep(open, { body: e.target.value })} className={`${input} font-body leading-relaxed`} /></label>
                  <p className="font-body text-[11px] leading-snug text-ink/50">Merge tags: {TAGS.map(t => <code key={t} className="mr-1 rounded bg-bone px-1">{`{{${t}}}`}</code>)}. A link on its own line becomes a button.{step.channel === 'sms' ? ' “Hewn Life:” and the STOP line are added; texts only go to people who opted in to texts, between 9am and 6pm Mountain.' : ' An unsubscribe link is added to every email.'}</p>
                  <div className="flex flex-wrap gap-2">
                    {dirty && <button onClick={() => save()} disabled={!!busy} className="rounded-full bg-forest px-4 py-2 font-body text-[13px] text-mist disabled:opacity-50">Save changes</button>}
                    <button onClick={() => act({ action: 'test', key, index: open }, r => `Test sent to ${r.to}.`)} disabled={!!busy || dirty} title={dirty ? 'Save first' : ''} className="rounded-full border border-ink/15 px-4 py-2 font-body text-[13px] disabled:opacity-40">Send me a test</button>
                  </div>
                </div>

                <div className="rounded-[22px] border border-ink/[0.08] bg-[#F7F6F3] p-4 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Preview · for a sample person</p>
                  {step.channel === 'email' ? (
                    <div className="mt-3 overflow-hidden rounded-[16px] bg-white shadow-sm">
                      <div className="border-b border-ink/[0.06] px-4 py-3 font-body text-[13px]"><span className="text-ink/50">Subject:</span> <b className="font-medium">{preview?.subject || '(no subject)'}</b></div>
                      <div className="bg-forest px-5 py-3 font-display text-[16px] font-bold text-mist">hewn<span className="italic text-ember">life</span></div>
                      <div className="whitespace-pre-line px-5 py-4 font-body text-[14px] leading-relaxed text-ink/85">{preview?.body}</div>
                      <p className="px-5 pb-4 font-body text-[11px] text-ink/45">You’re receiving this because you were in touch with Hewn Life. Unsubscribe</p>
                    </div>
                  ) : (
                    <div className="mt-3 max-w-[300px] rounded-[18px] rounded-bl-[6px] bg-white px-4 py-3 font-body text-[14px] leading-snug shadow-sm">Hewn Life: {preview?.body} Reply STOP to opt out.</div>
                  )}
                </div>
              </section>
            )}

            <section className="rounded-[22px] border border-ink/[0.08] bg-white p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">People in this flow · {active} active</p>
              {runs.length ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left font-body text-[13px]">
                    <thead className="text-ink/50"><tr>{['Person', 'Progress', 'Next step', 'Status', ''].map(h => <th key={h} className="pb-2 font-normal">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-ink/[0.06]">
                      {runs.map(r => (
                        <tr key={r.id}>
                          <td className="py-2"><b className="font-medium">{r.name || r.email}</b>{r.company && <span className="text-ink/55"> · {r.company}</span>}<span className="block text-[12px] text-ink/50">{r.email}</span></td>
                          <td className="py-2 text-ink/70">{Math.min(r.step, flow.steps.length)} of {flow.steps.length} sent</td>
                          <td className="py-2 text-ink/70">{r.status === 'Active' ? when(r.nextAt) : '—'}</td>
                          <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-[11px] ${STATUS_STYLE[r.status]}`}>{r.status}</span></td>
                          <td className="py-2 text-right">{r.status === 'Active' && <button onClick={() => act({ action: 'remove', id: r.id }, () => { setRuns(rs => rs.map(x => (x.id === r.id ? { ...x, status: 'Exited' } : x))); return `Removed ${r.email} from this flow.` })} className="text-ink/55 underline">Remove</button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="mt-3 font-body text-[13px] text-ink/55">{flow.status === 'Active' ? 'Nobody yet. People join automatically when this flow’s trigger happens.' : 'Switch this flow on and people start joining when its trigger happens.'}</p>}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
