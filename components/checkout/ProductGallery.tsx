'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Photo from '@/components/strata/Photo'
import type { Graphic, Look, Slide } from '@/lib/gallery'

/**
 * The checkout gallery: a swipeable set of slides that sells the package.
 * A cover photo with the plan's name, then one card per service with a single sourced stat.
 * Cards alternate photos (white type straight on the image, or on faint
 * glass) with flat lime or forest cards carrying a simple graphic. Slides peek at the
 * next one and a thin progress bar tracks where you are.
 * Sized in container units so one design scales from the phone to the
 * 400px summary column.
 */

const C = {
  forest: '#1E3826',
  lime: '#D6F28B',
  sage: '#6E8A62',
  ink: '#14231A',
  white: '#FFFFFF',
}

/* ── Small parts ────────────────────────────────────────────── */

function Pill({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <span className="inline-block rounded-full px-[2.6cqw] py-[0.9cqw] font-body font-semibold uppercase leading-none tracking-[0.05em]" style={{ fontSize: '3.1cqw', background: bg, color: fg }}>
      {children}
    </span>
  )
}

/** Dark at the top and bottom so white type reads on any photo. */
const Scrim = () => (
  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(13,20,15,.45), rgba(0,0,0,.04) 30%, rgba(0,0,0,.04) 50%, rgba(13,20,15,.8))' }} />
)

/* ── Graphics for the colour cards ──────────────────────────── */

function Art({ name, color }: { name: Graphic; color: string }) {
  const svg = (vb: string, children: React.ReactNode) => <svg viewBox={vb} className="h-auto w-full" aria-hidden="true">{children}</svg>
  switch (name) {
    case 'funnel':
      return svg('0 0 100 76', [1, 0.72, 0.44, 0.2].map((s, i) => (
        <rect key={i} x={(100 - 100 * s) / 2} y={i * 20} width={100 * s} height={14} rx={7} fill={C.forest} opacity={i === 3 ? 1 : 0.18 + i * 0.18} />
      )))
    case 'pipeline':
      return svg('0 0 100 16', <>
        <rect x={8} y={7} width={84} height={2} fill={C.white} opacity={0.6} />
        {[0, 1, 2, 3].map(i => <circle key={i} cx={8 + i * 28} cy={8} r={i === 3 ? 8 : 6.8} fill={i === 3 ? C.white : color} stroke={C.white} strokeWidth={i === 3 ? 0 : 2} />)}
      </>)
    case 'swatches':
      return svg('0 0 100 36', [C.forest, C.sage, C.white, C.ink].map((c, i) => <circle key={i} cx={18 + i * 21.5} cy={18} r={18} fill={c} />))
    case 'bars':
      return svg('0 0 100 70', [0.3, 0.5, 0.75, 1].map((s, i) => (
        <rect key={i} x={i * 27.3} y={70 - 70 * s} width={18} height={70 * s} rx={9} fill={C.white} opacity={[0.4, 0.55, 0.75, 1][i]} />
      )))
    case 'stars':
      return svg('0 0 100 18', [0, 1, 2, 3, 4].map(i => (
        <polygon key={i} transform={`translate(${i * 20.5} 0)`} fill={C.white}
          points="9,0 11.1,6.1 17.6,6.2 12.4,10.1 14.3,16.3 9,12.6 3.7,16.3 5.6,10.1 0.4,6.2 6.9,6.1" />
      )))
    case 'clock':
      return svg('0 0 100 100', <>
        <circle cx={50} cy={50} r={45} fill="none" stroke={color} strokeWidth={8} />
        <rect x={46} y={22} width={8} height={32} rx={4} fill={color} />
        <rect x={46} y={46} width={26} height={8} rx={4} fill={color} />
        <circle cx={50} cy={50} r={7} fill={color} />
      </>)
  }
}

/* ── Slides ─────────────────────────────────────────────────── */

/** The service name, the stat and its source (or, for a list card, the list). */
function Body({ s, fg, pillBg, pillFg, statSize }: { s: Extract<Slide, { kind: 'stat' | 'list' }>; fg: string; pillBg: string; pillFg: string; statSize: number }) {
  return (
    <>
      <div><Pill bg={pillBg} fg={pillFg}>{s.service}</Pill></div>
      {s.kind === 'list' ? (
        <ul className="font-display font-medium leading-[1.2] tracking-[-0.02em]" style={{ fontSize: '7.4cqw', color: fg }}>
          {s.items.map(it => <li key={it}>{it}</li>)}
        </ul>
      ) : (
        <div style={{ color: fg }}>
          <p className="font-display leading-none tracking-[-0.04em] tabular-nums" style={{ fontSize: `${statSize}cqw` }}>{s.stat}</p>
          <p className="mt-[1.4cqw] max-w-[74cqw] font-body font-medium leading-snug" style={{ fontSize: '4.1cqw' }}>{s.text}</p>
          <p className="mt-[1.2cqw] font-body opacity-60" style={{ fontSize: '2.9cqw' }}>{s.source}</p>
        </div>
      )}
    </>
  )
}

