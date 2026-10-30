'use client'
import { useEffect, useState } from 'react'
import Terrain from '@/components/strata/Terrain'
import { Glyph, Mark } from '@/components/strata/Glyph'
import { colors, type GlyphKey } from '@/lib/strata'

/**
 * The launch Story: 1080×1920, 15 seconds, drawn as a pure function of time so
 * it can be exported frame by frame (window.__setStoryTime(seconds)). On the
 * page it plays on a loop. Text stays clear of Instagram's top and bottom UI.
 */

export const STORY_SECONDS = 15

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3)
/** 0→1 between a and b. */
const p = (t: number, a: number, b: number) => ease((t - a) / (b - a))
/** Fade/slide in at `a`, out at `z`. */
function show(t: number, a: number, z: number, d = 0.45) {
  const inn = p(t, a, a + d), out = 1 - p(t, z - 0.35, z)
  return { opacity: Math.min(inn, out), transform: `translateY(${(1 - inn) * 40}px)` }
}

const chips: [GlyphKey, string][] = [['media', 'Paid ads'], ['creative', 'AI creative'], ['seo', 'SEO + AI search'], ['lifecycle', 'Email + CRM'], ['creators', 'Creators + UGC'], ['data', 'Live dashboard']]
const steps = [['01', 'Tell us about your business', '5 minutes'], ['02', 'We design, write and build', 'Not a template'], ['03', 'You’re live', 'Within 24 hours']]

function money(v: number) {
  if (v < 1) return `$${Math.round(v * 1000)}K`
  return `$${v.toFixed(v < 10 ? 1 : 0)}M`
}

