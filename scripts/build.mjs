import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import YAML from "yaml";

const out = "dist";
const esc = (s = "") =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const read = async (file) => {
  try {
    const source = (await fs.readFile(file, "utf8")).replace(/\r\n/g, "\n");
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
    if (!frontmatter) throw new Error("Expected YAML front matter");
    return {
      data: YAML.parse(frontmatter[1]) || {},
      content: source.slice(frontmatter[0].length),
    };
  } catch (error) {
    throw new Error(`Unable to read ${file}: ${error.message}`, {
      cause: error,
    });
  }
};
const profile = await read("content/authors/admin/_index.md");
const config = YAML.parse(
  await fs.readFile("config/_default/config.yaml", "utf8"),
);
const params = YAML.parse(
  await fs.readFile("config/_default/params.yaml", "utf8"),
);
const skills = (await read("content/home/skills.md")).data.feature;
const career = YAML.parse(await fs.readFile("data/career.yaml", "utf8"));
const person = profile.data;
const base = (
  (process.env.CONTEXT && process.env.CONTEXT !== "production"
    ? process.env.DEPLOY_PRIME_URL
    : "") || config.baseurl
).replace(/\/$/, "");
const socialNames = {
  envelope: "Email",
  "google-scholar": "Google Scholar",
  github: "GitHub",
  orcid: "ORCID",
  linkedin: "LinkedIn",
  medium: "Medium",
  cv: "Download CV",
};
const cv = person.social.find((s) => s.icon === "cv").link;
const socials = () =>
  person.social
    .filter((s) => s.icon !== "envelope" && s.icon !== "cv")
    .map(
      (s) =>
        `<a href="${esc(s.link)}">${socialNames[s.icon] || esc(s.icon)}</a>`,
    )
    .join("");
