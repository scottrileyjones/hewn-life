import { NextRequest, NextResponse } from 'next/server'
import { renderFollowUp, renderPlanEmail, renderReview } from '@/lib/plans/email'
import { samplePlan } from '@/lib/plans/sample'

export const dynamic = 'force-dynamic'

/** Local previews of the plan emails. Off unless PLAN_SAMPLE=1, which production never sets. */
export async function GET(req: NextRequest) {
  if (process.env.PLAN_SAMPLE !== '1') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const v = req.nextUrl.searchParams.get('v')
  const m = v === 'review' ? renderReview(samplePlan)
    : v === 'followup' ? renderFollowUp(samplePlan)
    : renderPlanEmail(samplePlan, v === 'booked' ? 'booked' : v === 'checkout' ? 'checkout' : 'invite')
  return new NextResponse(m.html.replace('<body', `<body data-subject="${m.subject.replace(/"/g, '')}"`), { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
