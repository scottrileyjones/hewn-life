// Google Tag Manager + Google Consent Mode v2 helpers.
//
// GTM is loaded by <GoogleTagManager /> (see components/GoogleTagManager.tsx),
// which also installs Consent Mode defaults (everything denied until the
// visitor accepts via the cookie banner). These helpers let the rest of the
// app update consent and push custom events into the dataLayer.

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

// Shared with components/CookieConsent.tsx so the banner and analytics agree
// on where the visitor's choice is stored.
export const CONSENT_STORAGE_KEY = 'hewn-cookie-consent'

export type ConsentChoice = 'accepted' | 'declined'

// Categories we toggle based on the visitor's banner choice. Strictly
// necessary categories (functionality_storage, security_storage) stay granted
// and are set in the default in GoogleTagManager.tsx.
const CONSENT_GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const

const CONSENT_DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const

declare global {
  interface Window {
    dataLayer?: unknown[]
    // Defined by the inline Consent Mode script in GoogleTagManager.tsx.
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Tell Consent Mode whether the visitor has granted or denied tracking.
 * Call this whenever the cookie banner choice changes.
 */
export function updateConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', choice === 'accepted' ? CONSENT_GRANTED : CONSENT_DENIED)
}

/**
 * Push a custom event into the GTM dataLayer, e.g.
 *   sendGTMEvent('begin_checkout', { plan: 'hewn_monthly' })
 */
export function sendGTMEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...data })
}
