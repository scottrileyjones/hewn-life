import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { currentUser } from '@/lib/crm/auth'
import { attachPdf, getAgreement, hashDoc, noteSent, pdfName, signInternalSlot } from '@/lib/agreements/data'
import { internalTerms } from '@/lib/agreements/internal'
import { signedPdf } from '@/lib/agreements/pdf'
import { notifyDocSigned, notifySignRequest } from '@/lib/portal/notify'

export const maxDuration = 60

type Body =
  | { action: 'sign'; id: string; name?: string; title?: string; address?: string; consent?: boolean; hash?: string }
  | { action: 'remind'; id: string }

/** HQ: a team member signs an internal document, or emails the other signer a reminder. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as Body
  const a = await getAgreement(b.id).catch(() => null)
  const terms = a ? internalTerms(a) : null
  if (!a || !terms) return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
  if (a.status === 'Void') return NextResponse.json({ error: 'This document was withdrawn.' }, { status: 409 })
  const index = terms.signers.findIndex(s => s.email.toLowerCase() === user.toLowerCase())

  if (b.action === 'remind') {
    const waiting = terms.signers.filter((_, i) => !(i === 0 ? a.hewnSig : a.clientSig))
    await Promise.all(waiting.map(s => notifySignRequest(s, a)))
    await noteSent(a, `signing reminder emailed to ${waiting.map(s => s.email).join(', ') || 'nobody (all signed)'} by ${user}`)
    return NextResponse.json({ ok: true, sent: waiting.length })
  }

  if (index < 0) return NextResponse.json({ error: 'You’re not a signer on this document.' }, { status: 403 })
  const slot = index as 0 | 1
  if (slot === 0 ? a.hewnSig : a.clientSig) return NextResponse.json({ error: 'You’ve already signed this.' }, { status: 409 })
  if (!a.hash || b.hash !== a.hash || hashDoc(a.doc) !== a.hash) return NextResponse.json({ error: 'This document changed since you opened it. Reload the page.' }, { status: 409 })
  const signer = terms.signers[slot]
  const name = (b.name || '').trim().slice(0, 120), title = (b.title || '').trim().slice(0, 160), address = (b.address || '').trim().slice(0, 300)
  if (name.length < 3 || !name.includes(' ')) return NextResponse.json({ error: 'Type your full name to sign.' }, { status: 400 })
  if (!title) return NextResponse.json({ error: 'Add your title.' }, { status: 400 })
  if (signer.askAddress && !address) return NextResponse.json({ error: 'Add your notice address.' }, { status: 400 })
  if (b.consent !== true) return NextResponse.json({ error: 'Tick the box to sign.' }, { status: 400 })

  const signed = await signInternalSlot(a, slot, {
    name, title, email: user, at: new Date().toISOString(), ...(address ? { address } : {}),
    ip: (req.headers.get('x-forwarded-for') || '').split(',')[0].trim(), ua: (req.headers.get('user-agent') || '').slice(0, 300),
  })
  if (signed.status === 'Signed') {
    waitUntil((async () => {
      const bytes = await signedPdf(signed)
      const filename = pdfName(signed)
      await attachPdf(signed, bytes, filename).catch(err => console.error('PDF upload failed:', err))
      await notifyDocSigned(terms.signers, signed, { filename, content: Buffer.from(bytes).toString('base64') }).catch(err => console.error('Signed doc email failed:', err))
    })())
  } else {
    const other = terms.signers[slot === 0 ? 1 : 0]
    waitUntil(notifySignRequest(other, signed).catch(err => console.error('Sign request email failed:', err)))
  }
  return NextResponse.json({ ok: true, agreement: signed })
}
