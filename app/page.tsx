import CalButton from '@/components/CalButton'
import Link from 'next/link'
import Image from 'next/image'
import CountUp from '@/components/CountUp'

const PHOTOS = {
  hero:       'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_1100,c_fill/v1779578220/main-sample.png',
  strategy:   'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_700,c_fill/v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg',
  testimonial:'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_700,c_fill/v1780097464/soundtrap-c_S99FlDqSw-unsplash_mtpxgd.jpg',
  cta:        'https://res.cloudinary.com/dsx2wcqte/image/upload/f_auto,q_auto,w_900,h_900,c_fill/v1780097464/collabstr-bM2nm41YaeA-unsplash_gspy6l.jpg',
}

const pillars = [
  {
    num: '01', name: 'Brand Foundation', desc: 'Identity, voice, and positioning — the strategic bedrock everything else is built on.', bg: '#F0F7EB', accent: '#6BAD3D',
    icon: <><path d="M12 3L3 8l9 5 9-5-9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 18l9 5 9-5" /></>,
  },
  {
    num: '02', name: 'Digital Presence', desc: 'Website, SEO, and maps — your complete digital footprint, owned and optimized.', bg: '#EBF3F7', accent: '#3D7FA4',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z" /></>,
  },
  {
    num: '03', name: 'Lead & Revenue Engine', desc: 'Paid media, funnels, and automation — systems that turn attention into revenue.', bg: '#F7F0EB', accent: '#B5621C',
    icon: <><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" /></>,
  },
  {
    num: '04', name: 'Customer Experience', desc: 'Scheduling, follow-up, and retention — the systems that turn buyers into loyal customers.', bg: '#F3EBF7', accent: '#7A4A9A',
    icon: <><path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-5.1A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z" /><path d="M12 14s-2-1.3-2-2.6A1.4 1.4 0 0 1 12 10a1.4 1.4 0 0 1 2 1.4C14 12.7 12 14 12 14z" /></>,
  },
  {
    num: '05', name: 'Reputation & Social Proof', desc: 'Reviews, UGC, and referrals — turning your best customers into your best marketing.', bg: '#F7EBEB', accent: '#A43D3D',
    icon: <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 18.2 6.2 21.8l1.1-6.4L2.6 9.8l6.5-.9L12 3z" />,
  },
  {
    num: '06', name: 'Business Advisory', desc: 'Strategy, KPIs, and growth planning — the fractional CMO layer that ties it all together.', bg: '#EBEFF7', accent: '#3D4FA4',
    icon: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" /></>,
  },
]

