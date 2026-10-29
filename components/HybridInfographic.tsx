'use client'
import { useEffect, useRef, useState } from 'react'
import { Glyph, Mark } from './strata/Glyph'

const aiTasks = [
  { label: 'Market & Competitor Research', pct: 95 },
  { label: 'Content Production at Scale', pct: 90 },
  { label: 'Campaign Performance Analysis', pct: 88 },
  { label: 'SEO & Keyword Intelligence', pct: 92 },
  { label: 'Ad Copy Variations & Testing', pct: 85 },
  { label: 'Reporting & Data Synthesis', pct: 96 },
]

const humanTasks = [
  { label: 'Brand Strategy & Positioning', pct: 100 },
  { label: 'Creative Direction & Taste', pct: 100 },
  { label: 'Client Relationship & Advisory', pct: 100 },
  { label: 'Narrative & Emotional Resonance', pct: 95 },
  { label: 'Campaign Architecture', pct: 90 },
  { label: 'Execution Review & Sign-off', pct: 100 },
]

const outputs = [
  { label: 'Faster delivery', sub: '4–6× speed vs traditional agencies' },
  { label: 'Deeper research', sub: 'Days of analysis compressed to hours' },
  { label: 'Human quality', sub: 'Every output reviewed by a strategist' },
  { label: 'Lower overhead', sub: 'No layers, no bloat — flat fees' },
]

function AnimatedBar({ pct, color, delay, triggered }: { pct: number; color: string; delay: number; triggered: boolean }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const t = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(t)
  }, [triggered, pct, delay])
  return (
    <div className="h-1.5 w-full bg-black/[0.06] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  )
}

export default function HybridInfographic() {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="max-w-6xl mx-auto overflow-x-clip px-5 lg:px-12">

      {/* Source label */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px flex-1 bg-black/[0.10]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">The Hewn Life Model — Task Allocation</span>
        <div className="h-px flex-1 bg-black/[0.10]" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-0 items-start">

        {/* ── Left: AI Engine ── */}
        <div className={`transition-all duration-700 ${triggered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-forest"><Glyph name="creative" fg="#F4F2EC" accent="#D6F28B" size={22} /></div>
            <div>
              <p className="font-body font-semibold text-sm text-[#0D0D0D]">AI Engine</p>
              <p className="font-mono text-[10px] text-ink/55 uppercase tracking-[0.15em]">Scale · Speed · Analysis</p>
            </div>
          </div>
          <div className="space-y-4">
            {aiTasks.map((t, i) => (
              <div key={t.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-body text-[13px] text-[#2B2F2C]">{t.label}</span>
                  <span className="font-mono text-[11px] text-ink/55">{t.pct}%</span>
                </div>
                <AnimatedBar pct={t.pct} color="#6BAD3D" delay={i * 80} triggered={triggered} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[18px] border border-[#6BAD3D]/20 bg-[#6BAD3D]/[0.04] p-4">
            <p className="font-body text-[12px] text-[#1E3826] leading-relaxed">
              AI handles volume, velocity, and analysis — eliminating the overhead that inflates traditional agency fees.
            </p>
          </div>
        </div>

        {/* ── Center: connector ── */}
        <div className="hidden lg:flex flex-col items-center justify-start pt-10 gap-4">
          <div className="w-px flex-1 min-h-[320px] relative overflow-hidden bg-black/[0.06]">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#6BAD3D] via-[#1E3826] to-[#6BAD3D] transition-all duration-[1500ms] ease-out"
              style={{ height: triggered ? '100%' : '0%' }}
            />
          </div>
          <div className={`w-10 h-10 rounded-full border-2 border-[#1E3826] bg-white flex items-center justify-center transition-all duration-700 delay-500 ${triggered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Mark fg="#1E3826" accent="#6BAD3D" size={16} />
          </div>
          <div className="w-px flex-1 min-h-[320px] relative overflow-hidden bg-black/[0.06]">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#1E3826] via-[#6BAD3D] to-[#1E3826] transition-all duration-[1500ms] ease-out delay-300"
              style={{ height: triggered ? '100%' : '0%' }}
            />
          </div>
        </div>

        {/* ── Right: Human Team ── */}
        <div className={`transition-all duration-700 delay-200 ${triggered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-forest"><Glyph name="strategy" fg="#F4F2EC" accent="#6BAD3D" size={22} /></div>
            <div>
              <p className="font-body font-semibold text-sm text-[#0D0D0D]">Human Team</p>
              <p className="font-mono text-[10px] text-ink/55 uppercase tracking-[0.15em]">Strategy · Taste · Judgment</p>
            </div>
          </div>
          <div className="space-y-4">
            {humanTasks.map((t, i) => (
              <div key={t.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-body text-[13px] text-[#2B2F2C]">{t.label}</span>
                  <span className="font-mono text-[11px] text-ink/55">{t.pct}%</span>
                </div>
                <AnimatedBar pct={t.pct} color="#1E3826" delay={i * 80 + 200} triggered={triggered} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[18px] border border-[#1E3826]/20 bg-[#1E3826]/[0.04] p-4">
            <p className="font-body text-[12px] text-[#1E3826] leading-relaxed">
              Senior strategists and specialist creatives own every decision that shapes perception, trust, and growth.
            </p>
          </div>
        </div>
      </div>

      {/* ── Output row ── */}
      <div className={`mt-12 transition-all duration-700 delay-700 ${triggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-black/[0.10]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">What you get</span>
          <div className="h-px flex-1 bg-black/[0.10]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {outputs.map((o, i) => (
            <div
              key={o.label}
              className={`rounded-[18px] border border-black/[0.08] bg-white p-5 transition-all duration-500`}
              style={{ transitionDelay: `${800 + i * 100}ms`, opacity: triggered ? 1 : 0, transform: triggered ? 'translateY(0)' : 'translateY(12px)' }}
            >
              <div className="w-[3px] h-4 mb-3" style={{ background: i % 2 === 0 ? '#6BAD3D' : '#1E3826' }} />
              <p className="font-body font-semibold text-[13px] text-[#0D0D0D] mb-1">{o.label}</p>
              <p className="font-mono text-[11px] text-ink/55 leading-snug">{o.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Source line */}
      <p className="font-mono text-[10px] text-ink/50 mt-8 text-right">
        Hewn Life — Hybrid Delivery Model © {new Date().getFullYear()}
      </p>
    </div>
  )
}
