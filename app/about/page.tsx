import type { Metadata } from 'next'
import SectionEyebrow from '@/components/SectionEyebrow'
import CtaBanner from '@/components/CtaBanner'
import HybridInfographic from '@/components/HybridInfographic'

export const metadata: Metadata = {
  title: 'About Hewn Life — Our Story & Philosophy',
  description: 'Hewn Life was built on 30 years of real business experience. We combine deep human strategy with AI-era speed to deliver marketing most agencies can\'t match at any price.',
  alternates: { canonical: 'https://www.hewn.life/about' },
  openGraph: {
    title: 'About Hewn Life — Our Story & Philosophy',
    description: 'Hewn Life was built on 30 years of real business experience. We combine deep human strategy with AI-era speed to deliver marketing most agencies can\'t match at any price.',
    url: 'https://www.hewn.life/about',
  },
}

const principles = [
  {
    num: '01',
    title: 'Human Taste Above All',
    desc: 'AI amplifies our work — it never replaces the judgment, taste, and empathy that great marketing demands.',
  },
  {
    num: '02',
    title: 'Right Tool, Right Task',
    desc: "We don't force AI where human judgment is irreplaceable, and we don't waste human hours on work machines do better.",
  },
  {
    num: '03',
    title: 'Radical Transparency',
    desc: 'Flat fees. Clear deliverables. No hidden percentages or inflated retainers covering under-utilized agency headcount.',
  },
  {
    num: '04',
    title: 'Speed Without Shortcuts',
    desc: 'AI compresses timelines dramatically — but every output goes through strategic review before it reaches you.',
  },
  {
    num: '05',
    title: 'Specialist Depth On Demand',
    desc: 'When a project calls for a specific creative voice or technical skill, we bring in the right specialist — not a generalist.',
  },
]

const teamNodes = [
  {
    role: 'Senior Strategist',
    owns: 'Brand positioning, campaign architecture, client advisory',
    type: 'human',
  },
  {
    role: 'Creative Director',
    owns: 'Visual identity, narrative, emotional tone',
    type: 'human',
  },
  {
    role: 'AI Research Engine',
    owns: 'Market analysis, competitive intel, trend mapping',
    type: 'ai',
  },
  {
    role: 'AI Production Layer',
    owns: 'Content at scale, copy variations, SEO drafts',
    type: 'ai',
  },
  {
    role: 'Specialist Network',
    owns: 'Photography, dev, media buying — recruited per project',
    type: 'flex',
  },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="flex items-start md:items-end pt-20 md:pt-40 pb-16 md:pb-24 relative overflow-hidden" style={{background: `radial-gradient(ellipse at 70% 30%, rgba(124,181,80,0.10) 0%, transparent 55%), #1A1815`}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-fade-up">
            <SectionEyebrow text="Our Methodology" />
          </div>
          <h1 className="hero-heading fluid-hero text-cream max-w-4xl mb-8 animate-fade-up delay-1">
            Built for the era where <span style={{color: '#7CB550'}} className="accent">intelligence</span> is the advantage.
          </h1>
          <p className="font-body text-lg text-ash max-w-2xl animate-fade-up delay-2 leading-relaxed">
            We are a hybrid marketing team — senior strategists, specialist creatives, and AI systems working in a model designed to deliver the quality of a top-tier agency at a fraction of the overhead.
          </p>
        </div>
      </section>

      {/* The model explained */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <SectionEyebrow text="How We're Built" light />
              <h2 className="font-display font-medium fluid-h2 leading-tight text-ink mb-6">
                The best agencies of the next decade won't look like the last one.
              </h2>
              <p className="font-body text-base text-slate leading-relaxed mb-4">
                Traditional agencies carry enormous overhead — layers of account management, underutilized staff, and inflated retainers. You pay for the building, not the output.
              </p>
              <p className="font-body text-base text-slate leading-relaxed">
                We built a different model. Senior strategists own the work that requires taste and judgment. AI systems handle the volume, velocity, and analysis work that doesn't. And when a project demands a specific specialist skill, we recruit it — rather than employing it at cost all year.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {teamNodes.map((node) => (
                <div
                  key={node.role}
                  className="flex items-start gap-4 rounded-xl border p-5"
                  style={{
                    borderColor: node.type === 'ai' ? 'rgba(124,181,80,0.25)' : node.type === 'flex' ? 'rgba(168,159,146,0.3)' : 'rgba(74,83,72,0.25)',
                    background: node.type === 'ai' ? 'rgba(124,181,80,0.04)' : node.type === 'flex' ? 'rgba(168,159,146,0.05)' : 'rgba(74,83,72,0.04)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ background: node.type === 'ai' ? '#7CB550' : node.type === 'flex' ? '#A89F92' : '#4A5348' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body font-semibold text-[13px] text-ink">{node.role}</p>
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                        style={{
                          background: node.type === 'ai' ? 'rgba(124,181,80,0.15)' : node.type === 'flex' ? 'rgba(168,159,146,0.15)' : 'rgba(74,83,72,0.12)',
                          color: node.type === 'ai' ? '#4A5348' : node.type === 'flex' ? '#6B6560' : '#4A5348',
                        }}
                      >
                        {node.type === 'ai' ? 'AI' : node.type === 'flex' ? 'On-demand' : 'Human'}
                      </span>
                    </div>
                    <p className="font-body text-[12px] text-slate leading-relaxed">{node.owns}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WSJ-style Infographic */}
      <section className="bg-[#F8F5EF] py-24 md:py-32 border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-6">
            <SectionEyebrow text="The Hybrid Advantage" light />
            <h2 className="font-display font-medium fluid-h2 leading-tight text-ink mb-4">
              Where every task goes — and why.
            </h2>
            <p className="font-body text-base text-slate max-w-xl mx-auto">
              This is how we allocate work across the team. AI handles scale and speed. Humans own strategy and taste. Specialists deliver depth. Clients get all three.
            </p>
          </div>
          <HybridInfographic />
        </div>
      </section>

      {/* Principles */}
      <section className="bg-[#4A5348] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <SectionEyebrow text="What We Stand For" />
            <h2 className="font-display font-bold fluid-h2 leading-tight text-cream">
              Five principles that drive every decision.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div key={p.num} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
                <p className="font-display font-bold text-[48px] text-[#7CB550]/20 leading-none mb-4">{p.num}</p>
                <p className="font-body font-semibold text-[13px] text-cream mb-3">{p.title}</p>
                <p className="font-body text-sm text-ash leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy pull-quote */}
      <section className="bg-bone py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <blockquote className="font-display font-medium fluid-h3 leading-snug text-ink mb-8">
            &ldquo;The name &lsquo;Hewn&rsquo; reflects the meticulous process of taking raw material and carving out something truly beautiful and valuable.&rdquo;
          </blockquote>
          <p className="font-body text-sm text-slate">— Hewn Life</p>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
