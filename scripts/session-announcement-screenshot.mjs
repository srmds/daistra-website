#!/usr/bin/env node
/**
 * Raster export of ml-lifecycle-session-announcement.html for Teams posting.
 * Run from this directory: node session-announcement-screenshot.mjs
 *
 * Requires: npm install playwright (or run from daistra-website after npm install).
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'ml-lifecycle-session-announcement.html');
const outPng = path.join(__dirname, 'ml-lifecycle-session-announcement.png');

const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 628;
const DEVICE_SCALE = 2;

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing HTML: ${htmlPath}`);
  process.exit(1);
}

const fileUrl = `file://${htmlPath}`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
  deviceScaleFactor: DEVICE_SCALE,
});

await page.goto(fileUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('article.canvas');
await page.evaluate(() => document.fonts?.ready);

const canvas = page.locator('article.canvas');
const box = await canvas.boundingBox();
if (!box) {
  console.error('Could not measure article.canvas');
  await browser.close();
  process.exit(1);
}

await page.screenshot({
  path: outPng,
  clip: {
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
  },
  type: 'png',
});

await browser.close();
console.log(`Wrote ${outPng} (${Math.round(box.width * DEVICE_SCALE)}×${Math.round(box.height * DEVICE_SCALE)}px @${DEVICE_SCALE}x)`);
