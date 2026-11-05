import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { currentClientEmail } from '@/lib/portal/auth'
import { getAgreement, pdfName } from '@/lib/agreements/data'
import { signedPdf } from '@/lib/agreements/pdf'

/**
 * The signed PDF, for the client it belongs to or the team. Built fresh from the
 * stored record (same text, signatures and log), so links never expire.
 */
export async function GET(req: NextRequest) {
  const a = await getAgreement(req.nextUrl.searchParams.get('id') || '').catch(() => null)
  const team = (await currentUser())
  const client = (await currentClientEmail())
  if (!a || (!team && client !== a.clientEmail)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Before everyone has signed, only the team can get a copy (with the signatures so far).
  if (a.status !== 'Signed' && !team) return NextResponse.json({ error: 'Not signed yet' }, { status: 409 })
  const bytes = await signedPdf(a)
  return new NextResponse(Buffer.from(bytes), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `${req.nextUrl.searchParams.get('download') ? 'attachment' : 'inline'}; filename="${pdfName(a)}"`, 'Cache-Control': 'private, no-store' },
  })
}
