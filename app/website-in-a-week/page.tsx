import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import BuildWeek from '@/components/BuildWeek'
import CalButton from '@/components/CalButton'
import CountUp from '@/components/CountUp'
import Link from 'next/link'

export const metadata = {
  title: 'Website in a Week — Hewn Life',
  description: 'A fully functioning, custom website designed, written, built, and hosted in one week — starting at $1,000. Built for mobile and desktop. No Figma. Laser speed with AI.',
}

const included = [
  'Custom design — mobile & desktop',
  'Conversion-focused copywriting',
  'Full development & hosting',
  'A few custom features (forms, booking, galleries)',
  'SEO-ready foundation',
  'Live in 5 business days',
]

const faqs = [
  {
    q: 'How is this only $1,000?',
    a: 'AI handles the slow, repetitive work — scaffolding, layout, first-draft copy, asset generation. That collapses what used to take agencies weeks into days, so we pass the savings on. You get senior taste and judgment without the senior-agency invoice.',
  },
  {
    q: 'Do I need to provide designs or a Figma file?',
    a: 'No. There\'s no design phase to wait on. We build directly, refining the look live with you. What you see is the real, working site — not a mockup.',
  },
  {
    q: 'What happens after the week?',
    a: 'The site is hosted, live, and yours. You take over from there. If you want ongoing growth — paid media, funnels, optimization — that\'s where our other tiers come in, but there\'s zero obligation.',
  },
  {
    q: 'Is it really custom, or a template?',
    a: 'Custom. Your brand, your structure, your copy, your features. AI accelerates the build — it doesn\'t hand you someone else\'s template.',
  },
]

export default function WebsiteInAWeek() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-up max-w-3xl">
            <SectionEyebrow text="Website in a Week" light />
            <h1 className="hero-heading text-[28px] md:text-[44px] lg:text-[64px] text-[#0D0D0D] mb-6 leading-[1.04]">
              A real website.<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>In one week. $1,000.</span>
            </h1>
            <p className="font-body text-lg text-[#6B6560] max-w-xl leading-relaxed mb-4">
              Design, copy, development, and hosting — a fully functioning custom site with a few features built in, live in five business days. Built for mobile and desktop. No Figma required. Laser speed with AI.
            </p>
            <p className="font-body text-base text-[#3D3A36] max-w-xl leading-relaxed mb-10">
              We do the heavy lifting. You take it over the moment it&apos;s live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CalButton className="inline-flex items-center justify-center bg-[#0D0D0D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200">
                Start My Website
              </CalButton>
              <Link href="#how" className="inline-flex items-center justify-center border border-black/15 text-[#0D0D0D] font-body font-medium px-8 py-4 rounded-full hover:border-black/30 transition-all duration-200">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat strip ───────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '$1,000', label: 'flat. no surprises.' },
            { num: '5 days', label: 'concept to live' },
            { num: '0', label: 'figma files required' },
            { num: '100%', label: 'yours to keep' },
          ].map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="font-display text-[28px] md:text-[40px] lg:text-[52px] leading-none text-white mb-2"><CountUp value={s.num} /></p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6BAD3D]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Build Week animation ─────────────────────────────── */}
      <section id="how" className="bg-white py-24 md:py-32 px-6 lg:px-12 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionEyebrow text="The Build Week" light />
            <h2 className="hero-heading text-[36px] md:text-[52px] text-[#0D0D0D] leading-tight mt-3">
              Watch it come together.<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>Day by day.</span>
            </h2>
            <p className="font-body text-base text-[#6B6560] mt-5 leading-relaxed">
              Five days from kickoff to launch. Scroll to see each layer of the site take shape — structure, design, copy, features, and go-live.
            </p>
          </div>

          <BuildWeek />

          <div className="mt-20 flex flex-col sm:flex-row justify-center gap-3">
            <CalButton className="inline-flex items-center justify-center bg-[#0D0D0D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200">
              Start My Website
            </CalButton>
            <Link href="/pricing" className="inline-flex items-center justify-center border border-black/15 text-[#0D0D0D] font-body font-medium px-8 py-4 rounded-full hover:border-black/30 transition-all duration-200">
              See Plans & Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────────── */}
      <section className="bg-[#F9F7F3] py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-16 items-start">
          <div>
            <SectionEyebrow text="What's Included" light />
            <h2 className="hero-heading text-[24px] md:text-[36px] lg:text-[48px] text-[#0D0D0D] leading-tight mt-3 mb-5">
              Everything you need<br />
              <span className="accent" style={{ color: '#6BAD3D' }}>to go live.</span>
            </h2>
            <p className="font-body text-base text-[#6B6560] leading-relaxed max-w-md">
              One flat price. One week. A complete, working website you own outright — not a deposit on an endless retainer.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-px bg-black/[0.08] border border-black/[0.08]">
            {included.map(item => (
              <li key={item} className="bg-[#F9F7F3] p-6 flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#6BAD3D] flex items-center justify-center">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="font-body text-[15px] text-[#3D3A36] leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <SectionEyebrow text="Questions" light />
            <h2 className="hero-heading text-[24px] md:text-[36px] lg:text-[48px] text-[#0D0D0D] leading-tight mt-3">
              The honest <span className="accent" style={{ color: '#6BAD3D' }}>answers.</span>
            </h2>
          </div>
          <div className="divide-y divide-black/[0.08] border-t border-black/[0.08]">
            {faqs.map(f => (
              <div key={f.q} className="py-7">
                <p className="font-display font-semibold text-[20px] text-[#0D0D0D] mb-3">{f.q}</p>
                <p className="font-body text-[15px] text-[#6B6560] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
