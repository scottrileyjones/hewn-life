import { NextRequest, NextResponse } from 'next/server'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient } from '@/lib/portal/data'
import { getAsset, reviewAsset } from '@/lib/portal/assets'
import { UploadError, createFromForm } from '@/lib/portal/assetUpload'
import { notifyTeamAsset } from '@/lib/portal/notify'

async function client() {
  const email = currentClientEmail()
  const c = email ? await findClient(email).catch(() => null) : null
  return c && c.status !== 'Past' ? c : null
}

/** Client asset actions: upload (multipart), or approve / request changes (JSON). */
export async function POST(req: NextRequest) {
  const c = await client()
  if (!c) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  try {
    if ((req.headers.get('content-type') || '').includes('multipart/form-data')) {
      const asset = await createFromForm(await req.formData(), { clientEmail: c.email, source: 'Client', addedBy: c.email, status: 'Received' })
      await notifyTeamAsset(c, asset, 'uploaded').catch(err => console.error('Asset alert failed:', err))
      return NextResponse.json({ ok: true, asset })
    }
    const b = await req.json().catch(() => ({})) as { id?: string; decision?: string; comment?: string }
    const a = b.id ? await getAsset(b.id) : null
    if (!a || a.clientEmail !== c.email || a.source !== 'Hewn') return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    if (a.status !== 'In review') return NextResponse.json({ error: 'This isn’t waiting for your review.' }, { status: 400 })
    const status = b.decision === 'approve' ? 'Approved' : b.decision === 'changes' ? 'Changes requested' : null
    if (!status) return NextResponse.json({ error: 'Approve or request changes.' }, { status: 400 })
    if (status === 'Changes requested' && !(b.comment || '').trim()) return NextResponse.json({ error: 'Tell us what to change.' }, { status: 400 })
    const saved = await reviewAsset(a, status, c.name || c.email, b.comment || '')
    await notifyTeamAsset(c, saved, status, b.comment || '').catch(err => console.error('Asset alert failed:', err))
    return NextResponse.json({ ok: true, asset: saved })
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 })
    console.error('Portal asset failed:', err)
    return NextResponse.json({ error: 'Couldn’t save. Try again, or message us.' }, { status: 502 })
  }
}
