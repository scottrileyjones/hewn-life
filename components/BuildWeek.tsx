'use client'
import { useEffect, useRef, useState } from 'react'

const days = [
  {
    day: 'Day 1',
    label: 'Mon',
    title: 'Kickoff & Structure',
    desc: 'One call to capture your goals, voice, and must-haves. AI scaffolds the sitemap and page structure the same afternoon — no Figma, no waiting.',
  },
  {
    day: 'Day 2',
    label: 'Tue',
    title: 'Design & Brand',
    desc: 'Colors, type, and layout shaped to your brand. We generate and refine the look live — responsive for mobile and desktop from the first pixel.',
  },
  {
    day: 'Day 3',
    label: 'Wed',
    title: 'Copy & Content',
    desc: 'Conversion-focused copy written and placed across every section. Images, icons, and assets sourced and dropped in.',
  },
  {
    day: 'Day 4',
    label: 'Thu',
    title: 'Build & Features',
    desc: 'Fully coded and responsive, plus a few custom features — contact forms, booking, galleries — wired up and working.',
  },
  {
    day: 'Day 5',
    label: 'Fri',
    title: 'Launch & Handoff',
    desc: 'Hosted, live, and yours. We hand over the keys — you take it from here with a site that already works.',
  },
]

export default function BuildWeek() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeDay, setActiveDay] = useState(-1)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const triggerLine = window.innerHeight * 0.6
      const scrolled = triggerLine - rect.top
      setProgress(Math.max(0, Math.min(1, scrolled / rect.height)))

      let active = -1
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top + r.height * 0.45 < triggerLine) active = i
      })
      setActiveDay(active)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">

      {/* ── Left: scroll-driven day list ── */}
      <div ref={containerRef} className="relative order-2 lg:order-1 pt-4">
        {/* spine */}
        <div className="absolute top-6 bottom-2 left-5 w-[2px]">
          <div className="absolute inset-0 bg-black/[0.08]" />
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] transition-[height] duration-300 ease-out"
            style={{ height: `${progress * 100}%`, boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
          />
        </div>

        <div className="flex flex-col gap-10">
          {days.map((d, i) => {
            const isActive = activeDay >= i
            return (
              <div
                key={i}
                ref={el => { stepRefs.current[i] = el }}
                className="relative pl-16"
              >
                {/* node */}
                <div className="absolute left-5 -translate-x-1/2 top-0 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]' : 'bg-white border-2 border-black/10'
                  }`}
                    style={isActive ? { boxShadow: '0 0 0 5px rgba(139,92,246,0.14), 0 0 20px rgba(139,92,246,0.4)' } : undefined}
                  >
                    <span className={`font-mono text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-black/30'}`}>{d.label}</span>
                  </div>
                </div>

                <div className={`transition-all duration-600 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'}`}>
                  <span className={`inline-block rounded-full px-3.5 py-1 font-body text-[11px] font-semibold tracking-wide mb-3 transition-all duration-500 ${
                    isActive ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)]' : 'bg-black/[0.06] text-black/40'
                  }`}>
                    {d.day}
                  </span>
                  <p className="font-display font-bold text-[24px] md:text-[28px] text-[#0D0D0D] leading-none mb-3">{d.title}</p>
                  <p className="font-body text-[15px] text-[#3D3A36] leading-relaxed max-w-md">{d.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Right: sticky browser mockup that builds ── */}
      <div className="order-1 lg:order-2 sticky top-20 self-start z-10">
        {/* Compact on mobile, full size on desktop */}
        <div className="lg:hidden">
          <BrowserMockup activeDay={activeDay} compact />
        </div>
        <div className="hidden lg:block">
          <BrowserMockup activeDay={activeDay} />
        </div>
        <div className="mt-3 lg:mt-5 flex items-center justify-center gap-2">
          {days.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-400 ${activeDay >= i ? 'w-6 lg:w-8 bg-[#8B5CF6]' : 'w-3 lg:w-4 bg-black/10'}`} />
          ))}
        </div>
        <p className="text-center font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-black/30 mt-2 lg:mt-3">
          {activeDay < 0 ? 'Ready to build' : activeDay >= days.length - 1 ? 'Live & yours' : `Building — ${days[activeDay].day}`}
        </p>
      </div>

    </div>
  )
}

function Block({ show, className, children }: { show: boolean; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${className ?? ''}`}>
      {children}
    </div>
  )
}

function BrowserMockup({ activeDay, compact = false }: { activeDay: number; compact?: boolean }) {
  // structure: day0, design: day1, content/copy: day2, features: day3, polish/live: day4
  const built = activeDay >= 4
  return (
    <div className={`rounded-2xl border border-black/[0.08] overflow-hidden bg-white ${compact ? 'shadow-[0_8px_24px_rgba(0,0,0,0.10)]' : 'shadow-[0_20px_60px_rgba(0,0,0,0.10)]'}`}>
      {/* browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.06] bg-[#FAF9F7]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
        </div>
        <div className="flex-1 mx-3">
          <div className={`h-5 rounded-md transition-colors duration-500 flex items-center px-3 ${activeDay >= 0 ? 'bg-white border border-black/[0.06]' : 'bg-black/[0.04]'}`}>
            {activeDay >= 4 && (
              <span className="font-mono text-[8px] text-[#6BAD3D] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D]" /> yoursite.com — live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* viewport */}
      <div className={`${compact ? 'aspect-[16/7]' : 'aspect-[4/3]'} p-4 overflow-hidden relative`}>
        {/* nav bar */}
        <Block show={activeDay >= 0} className="flex items-center justify-between mb-4">
          <div className={`h-3 w-16 rounded transition-colors duration-500 ${activeDay >= 1 ? 'bg-[#8B5CF6]' : 'bg-black/15'}`} />
          <div className="flex gap-2">
            {[0,1,2].map(k => <div key={k} className={`h-2 w-8 rounded transition-colors duration-500 ${activeDay >= 1 ? 'bg-black/20' : 'bg-black/10'}`} />)}
          </div>
        </Block>

        {/* hero */}
        <Block show={activeDay >= 0} className="mb-4">
          <div className={`rounded-lg p-4 transition-colors duration-500 ${activeDay >= 1 ? 'bg-gradient-to-br from-[#F3EEFF] to-[#FAF7FF]' : 'bg-black/[0.04]'}`}>
            <div className={`h-3.5 w-3/4 rounded mb-2 transition-all duration-500 ${activeDay >= 2 ? 'bg-[#0D0D0D]' : 'bg-black/15'}`} />
            <div className={`h-3.5 w-1/2 rounded mb-3 transition-all duration-500 ${activeDay >= 2 ? 'bg-[#8B5CF6]' : 'bg-black/10'}`} />
            <div className={`h-2 w-2/3 rounded mb-1 transition-all duration-500 ${activeDay >= 2 ? 'bg-black/30' : 'bg-black/8'}`} />
            <div className={`h-2 w-1/2 rounded mb-4 transition-all duration-500 ${activeDay >= 2 ? 'bg-black/30' : 'bg-black/8'}`} />
            {/* CTA button = day 3 feature */}
            <div className={`h-7 w-28 rounded-full transition-all duration-500 ${activeDay >= 3 ? 'bg-[#8B5CF6] shadow-[0_4px_14px_rgba(139,92,246,0.4)]' : 'bg-black/10'}`} />
          </div>
        </Block>

        {/* content cards */}
        <Block show={activeDay >= 0} className="grid grid-cols-3 gap-3 mb-4">
          {[0,1,2].map(k => (
            <div key={k} className={`rounded-lg p-2.5 transition-colors duration-500 ${activeDay >= 1 ? 'bg-white border border-black/[0.07] shadow-sm' : 'bg-black/[0.04]'}`}>
              <div className={`h-8 rounded mb-2 transition-colors duration-500 ${activeDay >= 2 ? (k === 1 ? 'bg-[#E9D5FF]' : 'bg-[#F3EEFF]') : 'bg-black/8'}`} />
              <div className={`h-1.5 w-full rounded mb-1 transition-colors duration-500 ${activeDay >= 2 ? 'bg-black/25' : 'bg-black/8'}`} />
              <div className={`h-1.5 w-2/3 rounded transition-colors duration-500 ${activeDay >= 2 ? 'bg-black/15' : 'bg-black/8'}`} />
            </div>
          ))}
        </Block>

        {/* feature row (form) — day 3 */}
        <Block show={activeDay >= 3} className="flex gap-2 mb-4">
          <div className="flex-1 h-7 rounded-md bg-black/[0.04] border border-black/[0.07]" />
          <div className="h-7 w-20 rounded-md bg-[#0D0D0D]" />
        </Block>

        {/* footer */}
        <Block show={activeDay >= 1} className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
          <div className={`h-2 w-12 rounded transition-colors duration-500 ${activeDay >= 2 ? 'bg-black/25' : 'bg-black/10'}`} />
          <div className="flex gap-1.5">
            {[0,1].map(k => <div key={k} className={`w-3 h-3 rounded-full transition-colors duration-500 ${activeDay >= 2 ? 'bg-[#8B5CF6]/40' : 'bg-black/10'}`} />)}
          </div>
        </Block>

        {/* wireframe overlay tag before design */}
        {activeDay >= 0 && activeDay < 1 && (
          <div className="absolute top-4 right-4 font-mono text-[8px] uppercase tracking-[0.18em] text-black/30 border border-black/10 rounded px-2 py-1">
            Wireframe
          </div>
        )}
        {/* launched stamp */}
        {built && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#6BAD3D] text-white font-mono text-[8px] uppercase tracking-[0.18em] rounded-full px-3 py-1.5 shadow-lg animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Launched
          </div>
        )}
      </div>
    </div>
  )
}
