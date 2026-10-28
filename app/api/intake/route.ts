import { NextRequest, NextResponse } from 'next/server'
import { intakeFields, LOGO_MAX_BYTES, LOGO_TYPES } from '@/lib/intake'
import { briefsConfigured, toFields, createBrief, attachLogo } from '@/lib/airtable'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const answers: Record<string, string> = {}
    for (const f of intakeFields) {
      const v = form.get(f.id)
      if (typeof v === 'string') answers[f.id] = v
    }

    if (!EMAIL.test(answers.email || '')) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }
    const missing = intakeFields.filter(f => f.required && f.type !== 'file' && !answers[f.id]?.trim())
    if (missing.length) {
      return NextResponse.json({ error: `Please fill in: ${missing.map(f => f.label).join(', ')}.` }, { status: 400 })
    }

    const logo = form.get('logo')
    const hasLogo = logo instanceof File && logo.size > 0
    if (hasLogo && (logo.size > LOGO_MAX_BYTES || !LOGO_TYPES.includes(logo.type))) {
      return NextResponse.json({ error: 'The logo must be a PNG, JPG, SVG, WebP or PDF under 5 MB.' }, { status: 400 })
    }

    if (!briefsConfigured()) {
      console.error('Airtable briefs table is not configured.')
      return NextResponse.json({ error: 'Brief storage is not configured.' }, { status: 500 })
    }

    const source = typeof form.get('source') === 'string' ? String(form.get('source')) : 'Website'
    const id = await createBrief(toFields(answers, { Source: source.slice(0, 60) }))

    if (hasLogo) {
      try {
        await attachLogo(id, { name: logo.name, type: logo.type, bytes: await logo.arrayBuffer() })
      } catch (err) {
        // The brief is saved; a failed logo upload should not lose it.
        console.error('Logo upload failed:', err)
        return NextResponse.json({ ok: true, logo: 'failed' })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('intake route error:', err)
    return NextResponse.json({ error: 'Could not save your brief. Please try again.' }, { status: 500 })
  }
}
