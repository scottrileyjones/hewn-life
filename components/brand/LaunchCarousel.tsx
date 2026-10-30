import Terrain from '@/components/strata/Terrain'
import { Glyph, Mark } from '@/components/strata/Glyph'
import { colors, type GlyphKey } from '@/lib/strata'

/**
 * The first Instagram post: a five-slide carousel, 1080×1350 each.
 * Hook → how it works → what comes next → proof → call to action.
 */

const W = 1080, H = 1350

function Frame({ id, children, n, dark = true, bg }: { id: string; children: React.ReactNode; n: number; dark?: boolean; bg?: React.ReactNode }) {
  return (
    <div id={id} className={`relative isolate flex flex-col overflow-hidden px-[88px] pb-[80px] pt-[84px] ${dark ? 'text-mist' : 'text-ink'}`} style={{ width: W, height: H, background: dark ? colors.forest : '#F7F6F3' }}>
      {bg}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Mark fg={dark ? '#F4F2EC' : colors.ink} accent={colors.lichen} size={44} />
          <span className="font-display text-[40px] font-semibold leading-none tracking-[0.02em]">hewn<span className="accent" style={{ color: colors.lichen }}>life</span></span>
        </div>
        <span className={`font-mono text-[24px] tracking-[0.2em] ${dark ? 'text-mist/60' : 'text-ink/45'}`}>{n} / 5</span>
      </div>
      {children}
    </div>
  )
}

const swipe = (dark = true) => (
  <p className={`mt-auto font-mono text-[24px] uppercase tracking-[0.22em] ${dark ? 'text-lime' : 'text-forest'}`}>Swipe →</p>
)

