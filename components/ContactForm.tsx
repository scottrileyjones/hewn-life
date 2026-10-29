'use client'
import { useState } from 'react'
import Link from 'next/link'
import CalButton from './CalButton'
import CardFlow, { type FlowStep } from './CardFlow'
import { revenueIndex, revenueValue, revenueStage, questions, tiers, computeResult, computeScore, getServices, computeHealthScore } from '@/lib/quiz'

type Readout = {
  email: string
  tier: keyof typeof tiers
  health: ReturnType<typeof computeHealthScore>
  services: ReturnType<typeof getServices>
}

/** Revenue as a few tappable ranges, each mapped to a calculator stop for scoring. */
const REVENUE_BANDS = [
  { label: 'Pre-revenue', value: 0 },
  { label: 'Under $250K', value: 100000 },
  { label: '$250K–$1M', value: 500000 },
  { label: '$1M–$5M', value: 3000000 },
  { label: '$5M–$20M', value: 15000000 },
  { label: '$20M+', value: 30000000 },
].map(b => ({ ...b, idx: revenueIndex(b.value) }))

const CONSENT = 'I agree to receive my results and occasional marketing emails from Hewn Life, and to the privacy policy. I can unsubscribe anytime.'

const steps: FlowStep[] = [
  {
    id: 'revenue', title: 'Roughly how much does the business make in a year?', subtitle: 'A ballpark is fine. It shapes what we’d recommend.',
    choice: { name: 'revenue', required: true, options: REVENUE_BANDS.map(b => ({ label: b.label })) },
  },
  ...questions.map(q => ({
    id: q.id, title: q.question, subtitle: q.subtitle,
    choice: { name: q.id, required: true, options: q.options.map(o => ({ label: o.label, value: o.value })) },
  })),
  {
    id: 'notes', title: 'Anything else we should know?', subtitle: 'What you sell, who you sell to, what you’ve tried. Optional.',
    fields: [{ name: 'notes', type: 'textarea', placeholder: 'e.g. HVAC in Salt Lake. Referrals are steady but ads keep getting pricier.' }],
  },
  {
    id: 'who', title: 'Who are we putting this together for?',
    fields: [
      { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
      { name: 'company', label: 'Business name', type: 'text', required: true, autoComplete: 'organization' },
    ],
  },
  {
    id: 'you', title: 'Where should we send your growth plan?', subtitle: 'You’ll see your readout as soon as you tap the button.',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', placeholder: 'you@business.com' },
      { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
      { name: 'consent', type: 'checkbox', required: true, help: CONSENT },
    ],
  },
]

/**
 * The contact form asks the ROI calculator's questions one card at a time,
 * saves the lead the same way (which also starts their personal growth plan),
 * then reads out the result on the spot.
 */
export default function ContactForm() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [readout, setReadout] = useState<Readout | null>(null)

  async function submit() {
    setError('')
    const answers = Object.fromEntries(questions.map(q => [q.id, values[q.id]]))
    const band = REVENUE_BANDS.find(b => b.label === values.revenue)
    const scored = band ? { ...answers, stage: revenueStage(band.idx) } : answers
    const tier = computeResult(scored)
    const services = getServices(scored)
    const readable: Record<string, string> = {}
    questions.forEach(q => {
      const opt = q.options.find(o => o.value === answers[q.id])
      if (opt) readable[q.question] = opt.label
    })

    setSending(true)
    try {
      const res = await fetch('/api/quiz-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Contact form',
          name: values.name, company: values.company, email: values.email, phone: values.phone, notes: values.notes,
          consent: values.consent === 'on',
          tier: tiers[tier].name,
          services: services.map(s => s.label),
          answers: readable,
          score: computeScore(scored),
          annualRevenue: band ? revenueValue(band.idx) : undefined,
          annualRevenueLabel: band?.label ?? '',
        }),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(out.error || 'Something went wrong.')
      setReadout({ email: values.email, tier, health: computeHealthScore(scored), services })
      requestAnimationFrame(() => document.getElementById('contact-readout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'Something went wrong.'} Please try again, or email hello@hewn.life.`)
    } finally {
      setSending(false)
    }
  }

  if (readout) return <ReadoutView {...readout} />

  return (
    <CardFlow
      steps={steps}
      values={values}
      onChange={(name, value) => setValues(v => ({ ...v, [name]: value }))}
      onSubmit={submit}
      submitLabel="Get my readout"
      sending={sending}
      error={error}
      finePrint={<>Read our <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">privacy policy</Link>. Your information is never sold.</>}
    />
  )
}

function ReadoutView({ email, tier, health, services }: Readout) {
  const t = tiers[tier]
  return (
    <div id="contact-readout" className="scroll-mt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest">Your readout</p>
      <div className="mt-4 flex items-end gap-4">
        <p className="font-display text-[64px] font-semibold leading-none tracking-[-0.03em] text-ink">{health.overall}</p>
        <p className="pb-2 font-body text-sm text-ink/60">/ 100 marketing health score</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {health.categories.map(c => (
          <div key={c.label}>
            <div className="flex justify-between font-body text-sm text-ink"><span>{c.label}</span><span className="font-medium">{c.score}</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-sand"><div className="h-2 rounded-full bg-forest" style={{ width: `${c.score}%` }} /></div>
            <p className="mt-1.5 font-body text-[12px] leading-snug text-ink/60">{c.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[24px] bg-lime p-6 text-forest">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Where we&apos;d start</p>
        <p className="mt-2 font-display text-[28px] font-semibold">{t.name} <span className="font-body text-[15px] font-normal opacity-70">{t.price}</span></p>
        <p className="mt-1 font-body text-[15px]">{t.tagline}</p>
      </div>

      {services.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">Where to focus first</p>
          <ul className="mt-3 divide-y divide-ink/[0.08]">
            {services.slice(0, 3).map(s => (
              <li key={s.label} className="py-3">
                <p className="font-body text-[15px] font-medium text-ink">{s.label}</p>
                <p className="font-body text-sm text-ink/65">{s.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-[20px] border border-ink/[0.08] bg-bone p-5">
        <p className="font-body text-[15px] text-ink">Your personal growth plan is on its way to <b>{email}</b>: your top challenges, how we&apos;d address them and a 90-day roadmap.</p>
        <CalButton className="mt-4 inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2">Book a call to walk through it</CalButton>
      </div>
    </div>
  )
}
