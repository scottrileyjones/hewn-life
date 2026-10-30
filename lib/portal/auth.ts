/**
 * Client portal sign-in: a client in the Portal Clients table gets an emailed
 * link; opening it sets a signed session cookie. Separate from the team's CRM
 * session, so a client cookie never opens HQ or the CRM.
 */
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { SITE, layout, button, send, esc } from '@/lib/plans/email'
import { findClient } from './data'

export const PORTAL_COOKIE = 'hewn_portal'
const LINK_HOURS = 24
const SESSION_DAYS = 60

const sign = (kind: 'link' | 'session', email: string, expires: number) =>
  createHmac('sha256', process.env.PLAN_SECRET || '').update(`portal-${kind}:${email}:${expires}`).digest('hex').slice(0, 40)

function check(kind: 'link' | 'session', email: string, expires: number, sig: string) {
  if (!process.env.PLAN_SECRET || !email || !(expires > Date.now()) || !sig) return false
  const a = Buffer.from(sign(kind, email, expires)), b = Buffer.from(sig)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function loginUrl(email: string) {
  const e = email.trim().toLowerCase()
  const x = Date.now() + LINK_HOURS * 3600e3
  return `${SITE}/api/portal/auth?${new URLSearchParams({ e, x: String(x), s: sign('link', e, x) })}`
}

/** Email a sign-in link if the address belongs to a client. Silent either way. */
export async function sendPortalLink(raw: string) {
  const client = await findClient(raw)
  if (!client || client.status === 'Past') return
  await send(client.email, 'Your Hewn Life client portal link', layout(`
<p>Hi ${esc(client.name.split(' ')[0] || 'there')},</p>
<p>Here’s your link to the Hewn Life client portal. It works for ${LINK_HOURS} hours, and keeps you signed in on this device for ${SESSION_DAYS} days.</p>
<p style="margin:24px 0">${button(loginUrl(client.email), 'Open your portal')}</p>
<p style="font-size:13px;color:#6E736D">Didn’t ask for this? Ignore it; nobody can sign in without this email.</p>`))
}

/** Verify an emailed link and return the cookie to set, or null. */
export function portalSessionFromLink(email: string, expires: number, sig: string) {
  if (!check('link', email, expires, sig)) return null
  const x = Date.now() + SESSION_DAYS * 864e5
  return { value: `${email}|${x}|${sign('session', email, x)}`, maxAge: SESSION_DAYS * 86400 }
}

/** The signed-in client's email, or null. Still check the client exists before showing anything. */
export function currentClientEmail(): string | null {
  const raw = cookies().get(PORTAL_COOKIE)?.value
  if (!raw) return null
  const [email, x, sig] = raw.split('|')
  return check('session', email, Number(x), sig) ? email : null
}
