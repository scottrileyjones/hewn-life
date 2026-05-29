import CalButton from '@/components/CalButton'
import Link from 'next/link'
import Image from 'next/image'

const PHOTOS = {
  hero:       'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_1100,c_fill,g_face/v1780097466/nubelson-fernandes-oC9G2VPkFNE-unsplash_pljopa.jpg',
  strategy:   'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_700,c_fill/v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg',
  testimonial:'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_700,c_fill/v1780097464/soundtrap-c_S99FlDqSw-unsplash_mtpxgd.jpg',
  cta:        'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_900,c_fill/v1780097464/collabstr-bM2nm41YaeA-unsplash_gspy6l.jpg',
}

const pillars = [
  { num: '01', name: 'Brand Foundation', desc: 'Identity, voice, and positioning — the strategic bedrock everything else is built on.', bg: '#F0F7EB', accent: '#6BAD3D' },
  { num: '02', name: 'Digital Presence', desc: 'Website, SEO, and maps — your complete digital footprint, owned and optimized.', bg: '#EBF3F7', accent: '#3D7FA4' },
  { num: '03', name: 'Lead & Revenue Engine', desc: 'Paid media, funnels, and automation — systems that turn attention into revenue.', bg: '#F7F0EB', accent: '#B5621C' },
  { num: '04', name: 'Customer Experience', desc: 'Scheduling, follow-up, and retention — the systems that turn buyers into loyal customers.', bg: '#F3EBF7', accent: '#7A4A9A' },
  { num: '05', name: 'Reputation & Social Proof', desc: 'Reviews, UGC, and referrals — turning your best customers into your best marketing.', bg: '#F7EBEB', accent: '#A43D3D' },
  { num: '06', name: 'Business Advisory', desc: 'Strategy, KPIs, and growth planning — the fractional CMO layer that ties it all together.', bg: '#EBEFF7', accent: '#3D4FA4' },
]

const stats = [
  { value: '3×', label: 'Average ROI vs. traditional agency', bg: '#6BAD3D', text: '#ffffff' },
  { value: '48h', label: 'Onboarding within 48 hours of purchase', bg: '#0D0D0D', text: '#ffffff' },
  { value: '$0', label: 'Percentage-of-spend fees. Ever.', bg: '#F7F0EB', text: '#0D0D0D' },
  { value: '6', label: 'Full service pillars in every retainer', bg: '#EBF3F7', text: '#0D0D0D' },
]

