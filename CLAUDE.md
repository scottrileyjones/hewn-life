# Hewn Life — Claude Instructions

## Deploying Changes

**After every `git push`, you must also run `git deploy`.**

Vercel watches `claude/modest-ritchie-TS2pv` for production deployments.
The `git deploy` alias force-pushes HEAD to that branch, triggering exactly one Vercel build.

The auto-merge workflow is excluded from firing on `claude/modest-ritchie-TS2pv` (via `!claude/modest-ritchie-TS2pv` in the branches filter), and the deploy hook has been removed from the workflow. This means `git deploy` triggers exactly ONE production deployment — no queue buildup.

### Correct workflow every time:
```
git push -u origin <branch>   # triggers auto-merge to main
git deploy                     # triggers one Vercel production build
```

## Project

- **Framework**: Next.js 14, TypeScript, Tailwind CSS
- **Brand colors**: `iron` (#1A1815), `bone` (#F2ECE0), `ember` (#7CB550), `moss` (#4A5348), `ash` (#A89F92)
- **Fonts**: Playfair Display (display/serif), DM Sans (body), DM Mono (mono)
- **Pages**: `/`, `/how-it-works`, `/pricing`, `/about`, `/contact`, `/checkout`, `/blog`
