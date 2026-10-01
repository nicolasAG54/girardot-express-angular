// One desktop/mobile visual pass for the V3 client refinements.
// NODE_PATH must expose Playwright; BROWSER_EXECUTABLE can select an installed browser.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve(process.argv[2] || '../.codex_artifacts/v3-client-refinement');
const base = process.env.BASE_URL || 'http://127.0.0.1:4300';
// Hide fixed furniture only in section exports so it cannot cover their content.
const sectionStyle = '.site-header, app-chatbot-widget { visibility: hidden !important; }';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  const report = { layouts: [], errors: [] };
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => report.errors.push(error.message));
      for (const [route, label, section] of [['/', 'home', '#ubicacion'], ['/proyecto', 'project', '#ubicacion-proyecto']]) {
        await page.goto(base + route);
        await page.evaluate(() => document.fonts.ready);
        await page.locator('.brand img').waitFor();
        await page.screenshot({ path: path.join(output, `${width}-${label}-header.png`) });
        const geometry = await page.evaluate(() => ({
          width: innerWidth,
          route: location.pathname,
          logoWidth: document.querySelector('.brand').getBoundingClientRect().width,
          overflow: document.documentElement.scrollWidth - innerWidth,
        }));
        assert.equal(geometry.overflow, 0, JSON.stringify(geometry));
        report.layouts.push(geometry);
        await page.locator(section).scrollIntoViewIfNeeded();
        await page.locator('app-location-map .leaflet-container').waitFor();
        await page.waitForFunction(() => [...document.querySelectorAll('.leaflet-tile')].some(tile => tile.complete && tile.naturalWidth > 0), undefined, { timeout: 20000 });
        await page.waitForTimeout(800);
        await page.locator(section).screenshot({ path: path.join(output, `${width}-${label}-map.png`), style: sectionStyle });
      }
      await page.goto(base + '/preguntas-frecuentes');
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.faq-list details').count(), 8);
      await page.locator('.faq-list summary').first().click();
      await page.locator('app-faq').screenshot({ path: path.join(output, `${width}-faq.png`), style: sectionStyle });
      await page.locator('.site-footer').screenshot({ path: path.join(output, `${width}-footer.png`), style: sectionStyle });
      await page.close();
    }
    assert.deepEqual(report.errors, []);
  } finally {
    fs.writeFileSync(path.join(output, 'visual-report.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
