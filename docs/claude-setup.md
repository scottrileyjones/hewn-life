# Claude setup and handoff

Everything needed to pick this work up from a new Claude account
(scott@hewn.life). No secret values are in this file, only their names and
where they live.

## What lives where

| Thing | Where | Moves with a new Claude account? |
|---|---|---|
| Site code | GitHub `scottrileyjones/hewn-life` | Nothing to move |
| Live site | Vercel, production branch `claude/modest-ritchie-TS2pv` | Nothing to move |
| Designs | Figma file `WWBj8L5gNCbiIHYFVGQ404` | Nothing to move |
| Payments, products, promo codes | Stripe account "Hewn Life" (`acct_1TcUP9IQRRcdxnwW`, live) | Nothing to move |
| Photos | Cloudinary cloud `dsx2wcqte`, folder **Hewn Life Website** | Nothing to move |
| Chat history, Claude Code sessions, routines | The Claude account | Stays on the old account; export if wanted |
| Cloud environment (network allow-list, secrets) | The Claude account | **Recreate** (below) |
| Connector logins | The Claude account | **Reconnect** (below) |

## 1. Recreate the Claude Code cloud environment

**Network access → Allowed domains** (keep "Allow package managers" ticked):

- `api.screenshotone.com`: full-page screenshots for design builds and inspiration captures
- `res.cloudinary.com`: download photos to place in Figma
- `mcp.figma.com`: upload images into Figma
- Optional, so local previews use the real fonts: `fonts.googleapis.com`, `fonts.gstatic.com`

Sites being captured (seed.com, rhodeskin.com, helimeds.com…) do **not** need
to be allowed: ScreenshotOne fetches them, not the container. hewn.life itself
is not allowed either; check the live site through ScreenshotOne.

**Secrets / environment variables** (values are in the old environment, the
ScreenshotOne dashboard and Vercel):

- `SCREENSHOTONE_ACCESS_KEY`, `SCREENSHOTONE_SECRET_KEY`: signing as in `lib/design/capture.ts`
- No GitHub token is needed: pushes go through Claude's GitHub connector. Never put a token in a file in this (public) repo.

The site's own runtime secrets (Stripe, Airtable, Twilio, Resend, Anthropic…)
live in **Vercel**, not in Claude; nothing to do there.

## 2. Reconnect connectors

On claude.ai → Settings → Connectors, connect with the company accounts:

- **GitHub**: push access to `scottrileyjones/hewn-life`
- **Figma**: edit access to file `WWBj8L5gNCbiIHYFVGQ404`
- **Stripe**: the Hewn Life account (live mode)
- **Cloudinary**: cloud `dsx2wcqte`
- Also used: Airtable, Gmail, Google Calendar, Google Drive, Slack, Descript, the Hewn Life MCP (`HEWN_MCP_TOKEN` on the site side)

## 3. How we ship

1. Work on branch `checkout-gallery`. Commit, then `git push -u origin checkout-gallery`.
2. Preview locally (`npx next dev -p 3100`), screenshot every changed page on desktop and phone, and get approval (CLAUDE.md).
3. Deploy: push the same commit to the production branch,
   `git push origin HEAD:claude/modest-ritchie-TS2pv`.
   It is always a fast-forward, so plain push works; the force-push in `git deploy`
   is blocked by Claude's auto mode.
4. Vercel builds a **Preview** for the branch push and a separate **Production**
   build for the production push. The commit status turns green on the preview
   first, so check the Production deployment before calling it live:
   `gh api "repos/scottrileyjones/hewn-life/deployments?environment=Production&per_page=1"`.
5. Checkout needs `priceId` in the URL to render locally (any value works for a preview), and Stripe.js is blocked in the sandbox.

## 4. Key IDs

**Stripe (live)**

- Website in a Day: product `prod_VX2gENf8fuhFOi`, price `price_1UVybSIQRRcdxnwWfGSjTgnv` ($999 one time)
- Black Friday coupon `oPaEyWmI`: 50% off, Website in a Day only, redeem by 2026-12-01 23:59:59 MT
- Promotion code `BLACKFRIDAY50` (`promo_1UXBqjIQRRcdxnwWSD8a0Ciy`), same expiry
- À la carte price IDs are in `lib/addons.ts`; plan price IDs are Vercel env vars `NEXT_PUBLIC_STRIPE_PRICE_*`

**Cloudinary**: checkout and site photos are the `hewn-*` files in folder
**Hewn Life Website** (tag `hewn-site`), mapped to names in `lib/photos.ts`.

**Figma file `WWBj8L5gNCbiIHYFVGQ404`, Page 1** (node IDs; x positions are canvas coordinates)

| Frames | Node IDs | Where |
|---|---|---|
| Inspiration: AG1 product page | `25:59` | x −5509 |
| Inspiration: Seed, desktop / phone | `32:2` / `32:7` | x −7499 / −5979 |
| Inspiration: Rhode, desktop / phone | `37:2` / `37:6` | x −9489 / −7969 |
| Inspiration: Helimeds promo, desktop / phone | `51:2` / `51:6` | x −11479 / −9959 |
| Photo library | section `12:2` | x −3400 |
| Wrought checkout gallery (Option C): desktop / phone / phone slides | `35:2` / `35:83` / `35:129` | y 5640 |
| Hewn | `46:2` / `46:96` / `46:158` | y 7340 |
| Forged | `46:296` / `46:390` / `46:452` | y 9040 |
| Website in a Day | `47:2` / `47:96` / `47:158` | y 10740 |

Tall screenshots are stacked in slices because Figma caps images at 4096 px.

## 5. Code map for the recent work

- `lib/gallery.ts`: checkout galleries (cover photo + one stat card per service, sourced stats), plan intros, `cardsFor`, `homeCards`, `servicesCards`, `pillarCard`
- `lib/photos.ts`: Cloudinary photo keys
- `lib/offer.ts`: Black Friday settings (code, price, end date) and `wiadCheckout()`
- `lib/buy.ts`: straight-to-checkout links for plans and à la carte items; à la carte pieces per service playbook
- `components/checkout/ProductGallery.tsx`: the checkout gallery
- `components/strata/StatCard.tsx`, `StatRow.tsx`, `AudienceCard.tsx`, `PlanHead.tsx`, `BuyBlock.tsx`, `BuyChoice.tsx`: shared pieces
- `components/PromoBar.tsx`, `components/Countdown.tsx`: Black Friday bar and countdown
- `app/black-friday/page.tsx`: the offer landing page

## 6. Open items

- [x] Security: the GitHub token once written into `.claude/hooks/session-start.sh` had expired and has been removed from the hook, and the expired tokens were deleted on GitHub.
- [ ] Run one real purchase from `/black-friday` and confirm it charges $499.50, then refund it.
- [ ] Decide on the "Not sure where to start?" quiz pop-up: it covers the home hero on first visit (already off on `/black-friday` and checkout).
- [ ] CLAUDE.md still says "No stock photos"; the site now uses the curated hewn-* photos alongside terrain. Update the rule.
- [ ] `components/checkout/LineIcon.tsx` and `lib/platforms.ts` are no longer used; delete if not needed.
- [ ] After Dec 1 the offer bar, links and checkout code switch off on their own (hourly rebuild); remove `/black-friday` from `app/sitemap.ts` then.
