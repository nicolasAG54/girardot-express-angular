const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.argv[2] || 'http://127.0.0.1:4300';
const out = path.resolve(process.argv[3] || '../.codex_artifacts/hero-video-fix');
fs.mkdirSync(out, { recursive: true });
const report = { cases: [], errors: [] };
const video = p => p.locator('main video');
const control = p => p.locator('.hero-video-control, .project-hero__pause');
async function advances(p) {
 await p.waitForFunction(() => {
  const v = document.querySelector('main video');
  return v && !v.paused && v.readyState >= 2 && v.classList.contains('is-video-ready');
 });
 const before = await video(p).evaluate(v => v.currentTime);
 await p.waitForFunction(t => document.querySelector('main video').currentTime !== t, before);
 await p.waitForFunction(() => /Pausar/.test(document.querySelector('.hero-video-control, .project-hero__pause').getAttribute('aria-label')));
}
async function paused(p) {
 await p.waitForFunction(() => document.querySelector('main video').paused);
 await p.waitForFunction(() => /Reproducir/.test(document.querySelector('.hero-video-control, .project-hero__pause').getAttribute('aria-label')));
}
async function nav(p, label) {
 const menu = p.locator('.menu-button');
 if (await menu.isVisible() && await menu.getAttribute('aria-expanded') !== 'true') await menu.click();
 await p.locator('header nav').getByRole('link', { name: label, exact: true }).click();
 await p.waitForFunction(() => !document.querySelector('.route-curtain'));
}
async function atAnchor(p, id) {
 await p.waitForFunction(id => Math.abs(document.getElementById(id).getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().height) < 5, id);
}
(async () => {
 const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
 try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
   const p = await browser.newPage({ viewport });
   p.on('pageerror', e => report.errors.push(e.message));
   for (const route of ['/', '/proyecto']) {
    await p.goto(base + route); await advances(p);
    await control(p).click(); await paused(p);
    await control(p).click(); await advances(p);
    const topLabel = route === '/' ? 'Inicio' : 'Espacios comerciales';
    await nav(p, 'Contacto'); await paused(p);
    await nav(p, topLabel); await advances(p);
    await control(p).click(); await paused(p);
    await nav(p, 'Contacto'); await nav(p, topLabel); await paused(p);
    await control(p).click(); await advances(p);
    // A background tab pauses; foregrounding resumes only if not manually paused.
    await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await paused(p);
    await p.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await advances(p);
    report.cases.push({ viewport: viewport.width, route, playback: 'pause/play, scroll, manual pause, visibility passed' });
   }
   for (const [text, fragment] of [['Explorar los espacios', 'cifras'], ['Solicitar información comercial', 'contacto-comercial']]) {
    await nav(p, 'Espacios comerciales');
    await p.evaluate(() => { window.originalHero = document.querySelector('main video'); });
    await p.locator('.project-hero__content').getByRole('link', { name: text, exact: true }).click();
    await p.waitForURL(base + '/proyecto#' + fragment); await atAnchor(p, fragment);
    assert.equal(await p.evaluate(() => window.originalHero === document.querySelector('main video')), true);
    assert.equal(await p.locator('.route-curtain').count(), 0);
    report.cases.push({ viewport: viewport.width, cta: text, destination: '/proyecto#' + fragment });
   }
   for (let i = 0; i < 3; i++) {
    await nav(p, 'Inicio'); await advances(p);
    await nav(p, 'Espacios comerciales'); await advances(p);
    await control(p).click(); await paused(p); await control(p).click(); await advances(p);
   }
   report.cases.push({ viewport: viewport.width, repeatedRouteChanges: 6 });
   await p.close();
  }
  for (const route of ['/', '/proyecto']) {
   const p = await browser.newPage({ reducedMotion: 'reduce' });
   p.on('pageerror', e => report.errors.push(e.message));
   await p.goto(base + route); await p.waitForTimeout(500); await paused(p);
   await control(p).click(); await advances(p);
   await control(p).click(); await paused(p);
   report.cases.push({ route, reducedMotion: 'no autoplay; explicit play/pause works' });
   await p.close();
   const retry = await browser.newPage();
   retry.on('pageerror', e => report.errors.push(e.message));
   // Exercise a real failed <source> fetch, then retry without changing routes.
   await retry.route('**/hero-loop.mp4', r => r.abort('failed'));
   await retry.goto(base + route);
   await retry.waitForFunction(() => document.querySelector('main video').networkState === HTMLMediaElement.NETWORK_NO_SOURCE);
   await retry.unroute('**/hero-loop.mp4');
   await control(retry).click(); await advances(retry);
   report.cases.push({ route, failedSource: 'recovered through Play without navigation' });
   await retry.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = 'passed';
 } catch (error) { report.status = 'failed'; report.failure = error.stack; throw error; }
 finally { fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2)); await browser.close(); }
 console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
