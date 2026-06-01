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
| `amethyst` | `#8B5CF6` | Purple accent (rare) |

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
