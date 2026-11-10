# DreamAnchor web pages: handoff

**Status as of 10 November 2026: DRAFT.** These pages need a legal review before launch, and **they aren't reachable on spottechai.com yet**. See the first blocker in the release checklist below.

These are the web pages the DreamAnchor app needs for the App Store and Google Play: privacy policy, terms (EULA), support and account deletion, plus a small landing page. The company site has its own handoff in [../HANDOFF.md](../HANDOFF.md). The full list of legal assumptions is in [README.md](README.md).

## URLs

The paths are **case-sensitive**: `/DreamAnchor/` works and `/dreamanchor/` doesn't. Paste them exactly.

| Page | Production URL (once the domain is live) | Where it goes | Preview, live now |
|---|---|---|---|
| Landing | https://spottechai.com/DreamAnchor/ | Marketing URL | [github.io](https://spottechai.github.io/Website/DreamAnchor/) |
| Privacy Policy | https://spottechai.com/DreamAnchor/privacy/ | App Store Connect and Play Console: privacy policy URL | [github.io](https://spottechai.github.io/Website/DreamAnchor/privacy/) |
| Terms / EULA | https://spottechai.com/DreamAnchor/terms/ | App Store Connect: custom EULA, or link it in the app description | [github.io](https://spottechai.github.io/Website/DreamAnchor/terms/) |
| Support | https://spottechai.com/DreamAnchor/support/ | App Store Connect: support URL | [github.io](https://spottechai.github.io/Website/DreamAnchor/support/) |
| Delete account | https://spottechai.com/DreamAnchor/delete-account/ | Play Console: delete account URL | [github.io](https://spottechai.github.io/Website/DreamAnchor/delete-account/) |

Don't submit the github.io links to the stores. Use the spottechai.com URLs once they load.

---

## Release checklist

Work through these in order:

