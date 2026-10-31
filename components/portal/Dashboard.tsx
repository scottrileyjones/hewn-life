'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PortalClient, PortalMessage } from '@/lib/portal/data'
import { CAL_URL } from '@/lib/cal'
import { track, type Progress } from '@/lib/portal/onboarding'
import { Timeline, Tracker, YourTurn } from './Onboarding'
import PortalHeader from './PortalHeader'

const when = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const teamName = (author: string) => {
  const n = author.split('@')[0]
  return n ? n[0].toUpperCase() + n.slice(1) : 'Hewn Life'
}

const STATUS_STYLE: Record<PortalClient['status'], string> = {
  Onboarding: 'bg-[#F6E7D4] text-[#7A4A12]',
  Active: 'bg-lime text-forest',
  Paused: 'bg-sand text-ink/70',
  Past: 'bg-sand text-ink/70',
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-6">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{title}</h2>
      {children}
    </section>
  )
}

export default function Dashboard({ client: initialClient, messages: initial, billing, assetCounts }: { client: PortalClient; messages: PortalMessage[]; billing?: string; assetCounts: { total: number; toReview: number } }) {
  const [client, setClient] = useState(initialClient)
  const [messages, setMessages] = useState(initial)
  const t = useMemo(() => (client.package ? track(client.package, client.progress) : null), [client.package, client.progress])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const first = client.name.split(' ')[0] || 'there'
  const updates = messages.filter(m => m.kind === 'Update').slice().reverse()
  const thread = messages.filter(m => m.kind === 'Message')
  const steps = client.nextSteps.split('\n').map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [thread.length])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    setSending(true); setError('')
    const res = await fetch('/api/portal/message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }) })
    const out = await res.json().catch(() => ({}))
    setSending(false)
    if (!res.ok) { setError(out.error || 'Couldn’t send. Try again.'); return }
    setMessages(ms => [...ms, out.message])
    setDraft('')
  }

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <PortalHeader email={client.email} active="overview" toReview={assetCounts.toReview} />

      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{client.company || 'Your account'}{client.plan ? ` · ${client.plan}` : ''}</p>
            <h1 className="mt-1 font-display text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">Welcome back, {first}.</h1>
          </div>
          <span className={`rounded-full px-3 py-1 font-body text-[13px] font-medium ${STATUS_STYLE[client.status]}`}>{client.status}</span>
        </div>
        {billing === 'none' && <p className="mt-4 rounded-[14px] bg-sand px-4 py-2.5 font-body text-sm">We couldn’t find billing for this email. Message us below and we’ll sort it out.</p>}
        {billing === 'error' && <p className="mt-4 rounded-[14px] bg-[#F6E3DD] px-4 py-2.5 font-body text-sm text-[#7A2E1E]">Billing didn’t open. Try again, or message us below.</p>}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {t ? (
              <>
                <Tracker t={t} note={client.projectStatus} />
                <YourTurn t={t} onSaved={out => setClient(c => ({ ...c, progress: out.progress as Progress, assets: out.assets }))} />
              </>
            ) : (
              <section className="rounded-[24px] bg-forest p-6 text-mist sm:p-7">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Where things stand</h2>
                <p className="mt-3 whitespace-pre-line font-display text-[19px] leading-snug tracking-[-0.01em] sm:text-[22px]">
                  {client.projectStatus || 'We’re getting your project set up. Your first update will appear here.'}
                </p>
                {updates[0] && <p className="mt-4 font-body text-[13px] text-mist/70">Last update {when(updates[0].at)}</p>}
              </section>
            )}

            <Card title="Messages">
              <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {thread.map(m => (
                  <div key={m.id} className={`flex ${m.from === 'Client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-[18px] px-4 py-3 ${m.from === 'Client' ? 'rounded-br-[6px] bg-forest text-mist' : 'rounded-bl-[6px] bg-bone'}`}>
                      <p className="whitespace-pre-line font-body text-[15px] leading-relaxed">{m.body}</p>
                      <p className={`mt-1 font-body text-[11px] ${m.from === 'Client' ? 'text-mist/60' : 'text-ink/50'}`}>{m.from === 'Client' ? 'You' : `${teamName(m.author)} · Hewn Life`} · {when(m.at)}</p>
                    </div>
                  </div>
                ))}
                {!thread.length && <p className="font-body text-[14px] text-ink/55">No messages yet. Ask us anything; we usually reply within one business day.</p>}
                <div ref={end} />
              </div>
              <form onSubmit={send} className="mt-4 border-t border-ink/[0.06] pt-4">
                <label htmlFor="portal-msg" className="sr-only">Message</label>
                <textarea id="portal-msg" value={draft} onChange={e => setDraft(e.target.value)} rows={3} placeholder="Write a message to the Hewn Life team"
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(e) }}
                  className="w-full resize-none rounded-[16px] border border-ink/[0.12] bg-white px-4 py-3 font-body text-[15px] focus:border-forest focus:outline-none" />
                {error && <p role="alert" className="mt-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-body text-[12px] text-ink/50">We get an email as soon as you send.</p>
                  <button disabled={sending || !draft.trim()} className="rounded-full bg-forest px-5 py-2.5 font-body text-[14px] font-medium text-mist disabled:opacity-50">{sending ? 'Sending…' : 'Send'}</button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Your assets">
              <p className="mt-3 font-body text-[15px] leading-snug">
                {assetCounts.toReview ? <><b>{assetCounts.toReview}</b> waiting for your review.</> : assetCounts.total ? `${assetCounts.total} files, links and drafts in your library.` : 'Logos, photos, videos, copy, ads and more, all in one place.'}
              </p>
              <a href="/portal/assets" className="mt-3 block w-full rounded-full bg-forest px-4 py-2.5 text-center font-body text-[14px] font-medium text-mist">{assetCounts.toReview ? 'Review now' : 'Open your assets'}</a>
            </Card>
            {t && <Timeline t={t} />}
            {steps.length > 0 && <Card title="Next steps">
              {steps.length ? (
                <ol className="mt-4 space-y-3">
                  {steps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest font-mono text-[10px] font-bold text-mist">{i + 1}</span>
                      <span className="font-body text-[15px] leading-snug">{s}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </Card>}

            {client.links.length > 0 && (
              <Card title="Your links">
                <ul className="mt-3 divide-y divide-ink/[0.06]">
                  {client.links.map(l => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 py-2.5 font-body text-[15px] hover:text-forest">
                        <span>{l.label}</span><span aria-hidden className="text-ink/40">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {updates.length > 0 && (
              <Card title="Updates">
                <ul className="mt-3 space-y-3">
                  {updates.slice(0, 5).map(u => (
                    <li key={u.id} className="border-l-2 border-ember pl-3">
                      <p className="whitespace-pre-line font-body text-[14px] leading-snug">{u.body}</p>
                      <p className="mt-0.5 font-body text-[11px] text-ink/50">{when(u.at)}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card title="Billing and calls">
              <form action="/api/portal/billing" method="post" className="mt-4">
                <button className="w-full rounded-full border border-forest px-4 py-2.5 font-body text-[14px] font-medium text-forest hover:bg-forest hover:text-mist">Invoices, card and plan</button>
              </form>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="mt-2 block w-full rounded-full bg-sand px-4 py-2.5 text-center font-body text-[14px] font-medium hover:bg-oat">Book a call with us</a>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
