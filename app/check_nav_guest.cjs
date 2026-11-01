/* Входы и выходы kids/ и elders/ в демо: вход, серия/тема/проверка, «назад», озвучка фраз.
   python3 -m http.server 8790 из корня репо, потом node app/check_nav_guest.cjs [url]. */
const puppeteer = require(process.env.HOME + '/.claude/engine/node_modules/puppeteer');
const BASE = process.argv[2] || 'http://localhost:8790/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
function ok(c, n, x) { console.log((c ? '  ok   ' : '  FAIL ') + n + (x ? '  → ' + x : '')); if (!c) fails++; }
(async () => {
  const b = await puppeteer.launch({ headless: 'new', protocolTimeout: 30000, executablePath: require(process.env.HOME + '/.claude/engine/browser.js').exe });
  for (const kind of ['kids', 'elders']) {
    console.log('== ' + kind);
    const ctx = await b.createBrowserContext();
    const p = await ctx.newPage();
    await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    const H = () => p.evaluate(() => location.hash);
    const click = async s => { const okc = await p.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, s); await sleep(500); return okc; };
    await p.goto(BASE + kind + '/?demo=1&r=mama', { waitUntil: 'load' }); await sleep(800);
    await click('[data-pick="ru"]');
    await p.evaluate(() => { document.getElementById('nm').value = 'Мама'; document.getElementById('cd').value = 'K7M4PX2Q'; });
    await click('#go'); await sleep(600);
    if (kind === 'elders') await click('#go');
    ok((await H()) === '#/' || (await H()) === '', 'вход → главная', await H());
    const histAfterLogin = await p.evaluate(() => history.length);
    if (kind === 'kids') {
      await click('[data-ep]');
      ok((await H()).indexOf('#/ep/') === 0, 'серия открылась', await H());
      await click('#bk');
      ok((await H()) === '#/', 'кнопка назад → главная', await H());
      await p.goBack(); await sleep(500);
      ok((await H()).indexOf('#/ep/') !== 0, 'системный «назад» не возвращает в серию', await H());
    } else {
      await click('[data-go^="#/p/"]');
      ok((await H()).indexOf('#/p/') === 0, 'тема открылась', await H());
      ok(await click('[data-say]') && await click('[data-slow]'), 'кнопки «послушать» и «медленно» нажимаются');
      await click('[data-go^="#/q/"]');
      ok((await H()).indexOf('#/q/') === 0, 'проверка открылась', await H());
      await click('.back');
      ok((await H()).indexOf('#/p/') === 0, 'назад из проверки → тема', await H());
      await click('.back');
      ok((await H()) === '#/', 'назад из темы → главная', await H());
      await p.goBack(); await sleep(500);
      ok((await H()).indexOf('#/p/') !== 0 && (await H()).indexOf('#/q/') !== 0, 'системный «назад» не возвращает в тему', await H());
    }
    ok(errs.length === 0, 'ошибок JS нет', errs.join(' | '));
    await ctx.close();
  }
  console.log(fails ? `ИТОГ: ${fails} провалов` : 'ИТОГ: всё ок');
  await b.close();
})();
