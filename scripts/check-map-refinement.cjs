const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:4300';
const tile = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e9eddf"/></svg>';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  const results = [];
  try {
    for (const width of [1440, 768, 390, 320]) {
      for (const route of ['/#ubicacion', '/proyecto#ubicacion-proyecto']) {
        const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
        // Functional layout tests never bulk-fetch map tiles from the public service.
        await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: tile }));
        await page.goto(base + route);
        const map = page.locator('app-location-map');
        await map.scrollIntoViewIfNeeded();
        await map.locator('.leaflet-container').waitFor();
        await map.locator('.location-map__status').waitFor({ state: 'hidden' });
        const info = await map.evaluate(element => {
          const canvas = element.querySelector('.location-map__canvas').getBoundingClientRect();
          const labels = [...element.querySelectorAll('.location-marker__label')].map(label => {
            const bounds = label.getBoundingClientRect();
            return { text: label.textContent, left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom };
          });
          const overlaps = labels.flatMap((a, i) => labels.slice(i + 1).filter(b => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top).map(b => [a.text, b.text]));
          const clipped = labels.filter(label => label.left < canvas.left || label.right > canvas.right || label.top < canvas.top || label.bottom > canvas.bottom).map(label => label.text);
          return { height: canvas.height, overflow: document.documentElement.scrollWidth - innerWidth, labels, overlaps, clipped, filter: getComputedStyle(element.querySelector('.leaflet-tile-pane')).filter };
        });
        assert.equal(info.overflow, 0);
        assert.equal(info.height, width > 700 ? 540 : 440);
        assert.equal(info.filter, 'none');
        assert.equal(info.labels.length, 5);
        assert.deepEqual(info.overlaps, [], `${width} ${route}: overlapping labels; ${JSON.stringify(info.labels)}`);
        assert.deepEqual(info.clipped, [], `${width} ${route}: clipped labels`);
        assert.equal(await map.locator('.location-map__choices').count(), 0);
        results.push({ width, route, ...info });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
