import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Documents from '@/components/crm/Documents'
import { currentUser } from '@/lib/crm/auth'
import { loadAgreements } from '@/lib/agreements/data'
import { internalTerms, type InternalTerms } from '@/lib/agreements/internal'
import { sampleInternal } from '@/lib/agreements/sample'

export const metadata = { title: 'Docs', robots: { index: false, follow: false } }

export default async function DocumentsPage() {
  noStore()
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'alex@hewn.life' : null)
  if (!user) redirect('/crm/login?next=/hq/documents')
  const all = sample ? [sampleInternal(false), sampleInternal(true)] : await loadAgreements().catch(() => [])
  const docs = all.map(a => ({ ...a, terms: internalTerms(a) })).filter((a): a is typeof a & { terms: InternalTerms } => !!a.terms && a.status !== 'Void')
  return <Documents user={user} docs={docs} />
}
