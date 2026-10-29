import CancelShell from '@/components/cancel/CancelShell'
import CancelRequest from '@/components/cancel/CancelRequest'

export const metadata = {
  title: 'Cancel your subscription — Hewn Life',
  description: 'Cancel your Hewn Life monthly plan online.',
  robots: { index: false, follow: true },
}

export default function Cancel() {
  return (
    <CancelShell title="Cancel your subscription" lede="No call, no fee. Enter the email on your subscription and we’ll send you a link to confirm.">
      <CancelRequest />
    </CancelShell>
  )
}
