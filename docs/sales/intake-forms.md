# Website brief: intake forms

How a prospect's brief gets from an ad or a booking to a concept website on the exploration call.

```
Meta ad ─► Meta instant form ─► thank-you screen ─► hewn.life/start (logo + references)
                                                         │
Cal.com booking (questions below) ─► /api/cal-webhook ───┼─► Airtable "Website Briefs"
                                                         │
hewn.life/start ─► /api/intake ──────────────────────────┘
                                                         ▼
                                       build concept site ─► exploration call (pitch deck)
```

The question list lives in one place: `lib/intake.ts`. The `id` of each question is also its
Cal.com booking-question identifier, and its label is the Airtable column name. Change it there
first, then mirror the change in Cal.com and Meta.

---

## 1. Cal.com booking questions

Event type: **Exploration call** (30 min). Open the event in Cal.com, go to **Advanced → Booking
questions** and add the questions below. Keep Cal.com's built-in **Name** and **Email** questions;
the webhook reads them.

The **Identifier** must match exactly, or the answer won't reach Airtable.

| # | Identifier | Label shown to the prospect | Type | Required |
|---|---|---|---|---|
| 1 | `business_name` | Business name | Short text | Yes |
| 2 | `phone` | Phone | Phone | No |
| 3 | `current_website` | Current website (leave blank if none) | URL (or Short text) | No |
| 4 | `reference_1` | A website or brand you love (1 of 3) | URL (or Short text) | Yes |
| 5 | `reference_2` | Another one you love (2 of 3) | URL (or Short text) | No |
| 6 | `reference_3` | One more (3 of 3) | URL (or Short text) | No |
| 7 | `reference_notes` | What do you like about them? | Long text | No |
| 8 | `brand_colors` | Brand colors, if you have them | Short text | No |
| 9 | `tagline` | Your tagline, if you have one | Short text | No |
| 10 | `usp` | What makes you different from the alternatives? | Long text | Yes |
| 11 | `brand_words` | Three words for your brand | Short text | No |
| 12 | `ideal_customer` | Who is your ideal customer? | Long text | Yes |
| 13 | `service_area` | Where do you serve? | Short text | No |
| 14 | `offers` | Main products or services | Long text | Yes |
| 15 | `competitors` | Top competitors | Short text | No |
| 16 | `primary_action` | What should website visitors do? | Select: Call us · Book an appointment · Buy online · Request a quote · Visit in person · Join a list or waitlist | Yes |
| 17 | `goal_90_days` | Your 90-day goal | Short text | No |
| 18 | `revenue_range` | Annual revenue | Select: Under $500K · $500K–$1M · $1M–$5M · $5M+ · Prefer not to say | No |
| 19 | `plan_interest` | Interested in | Select: Website in a Day ($999) · Hewn ($2,500/mo) · Wrought ($5,000/mo) · Forged ($9,500/mo) · Not sure yet | No |

Cal.com booking questions can't take file uploads, so the logo comes in through hewn.life/start.

**Confirmation email.** In the event's **Workflows**, add an email "When event is booked" to the
attendee:

> Thanks for booking. We're building a concept of your new website to show you on the call.
> Upload your logo here so it's in your brand: https://www.hewn.life/start?email={ATTENDEE_EMAIL}&name={ATTENDEE_NAME}&source=Cal.com

**Webhook.** Go to **Settings → Developer → Webhooks → New**:

- Subscriber URL: `https://www.hewn.life/api/cal-webhook`
- Event triggers: **Booking created**
- Secret: a long random string. Put the same value in Vercel as `CAL_WEBHOOK_SECRET`.

The site's `CalButton` already opens `hewn-life/discovery` (set in `lib/cal.ts`). Point it at the new event slug when
it exists (`components/CalButton.tsx`, `CAL_LINK`).

---

## 2. Meta instant form

Ads Manager → **Lead** objective → Instant form → **Higher intent** (adds a review step and cuts
junk leads).

**Intro**
- Headline: *We'll build your website before we meet.*
- Description: *Tell us three brands you love and a little about your business. We'll build a
  concept of your new site and show it to you on a free 30-minute call.*

**Questions** (Meta can't take URLs from a picker or file uploads, so keep this short and finish
the brief at hewn.life/start)

| Meta question type | Question | Maps to |
|---|---|---|
| Prefill: Full name | | `name` |
| Prefill: Email | | `email` |
| Prefill: Phone | | `phone` |
| Prefill: Company name | | `business_name` |
| Short answer | Name a website or brand you'd love to look like | `reference_1` |
| Short answer | Two more you like (comma separated) | `reference_2` |
| Short answer | In one line, what makes you different? | `usp` |
| Multiple choice | What should website visitors do? (same options as above) | `primary_action` |
| Multiple choice | Annual revenue (same options as above) | `revenue_range` |

**Privacy policy:** https://www.hewn.life/legal/privacy

**Completion screen**
- Headline: *Got it. One last step.*
- Description: *Upload your logo and pick a time to see your concept site.*
- Button: **View website** → `https://www.hewn.life/start?source=Meta`

**Getting leads into Airtable.** Meta keeps instant-form leads in Leads Center. To land them in
the same "Website Briefs" table, connect the form with Zapier or Make (trigger: *New lead in
Facebook Lead Ads*; action: *Create record in Airtable*), mapping each question to the column in
the right-hand table above and setting **Source** to `Meta`.

---

## 3. Airtable "Website Briefs" table

Create it in the same base as the quiz leads, then set `AIRTABLE_BRIEFS_TABLE_ID` in Vercel. The
existing `AIRTABLE_TOKEN` needs write access to it.

| Column | Type |
|---|---|
| Name | Single line text (primary) |
| Email | Email |
| Phone | Phone |
| Business name | Single line text |
| Current website | URL |
| Reference site 1 / 2 / 3 | URL |
| What you like about them | Long text |
| Logo | Attachment |
| Brand colors | Single line text |
| Tagline | Single line text |
| What makes you different | Long text |
| Three words for your brand | Single line text |
| Ideal customer | Long text |
| Where you serve | Single line text |
| Main products or services | Long text |
| Top competitors | Single line text |
| What visitors should do | Single select |
| 90-day goal | Single line text |
| Annual revenue | Single select |
| Interested in | Single select |
| Source | Single select: Website · Cal.com · Cal.com booking · Meta |
| Cal booking | Single line text |
| Submitted | Date with time |

Suggested extra columns for the team (not written by the site): **Concept status**
(To build · Building · Ready · Presented), **Concept URL**, **Call outcome**, **Plan sold**.

---

## 4. Before every call

1. Open the brief in Airtable. Build only when the logo and three references are in; otherwise
   email the prospect the hewn.life/start link the day before.
2. Build the concept site, then the Hewn, Wrought and Forged layers on the same brand (see the
   pitch deck, slides 5–10).
3. Fill slide 3 of the pitch deck from the brief, and swap the screenshots on slides 5 and 8.
