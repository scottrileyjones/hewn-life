import { redirect } from 'next/navigation'
import { currentClientEmail } from '@/lib/portal/auth'
import PortalLogin from '@/components/portal/Login'

export const metadata = { title: 'Client portal', robots: { index: false, follow: false } }

export default function Login({ searchParams }: { searchParams: { expired?: string; next?: string } }) {
  const next = searchParams.next === 'billing' ? 'billing' : ''
  if (currentClientEmail()) redirect(next ? '/portal/billing' : '/portal')
  return <PortalLogin expired={Boolean(searchParams.expired)} next={next} />
}
