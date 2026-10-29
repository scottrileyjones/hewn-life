'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CONSENT_STORAGE_KEY as STORAGE_KEY, COOKIE_SETTINGS_EVENT, updateConsent } from '@/lib/gtm'
import { Mark } from '@/components/strata/Glyph'
import { colors } from '@/lib/strata'

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

  useEffect(() => {
    const open = () => setVisible(true)
    window.addEventListener(COOKIE_SETTINGS_EVENT, open)
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open)
  }, [])

  const respond = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* ignore storage failures */
    }
    // Tell Google Consent Mode about the visitor's choice.
    updateConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-4 sm:inset-x-auto sm:left-0 sm:p-6"
    >
      <div className="pointer-events-auto animate-fade-up rounded-[22px] border border-ink/[0.1] bg-paper p-5 text-ink shadow-[0_18px_50px_-12px_rgba(20,16,10,0.28)] sm:max-w-[400px]">
        <div className="flex items-center gap-2.5">
          <Mark fg={colors.forest} accent={colors.lichen} size={18} />
          <p className="font-display text-[17px] font-medium tracking-[-0.02em]">A few cookies, if that&apos;s okay</p>
        </div>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-ink/70">
          We use them to run the site and see what&apos;s working. Details in our{' '}
          <Link href="/legal/cookies" className="text-forest underline underline-offset-2 hover:text-ink">cookie policy</Link>.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => respond('declined')}
            className="flex-1 rounded-full border border-ink/15 px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:border-ink/40"
          >
            Decline
          </button>
          <button
            onClick={() => respond('accepted')}
            className="flex-1 rounded-full bg-forest px-5 py-2.5 font-body text-sm font-medium text-mist transition-colors hover:bg-forest-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

/** Footer link that reopens the cookie banner so visitors can change their choice. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))} className={className}>
      Cookie settings
    </button>
  )
}
