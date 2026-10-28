import { glyphs, type GlyphKey } from '@/lib/strata'

/** A pillar glyph from the custom set. One part takes the accent colour. */
export function Glyph({ name, fg, accent, size = 44, className = '' }: { name: GlyphKey; fg: string; accent: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      {glyphs[name].map((p, i) => {
        const fill = p.accent ? accent : fg
        if ('u' in p) {
          const [x, y, w, h] = p.u
          return <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
        }
        const [x1, y1, x2, y2, th] = p.c
        return <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${x2},${y2 + th} ${x1},${y1 + th}`} fill={fill} />
      })}
    </svg>
  )
}

/** The H mark: two uprights and the rising cut. */
export function Mark({ fg, accent, size = 16, className = '' }: { fg: string; accent: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <rect x="14" y="14" width="18" height="72" fill={fg} />
      <rect x="68" y="14" width="18" height="72" fill={fg} />
      <polygon points="32,58 68,42 68,54 32,70" fill={accent} />
    </svg>
  )
}

/** Section label pill with the mark in place of a dot. */
export function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 font-body text-[13px] font-medium ${
        dark ? 'border border-mist/15 bg-mist/10 text-mist' : 'border border-ink/[0.08] bg-white text-ink'
      }`}
    >
      {dark ? <Mark fg="#D6F28B" accent="#D6F28B" /> : <Mark fg="#1E3826" accent="#6BAD3D" />}
      {children}
    </span>
  )
}

/** List bullet: an upright and the cut. */
export function Check({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="14" y="30" width="16" height="56" fill="#1E3826" />
      <polygon points="30,62 86,34 86,48 30,76" fill="#6BAD3D" />
    </svg>
  )
}
