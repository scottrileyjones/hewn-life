'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Photo from '@/components/strata/Photo'
import StatCard from '@/components/strata/StatCard'
import type { Slide } from '@/lib/gallery'

/**
 * The checkout gallery: a swipeable set of slides that sells the package.
 * A clean cover photo, then one card per service with a single sourced stat.
 * Cards alternate photos (white type straight on the image, or on faint
 * glass) with flat lime or forest cards carrying a simple graphic. Slides peek at the
 * next one and a thin progress bar tracks where you are.
 * Sized in container units so one design scales from the phone to the
 * 400px summary column.
 */

/** The cover: just the photo. The plan's title sits in the summary below. */
function Cover({ s }: { s: Extract<Slide, { kind: 'cover' }> }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#5B4636' }}>
      <Photo name={s.photo} w={680} h={850} sizes="(min-width: 1024px) 360px, 88vw" film={false} priority className="[&_img]:text-transparent" />
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
            {s.kind === 'cover' ? <Cover s={s} /> : <StatCard s={s} />}
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
