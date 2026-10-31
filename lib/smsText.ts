/** Text-message wording and phone helpers, safe to import in the browser (no secrets, no Node modules). */

/** Every text starts with this, so people learn what a real one looks like. */
export const BRAND = 'Hewn Life:'

/** The consent wording shown next to the opt-in box. Stored with each opt-in as the record of what they agreed to. */
export const CONSENT_TEXT = 'I agree to receive text messages from Hewn Life about my project at this number: step updates, items ready for my review and replies to my messages. Message frequency varies. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent is not a condition of purchase.'

export const WELCOME_TEXT = `${BRAND} You're signed up for project texts. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel. We'll never text you asking for payment or codes.`
export const HELP_TEXT = `${BRAND} Project texts from your agency. Help: hello@hewn.life or hewn.life/portal. Msg & data rates may apply. Reply STOP to cancel.`

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
