import { redirect } from 'next/navigation'
import { currentUser } from '@/lib/crm/auth'
import CrmLogin from '@/components/crm/Login'

export const metadata = { title: 'Sign in — Hewn Life CRM', robots: { index: false, follow: false } }

export default function Login({ searchParams }: { searchParams: { expired?: string } }) {
  if (currentUser()) redirect('/hq')
  return <CrmLogin expired={Boolean(searchParams.expired)} />
}