function markdown(source) {
  // Translate presentation-only Hugo syntax without changing original content.
  const fences = [];
  const protectedSource = source.replace(
    /^```[^\n]*\n[\s\S]*?^```/gm,
    (block) => {
      fences.push(block);
      return `CODEBLOCKPLACEHOLDER${fences.length - 1}END`;
    },
  );
  const translated = protectedSource
    .replace(
      /{{< staticref "([^"]+)"[^>]*>}}([\s\S]*?){{< \/staticref >}}/g,
      "[$2]($1)",
    )
    .replace(/{{[%<]\s*callout\s+\w+\s*[%>]}}/g, "\n<aside>\n")
    .replace(/{{[%<]\s*\/callout\s*[%>]}}/g, "\n</aside>\n")
    .replace(/{{[<%][\s\S]*?[%>]}}/g, "");
  return marked.parse(
    translated.replace(
      /CODEBLOCKPLACEHOLDER(\d+)END/g,
      (_, i) => fences[Number(i)],
    ),
  );
}
const records = [];
for (const kind of ["publication", "project", "event", "slides"]) {
  for (const entry of await fs.readdir(`content/${kind}`, {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const folder = `content/${kind}/${entry.name}`;
    const doc = await read(`${folder}/index.md`);
    if (doc.data.draft) continue;
    records.push({
      ...doc,
      kind,
      slug: entry.name,
      folder,
      url: `/${kind === "event" ? "talk" : kind}/${entry.name}/`,
      files: await fs.readdir(folder),
    });
  }
}
const papers = records
  .filter((r) => r.kind === "publication")
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
function resources(record) {
  const links = [];
  for (const [key, label] of Object.entries({
    url_pdf: "Read paper",
    url_code: "Code",
    url_dataset: "Data",
    url_poster: "Poster",
    url_project: "Project",
    url_slides: "Slides",
    url_source: "Source",
    url_video: "Video",
  })) {
    if (record.data[key])
      links.push(`<a href="${esc(record.data[key])}">${label}</a>`);
  }
  for (const file of record.files.filter((f) => /\.(pdf|bib)$/i.test(f)))
    links.push(
      `<a href="${record.url}${esc(file)}"${file.endsWith(".bib") ? " download" : ""}>${file.endsWith(".bib") ? "Download citation" : "Read paper"}</a>`,
    );
  for (const link of record.data.links || [])
    links.push(`<a href="${esc(link.url)}">${esc(link.name)}</a>`);
  if (typeof record.data.slides === "string" && record.data.slides)
    links.push(`<a href="/slides/${esc(record.data.slides)}/">Slides</a>`);
  if (record.data.doi)
    links.push(`<a href="https://doi.org/${esc(record.data.doi)}">DOI</a>`);
  return `<div class="resource-links">${links.join("")}</div>`;
}
const date = (value) =>
  new Date(value).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
const authors = (record) =>
  (record.data.authors || [])
    .map((a) => (a === "admin" ? person.title : a))
    .join(", ");
function figure(record, className = "") {
  const file = record.files.find((f) =>
    /^featured\.(png|jpg|jpeg|webp)$/.test(f),
  );
  return file
    ? `<figure class="${className}"><img src="${record.url}${file}" alt="${esc(record.data.image?.caption || record.data.title)}" loading="lazy">${className === "detail-figure" ? `<figcaption>${markdown(record.data.image?.caption || "")}</figcaption>` : ""}</figure>`
    : "";
}
function paperList() {
  return `<div class="paper-list">${papers.map((p) => `<article class="paper" data-paper data-search="${esc(`${p.data.title} ${authors(p)} ${p.data.summary}`).toLowerCase()}">${figure(p, "paper-figure")}<div><p class="paper-date">${date(p.data.date)}</p><h3><a href="${p.url}">${esc(p.data.title)}</a></h3><p class="authors">${esc(authors(p))}</p><p>${esc(p.data.summary)}</p>${resources(p)}</div></article>`).join("")}</div><p data-no-results hidden>No papers match your search. Try “Shapley” or clear the search.</p>`;
}
function search() {
  return '<label class="search">Find a publication<input type="search" data-paper-search placeholder="Search title, author or topic" autocomplete="off"></label><p class="sr-only" data-search-status role="status"></p>';
}
function careerEntry(entry, compact = false) {
  const content = compact ? entry.summary : entry.description;
  return `<article class="career-entry"><p class="career-dates">${esc(entry.start)} – ${esc(entry.end)}</p><h3>${esc(entry.role)}</h3>${compact ? `<p class="career-organization">${esc(entry.organization)}</p>` : ""}${!compact && entry.location ? `<p class="career-location">${esc(entry.location)}</p>` : ""}${content ? `<div class="prose">${markdown(content)}</div>` : ""}${!compact && entry.links?.length ? `<div class="resource-links">${entry.links.map((link) => `<a href="${esc(link.url)}">${esc(link.name)}</a>`).join("")}</div>` : ""}</article>`;
}
function careerHistory() {
  const organizations = [
    ...new Set(career.experience.map((e) => e.organization)),
  ];
  return organizations
    .map(
      (organization) =>
        `<section class="career-group"><h2>${esc(organization)}</h2><div>${career.experience
          .filter((e) => e.organization === organization)
          .map((e) => careerEntry(e))
          .join("")}</div></section>`,
    )
    .join("");
}
function honors() {
  return `<ul class="honors-list">${career.honors.map((h) => `<li><h3>${esc(h.name)}</h3>${h.organization || h.year ? `<p>${[h.organization, h.year].filter(Boolean).map(esc).join(", ")}</p>` : ""}${h.description ? `<p>${esc(h.description)}</p>` : ""}</li>`).join("")}</ul>`;
}
const routes = [];
function layout(title, body, url = "/", description = person.bio) {
  const canonical = `${base}${url}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}${title === config.title ? "" : ` | ${esc(config.title)}`}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${base}/media/sharing.jpeg"><link rel="icon" href="/media/icon.png"><link rel="stylesheet" href="/styles.css"><script src="/site.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a><header class="site-header wrap"><a class="brand" href="/">Danny Fryer<span class="brand-dot" aria-hidden="true"></span></a><nav aria-label="Main navigation"><a href="/#about">About</a><a href="/experience/">Experience</a><a href="/#featured">Research</a><a href="/#contact">Contact</a><a class="nav-cv" href="${cv}">CV <span aria-hidden="true">↗</span></a></nav></header><main id="main">${body}</main><footer class="wrap site-footer"><a class="brand" href="/">Danny Fryer</a><p>© ${new Date().getFullYear()} Daniel Fryer</p><a href="/#main">Back to top ↑</a></footer></body></html>`;
}
async function write(url, title, body, description) {
  const destination = url.endsWith(".html")
    ? `${out}${url}`
    : `${out}${url}index.html`;
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, layout(title, body, url, description));
  routes.push(url);
}
// Only remove this build's generated output, never content or repository files.
const outputPath = path.resolve(out);
if (outputPath !== path.join(process.cwd(), "dist"))
  throw new Error("Unsafe output directory");
await fs.rm(outputPath, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp("static", out, { recursive: true });
await fs.cp("assets/media", `${out}/media`, { recursive: true });
await fs.cp("web", out, { recursive: true });
await fs.mkdir(`${out}/fonts`, { recursive: true });
for (const [font, weights] of [
  ["manrope", [400, 500, 600, 700, 800]],
  ["newsreader", [400, 500]],
]) {
  await fs.copyFile(
    `node_modules/@fontsource/${font}/LICENSE`,
    `${out}/fonts/${font}-LICENSE.txt`,
  );
  for (const weight of weights)
    await fs.copyFile(
      `node_modules/@fontsource/${font}/files/${font}-latin-${weight}-normal.woff2`,
      `${out}/fonts/${font}-${weight}.woff2`,
    );
}
const home = `<section class="hero wrap" id="about"><div class="hero-copy"><p class="hello">Hi there, I’m</p><h1>Danny<br>Fryer<span>.</span></h1><p class="role">${esc(person.role)}</p><p class="intro">${esc(person.bio)}</p><div class="hero-actions"><a class="button" href="#featured">Explore my research</a><a class="text-link" href="${cv}">Download CV ↗</a></div></div><div class="portrait-stage"><img class="portrait" src="/authors/admin/avatar.jpg" alt="Portrait of Dr. Danny Fryer" fetchpriority="high" width="600" height="600"><p>Data, decisions<br>& a little curiosity.</p><span class="location">${esc(params.address.city)}, ${esc(params.address.country)}</span></div></section>
<div class="affiliations wrap" aria-label="Affiliations">${person.organizations.map((o) => (o.url ? `<a href="${esc(o.url)}">${esc(o.name)}</a>` : `<span>${esc(o.name)}</span>`)).join("")}</div>
<section class="biography wrap section" id="biography"><div class="section-heading"><h2>A bit about me</h2><p>Engineering, research<br>and making things simpler.</p></div><div class="bio-grid"><div class="prose" data-biography>${markdown(profile.content)}</div><aside class="profile-notes"><h3>Top skills</h3><ul>${person.top_skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><h3>What I’m interested in</h3><ul>${person.interests.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><h3>Education</h3>${person.education.courses.map((e) => `<div class="education"><span>${esc(e.year)}</span><p><strong>${esc(e.course)}</strong><br>${esc(e.institution)}</p></div>`).join("")}<a class="text-link" href="${cv}">View my CV ↗</a><h3>Languages</h3><ul>${person.languages.map((l) => `<li><strong>${esc(l.name)}</strong><br>${esc(l.proficiency)}</li>`).join("")}</ul><h3>Find me online</h3><div class="social-links">${socials()}</div></aside></div></section>
<section class="skills-band" id="skills"><div class="wrap skills-inner"><h2>Tools & disciplines</h2><ul>${skills.map((s) => `<li>${s.icon_pack === "custom" ? `<img src="/media/icon-pack/${s.icon}.svg" alt="" width="26" height="26">` : ""}${esc(s.name)}</li>`).join("")}</ul></div></section>
<section class="wrap section" id="experience"><div class="section-heading"><div><h2>Current work</h2><p>Data infrastructure, teaching and technical leadership.</p></div><a class="text-link" href="/experience/">Full experience</a></div><div class="current-work">${career.experience
  .filter((e) => e.featured)
  .map((e) => careerEntry(e, true))
  .join("")}</div></section>
<section class="wrap section research" id="featured"><div class="section-heading"><div><h2>Research & publications</h2><p>Explainable AI, Shapley values and uncertainty.</p></div><a class="text-link" href="/publication/">All publications</a></div>${paperList()}</section>
<section class="wrap section recognition" id="recognition"><div class="section-heading"><h2>Honors & awards</h2></div>${honors()}</section>
<section class="contact-section" id="contact"><div class="wrap contact-grid"><div><h2>Let’s get in touch.</h2><p>Fill out the form if you’d like to get in touch.</p><a class="email-link" href="mailto:${esc(params.email)}">${esc(params.email)}</a><p>${esc(params.address.city)}, ${esc(params.address.country)}</p><div class="contact-options"><a href="${esc(params.appointment_url)}">Book an appointment ↗</a>${params.contact_links.map((l) => `<a href="${esc(l.link)}">${esc(l.name)}</a>`).join("")}</div><div class="social-links">${socials()}</div></div><form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you/"><input type="hidden" name="form-name" value="contact"><p hidden><label>Leave this empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></p><label>Your name<input name="name" autocomplete="name" required maxlength="200"></label><label>Email address<input type="email" name="email" autocomplete="email" required maxlength="254"></label><label>Message<textarea name="message" rows="5" required maxlength="10000"></textarea></label><button class="button" type="submit">Send message</button></form></div></section>`;
await fs.mkdir(`${out}/authors/admin`, { recursive: true });
await fs.copyFile(
  "content/authors/admin/avatar.jpg",
  `${out}/authors/admin/avatar.jpg`,
);
await write("/", config.title, home);
await write(
  "/experience/",
  "Experience",
  `<section class="wrap section experience-page"><div class="section-heading"><div><h1 class="page-title">Experience</h1><p>Data infrastructure, statistics, research software and education.</p></div><a class="text-link" href="${cv}">Download CV ↗</a></div>${careerHistory()}</section>`,
);
await write(
  "/publication/",
  "Publications",
  `<section class="wrap section"><div class="section-heading"><div><h1 class="page-title">Publications</h1><p>Research by ${esc(person.title)} and collaborators.</p></div>${search()}</div>${paperList()}</section>`,
);
for (const r of records) {
  await fs.mkdir(`${out}${r.url}`, { recursive: true });
  for (const file of r.files.filter((f) => f !== "index.md"))
    await fs.cp(`${r.folder}/${file}`, `${out}${r.url}${file}`, {
      recursive: true,
    });
  await write(
    r.url,
    r.data.title,
    `<article class="wrap detail section"><a class="text-link" href="${r.kind === "publication" ? "/publication/" : "/"}">${r.kind === "publication" ? "All publications" : "Home"}</a><header class="detail-header"><p class="paper-date">${date(r.data.date)}</p><h1 class="page-title">${esc(r.data.title)}</h1><p>${esc(authors(r))}</p>${resources(r)}</header>${figure(r, "detail-figure")}${r.data.abstract ? `<section class="prose"><h2>Abstract</h2>${markdown(r.data.abstract)}</section>` : ""}<div class="prose">${markdown(r.content)}</div></article>`,
    r.data.summary || person.bio,
  );
}
for (const [url, kind, title] of [
  ["/event/", "event", "Recent & Upcoming Talks"],
  ["/talk/", "event", "Talks"],
  ["/project/", "project", "Projects"],
  ["/slides/", "slides", "Slides"],
]) {
  await write(
    url,
    title,
    `<section class="wrap section"><h1 class="page-title">${title}</h1><ul class="archive-list">${records
      .filter((r) => r.kind === kind)
      .map(
        (r) =>
          `<li><a href="${r.url}">${esc(r.data.title)}</a><p>${esc(r.data.summary)}</p></li>`,
      )
      .join("")}</ul></section>`,
  );
}
await write(
  "/post/",
  "Posts",
  '<section class="wrap section"><h1 class="page-title">Posts</h1><p>No posts have been published yet.</p><a href="/">Return home</a></section>',
);
await write(
  "/tag/deep-learning/",
  "Deep Learning",
  '<section class="wrap section"><h1 class="page-title">Deep Learning</h1><a href="/project/example/">Example Project</a></section>',
);
await write(
  "/publication-type/3/",
  "Preprints",
  `<section class="wrap section"><h1 class="page-title">Preprints</h1>${paperList()}</section>`,
);
await write(
  "/thank-you/",
  "Message sent",
  '<section class="wrap section message-page"><h1 class="page-title">Thanks for getting in touch.</h1><p>Your message has been sent.</p><a class="button" href="/">Return home</a></section>',
);
await write(
  "/404.html",
  "Page not found",
  '<section class="wrap section message-page"><h1 class="page-title">Page not found.</h1><p>The page may have moved. You can find my research and contact details on the home page.</p><a class="button" href="/">Return home</a></section>',
);
await fs.writeFile(
  `${out}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter((r) => !["/404.html", "/thank-you/"].includes(r))
    .map((r) => `<url><loc>${esc(base + r)}</loc></url>`)
    .join("")}</urlset>`,
);
await fs.writeFile(
  `${out}/robots.txt`,
  `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
);
await fs.writeFile(
  `${out}/index.xml`,
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Daniel Fryer</title><link>${base}</link><description>Research and publications</description>${papers.map((p) => `<item><title>${esc(p.data.title)}</title><link>${base}${p.url}</link><guid>${base}${p.url}</guid><description>${esc(p.data.summary)}</description></item>`).join("")}</channel></rss>`,
);
console.log(`Built ${routes.length} pages in dist/ without Hugo.`);
