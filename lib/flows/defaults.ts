/**
 * The lifecycle flows and their starter copy. HQ → Flows edits them (saved to
 * the Flows table); until a flow has been saved there, these defaults are used.
 * Every flow starts Paused, so nothing sends until someone has read it.
 *
 * Merge tags: {{first_name}} {{company}} {{plan}} {{checkout_link}}
 * {{portal_link}} {{book_link}} {{pricing_link}}. Emails get an unsubscribe
 * footer automatically; texts get "Hewn Life:" and the STOP line.
 */

export const FLOW_KEYS = ['checkout_abandoned', 'lead_nurture', 'onboarding', 'upsell', 'winback'] as const
export type FlowKey = typeof FLOW_KEYS[number]

export type Step = {
  id: string
  /** Hours after the previous step (or after joining, for the first step). */
  waitHours: number
  channel: 'email' | 'sms'
  subject: string
  body: string
}

export type Flow = { key: FlowKey; name: string; status: 'Active' | 'Paused'; steps: Step[]; trigger: string; exits: string; id?: string }

const day = 24

export const DEFAULT_FLOWS: Flow[] = [
  {
    key: 'checkout_abandoned', name: 'Abandoned checkout', status: 'Paused',
    trigger: 'Someone enters their details at checkout but doesn’t pay.',
    exits: 'They pay, or unsubscribe.',
    steps: [
      { id: 'a1', waitHours: 1, channel: 'email', subject: 'Your {{plan}} order is saved',
        body: 'Hi {{first_name}},\n\nYou started checking out for {{plan}} but didn’t quite finish. Your details are saved, so you can pick up right where you left off:\n\n{{checkout_link}}\n\nIf something stopped you, a question about scope, timing or price, just reply to this email. A real person reads every one.\n\nThe Hewn Life team' },
      { id: 'a2', waitHours: day, channel: 'email', subject: 'Any questions before you start?',
        body: 'Hi {{first_name}},\n\nA few things people usually ask before they start:\n\n• What happens after I pay? You get your client portal straight away, with the next steps laid out and a place to send us files and messages.\n• Can I cancel a monthly plan? Yes, anytime, online. You keep service until the end of the month you’ve paid for.\n• Who does the work? Our team, start to finish. You can see everything in your portal.\n\nYour checkout is still saved: {{checkout_link}}\n\nOr if you’d rather talk it through first: {{book_link}}\n\nThe Hewn Life team' },
      { id: 'a3', waitHours: 2 * day, channel: 'email', subject: 'Should we close your order?',
        body: 'Hi {{first_name}},\n\nWe’ll stop reminding you after this one. If now isn’t the right time, no problem at all.\n\nIf it is, your {{plan}} order is here: {{checkout_link}}\n\nThe Hewn Life team' },
    ],
  },
  {
    key: 'lead_nurture', name: 'Lead nurture', status: 'Paused',
    trigger: 'Someone fills in the ROI calculator or contact form and agrees to marketing emails.',
    exits: 'They book a call, buy anything, or unsubscribe.',
    steps: [
      { id: 'n1', waitHours: 2 * day, channel: 'email', subject: 'What we’d do first for {{company}}',
        body: 'Hi {{first_name}},\n\nHopefully your growth plan was useful. The short version of how we’d start: fix the foundation first (a site and profile that turn visitors into calls), then add the channels that bring the right people in, then the follow-up that brings them back.\n\nIf you want to walk through your plan with us, pick a time here, 30 minutes, no pitch deck:\n\n{{book_link}}\n\nThe Hewn Life team' },
      { id: 'n2', waitHours: 3 * day, channel: 'email', subject: 'What working with us actually looks like',
        body: 'Hi {{first_name}},\n\nNo long contracts, no black box. When you work with us you get a client portal that shows every step, what we need from you, and everything we’ve made, ready to review and approve.\n\nPlans are month to month and you can cancel online anytime. Pricing is on the site: {{pricing_link}}\n\nThe Hewn Life team' },
      { id: 'n3', waitHours: 4 * day, channel: 'email', subject: 'Want a hand with this?',
        body: 'Hi {{first_name}},\n\nLast note from us on your growth plan. If you’d like help putting it into action, book a call: {{book_link}}\n\nIf a new website is the place to start, Website in a Day gets you a custom site, live within 24 hours of your brief: {{pricing_link}}\n\nThe Hewn Life team' },
    ],
  },
  {
    key: 'onboarding', name: 'Onboarding', status: 'Paused',
    trigger: 'Someone buys any plan (their portal is created at the same time).',
    exits: 'They unsubscribe.',
    steps: [
      { id: 'o1', waitHours: 2 * day, channel: 'email', subject: 'Your portal in two minutes',
        body: 'Hi {{first_name}},\n\nQuick tour of your client portal, so nothing slows your project down:\n\n• Your turn: the green card shows the one thing we need from you next.\n• Assets: upload your logo, photos and copy, and approve what we make.\n• Messages: ask us anything; we usually reply within one business day.\n\nOpen it here: {{portal_link}}\n\nThe Hewn Life team' },
      { id: 'o2', waitHours: 8 * day, channel: 'email', subject: 'How’s it going so far?',
        body: 'Hi {{first_name}},\n\nYou’re about a week and a half in. Is everything clear, and is there anything we could be doing better? Just reply, it comes straight to us.\n\nYour portal: {{portal_link}}\n\nThe Hewn Life team' },
    ],
  },
  {
    key: 'upsell', name: 'Website in a Day → monthly plan', status: 'Paused',
    trigger: 'Someone buys Website in a Day.',
    exits: 'They start a monthly plan, or unsubscribe.',
    steps: [
      { id: 'u1', waitHours: 14 * day, channel: 'email', subject: 'Your site is live. What’s next?',
        body: 'Hi {{first_name}},\n\nYour site has been live for a couple of weeks. A website is the foundation; what grows the business is getting the right people to it and following up with them.\n\nThat’s what our monthly plans do: search and Google profile, social, paid ads, email and follow-up, all run by our team, month to month, cancel anytime.\n\nSee the plans: {{pricing_link}}\nOr talk it through: {{book_link}}\n\nThe Hewn Life team' },
      { id: 'u2', waitHours: 16 * day, channel: 'email', subject: 'A few add-ons for your site',
        body: 'Hi {{first_name}},\n\nIf a full plan isn’t right yet, these one-off add-ons are popular after launch: full website copy, extra SEO blog posts, an email automation build-out, or a pack of ad creatives.\n\nPrices are on the pricing page: {{pricing_link}}\n\nReply with what you’re thinking and we’ll point you to the right one.\n\nThe Hewn Life team' },
    ],
  },
  {
    key: 'winback', name: 'Win-back', status: 'Paused',
    trigger: 'A monthly plan is cancelled.',
    exits: 'They start a plan again, or unsubscribe.',
    steps: [
      { id: 'w1', waitHours: 14 * day, channel: 'email', subject: 'Could we have done better?',
        body: 'Hi {{first_name}},\n\nThanks for working with us. If you have a minute, we’d really value one honest line on why you stopped and what we could have done better. Just reply.\n\nThe Hewn Life team' },
      { id: 'w2', waitHours: 31 * day, channel: 'email', subject: 'Whenever you’re ready',
        body: 'Hi {{first_name}},\n\nNo pressure, just an open door. If you’d like to pick things back up, your history is still with us, so we can start right where we left off.\n\nPlans: {{pricing_link}}\nOr a quick call: {{book_link}}\n\nThe Hewn Life team' },
    ],
  },
]

export const defaultFlow = (key: FlowKey) => DEFAULT_FLOWS.find(f => f.key === key)!

/** Fill merge tags; unknown or empty tags become sensible fallbacks. */
export function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => vars[k] || (k === 'first_name' ? 'there' : k === 'company' ? 'your business' : k === 'plan' ? 'your' : ''))
}
