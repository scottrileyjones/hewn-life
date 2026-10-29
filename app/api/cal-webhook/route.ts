import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { intakeFields } from '@/lib/intake'
import { briefsConfigured, toFields, createBrief } from '@/lib/airtable'
import { waitUntil } from '@vercel/functions'
import { markBooked } from '@/lib/plans/flow'
import { briefLead } from '@/lib/plans/lead'

// Room for a growth-plan deck to be written after the response is sent.
export const maxDuration = 300

/**
 * Cal.com BOOKING_CREATED webhook → website brief in Airtable.
 *
 * Booking question identifiers in Cal.com must match the field ids in
 * lib/intake.ts (see docs/sales/intake-forms.md). Cal.com signs the raw body
 * with the webhook secret in the X-Cal-Signature-256 header.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET
  const raw = await req.text()

  if (!secret) {
    console.error('CAL_WEBHOOK_SECRET is not configured.')
    return NextResponse.json({ error: 'Not configured.' }, { status: 500 })
  }
  const sig = req.headers.get('x-cal-signature-256') || ''
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  try {
    const event = JSON.parse(raw)
    if (event.triggerEvent !== 'BOOKING_CREATED') return NextResponse.json({ ok: true, skipped: event.triggerEvent })

    const p = event.payload || {}
    const responses = (p.responses || {}) as Record<string, { value?: unknown } | unknown>
    const answers: Record<string, string> = {}
    for (const f of intakeFields) {
      const r = responses[f.id]
      const v = r && typeof r === 'object' && 'value' in r ? (r as { value?: unknown }).value : r
      if (typeof v === 'string') answers[f.id] = v
      else if (Array.isArray(v)) answers[f.id] = v.join(', ')
    }
    // Cal.com's built-in name and email fields.
    const attendee = (p.attendees || [])[0] || {}
    answers.name ||= attendee.name || ''
    answers.email ||= attendee.email || ''

    if (!briefsConfigured()) {
      console.error('Airtable briefs table is not configured.')
      return NextResponse.json({ error: 'Not configured.' }, { status: 500 })
    }
    await createBrief(toFields(answers, {
      Source: 'Cal.com booking',
      'Cal booking': [p.startTime, p.title].filter(Boolean).join(' · '),
    }))
    // Their growth plan, ahead of the call: the existing one, or a new one from this booking.
    waitUntil(markBooked(answers.email, briefLead(answers, 'Website brief')))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('cal-webhook error:', err)
    return NextResponse.json({ error: 'Could not process booking.' }, { status: 500 })
  }
}
