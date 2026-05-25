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
- **Brand colors**: `iron` (#1A1815), `bone` (#F2ECE0), `ember` (#7CB550), `moss` (#4A5348), `ash` (#A89F92)
- **Fonts**: Playfair Display (display/serif), DM Sans (body), DM Mono (mono)
- **Pages**: `/`, `/how-it-works`, `/pricing`, `/about`, `/contact`, `/checkout`, `/blog`
