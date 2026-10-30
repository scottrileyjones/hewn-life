/**
 * Plan emails, sent through Resend. Plain, branded HTML that renders in every
 * client: one column, inline styles, one button.
 */
import { getChallenge, getPlan } from '@/lib/playbook'
import type { PlanRecord, Variant } from './store'
import { sign } from './sign'

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hewn.life'
const FROM = process.env.PLAN_FROM_EMAIL || 'Hewn Life <hello@hewn.life>'
export const REVIEWER = process.env.PLAN_REVIEW_EMAIL || 'hello@hewn.life'
const ADDRESS = process.env.PLAN_MAIL_ADDRESS || 'Hewn Holdings LLC, 285 N Main St #115, Kaysville, UT 84037'

export const planUrl = (token: string) => `${SITE}/plan/${token}`
export const reviewUrl = (token: string) => `${planUrl(token)}?review=${sign(token, 'review')}`
export const unsubscribeUrl = (token: string) => `${SITE}/api/plan/unsubscribe?t=${token}&s=${sign(token, 'unsubscribe')}`

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const first = (name: string) => esc(name.trim().split(/\s+/)[0] || 'there')

export function layout(body: string, footer = '') {
  return `<!doctype html><html><body style="margin:0;background:#F7F6F3;font-family:Helvetica,Arial,sans-serif;color:#0D0D0D">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F3;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden">
<tr><td style="background:#1E3826;padding:24px 32px;font-size:22px;font-weight:700;color:#F4F2EC">hewn<span style="color:#6BAD3D;font-style:italic">life</span></td></tr>
<tr><td style="padding:32px;font-size:16px;line-height:1.6;color:#2B2F2C">${body}</td></tr>
</table>
<p style="max-width:560px;font-size:12px;line-height:1.5;color:#6E736D;margin:16px auto 0">${footer}${ADDRESS ? `<br>${esc(ADDRESS)}` : ''}</p>
</td></tr></table></body></html>`
}

export const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#1E3826;color:#F4F2EC;text-decoration:none;font-weight:600;padding:14px 24px;border-radius:999px">${label}</a>`

export async function send(to: string, subject: string, html: string, extraHeaders: Record<string, string> = {}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, headers: extraHeaders }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
}

export type Rendered = { to: string; subject: string; html: string; headers?: Record<string, string> }

/** To us: a new deck is ready to review (only when PLAN_REVIEW_FIRST=true). */
export async function sendReview(p: PlanRecord) {
  if (!p.deck) return
  const m = renderReview(p)
  await send(m.to, m.subject, m.html)
}

/** To us: a copy of a plan that just went to the lead. */
export async function sendCopy(p: PlanRecord, variant: Variant) {
  if (!p.deck) return
  const m = renderReview(p, variant)
  await send(m.to, m.subject, m.html)
}

