import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, tier, services, answers } = body || {}

    // Basic validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID || !AIRTABLE_TOKEN) {
      console.error('Airtable env vars are not configured.')
      return NextResponse.json({ error: 'Lead storage is not configured.' }, { status: 500 })
    }

    const fields: Record<string, unknown> = {
      Name: name || '',
      Email: email,
      Phone: phone || '',
      'Recommended Tier': tier || '',
      'Recommended Services': Array.isArray(services) ? services.join('\n') : (services || ''),
      'Quiz Answers':
        answers && typeof answers === 'object'
          ? Object.entries(answers)
              .map(([k, v]) => `${k}: ${v}`)
              .join('\n')
          : '',
      'Submitted At': new Date().toISOString(),
      Status: 'New',
    }

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{ fields }],
          typecast: true, // lets Airtable coerce single-select options it doesn't have yet
        }),
      }
    )

    if (!res.ok) {
      const detail = await res.text()
      console.error('Airtable error:', res.status, detail)
      return NextResponse.json({ error: 'Could not save lead.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('quiz-lead route error:', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
