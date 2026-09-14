const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(process.argv[2] || '../.codex_artifacts/v3-qa');
fs.mkdirSync(out, { recursive: true });
const base = 'http://127.0.0.1:4300';
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
 const report = { errors: [], layouts: [], flows: [] };
 try {
  for (const width of [1440, 1290, 1024, 390, 320]) {
   const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
   page.on('pageerror', e => report.errors.push(e.message));
   await page.goto(base); await page.waitForSelector('app-home'); await pause(1400);
   const layout = await page.evaluate(() => {
    const logo = document.querySelector('.brand').getBoundingClientRect();
    const first = document.querySelector('.context-nav a').getBoundingClientRect();
    return { width: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth, logoRight: logo.right, firstLinkLeft: first.left, menu: getComputedStyle(document.querySelector('.menu-button')).display };
   });
   report.layouts.push(layout); assert.equal(layout.overflow, 0);
   if(layout.menu === 'none') assert.ok(layout.firstLinkLeft > layout.logoRight, JSON.stringify(layout));
   if ([1440, 390].includes(width)) {
    await page.screenshot({path: path.join(out, `${width}-home.png`)});
    assert.equal(await page.locator('#experiencia #servicios').count(), 1);
    for (const section of ['quienes-somos', 'experiencia', 'sostenibilidad', 'marcas', 'ubicacion']) {
     await page.locator(`#${section}`).scrollIntoViewIfNeeded(); await pause(300);
     if(section === 'marcas') {
      await page.locator('.brand-offer summary').first().click(); await pause(150);
      assert.ok(await page.locator('.brand-description').first().isVisible());
     }
     await page.screenshot({path: path.join(out, `${width}-${section}.png`)});
    }
    const map = page.locator('app-location-map');
    await map.getByRole('button', {name: 'Terminal', exact: true}).click(); await pause(150);
    assert.match(await map.locator('iframe').getAttribute('src'), /Terminal/);
    await map.getByRole('button', {name: 'Girardot Express', exact: true}).click(); await pause(150);
    assert.match(await map.locator('iframe').getAttribute('src'), /4.299272/);
    await page.getByRole('button', {name:'Abrir asistente de Girardot Express'}).click(); await pause(150);
    await page.locator('.chatbot-quick-actions').getByRole('button',{name:'Apertura',exact:true}).click(); await pause(150);
    const visitorHistory = await page.locator('.chatbot-message').allTextContents();
    await page.getByRole('button',{name:'Tengo una marca',exact:true}).click(); await pause(150);
    assert.equal(await page.locator('.chatbot-message').count(),1);
    await page.locator('.chatbot-quick-actions').getByRole('button',{name:'Locales en Arriendo',exact:true}).click(); await pause(150);
    assert.match(await page.locator('.chatbot-message__actions a').last().getAttribute('href'), /Consulta\+de\+una\+marca/);
    await page.screenshot({path:path.join(out,`${width}-chat.png`)});
    await page.getByRole('button',{name:'Soy visitante',exact:true}).click(); await pause(150);
    assert.deepEqual(await page.locator('.chatbot-message').allTextContents(),visitorHistory);
    await page.getByRole('link',{name:'Ver todas las preguntas frecuentes',exact:true}).click(); await pause(150);
    await page.waitForSelector('app-faq');
    assert.equal(await page.locator('.faq-list details').count(),21);
    assert.equal(await page.locator('header .is-active').count(),0);
    await page.getByRole('button',{name:'Para marcas',exact:true}).click(); await pause(150);
    await page.locator('#faq-search').fill('cuesta un local'); await pause(150);
    assert.ok(await page.locator('.faq-list summary').count()>0);
    await page.locator('.faq-list summary').first().click(); await pause(150);
    await page.screenshot({path:path.join(out,`${width}-faq.png`)});
    await page.locator('#faq-search').fill('zzzinexistente'); await pause(150);
    assert.ok(await page.locator('.faq-empty').isVisible());
    await page.getByRole('button',{name:'Ver todas las preguntas',exact:true}).click(); await pause(150);
    assert.equal(await page.locator('.faq-list details').count(),21);
    await page.goto(base+'/proyecto'); await page.waitForSelector('app-project'); await pause(500);
    await page.screenshot({path:path.join(out,`${width}-project.png`)});
    await page.locator('app-contact-form').scrollIntoViewIfNeeded();
    await page.locator('app-contact-form button[type=submit]').click(); await pause(150);
    assert.equal(await page.locator('#contact-email').getAttribute('aria-invalid'),'true');
    for(const field of ['company','role','category','area']) assert.equal(await page.locator('#contact-'+field).getAttribute('aria-invalid'),'true');
    await page.locator('#contacto-comercial').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,`${width}-commercial-form.png`)});
    report.flows.push({width, categories:'pass', map:'pass', chatHistories:'pass', faq:'pass', commercialForm:'pass'});
   }
   await page.close();
  }
  assert.deepEqual(report.errors, []);
 } finally { fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report,null,2)); await browser.close(); }
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});

