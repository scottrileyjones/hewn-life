/**
 * Internal documents signed by two team members in HQ (e.g. the founding
 * documents): the text comes from an existing document, and each signer signs
 * in one or more capacities. Stored in the Agreements table like client
 * agreements; "Hewn signature" holds signer A and "Client signature" signer B.
 */
import type { Doc, Section } from './templates'
import type { Agreement } from './data'

export type Signer = {
  name: string
  email: string
  title: string
  /** The signature blocks this person signs, e.g. ["Hewn Holdings LLC, by its Manager", "Member (Class A)"]. */
  capacities: string[]
  /** Ask for a notice address when signing. */
  askAddress?: boolean
}
export type InternalTerms = { kind: 'internal'; signers: [Signer, Signer] }

export const internalTerms = (a: Pick<Agreement, 'deal'>): InternalTerms | null => {
  const t = a.deal as unknown as Partial<InternalTerms>
  return t?.kind === 'internal' && Array.isArray(t.signers) ? (t as InternalTerms) : null
}

const clean = (s: string) => s.replace(/\\([_*#\-.])/g, '$1').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()

/**
 * Turn a Google Docs markdown export into a Doc: "#" is the title, the first
 * "##" plus the opening paragraph become the parties line, each later "##" is a
 * section, "-" lines and table rows (labelled with their column headers) become "•" lines kept in order.
 * The "Signatures" section keeps only its first sentence; signature blocks are
 * generated from the signers. `fills` replaces blanks, e.g. { "on ____": "on October 28, 2026" }.
 */
export function docFromMarkdown(md: string, fills: Record<string, string> = {}): Doc {
  for (const [from, to] of Object.entries(fills)) md = md.split(from).join(to)
  const lines = md.split('\n')
  let title = '', parties: string[] = []
  const sections: Section[] = []
  let cur: Section | null = null
  let tableHead = true
  let header: string[] = []
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('# ')) { title = clean(line.slice(2)); continue }
    if (line.startsWith('## ')) {
      const h = clean(line.slice(3))
      if (!sections.length && !cur && !parties.length) { parties.push(h); continue }
      cur = { heading: h, paragraphs: [] }; sections.push(cur); tableHead = true; continue
    }
    const t = line.trim()
    if (!t) continue
    if (/^\|/.test(t)) {
      if (/^\|[\s:|-]+\|$/.test(t)) continue // separator row
      const cells = t.split('|').slice(1, -1).map(clean)
      if (!cells.some(Boolean)) continue
      // The header row labels each value in the rows below it.
      if (tableHead) { header = cells; tableHead = false; continue }
      const target = cur ?? sections[sections.length - 1]
      if (target) target.paragraphs.push(`•  ${cells.map((c, i) => (c ? (header[i] ? `${header[i]}: ${c}` : c) : '')).filter(Boolean).join(' · ')}`)
      continue
    }
    // Bullets stay in place among the paragraphs, so a list never moves below later clauses.
    if (/^[-*]\s/.test(t)) { if (cur) cur.paragraphs.push(`•  ${clean(t.slice(2))}`); continue }
    if (!cur) { parties.push(clean(t)); continue }
    if (cur.heading === 'Signatures') { if (!cur.paragraphs.length) cur.paragraphs.push(clean(t)); continue }
    cur.paragraphs.push(clean(t))
  }
  return { title, parties: parties.join(' '), sections }
}