export function StoryFrame({ t }: { t: number }) {
  const hours = Math.round(24 * p(t, 5.2, 8.0))
  const rev = 10 * p(t, 11.7, 13.2)
  return (
    <div id="ig-story" className="relative isolate overflow-hidden text-mist" style={{ width: 1080, height: 1920, background: '#0E0A06' }}>
      {/* Background: slow push-in on the amber terrain, then forest for the growth beat. */}
      <div className="absolute inset-0 -z-20" style={{ transform: `scale(${1.08 - 0.08 * clamp(t / STORY_SECONDS)})`, transformOrigin: '50% 40%' }}>
        <Terrain scene="amber" seed={7} />
      </div>
      <div className="absolute inset-0 -z-20" style={{ opacity: p(t, 8.2, 8.9) * (1 - p(t, 13.4, 14.0)) }}>
        <Terrain scene="topo" seed={11} />
      </div>
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(14,10,6,.55), rgba(14,10,6,.15) 40%, rgba(14,10,6,.8))' }} />
      <div className="absolute inset-0 -z-10 bg-black" style={{ opacity: 1 - p(t, 0, 0.6) }} />

      {/* Lockup, always on top */}
      <div className="absolute left-[80px] top-[260px] flex items-center gap-4" style={{ opacity: p(t, 0.3, 0.9) }}>
        <Mark fg="#F4F2EC" accent={colors.lime} size={52} />
        <span className="font-display text-[46px] font-semibold leading-none tracking-[0.02em]">hewn<span className="accent" style={{ color: colors.lichen }}>life</span></span>
      </div>

      {/* Beat 1 (0–5s): the hook */}
      <div className="absolute inset-x-[80px] top-[520px]">
        <p className="font-display text-[132px] font-medium leading-[0.98] tracking-[-0.05em]" style={show(t, 0.5, 5)}>Your website.</p>
        <p className="font-display text-[132px] font-medium leading-[0.98] tracking-[-0.05em]" style={show(t, 1.2, 5)}>Live in <span className="accent" style={{ color: colors.lime }}>24 hours.</span></p>
        <p className="mt-16 font-display text-[260px] font-semibold leading-none tracking-[-0.05em] text-lime" style={{ ...show(t, 2.4, 5), transform: `scale(${0.8 + 0.2 * p(t, 2.4, 3.0)})`, transformOrigin: '0 50%' }}>$999</p>
        <p className="mt-4 font-body text-[40px] text-mist/80" style={show(t, 3.0, 5)}>One flat fee. No calls. No surprises.</p>
      </div>

      {/* Beat 2 (5–8.5s): how it works, with a 24-hour clock */}
      <div className="absolute inset-x-[80px] top-[480px]">
        <div className="flex items-baseline gap-5" style={show(t, 5.0, 8.6)}>
          <span className="font-display text-[170px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-lime">{String(hours).padStart(2, '0')}:00</span>
          <span className="font-mono text-[30px] uppercase tracking-[0.2em] text-mist/70">hours</span>
        </div>
        <div className="mt-6 h-3 w-full rounded-full bg-white/15" style={show(t, 5.0, 8.6)}>
          <div className="h-3 rounded-full bg-lime" style={{ width: `${(hours / 24) * 100}%` }} />
        </div>
        <div className="mt-14 flex flex-col gap-6">
          {steps.map(([n, title, sub], i) => (
            <div key={n} className={`flex items-center gap-8 rounded-[36px] p-9 ${i === 2 ? 'bg-lime text-forest' : 'border border-white/20 bg-black/30 backdrop-blur-md'}`} style={show(t, 5.5 + i * 0.7, 8.6)}>
              <span className={`font-display text-[64px] font-semibold leading-none ${i === 2 ? 'text-forest' : 'text-dawn'}`}>{n}</span>
              <div>
                <p className="font-display text-[46px] font-medium leading-tight tracking-[-0.02em]">{title}</p>
                <p className={`mt-1 font-body text-[32px] ${i === 2 ? 'text-forest/75' : 'text-mist/70'}`}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beat 3 (8.5–11.5s): then we grow it */}
      <div className="absolute inset-x-[80px] top-[500px]">
        <p className="font-display text-[132px] font-medium leading-[0.98] tracking-[-0.05em]" style={show(t, 8.6, 11.6)}>Then we <span className="accent" style={{ color: colors.lime }}>grow it.</span></p>
        <div className="mt-14 grid grid-cols-2 gap-4">
          {chips.map(([g, label], i) => (
            <div key={label} className="flex items-center gap-5 rounded-[30px] border border-white/15 bg-black/30 px-7 py-8 backdrop-blur-md" style={show(t, 9.1 + i * 0.22, 11.6, 0.35)}>
              <Glyph name={g} fg="#F4F2EC" accent={colors.lime} size={50} />
              <span className="font-display text-[38px] font-medium">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-12 font-body text-[38px] text-mist/80" style={show(t, 10.4, 11.6)}>One team. One flat monthly fee.</p>
      </div>

      {/* Beat 4 (11.5–13.6s): proof */}
      <div className="absolute inset-x-[80px] top-[560px]">
        <p className="font-mono text-[30px] uppercase tracking-[0.22em] text-lime" style={show(t, 11.6, 13.7)}>Not our first climb</p>
        <p className="mt-8 font-display text-[78px] font-medium leading-[1.04] tracking-[-0.04em]" style={show(t, 11.7, 13.7)}>Our team took a telehealth brand from</p>
        <p className="mt-8 font-display text-[230px] font-semibold leading-none tracking-[-0.05em] tabular-nums text-lime" style={show(t, 11.8, 13.7)}>{rev < 0.05 ? '$0' : money(rev)}</p>
        <p className="mt-4 font-display text-[64px] font-medium tracking-[-0.03em]" style={show(t, 12.2, 13.7)}>a year.</p>
        <p className="mt-10 font-body text-[26px] text-mist/55" style={show(t, 12.4, 13.7)}>Work our team did before Hewn Life. Not typical.</p>
      </div>

      {/* Beat 5 (13.6–15s): call to action */}
      <div className="absolute inset-x-[80px] top-[640px]">
        <p className="font-display text-[118px] font-medium leading-[0.98] tracking-[-0.05em]" style={show(t, 13.7, 99)}>Start with<br />a website.</p>
        <div className="mt-14 inline-flex items-center gap-6 rounded-full bg-lime px-12 py-9" style={{ ...show(t, 14.0, 99), transform: `scale(${1 + 0.04 * Math.sin(Math.max(0, t - 14.2) * 8)})`, transformOrigin: '0 50%' }}>
          <span className="font-display text-[52px] font-medium text-forest">Start your brief →</span>
        </div>
        <p className="mt-10 font-body text-[40px] text-mist/80" style={show(t, 14.2, 99)}>Link in bio · <b className="font-medium text-mist">hewn.life</b></p>
      </div>
    </div>
  )
}

/** Plays the Story on a loop; the exporter takes over the clock with window.__setStoryTime. */
export default function LaunchStory() {
  const [t, setT] = useState(0)
  const [manual, setManual] = useState(false)
  useEffect(() => {
    const w = window as unknown as { __setStoryTime?: (s: number) => void }
    w.__setStoryTime = (s: number) => { setManual(true); setT(s) }
    if (manual) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => { setT(((now - start) / 1000) % STORY_SECONDS); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [manual])
  return <StoryFrame t={t} />
}
