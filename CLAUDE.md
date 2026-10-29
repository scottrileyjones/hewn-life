# Hewn Life — Claude Instructions

## Deploying Changes

**After every `git push`, you must also run `git deploy`.**

Vercel watches `claude/modest-ritchie-TS2pv` for production deployments, not `main`.
The `git deploy` alias (set in `.claude/hooks/session-start.sh`) force-pushes the
current HEAD to that branch, which triggers the actual Vercel build.

Without `git deploy`, changes will be merged to `main` but Vercel will not update.

### Correct workflow every time:
```
git push -u origin <branch>   # triggers auto-merge to main
git deploy                     # force-pushes to Vercel production branch
```

## Preview Before Deploying

**Every change must be shown to the user as a screenshot before it is deployed.**

After making any change, run the site locally, take screenshots of every page
or section that changed (desktop, and phone when layout is affected) and send
them in the conversation with a one-line note on what changed. Only run
`git deploy` once the user has seen the preview and approved it. If something
can't be rendered in the screenshot (e.g. blocked images), say so explicitly.

## Project

- **Framework**: Next.js 14, TypeScript, Tailwind CSS
- **Pages**: `/`, `/how-it-works`, `/pricing`, `/about`, `/contact`, `/checkout`, `/blog`, `/website-in-a-week`

## Design System

### Brand Colors (Tailwind tokens)
| Token | Hex | Usage |
|-------|-----|-------|
| `iron` | `#0D0D0D` | Primary text, dark backgrounds |
| `bone` | `#F7F6F3` | Light backgrounds, page base |
| `ember` | `#6BAD3D` | Primary accent / CTA green |
| `moss` | `#3D4A3F` | Secondary green, muted accent |
| `ash` | `#9A9590` | Muted text, borders |
| `copper` | `#B5621C` | Warm accent |
| `slate` | `#44514D` | Dark green-grey |
| `oat` | `#E0DBD2` | Warm light tone |
| `stone` | `#EDEAE4` | Section backgrounds |
| `amethyst` | `#8B5CF6` | Purple accent (legacy pages only; retired in Strata) |
| `forest` | `#1E3826` | Strata: bands, primary buttons, footer |
| `forest-2` | `#2A4A32` | Strata: cards on forest |
| `lime` | `#D6F28B` | Strata: highlight only (chips, one featured card) |
| `dawn` | `#D9893F` | Strata: warm light, accent italic on dark |
| `paper` / `sand` / `mist` | `#FFFFFF` / `#E9E5DB` / `#F4F2EC` | Strata: cards / table heads / text on dark |

### Strata graphic language (v3 redesign)
- No stock photos or stock icons. Imagery is generated terrain (`components/strata/Terrain.tsx`, scenes `amber` `ember` `sage` `valley`) until commissioned or curated photography is graded in.
- Icons are the custom glyph set cut from the H mark (`lib/strata.ts`, `components/strata/Glyph.tsx`). Pillars reference them by `glyph` key in `lib/services.ts`.
- Charts are data drawn as land: ridgelines, contours, strata, elevation profiles (`components/strata/Charts.tsx`, `Contour.tsx`).
- Layout: light Bone pages, rounded 32px containers, forest bands, warm terrain at the open and close.

### Fonts (Tailwind classes → CSS variable → face)
| Tailwind class | Variable | Typeface | Notes |
|----------------|----------|----------|-------|
| `font-display` | `--font-display` | Plus Jakarta Sans | Headings, display text |
| `font-accent` | `--font-accent` | Playfair Display | Italic-only brand accent (e.g. "start?") |
| `font-body` | `--font-body` | DM Sans | Body copy, UI |
| `font-mono` | `--font-mono` | Inter Tight | Monospace labels, eyebrows |

### Heading Scale
- `fluid-hero` — `clamp(2.625rem, 1.25rem + 4vw, 5rem)` — page H1s
- `fluid-h2` — section headings
- `fluid-stat` — large stat numbers
