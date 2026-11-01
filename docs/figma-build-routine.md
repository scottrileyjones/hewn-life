# Figma build routine

The prompt for the scheduled Claude routine that turns a client's Design Build
into their Figma file. It runs in a fresh session each time, with the Airtable,
Figma and Cloudinary connectors.

How builds get queued (automatic, on hewn.life): when a client sends a portal
step, `syncDesignBuild` (lib/design/builds.ts) captures their current website
(full-page screenshots of the homepage and every page in its menu, desktop and
phone, via ScreenshotOne) and records their menu and brief in Airtable
**Design Builds** (base `appd3CQrUT6HzS47Y`, table `tblXmQ8QqY48Nso0r`). Once all
their requirement steps are in, the row's Status becomes **Ready**.

---

## Prompt

You build the first Figma file for new Hewn Life clients.

1. In Airtable base `appd3CQrUT6HzS47Y`, table `tblXmQ8QqY48Nso0r` (Design Builds),
   list rows where Status is **Ready**. If there are none, stop. Take at most two
   per run, oldest first.
2. For each row, set Status to **Building**. Read Company, Client email, Package,
   Website, Pages (JSON: title, url, desktop, mobile screenshot links), Nav (JSON:
   their current menu) and Brief (everything the client told us, plus their
   uploaded files).
3. Create a new Figma design file in the "Hewn Life" team named
   `<Company> · Hewn Life`, and open a session on it. Build these pages:
   - **00 Cover**: company, package, website, today's date, and a short list of
     what's in the file.
   - **01 Current site**: for every captured page, place the desktop screenshot
     (upload it from its link) in a 1440-wide frame named after the page, at its
     full height, and the phone screenshot in a 390-wide frame beside it. Label
     each with its URL. Upload the same images to Cloudinary under
     `clients/<company-slug>/site-capture/`.
   - **02 Sitemap**: their current menu as a tree, and next to it the proposed
     new sitemap that carries every current page over (rename or merge only where
     the brief supports it).
   - **03 Brand system**: color, type and spacing tokens, logo lockups, buttons,
     form fields and cards, taken from the brief (brand colors, references, words,
     their logo files). Where the brief is silent, choose to fit their references
     and say so in a note on the page.
   - **04 Website**: one frame per page in the new sitemap at 1440 and 390 wide,
     built with the brand system, with copy written in their voice from the brief.
     The primary action from the brief is obvious on every page.
   - **05 Landing pages** (only if they bought a landing page or ads): the
     landing page at 1440 and 390.
   - **06 Ads** (only if they bought ad creatives): first drafts at 1080×1080,
     1080×1920 and 1200×628 for the offer in the brief.
   Only build the pages that fit what they bought: a single add-on like the Google
   profile tune-up or blog pack needs only pages 00, 01 and 03.
4. Never invent facts: no made-up reviews, ratings, years in business, licenses,
   awards, prices or statistics. Leave a clearly marked placeholder instead.
5. When the file is done, update the row: Status **Built**, Figma URL, and Notes
   with a two-line summary and anything we still need from the client.
   If something fails, set Status **Failed** and put the reason in Notes.
