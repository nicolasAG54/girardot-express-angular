const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const base = process.env.BASE_URL || 'http://127.0.0.1:4300';
const tilesUrl = 'https://tile.openstreetmap.org/**';
const tile = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e9eddf"/></svg>';
const fulfillTile = route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: tile });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      let tileRequests = 0;
      page.on('pageerror', error => errors.push(error.message));
      await page.route(tilesUrl, route => { tileRequests += 1; return fulfillTile(route); });
      const map = page.locator('app-location-map');
      const loaded = async () => {
        await map.scrollIntoViewIfNeeded();
        await map.locator('.leaflet-container').waitFor();
        await map.locator('.location-map__status').waitFor({ state: 'hidden' });
        assert.equal(await map.locator('.location-map__notice').count(), 0);
        assert.equal(await map.locator('.location-marker').count(), 5);
      };
      await page.goto(`${base}/proyecto`, { waitUntil: 'domcontentloaded' });
      await page.locator('app-project').waitFor();
      assert.equal(await map.locator('.leaflet-container').count(), 0, 'Leaflet must be lazy below the fold');
      assert.equal(tileRequests, 0, 'No tile requests before the map is visible');
      await loaded();
      const marker = map.locator('.location-marker--terminal');
      await marker.focus();
      await marker.press('Enter');
      await map.locator('.leaflet-popup').waitFor();
      assert.match(await map.locator('.leaflet-popup').innerText(), /Terminal de Transportes de Girardot/);
      await map.getByRole('button', { name: 'Ver todos los puntos del mapa' }).click();
      await map.locator('.leaflet-popup').waitFor({ state: 'detached' });
      const startingPosition = await marker.evaluate(element => { const bounds = element.getBoundingClientRect(); return { x: bounds.x, y: bounds.y }; });
      await map.getByTitle('Acercar mapa', { exact: true }).click();
      await page.waitForFunction(before => { const bounds = document.querySelector('.location-marker--terminal').getBoundingClientRect(); return Math.abs(bounds.x - before.x) > 20; }, startingPosition);
      await map.getByRole('button', { name: 'Ver todos los puntos del mapa' }).click();
      await page.waitForFunction(before => { const bounds = document.querySelector('.location-marker--terminal').getBoundingClientRect(); return Math.abs(bounds.x - before.x) < 1 && Math.abs(bounds.y - before.y) < 1; }, startingPosition);

      // The same component must remount cleanly after Angular client navigation.
      await page.locator('.footer-group').getByRole('link', { name: 'Cómo llegar', exact: true }).click();
      await page.waitForURL('**/#ubicacion');
      await loaded();
      await page.locator('.footer-group').getByRole('link', { name: 'Espacios comerciales', exact: true }).click();
      await page.waitForURL('**/proyecto');
      await loaded();
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}px: lazy loading, five simultaneous markers, keyboard popup, zoom/reset, route cleanup`);
    }

    // Delayed and failed external tiles retain navigation and offer a working retry.
    for (const failure of ['slow', 'error']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      const pending = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route(tilesUrl, route => failure === 'error' ? route.abort() : pending.push(route));
      await page.goto(`${base}/proyecto#ubicacion-proyecto`, { waitUntil: 'domcontentloaded' });
      const map = page.locator('app-location-map');
      await map.scrollIntoViewIfNeeded();
      await map.getByText(failure === 'slow' ? 'El mapa está tardando en cargar.' : 'No pudimos cargar el mapa.', { exact: true }).waitFor({ timeout: 16000 });
      assert.match(await map.getByRole('link', { name: 'Abrir en Google Maps' }).getAttribute('href'), /4.299272/);
      await page.unroute(tilesUrl);
      await page.route(tilesUrl, fulfillTile);
      await map.getByRole('button', { name: 'Volver a cargar', exact: true }).click();
      await Promise.all(pending.map(route => route.abort().catch(() => {})));
      await map.locator('.location-map__status').waitFor({ state: 'hidden' });
      await map.locator('.location-map__notice').waitFor({ state: 'hidden' });
      assert.equal(await map.locator('.location-marker').count(), 5);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${failure}: recovery notice, persistent external link, successful retry`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
