import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { checkoutAgreement, type CheckoutOrder, type CheckoutSigner } from '@/lib/checkout/deal'
import { attachPdf, createAgreement, pdfName, signAgreement } from '@/lib/agreements/data'
import { signedPdf } from '@/lib/agreements/pdf'
import { hewnSigner } from '@/lib/checkout/signer'

export const maxDuration = 60

type Body = CheckoutOrder & CheckoutSigner & { action: 'preview' | 'sign'; hash?: string; consent?: boolean; authority?: boolean }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Checkout's "Review and sign" step. preview: the filled-in agreement to read.
 * sign: checks it's the same text they read, then records it countersigned by
 * Hewn Life and signed by them. Payment is only taken against a signed agreement.
 */
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({})) as Body
  const who: CheckoutSigner = {
    email: String(b.email || '').trim().toLowerCase().slice(0, 200),
    fullName: String(b.fullName || '').trim().slice(0, 120),
    businessName: String(b.businessName || '').trim().slice(0, 200),
    legalName: String(b.legalName || '').trim().slice(0, 200),
    title: String(b.title || '').trim().slice(0, 120),
    address: String(b.address || '').trim().slice(0, 300),
  }
  if (!EMAIL.test(who.email) || !who.fullName || !who.businessName) return NextResponse.json({ error: 'Fill in your details first.' }, { status: 400 })
  const order: CheckoutOrder = { priceId: b.priceId, items: Array.isArray(b.items) ? b.items.map(String).slice(0, 20) : undefined, promoCode: b.promoCode }

  try {
    const { deal, doc, hash } = await checkoutAgreement(order, who)
    if (b.action !== 'sign') return NextResponse.json({ doc, hash, hewn: hewnSigner() })

    if (b.hash !== hash) return NextResponse.json({ error: 'The agreement changed since you opened it. Review it again, then sign.', doc, hash }, { status: 409 })
    if (who.fullName.length < 3 || !who.fullName.includes(' ')) return NextResponse.json({ error: 'Type your full name to sign.' }, { status: 400 })
    if (!who.title) return NextResponse.json({ error: 'Add your title.' }, { status: 400 })
    if (b.consent !== true || b.authority !== true) return NextResponse.json({ error: 'Tick both boxes to sign.' }, { status: 400 })

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
    const ua = (req.headers.get('user-agent') || '').slice(0, 300)
    const now = new Date().toISOString()
    // Hewn Life's signature on its standard checkout terms is applied by the company.
    const hewn = { ...hewnSigner(), email: 'hello@hewn.life', at: now, ip: '' }
    const created = await createAgreement(deal, { email: who.email, company: deal.clientLegalName }, hewn)
    const signed = await signAgreement(created, { name: who.fullName, title: deal.signerTitle, email: who.email, at: now, ip, ua, ...(who.address ? { address: who.address } : {}) })

    // Store the signed PDF now; the copy is emailed once they've paid (Stripe webhook).
    waitUntil(signedPdf(signed).then(bytes => attachPdf(signed, bytes, pdfName(signed))).catch(err => console.error('PDF upload failed:', err)))
    return NextResponse.json({ ok: true, agreementId: signed.id })
  } catch (err) {
    if ((err as { userFacing?: boolean }).userFacing) return NextResponse.json({ error: (err as Error).message }, { status: 400 })
    console.error('Checkout agreement failed:', err)
    return NextResponse.json({ error: 'We couldn’t load your agreement. Try again.' }, { status: 502 })
  }
}
