# Analytics Setup — Hewn Life

How Google Tag Manager, Google Analytics 4, Consent Mode, and ecommerce
conversion tracking are wired on this site. Reference for future changes.

_Last updated: 2026-06-03_

## IDs

| Thing | ID | Where it lives |
|-------|-----|----------------|
| GTM container | `GTM-5D8JJD5R` | In code (`lib/gtm.ts`), overridable via `NEXT_PUBLIC_GTM_ID` |
| GA4 Measurement ID | `G-LS70LJ492W` | **Only** inside the GTM dashboard (not in code) |
| GA4 property | "Hewn Life" → "Hewn Life Web" stream | analytics.google.com |

GTM and GA4 both live under the same Google account (Account: "Hewn Life").

## How it works (the chain)

```
site dataLayer  →  GTM container  →  GA4 tags  →  GA4 property
(Next.js code)     (GTM-5D8JJD5R)    (G-LS70LJ492W)
```

The site only loads GTM. **All tag configuration (GA4, future pixels) is done in
the GTM dashboard**, not in code — so new tags don't require a deploy.

## What's in the code

| File | Role |
|------|------|
| `lib/gtm.ts` | Container ID, Consent Mode helpers, and the event helpers (`trackBeginCheckout`, `trackAddPaymentInfo`, `trackPurchase`, `sendGTMEvent`, `updateConsent`) |
| `components/GoogleTagManager.tsx` | Loads GTM + installs Consent Mode v2 defaults. Renders nothing if no container ID. Also exports `GoogleTagManagerNoScript` (the `<noscript>` fallback) |
| `components/PurchaseTracker.tsx` | Fires the GA4 `purchase` event on `/thank-you` after a successful Stripe payment (deduped on `payment_intent`) |
| `components/CookieConsent.tsx` | Cookie banner; calls `updateConsent()` to grant/deny on Accept/Decline |
| `app/layout.tsx` | Renders `<GoogleTagManager />` in `<head>` and `<GoogleTagManagerNoScript />` after `<body>` |

### Environment variable

```
NEXT_PUBLIC_GTM_ID=GTM-5D8JJD5R   # optional; defaults to this in code
```

Set it in Vercel only to point a different environment at a different container.
If unset, the code falls back to the Hewn Life container.

## Consent Mode v2

`components/GoogleTagManager.tsx` sets Consent Mode **defaults to denied** for
`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` (strictly
necessary categories stay granted). The cookie banner
(`components/CookieConsent.tsx`) calls `updateConsent('accepted' | 'declined')`
which flips them. A previously stored "accepted" choice is re-applied on load so
returning visitors aren't re-prompted. GTM tags respect this automatically.

## dataLayer events fired by the site

All pushed via helpers in `lib/gtm.ts`. GA4 ecommerce shape.

| Event | Fires from | When |
|-------|-----------|------|
| `begin_checkout` | `app/checkout/checkout-client.tsx` | Checkout page loads with a valid plan |
| `add_payment_info` | `app/checkout/checkout-client.tsx` | Visitor reaches the payment step |
| `purchase` | `components/PurchaseTracker.tsx` (on `/thank-you`) | Stripe redirect with `redirect_status=succeeded` |

Each carries `ecommerce: { value, currency: 'USD', items: [...] }`; `purchase`
also carries `transaction_id` (the Stripe payment intent, used for dedupe).

> Note: the `purchase` value comes from the checkout URL params (fixed pricing
> tiers), not a server-side Stripe lookup. Accurate for reporting; if exact
> value-based Google Ads bidding is ever needed, fire `purchase` server-side
> from `app/api/webhook/route.ts` via the GA4 Measurement Protocol.

## GTM dashboard configuration (already published)

**Tags**
1. `Google Tag - GA4` — type **Google Tag**, ID `G-LS70LJ492W`, trigger
   **Initialization - All Pages**. (Pageviews.)
2. `GA4 - Ecommerce` — type **GA4 Event**, Measurement ID `G-LS70LJ492W`,
   Event Name `{{Event}}`, **Send Ecommerce data → Data Layer**, trigger
   `CE - Ecommerce`. (Conversion + funnel events.)

**Triggers**
- `CE - Ecommerce` — Custom Event, event name regex
  `begin_checkout|add_payment_info|purchase` (Use regex matching ✓).

**Variables**
- Built-in **Event** variable enabled (so `{{Event}}` resolves to the dataLayer
  event name).

## GA4 configuration

- `purchase` is a **key event** (conversion) — it's a GA4 built-in, marked
  automatically and locked.

## How to verify

1. GA4 → **Reports → Realtime**.
2. Open the site in another tab, click around (and into `/checkout`).
3. Within ~30s you should see active users + events: `page_view`, `first_visit`,
   `session_start`, and `begin_checkout` when you hit checkout.
4. `purchase` only appears after a **real completed Stripe payment**.

For deeper debugging use GTM **Preview** mode (Tag Assistant) — it shows each
tag firing and the dataLayer contents per event.

## Future / parked

- **Meta Pixel + Conversions API** — slots into this same GTM container: add a
  Meta Pixel base tag (All Pages) + event tags on the existing
  `begin_checkout` / `purchase` triggers. Requires a Meta Business account +
  Pixel ID first.
- **Server-side `purchase`** — see note above; only worth it for exact
  value-based Ads bidding.
