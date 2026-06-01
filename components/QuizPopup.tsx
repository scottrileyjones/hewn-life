'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity duration-400"
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
        <div className="bg-[#0D0D0D]/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          {/* Green accent bar */}
          <div className="h-1 bg-[#6BAD3D]" />

          <div className="p-8">
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Eyebrow */}
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6BAD3D] mb-4">
              Free · 2 Minutes
            </p>

            {/* Heading */}
            <h2 className="font-display font-bold text-[28px] text-white leading-tight mb-3">
              Not sure where<br />
              to <span className="italic" style={{ color: '#6BAD3D' }}>start?</span>
            </h2>

            <p className="font-body text-sm text-white/60 leading-relaxed mb-7">
              Take our 2-minute growth assessment. We&apos;ll show you exactly where your biggest opportunity is — and what it could be worth.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-7 pb-7 border-b border-white/[0.08]">
              {[
                { num: '2 min', label: 'to complete' },
                { num: '100%', label: 'free' },
                { num: 'instant', label: 'results' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-[15px] text-white leading-none mb-1">{s.num}</p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <Link
              href="/quiz"
              onClick={dismiss}
              className="flex items-center justify-center gap-2 w-full bg-[#8B5CF6] text-white font-body font-semibold text-sm px-6 py-4 rounded-full hover:bg-[#7C3AED] transition-colors mb-3"
            >
              Take the Free Assessment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <button
              onClick={dismiss}
              className="w-full font-body text-xs text-white/30 hover:text-white/50 transition-colors py-1"
            >
              No thanks, I&apos;ll figure it out myself
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}
