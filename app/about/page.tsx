import type { Metadata } from 'next'
import CtaBanner from '@/components/CtaBanner'
import HybridInfographic from '@/components/HybridInfographic'
import Terrain from '@/components/strata/Terrain'
import Photo from '@/components/strata/Photo'
import { Glyph } from '@/components/strata/Glyph'
import { PageHero, SectionHead, ForestBand, h2Class } from '@/components/strata/Page'
import { colors, type GlyphKey } from '@/lib/strata'

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

const principles: { num: string; title: string; desc: string; glyph: GlyphKey }[] = [
  { num: '01', glyph: 'brand', title: 'Human taste above all', desc: 'AI amplifies our work. It never replaces the judgment, taste and empathy that great marketing demands.' },
  { num: '02', glyph: 'creative', title: 'Right tool, right task', desc: "We don't force AI where human judgment is irreplaceable, and we don't spend human hours on work machines do better." },
  { num: '03', glyph: 'data', title: 'Radical transparency', desc: 'Flat fees. Clear deliverables. No hidden percentages or inflated retainers covering under-used agency headcount.' },
  { num: '04', glyph: 'media', title: 'Speed without shortcuts', desc: 'AI compresses timelines dramatically, but every output goes through strategic review before it reaches you.' },
  { num: '05', glyph: 'creators', title: 'Specialist depth on demand', desc: 'When a project calls for a specific creative voice or technical skill, we bring in the right specialist, not a generalist.' },
]

const teamNodes = [
  { role: 'Senior strategist', owns: 'Brand positioning, campaign architecture, client advisory', type: 'Human' },
  { role: 'Creative director', owns: 'Visual identity, narrative, emotional tone', type: 'Human' },
  { role: 'AI research engine', owns: 'Market analysis, competitive intel, trend mapping', type: 'AI' },
  { role: 'AI production layer', owns: 'Content at scale, copy variations, SEO drafts', type: 'AI' },
  { role: 'Specialist network', owns: 'Photography, development, media buying, recruited per project', type: 'On demand' },
]

const typeStyle: Record<string, string> = {
  Human: 'bg-forest text-mist',
  AI: 'bg-lime text-forest',
  'On demand': 'bg-sand text-ink',
}

export default function About() {
  return (
    <div className="bg-bone text-ink">
      <PageHero
        pill="Our methodology"
        title={<>Built for the era where <em className="accent text-lime">intelligence</em> is the advantage.</>}
        lede="We are a hybrid marketing team: senior strategists, specialist creatives and AI systems, working in a model designed to deliver top-tier agency quality at a fraction of the overhead."
        scene="woodgrain" seed={44}
      />

      {/* ── THE MODEL ── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
        <div>
          <SectionHead
            pill="How we're built"
            title="The best agencies of the next decade won't look like the last one."
            className="!mb-6"
          />
          <p className="mb-4 font-body text-ink/70">
            Traditional agencies carry enormous overhead: layers of account management, under-used staff and inflated retainers. You pay for the building, not the output.
          </p>
          <p className="font-body text-ink/70">
            We built a different model. Senior strategists own the work that needs taste and judgment. AI systems handle the volume, velocity and analysis that doesn&apos;t. When a project demands a specialist skill, we recruit it rather than carry it all year.
          </p>
        </div>
        <div className="grid gap-2.5">
          {teamNodes.map(node => (
            <div key={node.role} className="flex items-start justify-between gap-4 rounded-[18px] border border-ink/[0.08] bg-white p-5">
              <div>
                <p className="font-display text-base font-medium">{node.role}</p>
                <p className="mt-1 font-body text-sm text-ink/70">{node.owns}</p>
              </div>
              <span className={`flex-shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${typeStyle[node.type]}`}>{node.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HYBRID ADVANTAGE ── */}
      <section className="pb-24">
        <div className="px-5"><SectionHead center pill="The hybrid advantage" title="Where every task goes, and why." lede="AI handles scale and speed. People own strategy and taste. Specialists deliver depth. Clients get all three." /></div>
        <HybridInfographic />
      </section>

      {/* ── PRINCIPLES ── */}
      <ForestBand>
        <div className="mb-10 grid items-end gap-8 lg:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">What we stand for</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>Five principles behind every decision.</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.num} className={`flex min-h-[220px] flex-col gap-2.5 rounded-[22px] p-[22px] ${i === 0 ? 'bg-lime text-forest' : 'border border-mist/[0.06] bg-forest-2'}`}>
              <div className="flex items-start justify-between">
                <Glyph name={p.glyph} fg={i === 0 ? colors.forest : colors.mist} accent={i === 0 ? colors.forest : colors.lichen} />
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${i === 0 ? 'border-forest/35' : 'border-mist/30 text-mist/85'}`}>{p.num}</span>
              </div>
              <h3 className="mt-auto font-display text-[19px] font-medium">{p.title}</h3>
              <p className={`font-body text-sm ${i === 0 ? 'text-forest/80' : 'text-mist/70'}`}>{p.desc}</p>
            </div>
          ))}
        </div>
      </ForestBand>

      {/* ── NAME ── */}
      <section className="mx-auto grid max-w-7xl items-stretch gap-3.5 px-5 py-24 lg:grid-cols-2">
        <div className="relative isolate min-h-[320px] overflow-hidden rounded-[32px]">
          <Terrain scene="valley" seed={27} className="-z-10" />
        </div>
        <div className="flex flex-col justify-center rounded-[32px] border border-ink/[0.08] bg-white p-8 sm:p-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">The name</span>
          <blockquote className={`${h2Class} mt-4 text-[clamp(26px,2.8vw,38px)]`}>
            &ldquo;Hewn&rdquo; is the work of taking raw material and carving out something truly beautiful and valuable.
          </blockquote>
          <p className="mt-6 font-body text-ink/70">That is the job: take what your business already has, cut away what isn&apos;t working, and build the rest in layers that hold.</p>
        </div>
      </section>

      {/* ── CRAFT ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid gap-3 sm:grid-cols-3">
          {([
            ['clayHands', 'Shaped', 'Raw material, worked by hand until it holds its form.'],
            ['woodCarving', 'Carved', 'Everything that isn’t the business, cut away.'],
            ['leatherArtisan', 'Finished', 'Built to last, and to be used every day.'],
          ] as const).map(([name, word, line]) => (
            <figure key={name}>
              <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[22px] bg-sand">
                <Photo name={name} w={480} h={600} sizes="(min-width: 640px) 33vw, 100vw" film />
              </div>
              <figcaption className="mt-3.5 font-body text-sm text-ink/70"><em className="accent mr-1.5 text-lg text-forest">{word}.</em>{line}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CtaBanner headline="Ready to carve out something beautiful?" body="Book a free 30-minute discovery call. No pitch decks, no pressure. Just a direct conversation about your business and what's possible." />
    </div>
  )
}
