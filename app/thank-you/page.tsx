import Link from 'next/link'
import type { Metadata } from 'next'
import PurchaseTracker from '@/components/PurchaseTracker'
import { paidOrder } from '@/lib/checkout/order'

export const metadata: Metadata = {
  title: 'Thank you — Hewn Life',
  robots: { index: false },
}
export const dynamic = 'force-dynamic'

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
const money = (cents: number, currency = 'usd') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100)

function Tick({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

/**
 * After payment: thank them, show what they bought, and send them straight to
 * their portal to tell us what we need (like a Fiverr order's requirements).
 */
export default async function ThankYou({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const transactionId = first(searchParams.payment_intent)
  const secret = first(searchParams.payment_intent_client_secret)
  const status = first(searchParams.redirect_status)
  const valueRaw = first(searchParams.value)
  const value = valueRaw ? Number(valueRaw) : undefined
  const itemName = first(searchParams.item_name)
  const itemId = first(searchParams.item_id)

  const order = await paidOrder(transactionId, secret)
  const firstName = (order?.name ?? '').trim().split(/\s+/)[0]
  const portalHref = order?.succeeded ? `/api/portal/checkout?${new URLSearchParams({ pi: order.id, s: secret! })}` : '/portal/login'
  const failed = status === 'failed'

  const steps = [
    { title: 'Order placed', body: 'Payment received. Your receipt is on its way.', state: 'done' },
    { title: 'Tell us what we need', body: 'A few quick questions and your files, in your portal. About 10 minutes.', state: 'now' },
    { title: 'We get to work', body: 'You’ll see every step in your portal, and we’ll email you as things move.', state: 'next' },
  ] as const

  return (
    <div className="bg-bone px-5 pb-24 pt-28">
      <PurchaseTracker transactionId={transactionId} value={value} itemId={itemId} itemName={itemName} status={status} />

      <div className="mx-auto max-w-3xl">
        {failed ? (
          <div className="rounded-[32px] border border-ink/[0.08] bg-white p-8 text-center sm:p-12">
            <h1 className="font-display text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.03em]">Your payment didn’t go through.</h1>
            <p className="mx-auto mt-3 max-w-md font-body text-ink/70">Nothing was charged. Try again with another card, or reply to any of our emails and we’ll help.</p>
            <Link href="/pricing" className="mt-7 inline-flex rounded-full bg-forest px-7 py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">Back to pricing</Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-forest">
                <Tick className="h-8 w-8" />
              </span>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-forest">Payment received</p>
              <h1 className="mt-3 font-display text-[clamp(38px,5vw,64px)] font-medium leading-[1.02] tracking-[-0.04em]">
                Thank you{firstName ? `, ${firstName}` : ''}!
              </h1>
              <p className="mx-auto mt-4 max-w-lg font-body text-lg text-ink/70">
                Your order is confirmed{order?.email ? <> and a receipt is on its way to <span className="font-medium text-ink">{order.email}</span></> : ''}. One quick thing and we can start.
              </p>
            </div>

            {/* The next step, front and centre */}
            <div className="mt-10 overflow-hidden rounded-[32px] bg-forest text-mist">
              <div className="p-7 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">Your next step</p>
                <h2 className="mt-3 font-display text-[clamp(26px,3vw,36px)] font-medium leading-tight tracking-[-0.03em]">Tell us what we need to get started.</h2>
                <p className="mt-3 max-w-xl font-body text-mist/75">Your portal has a short checklist for exactly what you bought: a few questions, logins to share and files to upload. The sooner it’s in, the sooner your work starts.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a href={portalHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-body text-[15px] font-semibold text-forest transition hover:bg-white">
                    Start my requirements <span aria-hidden>→</span>
                  </a>
                  <p className="font-body text-sm text-mist/60">Takes about 10 minutes. We’ve also emailed you a link.</p>
                </div>
              </div>
              <ol className="grid grid-cols-1 border-t border-mist/10 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.title} className={`flex gap-3 p-6 ${i ? 'border-t border-mist/10 sm:border-l sm:border-t-0' : ''} ${s.state === 'now' ? 'bg-forest-2' : ''}`}>
                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${s.state === 'done' ? 'bg-lime text-forest' : s.state === 'now' ? 'bg-mist text-forest' : 'border border-mist/30 text-mist/60'}`}>
                      {s.state === 'done' ? <Tick className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span>
                      <span className="block font-body text-sm font-semibold">{s.title}{s.state === 'now' && <span className="ml-2 rounded-full bg-lime px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-forest">Now</span>}</span>
                      <span className="mt-1 block font-body text-xs leading-relaxed text-mist/65">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* What they bought */}
            {order && order.lines.length > 0 && (
              <div className="mt-4 rounded-[28px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Your order</p>
                <ul className="mt-4 divide-y divide-ink/[0.06]">
                  {order.lines.map(l => (
                    <li key={l.name} className="flex items-start justify-between gap-4 py-3.5">
                      <span className="min-w-0">
                        <span className="block font-body text-[15px] font-medium">{l.name}</span>
                        {l.detail && <span className="mt-0.5 block font-body text-sm text-ink/60">{l.detail}</span>}
                      </span>
                      {l.amount !== undefined && <span className="flex-shrink-0 font-body text-[15px] tabular-nums">{money(l.amount, order.currency)}</span>}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between border-t border-ink/[0.08] pt-4">
                  <span className="font-body text-sm text-ink/60">Paid today</span>
                  <span className="font-display text-[24px] font-medium tabular-nums">{money(order.amount, order.currency)}</span>
                </div>
              </div>
            )}

            <p className="mt-8 text-center font-body text-sm text-ink/55">
              Questions? Email <a href="mailto:hello@hewn.life" className="font-medium text-forest underline-offset-2 hover:underline">hello@hewn.life</a>, or message us from your portal.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
