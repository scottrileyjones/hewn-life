/** Text-message wording and phone helpers, safe to import in the browser (no secrets, no Node modules). */

/** Every text starts with this, so people learn what a real one looks like. */
export const BRAND = 'Hewn Life:'

/** The consent wording shown next to the opt-in box. Stored with each opt-in as the record of what they agreed to. */
export const CONSENT_TEXT = 'I agree to receive text messages from Hewn Life about my project at this number: step updates, items ready for my review and replies to my messages. Message frequency varies. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent is not a condition of purchase.'

export const WELCOME_TEXT = `${BRAND} You're signed up for project texts. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel. We'll never text you asking for payment or codes.`
export const HELP_TEXT = `${BRAND} Project updates and offers you signed up for. Help: hello@hewn.life or hewn.life/legal/sms. Msg & data rates may apply. Reply STOP to cancel.`

/** US/Canada numbers to E.164 (+18015550100). Anything else must already be in +E.164 form. Null if it doesn't look like a phone number. */
export function toE164(raw: string | null | undefined): string | null {
  const s = (raw || '').trim()
  const digits = s.replace(/\D/g, '')
  if (s.startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  if (digits.length === 10 && /^[2-9]/.test(digits)) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

/** +18015550100 → (801) 555-0100 */
export const prettyPhone = (e164: string) => {
  const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164
}

/** Separate, optional consent for promotional texts. Never bundled with the email consent or required to submit. */
export const MARKETING_CONSENT = 'Text me offers and news from Hewn Life. I agree to receive recurring automated marketing texts at the number provided. Consent is not a condition of purchase. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.'

export const MARKETING_WELCOME = `${BRAND} Thanks for subscribing to texts from Hewn Life. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.`

const OPT_OUT = 'Reply STOP to opt out.'
/** A marketing text as it will be sent: brand first, opt-out last. */
export const marketingText = (body: string) => `${BRAND} ${body.trim()} ${OPT_OUT}`
/** Room left for the body so the whole text fits in two segments (2 × 153 characters, plain GSM). */
export const MARKETING_MAX = 306 - `${BRAND}  ${OPT_OUT}`.length

/** Characters outside the basic GSM set force UCS-2, which drops a segment to 70 characters. */
const GSM = /^[A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅå_ÆæßÉ!"#%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]*$/
export function segments(text: string) {
  const gsm = GSM.test(text)
  const single = gsm ? 160 : 70, multi = gsm ? 153 : 67
  return { gsm, count: text.length <= single ? 1 : Math.ceil(text.length / multi) }
}

/**
 * Marketing texts only go out 11am–8pm Eastern, which is 8am–5pm Pacific: inside every
 * continental US time zone's 8am–8pm window (the strictest state rules, e.g. Florida).
 */
export function sendWindow(now = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23' }).format(now))
  return { open: hour >= 11 && hour < 20, label: '9am–6pm Mountain' }
}
