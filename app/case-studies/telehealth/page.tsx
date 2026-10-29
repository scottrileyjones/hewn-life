import type { Metadata } from 'next'
import Link from 'next/link'
import CalButton from '@/components/CalButton'
import { Glyph } from '@/components/strata/Glyph'
import { PageHero, SectionHead, ForestBand, ClosePanel, btnLight, btnGlass, btnForest } from '@/components/strata/Page'
import { outcomes, summary, stack, phases, workstreams, principles, metrics } from '@/lib/caseStudy'

export const metadata: Metadata = {
  title: 'Case study: $0 to $10M a year in telehealth — Hewn Life',
  description: 'How our team built every growth function for a national telehealth brand, from brand and website to paid media, creators, SEO, AEO, CRM and the investor story, taking it from launch to $10M a year.',
}

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.2em]'

/** Strata, bottom to top: the foundation is darkest, the capital layer lightest. */
const layerTone = [
  { bg: 'bg-forest', text: 'text-mist', sub: 'text-mist/65', chip: 'bg-white/10 text-mist', glyphFg: '#F4F2EC' },
  { bg: 'bg-forest-2', text: 'text-mist', sub: 'text-mist/65', chip: 'bg-white/10 text-mist', glyphFg: '#F4F2EC' },
  { bg: 'bg-moss', text: 'text-mist', sub: 'text-mist/65', chip: 'bg-white/10 text-mist', glyphFg: '#F4F2EC' },
  { bg: 'bg-[#6E8270]', text: 'text-mist', sub: 'text-mist/75', chip: 'bg-white/15 text-mist', glyphFg: '#F4F2EC' },
  { bg: 'bg-lime', text: 'text-forest', sub: 'text-forest/70', chip: 'bg-forest/10 text-forest', glyphFg: '#1E3826' },
]

/** Our plans as slices of the same stack. */
const sized = [
  { plan: 'Website in a Day', price: '$999', layers: 'Foundation: brand-ready website and copy' },
  { plan: 'Hewn', price: '$2,500/mo', layers: 'Foundation + SEO, AEO and social' },
  { plan: 'Wrought', price: '$5,000/mo', layers: '+ Paid media, AI creative, CRM, lifecycle and live dashboard' },
  { plan: 'Forged', price: '$9,500/mo', layers: 'The whole stack, including creators, reviews and referrals' },
]

