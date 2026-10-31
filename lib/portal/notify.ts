/** Email alerts for the client portal: to the client when we post, to us when they do. */
import { SITE, REVIEWER, layout, button, send, esc } from '@/lib/plans/email'
import { loginUrl } from './auth'
import type { PortalClient, PortalMessage } from './data'

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
  await send(c.email, update ? 'New update on your project' : 'New message from Hewn Life', html)
}

/** To the team inbox, with a link to the client in HQ. */
export async function notifyTeam(c: PortalClient, m: PortalMessage) {
  const who = `${c.name || c.email}${c.company ? `, ${c.company}` : ''}`
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Client portal message</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(who)}</h1>
<div style="margin:0 0 16px;padding:16px 18px;border-left:3px solid #D6F28B;background:#F4F2EC;border-radius:8px">${paragraphs(m.body)}</div>
<p style="margin:24px 0">${button(`${SITE}/hq/clients?c=${encodeURIComponent(c.email)}`, 'Reply in HQ')}</p>`)
  await send(REVIEWER, `Portal message from ${who}`, html)
}

/** To the team: a client sent their part of an onboarding step. */
export async function notifyTeamStep(c: PortalClient, stepTitle: string) {
  const who = `${c.name || c.email}${c.company ? `, ${c.company}` : ''}`
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Onboarding · ready to sign off</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0D0D0D">${esc(who)} sent “${esc(stepTitle)}”</h1>
<p>Check it in HQ and sign the step off so their tracker moves on.</p>
<p style="margin:24px 0">${button(`${SITE}/hq/clients?c=${encodeURIComponent(c.email)}`, 'Review in HQ')}</p>`)
  await send(REVIEWER, `${c.company || c.name || c.email} sent: ${stepTitle}`, html)
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
  await send(c.email, next?.theirs ? `Done: ${doneTitle}. Your turn next` : `Done: ${doneTitle}`, html)
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
  await send(c.email, review ? `For your review: ${a.title}` : `Live: ${a.title}`, html)
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
  await send(REVIEWER, `${c.company || c.name || c.email} ${verb}: ${a.title}`, html)
}
