import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'ignore' });
let browser;
const findings = [];
try {
  let ready = false;
  for (let n = 0; n < 40; n++) {
    try { if ((await fetch('http://127.0.0.1:4173')).ok) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  assert(ready, 'Preview server started');
  const executablePath = existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined;
  browser = await chromium.launch({ headless: true, executablePath });
  await mkdir('artifacts', { recursive: true });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 320, height: 740 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1300);
    assert.equal(await page.locator('h1').count(), 1);
    const portrait = await page.locator('.hero-portrait').boundingBox();
    const portraitArea = await page.locator('.hero-art').boundingBox();
    assert(Math.abs(portrait.width - portrait.height) < 2, 'Portrait proportions preserved');
    assert(portrait.y >= portraitArea.y - 10, 'Portrait head remains in the image area');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${viewport.width}px`);
    const heroButton = page.locator('.hero .button');
    assert(await heroButton.isVisible());
    assert((await heroButton.boundingBox()).y < viewport.height, 'Hero CTA appears in first viewport');
    assert((await heroButton.getAttribute('href')).includes('profissionalID=1f635a1f-31e5-4790-97b2-a84d522a51de'));
    const names = new Set();
    for (const category of ['Faciais', 'Corporais', 'Cuidados específicos']) {
      await page.getByRole('tab', { name: category, exact: true }).click();
      await page.waitForTimeout(200);
      for (const name of await page.locator('.treatment-item h3').allTextContents()) names.add(name);
    }
    assert.equal(names.size, 18, 'All 18 Nataly services are reachable');
    await page.getByRole('tab', { name: 'Faciais', exact: true }).click();
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
    const wa = page.locator('.faq .whatsapp-link');
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
    findings.push(`${viewport.width}px: layout, hero, 18 services, FAQ, WhatsApp, images OK`);
    await context.close();
  }
  const reduce = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await reduce.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  assert(await page.locator('h1').isVisible());
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  findings.push('Reduced motion: content visible, smooth scrolling disabled');
  await writeFile('artifacts/check-results.txt', findings.join('\n') + '\n');
  console.log(findings.join('\n'));
} finally {
  await browser?.close();
  server.kill();
}
