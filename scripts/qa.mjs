import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const background = (page) =>
  page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor);
async function verifyThemes(page, width) {
  const picker = page.getByLabel("Color theme");
  await expect(picker).toHaveValue("automatic");
  const light = await background(page);
  await picker.selectOption("dark");
  await expect.poll(() => background(page)).not.toBe(light);
  const dark = await background(page);
  await page.emulateMedia({ colorScheme: "light" });
  assert.equal(await background(page), dark, "Explicit dark overrides the OS");
  await page.reload();
  await expect(picker).toHaveValue("dark");
  assert.equal(await background(page), dark, "Dark persists after reload");
  await page.locator('nav a[href="/experience/"]').click();
  await expect(picker).toHaveValue("dark");
  assert.equal(await background(page), dark, "Dark persists across pages");
  await page.goto("http://127.0.0.1:4321/");
  await page.evaluate(() => document.fonts.ready);
  if (width === 1440 || width === 390)
    await page.screenshot({ path: `test-results/hero-dark-${width}.png` });
  await page.emulateMedia({ colorScheme: "dark" });
  await picker.selectOption("light");
  assert.equal(
    await background(page),
    light,
    "Explicit light overrides the OS",
  );
  await page.reload();
  await expect(picker).toHaveValue("light");
  assert.equal(await background(page), light);
  await picker.selectOption("automatic");
  assert.equal(
    await background(page),
    dark,
    "Automatic uses the OS dark theme",
  );
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => background(page)).toBe(light);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => background(page)).toBe(dark);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `Dark home overflows at ${width}`,
  );
  await page.emulateMedia({ colorScheme: "light" });
}
try {
  await fs.mkdir("test-results", { recursive: true });
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      deviceScaleFactor: 1,
      colorScheme: "light",
    });
    page.on("pageerror", (e) => failures.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    await page.goto("http://127.0.0.1:4321/");
    await page.evaluate(() => document.fonts.ready);
    await verifyThemes(page, width);
    const expectedBio = await fs.readFile(
      "tests/fixtures/linkedin-about.txt",
      "utf8",
    );
    assert.equal(
      (await page.locator("[data-biography]").innerText()).replace(/\s/g, ""),
      expectedBio.replace(/\s/g, ""),
    );
    assert.equal(await page.locator(".current-work .career-entry").count(), 3);
    assert.equal(await page.locator(".education").count(), 3);
    if (width === 1440 || width === 390)
      await page.screenshot({ path: `test-results/hero-${width}.png` });
    assert.equal(await page.locator("h1").innerText(), "Danny\nFryer.");
    assert.equal(await page.locator(".paper").count(), 3);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Home overflows at ${width}`,
    );
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      assert.ok(
        await img.evaluate((i) => i.naturalWidth > 0),
        await img.getAttribute("src"),
      );
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page.locator('nav a[href="/#contact"]').click();
    await page.locator('input[name="name"]').fill("Preview test");
    await page.locator('input[name="email"]').fill("preview@example.com");
    await page
      .locator('textarea[name="message"]')
      .fill("A locally validated form, not submitted.");
    assert.ok(
      await page.locator("form").evaluate((form) => form.checkValidity()),
    );
    await page.goto("http://127.0.0.1:4321/publication/");
    await page.locator("[data-paper-search]").fill("non-linear");
    assert.equal(await page.locator("[data-paper]:visible").count(), 1);
    await page.locator("[data-paper-search]").fill("no-such-paper");
    assert.ok(await page.locator("[data-no-results]").isVisible());
    await page.locator("[data-paper-search]").fill("");
    assert.equal(await page.locator("[data-paper]:visible").count(), 3);
    await page.locator(".paper h3 a").first().click();
    assert.ok(
      await page.locator("h2").filter({ hasText: "Abstract" }).isVisible(),
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Paper overflows at ${width}`,
    );
    await page.screenshot({
      path: `test-results/publication-${width}.png`,
      fullPage: true,
    });
    await page.getByLabel("Color theme").selectOption("dark");
    assert.equal(
      await page
        .locator(".detail-figure")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(255, 255, 255)",
      "Research figures keep a white background",
    );
    await page.screenshot({
      path: `test-results/publication-dark-${width}.png`,
      fullPage: true,
    });
    await page.locator('nav a[href="/experience/"]').click();
    assert.equal(await page.locator(".career-entry").count(), 15);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Experience overflows at ${width}`,
    );
    await page.screenshot({
      path: `test-results/experience-${width}.png`,
      fullPage: true,
    });
    await page.close();
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto("http://127.0.0.1:4321/");
  assert.equal(await noJS.getByLabel("Color theme").isVisible(), false);
  await noJS.emulateMedia({ colorScheme: "light" });
  const noJSLight = await background(noJS);
  await noJS.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => background(noJS)).not.toBe(noJSLight);
  assert.equal(await noJS.locator(".paper").count(), 3);
  assert.ok(await noJS.locator("form").isVisible());
  await noJS.locator('nav a[href="/experience/"]').click();
  assert.equal(await noJS.locator(".career-entry").count(), 15);
  await noJS.close();
  const restricted = await browser.newPage();
  restricted.on("pageerror", (e) => failures.push(e.message));
  await restricted.addInitScript(() => {
    for (const method of ["getItem", "setItem"])
      Object.defineProperty(Storage.prototype, method, {
        value() {
          throw new DOMException("Storage blocked", "SecurityError");
        },
      });
  });
  await restricted.goto("http://127.0.0.1:4321/");
  await restricted.getByLabel("Color theme").selectOption("dark");
  await expect(restricted.locator("html")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await restricted.close();
  assert.deepEqual(failures, []);
  console.log(
    "Browser QA passed at 1440, 768, 390, and 320px: Light/Dark/Automatic, persistence, system changes, blocked storage, exact biography, experience, images, navigation, search, forms, and no-JS content.",
  );
} finally {
  await browser.close();
}
