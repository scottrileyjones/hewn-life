import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import DocSign from '@/components/crm/DocSign'
import { currentUser } from '@/lib/crm/auth'
import { ensureFrozen, getAgreement } from '@/lib/agreements/data'
import { internalTerms } from '@/lib/agreements/internal'
import { sampleInternal } from '@/lib/agreements/sample'

export const metadata = { title: 'Sign', robots: { index: false, follow: false } }

export default async function DocPage({ params }: { params: { id: string } }) {
  noStore()
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'alex@hewn.life' : null)
  if (!user) redirect('/crm/login')
  const found = sample ? sampleInternal(params.id === 'signed') : await getAgreement(params.id)
  const doc = found && !sample ? await ensureFrozen(found) : found
  const terms = doc ? internalTerms(doc) : null
  if (!doc || !terms) redirect('/hq/documents')
  return <DocSign user={user} doc={doc} terms={terms} />
}
