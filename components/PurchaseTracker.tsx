'use client'
import { useEffect } from 'react'
import { trackPurchase } from '@/lib/gtm'

/**
 * Fires the GA4 `purchase` conversion once the visitor lands on /thank-you
 * after a successful Stripe payment. Renders nothing.
 *
 * Stripe appends `payment_intent` and `redirect_status` to the return URL; the
 * order value/name are passed through by the checkout form. We only fire on a
 * succeeded status and dedupe on the payment_intent id (via sessionStorage) so
 * a page refresh doesn't double-count the conversion.
 */
export default function PurchaseTracker({
  transactionId,
  value,
  currency,
  itemId,
  itemName,
  status,
}: {
  transactionId?: string
  value?: number
  currency?: string
  itemId?: string
  itemName?: string
  status?: string
}) {
  useEffect(() => {
    if (!transactionId || status !== 'succeeded') return

    const key = `hewn-purchase-tracked-${transactionId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      /* sessionStorage unavailable — still fire, just without dedupe */
    }

    trackPurchase({
      transaction_id: transactionId,
      value: value ?? 0,
      currency: currency ?? 'USD',
      items:
        itemId || itemName
          ? [{ item_id: itemId, item_name: itemName, price: value, quantity: 1 }]
          : [],
    })
  }, [transactionId, value, currency, itemId, itemName, status])

  return null
}
