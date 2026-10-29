import type { Metadata } from 'next'
import Terrain from '@/components/strata/Terrain'
import Contour from '@/components/strata/Contour'
import { Glyph, Mark } from '@/components/strata/Glyph'
import { StrataBars, ElevationClimb, CreativeGrid } from '@/components/strata/Charts'
import { PageHero, h2Class } from '@/components/strata/Page'
import { pillars } from '@/lib/services'
import { colors, type SceneName } from '@/lib/strata'

export const metadata: Metadata = {
  title: 'Brand Guide',
  robots: { index: false, follow: false },
}

const palette = [
  { name: 'Bone', token: 'bone', hex: '#F7F6F3', use: 'Page ground', dark: false },
  { name: 'Forest', token: 'forest', hex: colors.forest, use: 'Bands, buttons, footer', dark: true },
  { name: 'Ink', token: 'ink', hex: colors.ink, use: 'Text', dark: true },
  { name: 'Lichen', token: 'ember', hex: colors.lichen, use: 'Brand green; text on Forest. Never text on Bone', dark: false },
  { name: 'Lime', token: 'lime', hex: colors.lime, use: 'Highlights only', dark: false },
  { name: 'Dawn', token: 'dawn', hex: colors.dawn, use: 'Warm light; italic accent on dark', dark: false },
  { name: 'Forest 2', token: 'forest-2', hex: colors.forest2, use: 'Cards on Forest', dark: true },
  { name: 'Paper', token: 'paper', hex: colors.paper, use: 'Cards', dark: false },
]

const type = [
  { role: 'Display', face: 'Plus Jakarta Sans 500, −4.5% tracking', sample: 'Your new growth team.', cls: 'font-display text-[clamp(40px,5vw,72px)] font-medium leading-none tracking-[-0.045em]' },
  { role: 'Accent', face: 'Playfair Display italic, one or two words per headline', sample: 'every strategy', cls: 'accent text-[clamp(34px,4vw,56px)] leading-none text-forest' },
  { role: 'Body', face: 'DM Sans 400, 15–18px', sample: 'One flat fee. Never a percentage of your ad spend.', cls: 'font-body text-lg text-ink/75' },
  { role: 'Label', face: 'Inter Tight 500, 11px caps, +18% tracking', sample: 'Nine-pillar grade · sample', cls: 'font-mono text-[13px] uppercase tracking-[0.18em]' },
]

const scenes: { scene: SceneName; use: string }[] = [
  { scene: 'amber', use: 'Heroes and offer cards' },
  { scene: 'ember', use: 'Closing panels' },
  { scene: 'valley', use: 'Glass data cards' },
  { scene: 'sage', use: 'Behind product shots' },
]

export default function BrandGuide() {
  return (
    <div className="bg-bone pb-24 text-ink">
      <PageHero
        pill="Brand guide · Strata"
        title={<>Growth, laid down in <em className="accent text-lime">layers.</em></>}
        lede="Light, calm pages; deep forest bands; warm generated terrain at the open and close; and graphics that are measurements, never decoration. No stock photos, no stock icons."
        seed={12}
      />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className={`${h2Class} mb-8 text-[clamp(28px,3vw,40px)]`}>Color</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {palette.map(c => (
            <div key={c.name} className="flex min-h-[180px] flex-col justify-end gap-1 rounded-[22px] border border-ink/[0.08] p-5" style={{ background: c.hex, color: c.dark ? colors.mist : colors.ink }}>
              <b className="font-display text-lg font-medium">{c.name}</b>
              <span className="font-mono text-xs">{c.hex} · {c.token}</span>
              <small className="font-body text-xs opacity-80">{c.use}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <h2 className={`${h2Class} mb-8 text-[clamp(28px,3vw,40px)]`}>Type</h2>
        <div className="border-t border-ink/[0.08]">
          {type.map(t => (
            <div key={t.role} className="grid gap-3 border-b border-ink/[0.08] py-6 md:grid-cols-[220px_1fr] md:items-baseline">
              <p className="font-mono text-[11px] leading-relaxed text-ink/55">{t.role}<br />{t.face}</p>
              <p className={t.cls}>{t.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <h2 className={`${h2Class} mb-3 text-[clamp(28px,3vw,40px)]`}>Mark and glyphs</h2>
        <p className="mb-8 max-w-2xl font-body text-ink/70">Every glyph is cut from the mark: two uprights and the rising 24° cut. Square ends, no outlines, one accent part. Never use an icon library.</p>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-10">
          <div className="flex flex-col items-start gap-4 rounded-[18px] bg-lime p-4"><Mark fg={colors.forest} accent={colors.forest} size={40} /><span className="font-body text-xs text-forest">The mark</span></div>
          {pillars.map(p => (
            <div key={p.slug} className="flex flex-col items-start gap-4 rounded-[18px] bg-forest p-4">
              <Glyph name={p.glyph} fg={colors.mist} accent={colors.lichen} size={40} />
              <span className="font-body text-xs leading-snug text-mist/85">{p.short}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <h2 className={`${h2Class} mb-3 text-[clamp(28px,3vw,40px)]`}>Terrain</h2>
        <p className="mb-8 max-w-2xl font-body text-ink/70">Generated for Hewn in place of photography until commissioned or graded photography replaces it. Always under a scrim when text sits on it.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenes.map(s => (
            <div key={s.scene}>
              <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[22px]"><Terrain scene={s.scene} seed={7} className="-z-10" /></div>
              <p className="mt-3 font-body text-sm"><b className="font-medium">{s.scene}</b> · <span className="text-ink/65">{s.use}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <h2 className={`${h2Class} mb-3 text-[clamp(28px,3vw,40px)]`}>Data drawn as land</h2>
        <p className="mb-8 max-w-2xl font-body text-ink/70">Strata for scorecards, elevation for roadmaps, tiles for creative output, contours for funnels.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[StrataBars, ElevationClimb, CreativeGrid, () => <Contour />].map((V, i) => (
            <div key={i} className="relative aspect-[4/4.4] overflow-hidden rounded-[22px] bg-forest"><V /></div>
          ))}
        </div>
      </section>
    </div>
  )
}
