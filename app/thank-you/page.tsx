import Link from 'next/link'
import type { Metadata } from 'next'
import PurchaseTracker from '@/components/PurchaseTracker'
import Terrain from '@/components/strata/Terrain'
import { Mark } from '@/components/strata/Glyph'

export const metadata: Metadata = {
  title: 'You\'re in — Hewn Life',
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default function ThankYou({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const transactionId = first(searchParams.payment_intent)
  const status = first(searchParams.redirect_status)
  const valueRaw = first(searchParams.value)
  const value = valueRaw ? Number(valueRaw) : undefined
  const itemName = first(searchParams.item_name)
  const itemId = first(searchParams.item_id)

  return (
    <div className="bg-bone px-5 pb-24 pt-20">
      <PurchaseTracker
        transactionId={transactionId}
        value={value}
        itemId={itemId}
        itemName={itemName}
        status={status}
      />
      <section className="relative isolate mx-auto flex min-h-[620px] max-w-[1400px] items-end overflow-hidden rounded-[32px] text-mist">
        <Terrain scene="amber" seed={99} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.7), rgba(20,16,10,.15) 80%)' }} />
        <div className="p-7 sm:p-14">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist/10 backdrop-blur"><Mark fg="#F4F2EC" accent="#D6F28B" size={30} /></span>
          <h1 className="mt-6 max-w-[12ch] font-display text-[clamp(44px,6vw,88px)] font-medium leading-none tracking-[-0.045em]">You&apos;re in. Let&apos;s get to work.</h1>
          <p className="mt-5 max-w-md font-body text-lg text-mist/85">
            Check your email. We&apos;ll be in touch within 24 hours to kick off onboarding.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/start" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Send your website brief</Link>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20">Back to home</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
