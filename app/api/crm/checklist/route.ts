import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { AREAS, OWNERS, STATUSES, deleteTask, saveTask, type TaskPatch } from '@/lib/hq/checklist'

/** Create or update a startup checklist task. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const body = await req.json().catch(() => ({})) as { id?: string | null; order?: number } & Record<string, unknown>
  const patch: TaskPatch = {}
  if (typeof body.task === 'string') patch.task = body.task.trim()
  if (typeof body.notes === 'string') patch.notes = body.notes
  if (typeof body.due === 'string') {
    if (body.due && !/^\d{4}-\d{2}-\d{2}$/.test(body.due)) return NextResponse.json({ error: 'Bad date' }, { status: 400 })
    patch.due = body.due
  }
  if (body.area !== undefined) { if (!AREAS.includes(body.area as never)) return NextResponse.json({ error: 'Unknown area' }, { status: 400 }); patch.area = body.area as TaskPatch['area'] }
  if (body.owner !== undefined) { if (!OWNERS.includes(body.owner as never)) return NextResponse.json({ error: 'Unknown owner' }, { status: 400 }); patch.owner = body.owner as TaskPatch['owner'] }
  if (body.status !== undefined) { if (!STATUSES.includes(body.status as never)) return NextResponse.json({ error: 'Unknown status' }, { status: 400 }); patch.status = body.status as TaskPatch['status'] }
  if (!body.id && !patch.task) return NextResponse.json({ error: 'A new task needs a name' }, { status: 400 })
  try {
    const task = await saveTask(body.id || null, patch, user, typeof body.order === 'number' ? body.order : undefined)
    return NextResponse.json({ ok: true, task })
  } catch (err) {
    console.error('Checklist save failed:', err)
    return NextResponse.json({ error: 'Couldn’t save to Airtable.' }, { status: 502 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    await deleteTask(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Checklist delete failed:', err)
    return NextResponse.json({ error: 'Couldn’t delete in Airtable.' }, { status: 502 })
  }
}
