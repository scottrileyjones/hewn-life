/**
 * CRM sign-in: an allowed @hewn.life address gets an emailed link; opening it
 * sets a signed session cookie. Nothing is stored server-side.
 */
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { SITE, layout, button, send } from '@/lib/plans/email'

export const SESSION_COOKIE = 'hewn_crm'
const LINK_MINUTES = 20
const SESSION_DAYS = 30

export const allowedUsers = () =>
  (process.env.CRM_USERS || 'scott@hewn.life,jason@hewn.life').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

const sign = (kind: 'link' | 'session', email: string, expires: number) =>
  createHmac('sha256', process.env.PLAN_SECRET || '').update(`crm-${kind}:${email}:${expires}`).digest('hex').slice(0, 40)

function check(kind: 'link' | 'session', email: string, expires: number, sig: string) {
  if (!process.env.PLAN_SECRET || !allowedUsers().includes(email) || !(expires > Date.now()) || !sig) return false
  const a = Buffer.from(sign(kind, email, expires)), b = Buffer.from(sig)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Email a sign-in link if the address is allowed. Silent either way. */
export async function sendLoginLink(raw: string) {
  const email = raw.trim().toLowerCase()
  if (!allowedUsers().includes(email)) return
  const x = Date.now() + LINK_MINUTES * 60e3
  const url = `${SITE}/api/crm/auth?${new URLSearchParams({ e: email, x: String(x), s: sign('link', email, x) })}`
  await send(email, 'Sign in to the Hewn Life CRM', layout(`
<p>Use the button to sign in to the CRM. The link works for ${LINK_MINUTES} minutes.</p>
<p style="margin:24px 0">${button(url, 'Sign in')}</p>
<p style="font-size:13px;color:#6E736D">Didn’t ask for this? Ignore it; nobody can sign in without this email.</p>`))
}

/** Verify an emailed link and return the cookie to set, or null. */
export function sessionFromLink(email: string, expires: number, sig: string) {
  if (!check('link', email, expires, sig)) return null
  const x = Date.now() + SESSION_DAYS * 864e5
  return { value: `${email}|${x}|${sign('session', email, x)}`, maxAge: SESSION_DAYS * 86400 }
}

/** The signed-in user's email, or null. */
export function currentUser(): string | null {
  const raw = cookies().get(SESSION_COOKIE)?.value
  if (!raw) return null
  const [email, x, sig] = raw.split('|')
  return check('session', email, Number(x), sig) ? email : null
}
