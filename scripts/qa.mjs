import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
try {
  await fs.mkdir("test-results", { recursive: true });
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => failures.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    await page.goto("http://127.0.0.1:4321/");
    await page.evaluate(() => document.fonts.ready);
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
    await page.close();
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto("http://127.0.0.1:4321/");
  assert.equal(await noJS.locator(".paper").count(), 3);
  assert.ok(await noJS.locator("form").isVisible());
  await noJS.close();
  assert.deepEqual(failures, []);
  console.log(
    "Browser QA passed at 1440, 768, 390, and 320px: images, overflow, navigation, search, form validation, and no-JS content.",
  );
} finally {
  await browser.close();
}
