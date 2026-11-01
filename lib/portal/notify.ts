/**
 * Alerts for the client portal: to the client when we post, to us when they do.
 * Every alert is an email; it's also a text when the client opted in to texts
 * (or, for team alerts, when TEAM_SMS_TO lists our phones). Texts only ever say
 * what happened and point to the portal: never money, links to pay, or codes.
 */
import { SITE, REVIEWER, layout, button, send, esc } from '@/lib/plans/email'
import { BRAND, sendSms, textTeam } from '@/lib/sms'
import { loginUrl } from './auth'
import type { PortalClient, PortalMessage } from './data'

const PORTAL = 'hewn.life/portal'
const HQ = 'hewn.life/hq/clients'
const short = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)
const nameOf = (c: PortalClient) => c.company || c.name || c.email

/** Text the client if they opted in. Never throws. */
async function textClient(c: PortalClient, body: string) {
  if (!c.smsOptIn || !c.mobile) return
  await sendSms(c.mobile, `${BRAND} ${body}`).catch(err => console.error('Client text failed:', err))
}
const team = (body: string) => textTeam(`${BRAND} ${body}`)

const paragraphs = (body: string) =>
  body.split(/\n{2,}/).map(p => `<p style="margin:0 0 12px">${esc(p).replace(/\n/g, '<br>')}</p>`).join('')

/** To the client. The button signs them straight in, so a reply is one click away. */
export async function notifyClient(c: PortalClient, m: PortalMessage) {
  const update = m.kind === 'Update'
  const html = layout(`
<p>Hi ${esc(c.name.split(' ')[0] || 'there')},</p>
<p>${update ? 'There’s a new update on your project' : 'You have a new message from the Hewn Life team'} in your client portal:</p>
<div style="margin:16px 0;padding:16px 18px;border-left:3px solid #1E3826;background:#F4F2EC;border-radius:8px">${paragraphs(m.body)}</div>
<p style="margin:24px 0">${button(loginUrl(c.email), update ? 'View the update' : 'Reply in your portal')}</p>
<p style="margin:0">The Hewn Life team</p>`)
  await Promise.all([
    send(c.email, update ? 'New update on your project' : 'New message from Hewn Life', html),
    textClient(c, `${update ? 'New update on your project' : 'New message from the team'}. Read it at ${PORTAL}`),
  ])
}

/** To the team inbox, with a link to the client in HQ. */
export async function notifyTeam(c: PortalClient, m: PortalMessage) {
  const who = `${c.name || c.email}${c.company ? `, ${c.company}` : ''}`
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Client portal message</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(who)}</h1>
<div style="margin:0 0 16px;padding:16px 18px;border-left:3px solid #D6F28B;background:#F4F2EC;border-radius:8px">${paragraphs(m.body)}</div>
<p style="margin:24px 0">${button(`${SITE}/hq/clients?c=${encodeURIComponent(c.email)}`, 'Reply in HQ')}</p>`)
  await Promise.all([send(REVIEWER, `Portal message from ${who}`, html), team(`${short(c.company || c.name || c.email, 40)} sent a message: "${short(m.body, 90)}" ${HQ}`)])
}

/** To the team: a client sent their part of an onboarding step. */
export async function notifyTeamStep(c: PortalClient, stepTitle: string) {
  const who = `${c.name || c.email}${c.company ? `, ${c.company}` : ''}`
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Onboarding · ready to sign off</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(who)} sent “${esc(stepTitle)}”</h1>
<p>Check it in HQ and sign the step off so their tracker moves on.</p>
<p style="margin:24px 0">${button(`${SITE}/hq/clients?c=${encodeURIComponent(c.email)}`, 'Review in HQ')}</p>`)
  await Promise.all([send(REVIEWER, `${c.company || c.name || c.email} sent: ${stepTitle}`, html), team(`${short(nameOf(c), 40)} sent "${short(stepTitle, 50)}". Ready to sign off: ${HQ}`)])
}

