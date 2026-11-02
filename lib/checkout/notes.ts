/**
 * Stripe caps each metadata value at 500 characters, so checkout notes (up to
 * 2,000) are stored across `notes`, `notes_2`, `notes_3` and `notes_4`.
 */
export const NOTES_MAX = 2000
const CHUNK = 500
const KEYS = ['notes', 'notes_2', 'notes_3', 'notes_4'] as const

/** Splits `notes` into Stripe-sized pieces and trims any other over-long value. */
export function fitMetadata(meta: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(meta)) {
    if ((KEYS as readonly string[]).includes(k)) continue
    out[k] = String(v ?? '').slice(0, CHUNK)
  }
  const notes = String(meta.notes ?? '').slice(0, NOTES_MAX)
  KEYS.forEach((k, i) => { const part = notes.slice(i * CHUNK, (i + 1) * CHUNK); if (part) out[k] = part })
  return out
}

/** Puts split notes back together. */
export const joinNotes = (meta: Record<string, string | undefined> | null | undefined) => KEYS.map(k => meta?.[k] ?? '').join('')
