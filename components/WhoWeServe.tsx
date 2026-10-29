'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Terrain from '@/components/strata/Terrain'
import Photo from '@/components/strata/Photo'
import { Glyph } from '@/components/strata/Glyph'
import { audiences } from '@/lib/audiences'
import { colors } from '@/lib/strata'

/** Tabs for each audience; the open tab follows the URL hash so it can be linked. */
export default function WhoWeServe() {
  const [active, setActive] = useState(audiences[0].id)

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1)
      if (audiences.some(a => a.id === id)) setActive(id)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const choose = (id: string) => {
    setActive(id)
    history.replaceState(null, '', `#${id}`)
  }

  const a = audiences.find(x => x.id === active)!

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
      <div role="tablist" aria-label="Who we serve" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        {audiences.map(x => (
          <button
            key={x.id}
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={x.id === active}
            aria-controls={`panel-${x.id}`}
            onClick={() => choose(x.id)}
            className={`flex flex-shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2.5 font-body text-[15px] font-medium transition-colors ${
              x.id === active ? 'border-forest bg-forest text-mist' : 'border-ink/[0.12] bg-paper text-ink/75 hover:border-ink/35 hover:text-ink'
            }`}
          >
            <Glyph name={x.glyph} fg={x.id === active ? colors.mist : colors.forest} accent={x.id === active ? colors.lime : colors.lichen} size={18} />
            {x.tab}
          </button>
        ))}
      </div>

      <div
        key={a.id}
        role="tabpanel"
        id={`panel-${a.id}`}
        aria-labelledby={`tab-${a.id}`}
        className="mt-6 grid animate-fade-up gap-3.5 lg:grid-cols-[1.15fr_1fr]"
      >
        <div className="rounded-[32px] border border-ink/[0.08] bg-paper p-7 sm:p-10 lg:p-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">{a.eyebrow}</span>
          <h2 className="mt-4 text-balance font-display text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.06] tracking-[-0.03em]">
            {a.title} <em className="accent text-forest">{a.accent}</em>
          </h2>
          <p className="mt-4 max-w-[36em] font-body text-[17px] text-ink/70">{a.intro}</p>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">What we build</p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {a.build.map(item => (
              <li key={item} className="flex items-start gap-3 font-body text-[15px] text-ink/85">
                <span className="mt-1.5 h-3.5 w-[3px] flex-shrink-0 bg-ember" />{item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-2.5">
            {a.cta.href ? (
              <Link href={a.cta.href} className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">{a.cta.label} →</Link>
            ) : (
              <CalButton className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">{a.cta.label} →</CalButton>
            )}
            <Link href="/pricing#plans" className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3.5 font-body text-[15px] font-medium transition hover:border-ink/40">See plans</Link>
          </div>
        </div>

        <div className="grid gap-3.5">
          <div className="relative isolate min-h-[280px] overflow-hidden rounded-[32px] bg-sand text-mist lg:min-h-[340px]">
            {'photo' in a.visual
              ? <Photo name={a.visual.photo} w={800} h={640} sizes="(min-width: 1024px) 560px, 100vw" className="-z-20" />
              : <Terrain scene={a.visual.scene} seed={a.visual.seed} className="-z-20" />}
            <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(0deg, rgba(20,16,10,.6), transparent 55%)' }} />
            {a.stat && (
              <div className="absolute bottom-6 left-7">
                <p className="font-display text-[64px] font-medium leading-none tracking-[-0.04em]">{a.stat.value}</p>
                <p className="mt-1 font-body text-sm text-mist/85">{a.stat.label}</p>
              </div>
            )}
          </div>
          <div className="rounded-[32px] bg-forest p-7 text-mist sm:p-9">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/65">Why Hewn</p>
            <ul className="mt-5 space-y-5">
              {a.why.map(w => (
                <li key={w.title}>
                  <p className="flex items-center gap-2.5 font-display text-[17px] font-medium"><span className="h-3.5 w-[3px] bg-lime" />{w.title}</p>
                  <p className="mt-1 pl-[13px] font-body text-[14px] text-mist/75">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