/** To the client: we signed off a step. Says what's next, and flags it if the next move is theirs. */
export async function notifyClientStep(c: PortalClient, doneTitle: string, next: { title: string; theirs: boolean } | null, progress: { done: number; total: number }) {
  const html = layout(`
<p>Hi ${esc(c.name.split(' ')[0] || 'there')},</p>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Step ${progress.done} of ${progress.total} done</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">✓ ${esc(doneTitle)}</h1>
${next
    ? `<p>${next.theirs ? `<b>Your turn:</b> ${esc(next.title)}. It’s waiting for you in your portal.` : `Up next: <b>${esc(next.title)}</b>. We’re on it.`}</p>`
    : '<p>That was the last step. Your project is complete. Thank you!</p>'}
<p style="margin:24px 0">${button(loginUrl(c.email), next?.theirs ? 'Do your next step' : 'See your progress')}</p>
<p style="margin:0">The Hewn Life team</p>`)
  await Promise.all([
    send(c.email, next?.theirs ? `Done: ${doneTitle}. Your turn next` : `Done: ${doneTitle}`, html),
    textClient(c, `"${short(doneTitle, 50)}" is done (${progress.done}/${progress.total}).${next?.theirs ? ` Your turn: ${short(next.title, 50)}.` : ''} ${PORTAL}`),
  ])
}

/** To the client: we sent something for review, or put it live. */
export async function notifyClientAsset(c: PortalClient, a: { title: string; category: string; liveLink?: string }, kind: 'review' | 'live') {
  const review = kind === 'review'
  const html = layout(`
<p>Hi ${esc(c.name.split(' ')[0] || 'there')},</p>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">${esc(a.category)}</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${review ? 'Ready for your review' : 'Now live'}: ${esc(a.title)}</h1>
<p>${review ? 'Have a look in your portal and approve it, or tell us what to change.' : `It’s live${a.liveLink ? ` at <a href="${esc(a.liveLink)}" style="color:#1E3826">${esc(a.liveLink)}</a>` : ''}.`}</p>
<p style="margin:24px 0">${button(`${loginUrl(c.email)}&next=assets`, review ? 'Review it' : 'See it in your portal')}</p>
<p style="margin:0">The Hewn Life team</p>`)
  await Promise.all([
    send(c.email, review ? `For your review: ${a.title}` : `Live: ${a.title}`, html),
    textClient(c, review ? `"${short(a.title, 60)}" is ready for your review: ${PORTAL}/assets` : `"${short(a.title, 60)}" is now live. ${PORTAL}/assets`),
  ])
}

/** To the team: a client uploaded, approved or asked for changes. */
export async function notifyTeamAsset(c: PortalClient, a: { title: string; category: string }, kind: 'uploaded' | 'Approved' | 'Changes requested', comment = '') {
  const who = `${c.name || c.email}${c.company ? `, ${c.company}` : ''}`
  const verb = kind === 'uploaded' ? 'added an asset' : kind === 'Approved' ? 'approved' : 'asked for changes on'
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Assets · ${esc(a.category)}</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(who)} ${verb}: ${esc(a.title)}</h1>
${comment ? `<div style="margin:0 0 16px;padding:16px 18px;border-left:3px solid #D6F28B;background:#F4F2EC;border-radius:8px">${paragraphs(comment)}</div>` : ''}
<p style="margin:24px 0">${button(`${SITE}/hq/clients?c=${encodeURIComponent(c.email)}`, 'Open in HQ')}</p>`)
  await Promise.all([send(REVIEWER, `${c.company || c.name || c.email} ${verb}: ${a.title}`, html), team(`${short(nameOf(c), 40)} ${verb}: ${short(a.title, 60)}. ${HQ}`)])
}

/** To the client: one or more posts are ready for them to review. */
export async function notifyClientPosts(c: PortalClient, posts: { title: string; scheduledAt: string; platforms: string[] }[]) {
  const when = (iso: string) => iso ? new Date(iso).toLocaleString('en-US', { timeZone: 'America/Denver', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Not scheduled yet'
  const rows = posts.slice(0, 12).map(p => `<li style="margin:0 0 6px"><b>${esc(p.title)}</b><br><span style="color:#6E736D;font-size:13px">${esc(when(p.scheduledAt))} · ${esc(p.platforms.join(', '))}</span></li>`).join('')
  const html = layout(`
