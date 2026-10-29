import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clip = (v: unknown, n = 2000) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

/** Contact form → the same Airtable leads table as the quiz, Lead Source "Contact form". */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = clip(body?.name, 200)
    const company = clip(body?.company, 200)
    const email = clip(body?.email, 200)
    const challenge = clip(body?.challenge)

    if (!EMAIL.test(email)) return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    if (!name || !company || !challenge) return NextResponse.json({ error: 'Please fill in your name, business and biggest challenge.' }, { status: 400 })

    if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID || !AIRTABLE_TOKEN) {
      console.error('Airtable env vars are not configured.')
      return NextResponse.json({ error: 'Lead storage is not configured.' }, { status: 500 })
    }

    const notes = [
      body?.revenue && `Annual revenue: ${clip(body.revenue, 60)}`,
      body?.plan && `Interested in: ${clip(body.plan, 60)}`,
      body?.source && `Heard about us: ${clip(body.source, 300)}`,
    ].filter(Boolean).join('\n')

    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        records: [{
          fields: {
            Name: name,
            Company: company,
            Email: email,
            Phone: clip(body?.phone, 60),
            Notes: notes,
            'Biggest Challenge': challenge,
            'Lead Source': 'Contact form',
            'Submission Timestamp': new Date().toISOString(),
          },
        }],
        typecast: true,
      }),
    })

    if (!res.ok) {
      console.error('Airtable error:', res.status, await res.text())
      return NextResponse.json({ error: 'Could not send your message.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('contact route error:', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
