import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'u2', 'frames');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
const root = execSync('ls -d ~/.npm/_npx/*/node_modules/puppeteer-core | head -1').toString().trim();
let pp = null;
for (const r of ['/lib/esm/puppeteer/puppeteer-core.js','/lib/puppeteer/puppeteer-core.js'])
  if (existsSync(root + r)) { pp = (await import('file://' + root + r)).default; break; }
const b = await pp.launch({ headless:'new', executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width:1600, height:900, deviceScaleFactor:1.2 });   /* 1920×1080 на выходе */
const file = path.join(HERE, '..', 'u2', 'prezentaciya.html');
await p.goto('file://' + file, { waitUntil:'networkidle0' });
const n = await p.evaluate(() => window.SLIDES);
for (let i = 1; i <= n; i++) {
  await p.goto('file://' + file + '?n=' + i, { waitUntil:'networkidle0' });
  await new Promise(r => setTimeout(r, 260));
  await p.screenshot({ path: path.join(OUT, String(i).padStart(2,'0') + '.png') });
}
await b.close();
console.log('слайдов:', n);
