import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import CancelShell from '@/components/cancel/CancelShell'
import CancelConfirm from '@/components/cancel/CancelConfirm'
import { describeCancel, verifyCancelLink } from '@/lib/cancel'

export const metadata = {
  title: 'Confirm cancellation — Hewn Life',
  robots: { index: false, follow: false },
}

export default async function ConfirmCancel({ searchParams }: { searchParams: { e?: string; x?: string; s?: string } }) {
  noStore()
  const { e = '', x = '', s = '' } = searchParams
  if (!verifyCancelLink(e, Number(x), s)) {
    return (
      <CancelShell title="This link has expired" lede="Cancellation links work for 24 hours. Request a new one and it’ll arrive in a minute.">
        <Link href="/cancel" className="block w-full rounded-full bg-forest py-4 text-center font-body font-medium text-mist transition hover:bg-forest-2">Get a new link</Link>
      </CancelShell>
    )
  }
  const plans = await describeCancel(e).catch(() => [])
  if (!plans.length) {
    return (
      <CancelShell title="Nothing left to cancel" lede={`There’s no renewing plan on ${e}. If it was already cancelled, it stays active until the end of the period you paid for.`}>
        <p className="font-body text-[15px] text-ink/75">Questions? Email <a href="mailto:hello@hewn.life" className="text-forest underline underline-offset-2">hello@hewn.life</a>.</p>
      </CancelShell>
    )
  }
  return (
    <CancelShell title="Confirm cancellation" lede={`For ${e}.`}>
      <CancelConfirm e={e} x={x} s={s} plans={plans} />
    </CancelShell>
  )
}
