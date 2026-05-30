const options = [
  { key: 'A', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", note: 'Ultra-refined, high-contrast, fashion-house elegance.' },
  { key: 'B', name: 'Playfair Display', family: "'Playfair Display', serif", note: 'Classic editorial — punchy and rich at display sizes.' },
  { key: 'C', name: 'DM Serif Display', family: "'DM Serif Display', serif", note: 'Designed to pair with DM Sans. Cohesive system match.' },
  { key: 'D', name: 'Lora', family: "'Lora', serif", note: 'Warm, approachable, credible — less high-fashion.' },
]

export default function FontOptions() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Playfair+Display:ital,wght@1,500;1,600&family=DM+Serif+Display:ital@1&family=Lora:ital,wght@1,500;1,600&display=swap"
        rel="stylesheet"
      />
      <div className="bg-white min-h-screen pt-32 pb-24 px-6 lg:px-12">
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
                  <span style={{ color: '#6BAD3D', fontFamily: o.family, fontStyle: 'italic', fontWeight: 600 }}>life</span>{' '}
                  of your business.
                </h2>

                <p className="font-display font-bold text-[28px] text-[#0D0D0D]">
                  Built for <span style={{ color: '#6BAD3D', fontFamily: o.family, fontStyle: 'italic', fontWeight: 600 }}>more growth</span>.
                </p>
                <p className="font-display font-bold text-[28px] text-[#0D0D0D] mt-1">
                  Premium marketing, <span style={{ color: '#6BAD3D', fontFamily: o.family, fontStyle: 'italic', fontWeight: 600 }}>zero agency tax</span>.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
