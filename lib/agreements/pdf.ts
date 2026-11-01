/**
 * The signed PDF: the agreement text exactly as signed, a signature block for
 * both parties, and a certificate page with the audit trail and document hash.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { HEWN } from './templates'
import type { Agreement, Signature } from './data'

const W = 612, H = 792, M = 64
const INK = rgb(0.05, 0.05, 0.05), MUTED = rgb(0.42, 0.45, 0.43), FOREST = rgb(0.118, 0.22, 0.149)

/** Standard PDF fonts only cover WinAnsi; swap anything else for a close ASCII stand-in. */
const SWAP: Record<string, string> = { '→': '->', '≤': '<=', '≥': '>=', '✓': 'v', '·': '-', ' ': ' ' }
function clean(font: PDFFont, s: string) {
  let out = ''
  for (const ch of s) {
    const c = SWAP[ch] ?? ch
    try { font.encodeText(c); out += c } catch { out += '?' }
  }
  return out
}

function wrap(font: PDFFont, size: number, text: string, width: number) {
  const words = text.split(/\s+/)
  const rows: string[] = []
  let row = ''
  for (const w of words) {
    const next = row ? `${row} ${w}` : w
    if (font.widthOfTextAtSize(next, size) > width && row) { rows.push(row); row = w } else row = next
  }
  if (row) rows.push(row)
  return rows
}

const when = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Denver', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })

/** `draft` leaves out the certificate page, for review copies that haven't been sent. */
export async function signedPdf(a: Agreement, { draft = false } = {}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.setTitle(a.doc.title); pdf.setAuthor(HEWN.dba); pdf.setSubject(a.title); pdf.setProducer('Hewn Life'); pdf.setCreator('hewn.life')
  const reg = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const ital = await pdf.embedFont(StandardFonts.HelveticaOblique)

  let page: PDFPage = pdf.addPage([W, H])
  let y = H - M
  const pages: PDFPage[] = [page]
  const newPage = () => { page = pdf.addPage([W, H]); pages.push(page); y = H - M }
  const ensure = (h: number) => { if (y - h < M + 20) newPage() }
  const text = (s: string, o: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}) => {
    const font = o.font ?? reg, size = o.size ?? 9.5, indent = o.indent ?? 0, lh = size * 1.42
    for (const row of wrap(font, size, clean(font, s), W - 2 * M - indent)) {
      ensure(lh)
      page.drawText(row, { x: M + indent, y: y - size, size, font, color: o.color ?? INK })
      y -= lh
    }
    y -= o.gap ?? 5
  }

  // Header
  page.drawText('hewn', { x: M, y: y - 16, size: 16, font: bold, color: FOREST })
  page.drawText('life', { x: M + bold.widthOfTextAtSize('hewn', 16), y: y - 16, size: 16, font: ital, color: rgb(0.42, 0.68, 0.24) })
  y -= 34
  text(a.doc.title, { font: bold, size: 15, gap: 8 })
  text(a.doc.parties, { gap: 12 })

  for (const s of a.doc.sections) {
    ensure(40)
    text(s.heading, { font: bold, size: s.heading.startsWith('Order Form') ? 12.5 : 10.5, gap: 4, color: s.heading.startsWith('Order Form') ? FOREST : INK })
    for (const p of s.paragraphs) text(p)
    for (const l of s.list ?? []) text(`•  ${l}`, { indent: 10, gap: 3 })
    y -= 6
  }

  // Signatures
  ensure(190)
  y -= 6
  text('Signatures', { font: bold, size: 12.5, color: FOREST, gap: 8 })
  const col = (x: number, party: string, entity: string, sig: Signature | null) => {
    let yy = y
    const line = (s: string, font = reg, size = 9, color = INK) => { page.drawText(clean(font, s), { x, y: yy - size, size, font, color }); yy -= size * 1.5 }
    line(party, bold, 9, MUTED)
    line(entity, bold, 10)
    yy -= 6
    if (sig) {
      page.drawText(clean(ital, sig.name), { x, y: yy - 20, size: 20, font: ital, color: FOREST })
      yy -= 26
    } else yy -= 26
    page.drawLine({ start: { x, y: yy }, end: { x: x + 210, y: yy }, thickness: 0.6, color: MUTED })
    yy -= 4
    line(sig ? `${sig.name}, ${sig.title}` : 'Name, title', reg, 9)
    line(sig ? `Signed electronically ${when(sig.at)}` : 'Date', reg, 8, MUTED)
    return yy
  }
  const left = col(M, 'HEWN LIFE', `${HEWN.legalName}, dba ${HEWN.dba}`, a.hewnSig)
  const right = col(W / 2 + 10, 'CLIENT', a.deal.clientLegalName || a.company, a.clientSig)
  y = Math.min(left, right) - 10

  // Certificate
  if (!draft) {
  newPage()
  text('Signature certificate', { font: bold, size: 15, gap: 6 })
  text('This page records how and when this agreement was signed. Both signatures were made electronically under the federal ESIGN Act and the Utah Uniform Electronic Transactions Act, after each signer agreed to sign electronically.', { color: MUTED, gap: 12 })
  const kv = (k: string, v: string) => { text(k, { font: bold, size: 8.5, color: MUTED, gap: 1 }); text(v, { gap: 7 }) }
  kv('Document', `${a.title} (ID ${a.id})`)
  kv('Document fingerprint (SHA-256 of the signed text)', a.hash)
  kv('Sent', a.sentAt ? when(a.sentAt) : '')
  if (a.viewedAt) kv('First opened by client', when(a.viewedAt))
  for (const [label, sig] of [['Hewn Life signer', a.hewnSig], ['Client signer', a.clientSig]] as const) {
    if (!sig) continue
    kv(label, `${sig.name}, ${sig.title} · ${sig.email} · ${when(sig.at)} · IP ${sig.ip || 'not recorded'}${sig.ua ? ` · ${sig.ua.slice(0, 140)}` : ''}`)
  }
  kv('How the client signed', `Signed in the Hewn Life client portal after signing in with a one-time link sent to ${a.clientEmail}. The signer reviewed the full agreement, confirmed authority to sign, agreed to sign electronically, and typed their name as their signature.`)
  y -= 4
  text('Event log', { font: bold, size: 10.5, gap: 4 })
  for (const l of a.log.split('\n').filter(Boolean)) {
    const [t, ...rest] = l.split(' · ')
    text(`${Number.isNaN(Date.parse(t)) ? t : when(t)} · ${rest.join(' · ')}`, { size: 8.5, gap: 2 })
  }
  }

  pages.forEach((p, i) => {
    const footer = clean(reg, `${a.title} · ${a.hash.slice(0, 16)} · Page ${i + 1} of ${pages.length}`)
    p.drawText(footer, { x: M, y: 32, size: 7.5, font: reg, color: MUTED })
  })
  return pdf.save()
}
