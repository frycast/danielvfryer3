import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

async function files(folder) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? files(path.join(folder, e.name))
          : path.join(folder, e.name),
      ),
    )
  ).flat();
}
const all = await files("dist");
const pages = all.filter((f) => f.endsWith(".html"));

test("every local link, media reference, and fragment resolves", async () => {
  for (const file of pages) {
    const html = await fs.readFile(file, "utf8");
    for (const [, raw] of html.matchAll(/(?:href|src|action)="([^"\s]+)"/g)) {
      if (/^(?:https?:|mailto:|tel:|data:)/.test(raw)) continue;
      const [url, hash] = raw.split("#");
      let target = url ? path.join("dist", decodeURIComponent(url)) : file;
      if (url.endsWith("/")) target = path.join(target, "index.html");
      assert.ok(all.includes(target), `${file}: missing ${raw}`);
      if (hash && target.endsWith(".html")) {
        const destination = await fs.readFile(target, "utf8");
        assert.ok(
          destination.includes(`id="${hash}"`),
          `${file}: missing fragment ${raw}`,
        );
      }
    }
  }
});

test("all original publication attachments are preserved byte for byte", async () => {
  for (const file of (await files("content/publication")).filter((f) =>
    /\.(pdf|bib|png)$/.test(f),
  )) {
    const destination = file.replace(/^content/, "dist");
    assert.deepEqual(
      await fs.readFile(destination),
      await fs.readFile(file),
      file,
    );
  }
});

test("all biography paragraphs and publication abstracts render", async () => {
  const home = await fs.readFile("dist/index.html", "utf8");
  const profile = await fs.readFile("content/authors/admin/_index.md", "utf8");
  const body = profile.replace(/\r\n/g, "\n").split("\n---\n")[1];
  for (const paragraph of body.split("\n\n").filter((p) => /^[A-Z]/.test(p))) {
    const beginning = paragraph
      .slice(0, 65)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    assert.ok(
      home.includes(beginning),
      `Missing biography paragraph: ${beginning}`,
    );
  }
  for (const file of (await files("content/publication")).filter(
    (f) => f.endsWith("index.md") && !f.endsWith("_index.md"),
  )) {
    const source = (await fs.readFile(file, "utf8")).replace(/\r\n/g, "\n");
    const data = YAML.parse(source.match(/^---\n([\s\S]*?)\n---/)[1]);
    const html = await fs.readFile(
      file.replace(/^content/, "dist").replace(/\.md$/, ".html"),
      "utf8",
    );
    assert.ok(
      html.includes(data.abstract.slice(0, 100).replace(/&/g, "&amp;")),
    );
    assert.ok(html.includes(data.title.replace(/&/g, "&amp;")));
  }
});

test("the entire biography matches the supplied LinkedIn Summary verbatim, apart from whitespace", async () => {
  const home = await fs.readFile("dist/index.html", "utf8");
  const biography = home.match(/data-biography>([\s\S]*?)<\/div><aside/)[1];
  const text = biography
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  const original = await fs.readFile(
    "tests/fixtures/linkedin-about.txt",
    "utf8",
  );
  assert.equal(text.replace(/\s/g, ""), original.replace(/\s/g, ""));
});

test("all profile experience, education, top skills, languages, and honors are published", async () => {
  const home = await fs.readFile("dist/index.html", "utf8");
  const experience = await fs.readFile("dist/experience/index.html", "utf8");
  const career = YAML.parse(await fs.readFile("data/career.yaml", "utf8"));
  const source = (
    await fs.readFile("content/authors/admin/_index.md", "utf8")
  ).replace(/\r\n/g, "\n");
  const profile = YAML.parse(source.match(/^---\n([\s\S]*?)\n---/)[1]);
  const escaped = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
  assert.equal(career.experience.length, 15);
  assert.equal((experience.match(/class="career-entry"/g) || []).length, 15);
  for (const entry of career.experience) {
    for (const field of [
      entry.organization,
      entry.role,
      entry.start,
      entry.end,
    ])
      assert.ok(experience.includes(escaped(field)), field);
    for (const link of entry.links || [])
      assert.ok(experience.includes(link.url));
  }
  for (const education of profile.education.courses) {
    for (const field of [
      education.course,
      education.institution,
      education.year,
    ])
      assert.ok(home.includes(escaped(field)), String(field));
  }
  for (const skill of profile.top_skills)
    assert.ok(home.includes(escaped(skill)));
  for (const language of profile.languages)
    assert.ok(home.includes(language.proficiency));
  for (const honor of career.honors)
    assert.ok(home.includes(escaped(honor.name)));
  assert.ok(home.includes("mailto:danielvfryer@gmail.com"));
  assert.doesNotMatch(home, /Senior Data Scientist \/ Hon\. Lecturer/);
});

test("Netlify can detect the static contact form and its success destination", async () => {
  const home = await fs.readFile("dist/index.html", "utf8");
  assert.match(home, /name="contact" method="POST" data-netlify="true"/);
  assert.match(home, /name="form-name" value="contact"/);
  assert.match(home, /netlify-honeypot="bot-field"/);
  assert.match(home, /action="\/thank-you\/"/);
  assert.ok(all.includes(path.join("dist", "thank-you", "index.html")));
});

test("draft legal placeholders are not published and Hugo is absent from deployment", async () => {
  assert.ok(!all.some((f) => /(?:privacy|terms)[\\/]index\.html/.test(f)));
  assert.doesNotMatch(await fs.readFile("netlify.toml", "utf8"), /hugo/i);
  for (const file of pages)
    assert.doesNotMatch(
      (await fs.readFile(file, "utf8")).replace(/<pre>[\s\S]*?<\/pre>/g, ""),
      /{{[<%]/,
      file,
    );
});
