'use client'
import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    num: '01',
    period: 'Weeks 1–2',
    title: 'Discovery',
    place: 'Audit & Strategy',
    desc: 'Full audit — brand, digital, systems, competitive landscape. Nothing assumed, nothing guessed.',
    detail: 'AI-driven market and competitor analysis maps your entire landscape in days, not weeks. We surface the gaps, the opportunities, and the fastest path to traction before a single dollar is spent.',
    traditionalTime: '4–6 weeks',
    aiTime: '3 days',
  },
  {
    num: '02',
    period: 'Weeks 3–8',
    title: 'Foundation Sprint',
    place: 'Build & Launch',
    desc: 'Brand identity, website, and Google presence built and launched. Infrastructure before spend.',
    detail: 'Brand identity, a custom website, and your full digital presence — designed, built, and shipped. AI accelerates production while human taste makes sure it actually converts.',
    traditionalTime: '6–8 weeks',
    aiTime: '2 weeks',
  },
  {
    num: '03',
    period: 'Months 3–6',
    title: 'Growth Sprint',
    place: 'Scale Demand',
    desc: 'Paid media, funnels, automations, and retention systems layered onto the foundation.',
    detail: 'Paid media across Google and Meta, sales funnels, automated nurture sequences, and retention systems — all layered onto a foundation built to hold them.',
    traditionalTime: '3–6 months',
    aiTime: '6 weeks',
  },
  {
    num: '04',
    period: 'Month 6+',
    title: 'Scale',
    place: 'Compound & Optimize',
    desc: 'Ongoing advisory, quarterly planning, and continuous optimization. The system compounds.',
    detail: 'A fractional CMO advisory layer, quarterly growth planning, and AI models optimizing your campaigns around the clock. The system gets smarter — and your lead stretches.',
    traditionalTime: 'manual check-ins',
    aiTime: '24/7 AI-optimized',
    ongoing: true,
  },
]

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeStep, setActiveStep] = useState(-1)
  const [progress, setProgress] = useState(0) // 0–1 fill of the spine

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const triggerLine = window.innerHeight * 0.55

      // Spine fill progress
      const total = rect.height
      const scrolled = triggerLine - rect.top
      setProgress(Math.max(0, Math.min(1, scrolled / total)))

      // Active step = furthest step whose center has passed the trigger line
      let active = -1
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top + r.height * 0.4 < triggerLine) active = i
      })
      setActiveStep(active)
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
    <div ref={containerRef} className="relative max-w-5xl mx-auto">

      {/* ── Center spine (desktop) / left spine (mobile) ── */}
      <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-[2px]">
        <div className="absolute inset-0 bg-black/[0.08]" />
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] transition-[height] duration-300 ease-out"
          style={{ height: `${progress * 100}%`, boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
        />
      </div>

      <div className="flex flex-col gap-16 md:gap-28 py-4">
        {steps.map((step, i) => {
          const isActive = activeStep >= i
          // Content (title + card) alternates side; date pill sits opposite, near the spine
          const contentRight = i % 2 === 0
          return (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el }}
              className="relative md:grid md:grid-cols-2 md:items-center md:gap-16"
            >
              {/* ── Node on the spine ── */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-1 md:top-1/2 md:-translate-y-1/2 z-10">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] border-0'
                    : 'bg-white border-2 border-black/10'
                }`}
                  style={isActive ? { boxShadow: '0 0 0 6px rgba(139,92,246,0.14), 0 0 24px rgba(139,92,246,0.45)' } : undefined}
                >
                  <span className={`font-mono text-[12px] font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-black/30'}`}>
                    {step.num}
                  </span>
                  {step.ongoing && isActive && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#8B5CF6] animate-ping opacity-40" />
                  )}
                </div>
              </div>

              {/* ── Date pill (opposite the content, near the spine) ── */}
              <div className={`pl-20 md:pl-0 ${
                contentRight ? 'md:order-1 md:text-right md:pr-6' : 'md:order-2 md:col-start-2 md:pl-6'
              }`}>
                <StepPill step={step} isActive={isActive} align={contentRight ? 'right' : 'left'} />
              </div>

              {/* ── Content: title + card ── */}
              <div className={`pl-20 md:pl-0 mt-4 md:mt-0 ${
                contentRight ? 'md:order-2 md:col-start-2 md:pl-6' : 'md:order-1 md:text-right md:pr-6'
              }`}>
                <StepContent step={step} isActive={isActive} align={contentRight ? 'left' : 'right'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepPill({ step, isActive, align }: { step: typeof steps[number]; isActive: boolean; align: 'left' | 'right' }) {
  return (
    <div className={`transition-all duration-700 ${
      isActive ? 'opacity-100 translate-y-0' : `opacity-0 ${align === 'right' ? 'md:translate-x-4' : 'md:-translate-x-4'} translate-y-2`
    }`}>
      <span className={`inline-block rounded-full px-5 py-2 font-body text-sm font-semibold tracking-wide transition-all duration-500 ${
        isActive ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white shadow-[0_4px_18px_rgba(139,92,246,0.4)]' : 'bg-black/[0.06] text-black/40'
      }`}>
        {step.period}
      </span>
    </div>
  )
}

function StepContent({ step, isActive, align }: { step: typeof steps[number]; isActive: boolean; align: 'left' | 'right' }) {
  return (
    <div className={`transition-all duration-700 delay-100 ${
      isActive ? 'opacity-100 translate-x-0' : `opacity-0 ${align === 'right' ? 'md:translate-x-6' : 'md:-translate-x-6'}`
    }`}>
      {/* Title block */}
      <div className={align === 'right' ? 'md:text-right' : ''}>
        <p className="font-display font-bold text-[28px] md:text-[34px] text-[#0D0D0D] leading-none">{step.title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mt-2 mb-5">{step.place}</p>
      </div>

      {/* Card */}
      <div className={`bg-white rounded-2xl border border-black/[0.06] p-7 transition-shadow duration-500 ${
        isActive ? 'shadow-[0_12px_40px_rgba(139,92,246,0.12)]' : 'shadow-sm'
      } ${align === 'right' ? 'md:text-right' : ''}`}>
        <p className="font-body text-[15px] text-[#3D3A36] leading-relaxed mb-3">{step.desc}</p>
        <p className="font-body text-sm text-[#6B6560] leading-relaxed mb-5">{step.detail}</p>
        <div className={`flex items-center gap-3 pt-4 border-t border-black/[0.06] ${align === 'right' ? 'md:justify-end' : ''}`}>
          <span className="font-mono text-[11px] text-black/30 line-through">{step.traditionalTime}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono text-[11px] font-semibold text-[#7C3AED] uppercase tracking-[0.12em]">{step.aiTime}</span>
        </div>
      </div>
    </div>
  )
}
