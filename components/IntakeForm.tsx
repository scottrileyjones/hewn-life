'use client'
import { useEffect, useRef, useState } from 'react'
import CalButton from './CalButton'
import CardFlow, { type FlowField, type FlowStep } from './CardFlow'
import { intakeFields, planInterest, LOGO_MAX_BYTES } from '@/lib/intake'

/** One brief question from lib/intake as a card-flow field, so labels and required flags stay in one place. */
function field(id: string, overrides: Partial<FlowField> = {}): FlowField {
  const f = intakeFields.find(x => x.id === id)!
  const type = f.type === 'select' ? 'text' : f.type
  return {
    name: f.id, label: f.label, type, required: f.required, placeholder: f.placeholder, help: f.help,
    ...(f.type === 'file' ? { accept: '.png,.jpg,.jpeg,.svg,.webp,.pdf', maxBytes: LOGO_MAX_BYTES } : {}),
    ...overrides,
  }
}

const choice = (id: string) => {
  const f = intakeFields.find(x => x.id === id)!
  return { name: f.id, required: f.required, options: f.options!.map(label => ({ label })) }
}

function briefSteps(order: boolean): FlowStep[] {
  return [
    { id: 'you', title: 'First, who are we building for?', subtitle: 'We’ll send your site and your growth plan here.',
      fields: [field('name', { label: 'Your name', autoComplete: 'name' }), field('email', { autoComplete: 'email' }), field('phone', { autoComplete: 'tel', placeholder: '' })] },
    { id: 'business', title: 'Tell us about the business.',
      fields: [field('business_name', { autoComplete: 'organization' }), field('current_website', { placeholder: 'Leave blank if you don’t have one' })] },
    { id: 'action', title: 'What’s the one thing visitors should do on your site?', subtitle: 'We’ll build every page around it.', choice: choice('primary_action') },
    { id: 'offers', title: 'What do you sell?', subtitle: 'The products or services you most want to sell.',
      fields: [field('offers', { label: 'Main products or services' })] },
    { id: 'customer', title: 'Who’s your ideal customer?',
      fields: [field('ideal_customer', { label: 'Who they are and what they need' }), field('service_area')] },
    { id: 'different', title: 'Why do customers pick you?', subtitle: 'Rough is fine. We’ll sharpen it.',
      fields: [field('usp', { label: 'What makes you different' }), field('competitors')] },
    { id: 'look', title: 'Show us a website you love the look of.', subtitle: 'Any industry. One is enough; three is even better.',
      fields: [field('reference_1', { label: 'Website 1' }), field('reference_2', { label: 'Website 2' }), field('reference_3', { label: 'Website 3' }), field('reference_notes')] },
    { id: 'brand', title: 'Got any brand pieces already?', subtitle: 'All optional. Skip if you’re starting fresh.',
      fields: [field('logo'), field('brand_colors'), field('tagline'), field('brand_words')] },
    { id: 'goal', title: 'What would make the next 90 days a win?',
      fields: [field('goal_90_days', { label: '90-day goal' })] },
    { id: 'revenue', title: 'Roughly how much does the business make in a year?', subtitle: 'Helps us size your growth plan.', choice: { ...choice('revenue_range'), required: false } },
    ...(order ? [] : [{ id: 'plan', title: 'What are you interested in?', choice: { ...choice('plan_interest'), required: false } }]),
  ]
}

/**
 * The website brief. Prefills name, email and source from the URL (?name=&email=&source=).
 *
 * `order` turns it into the Website in a Day order form: the plan question is
 * fixed, and a successful brief continues to `checkoutUrl` with the contact
 * details carried over (or shows an invoice note when no Stripe price is set).
 */
export default function IntakeForm({ order = false, checkoutUrl = '', source = 'Website' }: { order?: boolean; checkoutUrl?: string; source?: string }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const files = useRef<Record<string, File | null>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [logoFailed, setLogoFailed] = useState(false)
  const [src, setSrc] = useState(source)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const pre: Record<string, string> = {}
    for (const key of ['name', 'email', 'business_name', 'phone']) { const v = q.get(key); if (v) pre[key] = v }
    if (Object.keys(pre).length) setValues(v => ({ ...pre, ...v }))
    if (q.get('source')) setSrc(q.get('source')!.slice(0, 60))
  }, [])

  async function submit() {
    setError('')
    setState('sending')
    const body = new FormData()
    for (const [k, v] of Object.entries(values)) if (k !== 'logo' && v) body.set(k, v)
    if (files.current.logo) body.set('logo', files.current.logo)
    body.set('source', src)
    if (order) body.set('plan_interest', planInterest[0])
    try {
      const res = await fetch('/api/intake', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setLogoFailed(data.logo === 'failed')
      if (order && checkoutUrl) {
        const next = new URL(checkoutUrl, window.location.origin)
        for (const [from, to] of [['name', 'fullName'], ['email', 'email'], ['business_name', 'businessName'], ['phone', 'phone']]) {
          if (values[from]) next.searchParams.set(to, values[from])
        }
        if (data.logo === 'failed') next.searchParams.set('logo', 'failed')
        // Came from a growth plan: carry its token so the sale is credited to that lead.
        const ref = new URLSearchParams(window.location.search).get('ref')
        if (ref) next.searchParams.set('ref', ref)
        window.location.assign(next.toString())
        return
      }
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('idle')
    }
  }

  if (state === 'done' && order) {
    return (
      <div className="rounded-[32px] bg-forest p-8 text-mist sm:p-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">Brief received</p>
        <h2 className="mt-4 font-display text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.08] tracking-[-0.03em]">You&apos;re in the queue.</h2>
        <p className="mt-4 max-w-[34em] font-body text-mist/80">
          We&apos;ll email your $999 invoice shortly. Your 24 hours start as soon as it&apos;s paid.
        </p>
        {logoFailed && <p className="mt-4 font-body text-sm text-lime">Your logo didn&apos;t upload. Reply to our email with it attached and we&apos;ll take it from there.</p>}
      </div>
    )
  }

  if (state === 'done') {
    return (
      <div className="rounded-[32px] bg-forest p-8 text-mist sm:p-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">Brief received</p>
        <h2 className="mt-4 font-display text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.08] tracking-[-0.03em]">We&apos;re building your concept site.</h2>
        <p className="mt-4 max-w-[34em] font-body text-mist/80">
          We&apos;ll show it to you on your exploration call. If you haven&apos;t booked a time yet, pick one now so we can have it ready.
        </p>
        {logoFailed && <p className="mt-4 font-body text-sm text-lime">Your logo didn&apos;t upload. Reply to our confirmation email with it attached and we&apos;ll take it from there.</p>}
        <CalButton className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist">Book my exploration call</CalButton>
      </div>
    )
  }

  return (
    <CardFlow
      eyebrow="Your brief"
      steps={briefSteps(order)}
      values={values}
      onChange={(name, value, file) => {
        if (file !== undefined) files.current[name] = file
        setValues(v => ({ ...v, [name]: value }))
      }}
      onSubmit={submit}
      submitLabel={order ? 'Continue to payment · $999' : 'Send my brief'}
      sending={state === 'sending'}
      error={error}
      finePrint={<>
        {order ? 'Next you pay $999 by card. Your 24 hours start once payment clears. ' : ''}
        We use your brief to build your site and to email you a short growth plan. Never sold. By sending it you agree to our{' '}
        <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Terms</a> and{' '}
        <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Privacy Policy</a>.
      </>}
    />
  )
}
