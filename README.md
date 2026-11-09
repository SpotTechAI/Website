# SpotTechAI Website

The website for [spottechai.com](https://spottechai.com/). It is a static site (plain HTML, CSS and JavaScript) with no build step.

## Structure

```
index.html            Main page (all sections)
404.html              Not-found page
assets/css/styles.css Styles
assets/js/main.js     Navigation, animations, hero particle network, contact form
assets/img/           Logo (logo.png for light backgrounds, logo-white.png for dark),
                      trident mark, favicon and apple-touch-icon
CNAME                 Custom domain for GitHub Pages
robots.txt, sitemap.xml
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

## Deploy (GitHub Pages)

1. Push to `main`.
2. In the repo, go to **Settings → Pages**, set the source to **Deploy from a branch**, and pick `main` / root.
3. The `CNAME` file sets the custom domain to `spottechai.com`. At your DNS provider, add `A` records for `@` pointing to
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a `CNAME` record for `www` pointing to `spottechai.github.io`.
4. Turn on **Enforce HTTPS** once the certificate is issued.

## Contact form

The form opens the visitor's email app with a pre-filled message to `hello@spottechai.com`. To receive submissions without
relying on the visitor's email app, point the form at a form service (for example Formspree) and update `assets/js/main.js`.
