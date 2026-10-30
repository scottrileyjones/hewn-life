import { NextRequest, NextResponse } from 'next/server'
import { currentClientEmail } from '@/lib/portal/auth'
import { ASSET_MAX_BYTES, ASSET_TYPES, attachAsset, findClient, saveClient } from '@/lib/portal/data'
import { stepsFor, track } from '@/lib/portal/onboarding'
import { notifyTeamStep } from '@/lib/portal/notify'

/** A client submits their part of an onboarding step: form answers and any files. */
export async function POST(req: NextRequest) {
  const email = currentClientEmail()
  const client = email ? await findClient(email).catch(() => null) : null
  if (!client || client.status === 'Past') return NextResponse.json({ error: 'Signed out' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Couldn’t read the form.' }, { status: 400 })
  const stepId = String(form.get('step') || '')
  const step = stepsFor(client.package).find(s => s.id === stepId)
  if (!step || step.owner !== 'client' || step.action) return NextResponse.json({ error: 'Unknown step.' }, { status: 400 })
  if (!track(client.package, client.progress).yourTurn.some(r => r.step.id === stepId) && !client.progress[stepId]?.submitted) {
    return NextResponse.json({ error: 'This step isn’t open yet.' }, { status: 400 })
  }
  if (client.progress[stepId]?.done) return NextResponse.json({ error: 'We’ve already signed this step off. Message us to change it.' }, { status: 400 })

  const data: Record<string, string> = {}
  for (const f of step.fields ?? []) {
    const v = String(form.get(f.id) ?? '').trim().slice(0, f.type === 'textarea' ? 8000 : 500)
    if (f.required && !v) return NextResponse.json({ error: `“${f.label}” is required.` }, { status: 400 })
    if (f.type === 'select' && v && !f.options?.includes(v)) return NextResponse.json({ error: `Pick an option for “${f.label}”.` }, { status: 400 })
    if (f.type === 'url' && v && !/^https?:\/\/\S+$/i.test(v)) return NextResponse.json({ error: `“${f.label}” should be a web address starting with https://` }, { status: 400 })
    if (v) data[f.id] = v
  }

  const files = step.uploads ? form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0) : []
  if (files.length > 10) return NextResponse.json({ error: 'Up to 10 files at a time. Share a folder link for more.' }, { status: 400 })
  for (const f of files) {
    if (f.size > ASSET_MAX_BYTES || !ASSET_TYPES.includes(f.type)) {
      return NextResponse.json({ error: `“${f.name}” must be a PNG, JPG, SVG, WebP, GIF or PDF under 4 MB. Share a folder link for bigger files.` }, { status: 400 })
    }
  }
  if (step.uploads && !files.length && !Object.keys(data).length && !client.progress[stepId]?.files?.length) {
    return NextResponse.json({ error: 'Add a file or a folder link first.' }, { status: 400 })
  }

  try {
    const uploaded: string[] = []
    for (const f of files) uploaded.push(await attachAsset(client.id, stepId, { name: f.name, type: f.type, bytes: await f.arrayBuffer() }))
    // Re-read so a file uploaded a moment ago isn't lost when we write progress back.
    const fresh = (await findClient(client.email)) ?? client
    const prev = fresh.progress[stepId] ?? {}
    const progress = { ...fresh.progress, [stepId]: { ...prev, submitted: new Date().toISOString(), data, files: [...(prev.files ?? []), ...uploaded] } }
    const saved = await saveClient(fresh.id, { progress })
    await notifyTeamStep(saved, step.title).catch(err => console.error('Portal step alert failed:', err))
    return NextResponse.json({ ok: true, progress: saved.progress, assets: saved.assets })
  } catch (err) {
    console.error('Portal step failed:', err)
    return NextResponse.json({ error: 'Couldn’t save. Try again, or message us.' }, { status: 502 })
  }
}
