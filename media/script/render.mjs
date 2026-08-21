#!/usr/bin/env node
/*! Кадры видеоурока: слайд на каждую строку озвучки → PNG 1280×720. */
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'frames');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
const root = execSync('ls -d ~/.npm/_npx/*/node_modules/puppeteer-core | head -1').toString().trim();
let puppeteer = null;
for (const rel of ['/lib/esm/puppeteer/puppeteer-core.js','/lib/puppeteer/puppeteer-core.js','/lib/cjs/puppeteer/puppeteer-core.js'])
  if (existsSync(root + rel)) { puppeteer = (await import('file://' + root + rel)).default; break; }
const b = await puppeteer.launch({ headless: 'new',
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const N = +process.argv[2] || 22;
for (let i = 1; i <= N; i++) {
  await p.goto('file://' + path.join(HERE, 'slides.html') + '?n=' + i, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 220));
  await p.screenshot({ path: path.join(OUT, String(i).padStart(2, '0') + '.png') });
}
await b.close();
console.log('кадров:', N);