export default function TelehealthCaseStudy() {
  const shown = metrics.filter(m => m.value)
  const nLayers = stack.length
  return (
    <div className="bg-bone pb-24 text-ink">
      <PageHero
        pill="Case study · Healthcare"
        title={<>Zero to <em className="accent text-lime">$10M a year.</em></>}
        lede="How our team built every growth function for a national telehealth brand, from the first brand guide to the seed round, in one of the hardest categories to market. Client name withheld."
        scene="valley" seed={24}
      >
        <CalButton className={btnLight}>Book a call</CalButton>
        <a href="#stack" className={btnGlass}>See what we built</a>
      </PageHero>

      {/* Outcomes */}
      <div className="mx-auto max-w-[1400px] px-5 pt-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <div key={o.value} className={`rounded-[24px] p-6 ${i === 0 ? 'bg-lime text-forest' : 'border border-ink/[0.08] bg-white'}`}>
              <p className="font-display text-[clamp(32px,3vw,44px)] font-semibold leading-none tracking-[-0.03em]">{o.value}</p>
              <p className={`mt-2 font-body text-[14px] ${i === 0 ? 'text-forest/75' : 'text-ink/60'}`}>{o.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 01 Executive summary */}
      <section className="mx-auto max-w-[1400px] px-5 pt-24">
        <SectionHead pill="01 · Executive summary" title="One team. Every growth function. One scorecard." />
        <div className="grid gap-3.5 lg:grid-cols-3">
          {([['Situation', summary.situation], ['Complication', summary.complication], ['Resolution', summary.resolution]] as const).map(([k, v], i) => (
            <div key={k} className={`rounded-[28px] p-7 sm:p-9 ${i === 2 ? 'bg-forest text-mist' : 'border border-ink/[0.08] bg-white'}`}>
              <p className={`${eyebrow} ${i === 2 ? 'text-lime' : 'text-forest'}`}>{k}</p>
              <p className={`mt-3 font-body text-[17px] leading-relaxed ${i === 2 ? 'text-mist/90' : 'text-ink/80'}`}>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 02 The growth stack */}
      <section id="stack" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 pt-24">
        <SectionHead pill="02 · What we built" title="We built every layer of the growth stack." lede="Thirteen functions in five layers, designed to work as one system. Each layer stands on the one below it." />
        <div className="flex flex-col gap-1.5">
          {stack.map((layer, i) => ({ layer, i })).reverse().map(({ layer, i }) => {
            const t = layerTone[i]
            return (
              <div key={layer.name} className={`grid gap-4 rounded-[24px] p-5 sm:p-6 lg:grid-cols-[240px_1fr] ${t.bg} ${t.text}`}>
                <div>
                  <p className={`${eyebrow} ${t.sub}`}>Layer {i + 1} of {nLayers}</p>
                  <p className="mt-1 font-display text-[24px] font-medium leading-tight">{layer.name}</p>
                  <p className={`mt-1 font-body text-[14px] ${t.sub}`}>{layer.tagline}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {layer.items.map(item => (
                    <div key={item.name} className={`rounded-[16px] p-4 ${t.chip}`}>
                      <div className="flex items-center gap-2.5">
                        <Glyph name={item.glyph} fg={t.glyphFg} accent={i === nLayers - 1 ? '#6BAD3D' : '#D6F28B'} size={22} />
                        <p className="font-body text-[15px] font-medium">{item.name}</p>
                      </div>
                      <p className={`mt-2 font-body text-[13px] leading-snug ${t.sub}`}>{item.what}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 03 Phases and workstreams */}
      <section className="mx-auto max-w-[1400px] px-5 pt-24">
        <SectionHead pill="03 · How it came together" title="Four phases, sequenced so each one paid for the next." />
        <div className="overflow-x-auto rounded-[28px] border border-ink/[0.08] bg-white p-5 sm:p-8">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-x-2">
              <div />
              {phases.map((p, i) => (
                <div key={p.name} className="pb-4">
                  <p className={`${eyebrow} text-ink/50`}>{String(i + 1).padStart(2, '0')} · {p.when}</p>
                  <p className="mt-1 font-display text-[20px] font-medium">{p.name}</p>
                  <p className="mt-1 font-body text-[13px] leading-snug text-ink/60">{p.goal}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/[0.08] pt-3">
              {workstreams.map(w => (
                <div key={w.name} className="grid grid-cols-[200px_repeat(4,1fr)] items-center gap-x-2 py-1.5">
                  <p className="font-body text-[14px] text-ink/80">{w.name}</p>
                  <div
                    title={`${w.name}: ${phases[w.from].name}${w.to > w.from ? ` → ${phases[w.to].name}` : ''}`}
                    className="relative h-7 rounded-[8px] bg-forest"
                    style={{ gridColumn: `${w.from + 2} / ${w.to + 3}` }}
                  >
                    <span className="absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-lime" aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 font-body text-[12px] text-ink/50">Bars show when each workstream was running. The dot marks when it started. Phases, not to scale.</p>
          </div>
        </div>
      </section>

      {/* 04 Operating model */}
      <ForestBand className="mt-24">
        <SectionHead dark pill="04 · Operating model" title="How the work ran, week to week." />
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <div key={p.title} className="rounded-[24px] bg-forest-2 p-6">
              <p className={`${eyebrow} text-lime`}>{String(i + 1).padStart(2, '0')}</p>
              <p className="mt-2 font-display text-[22px] font-medium">{p.title}</p>
              <p className="mt-2 font-body text-[15px] leading-relaxed text-mist/75">{p.body}</p>
            </div>
          ))}
        </div>
      </ForestBand>

      {/* 05 Results (only real, confirmed numbers) */}
      {shown.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pt-24">
          <SectionHead pill="05 · Results" title="By the numbers." />
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map(m => (
              <div key={m.label} className="rounded-[24px] border border-ink/[0.08] bg-white p-6">
                <p className="font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-forest">{m.value}</p>
                <p className="mt-2 font-body text-[15px] text-ink/70">{m.label}</p>
                {m.note && <p className="mt-1 font-body text-[12px] text-ink/50">{m.note}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What it means for you */}
      <section className="mx-auto max-w-[1400px] px-5 pt-24">
        <SectionHead pill={shown.length ? '06 · For you' : '05 · For you'} title="The same stack, sized to where you are." lede="You don’t need all thirteen functions on day one. Each plan is a slice of the system we built here, and you can add layers as you grow." />
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {sized.map((s, i) => (
            <div key={s.plan} className="flex flex-col rounded-[24px] border border-ink/[0.08] bg-white p-6">
              <div className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, j) => <span key={j} className={`h-1.5 flex-1 rounded-full ${j <= i ? 'bg-forest' : 'bg-sand'}`} />)}
              </div>
              <p className="mt-5 font-display text-[22px] font-medium">{s.plan}</p>
              <p className="font-body text-[15px] text-ink/60">{s.price}</p>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink/80">{s.layers}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CalButton className={btnForest}>Book a call</CalButton>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-forest/25 px-6 py-3.5 font-body text-[15px] font-medium text-forest transition hover:bg-forest/5">Compare plans</Link>
        </div>
      </section>

      <div className="pt-24">
        <ClosePanel title={<>Your business, <em className="accent text-lime">built the same way.</em></>} body="A free 30-minute call. We’ll map which layers you have, which you’re missing and what to build first." />
      </div>

      <p className="mx-auto max-w-[1400px] px-5 pt-8 font-body text-[12px] leading-relaxed text-ink/50">
        This case study describes work our team did before founding Hewn Life. The client is not named to protect confidentiality. Results depended on the client’s product, market, funding and team as well as on marketing; they are not typical and not a promise of future results. See our <Link href="/legal/results-disclaimer" className="underline underline-offset-2">Results Disclaimer</Link>.
      </p>
    </div>
  )
}
