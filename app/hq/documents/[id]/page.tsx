import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import DocSign from '@/components/crm/DocSign'
import { currentUser } from '@/lib/crm/auth'
import { ensureFrozen, getAgreement, loadAgreements } from '@/lib/agreements/data'
import { internalTerms } from '@/lib/agreements/internal'
import { sampleInternal } from '@/lib/agreements/sample'

export const metadata = { title: 'Sign', robots: { index: false, follow: false } }

export default async function DocPage({ params }: { params: { id: string } }) {
  noStore()
  const sample = process.env.PLAN_SAMPLE === '1'
  const user = currentUser() ?? (sample ? 'alex@hewn.life' : null)
  if (!user) redirect(`/crm/login?next=${encodeURIComponent(`/hq/documents/${params.id}`)}`)
  const found = sample ? sampleInternal(params.id === 'signed') : await getAgreement(params.id)
  const doc = found && !sample ? await ensureFrozen(found) : found
  const terms = doc ? internalTerms(doc) : null
  if (!doc || !terms) redirect('/hq/documents')
  // The next document still waiting on this person's signature, for the "Next document" button.
  const all = sample ? [] : await loadAgreements().catch(() => [])
  const next = all.find(a => {
    const t = internalTerms(a)
    const i = t ? t.signers.findIndex(s => s.email === user) : -1
    return a.id !== doc.id && a.status !== 'Void' && a.status !== 'Signed' && i >= 0 && !(i === 0 ? a.hewnSig : a.clientSig)
  })
  return <DocSign user={user} doc={doc} terms={terms} next={next ? { id: next.id, title: next.title } : null} />
}
