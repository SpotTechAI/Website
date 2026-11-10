# SpotTechAI website: handoff

**Status as of 10 November 2026.** This covers the company site at the root of this repo. The DreamAnchor app pages have their own handoff: [DreamAnchor/HANDOFF.md](DreamAnchor/HANDOFF.md).

| | |
|---|---|
| Repo | `github.com/SpotTechAI/Website`, branch `main` |
| Hosting | GitHub Pages, deploying from `main` / root (no build step) |
| Live now | ✅ https://spottechai.github.io/Website/ |
| Intended domain | ❌ **https://spottechai.com currently shows a Squarespace "Coming Soon" page, not this site** |
| Contact | hello@spottechai.com |

---

## 1. Blocker: the domain isn't connected

**What's happening (checked 10 Nov 2026):**
- `spottechai.com` has `A` records pointing to Squarespace (`198.185.159.144/145`, `198.49.23.144/145`).
- `www.spottechai.com` is a `CNAME` to `ext-sq.squarespace.com`.
- The domain is managed in **Squarespace Domains** (it was moved over from Google Domains).
- The repo's `CNAME` file was **deleted on 9 Nov** in commit `5721543` ("Delete CNAME"). Clicking **Remove** next to the custom domain in GitHub Pages settings does this.
- Email works through Google Workspace (`MX` = `smtp.google.com`). **Don't touch the MX or TXT records.**

**First, confirm with the owner that the site should be hosted on GitHub Pages.** The `CNAME` deletion may have been deliberate, for example if you're moving to another host. If it should be GitHub Pages:

1. **GitHub → Settings → Pages → Custom domain:** enter `spottechai.com` and save. This recreates the `CNAME` file.
2. **Squarespace Domains → spottechai.com → DNS:** delete the **"Squarespace Defaults"** record group. Keep the **Google Workspace** group.
3. Add these custom records:

   | Host | Type | Data |
   |---|---|---|
   | `@` | A | `185.199.108.153` |
   | `@` | A | `185.199.109.153` |
   | `@` | A | `185.199.110.153` |
   | `@` | A | `185.199.111.153` |
   | `www` | CNAME | `spottechai.github.io` |

4. Wait for **"DNS check successful"** in Pages settings, then tick **Enforce HTTPS**.
5. Optional but recommended: verify the domain under the **SpotTechAI organisation → Settings → Pages**, which adds one TXT record. This stops anyone else from claiming the domain on GitHub Pages.
6. Check it: `nslookup spottechai.com` should return the `185.199.x.x` addresses, and https://spottechai.com should show this site with a padlock.

---

## 2. What's in the repo

```
index.html              Home page (all sections)
404.html                Not-found page
assets/css/styles.css   Site styles (also the base for the DreamAnchor pages)
assets/js/main.js       Navigation, animations, contact form
assets/img/             Logo, trident mark, favicon, apple-touch-icon
robots.txt              Allows everything; points to sitemap.xml
sitemap.xml             Lists the home page only
DreamAnchor/            App landing, legal and support pages (see DreamAnchor/HANDOFF.md)
README.md               Short project readme
```

Everything is plain HTML, CSS and JavaScript. There are no dependencies, no `package.json` and no build.

## 3. Run it locally

From the repo root:

```
npx serve .
```

Then open http://localhost:3000. VS Code's **Live Server** extension also works. Opening the file directly also works for the home page, but the DreamAnchor links need a server.

## 4. Deploy

Push to `main`. GitHub Pages republishes within a minute or two. There are no other steps.

---

## 5. Editing content

All copy is in `index.html`. The sections, in order:

| Section | `id` | Notes |
|---|---|---|
| Hero | — | Headline "Spot the problem. Solve it with AI." The words are split for animation by `main.js`, so just edit the text. |
| Capabilities marquee | — | Two identical `<ul>` lists inside `.marquee-track`. **Edit both** so the loop stays seamless. |
| About | `#about` | Statement, two paragraphs, 4 pillars (Solve / Enhance / Enable / Reach), mission and vision |
| Services | `#services` | 8 `<article class="card">` cards, each with an inline SVG icon, a title, text and 3 bullets |
| Approach | `#process` | 4 timeline steps |
| Industries | `#industries` | 10 `.ind` tiles |
| Why us | `#why` | 6 `.why-item` rows |
| FAQ | `#faq` | `<details>` items |
| Contact | `#contact` | Email link and form. The form's "Interested in" options should match the service names. |
| Footer | — | Links and email |

