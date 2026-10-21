# Daniel Fryer's website

A static personal and research website built with Node.js, Markdown, and YAML. Netlify builds the site when changes reach `master`.

## Develop

Use Node.js 22 or later:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. Restart the preview after editing. `npm run build` generates the production site in `dist/`.

## Edit content

- `content/profile.md`: biography, headline, affiliations, education, interests, languages, social links, and CV URL.
- `assets/media/portrait.jpg`: profile photo.
- `data/site.yaml`: site title, production URL, contact email, location, appointment URL, and contact links.
- `data/skills.yaml`: the six skills and disciplines on the homepage.
- `data/career.yaml`: experience and honors. Roles marked `featured: true` appear on the homepage; `/experience/` shows the full history.
- `content/publication/<slug>/index.md`: paper title, authors, date, summary, abstract, and body. Images, PDFs, and BibTeX files live beside the Markdown. Their existing URLs are preserved. Optional `links` entries use `name` and `url`.

`scripts/build.mjs` generates the pages. `web/styles.css` controls the appearance, and `web/site.js` adds publication search. Fonts are hosted locally, with their licenses included in the build. The repository license and requested frontend design skill are retained.

[Design notes](docs/design.md) describe the layout and palette. [Profile provenance](docs/profile-update.md) records the supplied LinkedIn source and biography verification.

## Verify

```sh
npm run build
npm test
# With the preview running and Google Chrome installed:
npm run test:browser
```

Content checks verify local URLs and anchors, original publication attachments, the exact biography, career and education details, Netlify form markup, and the published page list. Browser checks cover desktop and mobile layouts, publication search, image loading, form validation, and navigation without JavaScript. Screenshots are saved to ignored `test-results/`. Tests do not send messages.

## Deploy

Keep the existing Netlify GitHub connection and production branch set to **master**. The root `netlify.toml` sets Node.js 22, the build command `npm run build`, and the publish directory `dist`. These settings also apply to deploy previews and branch deployments. Previews use Netlify's `DEPLOY_PRIME_URL` for canonical URLs; production uses `data/site.yaml`.

The contact form is named `contact`, includes a honeypot, and redirects successful submissions to `/thank-you/`. Netlify form detection must be enabled. Local preview supports reading and validation; actual delivery runs through Netlify.

GitHub Actions builds and checks PRs targeting `master` and pushes to `master`. Netlify handles hosting and deployment.
