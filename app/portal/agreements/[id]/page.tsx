import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { unstable_noStore as noStore } from 'next/cache'
import AgreementView from '@/components/portal/AgreementView'
import { currentClientEmail } from '@/lib/portal/auth'
import { findClient } from '@/lib/portal/data'
import { getAgreement, markViewed } from '@/lib/agreements/data'
import { payLink } from '@/lib/agreements/pay'
import { sampleAgreement } from '@/lib/agreements/sample'

export const metadata = { title: 'Your agreement', robots: { index: false, follow: false } }

export default async function AgreementPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  noStore()
  if (process.env.PLAN_SAMPLE === '1') {
    const a = sampleAgreement('Wrought', params.id === 'signed')
    return <AgreementView email={a.clientEmail} agreement={a} payUrl={null} />
  }
  const email = (await currentClientEmail())
  if (!email) redirect('/portal/login')
  const client = await findClient(email)
  if (!client || client.status === 'Past') redirect('/portal/login')
  let a = await getAgreement(params.id)
  if (!a || a.clientEmail !== client.email) redirect('/portal')
  a = await markViewed(a, ((await headers()).get('x-forwarded-for') || '').split(',')[0].trim()).catch(() => a!)
  return <AgreementView email={client.email} agreement={a} payUrl={a.status === 'Signed' ? payLink(a) : null} />
}
