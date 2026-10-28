import CalButton from '@/components/CalButton'
import Link from 'next/link'
import Image from 'next/image'
import CountUp from '@/components/CountUp'
import Pill, { PillarIcon } from '@/components/Pill'
import PricingTeaser from '@/components/PricingTeaser'
import HomeFaq from '@/components/HomeFaq'
import { pillars, funnel } from '@/lib/services'

const CDN = 'https://res.cloudinary.com/dsx2wcqte/image/upload'
const PHOTOS = {
  hero:        `${CDN}/f_auto,q_auto,w_2400,h_1500,c_fill,g_auto/v1779578220/main-sample.png`,
  heroMobile:  `${CDN}/f_auto,q_auto,w_900,h_1300,c_fill,g_auto/v1779578220/main-sample.png`,
  strategy:    `${CDN}/f_auto,q_auto,w_1600,h_1000,c_fill/v1780097466/yolk-coworking-krakow-uuX7TG5Iyg0-unsplash_zfxcwz.jpg`,
  testimonial: `${CDN}/f_auto,q_auto,w_900,h_900,c_fill/v1780097464/soundtrap-c_S99FlDqSw-unsplash_mtpxgd.jpg`,
  cta:         `${CDN}/f_auto,q_auto,w_2400,h_1200,c_fill/v1780097464/collabstr-bM2nm41YaeA-unsplash_gspy6l.jpg`,
}

const LOGOS = [
  { src: `${CDN}/v1780109018/Claude_AI_logo.svg_geitmu.png`, alt: 'Claude' },
  { src: `${CDN}/v1780109018/Perplexity_AI_logo.svg_te7lsp.png`, alt: 'Perplexity' },
  { src: `${CDN}/v1780109018/Manus_logo.svg_ddlqef.png`, alt: 'Manus' },
  { src: `${CDN}/v1780109018/ElevenLabs_logo_gan9qq.png`, alt: 'ElevenLabs' },
  { src: `${CDN}/v1780109018/descript_gvxnku.png`, alt: 'Descript' },
]

const stats = [
  { value: '3×', label: 'Average ROI vs. traditional agency' },
  { value: '48h', label: 'Onboarding after you sign' },
  { value: '$0', label: 'Percentage-of-spend fees. Ever.' },
  { value: '9', label: 'Pillars in one engine' },
]

const comparisonRows = [
  { service: 'Brand Strategy & Identity', traditional: '$15,000–$50,000 project' },
  { service: 'Website Design & Development', traditional: '$15,000–$40,000 project' },
  { service: 'Paid Media Management', traditional: '$3,000–$10,000/mo + 15%' },
  { service: 'SEO, AEO & Content', traditional: '$3,000–$8,000/month' },
  { service: 'Lifecycle, CRM & Automation', traditional: '$5,000–$15,000 setup' },
  { service: 'Social & Creator Programs', traditional: '$2,000–$5,000/month' },
  { service: 'Strategic Advisory / CMO', traditional: '$5,000–$15,000/month' },
]

