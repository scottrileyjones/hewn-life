'use client'
import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    num: '01',
    period: 'WKS 1–2',
    traditionalTime: '4–6 wks',
    aiTime: '3 days',
    title: 'Discovery',
    desc: 'Full audit — brand, digital, systems, competitive landscape. Nothing assumed, nothing guessed.',
  },
  {
    num: '02',
    period: 'WKS 3–8',
    traditionalTime: '6–8 wks',
    aiTime: '2 wks',
    title: 'Foundation Sprint',
    desc: 'Brand identity, website, Google presence built and launched. Infrastructure before spend.',
  },
  {
    num: '03',
    period: 'MOS 3–6',
    traditionalTime: '3–6 mos',
    aiTime: '6 wks',
    title: 'Growth Sprint',
    desc: 'Paid media, funnels, automations, and retention systems layered onto the foundation.',
  },
  {
    num: '04',
    period: 'MO 6+',
    traditionalTime: 'manual check-ins',
    aiTime: '24/7 AI-optimized',
    title: 'Scale',
    desc: 'Ongoing advisory, quarterly planning, continuous optimization. The system compounds.',
    ongoing: true,
  },
]

export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(-1)
  const [showAi, setShowAi] = useState<boolean[]>(new Array(steps.length).fill(false))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => {
              setActiveStep(i)
              setTimeout(() => {
                setShowAi(prev => {
                  const next = [...prev]
                  next[i] = true
                  return next
                })
              }, 450)
            }, i * 850)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>

      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div className="relative flex items-start">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">

              {/* Period label */}
              <div className="mb-5 h-8 flex items-end">
                <p className={`font-mono text-[9px] uppercase tracking-[0.22em] transition-all duration-500 ${activeStep >= i ? 'text-[#0D0D0D]/40' : 'text-[#0D0D0D]/10'}`}>
                  {step.period}
                </p>
              </div>

              {/* Connector + Circle row */}
              <div className="flex items-center w-full">
                {/* Left connector */}
                <div className="flex-1 h-[1px] relative overflow-hidden">
                  {i === 0
                    ? null
                    : <>
                        <div className="absolute inset-0 bg-black/8" />
                        <div
                          className="absolute inset-0 bg-[#6BAD3D] transition-all duration-700 ease-out"
                          style={{ width: activeStep >= i ? '100%' : '0%' }}
                        />
                      </>
                  }
                </div>

                {/* Circle */}
                <div className={`w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-500 relative ${
                  activeStep >= i
                    ? 'border-[#6BAD3D] bg-[#6BAD3D] shadow-[0_0_0_4px_rgba(107,173,61,0.12)]'
                    : 'border-black/15 bg-white'
                }`}>
                  <span className={`font-mono text-[11px] font-semibold transition-colors duration-300 ${activeStep >= i ? 'text-white' : 'text-black/25'}`}>
                    {step.num}
                  </span>
                  {step.ongoing && activeStep >= i && (
                    <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#6BAD3D] animate-ping opacity-60" />
                  )}
                </div>

                {/* Right connector */}
                <div className="flex-1 h-[1px] relative overflow-hidden">
                  {i < steps.length - 1
                    ? <>
                        <div className="absolute inset-0 bg-black/8" />
                        <div
                          className="absolute inset-0 bg-[#6BAD3D] transition-all duration-700 ease-out"
                          style={{ width: activeStep >= i + 1 ? '100%' : '0%' }}
                        />
                      </>
                    : null
                  }
                </div>
              </div>

              {/* Step info */}
              <div className={`mt-7 text-center px-5 transition-all duration-600 ${activeStep >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                <p className="font-display font-semibold text-[17px] text-[#0D0D0D] mb-2 leading-snug">{step.title}</p>
                <p className="font-body text-[13px] text-[#6B6560] leading-relaxed mb-5">{step.desc}</p>

                {/* Speed callout — WSJ annotation style */}
                <div className="border-t border-black/[0.07] pt-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/20 mb-1">Typical timeline</p>
                  <p className={`font-mono text-[10px] text-black/25 line-through decoration-black/20 mb-2 transition-opacity duration-400 ${showAi[i] ? 'opacity-100' : 'opacity-0'}`}>
                    {step.traditionalTime}
                  </p>
                  <div className={`flex items-center justify-center gap-1.5 transition-all duration-500 delay-100 ${showAi[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M2 6l3 3 3-3" stroke="#6BAD3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6BAD3D] font-medium">
                      {step.aiTime}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: vertical ── */}
      <div className="md:hidden">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-5">
            {/* Left: circle + vertical line */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
                activeStep >= i ? 'border-[#6BAD3D] bg-[#6BAD3D]' : 'border-black/15 bg-white'
              }`}>
                <span className={`font-mono text-[10px] font-semibold ${activeStep >= i ? 'text-white' : 'text-black/25'}`}>
                  {step.num}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-[1px] flex-1 my-1 relative overflow-hidden" style={{ minHeight: 64 }}>
                  <div className="absolute inset-0 bg-black/8" />
                  <div className="absolute inset-0 bg-[#6BAD3D] transition-all duration-700" style={{ height: activeStep >= i + 1 ? '100%' : '0%' }} />
                </div>
              )}
            </div>

            {/* Right: content */}
            <div className={`pb-10 flex-1 transition-all duration-500 ${activeStep >= i ? 'opacity-100' : 'opacity-30'}`}>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#0D0D0D]/35 mb-1 mt-2">{step.period}</p>
              <p className="font-display font-semibold text-[20px] text-[#0D0D0D] mb-2 leading-snug">{step.title}</p>
              <p className="font-body text-sm text-[#6B6560] leading-relaxed mb-3">{step.desc}</p>
              <div className={`flex items-center gap-3 transition-opacity duration-500 ${showAi[i] ? 'opacity-100' : 'opacity-0'}`}>
                <span className="font-mono text-[9px] text-black/25 line-through">{step.traditionalTime}</span>
                <span className="font-mono text-[9px] text-[#6BAD3D] uppercase tracking-[0.14em]">↓ {step.aiTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