/** The internal email: a summary of the deck, then either an approve button or a note that it's been sent. */
export function renderReview(p: PlanRecord, sent?: Variant): Rendered {
  if (!p.deck) throw new Error('No deck')
  const items = p.deck.challenges.map(c => `<li>${esc(getChallenge(c.id).name)}: ${esc(c.whyYou)}</li>`).join('')
  const who = `${p.lead.name}${p.lead.company ? `, ${p.lead.company}` : ''}`
  const html = layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E736D">${sent ? 'Growth plan sent' : 'New growth plan'} · ${esc(p.lead.source)}</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#0D0D0D">${esc(who)}</h1>
${sent ? `<p style="margin:0 0 16px">Sent to <a href="mailto:${esc(p.lead.email)}" style="color:#1E3826">${esc(p.lead.email)}</a> as “${esc(copy[sent].subject(p))}”. Reply to them directly to follow up.</p>` : ''}
<p style="margin:0 0 16px">${esc(p.deck.summary)}</p>
<ul style="margin:0 0 16px;padding-left:20px">${items}</ul>
<p style="margin:0 0 24px">Recommended: <b>${esc(getPlan(p.deck.plan).name)}</b>. ${p.bookedAt ? 'They’ve already booked a call.' : ''} Written by: ${esc(p.by)}.</p>
${button(reviewUrl(p.token), sent ? 'See their plan' : 'Review and approve')}
<p style="margin:16px 0 0;font-size:13px;color:#6E736D">${sent ? 'Opening it from this email doesn’t count as the lead opening it.' : 'Nothing is sent until you approve.'}</p>`)
  return { to: REVIEWER, subject: sent ? `Sent: growth plan for ${who}` : `Review: growth plan for ${who}`, html }
}

const copy: Record<Variant, { subject: (p: PlanRecord) => string; body: (p: PlanRecord) => string; cta: string }> = {
  invite: {
    subject: p => `Your growth plan${p.lead.company ? ` for ${p.lead.company}` : ''}`,
    body: p => `<p>Hi ${first(p.lead.name)},</p><p>Thanks for telling us about ${p.lead.company ? esc(p.lead.company) : 'your business'}. We put together a short growth plan from your answers: the challenges that matter most for you, how we’d address each one, and what your first 90 days could look like.</p><p>If it resonates, book a 30-minute call from the plan and we’ll walk through it together.</p>`,
    cta: 'See your growth plan',
  },
  booked: {
    subject: () => 'Your growth plan, ahead of our call',
    body: p => `<p>Hi ${first(p.lead.name)},</p><p>Thanks for booking a call. To make the most of our time, we built your growth plan from what you shared: your top challenges, the approach we’d take and a 90-day roadmap.</p><p>Have a look before we talk. We’ll use it as the agenda, so bring any questions.</p>`,
    cta: 'See your growth plan',
  },
  checkout: {
    subject: () => 'Your Website in a Day plan is ready',
    body: p => `<p>Hi ${first(p.lead.name)},</p><p>Thanks for sending your brief. We used it to build a short growth plan: what your new site needs to do, and where it can take ${p.lead.company ? esc(p.lead.company) : 'the business'} over the next 90 days.</p><p>Your order isn’t finished yet. You can pick up where you left off from the plan, or book a quick call if you’d like to talk it through first.</p>`,
    cta: 'See your plan',
  },
}

const leadFooter = (p: PlanRecord) =>
  `You’re receiving this because you asked Hewn Life about your marketing. <a href="${unsubscribeUrl(p.token)}" style="color:#6E736D">Unsubscribe</a>.`

const unsubHeaders = (p: PlanRecord) => ({
  'List-Unsubscribe': `<${unsubscribeUrl(p.token)}>`,
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
})

/** To the lead: their plan. */
export async function sendPlanEmail(p: PlanRecord, variant: Variant) {
  const m = renderPlanEmail(p, variant)
  await send(m.to, m.subject, m.html, m.headers)
}

export function renderPlanEmail(p: PlanRecord, variant: Variant): Rendered {
  const c = copy[variant]
  const html = layout(`${c.body(p)}<p style="margin:24px 0">${button(planUrl(p.token), c.cta)}</p><p style="margin:0">The Hewn Life team</p>`, leadFooter(p))
  return { to: p.lead.email, subject: c.subject(p), html, headers: unsubHeaders(p) }
}

/** To the lead, a few days later if they haven't booked or paid. */
export async function sendFollowUp(p: PlanRecord) {
  const m = renderFollowUp(p)
  await send(m.to, m.subject, m.html, m.headers)
}

export function renderFollowUp(p: PlanRecord): Rendered {
  const html = layout(`<p>Hi ${first(p.lead.name)},</p><p>Following up on the growth plan we built for ${p.lead.company ? esc(p.lead.company) : 'you'}. Any questions about it, or anything we got wrong? Reply here, or book 30 minutes and we’ll walk through it.</p><p style="margin:24px 0">${button(`${planUrl(p.token)}#book`, 'Book a call')}</p><p style="margin:0">The Hewn Life team</p>`, leadFooter(p))
  return { to: p.lead.email, subject: 'Any questions about your growth plan?', html, headers: unsubHeaders(p) }
}
