import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { AUDIENCES, sendCampaign, type Audience } from '@/lib/smsMarketing'
import { sendSms, smsConfigured, teamNumbers } from '@/lib/sms'
import { MARKETING_MAX, marketingText } from '@/lib/smsText'

type Body = { action: 'test' | 'send'; body?: string; audience?: Audience }

/** Marketing texts from HQ: send a test to the team's phones, or send a campaign. */
export async function POST(req: NextRequest) {
  const user = (await currentUser())
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as Body
  const body = (b.body || '').trim()
  if (!body) return NextResponse.json({ error: 'Write the message first.' }, { status: 400 })
  if (body.length > MARKETING_MAX) return NextResponse.json({ error: `Keep it under ${MARKETING_MAX} characters.` }, { status: 400 })
  if (!smsConfigured()) return NextResponse.json({ error: 'Texting isn’t switched on yet. Add the Twilio keys in Vercel.' }, { status: 503 })
  try {
    if (b.action === 'test') {
      const to = teamNumbers()
      if (!to.length) return NextResponse.json({ error: 'Add your phones to TEAM_SMS_TO in Vercel to get tests.' }, { status: 400 })
      await Promise.all(to.map(n => sendSms(n, marketingText(body))))
      return NextResponse.json({ ok: true, sent: to.length })
    }
    if (b.action === 'send') {
      const audience = AUDIENCES.includes(b.audience as Audience) ? b.audience as Audience : 'Everyone'
      return NextResponse.json({ ok: true, ...(await sendCampaign(body, audience, user)) })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Texts action failed:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Couldn’t send.' }, { status: 502 })
  }
}
