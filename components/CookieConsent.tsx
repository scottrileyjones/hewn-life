'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'hewn-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show only if no prior choice has been recorded
    try {
      const choice = localStorage.getItem(STORAGE_KEY)
      if (!choice) {
        // brief delay so it eases in after the page settles
        const t = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(t)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const respond = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* ignore storage failures */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl mx-auto bg-[#0D0D0D] text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/[0.08] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 animate-fade-up">
        <p className="font-body text-sm text-white/70 leading-relaxed flex-1">
          We use cookies to run this site, analyze traffic, and improve your experience. See our{' '}
          <Link href="/legal/cookies" className="text-[#A78BFA] hover:text-white transition-colors underline underline-offset-2">Cookie Policy</Link>{' '}
          for details.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => respond('declined')}
            className="font-body text-sm font-medium text-white/60 hover:text-white px-4 py-2.5 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => respond('accepted')}
            className="font-body text-sm font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-full transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
