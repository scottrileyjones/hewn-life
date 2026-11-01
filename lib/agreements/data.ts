/**
 * Agreements in Airtable: each row freezes the exact text that was sent (Body)
 * with its SHA-256 (Hash), both signatures with their audit details, an event
 * log, and the signed PDF once the client signs.
 */
import { createHash } from 'crypto'
import { docText, render, type Deal, type Doc, type Product } from './templates'

const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const TABLE = process.env.AIRTABLE_AGREEMENTS_TABLE_ID || 'tblcwJbFdieUO7GCL'

export const STATUSES = ['Sent', 'Viewed', 'Signed', 'Void'] as const
export type AgreementStatus = typeof STATUSES[number]

export type Signature = { name: string; title: string; email: string; at: string; ip: string; ua?: string }

export type Agreement = {
  id: string
  title: string
  clientEmail: string
  company: string
  product: Product
  status: AgreementStatus
  deal: Deal
  doc: Doc
  hash: string
  hewnSig: Signature | null
  clientSig: Signature | null
  sentAt: string
  viewedAt: string
  signedAt: string
  pdfUrl: string
  log: string
}

type Row = { id: string; createdTime: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const json = <T,>(v: unknown, fallback: T): T => { try { return v ? JSON.parse(String(v)) as T : fallback } catch { return fallback } }
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })
const api = () => `https://api.airtable.com/v0/${BASE}/${TABLE}`
function need() { if (!BASE || !TOKEN) throw new Error('Airtable not configured') }

export const hashDoc = (doc: Doc) => createHash('sha256').update(docText(doc)).digest('hex')

const toAgreement = (r: Row): Agreement => {
  const pdf = Array.isArray(r.fields['Signed PDF']) ? (r.fields['Signed PDF'] as { url?: string }[])[0] : undefined
  return {
    id: r.id,
    title: str(r.fields['Title']),
    clientEmail: str(r.fields['Client email']).toLowerCase(),
    company: str(r.fields['Company']),
    product: str(r.fields['Product']) as Product,
    status: (STATUSES as readonly string[]).includes(str(r.fields['Status'])) ? str(r.fields['Status']) as AgreementStatus : 'Sent',
    deal: json<Deal>(r.fields['Terms'], {} as Deal),
    doc: json<Doc>(r.fields['Body'], { title: '', parties: '', sections: [] }),
    hash: str(r.fields['Hash']),
    hewnSig: json<Signature | null>(r.fields['Hewn signature'], null),
    clientSig: json<Signature | null>(r.fields['Client signature'], null),
    sentAt: str(r.fields['Sent at']) || r.createdTime,
    viewedAt: str(r.fields['Viewed at']),
    signedAt: str(r.fields['Signed at']),
    pdfUrl: pdf?.url ?? '',
    log: str(r.fields['Log']),
  }
}

async function list(formula?: string): Promise<Row[]> {
  need()
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const q = new URLSearchParams({ pageSize: '100' })
    if (formula) q.set('filterByFormula', formula)
    if (offset) q.set('offset', offset)
    const res = await fetch(`${api()}?${q}`, { headers: headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable agreements ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records)
    offset = out.offset
  } while (offset)
  return rows
}

async function write(id: string | null, fields: Record<string, unknown>): Promise<Row> {
  need()
  const res = id
    ? await fetch(`${api()}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields, typecast: true }) })
    : await fetch(api(), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable agreements ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return 'records' in out ? out.records[0] : out
}

const logLine = (what: string, ip = '') => `${new Date().toISOString()} · ${what}${ip ? ` · IP ${ip}` : ''}`
const appendLog = (a: Agreement, what: string, ip = '') => (a.log ? `${a.log}\n` : '') + logLine(what, ip)

/** A client's agreements (or everyone's), newest first. */
export async function loadAgreements(email?: string): Promise<Agreement[]> {
  const rows = await list(email ? `LOWER({Client email})=${quote(email.toLowerCase())}` : undefined)
  return rows.map(toAgreement).sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1))
}

export async function getAgreement(id: string): Promise<Agreement | null> {
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) return null
  need()
  const res = await fetch(`${api()}/${id}`, { headers: headers(), cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Airtable agreements ${res.status}: ${await res.text()}`)
  return toAgreement(await res.json() as Row)
}

/** Freeze the text, countersign for Hewn Life, and record it as sent. */
export async function createAgreement(deal: Deal, client: { email: string; company: string }, hewn: Signature): Promise<Agreement> {
  const doc = render(deal)
  const title = `${deal.product === 'Custom project' ? deal.projectTitle || 'Custom project' : deal.product} · ${deal.clientLegalName || client.company}`
  const now = new Date().toISOString()
  return toAgreement(await write(null, {
    Title: title.slice(0, 200), 'Client email': client.email.toLowerCase(), Company: client.company, Product: deal.product, Status: 'Sent',
    Terms: JSON.stringify(deal), Body: JSON.stringify(doc), Hash: hashDoc(doc), 'Hewn signature': JSON.stringify(hewn), 'Sent at': now,
    Log: logLine(`created, countersigned by ${hewn.name} (${hewn.email}) and sent to ${client.email}`, hewn.ip),
  }))
}

export async function markViewed(a: Agreement, ip: string): Promise<Agreement> {
  if (a.status !== 'Sent') return a
  return toAgreement(await write(a.id, { Status: 'Viewed', 'Viewed at': new Date().toISOString(), Log: appendLog(a, `opened by ${a.clientEmail}`, ip) }))
}

export async function signAgreement(a: Agreement, sig: Signature): Promise<Agreement> {
  return toAgreement(await write(a.id, {
    Status: 'Signed', 'Signed at': sig.at, 'Client signature': JSON.stringify(sig),
    Log: appendLog(a, `signed by ${sig.name}, ${sig.title} (${sig.email}); document hash ${a.hash}`, sig.ip),
  }))
}

export async function voidAgreement(a: Agreement, by: string): Promise<Agreement> {
  return toAgreement(await write(a.id, { Status: 'Void', Log: appendLog(a, `voided by ${by}`) }))
}

export async function noteSent(a: Agreement, what: string): Promise<void> {
  await write(a.id, { Log: appendLog(a, what) })
}

/** Store the signed PDF on the row (Airtable's upload endpoint). */
export async function attachPdf(a: Agreement, bytes: Uint8Array, filename: string) {
  need()
  const res = await fetch(`https://content.airtable.com/v0/${BASE}/${a.id}/${encodeURIComponent('Signed PDF')}/uploadAttachment`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ contentType: 'application/pdf', filename, file: Buffer.from(bytes).toString('base64') }),
  })
  if (!res.ok) throw new Error(`Airtable PDF upload ${res.status}: ${await res.text()}`)
}

export const pdfName = (a: Agreement) => `${(a.company || 'Client').replace(/[^\w]+/g, '-')}-${a.product.replace(/[^\w]+/g, '-')}-Agreement-signed.pdf`
