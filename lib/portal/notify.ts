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
