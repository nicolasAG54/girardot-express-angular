const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  const output = '../.codex_artifacts/map-loading';
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const map = page.locator('app-location-map');
      const loaded = async () => {
        await map.scrollIntoViewIfNeeded();
        await map.locator('iframe.is-loaded').waitFor({ timeout: 25000 });
        await page.frameLocator('app-location-map iframe').getByText('Términos', { exact: true }).waitFor({ timeout: 15000 });
      };
      await page.goto('http://127.0.0.1:4300/proyecto#ubicacion-proyecto', { waitUntil: 'domcontentloaded' });
      await loaded();
      await map.getByRole('button', { name: 'Terminal', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('app-location-map iframe')?.getAttribute('src')?.includes('Terminal'));
      await loaded();
      const previous = await map.locator('iframe').elementHandle();
      await map.getByRole('button', { name: 'Recargar mapa', exact: true }).click();
      await page.waitForFunction(e => !e.isConnected, previous);
      await loaded();
      assert.equal(await previous.evaluate(e => e.isConnected), false);
      assert.match(await map.locator('iframe').getAttribute('src'), /Terminal/);

      // Exercise client-side page changes through the shared footer links.
      await page.locator('.footer-group').getByRole('link', { name: 'Cómo llegar', exact: true }).click();
      await page.waitForURL('**/#ubicacion');
      await loaded();
      await page.locator('.footer-group').getByRole('link', { name: 'Espacios comerciales', exact: true }).click();
      await page.waitForURL('**/proyecto');
      await loaded();

      await page.locator('.footer-brand').scrollIntoViewIfNeeded();
      await page.locator('.footer-brand img').evaluate(e => e.decode());
      const layout = await page.locator('.footer-brand').evaluate(e => {
        const logo = e.querySelector('a').getBoundingClientRect();
        const text = e.querySelector('p').getBoundingClientRect();
        return { delta: Math.abs(logo.x + logo.width / 2 - text.x - text.width / 2), overflow: document.documentElement.scrollWidth - innerWidth };
      });
      assert.ok(layout.delta < 1);
      assert.equal(layout.overflow, 0);
      await page.screenshot({ path: `${output}/footer-${width}.png` });
      await map.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/map-${width}.png` });
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}px: initial load, reference, reload, both page transitions, centered footer`);
    }

    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const pending = [];
    await page.route('https://maps.google.com/**', route => { pending.push(route); });
    await page.goto('http://127.0.0.1:4300/proyecto#ubicacion-proyecto', { waitUntil: 'domcontentloaded' });
    const map = page.locator('app-location-map');
    await map.getByText('El mapa está tardando en cargar.', { exact: true }).waitFor({ timeout: 16000 });
    await map.getByRole('link', { name: 'Ver en Google Maps' }).waitFor();
    await map.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/slow-map-390.png` });
    await page.unroute('https://maps.google.com/**');
    await map.getByRole('button', { name: 'Volver a cargar', exact: true }).click();
    await Promise.all(pending.map(route => route.abort().catch(() => {})));
    await map.locator('iframe.is-loaded').waitFor({ timeout: 25000 });
    assert.equal(await map.getByText('El mapa está tardando en cargar.', { exact: true }).count(), 0);
    await page.close();
    console.log('PASS stalled map: informative state, external link, successful retry');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