function Card({ s }: { s: Extract<Slide, { kind: 'stat' | 'list' }> }) {
  const look: Look = s.look
  if ('photo' in look) {
    return (
      <div className={`relative isolate flex h-full w-full flex-col overflow-hidden ${look.glass ? 'justify-end p-[3.6cqw]' : 'justify-between p-[6.5cqw]'}`} style={{ background: '#2A4A32' }}>
        <Photo name={look.photo} w={680} h={850} sizes="(min-width: 1024px) 360px, 88vw" film={false} className="-z-20 [&_img]:text-transparent" />
        <Scrim />
        {look.glass ? (
          <div className="flex flex-col gap-[4cqw] rounded-[4.6cqw] border border-white/30 bg-white/[0.12] p-[4.6cqw] backdrop-blur-xl">
            <Body s={s} fg={C.white} pillBg={C.white} pillFg={C.ink} statSize={15} />
          </div>
        ) : <Body s={s} fg={C.white} pillBg={C.white} pillFg={C.ink} statSize={18.5} />}
      </div>
    )
  }
  const lime = look.color === 'lime'
  const bg = lime ? C.lime : C.forest
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-[6.5cqw]" style={{ background: bg }}>
      <Body s={s} fg={lime ? C.ink : C.white} pillBg={lime ? C.forest : C.lime} pillFg={lime ? C.white : C.ink} statSize={18.5} />
      {look.graphic && (
        <div className="absolute right-[6.5cqw] top-[18cqw]" style={{ width: look.graphic === 'clock' ? '38cqw' : '52cqw' }}>
          <Art name={look.graphic} color={lime ? C.forest : bg} />
        </div>
      )}
    </div>
  )
}

/** The cover: the photo with the plan's name over the bottom. */
function Cover({ s, title }: { s: Extract<Slide, { kind: 'cover' }>; title: string }) {
  return (
    <div className="relative isolate flex h-full w-full flex-col justify-end overflow-hidden p-[6.5cqw] text-white" style={{ background: '#5B4636' }}>
      <Photo name={s.photo} w={680} h={850} sizes="(min-width: 1024px) 360px, 88vw" film={false} priority className="-z-20 [&_img]:text-transparent" />
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(13,20,15,.7))' }} />
      <p className="font-display font-medium leading-[1.02] tracking-[-0.04em]" style={{ fontSize: '12cqw', textWrap: 'balance' } as React.CSSProperties}>{title}</p>
    </div>
  )
}

/* ── The carousel ───────────────────────────────────────────── */

export default function ProductGallery({ slides, label }: { slides: Slide[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)

  /** Distance between slide starts: one slide plus the gap. */
  const step = () => {
    const el = track.current
    const a = el?.children[0] as HTMLElement | undefined, b = el?.children[1] as HTMLElement | undefined
    return a && b ? b.offsetLeft - a.offsetLeft : el?.clientWidth || 1
  }

  const go = useCallback((i: number) => {
    const el = track.current
    if (!el) return
    const n = Math.max(0, Math.min(slides.length - 1, i))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: n * step(), behavior: reduce ? 'auto' : 'smooth' })
  }, [slides.length])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      // At the far end the last slide can't snap to the start, so count it as reached.
      setAt(el.scrollLeft >= max - 2 ? slides.length - 1 : Math.round(el.scrollLeft / step()))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <section className="group relative border-b border-black/[0.06] bg-white pt-3" aria-roledescription="carousel" aria-label={`${label}: what you get`}>
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1) } }}
        className="flex snap-x snap-mandatory scroll-px-3 gap-1.5 overflow-x-auto overscroll-x-contain px-3 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dawn [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div key={i} className="aspect-[4/5] w-[88%] shrink-0 snap-start snap-always overflow-hidden rounded-[18px]" style={{ containerType: 'inline-size' }}
            role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            {s.kind === 'cover' ? <Cover s={s} title={label} /> : <Card s={s} />}
          </div>
        ))}
      </div>

      {slides.length > 1 && <>
        {(['prev', 'next'] as const).map(dir => {
          const disabled = dir === 'prev' ? at === 0 : at === slides.length - 1
          return (
            <button key={dir} type="button" onClick={() => go(at + (dir === 'prev' ? -1 : 1))} disabled={disabled}
              aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
              className={`absolute top-[45%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md transition disabled:opacity-0 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 ${dir === 'prev' ? 'left-5' : 'right-5'}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
            </button>
          )
        })}
        {/* Progress bar: the filled part grows as you swipe through */}
        <div className="px-3 pb-4 pt-3">
          <div className="relative h-[2px] w-full rounded-full bg-ink/15" role="progressbar" aria-label="Slides" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={at + 1}>
            <span className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-300" style={{ width: `${((at + 1) / slides.length) * 100}%` }} />
          </div>
        </div>
      </>}
    </section>
  )
}
