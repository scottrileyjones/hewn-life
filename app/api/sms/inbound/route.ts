import { NextRequest } from 'next/server'
import { SITE, REVIEWER, esc, layout, send } from '@/lib/plans/email'
import { addMessage, findClientsByMobile, saveSmsChoice, touchClient } from '@/lib/portal/data'
import { notifyTeam } from '@/lib/portal/notify'
import { setMarketing } from '@/lib/smsMarketing'
import { HELP_TEXT, prettyPhone, toE164, validTwilioSignature } from '@/lib/sms'

const STOP = ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT', 'OPTOUT', 'REVOKE']
const START = ['START', 'UNSTOP', 'YES']
const HELP = ['HELP', 'INFO']

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const twiml = (reply?: string) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><Response>${reply ? `<Message>${xml(reply)}</Message>` : ''}</Response>`,
  { headers: { 'Content-Type': 'text/xml' } },
)

/**
 * Twilio posts here when someone texts our number. STOP/START update the client's
 * opt-in (Twilio itself sends the carrier-required confirmation), HELP gets our help
 * text, and anything else from a known client lands in their portal thread like a
 * portal message, so the team sees it in HQ and by email.
 */
export async function POST(req: NextRequest) {
  const params = Object.fromEntries(new URLSearchParams(await req.text())) as Record<string, string>
  if (!validTwilioSignature(`${SITE}/api/sms/inbound`, params, req.headers.get('x-twilio-signature'))) return new Response('Forbidden', { status: 403 })

  const from = toE164(params.From)
  const body = (params.Body || '').trim()
  const word = body.toUpperCase().replace(/[^A-Z]/g, '')
  if (!from) return twiml()
  const clients = await findClientsByMobile(from).catch(() => [])

  if (STOP.includes(word)) {
    await Promise.all([...clients.map(c => saveSmsChoice(c, false, from, `replied ${word}`)), setMarketing(from, false, `replied ${word}`)]).catch(err => console.error('SMS opt-out failed:', err))
    return twiml()
  }
  if (START.includes(word)) {
    await Promise.all([...clients.map(c => saveSmsChoice(c, true, from, `replied ${word}`)), setMarketing(from, true, `replied ${word}`)]).catch(err => console.error('SMS opt-in failed:', err))
    return twiml()
  }
  if (HELP.includes(word)) return twiml(HELP_TEXT)

  const client = clients.find(c => c.status !== 'Past')
  if (client && body) {
    try {
      const message = await addMessage({ clientEmail: client.email, from: 'Client', kind: 'Message', author: `${client.email} (text)`, body })
      await touchClient(client.id, 'Last client message')
      await notifyTeam(client, message).catch(err => console.error('Portal team alert failed:', err))
    } catch (err) { console.error('Inbound text failed:', err) }
  } else if (body) {
    // Not a client (e.g. a lead replying to a marketing text): forward it so someone can answer.
    await send(REVIEWER, `Text reply from ${prettyPhone(from)}`, layout(`<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">Text reply</p>
<h1 style="margin:0 0 16px;font-size:22px;color:#0D0D0D">${esc(prettyPhone(from))}</h1>
<div style="padding:16px 18px;border-left:3px solid #D6F28B;background:#F4F2EC;border-radius:8px">${esc(body)}</div>
<p style="margin:16px 0 0;font-size:13px;color:#6E736D">Reply from your phone, or note it in the Pipeline.</p>`)).catch(err => console.error('Text forward failed:', err))
  }
  return twiml()
}
