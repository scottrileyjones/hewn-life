import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import PlanView from '@/components/plan/PlanView'
import ApproveBar from '@/components/plan/ApproveBar'
import AutoPrint from '@/components/plan/AutoPrint'
import { findByToken } from '@/lib/plans/store'
import { markOpened } from '@/lib/plans/flow'
import { verify } from '@/lib/plans/sign'
import { samplePlan } from '@/lib/plans/sample'

export const metadata: Metadata = {
  title: 'Your growth plan — Hewn Life',
  robots: { index: false, follow: false },
}

export default async function PlanPage({ params, searchParams }: { params: { token: string }; searchParams: { review?: string; print?: string } }) {
  noStore()
  const sample = params.token === 'sample' && process.env.PLAN_SAMPLE === '1'
  const record = sample ? samplePlan : await findByToken(params.token).catch(() => null)
  if (!record?.deck) notFound()

  const review = !sample && verify(params.token, 'review', searchParams.review)
  if (!review && !sample) await markOpened(record).catch(() => {})

  return (
    <>
      <PlanView record={record} />
      {/* ?print=1 from the CRM: straight to Save as PDF. */}
      {(review || sample) && searchParams.print && <AutoPrint />}
      {!searchParams.print && (review || (sample && searchParams.review)) && (
        <ApproveBar token={params.token} sig={searchParams.review || ''} name={record.lead.name.split(' ')[0] || 'them'} status={sample ? 'Needs review' : record.status} />
      )}
    </>
  )
}
