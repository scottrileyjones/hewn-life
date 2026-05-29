import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Brand Guide — Hewn Life' }

const colors = [
  { group: 'Primary Darks', items: [
    { name: 'Iron / Ink', token: 'iron', hex: '#1A1815' },
    { name: 'Forge', token: 'forge', hex: '#0E0D0B' },
    { name: 'Charcoal', token: 'charcoal', hex: '#2A2824' },
  ]},
  { group: 'Warm Neutrals', items: [
    { name: 'Bone / Cream', token: 'bone', hex: '#F2ECE0' },
    { name: 'Stone', token: 'stone', hex: '#E8DFC0' },
    { name: 'Oat', token: 'oat', hex: '#DCCFB6' },
    { name: 'Ash', token: 'ash', hex: '#A89F92' },
  ]},
  { group: 'Earth', items: [
    { name: 'Slate', token: 'slate', hex: '#3F4A47' },
    { name: 'Moss', token: 'moss', hex: '#4A5348' },
    { name: 'Clay', token: 'clay', hex: '#685544' },
  ]},
  { group: 'Accents', items: [
    { name: 'Ember', token: 'ember', hex: '#7CB550' },
    { name: 'Copper', token: 'copper', hex: '#B5621C' },
    { name: 'Hewn', token: 'hewn', hex: '#8C4612' },
  ]},
]

const typeScale = [
  { label: 'Hero', size: '80px', weight: 'Bold', font: 'Playfair Display', sample: 'Built for the future.' },
  { label: 'H1', size: '56px', weight: 'Bold', font: 'Playfair Display', sample: 'Three tiers. No contracts.' },
  { label: 'H2', size: '40px', weight: 'Semibold', font: 'Playfair Display', sample: 'Your outsourced CMO.' },
  { label: 'H3', size: '28px', weight: 'Semibold', font: 'Playfair Display', sample: 'Deliberately shaped.' },
  { label: 'Body LG', size: '18px', weight: 'Regular', font: 'DM Sans', sample: 'We charge what a freelancer costs and deliver what an agency can\'t.' },
  { label: 'Body', size: '16px', weight: 'Regular', font: 'DM Sans', sample: 'Flat fees, secure checkout, and your onboarding call scheduled within 48 hours.' },
  { label: 'Body SM', size: '14px', weight: 'Regular', font: 'DM Sans', sample: 'Cancel anytime. No long-term contracts. Dedicated account manager.' },
  { label: 'Mono / Label', size: '10px', weight: 'Medium', font: 'Inter Tight', sample: 'MONTHLY RETAINERS · PILLARS 01–06' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/50">{title}</span>
        <div className="flex-1 h-px bg-black/[0.08]" />
      </div>
      {children}
    </section>
  )
}

