import { Cormorant_Garamond, Playfair_Display, DM_Serif_Display, Lora } from 'next/font/google'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['italic'], variable: '--f-cormorant' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '600'], style: ['italic'], variable: '--f-playfair' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], style: ['italic'], variable: '--f-dmserif' })
const lora = Lora({ subsets: ['latin'], weight: ['500', '600'], style: ['italic'], variable: '--f-lora' })

const options = [
  { key: 'A', name: 'Cormorant Garamond', cls: cormorant.className, note: 'Ultra-refined, high-contrast, fashion-house elegance.' },
  { key: 'B', name: 'Playfair Display', cls: playfair.className, note: 'Classic editorial — punchy and rich at display sizes.' },
  { key: 'C', name: 'DM Serif Display', cls: dmSerif.className, note: 'Designed to pair with DM Sans. Cohesive system match.' },
  { key: 'D', name: 'Lora', cls: lora.className, note: 'Warm, approachable, credible — less high-fashion.' },
]

export default function FontOptions() {
  return (
    <div className={`${cormorant.variable} ${playfair.variable} ${dmSerif.variable} ${lora.variable} bg-white min-h-screen pt-32 pb-24 px-6 lg:px-12`}>
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40 mb-3">Design System — Accent Type Options</p>
        <h1 className="font-display font-bold text-[40px] text-[#0D0D0D] mb-4">Italic accent font</h1>
        <p className="font-body text-base text-[#6B6560] max-w-xl mb-16">
          The accent (green) words in headlines would use one of these italic serifs against Plus Jakarta Sans. Each block shows it in context.
        </p>

        <div className="space-y-16">
          {options.map((o) => (
            <div key={o.key} className="border-t border-black/[0.08] pt-8">
              <div className="flex items-baseline justify-between mb-6">
                <p className="font-display font-semibold text-lg text-[#0D0D0D]">
                  Option {o.key} — {o.name}
                </p>
                <p className="font-body text-sm text-[#6B6560] max-w-xs text-right">{o.note}</p>
              </div>

              <h2 className="hero-heading text-[44px] md:text-[60px] text-[#0D0D0D] leading-[0.98] mb-6">
                Marketing isn&apos;t a line item. It&apos;s the{' '}
                <span className={o.cls} style={{ color: '#6BAD3D', fontStyle: 'italic' }}>life</span>{' '}
                of your business.
              </h2>

              <p className="font-display font-bold text-[28px] text-[#0D0D0D]">
                Built for <span className={o.cls} style={{ color: '#6BAD3D', fontStyle: 'italic' }}>more growth</span>.
              </p>
              <p className="font-display font-bold text-[28px] text-[#0D0D0D] mt-1">
                Premium marketing, <span className={o.cls} style={{ color: '#6BAD3D', fontStyle: 'italic' }}>zero agency tax</span>.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
