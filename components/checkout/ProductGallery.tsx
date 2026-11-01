'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Photo from '@/components/strata/Photo'
import { Mark } from '@/components/strata/Glyph'
import LineIcon from '@/components/checkout/LineIcon'
import { platforms, type PlatformKey } from '@/lib/platforms'
import type { Result, Slide } from '@/lib/gallery'

/**
 * The checkout gallery: a swipeable set of slides that sells the package.
 * Bright and flat: white grounds with plenty of air, soft warm cards, line
 * icons and one accent (copper) with sage as the quiet second colour.
 * Photography carries the hero. Sized in container units so one design
 * scales from the phone to the 400px summary column.
 */

const C = {
  white: '#FFFFFF',
  card: '#F6F3EE',
  line: '#ECE7DF',
  ink: '#1C1A17',
  muted: '#6E6860',
  copper: '#B5621C',   // accent fills with white text, icon strokes
  dawn: '#D9893F',
  sage: '#93A58A',
  sageSoft: '#EAEFE6',
  sageDeep: '#4F6449',
}

/* ── Small parts ────────────────────────────────────────────── */

function Logo({ k, size = 16 }: { k: PlatformKey; size?: number }) {
  const p = platforms[k]
  if (!p.path) return null
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={p.name} className="shrink-0">
      <path d={p.path} fill={p.hex} />
    </svg>
  )
}

/** A headline whose [bracketed] words sit in a pill. */
function Headline({ text, onPhoto, size = 7.6 }: { text: string; onPhoto?: boolean; size?: number }) {
  const parts = text.split(/(\[[^\]]+\])/).filter(Boolean)
  return (
    <p className="font-display font-bold leading-[1.12] tracking-[-0.035em]" style={{ fontSize: `${size}cqw`, textWrap: 'balance' } as React.CSSProperties}>
      {parts.map((p, i) => p.startsWith('[')
        ? <span key={i} className="mx-[0.04em] inline-block rounded-full px-[0.32em] leading-[1.08]"
            style={onPhoto ? { background: C.white, color: C.ink } : { background: C.copper, color: C.white }}>{p.slice(1, -1)}</span>
        : <span key={i}>{p}</span>)}
    </p>
  )
}

const Example = () => (
  <span className="absolute left-1/2 top-[1cqw] z-10 -translate-x-1/2 rounded-full border px-[2.2cqw] py-[0.6cqw] font-body font-medium" style={{ fontSize: '2.1cqw', borderColor: C.line, background: C.white, color: C.muted }}>Example</span>
)

/* ── Slides ─────────────────────────────────────────────────── */

