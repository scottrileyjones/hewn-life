'use client'
import { useEffect, useRef, useState } from 'react'

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
    <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-12">

      {/* Source label */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px flex-1 bg-black/[0.10]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30">The Hewn Life Model — Task Allocation</span>
        <div className="h-px flex-1 bg-black/[0.10]" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-0 items-start">

        {/* ── Left: AI Engine ── */}
        <div className={`transition-all duration-700 ${triggered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#7CB550' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <p className="font-body font-semibold text-sm text-[#1A1815]">AI Engine</p>
              <p className="font-mono text-[10px] text-black/40 uppercase tracking-[0.15em]">Scale · Speed · Analysis</p>
            </div>
          </div>
          <div className="space-y-4">
            {aiTasks.map((t, i) => (
              <div key={t.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-body text-[13px] text-[#3D3A36]">{t.label}</span>
                  <span className="font-mono text-[11px] text-black/40">{t.pct}%</span>
                </div>
                <AnimatedBar pct={t.pct} color="#7CB550" delay={i * 80} triggered={triggered} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[#7CB550]/20 bg-[#7CB550]/[0.04] p-4">
            <p className="font-body text-[12px] text-[#4A5348] leading-relaxed">
              AI handles volume, velocity, and analysis — eliminating the overhead that inflates traditional agency fees.
            </p>
          </div>
        </div>

        {/* ── Center: connector ── */}
        <div className="hidden lg:flex flex-col items-center justify-start pt-10 gap-4">
          <div className="w-px flex-1 min-h-[320px] relative overflow-hidden bg-black/[0.06]">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#7CB550] via-[#4A5348] to-[#7CB550] transition-all duration-[1500ms] ease-out"
              style={{ height: triggered ? '100%' : '0%' }}
            />
          </div>
          <div className={`w-10 h-10 rounded-full border-2 border-[#4A5348] bg-white flex items-center justify-center transition-all duration-700 delay-500 ${triggered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="#4A5348" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="w-px flex-1 min-h-[320px] relative overflow-hidden bg-black/[0.06]">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#4A5348] via-[#7CB550] to-[#4A5348] transition-all duration-[1500ms] ease-out delay-300"
              style={{ height: triggered ? '100%' : '0%' }}
            />
          </div>
        </div>

        {/* ── Right: Human Team ── */}
        <div className={`transition-all duration-700 delay-200 ${triggered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4A5348' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="2.5" stroke="white" strokeWidth="1.5"/>
                <path d="M2.5 13.5c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-body font-semibold text-sm text-[#1A1815]">Human Team</p>
              <p className="font-mono text-[10px] text-black/40 uppercase tracking-[0.15em]">Strategy · Taste · Judgment</p>
            </div>
          </div>
          <div className="space-y-4">
            {humanTasks.map((t, i) => (
              <div key={t.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-body text-[13px] text-[#3D3A36]">{t.label}</span>
                  <span className="font-mono text-[11px] text-black/40">{t.pct}%</span>
                </div>
                <AnimatedBar pct={t.pct} color="#4A5348" delay={i * 80 + 200} triggered={triggered} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[#4A5348]/20 bg-[#4A5348]/[0.04] p-4">
            <p className="font-body text-[12px] text-[#4A5348] leading-relaxed">
              Senior strategists and specialist creatives own every decision that shapes perception, trust, and growth.
            </p>
          </div>
        </div>
      </div>

      {/* ── Output row ── */}
      <div className={`mt-12 transition-all duration-700 delay-700 ${triggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-black/[0.10]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30">What you get</span>
          <div className="h-px flex-1 bg-black/[0.10]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {outputs.map((o, i) => (
            <div
              key={o.label}
              className={`rounded-xl border border-black/[0.08] bg-white p-5 transition-all duration-500`}
              style={{ transitionDelay: `${800 + i * 100}ms`, opacity: triggered ? 1 : 0, transform: triggered ? 'translateY(0)' : 'translateY(12px)' }}
            >
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: i % 2 === 0 ? '#7CB550' : '#4A5348' }} />
              <p className="font-body font-semibold text-[13px] text-[#1A1815] mb-1">{o.label}</p>
              <p className="font-mono text-[11px] text-black/40 leading-snug">{o.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Source line */}
      <p className="font-mono text-[10px] text-black/25 mt-8 text-right">
        Hewn Life — Hybrid Delivery Model © {new Date().getFullYear()}
      </p>
    </div>
  )
}
