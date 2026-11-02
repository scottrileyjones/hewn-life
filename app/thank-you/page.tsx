import Link from 'next/link'
import type { Metadata } from 'next'
import PurchaseTracker from '@/components/PurchaseTracker'
import { paidOrder } from '@/lib/checkout/order'
import { PHASES, stepsFor, type Progress } from '@/lib/portal/onboarding'
import { findClient } from '@/lib/portal/data'
import { requirementsSoFar } from '@/lib/portal/fromBrief'

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

  // The plan for exactly what they bought: their requirements first, then the phases we take it through.
  const plan = order ? stepsFor(order.pkg) : []
  const reqs = plan.filter(st => st.owner === 'client' && st.phase === 'kickoff')
  const isAddons = order?.pkg.startsWith('addons:') ?? false
  const phaseLabel: Record<string, string> = { received: 'Order received', kickoff: 'Your requirements', building: 'We build', review: 'Your review', live: isAddons ? 'Delivered' : 'Live' }
  const phases = (plan.length ? PHASES.filter(ph => plan.some(st => st.phase === ph.id)) : PHASES).map(ph => ph.id)

  // Anything they already gave us (their Website Brief, or earlier in the portal) shows as done.
  let have: Progress = {}
  if (order?.succeeded && reqs.length) {
    try {
      const saved = process.env.PLAN_SAMPLE === '1' ? {} : (await findClient(order.email))?.progress ?? {}
      have = await requirementsSoFar(order.email, order.pkg, saved)
    } catch (err) { console.error('Thank-you requirements lookup failed:', err) }
  }
  const sent = (id: string) => !!(have[id]?.submitted || have[id]?.done)
  const started = (id: string) => !sent(id) && !!(Object.keys(have[id]?.data ?? {}).length || have[id]?.files?.length)
  const sentCount = reqs.filter(r => sent(r.id)).length
  const allIn = reqs.length > 0 && sentCount === reqs.length
  const nowAt = allIn ? 2 : 1

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
                Your order is confirmed{order?.email ? <> and your receipt is on its way to <span className="font-medium text-ink">{order.email}</span></> : ''}. We’re ready to start.
              </p>
            </div>

            {/* The plan, and the step we're starting on now */}
            <div className="mt-10 overflow-hidden rounded-[32px] bg-forest text-mist">
              <div className="p-7 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">Your plan{order?.title && order.title !== 'Your order' ? ` · ${order.title}` : ''}</p>
                <h2 className="mt-3 font-display text-[clamp(26px,3vw,38px)] font-medium leading-tight tracking-[-0.03em]">
                  {allIn ? 'You’ve already sent us what we need.' : sentCount ? 'Your plan is ready, and you’re partway there.' : 'Your plan is ready. Let’s start step one.'}
                </h2>
                <p className="mt-3 max-w-xl font-body text-mist/75">
                  {allIn
                    ? 'Your Website Brief covered every requirement, so we’re starting the build. Check your portal any time to add to it.'
                    : sentCount
                      ? `Your Website Brief already covered ${sentCount} of ${reqs.length}. Finish the rest and we start work as soon as it’s in.`
                      : <>We’ve laid out exactly what we need for {isAddons ? 'what you ordered' : 'your project'}. Go through it now and we start work as soon as it’s in.</>}
                </p>

                {/* Phase track */}
                <ol className="mt-8 flex items-start" aria-label="Your plan">
                  {phases.map((id, i) => {
                    const state = i < nowAt ? 'done' : i === nowAt ? 'now' : 'next'
                    return (
                      <li key={id} className="relative flex flex-1 flex-col items-center text-center">
                        {i > 0 && <span className={`absolute right-1/2 top-[15px] h-[2px] w-full ${i <= nowAt ? 'bg-lime' : 'bg-mist/15'}`} aria-hidden />}
                        <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${state === 'done' ? 'bg-lime text-forest' : state === 'now' ? 'bg-forest ring-2 ring-lime' : 'border border-mist/25 bg-forest'}`}>
                          {state === 'done' ? <Tick className="h-4 w-4" /> : state === 'now' ? <span className="h-2.5 w-2.5 rounded-full bg-lime" /> : null}
                        </span>
                        <span className={`mt-2 px-1 font-body text-[11px] leading-tight sm:text-xs ${state === 'next' ? 'text-mist/50' : 'font-semibold text-mist'}`}>{phaseLabel[id]}</span>
                      </li>
                    )
                  })}
                </ol>
              </div>

              <div className="border-t border-mist/10 bg-forest-2 p-7 sm:p-10">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">
                  <span className="rounded-full bg-lime px-2 py-0.5 text-[9px] text-forest">{allIn ? 'Done' : 'Now'}</span> Step one: your requirements{sentCount > 0 && <span className="whitespace-nowrap normal-case tracking-normal text-mist/55">· {sentCount} of {reqs.length} in</span>}
                </p>
                {reqs.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {reqs.map(r => (
                      <li key={r.id} className="flex items-start gap-3">
                        {sent(r.id)
                          ? <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-lime text-forest" aria-label="Done"><Tick className="h-3.5 w-3.5" /></span>
                          : <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-md border-2 border-mist/40" aria-hidden />}
                        <span>
                          <span className={`flex flex-wrap items-center gap-2 font-body text-[15px] font-medium ${sent(r.id) ? 'text-mist/75' : ''}`}>
                            {r.title}
                            {sent(r.id) && <span className="rounded-full bg-mist/10 px-2 py-0.5 whitespace-nowrap text-[11px] font-normal text-lime">From your brief</span>}
                            {started(r.id) && <span className="rounded-full bg-mist/10 px-2 py-0.5 text-[11px] font-normal text-mist/80">Started</span>}
                          </span>
                          <span className="mt-0.5 block font-body text-[13px] leading-snug text-mist/60">{r.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 font-body text-mist/75">A short checklist in your portal: the questions, logins and files your project needs.</p>
                )}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a href={portalHref} className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-lime px-7 py-4 font-body text-[15px] font-semibold text-forest transition hover:bg-white">
                    {allIn ? 'Open your portal' : sentCount ? 'Finish the rest' : 'Start now'} <span aria-hidden>→</span>
                  </a>
                  <p className="font-body text-sm text-mist/60">{allIn ? 'Your answers are already in your portal, and we’ve emailed you a link too.' : sentCount ? 'Your brief answers are already filled in. Each part saves as you send it, and we’ve emailed you a link too.' : 'About 10 minutes. Each part saves as you send it, and we’ve emailed you a link too.'}</p>
                </div>
              </div>
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