function SlideView({ s, n, total }: { s: Slide; n: number; total: number }) {
  const photo = s.kind === 'hero'
  return (
    <div className={`relative isolate flex h-full w-full flex-col overflow-hidden p-[6cqw] ${photo ? 'text-white' : ''}`} style={{ background: photo ? '#5B4636' : C.white, color: photo ? undefined : C.ink }}>
      {s.kind === 'hero' && <>
        <Photo name={s.photo} w={800} h={600} sizes="(min-width: 1024px) 400px, 100vw" film={false} className="-z-20 [&_img]:text-transparent" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,0) 28%, rgba(0,0,0,0) 40%, rgba(0,0,0,.62))' }} />
      </>}

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[1.4cqw]">
          <Mark fg={photo ? C.white : C.ink} accent={photo ? C.white : C.copper} size={16} />
          <span className="font-display font-semibold leading-none" style={{ fontSize: '3.2cqw' }}>hewn<span className="accent" style={{ color: photo ? C.white : C.copper }}>life</span></span>
        </span>
        {s.kind === 'hero'
          ? <span className="rounded-full bg-white px-[2.4cqw] py-[0.9cqw] font-body font-medium" style={{ fontSize: '2.4cqw', color: C.ink }}>{s.tag}</span>
          : <span className="font-body tabular-nums" style={{ fontSize: '2.4cqw', color: C.muted }}>{n} / {total}</span>}
      </div>

      {s.kind === 'hero' && s.glass && (
        <div className="mt-[4cqw] flex justify-end">
          <div className="flex items-center gap-[2cqw] rounded-[3cqw] border border-white/25 bg-white/[0.16] px-[2.8cqw] py-[1.8cqw] text-white shadow-[0_2cqw_6cqw_rgba(0,0,0,.25),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-md">
            <span className="flex h-[6cqw] w-[6cqw] items-center justify-center rounded-full bg-white">
              {s.glass.logo ? <Logo k={s.glass.logo} size={16} /> : s.glass.icon && <LineIcon name={s.glass.icon} color={C.copper} size={15} />}
            </span>
            <span className="leading-tight">
              <span className="block font-body font-semibold" style={{ fontSize: '2.8cqw' }}>{s.glass.label}</span>
              <span className="flex items-center gap-[0.8cqw] font-body text-white/85" style={{ fontSize: '2.3cqw' }}><span className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#8BD36B]" />{s.glass.sub}</span>
            </span>
          </div>
        </div>
      )}

      {s.kind === 'hero' && (
        <div className="mt-auto">
          <Headline text={s.head} onPhoto size={8.4} />
          <p className="mt-[2.4cqw] max-w-[88%] font-body leading-snug text-white/90" style={{ fontSize: '3.3cqw' }}>{s.sub}</p>
        </div>
      )}

      {s.kind === 'features' && (
        <>
          <div className="mt-[4cqw]"><Headline text={s.head} size={7} /></div>
          <ul className="mt-[3.4cqw] grid grid-cols-2 gap-[2.2cqw]">
            {s.items.map(it => (
              <li key={it.title} className="rounded-[3.4cqw] px-[3cqw] py-[2.6cqw]" style={{ background: C.card }}>
                <span className="flex items-center gap-[1.6cqw]">
                  <LineIcon name={it.icon} color={C.copper} size={18} />
                  <span className="font-display font-semibold leading-tight" style={{ fontSize: '3cqw' }}>{it.title}</span>
                </span>
                <p className="mt-[1cqw] font-body leading-snug" style={{ fontSize: '2.4cqw', color: C.muted }}>{it.text}</p>
              </li>
            ))}
          </ul>
          {s.note && <p className="mt-auto font-body" style={{ fontSize: '2.5cqw', color: C.muted }}>{s.note}</p>}
        </>
      )}

      {s.kind === 'platforms' && (
        <>
          <div className="mt-[4.4cqw]"><Headline text={s.head} /></div>
          <p className="mt-[1.8cqw] max-w-[90%] font-body leading-snug" style={{ fontSize: '3cqw', color: C.muted }}>{s.sub}</p>
          <ul className="mt-auto grid grid-cols-2 gap-[2.4cqw]">
            {s.logos.map(k => (
              <li key={k} className="flex items-center gap-[2.4cqw] rounded-[3.4cqw] px-[3.2cqw] py-[3cqw]" style={{ background: C.card }}>
                <Logo k={k} size={26} />
                <span className="font-display font-semibold" style={{ fontSize: '3.3cqw' }}>{platforms[k].name}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {s.kind === 'result' && (
        <>
          <div className="relative mt-[2cqw] min-h-0 flex-1">
            <div className="absolute inset-0"><ResultView r={s.result} /></div>
          </div>
          <div className="mt-[2.4cqw] text-center"><Headline text={s.head} size={6.4} /></div>
        </>
      )}

      {s.kind === 'steps' && (
        <>
          <div className="mt-[4.4cqw]"><Headline text={s.head} /></div>
          <ol className="mt-auto flex flex-col gap-[2cqw]">
            {s.steps.map((st, i) => {
              const last = i === s.steps.length - 1
              return (
                <li key={st.what} className="flex items-center gap-[3cqw] rounded-[3.4cqw] px-[3.4cqw] py-[2.6cqw]" style={{ background: last ? C.sageSoft : C.card }}>
                  <span className="flex h-[7cqw] w-[7cqw] shrink-0 items-center justify-center rounded-full font-display font-bold text-white" style={{ fontSize: '3cqw', background: last ? C.sageDeep : C.copper }}>{i + 1}</span>
                  <span>
                    <span className="block font-body font-medium" style={{ fontSize: '2.4cqw', color: last ? C.sageDeep : C.muted }}>{st.when}</span>
                    <span className="block font-display font-semibold leading-snug" style={{ fontSize: '3.3cqw' }}>{st.what}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </div>
  )
}

/* ── End-result compositions: real example content, flat, on white ── */

const card = 'absolute rounded-[3cqw] bg-white border shadow-[0_2cqw_6cqw_rgba(60,40,20,.10)]'

function ResultView({ r }: { r: Result }) {
  if (r === 'wrought') {
    return (
      <div className="relative h-full w-full">
        <Example />
        {/* Search ad */}
        <div className={`${card} left-0 top-[20%] w-[33%] -rotate-[5deg] p-[2.2cqw]`} style={{ borderColor: C.line }}>
          <span className="flex items-center gap-[1cqw] font-body" style={{ fontSize: '1.9cqw', color: C.muted }}><Logo k="googleAds" size={11} />Sponsored · yourbusiness.com</span>
          <p className="mt-[1cqw] font-body font-semibold leading-snug" style={{ fontSize: '2.6cqw', color: '#1A0DAB' }}>Same-day service near you. Book online today</p>
          <p className="mt-[0.8cqw] font-body leading-snug" style={{ fontSize: '2cqw', color: C.muted }}>Upfront pricing and a real person on the phone.</p>
        </div>
        {/* Follow-up email */}
        <div className={`${card} right-0 top-[24%] w-[33%] rotate-[5deg] p-[2.2cqw]`} style={{ borderColor: C.line }}>
          <span className="flex items-center gap-[1cqw] font-body" style={{ fontSize: '1.9cqw', color: C.muted }}><LineIcon name="mail" color={C.copper} size={11} />Sent automatically</span>
          <p className="mt-[1cqw] font-body font-semibold leading-snug" style={{ fontSize: '2.6cqw' }}>Thanks for reaching out, Sam</p>
          <p className="mt-[0.8cqw] font-body leading-snug" style={{ fontSize: '2cqw', color: C.muted }}>Here’s what happens next, and a link to pick a time.</p>
        </div>
        {/* Landing page on a phone */}
        <div className={`${card} left-1/2 top-[8%] z-[1] w-[29%] -translate-x-1/2 overflow-hidden`} style={{ borderColor: C.line }}>
          <div className="px-[2.4cqw] pb-[2.4cqw] pt-[3cqw]" style={{ background: C.card }}>
            <p className="font-display font-bold leading-tight" style={{ fontSize: '3cqw' }}>Get a free estimate</p>
            <p className="mt-[0.8cqw] font-body leading-snug" style={{ fontSize: '1.9cqw', color: C.muted }}>We’ll call you back within the hour.</p>
          </div>
          <div className="flex flex-col gap-[1cqw] p-[2.4cqw]">
            {['Name', 'Phone'].map(f => <span key={f} className="rounded-[1.2cqw] border px-[1.6cqw] py-[1cqw] font-body" style={{ fontSize: '1.9cqw', color: C.muted, borderColor: C.line }}>{f}</span>)}
            <span className="mt-[0.4cqw] rounded-full py-[1.2cqw] text-center font-body font-semibold text-white" style={{ fontSize: '2.1cqw', background: C.copper }}>Book my estimate</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="relative h-full w-full">
      <Example />
      {/* Desktop */}
      <div className={`${card} left-[3%] top-[12%] w-[72%] overflow-hidden`} style={{ borderColor: C.line }}>
        <div className="flex items-center justify-between border-b px-[2.4cqw] py-[1.4cqw]" style={{ borderColor: C.line }}>
          <span className="font-display font-bold" style={{ fontSize: '2.3cqw' }}>Oak &amp; Ember</span>
          <span className="flex gap-[2cqw] font-body" style={{ fontSize: '1.8cqw', color: C.muted }}><span>Menu</span><span>Visit</span><span>Order</span></span>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr] gap-[2cqw] p-[2.6cqw]">
          <div>
            <p className="font-display font-bold leading-[1.1]" style={{ fontSize: '3.6cqw' }}>Bread worth getting up early for.</p>
            <p className="mt-[1cqw] font-body leading-snug" style={{ fontSize: '1.9cqw', color: C.muted }}>Baked at dawn, every day.</p>
            <span className="mt-[1.6cqw] inline-block rounded-full px-[2.4cqw] py-[1cqw] font-body font-semibold text-white" style={{ fontSize: '2cqw', background: C.copper }}>Order for pickup</span>
          </div>
          <div className="relative overflow-hidden rounded-[2cqw]" style={{ background: '#F3E4D0' }}>
            <span className="absolute bottom-[12%] left-1/2 h-[46%] w-[70%] -translate-x-1/2 rounded-[50%]" style={{ background: C.dawn }} />
            <span className="absolute bottom-[34%] left-[34%] h-[6%] w-[12%] -rotate-[20deg] rounded-full bg-[#F3E4D0]" />
            <span className="absolute bottom-[34%] left-[52%] h-[6%] w-[12%] -rotate-[20deg] rounded-full bg-[#F3E4D0]" />
          </div>
        </div>
      </div>
      {/* Phone */}
      <div className={`${card} right-[3%] top-[22%] w-[24%] overflow-hidden`} style={{ borderColor: C.line }}>
        <div className="p-[2cqw]">
          <span className="font-display font-bold" style={{ fontSize: '2cqw' }}>Oak &amp; Ember</span>
          <p className="mt-[1.4cqw] font-display font-bold leading-[1.1]" style={{ fontSize: '2.8cqw' }}>Bread worth getting up early for.</p>
        </div>
        <div className="mx-[2cqw] h-[9cqw] rounded-[1.6cqw]" style={{ background: C.sageSoft }} />
        <div className="p-[2cqw]"><span className="block rounded-full py-[1cqw] text-center font-body font-semibold text-white" style={{ fontSize: '1.9cqw', background: C.copper }}>Order</span></div>
      </div>
    </div>
  )
}

/* ── The carousel ───────────────────────────────────────────── */

export default function ProductGallery({ slides, label }: { slides: Slide[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)

  const go = useCallback((i: number) => {
    const el = track.current
    if (!el) return
    const n = Math.max(0, Math.min(slides.length - 1, i))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: n * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }, [slides.length])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => setAt(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (!slides.length) return null

  return (
    <section className="group relative" aria-roledescription="carousel" aria-label={`${label}: what you get`}>
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1) } }}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dawn [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div key={i} className="aspect-[4/3] w-full shrink-0 snap-center snap-always" style={{ containerType: 'inline-size' }}
            role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i !== at}>
            <SlideView s={s} n={i + 1} total={slides.length} />
          </div>
        ))}
      </div>

      {slides.length > 1 && <>
        {(['prev', 'next'] as const).map(dir => {
          const disabled = dir === 'prev' ? at === 0 : at === slides.length - 1
          return (
            <button key={dir} type="button" onClick={() => go(at + (dir === 'prev' ? -1 : 1))} disabled={disabled}
              aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
              className={`absolute top-[37.5%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md transition disabled:opacity-0 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 ${dir === 'prev' ? 'left-3' : 'right-3'}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
            </button>
          )
        })}
        <div className="flex items-center justify-center gap-1.5 border-b border-black/[0.06] bg-white py-3">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === at}
              className="flex h-6 items-center justify-center px-0.5">
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === at ? 'w-6' : 'w-1.5 bg-ink/15'}`} style={i === at ? { background: C.copper } : undefined} />
            </button>
          ))}
        </div>
      </>}
    </section>
  )
}