**Email address:** `hello@spottechai.com` appears in `index.html` (contact section and footer) and as `CONTACT_EMAIL` at the top of `assets/js/main.js`. Change both if it ever changes.

**Owner's decisions:**
- No client names, logos, client counts, stats or testimonials. The owner asked for none.
- Don't invent numbers.

## 6. Design system

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0a` | Dark sections, text |
| `--white` / `--gray-50` | `#fff` / `#f6f7f7` | Light sections |
| `--teal` | `#2db0a4` | Brand accent (sampled from the logo). Buttons and highlights on dark backgrounds. |
| `--teal-ink` | `#137a70` | Teal for **text on white** (meets AA contrast) |
| Fonts | **Geist** (text) and **Geist Mono** (small labels) | Loaded from Google Fonts |

- Sections alternate dark (`.dark`) and light (`.section`, `.section-gray`).
- Buttons are `.btn` plus `.btn-teal`, `.btn-outline` (on dark) or `.btn-dark` (on light).
- Animations respect `prefers-reduced-motion`.

**Logo files:**
- `assets/img/` holds the logos: `logo.png` for light backgrounds, `logo-white.png` for dark, the trident marks, the favicon and the touch icon.
- All of them were cut out of a **1260×720 JPG**, so they're slightly soft when shown large. **Replace them with exports from the original logo file (SVG or a large PNG) when you can.** Keep the same file names and nothing else needs to change.

## 7. How the page behaves (`assets/js/main.js`)

- The header gets a frosted background after scrolling, and a teal progress bar runs along the top.
- The mobile menu opens full-screen and closes on link click or Esc.
- The hero headline reveals word by word, and a teal particle network sits behind it. The network pauses when off-screen or when the tab is hidden.
- Sections fade in on scroll, cards get a cursor spotlight, and the Approach timeline fills as you scroll.
- The menu underlines the section you're in.

## 8. Contact form

The form **doesn't send anything by itself**. It checks the fields, then opens the visitor's email app with a pre-filled message to hello@spottechai.com. On a computer without an email app this can do nothing, but the address is always shown on the page as a fallback.

To receive submissions directly, point the form at a form service such as Formspree and replace the submit handler in `main.js`.

## 9. SEO

- Each page has a title, description, canonical URL, Open Graph tags and Organization JSON-LD.
- The root `sitemap.xml` lists only `/`. The DreamAnchor pages have their own sitemap at `DreamAnchor/sitemap.xml`.
- After the domain is live, add the site to **Google Search Console** and submit both sitemaps.

## 10. Known issues and to-dos

| Priority | Item |
|---|---|
| 🔴 | **Connect the domain** (section 1). Until then, spottechai.com shows Squarespace's "Coming Soon" page. |
| 🟠 | `404.html` uses root paths (`/assets/...`), so it shows unstyled at `spottechai.github.io/Website/`. It will work correctly once the custom domain is live. |
| 🟠 | Replace the logo images with versions from the original logo file (section 6). |
| 🟡 | The home page doesn't link to DreamAnchor yet. Consider a footer link to `/DreamAnchor/`. |
| 🟡 | Add `Sitemap: https://spottechai.com/DreamAnchor/sitemap.xml` to `robots.txt`, or list those URLs in the root `sitemap.xml`. |
| 🟡 | The contact form relies on the visitor's email app (section 8). |
| ⚪ | No analytics are installed. If you add any, update the DreamAnchor Privacy Policy only if it affects the app. The website itself has no privacy policy yet; add one if you add tracking. |

## 11. What's been checked

- JavaScript passes a syntax check (`node --check`).
- Desktop (1440px) and phone (390px) screenshots were reviewed in headless Chrome.
- Every email address on the site is a `mailto:` link to hello@spottechai.com.
- The site is live and loading at https://spottechai.github.io/Website/ (checked 10 Nov 2026).