export const launchSlides: { id: string; label: string; node: React.ReactNode }[] = [
  {
    id: 'ig-launch-1',
    label: 'ig-launch-1 · Carousel 1/5: the hook',
    node: (
      <Frame id="ig-launch-1" n={1} bg={<>
        <Terrain scene="amber" seed={7} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(14,10,6,.55), rgba(14,10,6,.1) 45%, rgba(14,10,6,.8) 100%)' }} />
      </>}>
        <div className="mt-[120px]">
          <p className="font-mono text-[26px] uppercase tracking-[0.22em] text-lime">Website in a Day</p>
          <p className="mt-6 font-display text-[132px] font-medium leading-[0.98] tracking-[-0.05em]">Your website.<br />Live in <span className="accent" style={{ color: colors.lime }}>24 hours.</span></p>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="font-display text-[190px] font-semibold leading-none tracking-[-0.05em] text-lime">$999</p>
            <p className="mt-2 font-body text-[34px] text-mist/80">One flat fee. No calls. No surprises.</p>
          </div>
          <p className="pb-4 font-mono text-[24px] uppercase tracking-[0.22em] text-lime">Swipe →</p>
        </div>
      </Frame>
    ),
  },
  {
    id: 'ig-launch-2',
    label: 'ig-launch-2 · Carousel 2/5: how it works',
    node: (
      <Frame id="ig-launch-2" n={2} dark={false}>
        <p className="mt-[90px] font-display text-[88px] font-medium leading-[1.02] tracking-[-0.045em]">Three steps.<br /><span className="accent" style={{ color: colors.forest }}>One day.</span></p>
        <div className="mt-[64px] flex flex-col gap-6">
          {([
            ['01', 'Tell us about your business', 'A few quick questions on your phone. About five minutes.'],
            ['02', 'We design, write and build', 'Custom design, real copy, hosting and an SEO-ready build. Not a template.'],
            ['03', 'You’re live', 'Within 24 hours, with one round of edits on us.'],
          ] as const).map(([n, t, d], i) => (
            <div key={n} className={`flex gap-8 rounded-[36px] p-9 ${i === 2 ? 'bg-forest text-mist' : 'border-2 border-ink/[0.08] bg-white'}`}>
              <span className={`font-display text-[64px] font-semibold leading-none ${i === 2 ? 'text-lime' : 'text-dawn'}`}>{n}</span>
              <div>
                <p className="font-display text-[44px] font-medium leading-tight tracking-[-0.02em]">{t}</p>
                <p className={`mt-2 font-body text-[30px] leading-snug ${i === 2 ? 'text-mist/80' : 'text-ink/65'}`}>{d}</p>
              </div>
            </div>
          ))}
        </div>
        {swipe(false)}
      </Frame>
    ),
  },
  {
    id: 'ig-launch-3',
    label: 'ig-launch-3 · Carousel 3/5: then we grow it',
    node: (
      <Frame id="ig-launch-3" n={3} bg={<Terrain scene="topo" seed={11} className="-z-20" />}>
        <p className="mt-[90px] font-display text-[96px] font-medium leading-[1.0] tracking-[-0.045em]">Then we <span className="accent" style={{ color: colors.lime }}>grow it.</span></p>
        <p className="mt-6 max-w-[24ch] font-body text-[34px] leading-snug text-mist/80">A full marketing team for one flat monthly fee. Never a percentage of your ad spend.</p>
        <div className="mt-[56px] grid grid-cols-2 gap-4">
          {([
            ['media', 'Paid ads'], ['creative', 'AI creative'], ['seo', 'SEO + AI search'], ['lifecycle', 'Email + CRM'], ['creators', 'Creators + UGC'], ['data', 'Live dashboard'],
          ] as [GlyphKey, string][]).map(([g, t]) => (
            <div key={t} className="flex items-center gap-5 rounded-[28px] border border-white/15 bg-black/25 px-7 py-7 backdrop-blur-md">
              <Glyph name={g} fg="#F4F2EC" accent={colors.lime} size={48} />
              <span className="font-display text-[38px] font-medium">{t}</span>
            </div>
          ))}
        </div>
        {swipe()}
      </Frame>
    ),
  },
  {
    id: 'ig-launch-4',
    label: 'ig-launch-4 · Carousel 4/5: the proof',
    node: (
      <Frame id="ig-launch-4" n={4} bg={<>
        <Terrain scene="valley" seed={24} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(14,24,16,.35), rgba(14,24,16,.85) 80%)' }} />
      </>}>
        <p className="mt-[90px] font-mono text-[26px] uppercase tracking-[0.22em] text-lime">Not our first climb</p>
        <p className="mt-6 font-display text-[78px] font-medium leading-[1.04] tracking-[-0.04em]">Our team took a national telehealth brand from</p>
        <p className="mt-6 font-display text-[200px] font-semibold leading-none tracking-[-0.05em] text-lime">$0 → $10M</p>
        <p className="mt-2 font-display text-[60px] font-medium tracking-[-0.03em]">a year, in under two years.</p>
        <div className="mt-[56px] flex flex-wrap gap-4">
          {['Brand', 'Website', 'Paid media', 'UGC', 'SEO + AEO', 'CRM', 'Seed round', 'Acquired'].map(t => (
            <span key={t} className="rounded-full border border-white/25 px-6 py-3 font-body text-[28px] text-mist/90">{t}</span>
          ))}
        </div>
        <p className="mt-auto font-body text-[22px] leading-snug text-mist/55">Work our team did before founding Hewn Life. Results not typical. Full case study at hewn.life.</p>
      </Frame>
    ),
  },
  {
    id: 'ig-launch-5',
    label: 'ig-launch-5 · Carousel 5/5: the call to action',
    node: (
      <Frame id="ig-launch-5" n={5} dark={false}>
        <div className="mt-auto">
          <p className="font-display text-[124px] font-medium leading-[0.98] tracking-[-0.05em]">Start with a website.<br /><span className="accent" style={{ color: colors.forest }}>Grow from there.</span></p>
          <div className="mt-[72px] inline-flex items-center gap-6 rounded-full bg-forest px-12 py-8">
            <span className="font-display text-[48px] font-medium text-mist">Start your brief</span>
            <span className="font-display text-[48px] text-lime">→</span>
          </div>
          <p className="mt-10 font-body text-[36px] text-ink/65">Link in bio · <b className="font-medium text-ink">hewn.life</b></p>
        </div>
      </Frame>
    ),
  },
]
