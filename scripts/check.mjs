import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4189', '--strictPort'], { stdio: 'ignore' });
let browser;
const findings = [];
try {
  const assets = JSON.parse(await readFile('src/media.json', 'utf8'));
  const alpha = await sharp('public' + assets.hero).stats();
  assert.equal(alpha.channels[3].min, 0, 'Hero has real background transparency');
  let ready = false;
  for (let n = 0; n < 40; n++) {
    try { if ((await fetch('http://127.0.0.1:4189')).ok) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  assert(ready, 'Preview server started');
  const executablePath = existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined;
  browser = await chromium.launch({ headless: true, executablePath });
  await mkdir('artifacts', { recursive: true });
  const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 320, height: 740 }];
  const widths = process.env.CHECK_WIDTHS?.split(',').map(Number);
  for (const viewport of viewports.filter(v => !widths || widths.includes(v.width))) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('http://127.0.0.1:4189', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1300);
    assert.equal(await page.locator('h1').count(), 1);
    const photo = await page.locator('.hero-portrait').boundingBox();
    const title = await page.locator('h1').boundingBox();
    const fontSize = await page.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    assert(title.height <= fontSize * 2.5, 'Hero headline fits on two lines');
    assert(await page.locator('.hero-line').last().evaluate(el => { const range = document.createRange(); range.selectNodeContents(el.querySelector('em')); return range.getBoundingClientRect().width <= el.clientWidth + 1; }), 'Hero text is not clipped');
    const face = { x: photo.x + photo.width * .34, y: photo.y + photo.height * .12, width: photo.width * .38, height: photo.height * .4 };
    const overlapsFace = r => r.x < face.x + face.width && r.x + r.width > face.x && r.y < face.y + face.height && r.y + r.height > face.y;
    const titleLines = await page.locator('.hero-line > span').evaluateAll(lines => lines.map(el => { const range = document.createRange(); range.selectNodeContents(el); return range.getBoundingClientRect().toJSON(); }));
    assert(titleLines.every(r => !overlapsFace(r)), 'Headline glyphs stay outside Nataly face');
    assert(await page.locator('.hero-depth').evaluate(el => el.contains(document.querySelector('.hero-title')) && el.contains(document.querySelector('.hero-portrait'))), 'Title and portrait share a single motion plane');
    assert.equal(await page.locator('.hero-line').first().evaluate(el => getComputedStyle(el).overflow), 'visible', 'No rectangular clipping on title');
    assert.equal(await page.locator('.hero-title').evaluate(el => getComputedStyle(el).zIndex), '1');
    assert.equal(await page.locator('.hero-portrait').evaluate(el => getComputedStyle(el).zIndex), '2');
    assert.equal(await page.locator('.hero-actions').evaluate(el => getComputedStyle(el).opacity), '1', 'Booking never hidden by animation');
    await page.screenshot({ path: `artifacts/hero-${viewport.width}.png` });
    assert(!overlapsFace(await page.locator('.hero-note').boundingBox()), 'Supporting copy stays outside the face');
    assert.equal(await page.locator('.hero-inner').evaluate(el => getComputedStyle(el).display), 'block', 'Hero is a single composition, without a column grid');
    const primaryAction = await page.locator('.hero .button').boundingBox();
    assert(primaryAction.y >= 0 && primaryAction.y + primaryAction.height < viewport.height, 'Hero booking is in the initial viewport');
    assert((await page.locator('.about-copy').textContent()).includes('esteticista em Diadema'));
    assert((await page.locator('.care-copy').textContent()).includes('avaliação'));
    assert.equal(await page.locator('.brand-monogram,.hero-watermark').count(), 0, 'No initials or words over the hero');
    const imageSources = await page.locator('main img').evaluateAll(imgs => imgs.map(i => i.getAttribute('src')));
    assert.equal(imageSources.length, 21, 'One hero, eighteen thumbnails and two contextual photos');
    assert.equal(new Set(imageSources).size, 21, 'Every photograph is unique');
    assert.equal(await page.locator('.service-card img').count(), 18, 'Every service has its own thumbnail');
    const firstService = page.locator('.service-card').first();
    await firstService.locator('button').click();
    await page.waitForTimeout(350);
    assert.equal(await firstService.locator('button').getAttribute('aria-expanded'), 'true');
    assert(await firstService.locator('.disclosure').evaluate(el => el.getBoundingClientRect().height > 30));
    await firstService.locator('button').click();
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.service-card').count(), 18, 'All 18 services appear by default');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${viewport.width}px`);
    const heroButton = page.locator('.hero .button');
    assert(await heroButton.isVisible());
    assert((await heroButton.boundingBox()).y < viewport.height, 'Hero CTA appears in first viewport');
    assert((await heroButton.getAttribute('href')).includes('profissionalID=1f635a1f-31e5-4790-97b2-a84d522a51de'));
    const names = new Set();
    for (const category of ['Faciais', 'Corporais', 'Cuidados específicos']) {
      await page.getByRole('tab', { name: category, exact: true }).click();
      await page.waitForTimeout(200);
      for (const name of await page.locator('.service-card h3').allTextContents()) names.add(name);
    }
    assert.equal(names.size, 18, 'All 18 Nataly services are reachable');
    await page.getByRole('tab', { name: 'Todos', exact: true }).click();
    const question = page.getByRole('button', { name: 'Por onde eu começo?' });
    await question.click();
    await page.waitForTimeout(400);
    assert.equal(await question.getAttribute('aria-expanded'), 'true');
    await page.waitForFunction(() => document.querySelector('#faq-0').getBoundingClientRect().height > 20);
    await question.click();
    await page.waitForTimeout(400);
    assert.equal(await question.getAttribute('aria-expanded'), 'false');
    if (viewport.width < 768) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      assert(await page.getByRole('navigation').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Abrir menu' }).getAttribute('aria-expanded'), 'false');
    }
    const wa = page.locator('.contact-actions .whatsapp-link');
    await context.route('https://wa.me/**', route => route.fulfill({ status: 200, body: 'WhatsApp test destination' }));
    const popupPromise = page.waitForEvent('popup');
    await wa.click();
    assert(await wa.getByRole('status').textContent() === 'Abrindo WhatsApp…');
    const popup = await popupPromise;
    await popup.close();
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    assert.equal(await wa.getByRole('status').textContent(), '');
    assert(await page.locator('.author-credit').getAttribute('href') === 'https://wa.me/5585999745534');
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(i => !i.complete || !i.naturalWidth).map(i => i.src));
    assert.deepEqual(broken, [], 'Images load');
    assert.deepEqual(errors, [], 'No browser errors');
    await page.screenshot({ path: `artifacts/page-${viewport.width}.png`, fullPage: true });
    await page.screenshot({ path: `artifacts/hero-${viewport.width}.png` });
    if (viewport.width === 1440) await page.screenshot({ path: 'artifacts/hero-desktop.png' });
    findings.push(`${viewport.width}px: compact hero, stable alpha layering, face without text overlap, 18 original thumbnails and expandable services, FAQ and WhatsApp OK`);
    await context.close();
  }
  // A cold visit must render its first heading with the final fonts already ready.
  const cold = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await cold.addInitScript(() => {
    new MutationObserver((_, observer) => {
      if (document.querySelector('h1')) { window.firstHeadingFonts = document.documentElement.dataset.fonts; observer.disconnect(); }
    }).observe(document, { childList: true, subtree: true });
  });
  await cold.route('**/fonts/*.woff2', async route => { await new Promise(r => setTimeout(r, 800)); await route.continue(); });
  const coldPage = await cold.newPage();
  await coldPage.goto('http://127.0.0.1:4189', { waitUntil: 'networkidle' });
  await coldPage.waitForSelector('h1');
  assert.equal(await coldPage.evaluate(() => window.firstHeadingFonts), 'ready', 'The first heading uses loaded fonts on a cold visit');
  await coldPage.waitForTimeout(1500);
  await coldPage.evaluate(() => window.scrollTo({ top: 260, behavior: 'instant' }));
  await coldPage.waitForTimeout(300);
  assert.equal(await coldPage.locator('.hero-visual').evaluate(el => getComputedStyle(el).transform), 'none', 'Hero has no scroll animation');
  await coldPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await coldPage.waitForTimeout(300);
  assert.equal(await coldPage.locator('.hero-depth').evaluate(el => getComputedStyle(el).transform), 'none', 'Opening does not restart on return');
  await coldPage.screenshot({ path: 'artifacts/cold-fonts-mobile.png' });
  await cold.close();
  const failedFonts = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await failedFonts.route('**/fonts/*.woff2', route => route.abort());
  const fallbackPage = await failedFonts.newPage();
  await fallbackPage.goto('http://127.0.0.1:4189', { waitUntil: 'networkidle' });
  await fallbackPage.waitForSelector('h1');
  assert.equal(await fallbackPage.evaluate(() => document.documentElement.dataset.fonts), 'fallback', 'Font failure releases a stable fallback');
  assert((await fallbackPage.locator('h1').evaluate(el => getComputedStyle(el).fontFamily)).includes('Georgia'));
  await failedFonts.close();
  findings.push('Cold font loading: no fallback heading; font failure: stable fallback; hero: single entrance, no scroll replay');
  const reduce = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await reduce.newPage();
  await page.goto('http://127.0.0.1:4189', { waitUntil: 'networkidle' });
  assert(await page.locator('h1').isVisible());
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  findings.push('Reduced motion: content visible, smooth scrolling disabled');
  await writeFile('artifacts/check-results.txt', findings.join('\n') + '\n');
  console.log(findings.join('\n'));
} finally {
  await browser?.close();
  server.kill();
}
