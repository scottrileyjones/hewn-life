import { redirect } from 'next/navigation'
import { currentUser, safeNext } from '@/lib/crm/auth'
import CrmLogin from '@/components/crm/Login'

export const metadata = { title: 'Sign in — Hewn Life CRM', robots: { index: false, follow: false } }

export default function Login({ searchParams }: { searchParams: { expired?: string; next?: string } }) {
  const next = safeNext(searchParams.next)
  if (currentUser()) redirect(next || '/hq')
  return <CrmLogin expired={Boolean(searchParams.expired)} next={next} />
}
