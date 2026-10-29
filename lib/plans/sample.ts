/** A sample plan for local previews (PLAN_SAMPLE=1, /plan/sample). Never used in production. */
import type { PlanRecord } from './store'

export const samplePlan: PlanRecord = {
  id: 'sample',
  token: 'sample',
  status: 'Sent',
  by: 'Sample',
  lead: { source: 'Quiz', name: 'Maya Torres', company: 'Torres Home Comfort', email: 'maya@example.com', consent: true, answers: {} },
  deck: {
    summary: 'Torres Home Comfort has a strong reputation and steady referrals, but new customers cost more each season and it’s hard to tell which marketing is paying off. The plan: fix the pages that leak, test new creative every week, and put every dollar on one live dashboard.',
    challenges: [
      { id: 'acquisition', whyYou: 'You told us new leads are the biggest thing holding growth back, and paid search has been getting pricier.', firstMove: 'Rebuild your service pages around one clear offer and test fresh ad creative every week.' },
      { id: 'measurement', whyYou: 'You’re spending on ads and mailers but can’t see which one books jobs.', firstMove: 'Turn on call and form tracking in week one so every booked job ties back to a channel.' },
      { id: 'capacity', whyYou: 'Marketing happens when you find a spare evening, which is rarely in peak season.', firstMove: 'Hand execution to our team; you approve the week’s work in a ten-minute check-in.' },
    ],
    plan: 'wrought',
    planReason: 'You already run ads, so paid media, creative testing and a live dashboard will move CAC fastest.',
    roadmap: {
      first30: ['KPI baseline and nine-pillar audit', 'Service pages rebuilt and tracking live', 'First batch of ad creative'],
      next30: ['Weekly creative tests on Google and Meta', 'Review requests after every job', 'Seasonal tune-up email to past customers'],
      last30: ['Budget moved to the winning channels', 'Local search pages for each service area', 'First quarterly business review'],
    },
    proof: ['growth', 'regulated', 'exit'],
    nextStep: 'Book a 30-minute call and we’ll walk through this plan together.',
  },
}
