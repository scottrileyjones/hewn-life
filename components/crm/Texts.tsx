'use client'
import { useMemo, useState } from 'react'
import CrmHeader from './CrmHeader'
import type { Audience, Campaign, Subscriber } from '@/lib/smsMarketing'
import { MARKETING_MAX, marketingText, prettyPhone, segments, sendWindow } from '@/lib/smsText'

const when = (iso: string) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')
const AUDIENCE_HELP: Record<Audience, string> = { Everyone: 'Everyone subscribed', Leads: 'Subscribers who aren’t clients', Clients: 'Current clients only' }

/** HQ → Texts: write a marketing text, test it on our phones, send it to the opted-in list. */
export default function Texts({ user, subscribers, counts, campaigns: initial, configured, teamPhones }: {
  user: string; subscribers: Subscriber[]; counts: Record<Audience, number>; campaigns: Campaign[]; configured: boolean; teamPhones: number
}) {
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<Audience>('Everyone')
  const [campaigns, setCampaigns] = useState(initial)
  const [busy, setBusy] = useState<'' | 'test' | 'send'>('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [confirming, setConfirming] = useState(false)
  const full = marketingText(body || '…')
  const seg = useMemo(() => segments(full), [full])
  const win = sendWindow()
  const active = subscribers.filter(s => s.marketing).length

  async function act(action: 'test' | 'send') {
    setBusy(action); setError(''); setNote(''); setConfirming(false)
    const res = await fetch('/api/crm/texts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, body, audience }) })
    const out = await res.json().catch(() => ({}))
    setBusy('')
    if (!res.ok) { setError(out.error || 'Couldn’t send.'); return }
    if (action === 'test') { setNote(`Test sent to ${out.sent} team phone${out.sent === 1 ? '' : 's'}.`); return }
    setNote(`Sent to ${out.sent}.${out.skipped ? ` ${out.skipped} skipped (texted in the last 24 hours, or failed).` : ''}`)
    setCampaigns(cs => [{ id: `new-${Date.now()}`, message: marketingText(body), audience, sentAt: new Date().toISOString(), sentBy: user, sent: out.sent, skipped: out.skipped }, ...cs])
    setBody('')
  }

  return (
    <div className="min-h-[100dvh] bg-bone text-ink">
      <CrmHeader active="texts" user={user} />
      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Marketing texts</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold tracking-[-0.02em]">Text your list</h1>
          </div>
          <div className="flex gap-2 font-body text-[13px]">
            <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink/[0.08]"><b>{active}</b> subscribed</span>
            <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink/[0.08]"><b>{subscribers.length - active}</b> opted out</span>
          </div>
        </div>
        {!configured && <p className="mt-4 rounded-[14px] bg-[#F6E7D4] px-4 py-2.5 font-body text-[13px] text-[#7A4A12]">Texting isn’t switched on yet. Once the Twilio keys are in Vercel and the number is verified, this page sends.</p>}

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Send to</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-[14px] border border-ink/[0.1] p-1" role="group" aria-label="Audience">
              {(['Everyone', 'Leads', 'Clients'] as const).map(a => (
                <button key={a} type="button" onClick={() => setAudience(a)} aria-pressed={audience === a}
                  className={`rounded-[10px] px-2 py-2 text-left font-body ${audience === a ? 'bg-forest text-mist' : 'hover:bg-bone'}`}>
                  <span className="block text-[14px] font-medium">{a} · {counts[a]}</span>
                  <span className={`block text-[11px] ${audience === a ? 'text-mist/70' : 'text-ink/50'}`}>{AUDIENCE_HELP[a]}</span>
                </button>
              ))}
            </div>

            <label htmlFor="sms-body" className="mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Message</label>
            <textarea id="sms-body" rows={4} maxLength={MARKETING_MAX} value={body} onChange={e => setBody(e.target.value)}
              placeholder="Beta spots are open. Website in a Day for $250 with code BETA250: hewn.life/website-in-a-day"
              className="mt-2 w-full resize-none rounded-[16px] border border-ink/[0.12] px-4 py-3 font-body text-[15px] focus:border-forest focus:outline-none" />
            <div className="mt-1 flex flex-wrap justify-between gap-2 font-body text-[12px] text-ink/55">
              <span>“Hewn Life:” and “Reply STOP to opt out.” are added for you.</span>
              <span className={body.length > MARKETING_MAX - 20 ? 'text-[#7A4A12]' : ''}>{body.length}/{MARKETING_MAX} · {seg.count} text{seg.count === 1 ? '' : 's'} each{!seg.gsm && ' (emoji or special characters use more)'}</span>
            </div>

            {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#F6E3DD] px-3 py-2 font-body text-[13px] text-[#7A2E1E]">{error}</p>}
            {note && <p role="status" className="mt-3 rounded-[12px] bg-[#E4EEDA] px-3 py-2 font-body text-[13px] text-forest">{note}</p>}

            {confirming ? (
              <div className="mt-4 rounded-[16px] bg-bone p-4">
                <p className="font-body text-[14px]">Send this to <b>{counts[audience]}</b> {counts[audience] === 1 ? 'person' : 'people'} now? This can’t be undone.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => act('send')} disabled={!!busy} className="rounded-full bg-forest px-5 py-2 font-body text-[14px] text-mist disabled:opacity-50">{busy === 'send' ? 'Sending…' : 'Yes, send'}</button>
                  <button onClick={() => setConfirming(false)} className="rounded-full px-4 py-2 font-body text-[14px] text-ink/70">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={() => act('test')} disabled={!!busy || !body.trim() || !teamPhones} title={teamPhones ? '' : 'Add your phones to TEAM_SMS_TO in Vercel'}
                  className="rounded-full border border-forest px-5 py-2 font-body text-[14px] text-forest disabled:opacity-40">{busy === 'test' ? 'Sending…' : 'Send me a test'}</button>
                <button onClick={() => setConfirming(true)} disabled={!!busy || !body.trim() || !counts[audience] || !win.open}
                  className="rounded-full bg-forest px-5 py-2 font-body text-[14px] text-mist disabled:opacity-40">Send to {counts[audience]}</button>
                <span className={`ml-auto rounded-full px-2.5 py-1 font-body text-[12px] ${win.open ? 'bg-[#E4EEDA] text-forest' : 'bg-sand text-ink/65'}`}>{win.open ? 'Send window open' : 'Send window closed'} · {win.label}</span>
              </div>
            )}
          </section>

          <div className="space-y-4">
            <section className="rounded-[24px] bg-forest p-5 text-mist sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">How it lands</p>
              <div className="mt-3 max-w-[300px] rounded-[18px] rounded-bl-[6px] bg-mist px-4 py-3 font-body text-[14px] leading-snug text-ink">{full}</div>
              <ul className="mt-4 space-y-1.5 font-body text-[13px] text-mist/80">
                <li>Only people who ticked the texts box get it.</li>
                <li>Nobody gets more than one marketing text a day.</li>
                <li>Sends only between 9am and 6pm Mountain, so it’s daytime in every US time zone.</li>
                <li>Never ask for payment details, passwords or codes by text.</li>
              </ul>
            </section>

            <section className="rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Sent</p>
              {campaigns.length ? (
                <ul className="mt-3 divide-y divide-ink/[0.06]">
                  {campaigns.slice(0, 8).map(c => (
                    <li key={c.id} className="py-2.5">
                      <p className="font-body text-[13px] leading-snug">{c.message}</p>
                      <p className="mt-1 font-body text-[11px] text-ink/50">{when(c.sentAt)} · {c.audience} · {c.sent} sent{c.skipped ? `, ${c.skipped} skipped` : ''} · {c.sentBy.split('@')[0]}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 font-body text-[13px] text-ink/55">Nothing sent yet.</p>}
            </section>
          </div>
        </div>

        <section className="mt-4 rounded-[24px] border border-ink/[0.08] bg-white p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Subscribers</p>
          {subscribers.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left font-body text-[13px]">
                <thead className="text-ink/50"><tr>{['Name', 'Mobile', 'Signed up from', 'Status', 'Last text'].map(h => <th key={h} className="pb-2 font-normal">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {subscribers.map(s => (
                    <tr key={s.id}>
                      <td className="py-2"><b className="font-medium">{s.name || '—'}</b>{s.company && <span className="text-ink/55"> · {s.company}</span>}</td>
                      <td className="py-2 tabular-nums">{prettyPhone(s.mobile)}</td>
                      <td className="py-2 text-ink/70">{s.source}</td>
                      <td className="py-2">{s.marketing ? <span className="rounded-full bg-[#E4EEDA] px-2 py-0.5 text-[11px] text-forest">Subscribed</span> : <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] text-ink/60">Opted out</span>}</td>
                      <td className="py-2 text-ink/60">{when(s.lastText) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="mt-3 font-body text-[13px] text-ink/55">No one yet. People join by ticking the texts box on the ROI calculator, contact form, website brief or client portal.</p>}
        </section>
      </main>
    </div>
  )
}
