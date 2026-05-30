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

    // Map question IDs (sent as readable labels from the quiz) to Airtable column names.
    const a = (answers || {}) as Record<string, string>

    // Field names must match the Airtable table exactly.
    const fields: Record<string, unknown> = {
      Name: name || '',
      Email: email,
      Phone: phone || '',
      'Business Stage': a['Where is your business right now?'] || '',
      'Primary Goal': a["What's your single most important goal in the next 90 days?"] || '',
      'Marketing Presence': a['How would you describe your current marketing presence?'] || '',
      'Monthly Budget': a["What's a realistic monthly marketing investment for you?"] || '',
      'Biggest Challenge': a["What's the biggest thing holding your marketing back?"] || '',
      'Timeline': a['How urgent is this for you?'] || '',
      'Team Capacity': a['What does your internal marketing capacity look like?'] || '',
      'Recommended Tier': tier || '',
      'Recommended Services': Array.isArray(services) ? services.join(', ') : (services || ''),
      'Submitted At': new Date().toLocaleString('en-US'),
      // Keep the full summary in Quiz Responses as a human-readable snapshot.
      'Quiz Responses': [
        `Tier: ${tier || '—'}`,
        `Services: ${Array.isArray(services) ? services.join(' • ') : (services || '—')}`,
      ].join('\n'),
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
