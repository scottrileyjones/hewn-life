import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'
import CtaBanner from '@/components/CtaBanner'
import ProcessTimeline from '@/components/ProcessTimeline'
import Photo from '@/components/strata/Photo'

export const metadata: Metadata = {
  title: 'How Hewn Life Works — From Onboarding to Full Execution',
  description: 'We onboard in 48 hours and run your full marketing program from day one. See exactly how Hewn Life delivers — strategy, creative, paid media, SEO, and more.',
  alternates: { canonical: 'https://www.hewn.life/how-it-works' },
  openGraph: {
    title: 'How Hewn Life Works — From Onboarding to Full Execution',
    description: 'We onboard in 48 hours and run your full marketing program from day one. See exactly how Hewn Life delivers — strategy, creative, paid media, SEO, and more.',
    url: 'https://www.hewn.life/how-it-works',
    images: [ogImage],
  },
}
import CalButton from '@/components/CalButton'
import CountUp from '@/components/CountUp'
import Link from 'next/link'
import { PageHero, SectionHead, ForestBand, h2Class, btnLight, btnGlass, btnForest } from '@/components/strata/Page'
import { Check } from '@/components/strata/Glyph'

const hewnAssets = [
  'Brand strategy & positioning',
  'Logo & visual identity system',
  'Brand style guide',
  'Messaging framework & taglines',
  'Custom website design & build',
  'SEO foundation & on-page optimization',
  'Google Business Profile setup',
]

const wroughtAssets = [
  'Paid media campaigns (Google + Meta)',
  'Sales funnels & landing pages',
  'Marketing automation sequences',
  'CRM setup & pipeline management',
  'Booking & scheduling system',
  'New customer onboarding sequence',
  'Retention & re-engagement campaigns',
]

const forgedAssets = [
  'Review generation system',
  'UGC strategy & campaigns',
  'Referral program with tracking',
  'Video & written testimonial capture',
  'Monthly KPI dashboard',
  'Quarterly growth planning sessions',
  'Fractional CMO advisory layer',
]

const cadence = [
  { freq: 'Weekly',  dots: 4, title: 'Async Update',  detail: 'Every Friday',      desc: 'What was done, what\'s next, what needs your input.' },
  { freq: 'Monthly', dots: 1, title: 'KPI Report',    detail: '1st of each month', desc: 'Every metric, every channel, every trend — written clearly, not buried in slides.' },
  { freq: 'Monthly', dots: 1, title: 'Strategy Call', detail: '60 minutes',        desc: 'Where the next month\'s priorities get set, not just reported on.' },
]

