const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.argv[2] || 'http://127.0.0.1:4300';
const results = [];
async function click(p, label) {
 const menu = p.locator('.menu-button');
 if (await menu.isVisible() && await menu.getAttribute('aria-expanded') !== 'true') await menu.click();
 await p.locator('header nav').getByRole('link', { name: label, exact: true }).click();
}
async function sample(p) {
 await p.evaluate(() => {
  window.indicatorSamples = [];
  window.indicatorInterval = setInterval(() => window.indicatorSamples.push({
   label: document.querySelector('header nav [aria-current]')?.textContent.trim(), y: scrollY,
  }), 16);
 });
}
async function checkSamples(p, label) {
 const samples = await p.evaluate(() => { clearInterval(window.indicatorInterval); return window.indicatorSamples; });
 const first = samples.findIndex(s => s.label === label);
 assert.ok(first >= 0, JSON.stringify(samples));
 assert.ok(samples.slice(first).every(s => s.label === label), JSON.stringify(samples));
 assert.ok(samples.slice(first).some(s => Math.abs(s.y - samples.at(-1).y) > 100), 'Target must be selected before arrival');
 return [...new Set(samples.map(s => s.label))];
}
async function arrival(p, id) {
 await p.waitForFunction(id => Math.abs(document.getElementById(id).getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().height) <= 4, id);
 await p.waitForTimeout(200);
}
(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
 try {
  for (const width of [1440, 390]) {
   const p = await browser.newPage({ viewport: { width, height: 960 } });
   for (const [route, contact, top] of [['/', 'contacto', 'Inicio'], ['/proyecto', 'contacto-comercial', 'Espacios comerciales']]) {
    await p.goto(base + route); await p.waitForTimeout(700);
    await sample(p); await click(p, 'Contacto'); await arrival(p, contact);
    const labels = await checkSamples(p, 'Contacto');
    await sample(p); await click(p, top); await p.waitForFunction(() => scrollY <= 4); await p.waitForTimeout(200);
    await checkSamples(p, top);
    // A second click replaces an in-flight destination immediately.
    await click(p, 'Contacto'); await p.waitForTimeout(120);
    await sample(p); await click(p, 'Galería');
    await arrival(p, route === '/' ? 'galeria' : 'galeria-proyecto');
    await checkSamples(p, 'Galería');
    // Wheel input cancels the pending choice and resumes the visible-section marker.
    await click(p, top); await p.waitForFunction(() => scrollY <= 4);
    await click(p, 'Contacto'); await p.waitForTimeout(120); await p.mouse.wheel(0, -700);
    await p.waitForFunction(() => {
     const header = document.querySelector('header'), line = header.getBoundingClientRect().height + 48;
     const ids = new Set([...header.querySelectorAll('.context-nav a')].map(a => new URL(a.href).hash.slice(1)).filter(Boolean));
     ids.add(location.pathname === '/' ? 'inicio' : 'project-top');
     const sections = [...document.querySelectorAll('main section[id]')].filter(e => ids.has(e.id));
     const expected = sections.filter(e => e.getBoundingClientRect().top <= line).at(-1)?.id;
     const active = header.querySelector('.context-nav a[aria-current]');
     const selected = active?.getAttribute('href') === '/' ? 'inicio' : new URL(active.href).hash.slice(1);
     return expected === selected && !active.textContent.includes('Contacto');
    });
    results.push({ width, route, intermediateLabels: labels, rapidClick: 'passed', wheelInterruption: 'passed' });
   }
   await p.close();
  }
  fs.mkdirSync('../.codex_artifacts/nav-indicator', { recursive: true });
  fs.writeFileSync('../.codex_artifacts/nav-indicator/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
 } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
