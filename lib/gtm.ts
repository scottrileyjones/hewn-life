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

export interface PurchaseItem {
  item_id?: string
  item_name?: string
  price?: number
  quantity?: number
}

export interface PurchasePayload {
  transaction_id: string
  value: number
  currency?: string
  items?: PurchaseItem[]
}

/**
 * Push a GA4 ecommerce event through the dataLayer. We clear the previous
 * `ecommerce` object first, per Google's recommendation, so values don't bleed
 * between events. Set up matching GA4 Event tags in GTM (with "Send Ecommerce
 * data" → Data Layer) to record each one.
 */
function trackEcommerce(event: string, ecommerce: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({ event, ecommerce })
}

/**
 * GA4 `begin_checkout` — fire when a visitor reaches the checkout page with a
 * selected plan.
 */
export function trackBeginCheckout(value: number, items: PurchaseItem[] = [], currency = 'USD') {
  trackEcommerce('begin_checkout', { value, currency, items })
}

/**
 * GA4 `add_payment_info` — fire when a visitor reaches the payment step.
 */
export function trackAddPaymentInfo(value: number, items: PurchaseItem[] = [], currency = 'USD') {
  trackEcommerce('add_payment_info', { value, currency, items })
}

/**
 * GA4 `purchase` conversion — fire on /thank-you after a successful payment.
 *
 * GA4 only writes the conversion when analytics consent is granted; under
 * Consent Mode it will still model conversions from the cookieless signal.
 */
export function trackPurchase(payload: PurchasePayload) {
  trackEcommerce('purchase', {
    transaction_id: payload.transaction_id,
    value: payload.value,
    currency: payload.currency ?? 'USD',
    items: payload.items ?? [],
  })
}
