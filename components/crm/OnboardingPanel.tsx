'use client'
import { useMemo, useState } from 'react'
import { PACKAGES, track } from '@/lib/portal/onboarding'
import type { PortalClient } from '@/lib/portal/data'

const when = (iso?: string) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')

async function call<T>(body: object): Promise<T> {
  const res = await fetch('/api/crm/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(out.error || 'Something went wrong.')
  return out as T
}

/** The team's view of a client's onboarding: apply a package, sign steps off, read what they sent, export the build brief. */
export default function OnboardingPanel({ client, onChange, sample }: { client: PortalClient; onChange: (c: PortalClient) => void; sample?: boolean }) {
  const [pkg, setPkg] = useState(client.package)
  const [notify, setNotify] = useState(true)
  const [busy, setBusy] = useState('')
  const [openStep, setOpenStep] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const t = useMemo(() => (client.package ? track(client.package, client.progress) : null), [client.package, client.progress])
  const waitingOnClient = new Set(t?.yourTurn.map(r => r.step.id) ?? [])

  async function run(label: string, body: object, done: (out: { client?: PortalClient; alerted?: boolean; markdown?: string }) => void) {
    if (sample) { setMsg({ ok: false, text: 'Preview only: nothing is saved.' }); return }
    setBusy(label); setMsg(null)
    try { done(await call(body)) } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy('') }
  }

  const applyPackage = () => run('package', { action: 'package', email: client.email, package: pkg }, out => {
    if (out.client) onChange(out.client)
    setMsg({ ok: true, text: 'Onboarding plan applied. The client sees their tracker now.' })
  })

  const signoff = (step: string, done: boolean) => run(step, { action: 'signoff', email: client.email, step, done, notify }, out => {
    if (out.client) onChange(out.client)
    setMsg({ ok: true, text: done ? (out.alerted ? 'Signed off. The client got an email.' : notify ? 'Signed off, but the email failed.' : 'Signed off (no email sent).') : 'Reopened.' })
  })

  const brief = (mode: 'copy' | 'download') => run('brief', { action: 'brief', email: client.email }, async out => {
    if (!out.markdown) return
    if (mode === 'copy') {
      await navigator.clipboard.writeText(out.markdown)
      setMsg({ ok: true, text: 'Build brief copied. Paste it into Claude to start the build.' })
    } else {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([out.markdown], { type: 'text/markdown' }))
      a.download = `${(client.company || client.email).replace(/[^\w]+/g, '-').toLowerCase()}-build-brief.md`
      a.click()
      URL.revokeObjectURL(a.href)
    }
  })

  return (
    <section className="rounded-[20px] border border-ink/[0.08] bg-white p-4 sm:p-5 xl:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Onboarding</p>
          <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em]">{t ? `${t.done} of ${t.total} steps done` : 'No onboarding plan yet'}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-body text-[13px]">
          <select value={pkg} onChange={e => setPkg(e.target.value)} className="rounded-full border border-ink/[0.12] bg-white px-3 py-1.5" aria-label="Package">
            <option value="">Choose package…</option>
            {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={applyPackage} disabled={!pkg || pkg === client.package || !!busy} className="rounded-full bg-forest px-4 py-1.5 text-mist disabled:opacity-40">{client.package ? 'Switch plan' : 'Apply plan'}</button>
          {t && <>
            <button onClick={() => run('import', { action: 'import-brief', email: client.email }, out => { if (out.client) onChange(out.client); setMsg({ ok: true, text: 'Pulled in anything from their Website Brief that wasn’t already filled.' }) })} disabled={!!busy} className="rounded-full px-3 py-1.5 text-forest underline underline-offset-2 disabled:opacity-40">Import website brief</button>
            <button onClick={() => brief('copy')} disabled={!!busy} className="rounded-full border border-forest px-4 py-1.5 text-forest disabled:opacity-40">Copy build brief for Claude</button>
            <button onClick={() => brief('download')} disabled={!!busy} className="rounded-full px-2 py-1.5 text-forest underline underline-offset-2 disabled:opacity-40">.md</button>
          </>}
        </div>
      </div>
      {msg && <p role="status" className={`mt-3 rounded-[12px] px-3 py-2 font-body text-[13px] ${msg.ok ? 'bg-[#E4EEDA] text-forest' : 'bg-[#F6E3DD] text-[#7A2E1E]'}`}>{msg.text}</p>}

      {t && (
        <>
          <div className="mt-4 flex gap-1" aria-hidden>
            {t.rows.map(r => <span key={r.step.id} className={`h-1.5 flex-1 rounded-full ${r.status === 'done' ? 'bg-forest' : r.status === 'submitted' ? 'bg-dawn' : r.status === 'current' ? 'bg-ember' : 'bg-sand'}`} />)}
          </div>
          <label className="mt-3 flex items-center gap-2 font-body text-[13px] text-ink/70">
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} className="accent-forest" /> Email the client when I sign a step off
          </label>
          <ol className="mt-3 divide-y divide-ink/[0.06] rounded-[14px] border border-ink/[0.06]">
            {t.rows.map(({ step, state, status }, i) => {
              const files = client.assets.filter(a => a.name.startsWith(`${step.id}--`))
              const hasSubmission = Boolean(state.submitted)
              return (
                <li key={step.id} className={`px-3 py-2.5 ${status === 'submitted' ? 'bg-[#FBF3E8]' : ''}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-body text-[11px] font-bold ${status === 'done' ? 'bg-forest text-mist' : 'border border-ink/20 text-ink/50'}`}>{status === 'done' ? '✓' : i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-[14px] font-medium">{step.title} <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${step.owner === 'client' ? 'bg-lime/70 text-forest' : 'bg-sand text-ink/60'}`}>{step.owner === 'client' ? 'Client' : 'Hewn'}</span></p>
                      <p className="font-body text-[12px] text-ink/55">
                        {status === 'done' ? `Signed off ${when(state.done)}${state.by ? ` by ${state.by.split('@')[0]}` : ''}`
                          : status === 'submitted' ? `Client sent this ${when(state.submitted)}. Check it, then sign off.`
                          : waitingOnClient.has(step.id) ? 'Open for the client now'
                          : status === 'current' ? (step.owner === 'client' ? 'Waiting on the client' : 'Up now') : 'Coming up'}
                      </p>
                    </div>
                    {hasSubmission && <button onClick={() => setOpenStep(openStep === step.id ? null : step.id)} className="font-body text-[12px] text-forest underline underline-offset-2">{openStep === step.id ? 'Hide' : 'View'} submission</button>}
                    {status === 'done'
                      ? <button onClick={() => signoff(step.id, false)} disabled={!!busy} className="font-body text-[12px] text-ink/50 underline underline-offset-2 disabled:opacity-40">Reopen</button>
                      : <button onClick={() => signoff(step.id, true)} disabled={!!busy} className="rounded-full bg-forest px-3 py-1 font-body text-[12px] text-mist disabled:opacity-40">{busy === step.id ? 'Saving…' : 'Sign off'}</button>}
                  </div>
                  {openStep === step.id && (
                    <div className="mt-2 rounded-[12px] bg-bone p-3 font-body text-[13px]">
                      <dl className="grid gap-2">
                        {step.fields?.filter(f => state.data?.[f.id]).map(f => (
                          <div key={f.id}><dt className="text-[11px] uppercase tracking-[0.12em] text-ink/50">{f.label}</dt><dd className="whitespace-pre-line">{state.data![f.id]}</dd></div>
                        ))}
                      </dl>
                      {files.length > 0 && (
                        <ul className="mt-2 space-y-1">{files.map(a => <li key={a.url}><a href={a.url} target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-2">📎 {a.name.slice(step.id.length + 2)}</a> <span className="text-ink/45">({Math.round(a.size / 1024)} KB)</span></li>)}</ul>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </>
      )}
    </section>
  )
}
