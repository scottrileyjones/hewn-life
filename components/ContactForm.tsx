'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h3 className="font-display font-medium tracking-[-0.03em] text-3xl text-ink mb-4">Thank you.</h3>
        <p className="font-body text-ink/70">We&apos;ll review your submission and be in touch within one business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-body text-sm text-ink mb-2">Full Name *</label>
          <input
            type="text"
            required
            className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block font-body text-sm text-ink mb-2">Business Name *</label>
          <input
            type="text"
            required
            className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all"
            placeholder="Acme Roofing Co."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-body text-sm text-ink mb-2">Email Address *</label>
          <input
            type="email"
            required
            className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block font-body text-sm text-ink mb-2">Phone Number</label>
          <input
            type="tel"
            className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all"
            placeholder="(555) 000-0000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-body text-sm text-ink mb-2">Monthly Revenue (approx.)</label>
          <select className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all">
            <option value="">Select range</option>
            <option>Under $500K</option>
            <option>$500K–$1M</option>
            <option>$1M–$5M</option>
            <option>$5M+</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="block font-body text-sm text-ink mb-2">Which package interests you?</label>
          <select className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all">
            <option value="">Select package</option>
            <option>Hewn — $2,500/mo</option>
            <option>Wrought — $5,000/mo</option>
            <option>Forged — $9,500/mo</option>
            <option>Not sure yet</option>
            <option>À la carte project</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block font-body text-sm text-ink mb-2">What&apos;s your biggest marketing challenge right now? *</label>
        <textarea
          required
          rows={4}
          className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all resize-none"
          placeholder="Tell us what you're struggling with..."
        />
      </div>
      <div>
        <label className="block font-body text-sm text-ink mb-2">How did you hear about us?</label>
        <input
          type="text"
          className="w-full border border-ink/[0.12] rounded-[14px] px-4 py-3 font-body text-sm text-ink bg-white focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all"
          placeholder="Optional"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-forest text-mist font-body font-medium py-4 rounded-full hover:bg-forest-2 transition-all duration-300"
      >
        Send and book my call
      </button>
      <p className="font-body font-light text-[12px] text-ink/70 text-center">
        We respect your privacy. Your information is never shared or sold.
      </p>
    </form>
  )
}
