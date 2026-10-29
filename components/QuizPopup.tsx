'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Terrain from '@/components/strata/Terrain'

const STORAGE_KEY = 'hewn_quiz_popup_dismissed'
const DELAY_MS = 4000

export default function QuizPopup() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Don't show on quiz or checkout pages
    if (pathname.startsWith('/quiz') || pathname.startsWith('/checkout')) return
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => {
      setMounted(true)
      requestAnimationFrame(() => setVisible(true))
    }, DELAY_MS)

    return () => clearTimeout(timer)
  }, [pathname])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
    setTimeout(() => setMounted(false), 400)
  }

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-[2px] transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Panel — centered, never touching screen edges */}
      <div
        className="fixed z-[91] inset-0 flex items-center justify-center p-5 pointer-events-none"
      >
        <div
          className="w-full max-w-[400px] pointer-events-auto transition-all duration-400"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          }}
        >
        <div className="relative overflow-hidden rounded-[28px] bg-paper text-ink shadow-[0_32px_80px_-16px_rgba(20,16,10,0.45)]">
          {/* Terrain header */}
          <div className="relative isolate h-36 overflow-hidden">
            <Terrain scene="survey" seed={57} className="-z-20" />
            <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(20,16,10,.1), rgba(20,16,10,.55))' }} />
            <span className="absolute bottom-4 left-6 inline-flex items-center gap-2 rounded-full bg-mist/15 px-3 py-1.5 font-body text-[13px] font-medium text-mist backdrop-blur">
              <span className="h-3 w-[3px] bg-lime" />Free · 2 minutes
            </span>
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-mist/15 text-mist backdrop-blur transition-colors hover:bg-mist/30"
              aria-label="Close"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-7 sm:p-8">
            <h2 className="font-display text-[30px] font-medium leading-[1.05] tracking-[-0.03em]">
              Not sure where to <em className="accent text-forest">start?</em>
            </h2>
            <p className="mt-3 font-body text-[15px] leading-relaxed text-ink/70">
              Take the 2-minute growth assessment. We&apos;ll show you where your biggest opportunity is, and what it could be worth.
            </p>

            <div className="mt-6 grid grid-cols-3 border-y border-ink/[0.08]">
              {[
                { num: '2 min', label: 'to complete' },
                { num: 'Free', label: 'no sales call' },
                { num: 'Instant', label: 'results' },
              ].map((st, i) => (
                <div key={st.label} className={`py-4 ${i ? 'border-l border-ink/[0.08] pl-4' : ''}`}>
                  <p className="font-display text-[17px] font-medium leading-none">{st.num}</p>
                  <p className="mt-1.5 font-body text-[12px] text-ink/60">{st.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/quiz"
              onClick={dismiss}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-body text-[15px] font-medium text-mist transition-colors hover:bg-forest-2"
            >
              Take the free assessment →
            </Link>
            <button onClick={dismiss} className="mt-3 w-full py-1 font-body text-[14px] text-ink/60 transition-colors hover:text-ink">
              No thanks
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}