1. **🔴 Connect spottechai.com.** Right now every spottechai.com URL, including `/DreamAnchor/privacy/`, shows Squarespace's "Coming Soon" page. An app reviewer would see that instead of the policy. Follow [../HANDOFF.md](../HANDOFF.md) section 1, then open each production URL above and confirm it shows the right page.
2. **🔴 Decide how people delete their account.** The pages describe **deletion by email, done within 30 days**. Apple requires *in-app* deletion for apps that let people create an account (App Review Guideline 5.1.1(v)). If the app has *Settings → Your account → Delete account*, add it as the first option in `delete-account/index.html`; a `TODO` comment marks the spot. Mention it in the Privacy Policy and the Support FAQ too.
3. **🔴 Add the company's legal name and postal address** to the Terms. Apple's EULA rules require them, and a `TODO` comment in the "Apple App Store" section marks the spot.
4. **🟠 Get a legal review** of the Privacy Policy and Terms. Start with the open items in [README.md](README.md#open-items-and-assumptions). The biggest ones:
   - India's DPDP Act treats everyone under 18 as a child; the pages use 13 (16 in the EEA).
   - The liability cap.
   - Which court has jurisdiction ("courts of India").
   - Where the Supabase server is located.
5. **🟠 Make sure the app does what the pages promise:**
   - account deletion also deletes the RevenueCat customer;
   - backups expire within 30 days after deletion;
   - there's a **Restore purchases** button on the subscription screen;
   - drift logs can be exported as CSV;
   - Supabase sends the 6-digit code (if another email service does, name it in the policy).
6. **🟠 Fill in the store forms to match the Privacy Policy:** the App Store privacy "nutrition" labels and, if the Android app launches, the Google Play Data safety form.
7. **🟡 Remove the `<!-- DRAFT … -->` comment** at the top of each page once the review is done, and update the dates (see "Editing" below).
8. **🟡 Submit `https://spottechai.com/DreamAnchor/sitemap.xml`** in Google Search Console, or reference it in the root `robots.txt`.

---

## What the pages say, and the rules for changing them

The content follows the **DreamAnchor product brief**: what the app does with data, prices and the required sections. Don't add features, partners or data uses that aren't in the app.

**Wording rules, for every page:**
- DreamAnchor is **not medical treatment** and doesn't diagnose, treat or cure anything. Every page says so.
- Use "**control, not quit**" language: calm, kind, no shame, no medical claims.
- Describe the personal-writing encryption as *"encrypted on your phone before it's stored, protected by your account login and access rules"*. **Never** call it "end-to-end", and never say "only you can read it". The key is kept with the account.
- The Support page opens with the **"Need help right now?"** box: local emergency services plus https://findahelpline.com.

**Whenever the app's data practices change** (adding analytics such as TelemetryDeck, a new SDK or provider, push notifications, AI features, a new data type, a storage location or a retention change), update these together:
1. `privacy/index.html`, including its date;
2. the App Store privacy labels;
3. the Google Play Data safety form.

## Data facts the policy relies on

These come from the brief. If any of them stops being true, the policy is wrong.

- An anonymous account is created on first launch. An email is collected only if the user saves their account (email plus a 6-digit code).
- Synced to Supabase: drift logs, program progress, settings, worlds and timeline entries. Personal text is encrypted on the phone first.
- Stays on the phone: profile photo, added sounds, the Face ID or passcode lock, the help-line country and the reminders.
- Purchases go through Apple or Google. RevenueCat receives an anonymous app user ID and the receipts.
- No ads, no trackers, no App Tracking Transparency, no selling of data, no AI on personal content, no analytics (yet).
- Users can export drift logs as CSV and delete individual logs.

---

## How the pages are built

```
DreamAnchor/
  index.html                 Landing
  privacy/index.html         Privacy Policy
  terms/index.html           Terms of Service / EULA
  support/index.html         Support and FAQ
  delete-account/index.html  Account deletion
  assets/site.css            DreamAnchor styles (loaded after /assets/css/styles.css)
  assets/toc.js              Optional: highlights the current section in "On this page"
  sitemap.xml                The 5 URLs above
  README.md                  Layout, date updates, the 13 legal open items
  HANDOFF.md                 This file
```

- **Plain static HTML**, with no build step. Each page is a folder with an `index.html`, so the URLs have no `.html`.
- Links between pages are relative (`../terms/`), so the pages work on any host and in the github.io preview.
- **The header and footer are repeated in all 5 files.** If you change a nav link or the footer, change it in every file.
- **Styles:** the pages load the main site's `styles.css` (for the Geist font and brand tokens), then `assets/site.css` for the reading layout.
  - **Light and dark mode** follow the visitor's system setting (`prefers-color-scheme`).
  - On wide screens, Privacy and Terms get a sticky "On this page" sidebar. On phones it's an inline card, and the data tables turn into stacked cards.
  - The FAQ uses native `<details>` accordions, which need no JavaScript.

## Editing

| To change… | Do this |
|---|---|
| **"Last updated" date** | In `privacy/` and `terms/`, edit `<ul class="da-meta"><li>Last updated 10 November 2026</li></ul>`, and the matching `<lastmod>` in `sitemap.xml`. |
| **Prices** | The table in the "Subscriptions" section of `terms/index.html`. These are US list prices, so check them against App Store Connect. |
| **An FAQ** | Copy a `<details id="…">` block in `support/index.html`. Give it a unique `id`. |
| **The support reply time** | Search for "2 working days" in `support/` and `delete-account/`. |
| **The email address** | Search all 5 files for `hello@spottechai.com`. All 13 occurrences are `mailto:` links. |
| **The footer year** | Search for `© 2026` (5 files). |

## What's been checked

As of 10 Nov 2026:
- All 5 pages pass the `html-validate` standard rules.
- All 114 internal links and in-page anchors resolve, and each canonical URL matches its page's path.
- At 375px wide there's no horizontal scroll. Light and dark mode were reviewed in headless Chrome screenshots at 375px and 1440px.
- Every email address is a working `mailto:` link.
- The pages load at the github.io preview URLs above. They **don't** load on spottechai.com yet (Squarespace "Coming Soon").

To re-check after editing, run `npx serve .` from the repo root and click through http://localhost:3000/DreamAnchor/ at phone width (Chrome DevTools, `Ctrl+Shift+M`) and in dark mode.
