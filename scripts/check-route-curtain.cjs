/* NODE_PATH must expose Playwright; BROWSER_EXECUTABLE can select Edge/Chrome. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:4300';
const out = path.resolve(process.argv[3] || '../.codex_artifacts/route-curtain');
fs.mkdirSync(out, { recursive: true });
const report = { cases: [], errors: [] };
async function menu(p) {
 const button = p.locator('.menu-button');
 if (await button.isVisible() && await button.getAttribute('aria-expanded') !== 'true') await button.click();
}
async function click(p, label) {
 await menu(p);
 await p.locator('header nav').getByRole('link', { name: label, exact: true }).click();
}
async function idle(p) {
 await p.waitForFunction(() => !document.querySelector('.route-curtain'));
 await p.waitForTimeout(650);
}
(async () => {
 const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
 try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
   const p = await browser.newPage({ viewport });
   p.on('pageerror', e => report.errors.push(e.message));
   await p.goto(base); await p.waitForTimeout(1000);
   assert.equal(await p.locator('.route-curtain').count(), 0);
   for (const [label, target] of [['Espacios comerciales', '/proyecto'], ['Inicio', '/']]) {
    await menu(p);
    const from = new URL(p.url()).pathname;
    // Hold the entrance just before completion to inspect the diagonal joins
    // while the real guard is still waiting to commit the destination.
    await p.evaluate(() => {
     window.curtainHeld = false;
     const observer = new MutationObserver(() => {
      if (!document.querySelector('.route-curtain')) return;
      observer.disconnect();
      requestAnimationFrame(() => {
       window.curtainAnimations = document.getAnimations().filter(a => a.effect?.target?.closest?.('.route-curtain'));
       window.curtainAnimations.forEach(a => { a.pause(); a.currentTime = 170; });
       window.curtainHeld = true;
      });
     });
     observer.observe(document.body, { childList: true });
    });
    await p.locator('header nav').getByRole('link', { name: label, exact: true }).click();
    await p.waitForFunction(() => window.curtainHeld);
    assert.equal(new URL(p.url()).pathname, from, 'Destination must wait for cover');
    const geometry = await p.evaluate(() => {
     const e = document.querySelector('.route-curtain');
     const r = e.getBoundingClientRect();
     const paints = [...e.querySelectorAll('.route-curtain__paint--surface')];
     const first = paints[0].getAnimations()[0], last = paints.at(-1).getAnimations()[0];
     return { direction: e.dataset.direction, origin: first.effect.getKeyframes()[0].transform, firstDelay: first.effect.getTiming().delay, lastDelay: last.effect.getTiming().delay, width: r.width, height: r.height, color: getComputedStyle(paints[0]).backgroundColor, skew: getComputedStyle(e.firstElementChild).transform, overflow: document.documentElement.scrollWidth - innerWidth, headerTop: document.querySelector('header').getBoundingClientRect().top };
    });
    assert.equal(geometry.color, 'rgb(255, 207, 23)');
    assert.equal(geometry.skew, 'matrix(1, 0, -1, 1, 0, 0)');
    assert.equal(geometry.width, viewport.width); assert.equal(geometry.height, viewport.height); assert.equal(geometry.overflow, 0);
    assert.equal(geometry.direction, target === '/' ? 'to-home' : 'to-project');
    assert.equal(geometry.origin, target === '/' ? 'translateY(101%) scaleX(0.86)' : 'translateY(-101%) scaleX(0.86)');
    assert.equal(geometry.firstDelay > geometry.lastDelay, target === '/');
    await p.screenshot({ path: path.join(out, `${viewport.width}-${target === '/' ? 'home' : 'project'}-entering.png`) });
    await p.evaluate(() => window.curtainAnimations.forEach(a => { a.currentTime = 260; }));
    await p.screenshot({ path: path.join(out, `${viewport.width}-${target === '/' ? 'home' : 'project'}-assembling.png`) });
    await p.evaluate(() => window.curtainAnimations.forEach(a => { a.currentTime = a.effect.getComputedTiming().endTime - 0.01; }));
    assert.equal(await p.locator('.route-curtain__signature').count(), await p.locator('.route-curtain__paint--surface').count());
    assert.ok(await p.locator('.route-curtain__signature').evaluateAll(es => es.every(e => e.parentElement.parentElement.classList.contains('route-curtain__paint--surface') && e.getAnimations().length === 0 && getComputedStyle(e).opacity === '1')));
    const signature = await p.locator('.route-curtain__signature').first().evaluate(e => {
     const img = e.querySelector('img');
     return { ready: img.complete && img.naturalWidth > 0, src: img.getAttribute('src'), bounds: e.getBoundingClientRect().toJSON(), opacity: getComputedStyle(e).opacity };
    });
    assert.equal(signature.ready, true, 'Logo must be decoded before painting the curtain');
    assert.ok(signature.src.endsWith('/assets/brand/girardot-express-logo.png'));
    assert.equal(signature.opacity, '1');
    const r = signature.bounds;
    assert.ok(r.left >= 0 && r.right <= viewport.width && r.top >= 0 && r.bottom <= viewport.height);
    assert.ok(Math.abs(r.width - r.height) < 1, 'Keep the official logo square');
    assert.ok(Math.abs((r.left + r.right) / 2 - viewport.width / 2) < 2);
    assert.ok(Math.abs((r.top + r.bottom) / 2 - viewport.height / 2) < 2);
    assert.equal(await p.locator('.route-curtain__paint--accent').first().evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(237, 108, 25)');
    await p.screenshot({ path: path.join(out, `${viewport.width}-${target === '/' ? 'home' : 'project'}-covered.png`) });
    await p.evaluate(() => window.curtainAnimations.forEach(a => a.finish()));
    await p.waitForURL(base + target); await idle(p);
    assert.ok(await p.evaluate(() => scrollY <= 4));
    assert.equal(await p.evaluate(() => document.activeElement.tagName), 'H1');
    report.cases.push({ viewport: viewport.width, target, coveredBeforeNavigation: true, ...geometry });
   }
   await click(p, 'Nuestras marcas');
   await p.waitForFunction(() => Math.abs(document.getElementById('marcas').getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().height) <= 4);
   assert.equal(await p.locator('.route-curtain').count(), 0);
   await click(p, 'Espacios comerciales'); await p.waitForURL('**/proyecto'); await idle(p);
   await p.goBack(); await p.waitForURL('**/#marcas'); await idle(p);
   const anchorTop = await p.locator('#marcas').evaluate(e => e.getBoundingClientRect().top);
   const headerHeight = await p.locator('header').evaluate(e => e.getBoundingClientRect().height);
   assert.ok(Math.abs(anchorTop - headerHeight) <= 4, `History anchor ${anchorTop}, header ${headerHeight}`);
   // Resize during entry must release the guard and remove an obsolete geometry.
   await click(p, 'Espacios comerciales');
   await p.setViewportSize({ width: viewport.width - 10, height: viewport.height });
   await p.waitForURL('**/proyecto'); await idle(p);
   report.cases.push({ viewport: viewport.width, anchors: true, history: true, resizeDuringNavigation: true });
   await p.close();
  }
  const interrupted = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  interrupted.on('pageerror', e => report.errors.push(e.message));
  await interrupted.goto(base); await interrupted.waitForTimeout(700);
  await click(interrupted, 'Espacios comerciales');
  await interrupted.waitForSelector('.route-curtain[data-phase="covering"]');
  await click(interrupted, 'Inicio');
  await idle(interrupted);
  assert.equal(new URL(interrupted.url()).pathname, '/');
  report.cases.push({ rapidCancellation: true, curtainRemoved: true });
  await interrupted.close();
  for (const variant of ['reduced', 'keyboard', 'no-waapi', 'logo-error']) {
   const p = await browser.newPage({ viewport: { width: 1440, height: 960 }, ...(variant === 'reduced' ? { reducedMotion: 'reduce' } : {}) });
   p.on('pageerror', e => report.errors.push(e.message));
   if (variant === 'no-waapi') await p.addInitScript(() => { Element.prototype.animate = undefined; });
   if (variant === 'logo-error') await p.route('**/girardot-express-logo.png', route => route.abort('failed'));
   await p.goto(base); await p.waitForTimeout(700);
   await p.evaluate(() => {
    window.sawCurtain = false;
    new MutationObserver(records => { if (records.some(r => [...r.addedNodes].some(n => n.classList?.contains('route-curtain')))) window.sawCurtain = true; }).observe(document.body, { childList: true });
   });
   if (variant === 'keyboard') {
    await p.locator('header nav').getByRole('link', { name: 'Espacios comerciales', exact: true }).focus();
    await p.keyboard.press('Enter');
   } else await click(p, 'Espacios comerciales');
   await p.waitForURL('**/proyecto'); await idle(p);
   assert.equal(await p.evaluate(() => window.sawCurtain), false);
   report.cases.push({ variant, immediateNavigation: true });
   await p.close();
  }
  assert.deepEqual(report.errors, []); report.status = 'passed';
 } catch (error) { report.status = 'failed'; report.failure = error.stack; throw error; }
 finally { fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2)); await browser.close(); }
 console.log(JSON.stringify({ status: report.status, cases: report.cases.length, errors: report.errors }));
})().catch(error => { console.error(error); process.exitCode = 1; });