const comparisonRows = [
  { service: 'Brand Strategy & Identity', traditional: '$15,000–$50,000 project', hewn: 'Included' },
  { service: 'Website Design & Development', traditional: '$15,000–$40,000 project', hewn: 'Included' },
  { service: 'Paid Media Management', traditional: '$3,000–$10,000/mo + 15%', hewn: 'Included' },
  { service: 'SEO & Content Marketing', traditional: '$3,000–$8,000/month', hewn: 'Included' },
  { service: 'Marketing Automation & CRM', traditional: '$5,000–$15,000 setup', hewn: 'Included' },
  { service: 'Social Media Management', traditional: '$2,000–$5,000/month', hewn: 'Included' },
  { service: 'Strategic Advisory / CMO', traditional: '$5,000–$15,000/month', hewn: 'Included' },
]

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left — copy */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-[#F0F7EB] text-[#3D6B1E] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D]" />
              <span className="font-body text-xs font-medium tracking-wide">The AI-Era Marketing Agency</span>
            </div>
            <h1 className="hero-heading text-[52px] md:text-[68px] lg:text-[72px] text-[#0D0D0D] mb-8 leading-[0.95]">
              Marketing isn&apos;t a line item. It&apos;s the{' '}
              <span style={{ color: '#6BAD3D' }}>life</span>{' '}
              of your business.
            </h1>
            <p className="font-body text-lg text-[#6B6560] max-w-md mb-10 leading-relaxed">
              Thirty years of human business acumen. The speed and scale of AI. Full-service marketing at a fraction of the traditional cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CalButton className="inline-flex items-center justify-center bg-[#0D0D0D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200">
                Book a Discovery Call
              </CalButton>
              <Link href="/pricing" className="inline-flex items-center justify-center border border-black/15 text-[#0D0D0D] font-body font-medium px-8 py-4 rounded-full hover:border-black/30 hover:bg-black/[0.02] transition-all duration-200">
                See Plans & Pricing
              </Link>
            </div>
          </div>

          {/* Right — photo card */}
          <div className="animate-fade-up delay-2 relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] w-full relative">
              <Image src={PHOTOS.hero} alt="Creative professional at work" fill className="object-cover" priority />

              {/* Analytics overlay card */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[88%] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/[0.06] p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">Monthly Snapshot</p>
                  <span className="flex items-center gap-1.5 bg-[#F0F7EB] text-[#3D6B1E] rounded-full px-2.5 py-1 text-[10px] font-body font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6BAD3D]" />
                    Live
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Revenue row */}
                  <div>
                    <div className="flex items-end justify-between mb-1">
                      <span className="font-body text-xs text-black/50">Revenue attributed</span>
                      <span className="flex items-center gap-1 font-body text-[11px] font-semibold text-[#6BAD3D]">
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 9l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        +34%
                      </span>
                    </div>
                    <p className="font-display font-bold text-[22px] leading-none text-[#0D0D0D]">$48,200</p>
                  </div>

                  {/* Bar chart */}
                  <div className="flex items-end gap-1.5 h-10 pt-1">
                    {[30, 52, 44, 70, 58, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? '#6BAD3D' : `rgba(107,173,61,${0.15 + i * 0.08})` }} />
                    ))}
                  </div>

                  {/* Sub-metrics */}
                  <div className="flex gap-4 pt-1 border-t border-black/[0.06]">
                    <div>
                      <p className="font-body text-[10px] text-black/40 mb-0.5">Leads</p>
                      <p className="font-body font-semibold text-sm text-[#0D0D0D]">142</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-black/40 mb-0.5">ROAS</p>
                      <p className="font-body font-semibold text-sm text-[#0D0D0D]">4.8×</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-black/40 mb-0.5">CAC</p>
                      <p className="font-body font-semibold text-sm text-[#0D0D0D]">$112</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating ROI badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-black/[0.06] px-6 py-4">
              <p className="font-display font-bold text-[32px] text-[#6BAD3D] leading-none">3×</p>
              <p className="font-body text-xs text-[#6B6560] mt-1">avg. ROI vs. traditional agency</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <section className="border-y border-black/[0.06] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-black/30 text-center mb-8">Trusted by growth-minded businesses</p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-24 h-7 bg-black/[0.06] rounded-md" />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col justify-between min-h-[140px]" style={{ background: s.bg }}>
              <p className="font-display font-bold text-[44px] leading-none" style={{ color: s.text }}>{s.value}</p>
              <p className="font-body text-sm leading-snug mt-3" style={{ color: s.text === '#ffffff' ? 'rgba(255,255,255,0.7)' : '#6B6560' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo card */}
          <div className="rounded-3xl overflow-hidden aspect-[4/3] relative">
            <Image src={PHOTOS.strategy} alt="Team collaborating at a whiteboard" fill className="object-cover" />
          </div>
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-black/[0.04] rounded-full px-4 py-1.5 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">What Makes Us Different</span>
            </div>
            <h2 className="font-display font-bold text-[40px] leading-tight text-[#0D0D0D] mb-6">
              Premium marketing. Flat fees. Zero agency tax.
            </h2>
            <p className="font-body text-base text-[#6B6560] mb-8 leading-relaxed">
              Traditional agencies carry massive overhead — account managers, project managers, layers of markup. Hewn Life cuts all of it. You get a senior team, embedded in your business, at a fraction of what you&apos;d pay elsewhere.
            </p>
            <div className="space-y-3 mb-8">
              {['Flat monthly retainer — no percentage-of-spend', 'Full six-pillar service from day one', 'Onboarding within 48 hours of signing'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F0F7EB] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#6BAD3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-body text-sm text-[#0D0D0D]">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/pricing" className="font-body text-sm font-medium text-[#6BAD3D] hover:underline underline-offset-4">
              See how we price it →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SIX PILLARS ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/[0.04] rounded-full px-4 py-1.5 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">How We Work</span>
            </div>
            <h2 className="font-display font-bold text-[44px] leading-tight text-[#0D0D0D]">
              Six pillars.<br />One mission.
            </h2>
          </div>
          <p className="font-body text-base text-[#6B6560] max-w-sm">
            We operate as your fractional CMO and growth partner — embedded in your business, invested in the outcome.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p) => (
            <div key={p.num} className="rounded-2xl p-7 hover:-translate-y-0.5 transition-transform duration-200" style={{ background: p.bg }}>
              <p className="font-display font-bold text-[40px] leading-none mb-5" style={{ color: p.accent + '33' }}>{p.num}</p>
              <p className="font-body font-semibold text-[13px] uppercase tracking-wider text-[#0D0D0D] mb-2">{p.name}</p>
              <p className="font-body text-sm text-[#6B6560] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-[#0D0D0D] rounded-3xl p-12 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display font-bold text-[64px] text-[#6BAD3D] leading-none mb-6">&ldquo;</p>
            <blockquote className="font-display font-semibold text-[28px] md:text-[32px] leading-snug text-white mb-8">
              Hewn Life didn&apos;t just run our marketing. They rebuilt how we think about our business.
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div>
                <p className="font-body font-semibold text-sm text-white">Jane Smith</p>
                <p className="font-body text-sm text-white/50">Owner, Acme Roofing Co.</p>
              </div>
            </div>
          </div>
          {/* Photo */}
          <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
            <Image src={PHOTOS.testimonial} alt="Professional recording studio" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-black/[0.04] rounded-full px-4 py-1.5 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">The Numbers</span>
          </div>
          <h2 className="font-display font-bold text-[40px] text-[#0D0D0D]">
            What this costs at a traditional agency.
          </h2>
        </div>
        <div className="bg-[#F7F6F3] rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left px-8 py-5 font-mono text-[10px] uppercase tracking-[0.15em] text-black/40 font-normal">Service</th>
                <th className="text-left px-8 py-5 font-mono text-[10px] uppercase tracking-[0.15em] text-black/40 font-normal">Traditional Agency</th>
                <th className="text-left px-8 py-5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#6BAD3D] font-normal">Hewn Life</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-b border-black/[0.05]">
                  <td className="px-8 py-4 font-body text-sm text-[#0D0D0D]">{row.service}</td>
                  <td className="px-8 py-4 font-body text-sm text-black/40 line-through">{row.traditional}</td>
                  <td className="px-8 py-4 font-body text-sm font-medium text-[#6BAD3D]">{row.hewn}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#0D0D0D]">
                <td className="px-8 py-5 font-body font-semibold text-sm text-white">Total</td>
                <td className="px-8 py-5 font-body text-sm text-white/30 line-through">$20,000–$50,000+/mo</td>
                <td className="px-8 py-5 font-body font-bold text-sm text-[#6BAD3D]">From $2,500/mo</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Left — copy on green */}
          <div className="bg-[#6BAD3D] p-12 md:p-16 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 mb-6">Get Started</p>
              <h2 className="font-display font-bold text-[40px] leading-tight text-white mb-6">
                Ready to stop paying the agency tax?
              </h2>
              <p className="font-body text-base text-white/80 mb-10 leading-relaxed">
                Book a free 30-minute call. No pitch decks, no pressure — just an honest conversation about your business and where to start.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <CalButton className="inline-flex items-center justify-center bg-white text-[#0D0D0D] font-body font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-200">
                Book a Free Call
              </CalButton>
              <Link href="/pricing" className="inline-flex items-center justify-center border border-white/30 text-white font-body font-medium px-8 py-4 rounded-full hover:border-white/60 transition-all duration-200">
                See Pricing
              </Link>
            </div>
          </div>
          {/* Right — photo */}
          <div className="relative min-h-[320px]">
            <Image src={PHOTOS.cta} alt="Creator working on content" fill className="object-cover" />
          </div>
        </div>
      </section>

    </div>
  )
}
