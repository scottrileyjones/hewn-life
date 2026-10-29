/**
 * Turns a lead into a personal growth-plan deck with Claude, falling back to a
 * rule-based deck when the API is unavailable or the output breaks a rule.
 */
import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { challenges, kpiGlossary, methodology, plans, proof } from '@/lib/playbook'
import { deckIsClean, PlanDeckSchema, type LeadInput, type PlanDeck } from './deck'

const MODEL = 'claude-opus-5-5'

// Frozen so the playbook prefix caches across leads: no dates or ids in here.
const SYSTEM = `You write personal growth-plan decks for Hewn Life, a marketing company: AI runs the engine, senior marketers and artists drive.

A prospect filled in one of our forms. From their answers, choose what matters for them from the playbook below and write their deck in clear, professional business language: standard marketing terms (CAC, conversion rate, LTV, ROAS, pipeline), short sentences, warm but not salesy. Speak to the reader as "you".

Rules:
- Use only challenge, plan and proof ids from the playbook.
- Never write a statistic, percentage or dollar figure. The deck adds sourced numbers itself.
- Never promise a result, a timeline beyond the roadmap, or a guarantee.
- Never name a client. Never repeat sensitive personal or health details from their notes; refer to them generally.
- Pick the plan that fits their budget and stage. Website in a Day is right before revenue or when budget is under a few thousand a month.

Playbook:
${JSON.stringify({
  challenges: challenges.map(({ id, name, headline, impact, solution, kpis }) => ({ id, name, headline, impact, solution, kpis })),
  methodology,
  kpis: kpiGlossary,
  plans: plans.map(({ id, name, price, per, includes }) => ({ id, name, price, per, includes })),
  proof,
})}`

let client: Anthropic | null = null

export async function generateDeck(lead: LeadInput): Promise<{ deck: PlanDeck; by: 'Claude' | 'Rules' }> {
  if (!process.env.ANTHROPIC_API_KEY) return { deck: ruleDeck(lead), by: 'Rules' }
  client ??= new Anthropic()

  const context = Object.keys(lead.answers).sort()
    .filter(k => lead.answers[k]?.trim())
    .map(k => `${k}: ${lead.answers[k].trim().slice(0, 1500)}`).join('\n')

  try {
    const res = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: betaZodOutputFormat(PlanDeckSchema) },
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{
        role: 'user',
        content: `Form: ${lead.source}\nName: ${lead.name}\nBusiness: ${lead.company}\n\n${context}`,
      }],
    })
    const deck = res.stop_reason === 'refusal' ? null : res.parsed_output
    if (deck && deckIsClean(deck)) return { deck, by: 'Claude' }
    console.error('Plan deck rejected; using rules.', res.stop_reason)
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) console.error('Claude rate limited; using rules.')
    else if (err instanceof Anthropic.APIError) console.error(`Claude API error ${err.status}; using rules.`, err.message)
    else console.error('Plan generation failed; using rules.', err)
  }
  return { deck: ruleDeck(lead), by: 'Rules' }
}

/** A sensible deck from the answers alone, so every lead still gets a plan. */
export function ruleDeck(lead: LeadInput): PlanDeck {
  const a = Object.values(lead.answers).join(' ').toLowerCase()
  const has = (...w: string[]) => w.some(x => a.includes(x))
  const picks: PlanDeck['challenges'] = []
  const add = (id: PlanDeck['challenges'][number]['id'], whyYou: string, firstMove: string) => {
    if (picks.length < 3 && !picks.some(p => p.id === id)) picks.push({ id, whyYou, firstMove })
  }
  if (has('creator', 'influencer', 'audience', 'followers')) add('creator', 'Your audience lives on platforms you don’t control.', 'Build a home on the web and an email list you own.')
  if (has('raise', 'investor', 'seed', 'fundrais')) add('founder', 'You need to show traction before the next raise.', 'Sharpen the story, the deck and the site investors see first.')
  if (has('no website', 'embarrassing', 'nosite', 'messaging', 'unclear')) add('credibility', 'Your site and story aren’t yet doing the selling for you.', 'Rebuild the website around one clear offer and next step.')
  if (has('convert', 'leads', 'customers', 'traffic')) add('acquisition', 'Winning new customers is where growth is stuck.', 'Test new creative weekly and fix the pages that leak.')
  if (has('track', 'roi', 'what works', 'measure', 'data')) add('measurement', 'It’s hard to see which marketing pays off.', 'Turn on tracking and a live dashboard in week one.')
  if (has('agency', 'freelancer')) add('agency', 'Past help cost more and moved slower than it should have.', 'Run everything on one flat fee with a weekly cadence.')
  add('capacity', 'Marketing competes with everything else on your plate.', 'Hand execution to a senior team; you approve in minutes.')
  add('acquisition', 'Winning new customers is the engine of growth.', 'Test new creative weekly and fix the pages that leak.')

  const low = has('under $1,000', 'one-off', '$0', 'pre-revenue', 'website in a day') || lead.source === 'Website in a Day'
  const high = has('$6,000', 'premium', 'full team', 'dominate')
  const plan: PlanDeck['plan'] = low ? 'website-in-a-day' : high ? 'forged' : has('$3,000', 'ads', 'active') ? 'wrought' : 'hewn'

  return {
    hook: plan === 'website-in-a-day' ? 'A website that wins you customers.' : 'More of the right customers, for less.',
    summary: `${lead.company || 'Your business'} has real room to grow. Here are the challenges that matter most from what you told us, how we’d address each one, and what your first 90 days would look like.`,
    challenges: picks,
    plan,
    planReason: plan === 'website-in-a-day' ? 'A strong website is the fastest, lowest-risk first step.' : 'It covers the challenges above without paying for pillars you don’t need yet.',
    roadmap: {
      first30: ['Audit and KPI baseline', 'Website and tracking live', 'First creative batch'],
      next30: ['Weekly creative tests', 'Email welcome and win-back flows', 'Review requests after every sale'],
      last30: ['Budget moved to what wins', 'Search and content clusters', 'First quarterly business review'],
    },
    proof: ['growth', 'exit', 'regulated'],
    nextStep: 'Book a 30-minute call and we’ll walk through this plan together.',
  }
}
