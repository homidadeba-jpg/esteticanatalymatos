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
    assert(title.height <= fontSize * 2.2, 'Hero headline fits on two lines');
    assert(await page.locator('.hero-line').last().evaluate(el => { const range = document.createRange(); range.selectNodeContents(el.querySelector('em')); return range.getBoundingClientRect().width <= el.clientWidth + 1; }), 'Hero text is not clipped');
    const overlap = title.x < photo.x + photo.width && title.x + title.width > photo.x && title.y < photo.y + photo.height && title.y + title.height > photo.y;
    assert(!overlap, 'Hero title stays outside the photograph');
    assert.equal(await page.locator('.brand-monogram,.hero-watermark').count(), 0, 'No initials or words over the hero');
    const imageSources = await page.locator('main img').evaluateAll(imgs => imgs.map(i => i.getAttribute('src')));
    assert.equal(imageSources.length, 20, 'Hero, eighteen thumbnails and one real attendance photo');
    assert.equal(new Set(imageSources).size, 20, 'Every photograph is unique');
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
    assert(await page.locator('#faq-0').evaluate(el => el.getBoundingClientRect().height > 35));
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
    await page.route('https://wa.me/**', route => route.fulfill({ status: 200, body: 'WhatsApp test destination' }));
    const popupPromise = page.waitForEvent('popup');
    await wa.click();
    const popup = await popupPromise;
    assert(await wa.getByRole('status').textContent() === 'Abrindo WhatsApp…');
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
    if (viewport.width === 1440) await page.screenshot({ path: 'artifacts/hero-desktop.png' });
    findings.push(`${viewport.width}px: hero without overlap, transparent hero, 18 original thumbnails and expandable services, FAQ and WhatsApp OK`);
    await context.close();
  }
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
