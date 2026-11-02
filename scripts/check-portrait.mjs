import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
for(const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.goto('http://127.0.0.1:5187',{waitUntil:'networkidle'});
 await page.waitForTimeout(1500);
 const r=await page.locator('.hero-portrait').boundingBox();
 const a=await page.locator('.hero-art').boundingBox();
 assert(Math.abs(r.width-r.height)<2);assert(r.y>=a.y-10);
 await page.screenshot({path:`artifacts/hero-${width}-final.png`});
 console.log(`${width}px: portrait proportions and framing OK`);
 await page.close();
}
} finally {await browser.close();}