<p>Hi ${esc(c.name.split(' ')[0] || 'there')},</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${posts.length === 1 ? 'A post is' : `${posts.length} posts are`} ready for your review</h1>
<ul style="padding-left:18px;margin:0 0 16px">${rows}</ul>
<p>Approve them in your content calendar, or tell us what to change. Nothing posts until it’s approved.</p>
<p style="margin:24px 0">${button(`${loginUrl(c.email)}&next=calendar`, 'Review in your calendar')}</p>
<p style="margin:0">The Hewn Life team</p>`)
  await Promise.all([
    send(c.email, posts.length === 1 ? `For your review: ${posts[0].title}` : `${posts.length} posts ready for your review`, html),
    textClient(c, `${posts.length === 1 ? 'A post is' : `${posts.length} posts are`} ready for your review: ${PORTAL}/calendar`),
  ])
}

/** To the team: a client approved a post or asked for changes. */
export async function notifyTeamPost(c: PortalClient, p: { title: string }, decision: 'Approved' | 'Changes requested', comment = '') {
  const who = `${c.name || c.email}${c.company ? `, ${c.company}` : ''}`
  const verb = decision === 'Approved' ? 'approved' : 'asked for changes on'
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Content calendar</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(who)} ${verb}: ${esc(p.title)}</h1>
${comment ? `<div style="margin:0 0 16px;padding:16px 18px;border-left:3px solid #D6F28B;background:#F4F2EC;border-radius:8px">${paragraphs(comment)}</div>` : ''}
<p style="margin:24px 0">${button(`${SITE}/hq/calendar?c=${encodeURIComponent(c.email)}`, 'Open the calendar')}</p>`)
  await Promise.all([send(REVIEWER, `${c.company || c.name || c.email} ${verb}: ${p.title}`, html), team(`${short(nameOf(c), 40)} ${verb} post "${short(p.title, 50)}". hewn.life/hq/calendar`)])
}

/** To the client: an agreement is ready to sign. The button signs them in and opens it. */
export async function notifyClientAgreement(c: PortalClient, a: { id: string; title: string; product: string }) {
  const html = layout(`
<p>Hi ${esc(c.name.split(' ')[0] || 'there')},</p>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Agreement · ${esc(a.product)}</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">Your agreement is ready to sign</h1>
<p>We’ve signed our side. Read it through in your portal and sign with your name; it takes a couple of minutes. You’ll get a signed PDF by email straight after.</p>
<p style="margin:24px 0">${button(`${loginUrl(c.email)}&next=agreement-${a.id}`, 'Review and sign')}</p>
<p style="margin:0">Questions about anything in it? Reply to this email.</p>
<p style="margin:16px 0 0">The Hewn Life team</p>`)
  await Promise.all([
    send(c.email, `Please sign: ${a.title}`, html),
    textClient(c, `Your agreement is ready to sign: ${PORTAL}`),
  ])
}

/** After signing: the signed PDF to the client and to us. */
export async function notifyAgreementSigned(c: PortalClient, a: { title: string; signer: string }, pdf: { filename: string; content: string }, payUrl: string | null) {
  const client = layout(`
<p>Hi ${esc(c.name.split(' ')[0] || 'there')},</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">Signed. Welcome aboard.</h1>
<p>Your signed copy of <b>${esc(a.title)}</b> is attached, with a certificate page showing when and how each of us signed. It’s also in your portal.</p>
${payUrl ? `<p>Last step: set up billing so we can start.</p><p style="margin:24px 0">${button(`${SITE}${payUrl}`, 'Set up billing')}</p>` : `<p style="margin:24px 0">${button(loginUrl(c.email), 'Open your portal')}</p>`}
<p style="margin:0">The Hewn Life team</p>`)
  const internal = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Agreement signed</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(c.company || c.name || c.email)} signed ${esc(a.title)}</h1>
