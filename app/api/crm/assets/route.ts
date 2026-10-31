import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { findClient } from '@/lib/portal/data'
import { ASSET_STATUSES, CATEGORY_IDS, deleteAsset, getAsset, loadAssets, reviewAsset, saveAsset, type AssetStatus, type Category } from '@/lib/portal/assets'
import { UploadError, createFromForm } from '@/lib/portal/assetUpload'
import { notifyClientAsset } from '@/lib/portal/notify'

type Body =
  | { action: 'list'; email: string }
  | { action: 'status'; id: string; status: AssetStatus; liveLink?: string; comment?: string; notify?: boolean }
  | { action: 'edit'; id: string; title?: string; category?: string; link?: string; text?: string; notes?: string }
  | { action: 'delete'; id: string }

/** Team asset actions: list a client's library, add assets (multipart), move them through review, edit, delete. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  try {
    if ((req.headers.get('content-type') || '').includes('multipart/form-data')) {
      const form = await req.formData()
      const c = await findClient(String(form.get('email') || ''))
      if (!c) return NextResponse.json({ error: 'No such client.' }, { status: 404 })
      const review = form.get('review') === '1'
      const asset = await createFromForm(form, { clientEmail: c.email, source: 'Hewn', addedBy: user, status: review ? 'In review' : 'Draft' })
      let alerted = false
      if (review) alerted = await notifyClientAsset(c, asset, 'review').then(() => true, err => { console.error('Asset alert failed:', err); return false })
      return NextResponse.json({ ok: true, asset, alerted })
    }
    const b = await req.json().catch(() => ({})) as Body
    if (b.action === 'list') return NextResponse.json({ ok: true, assets: await loadAssets(b.email) })
    const a = 'id' in b ? await getAsset(b.id) : null
    if (!a) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    if (b.action === 'delete') { await deleteAsset(a.id); return NextResponse.json({ ok: true }) }
    if (b.action === 'edit') {
      if (b.category && !CATEGORY_IDS.includes(b.category)) return NextResponse.json({ error: 'Unknown section.' }, { status: 400 })
      if (b.link && !/^https?:\/\/\S+$/i.test(b.link)) return NextResponse.json({ error: 'Links need to start with https://' }, { status: 400 })
      return NextResponse.json({ ok: true, asset: await saveAsset(a.id, { title: b.title, category: b.category as Category | undefined, link: b.link, text: b.text, notes: b.notes }) })
    }
    if (b.action === 'status') {
      if (!ASSET_STATUSES.includes(b.status)) return NextResponse.json({ error: 'Unknown status.' }, { status: 400 })
      if (b.liveLink && !/^https?:\/\/\S+$/i.test(b.liveLink)) return NextResponse.json({ error: 'The live link needs to start with https://' }, { status: 400 })
      if (b.liveLink !== undefined) await saveAsset(a.id, { liveLink: b.liveLink })
      const saved = await reviewAsset({ ...a, liveLink: b.liveLink ?? a.liveLink }, b.status, user.split('@')[0], b.comment || '')
      let alerted = false
      if (b.notify !== false && (b.status === 'In review' || b.status === 'Live')) {
        const c = await findClient(a.clientEmail)
        if (c) alerted = await notifyClientAsset(c, saved, b.status === 'Live' ? 'live' : 'review').then(() => true, err => { console.error('Asset alert failed:', err); return false })
      }
      return NextResponse.json({ ok: true, asset: saved, alerted })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 })
    console.error('Team asset failed:', err)
    return NextResponse.json({ error: 'Couldn’t save to Airtable.' }, { status: 502 })
  }
}