export default function BrandGuide() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <div className="bg-iron grain-overlay pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash/40 mb-4">Internal Reference</p>
          <h1 className="font-display font-bold text-[64px] md:text-[80px] leading-none text-bone mb-4">
            Brand<br /><em style={{ color: '#7CB550' }}>Guide.</em>
          </h1>
          <p className="font-body text-base text-ash/60 max-w-md">
            The visual and verbal language of Hewn Life. Use this as the source of truth for all brand expressions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Logo */}
        <Section title="01 — Logo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-iron flex items-center justify-center h-48 border border-white/5">
              <span className="font-display font-bold text-[40px] text-bone tracking-tight">Hewn Life</span>
            </div>
            <div className="rounded-2xl bg-bone border border-black/10 flex items-center justify-center h-48">
              <span className="font-display font-bold text-[40px] text-iron tracking-tight">Hewn Life</span>
            </div>
            <div className="rounded-2xl bg-moss flex items-center justify-center h-48">
              <span className="font-display font-bold text-[40px] text-bone tracking-tight">Hewn Life</span>
            </div>
            <div className="rounded-2xl bg-stone border border-black/10 flex items-center justify-center h-48">
              <span className="font-display font-bold text-[40px] text-iron tracking-tight">Hewn Life</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/10 rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss mb-3">Do</p>
              <ul className="space-y-2">
                {['Use on dark, light, or moss backgrounds only', 'Maintain generous clear space around the wordmark', 'Use the italic variant for editorial contexts'].map(t => (
                  <li key={t} className="flex items-start gap-2.5 font-body text-sm text-slate">
                    <svg className="w-3.5 h-3.5 text-moss flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-black/10 rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500 mb-3">Don&apos;t</p>
              <ul className="space-y-2">
                {['Stretch or distort the wordmark', 'Place on busy photographic backgrounds', 'Use colours outside the brand palette'].map(t => (
                  <li key={t} className="flex items-start gap-2.5 font-body text-sm text-slate">
                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section title="02 — Colours">
          <div className="space-y-10">
            {colors.map(group => (
              <div key={group.group}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">{group.group}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {group.items.map(c => (
                    <div key={c.hex} className="rounded-xl overflow-hidden border border-black/[0.08]">
                      <div className="h-20" style={{ background: c.hex }} />
                      <div className="bg-white px-3 py-2.5">
                        <p className="font-body text-sm font-medium text-ink">{c.name}</p>
                        <p className="font-mono text-[10px] text-slate/50">{c.hex}</p>
                        <p className="font-mono text-[10px] text-slate/40">{c.token}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section title="03 — Typography">
          <div className="space-y-3">
            {typeScale.map(t => (
              <div key={t.label} className="bg-white border border-black/[0.08] rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-baseline gap-3">
                <div className="flex-shrink-0 w-28">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate/40">{t.label}</p>
                  <p className="font-mono text-[10px] text-slate/30">{t.size} · {t.weight}</p>
                  <p className="font-mono text-[10px] text-slate/30">{t.font}</p>
                </div>
                <p
                  style={{ fontSize: t.label === 'Mono / Label' ? '11px' : undefined }}
                  className={`text-ink leading-tight flex-1 ${
                    t.font === 'Playfair Display' ? 'font-display' : t.font === 'Inter Tight' ? 'font-mono uppercase tracking-[0.2em]' : 'font-body'
                  } ${
                    t.label === 'Hero' ? 'font-bold text-[40px] md:text-[56px]' :
                    t.label === 'H1' ? 'font-bold text-[32px] md:text-[40px]' :
                    t.label === 'H2' ? 'font-semibold text-[26px] md:text-[32px]' :
                    t.label === 'H3' ? 'font-semibold text-[22px]' :
                    t.label === 'Body LG' ? 'text-lg' :
                    t.label === 'Body SM' ? 'text-sm' : 'text-base'
                  }`}
                >
                  {t.sample}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Voice & Tone */}
        <Section title="04 — Voice & Tone">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/[0.08] rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss mb-5">We sound like</p>
              <div className="space-y-4">
                {[
                  { word: 'Confident', desc: 'We know our craft. We don\'t hedge or qualify unnecessarily.' },
                  { word: 'Direct', desc: 'Short sentences. No filler. Say it and move on.' },
                  { word: 'Warm', desc: 'Not corporate. We talk like a trusted advisor, not a vendor.' },
                  { word: 'Earned', desc: 'We let results speak. No hype, no superlatives without proof.' },
                  { word: 'Craft-forward', desc: 'The craft vocabulary (Hewn, Wrought, Forged) runs through everything.' },
                ].map(v => (
                  <div key={v.word}>
                    <p className="font-display font-semibold text-[18px] text-ink">{v.word}</p>
                    <p className="font-body text-sm text-slate">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 mb-5">We never say</p>
              <div className="space-y-3">
                {[
                  'World-class', 'Best-in-class', 'Synergy', 'Leverage (as a verb)',
                  'Disruptive', 'Holistic', 'Move the needle', 'At the end of the day',
                  'Game-changer', 'Thought leader', 'Scalable solutions', 'Value-add',
                ].map(w => (
                  <div key={w} className="flex items-center gap-2.5">
                    <svg className="w-3.5 h-3.5 text-red-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="font-body text-sm text-slate line-through decoration-red-200">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copy examples */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 mb-4">Not this</p>
              <p className="font-body text-sm text-slate/70 italic">"We leverage world-class, holistic marketing strategies to deliver best-in-class results for forward-thinking businesses."</p>
            </div>
            <div className="bg-moss/5 border border-moss/20 rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss mb-4">This</p>
              <p className="font-body text-sm text-slate italic">"We do the work agencies charge three times more for. Flat fees, no contracts, results you can measure."</p>
            </div>
          </div>
        </Section>

        {/* Buttons & UI */}
        <Section title="05 — Buttons & UI">
          <div className="bg-white border border-black/[0.08] rounded-2xl p-8 space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Primary</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-moss text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all">Get Started</button>
                <button className="bg-iron text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all">Get Started</button>
                <button className="bg-ember text-bone font-body font-medium px-8 py-4 rounded-full hover:brightness-110 transition-all">Get Started</button>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Ghost / Secondary</p>
              <div className="flex flex-wrap gap-4">
                <button className="border border-black/20 text-ink font-body font-medium px-8 py-4 rounded-full hover:border-black/40 transition-all">Learn More</button>
                <button className="border border-moss text-moss font-body font-medium px-8 py-4 rounded-full hover:bg-moss/5 transition-all">Learn More</button>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Text Link</p>
              <div className="flex flex-wrap gap-6">
                <span className="font-body text-sm text-ember hover:underline cursor-pointer">Book a free call →</span>
                <span className="font-body text-sm text-slate hover:text-ink cursor-pointer transition-colors">See everything included ↓</span>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Eyebrow / Label</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-slate/30" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate/50">Monthly Retainers</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Spacing & Layout */}
        <Section title="06 — Spacing & Layout">
          <div className="bg-white border border-black/[0.08] rounded-2xl p-8 space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Max Widths</p>
              <div className="space-y-3">
                {[
                  { label: 'Full layout', value: 'max-w-7xl (1280px)', desc: 'Hero sections, feature grids' },
                  { label: 'Content', value: 'max-w-5xl (1024px)', desc: 'Standard page content' },
                  { label: 'Prose', value: 'max-w-3xl (768px)', desc: 'Long-form text, blog' },
                  { label: 'Narrow', value: 'max-w-xl (576px)', desc: 'CTAs, centered copy' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-slate/40 w-24 flex-shrink-0">{s.label}</span>
                    <span className="font-mono text-xs text-ink">{s.value}</span>
                    <span className="font-body text-xs text-slate/50">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Section Padding</p>
              <div className="space-y-2">
                {[
                  { label: 'Hero', value: 'pt-32 pb-24' },
                  { label: 'Section', value: 'py-24 md:py-32' },
                  { label: 'Compact', value: 'py-16 md:py-24' },
                  { label: 'Horizontal', value: 'px-6 lg:px-12' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-slate/40 w-24 flex-shrink-0">{s.label}</span>
                    <span className="font-mono text-xs text-ink bg-bone px-2 py-1 rounded">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate/40 mb-4">Border Radius</p>
              <div className="flex flex-wrap gap-4 items-end">
                {[
                  { label: 'Cards', r: 'rounded-2xl', px: '16px' },
                  { label: 'Inputs', r: 'rounded-xl', px: '12px' },
                  { label: 'Buttons', r: 'rounded-full', px: '9999px' },
                  { label: 'Chips', r: 'rounded-lg', px: '8px' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className={`w-16 h-16 bg-bone border border-black/10 ${s.r} mb-2`} />
                    <p className="font-mono text-[9px] text-slate/40">{s.label}</p>
                    <p className="font-mono text-[9px] text-slate/30">{s.px}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Do's & Don'ts */}
        <Section title="07 — Do's & Don'ts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                type: 'do' as const,
                items: [
                  'Use Playfair Display for all headlines and display text',
                  'Lead with the outcome, not the process',
                  'Use grain overlays on dark hero sections',
                  'Pair dark backgrounds with bone or ash text',
                  'Use ember sparingly — it\'s an accent, not a base',
                  'Keep copy tight — one idea per sentence',
                  'Use the craft vocabulary (Hewn, Wrought, Forged) in naming',
                ],
              },
              {
                type: 'dont' as const,
                items: [
                  'Use more than two typefaces in a single layout',
                  'Place ember text on moss backgrounds',
                  'Use all-caps for anything longer than a label',
                  'Mix warm and cool greys in the same component',
                  'Use drop shadows — use borders and bg contrast instead',
                  'Write paragraphs longer than 3 sentences in UI copy',
                  'Use gradients unless they match brand palette exactly',
                ],
              },
            ].map(col => (
              <div key={col.type} className={`rounded-2xl p-6 border ${col.type === 'do' ? 'bg-moss/5 border-moss/20' : 'bg-red-50 border-red-100'}`}>
                <p className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-5 ${col.type === 'do' ? 'text-moss' : 'text-red-400'}`}>
                  {col.type === 'do' ? 'Do' : "Don't"}
                </p>
                <ul className="space-y-3">
                  {col.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5">
                      <svg className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${col.type === 'do' ? 'text-moss' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        {col.type === 'do'
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                      <span className="font-body text-sm text-slate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  )
}
