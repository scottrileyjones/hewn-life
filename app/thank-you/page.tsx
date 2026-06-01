import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'You\'re in — Hewn Life',
}

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-6 py-32">
      <div className="text-center max-w-xl">
        <div className="w-16 h-16 rounded-full bg-moss/10 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display font-bold fluid-hero leading-tight text-ink mb-6">
          You&apos;re in.<br />Let&apos;s get to work.
        </h1>
        <p className="font-body text-base text-slate max-w-md mx-auto mb-10 leading-relaxed">
          Check your email — we&apos;ll be in touch within 24 hours to kick off onboarding.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-sm font-medium text-slate hover:text-ink transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  )
}