<p>Signed by ${esc(a.signer)}. The signed PDF is attached and saved in Airtable.${payUrl ? ' They were sent on to checkout.' : ' Send the first invoice if it isn’t paid yet.'}</p>
<p style="margin:24px 0">${button(`${SITE}/hq/clients?c=${encodeURIComponent(c.email)}`, 'Open in HQ')}</p>`)
  await Promise.all([
    send(c.email, `Signed: ${a.title}`, client, {}, [pdf]),
    send(REVIEWER, `Signed: ${a.title}`, internal, {}, [pdf]),
    team(`${short(nameOf(c), 40)} signed their agreement. ${HQ}`),
  ])
}

/** Internal documents: ask a team member to sign, in HQ. */
export async function notifySignRequest(to: { name: string; email: string }, d: { id: string; title: string }) {
  const html = layout(`
<p>Hi ${esc(to.name.split(' ')[0] || 'there')},</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">Please sign: ${esc(d.title)}</h1>
<p>It’s ready in HQ. Read it through and sign with your name; you’ll both get the signed PDF once everyone has signed.</p>
<p style="margin:24px 0">${button(`${SITE}/hq/documents/${d.id}`, 'Review and sign')}</p>`)
  await send(to.email, `Please sign: ${d.title}`, html)
}

/** Internal documents: everyone has signed, so send each signer the PDF. */
export async function notifyDocSigned(signers: { name: string; email: string }[], d: { title: string }, pdf: { filename: string; content: string }) {
  const html = layout(`
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">Signed: ${esc(d.title)}</h1>
<p>Everyone has signed. The signed PDF is attached, with a certificate page showing when and how each of you signed. It’s also in HQ → Docs.</p>`)
  await Promise.all(signers.map(s => send(s.email, `Signed: ${d.title}`, html, {}, [pdf])))
}

/** An à la carte order, to us. (The buyer gets their portal welcome email, which asks for what we need.) */
export async function notifyAddonOrder(o: { email: string; name?: string; company?: string; phone?: string; items: { name: string; detail: string }[]; amount: number; notes?: string }) {
  const list = o.items.map(i => `<li style="margin:0 0 8px"><strong>${esc(i.name)}</strong><br><span style="color:#6E736D">${esc(i.detail)}</span></li>`).join('')
  const total = `$${(o.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  const internal = layout(`<p><strong>New add-on order: ${total}</strong></p><p>${esc(o.name || '')}${o.company ? `, ${esc(o.company)}` : ''}<br>${esc(o.email)}${o.phone ? `<br>${esc(o.phone)}` : ''}</p><ul style="padding-left:18px">${list}</ul>${o.notes ? `<p><strong>Notes:</strong> ${esc(o.notes)}</p>` : ''}<p>Their portal asks for everything we need; you’ll get a note as each answer comes in. HQ → Clients.</p>`)
  await Promise.allSettled([
    send(REVIEWER, `Add-on order: ${o.company || o.name || o.email} (${total})`, internal, { 'Reply-To': o.email }),
    team(`New add-on order, ${total}: ${short(o.items.map(i => i.name).join(' + '), 90)} for ${short(o.company || o.name || o.email, 40)}.`),
  ])
}

/** After checkout payment: their countersigned agreement, to them and to us. */
export async function notifyCheckoutAgreement(a: { title: string; clientEmail: string; signer: string; company: string }, pdf: { filename: string; content: string }) {
  const first = esc(a.signer.split(/[\s,]+/)[0] || 'there')
  const client = layout(`
<p>Hi ${first},</p>
<p>Here’s your signed copy of <b>${esc(a.title)}</b> for your records, countersigned by Hewn Life, with a certificate page showing when and how it was signed. It’s also in your portal under Agreements.</p>
<p style="margin:24px 0">${button(loginUrl(a.clientEmail), 'Open your portal')}</p>
<p style="margin:0">The Hewn Life team</p>`)
  const internal = layout(`<p><strong>${esc(a.company || a.clientEmail)} signed and paid: ${esc(a.title)}</strong></p><p>Signed at checkout by ${esc(a.signer)}. The signed PDF is attached and saved in Airtable.</p>`)
  await Promise.allSettled([
    send(a.clientEmail, `Your signed agreement: ${a.title}`, client, {}, [pdf]),
    send(REVIEWER, `Signed at checkout: ${a.title}`, internal, {}, [pdf]),
  ])
}
