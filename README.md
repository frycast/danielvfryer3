# Daniel Fryer's website

A static personal and research website built with Node.js. The build reads the existing Markdown and YAML content, generates HTML into `dist/`, and copies the original images, PDFs, and citations. Hugo and Go are not needed.

## Local development

Use Node.js 22 or later:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. Restart the preview after editing content or templates. `npm run build` generates the production site without starting a server.

## Editing

- `content/authors/admin/_index.md`: biography, role, affiliations, interests, education, and profile links.
- `content/authors/admin/avatar.jpg`: portrait.
- `data/career.yaml`: complete experience history and honors from the supplied LinkedIn profile. The homepage highlights ongoing roles; `/experience/` shows all roles and descriptions.
- `content/home/skills.md`: tools and disciplines.
- `content/publication/<slug>/index.md`: publication metadata, summary, abstract, and body. Put figures, PDFs, and BibTeX files alongside it. Existing publication URLs are preserved.
- `config/_default/params.yaml`: email, location, appointment URL, and contact links.
- `config/_default/config.yaml`: site title and canonical production URL.
- `scripts/build.mjs`: static page templates and content loading.
- `web/styles.css` and `web/site.js`: presentation and progressive publication search.

Original content and the old Hugo template files remain in the repository for reference, including inactive example sections, draft legal placeholders, and `exampleSite/`. They are not used to run or deploy the new site. The old Go module files, theme metadata, and Wowchemy update scripts are also unused. Draft privacy and terms placeholders remain unpublished. Example project, talk, and slide content retains its URLs; the legacy example slide deck is available as a readable document.

Fonts are served locally. Their SIL Open Font Licenses are copied into `dist/fonts/` during the build. The requested Anthropic skill is copied verbatim to `.agents/skills/frontend-design/SKILL.md`; the design plan and visual review are in `docs/design.md`.

## Checks

```sh
npm run build
npm test
npm run dev
# In a second terminal, with Google Chrome installed:
npm run test:browser
```

The content checks verify internal URLs and anchors, byte-for-byte publication attachments, biography and abstracts, draft exclusion, and the Netlify form markup. The complete biography is compared against the extracted LinkedIn Summary, ignoring whitespace only, and checks cover all 15 roles, education, top skills, languages, and honors. Browser checks cover desktop, tablet, narrow phones, publication search, form validation, image loading, navigation, and the full experience page. Screenshots go to ignored `test-results/`. The form is validated locally without sending a message.

## Netlify deployment

Keep the existing Netlify site's GitHub connection and production branch set to **master**. Merging a PR into master or pushing to master triggers the existing Netlify integration. No separate deployment action or token is needed.

The root `netlify.toml` replaces the former Hugo command and cache plugin with:

- Node.js 22
- Build command: `npm run build`
- Publish directory: `dist`
- The same Node build for deploy previews and branch deploys

The production branch setting lives in Netlify's project configuration, not in `netlify.toml`; this PR leaves the existing Git connection in place. Preview deployments get their own canonical URL from Netlify's `DEPLOY_PRIME_URL`. Production uses the existing base URL from the config.

The contact form remains a static Netlify form named `contact`, with a honeypot and a `/thank-you/` destination. Netlify form detection must remain enabled on the connected site. Message delivery can be tested on a Netlify deploy preview after deployment; the local preview does not submit forms.

GitHub Actions builds and checks changes in PRs targeting master and on pushes to master. Netlify handles the actual hosting deployment.
