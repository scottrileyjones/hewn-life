/** Shared by the forms (live hint) and the CRM (review flag). */
const BUSINESS_WORDS = /\b(llc|inc|co|corp|company|group|studio|shop|services?|solutions|agency|club|league|team|law|dental|clinic|homes?|realty|media|labs?|design|construction|plumbing|roofing|fitness|salon|cafe|bakery|church|school|academy|association|foundation|partners|holdings|enterprises?)\b/i
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 1)

/**
 * The business name looks like (part of) a person's name: "Jason Athay" + "Athay",
 * or a one-word name next to a one-word business name ("Jason" + "Athay"),
 * which is usually a first and last name typed into two boxes.
 */
export function looksLikeName(name: string, company: string): boolean {
  const co = words(company), n = words(name)
  if (!co.length || BUSINESS_WORDS.test(company)) return false
  if (co.length <= 2 && co.every(w => n.includes(w))) return true
  return n.length === 1 && co.length === 1 && /^[A-Za-z'-]+$/.test(company.trim())
}
