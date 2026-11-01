/* Тайминг ролика из композиции: node timing.cjs index.html|kk.html → {start, taps, end} (JSON) */
const path = require('path');
const ENGINE = path.join(process.env.HOME, '.claude/engine');
const puppeteer = require(path.join(ENGINE, 'node_modules/puppeteer'));
(async () => {
  const b = await puppeteer.launch({ headless: 'new', executablePath: require(path.join(ENGINE, 'browser.js')).exe, args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  p.on('pageerror', e => { console.error('PAGEERR', e.message); process.exit(1); });
  await p.goto('file://' + path.join(__dirname, process.argv[2] || 'index.html'), { waitUntil: 'load' });
  console.log(JSON.stringify(await p.evaluate(() => ({ start: window.__START, taps: window.__TAPS, end: window.__END }))));
  await b.close();
})();
