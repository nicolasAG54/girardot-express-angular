// Verifies local data handling; window.open is stubbed, so no message is sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4300';
const output = process.argv[2] || path.resolve('../.codex_artifacts/privacy-2026-10-09');

async function checkLayout(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page overflows horizontally');
}

async function checkContrast(page) {
  const values = await page.evaluate(() => {
    const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
    const luminance = value => rgb(value).map(channel => {
      const scaled = channel / 255;
      return scaled <= .04045 ? scaled / 12.92 : ((scaled + .055) / 1.055) ** 2.4;
    }).reduce((sum, channel, i) => sum + channel * [.2126, .7152, .0722][i], 0);
    const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
    const input = document.querySelector('#contact-name');
    const style = getComputedStyle(input);
    return {
      fieldText: ratio(style.color, style.backgroundColor),
      fieldBorder: ratio(style.borderTopColor, style.backgroundColor),
      placeholder: ratio(getComputedStyle(input, '::placeholder').color, style.backgroundColor),
    };
  });
  assert.ok(values.fieldText >= 4.5 && values.placeholder >= 4.5 && values.fieldBorder >= 3, JSON.stringify(values));
  return values;
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const results = [];
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      const hosts = new Set();
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => hosts.add(new URL(request.url()).hostname));
      // External tiles are isolated from provider availability; real URLs still get observed.
      await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e9eddf"/></svg>' }));
      await page.goto(`${base}/privacidad`, { waitUntil: 'networkidle' });
      assert.match(await page.locator('main h1').innerText(), /Privacidad/);
      assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, follow');
      assert.match(await page.locator('.legal-draft').innerText(), /Borrador/);
      assert.equal(await page.locator('.context-nav a.is-active').count(), 0);
      await checkLayout(page);
      await page.screenshot({ path: path.join(output, `privacy-${width}.png`) });
      await page.locator('.legal-navigation a[href="/cookies"]').click();
      await page.waitForURL('**/cookies');
      assert.match(await page.locator('main h1').innerText(), /Cookies/);
      assert.equal(await page.locator('meta[name=robots]').count(), 0, 'Draft noindex leaked to another page');
      assert.match(await page.locator('main').innerText(), /tile.openstreetmap.org/);
      await page.locator('.legal-navigation a[href="/terminos"]').focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/terminos');
      assert.match(await page.locator('main h1').innerText(), /Términos/);
      await checkLayout(page);
      await page.locator('.footer-legal a[href="/privacidad#solicitudes"]').click();
      await page.waitForURL('**/privacidad#solicitudes');
      await page.waitForFunction(() => {
        const top = document.querySelector('#solicitudes').getBoundingClientRect().top;
        return top >= document.querySelector('header.site-header').getBoundingClientRect().height - 4 && top < innerHeight - 100;
      });
      await page.locator('.legal-back').click();
      await page.waitForURL(base + '/');
      await page.locator('app-location-map').scrollIntoViewIfNeeded();
      await page.locator('.leaflet-tile-loaded').first().waitFor();
      assert.match(await page.locator('.location-map__privacy').innerText(), /OpenStreetMap/);
      assert.equal(await page.locator('a[href^="mailto:"]').count(), 0, 'Unverified mailbox is still offered');
      await page.locator('app-contact-form').scrollIntoViewIfNeeded();
      await page.evaluate(() => { window.__preparedMessages = []; window.open = (...args) => { window.__preparedMessages.push(args); return null; }; });
      const form = page.locator('app-contact-form');
      assert.equal(await form.locator('#contact-consent').isChecked(), false);
      await form.locator('#contact-name').fill('Consulta de prueba');
      await form.locator('#contact-phone').fill('3135550101');
      await form.locator('#contact-email').fill('test@example.com');
      await form.locator('#contact-interest').selectOption('Información general');
      await form.locator('#contact-message').fill('Quisiera conocer el proyecto.');
      await form.getByRole('button', { name: 'Continuar por WhatsApp', exact: true }).click();
      await page.waitForFunction(() => document.activeElement?.id === 'contact-consent');
      assert.equal(await page.evaluate(() => window.__preparedMessages.length), 0);
      await form.locator('#contact-consent').check();
      await form.getByRole('button', { name: 'Continuar por WhatsApp', exact: true }).click();
      const prepared = await page.evaluate(() => window.__preparedMessages);
      assert.equal(prepared.length, 1);
      const message = new URL(prepared[0][0]).searchParams.get('text');
      assert.match(message, /Autorización de contacto \(2026-10-09\)/);
      assert.match(message, /se compartan con WhatsApp/);
      assert.ok(!message.includes('Empresa o marca:'));
      assert.equal(await form.locator('.privacy-link').getAttribute('target'), '_blank');
      await form.getByRole('button', { name: 'Borrar formulario', exact: true }).click();
      assert.equal(await form.locator('#contact-name').inputValue(), '');
      assert.equal(await form.locator('#contact-consent').isChecked(), false);
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'contact-name');
      const contrast = await checkContrast(page);
      await checkLayout(page);
      await form.screenshot({ path: path.join(output, `contact-${width}.png`) });
      await page.getByRole('button', { name: 'Abrir asistente de Girardot Express', exact: true }).click();
      await page.locator('.chatbot-quick-actions button').first().click();
      await page.getByRole('button', { name: 'Tengo una marca', exact: true }).click();
      await page.locator('.chatbot-quick-actions button').first().click();
      await page.locator('#chatbot-message').fill('Borrador de prueba');
      await page.getByRole('button', { name: 'Borrar conversación', exact: true }).click();
      for (const audience of ['Soy visitante', 'Tengo una marca']) {
        await page.getByRole('button', { name: audience, exact: true }).click();
        assert.equal(await page.locator('.chatbot-message').count(), 1);
        assert.equal(await page.locator('#chatbot-message').inputValue(), '');
      }
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      assert.equal((await context.cookies()).length, 0);
      assert.deepEqual([...hosts].filter(host => !['127.0.0.1', 'tile.openstreetmap.org'].includes(host)), []);
      await page.locator('.chatbot-panel').screenshot({ path: path.join(output, `chat-${width}.png`) });
      await page.getByRole('button', { name: 'Cerrar asistente', exact: true }).click();
      await page.goto(`${base}/proyecto#contacto-comercial`, { waitUntil: 'networkidle' });
      await page.locator('app-contact-form').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('#contact-company').getAttribute('maxlength'), '150');
      assert.equal(await page.locator('#contact-consent').isChecked(), false);
      assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
      await checkLayout(page);
      assert.equal(await page.locator('img:not([alt])').count(), 0);
      assert.deepEqual(errors, []);
      results.push({ width, contrast, hosts: [...hosts], cookies: 0, persistentStorageEntries: 0, passed: true });
      console.log(`PASS ${width}px: legal routes, draft metadata cleanup, keyboard, explicit authorization, local erasure, storage and observed network`);
      await context.close();
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
