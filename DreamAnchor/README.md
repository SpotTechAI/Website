# DreamAnchor: legal and support pages

> ⚠️ **Draft. Needs legal review before launch.** These pages were written from the product brief and haven't been reviewed by a lawyer. Resolve the [open items](#open-items-and-assumptions) below first.

These are plain static HTML pages for the DreamAnchor iPhone app. There is no framework and no build step. The only JavaScript is an optional script that highlights the current section in the contents list. They reuse the main SpotTechAI site theme (`/assets/css/styles.css`), so they match spottechai.com.

## Folder layout

```
DreamAnchor/
  index.html                 App landing page    → https://spottechai.com/DreamAnchor/
  privacy/index.html         Privacy Policy      → /DreamAnchor/privacy/
  terms/index.html           Terms of Service    → /DreamAnchor/terms/
  support/index.html         Support and FAQ     → /DreamAnchor/support/
  delete-account/index.html  Account deletion    → /DreamAnchor/delete-account/
  assets/site.css            Styles for these pages (loaded after /assets/css/styles.css)
  assets/toc.js              Optional: highlights the current section in the contents list
  sitemap.xml                Sitemap for these pages
```

Each page is a folder containing an `index.html`, so the URLs have no `.html` at the end. Links between pages are relative, so they work on any static host (GitHub Pages, Vercel, Netlify or Cloudflare Pages). They also work locally with `python -m http.server` run from the repo root.

**The URLs are case-sensitive.** GitHub Pages and most hosts treat `/DreamAnchor/` and `/dreamanchor/` as different paths. Copy the URLs exactly as written into App Store Connect and Google Play Console:

| Where | URL |
|---|---|
| App Store: Privacy Policy URL | `https://spottechai.com/DreamAnchor/privacy/` |
| App Store: Support URL | `https://spottechai.com/DreamAnchor/support/` |
| App Store: custom EULA (or link it in the app description) | `https://spottechai.com/DreamAnchor/terms/` |
| Google Play: Privacy policy | `https://spottechai.com/DreamAnchor/privacy/` |
| Google Play: Delete account URL | `https://spottechai.com/DreamAnchor/delete-account/` |

## Updating the "Last updated" date

The Privacy Policy and Terms each show the date near the top. Search for this line:

```html
<ul class="da-meta"><li>Last updated 10 November 2026</li></ul>
```

Change the date when you publish a change, and update `<lastmod>` for that page in `sitemap.xml`. The footer year (`© 2026`) is plain text, so update it each January.

## Keep the Privacy Policy in sync with the app

**Update the Privacy Policy whenever the app's data practices change.** For example:
- adding analytics such as TelemetryDeck;
- adding a new service provider or SDK;
- adding push notifications or device tokens;
- collecting a new type of data;
- changing where data is stored or how long it's kept;
- adding AI features.

Update these at the same time so all three agree:
1. this Privacy Policy,
2. the **App Store privacy "nutrition" labels** in App Store Connect,
3. the **Google Play Data safety form**, if the Android app is live.

Apple and Google check these against the app and can reject or remove it if they don't match.

## Search engines

`sitemap.xml` lists these pages. A `robots.txt` only works at the root of the domain, so there isn't one in this folder. The site's root `robots.txt` already allows everything. To get these pages indexed faster, either:
- add `Sitemap: https://spottechai.com/DreamAnchor/sitemap.xml` to the root `robots.txt`, or
- submit that sitemap URL in Google Search Console.

## Open items and assumptions

These must be confirmed or fixed before launch:

1. **Account deletion method.** The brief left this blank. The pages describe **deletion by email, done within 30 days**. Apple's App Review Guideline 5.1.1(v) requires **in-app** account deletion for apps that let people create an account. If the app has *Settings → Your account → Delete account*:
   - un-comment the in-app block in `delete-account/index.html`;
   - mention it in the Privacy Policy's "Your rights" section and in the Support FAQ.
2. **Anonymous accounts that were never saved with an email.** We can't identify these by email, so the delete page asks people to save their account first and then email us. Consider adding in-app deletion, or a policy to clean up inactive anonymous accounts. If you add a clean-up policy, add it to the retention section.
3. **Backup retention.** The pages say backups are gone "within a further 30 days". Check this against your Supabase plan's backup and point-in-time recovery settings.
4. **RevenueCat deletion.** The pages promise that account deletion also deletes the subscription record held by RevenueCat. Make sure your deletion process actually does this, for example through RevenueCat's delete-customer API.
5. **Supabase sends the 6-digit code.** The policy assumes Supabase Auth sends the sign-in email. If you use a separate email-sending service (SMTP provider), add it to the service providers list.
6. **Server region and transfers.** The policy says SpotTechAI is based in India and that providers "may process data in other countries, including the United States". Confirm your Supabase project's region and adjust if needed.
7. **Company details.** Apple's standard EULA asks for the developer's **name and postal address**. Add SpotTechAI's legal entity name and address to the Terms (there's a `TODO` comment in the Apple section) and to the Contact sections. Also consider a named grievance officer for India's DPDP Act.
8. **Children and India.** The pages use 13 (16 in the EEA), as briefed. India's DPDP Act treats everyone **under 18** as a child and requires verifiable parental consent. Have a lawyer decide whether the age rules or the onboarding need to change for India.
9. **Governing law and courts.** The Terms say "laws of India, courts of India". A lawyer may want to name a specific city's courts.
10. **Liability cap.** This is set to the amount paid in the previous 12 months. Confirm with your lawyer.
11. **Restore purchases button.** The Support FAQ tells people to tap **Restore purchases** on the app's subscription screen. Make sure that button exists. Apple requires a way to restore purchases, especially for the lifetime purchase.
12. **Support reply time.** The pages say "within 2 working days".
13. **Prices.** The prices are US list prices from the brief. If they change in the stores, update the table in `terms/index.html`.