const stats = [
  { value: '3×', label: 'Average ROI vs. traditional agency', bg: '#8B5CF6', text: '#ffffff' },
  { value: '48h', label: 'Onboarding within 48 hours of purchase', bg: '#0D0D0D', text: '#ffffff' },
  { value: '$0', label: 'Percentage-of-spend fees. Ever.', bg: '#F3EBFF', text: '#0D0D0D' },
  { value: '6', label: 'Full service pillars in every retainer', bg: '#E9D5FF', text: '#0D0D0D' },
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
            <div className="inline-flex items-center gap-2 bg-[#E9D5FF] text-[#6D28D9] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span className="font-body text-xs font-medium tracking-wide">The End of Agency Bloat</span>
            </div>
            <h1 className="hero-heading text-[34px] sm:text-[52px] md:text-[68px] lg:text-[72px] text-[#0D0D0D] mb-8 leading-[0.95]">
              AI killed the agency.{' '}
              <span className="accent" style={{ color: '#6BAD3D' }}>Good.</span>
            </h1>
            <p className="font-body text-lg text-[#6B6560] max-w-md mb-10 leading-relaxed">
              You were never paying for strategy — you were paying for bloat. AI now handles the technical work at speed. Hewn Life brings what AI can&apos;t: thirty years of taste, trend instinct, and the vision to see what&apos;s coming before your competitors do.
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
                  <span className="flex items-center gap-1.5 bg-[#E9D5FF] text-[#6D28D9] rounded-full px-2.5 py-1 text-[10px] font-body font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
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
          </div>
        </div>
      </section>

      {/* ── TECH BAR ── */}
      <section className="border-y border-black/[0.06] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-black/30 text-center mb-8">Powered by the world's leading AI</p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
            {[
              { src: 'https://res.cloudinary.com/dsx2wcqte/image/upload/v1780109018/Claude_AI_logo.svg_geitmu.png', alt: 'Claude' },
              { src: 'https://res.cloudinary.com/dsx2wcqte/image/upload/v1780109018/Perplexity_AI_logo.svg_te7lsp.png', alt: 'Perplexity' },
              { src: 'https://res.cloudinary.com/dsx2wcqte/image/upload/v1780109018/Manus_logo.svg_ddlqef.png', alt: 'Manus' },
              { src: 'https://res.cloudinary.com/dsx2wcqte/image/upload/v1780109018/ElevenLabs_logo_gan9qq.png', alt: 'ElevenLabs' },
              { src: 'https://res.cloudinary.com/dsx2wcqte/image/upload/v1780109018/descript_gvxnku.png', alt: 'Descript' },
            ].map(logo => (
              <div key={logo.alt} className="relative h-7 w-28 grayscale opacity-40 hover:opacity-70 hover:grayscale-0 transition-all duration-300">
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col justify-between min-h-[140px]" style={{ background: s.bg }}>
              <p className="font-display font-bold text-[32px] md:text-[44px] leading-none" style={{ color: s.text }}><CountUp value={s.value} /></p>
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
            <h2 className="font-display font-bold text-[26px] md:text-[40px] leading-tight text-[#0D0D0D] mb-6">
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
            <h2 className="font-display font-bold text-[28px] md:text-[44px] leading-tight text-[#0D0D0D]">
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
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#ffffff' }}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    {p.icon}
                  </svg>
                </div>
                <span className="font-display font-bold text-[32px] leading-none" style={{ color: p.accent + '33' }}>{p.num}</span>
              </div>
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
            <p className="font-display font-bold text-[44px] md:text-[64px] text-[#6BAD3D] leading-none mb-6">&ldquo;</p>
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

      {/* ── COMPARISON ── */}
      <section className="py-16 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E9D5FF] text-[#6D28D9] rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="font-body text-xs font-medium tracking-wide">The Numbers</span>
          </div>
          <h2 className="font-display font-bold text-[36px] md:text-[44px] text-[#0D0D0D] leading-tight">
            What this costs at a <span className="accent" style={{ color: '#6BAD3D' }}>traditional agency.</span>
          </h2>
        </div>

        <div className="rounded-3xl border border-black/[0.08] overflow-hidden">
          {/* Column header — desktop only */}
          <div className="hidden sm:grid grid-cols-[1fr_180px_150px] px-7 py-4 bg-[#F7F6F3] border-b border-black/[0.06]">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-black/40">Service</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-black/40 text-right">Traditional</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8B5CF6] text-right">Hewnlife</span>
          </div>

          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 sm:grid sm:grid-cols-[1fr_180px_150px] px-5 sm:px-7 py-4 sm:py-[18px] border-b border-black/[0.05]"
            >
              <span className="font-body text-sm md:text-[15px] text-[#0D0D0D] font-medium flex-1 min-w-0">{row.service}</span>
              {/* Mobile: stack traditional above Included. Desktop: separate columns */}
              <div className="flex flex-col items-end gap-0.5 sm:contents">
                <span className="font-body text-[13px] sm:text-sm text-black/35 line-through text-right whitespace-nowrap">{row.traditional}</span>
                <span className="flex items-center justify-end gap-1.5 text-[#6BAD3D] whitespace-nowrap">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className="font-body text-sm font-medium">Included</span>
                </span>
              </div>
            </div>
          ))}

          {/* Total row */}
          <div className="flex items-center justify-between gap-4 sm:grid sm:grid-cols-[1fr_180px_150px] px-5 sm:px-7 py-5 sm:py-6 bg-[#0D0D0D]">
            <span className="font-body font-semibold text-sm text-white flex-1 min-w-0">Total</span>
            <div className="flex flex-col items-end gap-0.5 sm:contents">
              <span className="font-body text-[13px] sm:text-sm text-white/30 line-through text-right whitespace-nowrap">$20k–$50k+/mo</span>
              <span className="font-display font-bold text-[15px] text-[#6BAD3D] text-right whitespace-nowrap">$2,500/mo</span>
            </div>
          </div>
        </div>

        <p className="text-center font-body text-sm text-[#6B6560] mt-6">
          Everything above. One flat monthly fee. <span className="text-[#8B5CF6] font-medium">No percentage of spend, ever.</span>
        </p>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Left — copy on purple */}
          <div className="bg-[#8B5CF6] p-12 md:p-16 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 mb-6">Get Started</p>
              <h2 className="font-display font-bold text-[26px] md:text-[40px] leading-tight text-white mb-6">
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
