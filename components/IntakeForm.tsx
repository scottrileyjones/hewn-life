'use client'
import { useEffect, useRef, useState } from 'react'
import CalButton from './CalButton'
import { intakeSections, LOGO_MAX_BYTES, type IntakeField } from '@/lib/intake'

const input = 'w-full rounded-[14px] border border-ink/[0.12] bg-white px-4 py-3 font-body text-[15px] text-ink transition placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'

function Field({ f }: { f: IntakeField }) {
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const id = `intake-${f.id}`
  const label = (
    <label htmlFor={id} className="mb-2 block font-body text-sm font-medium text-ink">
      {f.label}{f.required && <span className="text-forest"> *</span>}
    </label>
  )

  if (f.type === 'textarea') return <div className="sm:col-span-2">{label}<textarea id={id} name={f.id} required={f.required} rows={3} placeholder={f.placeholder} className={`${input} resize-y`} /></div>
  if (f.type === 'select') return (
    <div>{label}
      <select id={id} name={f.id} required={f.required} defaultValue="" className={input}>
        <option value="" disabled>Choose one</option>
        {f.options!.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
  if (f.type === 'file') return (
    <div className="sm:col-span-2">{label}
      <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border border-dashed border-ink/25 bg-white px-4 py-4 font-body text-sm transition hover:border-forest">
        <span className={fileName ? 'text-ink' : 'text-ink/55'}>{fileName || 'Choose a file to upload'}</span>
        <span className="rounded-full bg-forest px-3.5 py-1.5 font-medium text-mist">Browse</span>
      </label>
      <input
        id={id} name={f.id} type="file" accept=".png,.jpg,.jpeg,.svg,.webp,.pdf" className="sr-only"
        onChange={e => {
          const file = e.target.files?.[0]
          setFileName(file?.name ?? '')
          setFileError(file && file.size > LOGO_MAX_BYTES ? 'That file is over 5 MB. Please choose a smaller one.' : '')
        }}
      />
      <p className={`mt-1.5 font-body text-xs ${fileError ? 'text-[#A4402B]' : 'text-ink/55'}`}>{fileError || f.help}</p>
    </div>
  )
  return <div>{label}<input id={id} name={f.id} type={f.type} required={f.required} placeholder={f.placeholder} className={input} /></div>
}

/** The website brief. Prefills name, email and source from the URL (?name=&email=&source=). */
export default function IntakeForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const form = formRef.current
    if (!form) return
    for (const key of ['name', 'email', 'business_name', 'phone']) {
      const v = q.get(key)
      const el = form.elements.namedItem(key) as HTMLInputElement | null
      if (v && el && !el.value) el.value = v
    }
    const src = form.elements.namedItem('source') as HTMLInputElement | null
    if (src && q.get('source')) src.value = q.get('source')!.slice(0, 60)
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('sending')
    try {
      const res = await fetch('/api/intake', { method: 'POST', body: new FormData(e.currentTarget) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setLogoFailed(data.logo === 'failed')
      setState('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('idle')
    }
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
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3.5" noValidate={false}>
      <input type="hidden" name="source" defaultValue="Website" />
      {intakeSections.map((s, i) => (
        <fieldset key={s.title} className="rounded-[28px] border border-ink/[0.08] bg-white/60 p-6 sm:p-9">
          <legend className="sr-only">{s.title}</legend>
          <div className="mb-6 flex items-start gap-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest font-display text-sm font-medium text-mist">{i + 1}</span>
            <div>
              <h2 className="font-display text-[22px] font-medium tracking-[-0.02em]">{s.title}</h2>
              <p className="mt-1 font-body text-sm text-ink/65">{s.intro}</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {s.fields.map(f => <Field key={f.id} f={f} />)}
          </div>
        </fieldset>
      ))}
      {error && <p role="alert" className="rounded-[14px] bg-[#F6E3DD] px-4 py-3 font-body text-sm text-[#7A2E1E]">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className="w-full rounded-full bg-forest py-4 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2 disabled:opacity-60">
        {state === 'sending' ? 'Sending your brief…' : 'Send my brief'}
      </button>
      <p className="text-center font-body text-xs text-ink/55">We use this only to build your concept site. Never shared or sold.</p>
    </form>
  )
}