/** Floating glass card that sits over the hero photography. */
function SnapshotCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl p-4 backdrop-blur-md ${className}`}
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">Growth engine · this month</p>
        <span className="animate-live-pulse flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-body font-semibold text-white" style={{ background: 'rgba(139,92,246,0.6)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-white" />Live
        </span>
      </div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="font-body text-[10px] text-white/50">Revenue attributed</p>
          <p className="font-display font-bold text-2xl leading-none text-white mt-1">$48,200</p>
        </div>
        <span className="font-body text-xs font-semibold text-ember">▲ 34%</span>
      </div>
      <div className="flex items-end gap-1 h-8 mb-3">
        {[30, 52, 44, 70, 58, 85, 100].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? '#6BAD3D' : `rgba(107,173,61,${0.2 + i * 0.1})` }} />
        ))}
      </div>
      <div className="flex gap-5 pt-3 border-t border-white/10">
        {[{ label: 'Leads', value: '142' }, { label: 'ROAS', value: '4.8×' }, { label: 'CAC', value: '$112' }].map(m => (
          <div key={m.label}>
            <p className="font-body text-[9px] text-white/50">{m.label}</p>
            <p className="font-body font-semibold text-xs text-white">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-bone">

      {/* ── HERO: full-bleed cinematic ── */}
      <section className="relative min-h-[100dvh] lg:min-h-[92vh] flex flex-col justify-end overflow-hidden bg-iron text-white viewport-fill">
        <Image src={PHOTOS.hero} alt="Hewn Life creative at work" fill priority sizes="100vw" className="hidden md:block object-cover object-[70%_30%]" />
        <Image src={PHOTOS.heroMobile} alt="Hewn Life creative at work" fill priority sizes="100vw" className="md:hidden object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-iron via-iron/55 to-iron/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-iron/85 via-iron/30 to-transparent" />

        <div className="relative max-w-7xl w-full mx-auto px-6 lg:px-12 pb-12 lg:pb-20 pt-28">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
            <div className="animate-fade-up">
              <Pill dark>The end of agency bloat</Pill>
              <h1 className="hero-heading text-[clamp(3rem,1.5rem+6vw,7rem)] leading-[0.92] mt-6">
                AI killed the agency. <span className="accent text-ember">Good.</span>
              </h1>
              <p className="font-body text-base lg:text-lg text-white/70 max-w-md mt-6 leading-relaxed">
                Senior strategy, an AI-native creative line and a live growth dashboard. One flat fee, nine pillars, zero bloat.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <CalButton className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition">
                  Book a Discovery Call
                </CalButton>
                <Link href="/dashboard" className="inline-flex items-center justify-center bg-white/10 backdrop-blur border border-white/20 text-white font-body font-medium px-7 py-3.5 rounded-full hover:bg-white/20 transition">
                  See a live dashboard
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-end animate-fade-up delay-3">
              <SnapshotCard className="w-[340px]" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 mt-14 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>↓</span> Scroll
          </div>
        </div>
      </section>

      {/* ── IMPACT + STATS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">
          <div className="rounded-[2rem] bg-white border border-black/[0.06] p-6 order-2 lg:order-1">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] bg-ember/25 text-moss rounded-full px-3 py-1">Q3 2026</span>
              <span className="font-display font-bold text-5xl text-iron leading-none">+90%</span>
            </div>
            <div className="mt-6 rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(160deg, #3D4A3F 0%, #0D0D0D 100%)' }}>
              <p className="font-body text-[11px] text-white/50">Booked revenue</p>
              <p className="font-display font-semibold text-lg">Jul – Sep</p>
              <svg viewBox="0 0 200 70" className="w-full h-20 mt-2" aria-hidden="true">
                <path d="M0 60 C 30 55, 45 50, 65 42 S 100 38, 120 28 S 160 18, 200 6" fill="none" stroke="#6BAD3D" strokeWidth="2.5" />
                <path d="M0 64 C 40 62, 70 58, 100 52 S 160 44, 200 38" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 4" />
              </svg>
              <div className="flex justify-between font-body text-[10px] text-white/40 mt-1"><span>Hewn engine</span><span>Previous agency</span></div>
            </div>
            <p className="font-display font-semibold text-center text-iron mt-5">Illustrative client trajectory</p>
          </div>

          <div className="order-1 lg:order-2">
            <Pill>Impact</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-5 leading-tight">
              Smarter growth decisions with a team that <span className="text-ash">out-produces an agency, not out-spends it.</span>
            </h2>
            <p className="font-body text-base text-slate mt-5 max-w-xl leading-relaxed">
              The cost of producing creative has collapsed while the cost of attention keeps rising. The edge now is velocity, trust and retention, run by people who answer to a number.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-black/[0.08]">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="font-display font-semibold text-4xl text-iron leading-none"><CountUp value={s.value} /></p>
                  <p className="font-body text-xs text-slate mt-2 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ── */}
      <section className="border-y border-black/[0.06] py-8 overflow-hidden">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 text-center mb-6">Built on the world&apos;s leading AI</p>
        <div className="ticker-track flex items-center gap-16">
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <div key={i} className="relative h-7 w-28 flex-shrink-0 grayscale opacity-40">
              <Image src={logo.src} alt={i < LOGOS.length ? logo.alt : ''} fill sizes="112px" className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* ── NINE PILLARS (bento) ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Pill>The growth engine</Pill>
          <h2 className="font-display font-bold fluid-h2 text-iron mt-5">One engine. Nine pillars.</h2>
          <p className="font-body text-base text-slate mt-4">Every pillar runs as a playbook with an owner, a weekly cadence and the number it answers to.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pillars.map((p, i) => {
            const featured = i === 0
            return (
              <Link
                key={p.slug}
                href={`/services/${p.slug}`}
                className={`group rounded-3xl p-6 flex flex-col min-h-[190px] transition-all hover:-translate-y-0.5 ${
                  featured ? 'text-white' : 'bg-white border border-black/[0.06] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
                }`}
                style={featured ? { background: 'linear-gradient(150deg, #3D4A3F 0%, #0D0D0D 100%)' } : undefined}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${featured ? 'bg-white/10' : ''}`} style={featured ? undefined : { background: p.tint }}>
                  <PillarIcon paths={p.icon} color={featured ? '#6BAD3D' : p.accent} />
                </span>
                <h3 className={`font-display font-semibold text-base mt-5 ${featured ? 'text-white' : 'text-iron'}`}>{p.name}</h3>
                <p className={`font-body text-sm leading-relaxed mt-1.5 ${featured ? 'text-white/65' : 'text-slate'}`}>{p.summary}</p>
                <span className={`font-body text-xs font-medium mt-auto pt-4 ${featured ? 'text-ember' : 'text-iron/40 group-hover:text-ember'} transition-colors`}>Playbook →</span>
              </Link>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="inline-flex items-center justify-center border border-black/15 text-iron font-body font-medium px-7 py-3.5 rounded-full hover:border-black/40 transition">Explore every service</Link>
        </div>
      </section>

      {/* ── CINEMATIC BREAK + DASHBOARD ── */}
      <section className="relative overflow-hidden bg-iron text-white">
        <Image src={PHOTOS.strategy} alt="Strategy session" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-iron via-iron/70 to-iron" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <Pill dark>Data &amp; attribution</Pill>
            <h2 className="font-display font-bold fluid-h2 mt-5 leading-tight">Your whole marketing function, <span className="accent text-ember">on one screen.</span></h2>
            <p className="font-body text-base text-white/65 mt-5 max-w-md leading-relaxed">
              Meta, Google and your CRM in one live dashboard. Every strategy gets a verdict (scale, watch or cut), graded against best in class, with next week&apos;s tests already written.
            </p>
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition mt-8">
              Explore the sample dashboard →
            </Link>
          </div>
          <Link href="/dashboard" className="block rounded-3xl border border-white/10 bg-[#111814]/90 p-5 shadow-2xl hover:border-ember/40 transition-colors" aria-label="Open the sample dashboard">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Executive summary</p>
            <p className="font-display font-semibold text-lg mt-1">Every platform, <span className="accent text-copper">every strategy</span></p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[['Spend', '$23.0K'], ['Booked jobs', '172'], ['Cost / job', '$134']].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                  <p className="font-body text-[10px] text-white/45">{k}</p>
                  <p className="font-display font-semibold text-lg">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { n: 'Founder-led video', w: 92, c: '#6BAD3D', v: 'Scale', vc: '#6BAD3D' },
                { n: 'Non-brand search', w: 86, c: '#3D7FA4', v: 'Scale', vc: '#6BAD3D' },
                { n: 'Seasonal offer', w: 56, c: '#B5621C', v: 'Cut or fix', vc: '#E07A5F' },
                { n: 'UGC + stories', w: 43, c: '#8B5CF6', v: 'Watch', vc: '#E0B84C' },
              ].map(r => (
                <div key={r.n} className="grid grid-cols-[110px_1fr_70px] items-center gap-3 font-body text-[11px]">
                  <span className="text-white/75 truncate">{r.n}</span>
                  <span className="h-1.5 rounded-full" style={{ width: `${r.w}%`, background: r.c }} />
                  <span className="text-right" style={{ color: r.vc }}>● {r.v}</span>
                </div>
              ))}
            </div>
          </Link>
        </div>
      </section>

      {/* ── FUNNEL ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Pill dot="#8B5CF6">How it runs</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-5 max-w-xl">Every dollar runs a tested funnel.</h2>
          </div>
          <p className="font-body text-base text-slate max-w-sm">We ship 20+ fresh variants a week across ads, pages and quizzes. Winners scale, losers die.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {funnel.map((f, i) => (
            <div key={f.name} className="rounded-3xl p-6 min-h-[200px] flex flex-col" style={{ background: f.bg, color: f.fg }}>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">{f.stage}</p>
                <span className="font-mono text-xs opacity-50">0{i + 1}</span>
              </div>
              <p className="font-display font-semibold text-2xl mt-3">{f.name}</p>
              <p className="font-body text-sm opacity-75 mt-2">{f.goal}</p>
              <p className="font-body text-xs opacity-60 mt-auto pt-6">{f.benchmark}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="bg-white border-y border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Pill>Pricing plans</Pill>
            <h2 className="font-display font-bold fluid-h2 text-iron mt-5">Simple pricing. No hidden fees.</h2>
            <p className="font-body text-base text-slate mt-4">One flat monthly fee. Never a percentage of your ad spend.</p>
          </div>
          <PricingTeaser />
          <div className="mt-6 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 text-white" style={{ background: 'linear-gradient(120deg, #3D4A3F 0%, #0D0D0D 100%)' }}>
            <div>
              <p className="font-display font-semibold text-lg">Need a one-off project?</p>
              <p className="font-body text-sm text-white/60 mt-1">Websites, brand refreshes and creative packs at flat fees. No retainer required.</p>
            </div>
            <Link href="/pricing" className="inline-flex items-center justify-center bg-white text-iron font-body font-medium text-sm px-6 py-3 rounded-full hover:bg-white/90 transition whitespace-nowrap">See à la carte</Link>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="text-center mb-10">
          <Pill dot="#8B5CF6">The numbers</Pill>
          <h2 className="font-display font-bold fluid-h2 text-iron mt-5">What this costs at a <span className="accent text-ember">traditional agency.</span></h2>
        </div>
        <div className="rounded-3xl border border-black/[0.08] overflow-hidden bg-white">
          {comparisonRows.map(row => (
            <div key={row.service} className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-black/[0.05]">
              <span className="font-body text-sm md:text-[15px] text-iron font-medium">{row.service}</span>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-8">
                <span className="font-body text-[13px] text-black/35 line-through whitespace-nowrap">{row.traditional}</span>
                <span className="font-body text-sm font-medium text-ember whitespace-nowrap sm:w-20 text-right">✓ Included</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-5 bg-iron">
            <span className="font-body font-semibold text-sm text-white">Total</span>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-8">
              <span className="font-body text-[13px] text-white/30 line-through whitespace-nowrap">$20k–$50k+/mo</span>
              <span className="font-display font-bold text-[15px] text-ember whitespace-nowrap">from $2,500/mo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Pill dot="#B5621C">Testimonials</Pill>
          <h2 className="font-display font-bold fluid-h2 text-iron mt-5">Trusted by growing businesses.</h2>
        </div>
        <div className="rounded-[2rem] bg-white border border-black/[0.06] p-3 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
          <div className="relative rounded-[1.5rem] overflow-hidden aspect-square md:aspect-auto md:min-h-[360px]">
            <Image src={PHOTOS.testimonial} alt="Client recording studio" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <p className="font-display font-bold text-5xl text-ember leading-none">&ldquo;</p>
            <blockquote className="font-display font-semibold text-2xl md:text-3xl leading-snug text-iron mt-2">
              Hewn Life didn&apos;t just run our marketing. They rebuilt how we think about our business.
            </blockquote>
            <div className="mt-8">
              <p className="font-body font-semibold text-sm text-iron">Jane Smith</p>
              <p className="font-body text-sm text-slate">Owner, Acme Roofing Co.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Pill>FAQ</Pill>
          <h2 className="font-display font-bold fluid-h2 text-iron mt-5">Frequently asked questions</h2>
          <p className="font-body text-base text-slate mt-4">Everything you need to know, answered in one place.</p>
        </div>
        <HomeFaq />
      </section>

      {/* ── CINEMATIC CTA ── */}
      <section className="relative overflow-hidden bg-iron text-white">
        <Image src={PHOTOS.cta} alt="Creator filming content" fill sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-iron via-iron/60 to-iron/30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-28 lg:py-40 text-center">
          <h2 className="hero-heading text-[clamp(2.5rem,1.5rem+4vw,5.5rem)] leading-[0.95] max-w-4xl mx-auto">
            Ready to stop paying the <span className="accent text-ember">agency tax?</span>
          </h2>
          <p className="font-body text-base lg:text-lg text-white/70 mt-6 max-w-xl mx-auto">
            Book a free 30-minute call. We&apos;ll grade your nine pillars and show you the cheapest gaps to close first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <CalButton className="inline-flex items-center justify-center bg-ember text-iron font-body font-semibold px-8 py-4 rounded-full hover:brightness-110 transition">Book a Free Call</CalButton>
            <Link href="/pricing" className="inline-flex items-center justify-center bg-white/10 backdrop-blur border border-white/25 text-white font-body font-medium px-8 py-4 rounded-full hover:bg-white/20 transition">See Pricing</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
