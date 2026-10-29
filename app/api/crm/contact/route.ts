import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { STAGES, savePipeline, type Stage } from '@/lib/crm/data'

/** Save a contact's hand-set stage, notes or deal value to the Pipeline table. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const body = await req.json().catch(() => ({})) as { email?: string; pipelineId?: string | null; stage?: string; notes?: string; value?: number | null }
  const email = (body.email || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  const fields: Parameters<typeof savePipeline>[1] = {}
  if (body.stage !== undefined) {
    if (!STAGES.includes(body.stage as Stage)) return NextResponse.json({ error: 'Unknown stage' }, { status: 400 })
    fields.Stage = body.stage as Stage
    fields['Stage set by'] = user
  }
  if (typeof body.notes === 'string') fields.Notes = body.notes.slice(0, 20000)
  if (body.value === null || typeof body.value === 'number') fields['Deal value'] = body.value
  try {
    const id = await savePipeline(email, fields, body.pipelineId)
    return NextResponse.json({ ok: true, pipelineId: id })
  } catch (err) {
    console.error('CRM save failed:', err)
    return NextResponse.json({ error: 'Couldn’t save to Airtable.' }, { status: 502 })
  }
}
