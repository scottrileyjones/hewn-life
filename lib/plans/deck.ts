/**
 * A personal growth-plan deck: what Claude writes for one lead.
 *
 * Only words live here. Statistics, sources, proof and prices are looked up
 * from lib/playbook.ts by id when the deck renders, so the model never
 * supplies a number a prospect will read.
 */
import { z } from 'zod'
import { challengeIds, planIds, proofIds } from '@/lib/playbook'

export const PlanDeckSchema = z.object({
  hook: z.string().describe('The page headline: 5 to 9 words naming the outcome this business wants, written to them. No numbers, no hype. E.g. "Turn steady referrals into a steady pipeline."'),
  summary: z.string().describe('Two or three sentences: where this business is, what is holding growth back, and the plan. Written to the reader as "you".'),
  challenges: z.array(z.object({
    id: z.enum(challengeIds),
    whyYou: z.string().describe('One sentence tying this challenge to what the lead told us, in plain language.'),
    firstMove: z.string().describe('One sentence: the first thing we would do about it for them.'),
  })).describe('The two or three challenges that matter most for this lead, most important first.'),
  plan: z.enum(planIds),
  planReason: z.string().describe('One sentence on why this plan is the right starting point.'),
  roadmap: z.object({
    first30: z.array(z.string()).describe('Three short milestones for days 0 to 30.'),
    next30: z.array(z.string()).describe('Three short milestones for days 31 to 60.'),
    last30: z.array(z.string()).describe('Three short milestones for days 61 to 90.'),
  }),
  proof: z.array(z.enum(proofIds)).describe('Two or three proof points most relevant to this lead.'),
  nextStep: z.string().describe('One sentence inviting the next step.'),
})

export type PlanDeck = z.infer<typeof PlanDeckSchema>

export type LeadSource = 'Quiz' | 'Contact form' | 'Website in a Day' | 'Website brief'

/** Everything we know about a lead, flattened to labeled strings. */
export type LeadInput = {
  source: LeadSource
  name: string
  company: string
  email: string
  consent: boolean
  answers: Record<string, string>
}

/** Digits followed by %, or $ followed by digits: the model may not write either. */
const NUMBER_CLAIM = /\d\s*%|\$\s*\d/

export function deckIsClean(d: PlanDeck): boolean {
  const text = [d.hook ?? '', d.summary, d.planReason, d.nextStep, ...d.challenges.flatMap(c => [c.whyYou, c.firstMove]),
    ...d.roadmap.first30, ...d.roadmap.next30, ...d.roadmap.last30].join(' ')
  return !NUMBER_CLAIM.test(text) && d.challenges.length >= 1 && d.challenges.length <= 3
    && new Set(d.challenges.map(c => c.id)).size === d.challenges.length
}
