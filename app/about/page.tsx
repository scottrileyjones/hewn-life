import Image from 'next/image'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import CountUp from '@/components/CountUp'

const values = [
  { num: '01', title: 'Human Taste Above All', desc: 'AI amplifies our work — it never replaces the judgment, taste, and empathy that great marketing demands.' },
  { num: '02', title: 'Radical Transparency', desc: "Flat fees. Clear deliverables. No hidden percentages. You always know exactly what you're getting and what it costs." },
  { num: '03', title: 'Speed and Scale', desc: 'We move with the urgency of a startup and the precision of a seasoned agency, using AI to compress timelines without sacrificing quality.' },
  { num: '04', title: 'Psychological Nuance', desc: 'Great marketing speaks to the human behind the customer. We study behavior, motivation, and decision-making deeply.' },
  { num: '05', title: 'Craftsmanship', desc: 'Every piece of work we produce is built with intention and attention to detail — from brand strategy to a single social post.' },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-end pb-24 relative overflow-hidden pt-32" style={{background: `radial-gradient(ellipse at 70% 30%, rgba(124,181,80,0.10) 0%, transparent 55%), #1A1815`}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Our Story" />
          </div>
          <h1 className="hero-heading text-[56px] md:text-[80px] text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            We believe marketing is the <span style={{color: '#6BAD3D'}} className="accent">life</span> of your business — not an afterthought.
          </h1>
          <p className="font-body text-lg text-ash max-w-xl animate-fade-up delay-2 leading-relaxed">
            Hewn Life was built on a simple but radical conviction: premium marketing should not require a massive agency with bloated overhead and hidden fees.
          </p>
        </div>
      </section>

      {/* The Founder */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-oat border border-moss/20">
                <Image
                  src="https://res.cloudinary.com/dsx2wcqte/image/upload/dfdadb94b85aba15_xniyua"
                  alt="Scott Jones, Founder of Hewn Life"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div>
              <SectionEyebrow text="The Founder" light />
              <h2 className="font-display font-medium text-[40px] leading-tight text-ink mb-8">
                Thirty years of business. One mission.
              </h2>
              <div className="space-y-4 mb-10">
                <p className="font-body text-base text-slate leading-relaxed">
                  Scott Jones, founder of Hewn Life, brings thirty years of business acumen to every client engagement. Having built, scaled, and operated multiple companies, Scott understands that marketing is not a department — it is the living expression of your business in the world.
                </p>
                <p className="font-body text-base text-slate leading-relaxed">
                  After decades of working with agencies, freelancers, and in-house teams, Scott built Hewn Life to deliver what he always wished existed: a full-service marketing partner with the strategy of a CMO, the execution of a seasoned team, and the transparency of a trusted advisor.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { num: '30', label: 'years in business' },
                  { num: '10M+', label: 'in managed revenue' },
                  { num: '100s', label: 'of businesses advised' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="font-display font-bold text-[36px] text-amethyst"><CountUp value={stat.num} /></p>
                    <p className="font-body text-xs text-slate mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-moss py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="What We Stand For" />
            <h2 className="font-display font-bold text-[44px] leading-tight text-cream">
              Five values that drive every decision.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.num} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
                <p className="font-display font-bold text-[48px] text-ember/20 leading-none mb-4">{value.num}</p>
                <p className="font-body font-semibold text-[13px] text-cream mb-3">{value.title}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <blockquote className="font-display font-medium text-[36px] leading-snug text-ink mb-8">
            &ldquo;The name &lsquo;Hewn&rsquo; reflects the meticulous process of taking raw material and carving out something truly beautiful and valuable.&rdquo;
          </blockquote>
          <p className="font-body text-sm text-slate">— Scott Jones, Founder</p>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
