import { Suspense } from 'react'
import CheckoutClient from './checkout-client'

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bone" />}>
      <CheckoutClient />
    </Suspense>
  )
}
