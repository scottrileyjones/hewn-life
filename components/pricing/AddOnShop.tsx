'use client'
/**
 * The à la carte shop on /pricing: add-ons in four sections, each with a kit
 * that bundles its items for less. Picks gather in a cart bar that checks out
 * in one payment. Picking every item of a kit swaps the kit in automatically.
 */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Glyph } from '@/components/strata/Glyph'
import { ADDONS, KITS, SECTIONS, cartTotals, kitListPrice, kitNudge, lookup, normalizeCart, type Kit } from '@/lib/addons'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const KEY = 'hewn-addon-cart'

function Check({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function AddOnShop({ onCartChange }: { onCartChange?: (count: number) => void }) {
  const router = useRouter()
  const [cart, setCart] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Remember picks for this visitor only, so a reload doesn't empty the cart.
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]'); if (Array.isArray(saved)) setCart(normalizeCart(saved.map(String))) } catch {}
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem(KEY, JSON.stringify(cart)) } catch {}
    onCartChange?.(cart.length)
  }, [cart, mounted, onCartChange])

  const kitHolding = (sku: string) => KITS.find(k => cart.includes(k.sku) && k.includes.includes(sku))

  const toggleItem = (sku: string) => setCart(c => {
    if (c.includes(sku)) return c.filter(s => s !== sku)
    // Taking one item out of a chosen kit breaks the kit back into the rest.
    const kit = KITS.find(k => c.includes(k.sku) && k.includes.includes(sku))
    if (kit) return normalizeCart([...c.filter(s => s !== kit.sku), ...kit.includes.filter(s => s !== sku)])
    return normalizeCart([...c, sku])
  })
  const toggleKit = (k: Kit) => setCart(c => (c.includes(k.sku) ? c.filter(s => s !== k.sku) : normalizeCart([...c, k.sku])))

  const { lines, total, saved } = cartTotals(cart)
  const nudge = kitNudge(cart)
  const count = lines.reduce((n, l) => n + ('includes' in l ? l.includes.length : 1), 0)

  const checkout = () => router.push(`/checkout?${new URLSearchParams({ items: cart.join(','), mode: 'payment' })}`)

  return (
    <>
      <div className="mb-10 max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">À la carte</span>
        <h2 className="mt-3.5 font-display text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.05] tracking-[-0.03em]">
          Pick what you need. <span className="font-accent italic text-dawn">Skip the contract.</span>
        </h2>
        <p className="mt-3 font-body text-mist/75">Fixed prices, paid once. Grab a single item, or take the whole kit in a section and save around 20%.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SECTIONS.map(sec => {
          const kit = lookup(sec.kit) as Kit
          const kitIn = cart.includes(kit.sku)
          const list = kitListPrice(kit)
          return (
            <section key={sec.key} aria-labelledby={`sec-${sec.key}`} className="flex min-w-0 flex-col rounded-[24px] bg-forest-2 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-forest">
                  <Glyph name={sec.glyph} fg="#F4F2EC" accent="#D6F28B" size={26} />
                </div>
                <div className="min-w-0">
                  <h3 id={`sec-${sec.key}`} className="font-display text-[20px] font-semibold tracking-[-0.02em]">{sec.title}</h3>
                  <p className="font-body text-xs text-mist/65">{sec.blurb}</p>
                </div>
              </div>

              <ul className="flex-1 divide-y divide-mist/10">
                {sec.items.map(sku => {
                  const a = ADDONS.find(x => x.sku === sku)!
                  const inKit = kitHolding(sku)
                  const picked = cart.includes(sku) || Boolean(inKit)
                  return (
                    <li key={sku} className="flex items-start gap-4 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="font-body text-sm font-medium">{a.name}</p>
                        <p className="mt-0.5 font-body text-xs leading-relaxed text-mist/65">{a.detail}</p>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-end gap-2">
                        <span className="font-display text-[18px] font-medium tabular-nums">{usd(a.fee)}</span>
                        <button type="button" onClick={() => toggleItem(sku)} aria-pressed={picked} aria-label={`${picked ? 'Remove' : 'Add'} ${a.name}`}
                          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body text-xs font-medium transition ${picked ? 'bg-lime text-forest' : 'bg-mist/10 text-mist hover:bg-mist hover:text-forest'}`}>
                          {picked ? <><Check /> {inKit ? 'In kit' : 'Added'}</> : '+ Add'}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className={`mt-3 rounded-[18px] p-4 transition ${kitIn ? 'bg-lime text-forest' : 'border border-lime/40 bg-forest'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-body text-sm font-semibold">
                      {kit.name}
                      <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${kitIn ? 'bg-forest text-lime' : 'bg-lime text-forest'}`}>Save {usd(list - kit.fee)}</span>
                    </p>
                    <p className={`mt-0.5 font-body text-xs ${kitIn ? 'text-forest/75' : 'text-mist/65'}`}>{kit.pitch}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center justify-between gap-3">
                    <span className="sm:text-right">
                      <span className={`block font-body text-xs line-through ${kitIn ? 'text-forest/60' : 'text-mist/50'}`}>{usd(list)}</span>
                      <span className="block font-display text-[22px] font-medium leading-none tabular-nums">{usd(kit.fee)}</span>
                    </span>
                    <button type="button" onClick={() => toggleKit(kit)} aria-pressed={kitIn} aria-label={`${kitIn ? 'Remove' : 'Add'} ${kit.name}`}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 font-body text-xs font-medium transition ${kitIn ? 'bg-forest text-mist' : 'bg-lime text-forest hover:bg-white'}`}>
                      {kitIn ? <><Check /> Kit added</> : 'Add the kit'}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Cart bar, on <body> so no transformed parent can trap it */}
      {mounted && createPortal(<div aria-live="polite"
        className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 transition-transform duration-300 sm:px-5 sm:pb-5"
        style={{ transform: lines.length ? 'translateY(0)' : 'translateY(120%)', visibility: lines.length ? 'visible' : 'hidden', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-[24px] bg-ink p-4 text-mist shadow-2xl sm:flex-row sm:items-center sm:gap-5 sm:pl-6">
          <div className="min-w-0 flex-1">
            <p className="font-body text-sm">
              <span className="font-semibold">{count} item{count === 1 ? '' : 's'}</span>
              <span className="mx-2 text-mist/40">·</span>
              <span className="font-display text-[20px] font-medium tabular-nums">{usd(total)}</span>
              {saved > 0 && <span className="ml-2 rounded-full bg-lime px-2 py-0.5 font-body text-[11px] font-medium text-forest">You save {usd(saved)}</span>}
            </p>
            {nudge ? (
              <button type="button" onClick={() => toggleItem(nudge.add.sku)} className="mt-1 text-left font-body text-xs text-lime underline-offset-2 hover:underline">
                Add {nudge.add.name} for {usd(nudge.extra)} more and get the {nudge.kit.name} (save {usd(nudge.saves)})
              </button>
            ) : (
              <p className="mt-1 truncate font-body text-xs text-mist/60">{lines.map(l => l.name).join(' + ')}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCart([])} className="rounded-full px-4 py-3 font-body text-xs text-mist/70 transition hover:text-mist">Clear</button>
            <button type="button" onClick={checkout} className="flex-1 whitespace-nowrap rounded-full bg-lime px-6 py-3 font-body text-sm font-medium text-forest transition hover:bg-white sm:flex-none">
              Check out →
            </button>
          </div>
        </div>
      </div>, document.body)}
    </>
  )
}
