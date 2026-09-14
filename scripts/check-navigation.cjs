/* Browser regression: click real navigation links; never scroll targets into view for the test.
 * Set NODE_PATH to a runtime with Playwright and BROWSER_EXECUTABLE if Chromium is not bundled.
 * node scripts/check-navigation.cjs [base URL] [output directory]
 */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.argv[2] || 'http://127.0.0.1:4300';
const out = path.resolve(process.argv[3] || 'navigation-qa');
fs.mkdirSync(out,{recursive:true});
const report = { journeys:[], layouts:[], errors:[] };
const pause = ms => new Promise(r=>setTimeout(r,ms));
async function verify(fn) { let error; for(let i=0;i<50;i++){try{return await fn();}catch(e){error=e;await pause(80);}} throw error; }
async function settled(p) { let old=-1, stable=0; for(let i=0;i<50;i++){const y=await p.evaluate(()=>scrollY); stable=Math.abs(y-old)<1?stable+1:0; old=y; if(stable>=4)break; await pause(80);} }
async function menu(p) { const button=p.locator('.menu-button'); if(await button.isVisible() && await button.getAttribute('aria-expanded')!=='true'){await button.click(); await verify(async()=>assert.equal(await button.getAttribute('aria-expanded'),'true'));} }
async function navigate(p,label){await menu(p); await p.locator('header nav').getByRole('link',{name:label,exact:true}).click(); await pause(100); await settled(p);}
async function geometry(p,id){return p.evaluate(id=>{const e=document.getElementById(id), h=document.querySelector('header'), heading=document.getElementById(e.getAttribute('aria-labelledby')) || e.querySelector('h1,h2'); return {id,top:e.getBoundingClientRect().top,headingTop:heading?.getBoundingClientRect().top,headerBottom:h.getBoundingClientRect().bottom,scrollY,focused:document.activeElement?.id,active:document.querySelector('header [aria-current]')?.textContent.trim(),overflow:document.documentElement.scrollWidth-innerWidth};},id);}
async function arrival(p,id,label){return verify(async()=>{const g=await geometry(p,id); assert.ok(g.top>=g.headerBottom-2,JSON.stringify(g));assert.ok(g.top<=g.headerBottom+4,JSON.stringify(g)); assert.ok(g.headingTop>=g.headerBottom+12,JSON.stringify(g)); assert.equal(g.overflow,0); if(label)assert.equal(g.active,label);return g;});}
async function screenshot(p,name){await pause(250);await p.screenshot({path:path.join(out,name+'.png')});}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
 try {
 for(const cfg of [{name:'desktop',width:1440,height:960},{name:'mobile',width:390,height:844}]){
  const p=await browser.newPage({viewport:cfg});p.on('pageerror',e=>report.errors.push(e.message));
  await p.goto(base);await p.waitForFunction(()=>document.querySelector('header img')?.complete);await pause(1000);
  await screenshot(p,cfg.name+'-home');
  const order=await p.locator('header .context-nav a[href^="/#"]').evaluateAll(es=>es.map(e=>({label:e.textContent.trim(),id:e.hash.slice(1),top:document.querySelector(e.hash).getBoundingClientRect().top+scrollY})));
  for(let i=1;i<order.length;i++)assert.ok(order[i].top>order[i-1].top,'Menu order must match document order');
  for(const item of order){await navigate(p,item.label);const g=await arrival(p,item.id,item.label); report.journeys.push({viewport:cfg.name,...g});await screenshot(p,cfg.name+'-'+item.id);}
  // Same hash must still work after manual scrolling away from its target.
  await p.mouse.wheel(0,300); await settled(p);await navigate(p,'Contacto');await arrival(p,'contacto','Contacto');
  await navigate(p,'Nuestras marcas');await arrival(p,'marcas','Nuestras marcas');
  await navigate(p,'Galería');await arrival(p,'galeria','Galería');
  await p.goBack();await settled(p);await arrival(p,'marcas','Nuestras marcas');
  await p.goForward();await settled(p);await arrival(p,'galeria','Galería');
  await p.locator('.gallery-image').first().click();await verify(async()=>assert.ok(await p.locator('dialog[open]').isVisible()));await p.keyboard.press('ArrowRight');await p.keyboard.press('Escape');await verify(async()=>assert.equal(await p.locator('dialog[open]').count(),0));
  await navigate(p,'Espacios comerciales');await p.waitForURL('**/proyecto');await settled(p);await screenshot(p,cfg.name+'-project');
  const projectOrder=await p.locator('header .context-nav a').evaluateAll(es=>es.filter(e=>e.hash && e.hash!=='#project-top').map(e=>({label:e.textContent.trim(),id:e.hash.slice(1),top:document.querySelector(e.hash).getBoundingClientRect().top+scrollY})));
  for(let i=1;i<projectOrder.length;i++)assert.ok(projectOrder[i].top>projectOrder[i-1].top);
  for(const item of projectOrder){await navigate(p,item.label);report.journeys.push({viewport:cfg.name+'-project',...await arrival(p,item.id,item.label)});}
  await navigate(p,'Inicio');await p.waitForURL(base+'/');await settled(p);await verify(async()=>{const g=await p.evaluate(()=>({y:scrollY,heading:document.querySelector('main h1').getBoundingClientRect().top,header:document.querySelector('header').getBoundingClientRect().bottom}));assert.ok(g.y<=4 && g.heading>=g.header,JSON.stringify(g));});
  await p.locator('.hero-opening').click();await p.waitForURL('**/proyecto#etapas');await settled(p);await arrival(p,'etapas','Etapas');
  await p.locator('footer').getByRole('link',{name:'Nuestras marcas',exact:true}).click();await p.waitForURL('**/#marcas');await settled(p);await arrival(p,'marcas','Nuestras marcas');
  await p.goto(base+'/#marcas');await pause(600);await settled(p);await arrival(p,'marcas','Nuestras marcas');
  if(cfg.name==='mobile'){
   await menu(p);await screenshot(p,'mobile-menu'); await p.keyboard.press('Escape');await verify(async()=>assert.equal(await p.locator('.menu-button').evaluate(e=>document.activeElement===e),true));
   await menu(p);await p.setViewportSize({width:1440,height:960});await pause(200);await p.setViewportSize(cfg);await pause(200);assert.equal(await p.locator('.menu-button').getAttribute('aria-expanded'),'false');
  }
  await p.close();
 }
 for(const cfg of [{width:1280,height:800},{width:1024,height:768},{width:768,height:1024},{width:320,height:740},{width:844,height:390}]){
  const p=await browser.newPage({viewport:cfg,reducedMotion:'reduce'});p.on('pageerror',e=>report.errors.push(e.message));await p.goto(base+'/#marcas');await pause(400);await settled(p);await arrival(p,'marcas','Nuestras marcas');await screenshot(p,'layout-'+cfg.width);
  await menu(p);const layout=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,header:document.querySelector('header').getBoundingClientRect().height,links:[...document.querySelectorAll('header nav a')].map(e=>({label:e.textContent.trim(),height:e.getBoundingClientRect().height,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))})); assert.equal(layout.overflow,0);for(const l of layout.links){assert.ok(l.height>=44,l.label);assert.ok(l.left>=0&&l.right<=cfg.width,l.label);}report.layouts.push(layout);await navigate(p,'Contacto');await arrival(p,'contacto','Contacto');await p.close();
 }
 assert.deepEqual(report.errors,[]);report.status='passed';
 } catch(e){report.status='failed';report.failure=e.stack;throw e;} finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));await browser.close();}
 console.log(JSON.stringify({status:report.status,anchorJourneys:report.journeys.length,additionalLayouts:report.layouts.length,errors:report.errors},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});


