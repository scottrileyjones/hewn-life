import Terrain from './Terrain'
import { Glyph } from './Glyph'
import { colors, type GlyphKey, type SceneName } from '@/lib/strata'

const covers: Record<string, { scene: SceneName; seed: number; glyph: GlyphKey }> = {
  '/blog/answer-engine-optimization-small-business': { scene: 'valley', seed: 81, glyph: 'seo' },
  '/blog/ai-marketing-for-small-business': { scene: 'amber', seed: 82, glyph: 'creative' },
  '/blog/how-much-does-a-marketing-agency-cost': { scene: 'sage', seed: 83, glyph: 'data' },
  '/blog/agency-vs-in-house-marketing-cost': { scene: 'ember', seed: 84, glyph: 'strategy' },
  '/blog/launch-marketing-fast': { scene: 'amber', seed: 85, glyph: 'media' },
}

/** Generated article cover: terrain plus the article's pillar glyph. */
export default function PostCover({ href, category, className = '' }: { href: string; category?: string; className?: string }) {
  const c = covers[href] ?? { scene: 'valley' as SceneName, seed: 80, glyph: 'brand' as GlyphKey }
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <Terrain scene={c.scene} seed={c.seed} className="-z-10" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-mist/25 bg-[rgba(20,16,10,.35)] py-1.5 pl-1.5 pr-3 backdrop-blur">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest"><Glyph name={c.glyph} fg={colors.mist} accent={colors.lime} size={14} /></span>
        {category && <span className="font-body text-xs font-medium text-mist">{category}</span>}
      </div>
    </div>
  )
}
