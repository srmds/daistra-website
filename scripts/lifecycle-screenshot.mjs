#!/usr/bin/env node
/**
 * Raster export of ml-lifecycle-executive-layers.html for the marketing site.
 * Run: npm run lifecycle:screenshot
 */
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(repoRoot, 'static/lifecycle/ml-lifecycle-executive-layers.html');
const outDir = path.join(repoRoot, 'static/images/lifecycle');
const outPng = path.join(outDir, 'ml-lifecycle-executive-layers.png');
const outWebp = path.join(outDir, 'ml-lifecycle-executive-layers.webp');

const VIEWPORT_WIDTH = 1200;
const DEVICE_SCALE = 2;

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing diagram HTML: ${htmlPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const fileUrl = `file://${htmlPath}`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: VIEWPORT_WIDTH, height: 900 },
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

try {
  execSync(`sips -s format webp "${outPng}" --out "${outWebp}"`, { stdio: 'ignore' });
  console.log(`Wrote ${outWebp}`);
} catch {
  console.warn('WebP skipped (sips/libwebp unavailable; PNG is sufficient)');
}

let width = Math.round(box.width * DEVICE_SCALE);
let height = Math.round(box.height * DEVICE_SCALE);
try {
  const out = execSync(`sips -g pixelWidth -g pixelHeight "${outPng}"`, { encoding: 'utf8' });
  width = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]) || width;
  height = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1]) || height;
} catch {
  /* sips optional on non-macOS */
}

console.log(`Wrote ${outPng} (${width}×${height}px @${DEVICE_SCALE}x)`);
