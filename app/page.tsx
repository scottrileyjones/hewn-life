import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import CalButton from '@/components/CalButton'
import Link from 'next/link'

const pillars = [
  { num: '01', name: 'BRAND FOUNDATION', desc: 'Identity, voice, and positioning — the strategic bedrock everything else is built on.' },
  { num: '02', name: 'DIGITAL PRESENCE', desc: 'Website, SEO, and maps — your complete digital footprint, owned and optimized.' },
  { num: '03', name: 'LEAD & REVENUE ENGINE', desc: 'Paid media, funnels, and automation — systems that turn attention into revenue.' },
  { num: '04', name: 'CUSTOMER EXPERIENCE', desc: 'Scheduling, follow-up, and retention — the systems that turn buyers into loyal customers.' },
  { num: '05', name: 'REPUTATION & SOCIAL PROOF', desc: 'Reviews, UGC, and referrals — turning your best customers into your best marketing.' },
  { num: '06', name: 'BUSINESS ADVISORY', desc: 'Strategy, KPIs, and growth planning — the fractional CMO layer that ties it all together.' },
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
    <>
      {/* Hero */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden grain-overlay pt-20"
        style={{
          background: `
            radial-gradient(ellipse at 60% 40%, rgba(124,181,80,0.13) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 70%, rgba(74,83,72,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(124,181,80,0.06) 0%, transparent 45%),
            #1A1815
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="The AI-Era Marketing Agency" />
          </div>
          <h1 className="hero-heading text-[56px] md:text-[80px] lg:text-[96px] text-cream mb-8 max-w-4xl mx-auto animate-fade-up delay-1">
            Marketing isn&apos;t a line item.<br className="hidden md:block" /> It&apos;s the <em style={{color: '#7CB550'}}>life</em> of your business.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl mx-auto mb-12 animate-fade-up delay-2 leading-relaxed">
            Hewn Life combines thirty years of human business acumen with the speed and scale of AI to carve out something truly beautiful and valuable for your brand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-3">
            <CalButton className="bg-ember text-iron font-body font-medium px-8 py-4 rounded-full hover:brightness-110 hover:scale-[1.02] transition-all duration-300">
              Book a Discovery Call
            </CalButton>
            <Link href="/how-it-works" className="text-cream font-body font-medium px-8 py-4 rounded-full hover:underline underline-offset-4 flex items-center gap-2">
              See Our Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Logo bar */}
      <section className="bg-moss py-12 border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-ash text-center mb-8">
            Trusted by growth-minded businesses
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-24 h-8 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* Disruption Statement */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="font-display font-bold text-[120px] leading-none text-ember">3x</p>
              <p className="font-body text-sm text-slate mt-2">average ROI vs. traditional agency model</p>
            </div>
            <div>
              <SectionEyebrow text="What Makes Us Different" light />
              <h2 className="font-display font-medium text-[40px] leading-tight text-ink mb-6">
                Premium, full-service marketing at a fraction of the traditional cost.
              </h2>
              <p className="font-body text-base text-slate max-w-lg mb-8 leading-relaxed">
                Traditional agencies carry massive overhead, opaque retainers, and percentage-of-spend fees that punish your growth. Hewn Life was built to disrupt that. Flat fees. Full transparency. Zero percentage-of-spend.
              </p>
              <Link href="/pricing" className="font-body text-sm text-ember hover:underline underline-offset-4">
                See How We Price It →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Six Pillars */}
      <section className="py-24 md:py-32" style={{background: "radial-gradient(ellipse at 50% 50%, rgba(74,83,72,0.5) 0%, transparent 70%), #1A1815"}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="How We Work" />
            <h2 className="font-display font-normal italic text-[48px] leading-tight text-cream mb-6">
              Six pillars. One mission.
            </h2>
            <p className="font-body text-base text-ash max-w-2xl mx-auto">
              We operate as your fractional CMO and growth partner — embedded in your business, invested in the outcome, building systems that outlast any single campaign.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 hover:border-moss/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <p className="font-display font-bold text-[48px] text-ember/20 leading-none mb-4">{pillar.num}</p>
                <p className="font-body font-semibold text-[13px] uppercase tracking-wider text-cream mb-3">{pillar.name}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="font-display text-[80px] leading-none text-ember/20 mb-4">&ldquo;</p>
          <blockquote className="font-display font-normal italic text-[32px] leading-snug text-ink mb-10">
            Hewn Life didn&apos;t just run our marketing. They rebuilt how we think about our business.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-oat border border-black/10" />
            <div className="text-left">
              <p className="font-body font-semibold text-sm text-ink">Jane Smith</p>
              <p className="font-body text-sm text-slate">Owner, Acme Roofing Co.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Numbers */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="The Numbers Don't Lie" />
            <h2 className="font-display font-normal text-[44px] leading-tight text-cream">
              What this would cost at a traditional agency.
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Service Category</th>
                  <th className="text-left py-4 pr-8 font-body text-[11px] uppercase tracking-[0.1em] text-ash font-normal">Traditional Agency</th>
                  <th className="text-left py-4 font-body text-[11px] uppercase tracking-[0.1em] text-ember font-normal">Hewn Life Gold</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.08]">
                    <td className="py-4 pr-8 font-body text-sm text-cream">{row.service}</td>
                    <td className="py-4 pr-8 font-body text-sm text-ash">{row.traditional}</td>
                    <td className="py-4 font-body text-sm text-ember">{row.hewn}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-moss/30">
                  <td className="py-6 font-body font-semibold text-sm text-cream">TOTAL</td>
                  <td className="py-6 font-body font-semibold text-sm text-ash">$20,000–$50,000+/mo</td>
                  <td className="py-6 font-body font-semibold text-sm text-ember">$9,500/month</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
