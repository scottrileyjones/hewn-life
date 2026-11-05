import { redirect } from 'next/navigation'
import { currentUser, safeNext } from '@/lib/crm/auth'
import CrmLogin from '@/components/crm/Login'

export const metadata = { title: 'Sign in — Hewn Life CRM', robots: { index: false, follow: false } }

export default async function Login(props: { searchParams: Promise<{ expired?: string; next?: string }> }) {
  const searchParams = await props.searchParams;
  const next = safeNext(searchParams.next)
  if (await currentUser()) redirect(next || '/hq')
  return <CrmLogin expired={Boolean(searchParams.expired)} next={next} />
}
