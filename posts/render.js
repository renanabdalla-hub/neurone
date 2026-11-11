// Gera os PNGs dos templates: node posts/render.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const out = path.join(__dirname, 'png');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
  await page.goto('file://' + path.join(__dirname, 'templates.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const ids = await page.$$eval('[id]', els => els.map(e => e.id));
  for (const id of ids) {
    await page.locator('#' + id).screenshot({ path: path.join(out, id + '.png') });
    console.log('ok', id);
  }
  await browser.close();
})();
