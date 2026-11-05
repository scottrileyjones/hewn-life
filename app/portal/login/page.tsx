import { redirect } from 'next/navigation'
import { currentClientEmail } from '@/lib/portal/auth'
import PortalLogin from '@/components/portal/Login'

export const metadata = { title: 'Client portal', robots: { index: false, follow: false } }

export default async function Login(props: { searchParams: Promise<{ expired?: string; next?: string }> }) {
  const searchParams = await props.searchParams;
  const next = searchParams.next === 'billing' ? 'billing' : ''
  if (await currentClientEmail()) redirect(next ? '/portal/billing' : '/portal')
  return <PortalLogin expired={Boolean(searchParams.expired)} next={next} />
}
