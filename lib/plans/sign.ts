/** Signed links for plan actions (review, unsubscribe) so tokens alone can't trigger them. */
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const SECRET = () => process.env.PLAN_SECRET || ''

export const newToken = () => randomBytes(16).toString('hex')

export function sign(token: string, action: 'review' | 'unsubscribe') {
  return createHmac('sha256', SECRET()).update(`${action}:${token}`).digest('hex').slice(0, 32)
}

export function verify(token: string, action: 'review' | 'unsubscribe', sig: string | null | undefined) {
  if (!SECRET() || !sig) return false
  const a = Buffer.from(sign(token, action)), b = Buffer.from(sig)
  return a.length === b.length && timingSafeEqual(a, b)
}
