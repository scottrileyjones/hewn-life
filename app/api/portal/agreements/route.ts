import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient } from '@/lib/portal/data'
import { notifyAgreementSigned } from '@/lib/portal/notify'
import { attachPdf, getAgreement, hashDoc, pdfName, signAgreement } from '@/lib/agreements/data'
import { signedPdf } from '@/lib/agreements/pdf'
import { payLink } from '@/lib/agreements/pay'

export const maxDuration = 60

/** The client signs an agreement: checks it's theirs and unchanged, records the signature, makes and sends the signed PDF. */
export async function POST(req: NextRequest) {
  const email = currentClientEmail()
  const client = email ? await findClient(email).catch(() => null) : null
  if (!client || client.status === 'Past') return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as { id?: string; name?: string; title?: string; consent?: boolean; authority?: boolean; hash?: string }
  const a = b.id ? await getAgreement(b.id).catch(() => null) : null
  if (!a || a.clientEmail !== client.email) return NextResponse.json({ error: 'Agreement not found.' }, { status: 404 })
  if (a.status === 'Signed') return NextResponse.json({ error: 'This agreement is already signed.' }, { status: 409 })
  if (a.status === 'Void') return NextResponse.json({ error: 'This agreement was withdrawn. Message us for the current one.' }, { status: 409 })
  // The text on screen must be the text we froze; anything else means it changed.
  if (b.hash !== a.hash || hashDoc(a.doc) !== a.hash) return NextResponse.json({ error: 'This agreement changed since you opened it. Reload the page.' }, { status: 409 })
  const name = (b.name || '').trim().slice(0, 120), title = (b.title || '').trim().slice(0, 120)
  if (name.length < 3 || !name.includes(' ')) return NextResponse.json({ error: 'Type your full name to sign.' }, { status: 400 })
  if (!title) return NextResponse.json({ error: 'Add your title.' }, { status: 400 })
  if (b.consent !== true || b.authority !== true) return NextResponse.json({ error: 'Tick both boxes to sign.' }, { status: 400 })
  try {
    const signed = await signAgreement(a, {
      name, title, email: client.email, at: new Date().toISOString(),
      ip: (req.headers.get('x-forwarded-for') || '').split(',')[0].trim(), ua: (req.headers.get('user-agent') || '').slice(0, 300),
    })
    const pay = payLink(signed)
    // Make, store and email the PDF after responding, so signing feels instant.
    waitUntil((async () => {
      const bytes = await signedPdf(signed)
      const filename = pdfName(signed)
      await attachPdf(signed, bytes, filename).catch(err => console.error('PDF upload failed:', err))
      await notifyAgreementSigned(client, { title: signed.title, signer: `${name}, ${title}` }, { filename, content: Buffer.from(bytes).toString('base64') }, pay)
        .catch(err => console.error('Signed agreement email failed:', err))
    })())
    return NextResponse.json({ ok: true, agreement: { ...signed, clientSig: signed.clientSig }, payUrl: pay })
  } catch (err) {
    console.error('Signing failed:', err)
    return NextResponse.json({ error: 'Couldn’t sign. Try again.' }, { status: 502 })
  }
}
