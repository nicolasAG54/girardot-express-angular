const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.BASE_URL || 'http://127.0.0.1:4300';
const output = path.resolve(process.argv[2] || '../.codex_artifacts/media-update-2026-10-06');
const sectionStyle = '.site-header, app-chatbot-widget, .skip-link { visibility: hidden !important; }';

async function captureSection(section, file) {
  // Tall sections can contain independently observed reveals below the fold.
  const reveals = await section.locator('[appRevealOnScroll]').all();
  if (await section.getAttribute('appRevealOnScroll') !== null) reveals.unshift(section);
  for (const reveal of reveals) {
    await reveal.scrollIntoViewIfNeeded();
    await reveal.page().waitForFunction(el => el.getAttribute('data-reveal-on-scroll') === 'visible', await reveal.elementHandle());
    await reveal.page().waitForFunction(el => getComputedStyle(el).opacity === '1', await reveal.elementHandle());
  }
  for (const part of await section.locator('[data-reveal]').all()) {
    await part.page().waitForFunction(el => getComputedStyle(el).opacity === '1', await part.elementHandle());
  }
  for (const img of await section.locator('img').all()) await img.evaluate(img => img.decode());
  await section.page().evaluate(() => document.activeElement?.blur());
  await section.screenshot({ path: file, style: sectionStyle });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const report = { cases: [], errors: [] };
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 960 : 844 } });
      page.on('pageerror', error => report.errors.push(error.message));
      for (const [route, name] of [['/', 'home'], ['/proyecto', 'project']]) {
        await page.goto(base + route);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => {
          const v = document.querySelector('main video');
          return v && !v.paused && v.readyState >= 2 && v.classList.contains('is-video-ready');
        });
        const media = await page.locator('main video').evaluate(v => ({ src: v.currentSrc, duration: v.duration, width: v.videoWidth, height: v.videoHeight, muted: v.muted, poster: v.poster }));
        assert.ok(media.src.endsWith(`hero-${name}${width < 768 ? '-mobile' : ''}.mp4`), media.src);
        assert.ok(media.poster.endsWith(`hero-${name}-poster.webp`));
        assert.ok(media.muted);
        assert.equal(media.width, width < 768 ? 1280 : 1920);
        assert.ok(Math.abs(media.duration - (name === 'home' ? 20.03 : 10.03)) < 0.1);
        const control = page.locator('.hero-video-control, .project-hero__pause');
        await control.click();
        await page.locator('main video').evaluate(v => { v.currentTime = 0.4; });
        await page.waitForFunction(() => !document.querySelector('main video').seeking);
        await page.screenshot({ path: path.join(output, `${width}-${name}-hero.png`) });
        await control.click();
        await page.waitForFunction(() => !document.querySelector('main video').paused);
        const gallerySelector = name === 'home' ? '#galeria' : '#galeria-proyecto';
        const gallery = page.locator(gallerySelector);
        await gallery.scrollIntoViewIfNeeded();
        const buttons = name === 'home' ? gallery.locator('.gallery-image') : gallery.locator('.project-gallery__controls button');
        assert.equal(await buttons.count(), 5);
        if (name === 'home') {
          for (let i = 0; i < 5; i++) {
            await buttons.nth(i).scrollIntoViewIfNeeded();
            await buttons.nth(i).locator('img').evaluate(img => img.decode());
          }
          await buttons.first().click();
          await page.locator('.gallery-dialog img').evaluate(img => img.decode());
          await page.getByRole('button', { name: 'Anterior', exact: true }).click();
          await page.waitForFunction(() => document.querySelector('.gallery-dialog img').getAttribute('src').endsWith('vista-aerea.webp'));
          await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
          await page.waitForFunction(() => document.querySelector('.gallery-dialog img').getAttribute('src').endsWith('plazoleta.webp'));
          await page.screenshot({ path: path.join(output, `${width}-${name}-lightbox.png`) });
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('dialog[open]').count(), 0);
        } else {
          for (let i = 0; i < 5; i++) {
            await buttons.nth(i).click();
            await page.waitForFunction(index => document.querySelectorAll('.project-gallery__controls button')[index].getAttribute('aria-pressed') === 'true', i);
            const img = gallery.locator('.project-gallery__view img');
            await img.evaluate(img => img.decode());
            assert.equal(await img.getAttribute('width'), '1920');
            assert.equal(await img.getAttribute('height'), '1080');
            assert.equal(await buttons.nth(i).getAttribute('aria-pressed'), 'true');
            assert.ok((await gallery.locator('.project-gallery__view a').getAttribute('href')).includes('media-2026-10/'));
          }
          await buttons.first().click();
          await gallery.locator('.project-gallery__view img').evaluate(img => img.decode());
        }
        await captureSection(gallery, path.join(output, `${width}-${name}-gallery.png`));
        const sections = name === 'home' ? ['#quienes-somos', '#sostenibilidad', '#proyecto'] : ['#arquitectura'];
        for (const selector of sections) {
          const section = page.locator(selector);
          await section.scrollIntoViewIfNeeded();
          await captureSection(section, path.join(output, `${width}-${name}-${selector.slice(1)}.png`));
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
        const staleImages = await page.locator('main img').evaluateAll(imgs => imgs.filter(img => /render-[13]|vida-cotidiana/.test(img.currentSrc)).map(img => img.currentSrc));
        assert.deepEqual(staleImages, []);
        report.cases.push({ width, route, media, gallery: 'five frames; selection/zoom works', overflow: 0 });
      }
      await page.close();
    }
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.failure = error.stack;
    throw error;
  } finally {
    fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
