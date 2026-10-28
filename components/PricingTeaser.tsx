'use client'
import { useState } from 'react'
import Link from 'next/link'
import { plans } from '@/lib/services'

export default function PricingTeaser() {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`font-body text-sm ${annual ? 'text-slate' : 'text-iron font-medium'}`}>Monthly</span>
        <button
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
          onClick={() => setAnnual(a => !a)}
          className={`relative w-12 h-7 rounded-full transition-colors ${annual ? 'bg-iron' : 'bg-black/15'}`}
        >
          <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-5' : ''}`} />
        </button>
        <span className={`font-body text-sm ${annual ? 'text-iron font-medium' : 'text-slate'}`}>Yearly</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss bg-ember/20 rounded-full px-2.5 py-1">Save 20%</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {plans.map(p => {
          const featured = p.slug === 'wrought'
          const price = annual ? p.price.annual : p.price.monthly
          return (
            <div
              key={p.slug}
              className={`rounded-3xl p-2 ${featured ? 'bg-iron' : 'bg-white border border-black/[0.06]'}`}
            >
              <div
                className={`rounded-[1.25rem] p-6 ${featured ? 'text-white' : 'bg-bone'}`}
                style={featured ? { background: 'linear-gradient(160deg, #3D4A3F 0%, #0D0D0D 90%)' } : undefined}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display font-semibold text-lg">{p.name}</p>
                  {featured && <span className="font-mono text-[10px] uppercase tracking-[0.14em] bg-ember text-iron rounded-full px-2.5 py-1">Most popular</span>}
                </div>
                <p className={`font-body text-sm mt-1 ${featured ? 'text-white/60' : 'text-slate'}`}>{p.tagline}</p>
                <p className="mt-6">
                  <span className="font-display font-bold text-4xl">${price.toLocaleString()}</span>
                  <span className={`font-body text-sm ${featured ? 'text-white/50' : 'text-slate'}`}> /mo{annual ? ', billed yearly' : ''}</span>
                </p>
                <Link
                  href="/pricing"
                  className={`mt-6 w-full inline-flex items-center justify-center font-body font-medium text-sm rounded-full py-3 transition ${
                    featured ? 'bg-ember text-iron hover:brightness-110' : 'bg-iron text-white hover:bg-charcoal'
                  }`}
                >
                  Choose {p.name}
                </Link>
              </div>
              <ul className="px-5 py-5 space-y-3">
                {p.highlights.map(h => (
                  <li key={h} className={`flex items-center gap-3 font-body text-sm ${featured ? 'text-white/80' : 'text-iron'}`}>
                    <svg className="w-4 h-4 flex-shrink-0 text-ember" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {h}
                  </li>
                ))}
                <li className={`font-mono text-[10px] uppercase tracking-[0.14em] pt-2 ${featured ? 'text-white/40' : 'text-ash'}`}>Pillars {p.pillars.join(' · ')}</li>
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
