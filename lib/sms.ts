/**
 * Text messages through Twilio. Off until TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
 * and TWILIO_FROM are set; until then every send is a quiet no-op. Callers treat
 * a failed text as non-fatal: the email alongside it is the record.
 */
import { createHmac, timingSafeEqual } from 'crypto'
import { toE164 } from './smsText'

export { BRAND, CONSENT_TEXT, WELCOME_TEXT, HELP_TEXT, toE164, prettyPhone } from './smsText'

const SID = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN
const FROM = process.env.TWILIO_FROM

export const smsConfigured = () => Boolean(SID && TOKEN && FROM)

/** Send one text. Returns false when texting isn't configured or the number is bad; throws on a Twilio error. */
export async function sendSms(to: string, body: string): Promise<boolean> {
  const number = toE164(to)
  if (!smsConfigured() || !number) return false
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: number, From: FROM!, Body: body.slice(0, 600) }),
  })
  if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`)
  return true
}

/** Team phones for internal alerts, from TEAM_SMS_TO (comma-separated). */
export const teamNumbers = () => (process.env.TEAM_SMS_TO || '').split(',').map(toE164).filter((n): n is string => !!n)

/** Text everyone on the team. Never throws. */
export async function textTeam(body: string) {
  await Promise.all(teamNumbers().map(n => sendSms(n, body).catch(err => console.error('Team text failed:', err))))
}

/** Checks the X-Twilio-Signature on an inbound webhook: HMAC-SHA1 of the URL plus the sorted form params, keyed by the auth token. */
export function validTwilioSignature(url: string, params: Record<string, string>, signature: string | null): boolean {
  if (!TOKEN || !signature) return false
  const data = url + Object.keys(params).sort().map(k => k + params[k]).join('')
  const expected = createHmac('sha1', TOKEN).update(data).digest('base64')
  const a = Buffer.from(expected), b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}