export default function HowItWorks() {
  const tiers = [
    { name: 'Hewn', tier: 'Plan 01', count: hewnAssets.length, items: hewnAssets, lead: null },
    { name: 'Wrought', tier: 'Plan 02', count: hewnAssets.length + wroughtAssets.length, items: wroughtAssets, lead: 'Everything in Hewn, plus:' },
    { name: 'Forged', tier: 'Plan 03', count: hewnAssets.length + wroughtAssets.length + forgedAssets.length, items: forgedAssets, lead: 'Everything in Wrought, plus:' },
  ]

  return (
    <div className="bg-bone text-ink">
      <PageHero
        pill="How it works"
        title={<>Most agencies sell campaigns. <em className="accent text-lime">We build systems.</em></>}
        lede="We use AI to compress months of work into days, cutting cost without cutting corners. Then we add the design taste and market instinct that actually win."
        scene="topo" seed={61}
      >
        <CalButton className={btnLight}>Book a discovery call</CalButton>
        <Link href="/pricing" className={btnGlass}>See plans &amp; pricing</Link>
      </PageHero>

      {/* ── PROCESS ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHead center pill="The process" title="From first call to market leader." lede="Four phases. AI compressing every stage. A system you own at the end." />
        <ProcessTimeline />
        <div className="mt-16 flex flex-col justify-center gap-2.5 sm:flex-row">
          <CalButton className={btnForest}>Book a discovery call</CalButton>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3.5 font-body text-[15px] font-medium transition hover:border-ink/40">See plans &amp; pricing</Link>
        </div>
        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">AI-compressed timelines compared with the traditional agency average · internal benchmarks, 2024–2025</p>
      </section>

      {/* ── SESSIONS ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[32px] bg-sand text-mist lg:min-h-[520px]">
          <Photo name="teamMeeting" w={1280} h={600} sizes="(min-width: 1280px) 1240px, 100vw" className="-z-20" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.78), rgba(20,16,10,.38) 45%, rgba(20,16,10,.12) 75%), linear-gradient(0deg, rgba(20,16,10,.55), transparent 55%)' }} />
          <div className="max-w-xl p-7 sm:p-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80">Every month</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.6vw,50px)]`}>One table. <em className="accent">Every number</em> on it.</h2>
            <p className="mt-3.5 font-body text-[17px] text-mist/85">The founder walks your team through the dashboard, the verdicts and the next three tests. Decisions leave the room with an owner.</p>
          </div>
        </div>
      </section>

      {/* ── SPEED ── */}
      <ForestBand>
        <div className="mb-10 grid items-end gap-8 lg:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">AI compression</span>
            <h2 className={`${h2Class} mt-3.5 text-[clamp(30px,3.4vw,46px)]`}>What used to take weeks takes hours.</h2>
          </div>
          <p className="max-w-[32em] font-body text-mist/75 lg:justify-self-end">AI doesn&apos;t replace the strategy. It removes the delay. Every hour saved on execution goes back into the craft and judgment that move the numbers.</p>
        </div>
        <div className="overflow-hidden rounded-[22px] border border-mist/[0.1]">
          <div className="hidden bg-forest-2 px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-mist/65 sm:grid sm:grid-cols-[1fr_170px_210px]">
            <span>Task</span><span>Traditional</span><span className="text-lime">With AI</span>
          </div>
          {[
            ['Deep market and competitor analysis', 'weeks', 'hours'],
            ['Ad creative variations at scale', 'days', 'minutes'],
            ['Campaign setup and launch', 'weeks', '48 hours'],
            ['Performance reporting', 'monthly', 'real-time'],
            ['Trend and competitor monitoring', 'quarterly', 'continuous'],
            ['Ad optimization', 'manual, periodic', 'always on'],
          ].map(([task, before, after]) => (
            <div key={task} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-mist/[0.08] px-5 py-4 first-of-type:border-t-0 sm:grid sm:grid-cols-[1fr_170px_210px] sm:items-center sm:px-8 sm:py-5 sm:first-of-type:border-t">
              <span className="w-full font-body text-[15px] text-mist/90 sm:w-auto sm:pr-4 sm:text-[17px]">{task}</span>
              <span className="font-body text-[15px] text-mist/50 line-through sm:pr-3 sm:text-[16px]">{before}</span>
              <span className="font-display text-[19px] font-medium leading-tight tracking-[-0.01em] text-lime sm:text-[21px]"><span className="mr-1.5 font-body text-[15px] text-mist/40 sm:hidden">→</span>{after}</span>
            </div>
          ))}
        </div>
      </ForestBand>

      {/* ── ASSETS BY PLAN ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHead pill="What you own" title="Assets you own. Systems that compound." lede="No proprietary tools. No lock-in. Every deliverable is yours from day one." />
        <div className="grid gap-3 md:grid-cols-3">
          {tiers.map((t, i) => {
            const feat = i === 1
            return (
              <div key={t.name} className={`rounded-[22px] p-7 ${feat ? 'bg-forest text-mist' : 'border border-ink/[0.08] bg-white'}`}>
                <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${feat ? 'text-mist/60' : 'text-ink/55'}`}>{t.name} · {t.tier}</p>
                <p className="mt-3 font-display text-6xl font-medium leading-none tracking-[-0.04em]"><CountUp value={String(t.count)} /></p>
                <p className={`mt-1 font-body text-sm ${feat ? 'text-lime' : 'text-forest'}`}>deliverables built and owned</p>
                {t.lead && <p className={`mt-5 font-body text-xs ${feat ? 'text-mist/60' : 'text-ink/55'}`}>{t.lead}</p>}
                <ul className="mt-4 space-y-2.5">
                  {t.items.map(a => (
                    <li key={a} className="grid grid-cols-[16px_1fr] items-start gap-2.5 font-body text-sm">
                      <Check className="mt-[3px] h-4 w-4" />
                      <span className={feat ? 'text-mist/85' : 'text-ink/75'}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="mt-6 text-right"><Link href="/pricing" className="font-body text-sm font-medium text-forest underline underline-offset-4">See pricing for each plan →</Link></div>
      </section>

      {/* ── CADENCE ── */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <SectionHead pill="Communication" title="You will always know exactly what's happening." />
        <div className="grid gap-3 md:grid-cols-3">
          {cadence.map(c => (
            <div key={c.title} className="flex flex-col rounded-[22px] border border-ink/[0.08] bg-white p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{c.freq}</span>
                <span className="flex gap-1">{Array.from({ length: 4 }).map((_, j) => <span key={j} className={`h-3.5 w-[3px] ${j < c.dots ? 'bg-ember' : 'bg-ink/10'}`} />)}</span>
              </div>
              <p className="mt-6 font-display text-[26px] font-medium tracking-[-0.03em]">{c.title}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-forest">{c.detail}</p>
              <p className="mt-4 font-body text-sm text-ink/70">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
