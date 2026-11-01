/* Скриншоты платформы для ролика и слайдов сторис.
   node caps.cjs <lang> [url]   — url по умолчанию http://localhost:8790/ (python3 -m http.server 8790 из корня репо)
   → promo/howto/assets/screens[_kk]/*.png + rects.js (координаты кнопок в pt для нажатий в ролике)
   → assets/stories/s_{jobs,filters,uni}_<lang>.jpg (картинки слайдов сторис) */
const path = require('path'), fs = require('fs');
const ENGINE = path.join(process.env.HOME, '.claude/engine');
const puppeteer = require(path.join(ENGINE, 'node_modules/puppeteer'));
const LANG = process.argv[2] || 'ru';
const URL = (process.argv[3] || 'http://localhost:8790/') + 'index.html?demo=1&beta=1';
const OUT = path.join(__dirname, 'assets', 'screens' + (LANG === 'ru' ? '' : '_' + LANG));
const STORIES = path.join(__dirname, '../../assets/stories');
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await puppeteer.launch({ headless: 'new', protocolTimeout: 60000, executablePath: require(path.join(ENGINE, 'browser.js')).exe });
  const R = {};
  async function cap(file, opt) {
    const { who, hash = '', js = '', h = 844, sels = {}, hideTabs = false, dpr = 3, jpg = false } = opt;
    const p = await b.newPage();
    await p.setViewport({ width: 390, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true });
    p.on('pageerror', e => console.log('PAGEERR', file, e.message));
    await p.evaluateOnNewDocument((lang, who, hide) => {
      localStorage.setItem('1eng.demo', JSON.stringify({ phone: '77011234567', name: 'Аяжан', gender: 'f', level: 'preint', consent: '2026-11-01', lang, who, theme: 'light', p: {}, g: {}, storySeen: false, field: '' }));
      document.addEventListener('DOMContentLoaded', () => {
        const st = document.createElement('style');
        st.textContent = '.demo-strip{display:none!important} *{scrollbar-width:none} .enter,.full{animation:none!important}' + (hide ? ' #tabs{display:none!important}' : '');
        document.head.appendChild(st);
      });
    }, LANG, who, hideTabs);
    await p.goto(URL + '#/future' + hash, { waitUntil: 'load' });
    await sleep(800);
    if (js) { await p.evaluate(js); await sleep(600); }
    await p.evaluate(async () => { for (const i of document.images) { i.loading = 'eager'; if (!i.complete) await new Promise(r => { i.onload = i.onerror = r; }); } });
    await sleep(300);
    const r = await p.evaluate(sels => { const o = {}; for (const [k, s] of Object.entries(sels)) { const e = document.querySelector(s); if (e) { const q = e.getBoundingClientRect(); o[k] = [q.x, q.y, q.width, q.height]; } } return o; }, sels);
    for (const k of Object.keys(sels)) if (!r[k]) console.log('НЕТ ЭЛЕМЕНТА', file, k);
    await p.screenshot(jpg ? { path: file, type: 'jpeg', quality: 82 } : { path: file });
    await p.close();
    return r;
  }
  const FIT = "document.querySelector('[data-ff=it]').click()";
  const LONG = "document.querySelector('.full').style.overflow='visible'";
  R.jobs = await cap(`${OUT}/jobs.png`, { who: 'adult', sels: { it: '[data-prof=it]', tabs: '#tabs' } });
  R.jobs_it = await cap(`${OUT}/jobs_it.png`, { who: 'adult', hash: '/jobs/it', sels: { school: '[data-who=school]' } });
  R.unis = await cap(`${OUT}/unis.png`, { who: 'school', sels: { fit: '[data-ff=it]', tabs: '#tabs' } });
  R.unis_it_long = await cap(`${OUT}/unis_it_long.png`, { who: 'school', js: FIT, h: 3400, sels: { snu: '.ulist [data-uni=snu]' }, hideTabs: true });
  R.snu_long = await cap(`${OUT}/snu_long.png`, { who: 'school', hash: '/uni/snu', js: LONG, h: 2300, sels: { ppl: '.full .ppl', grant: '.full .glist' }, hideTabs: true });
  fs.writeFileSync(`${OUT}/rects.js`, 'window.RECTS = ' + JSON.stringify(R) + ';\n');
  /* полоса вкладок для длинного скриншота: снизу экрана «Учёба» */
  const tab = await b.newPage();
  await tab.setViewport({ width: 390, height: 66, deviceScaleFactor: 3 });
  await tab.setContent(`<body style="margin:0"><img src="data:image/png;base64,${fs.readFileSync(`${OUT}/unis.png`).toString('base64')}" style="display:block;width:390px;margin-top:-778px"></body>`);
  await sleep(300); await tab.screenshot({ path: `${OUT}/tabs_school.png` }); await tab.close();
  /* слайды сторис */
  await cap(`${STORIES}/s_jobs_${LANG}.jpg`, { who: 'adult', hash: '/jobs/it', dpr: 2, jpg: true });
  await cap(`${STORIES}/s_filters_${LANG}.jpg`, { who: 'school', dpr: 2, jpg: true });
  await cap(`${STORIES}/s_uni_${LANG}.jpg`, { who: 'school', hash: '/uni/snu', dpr: 2, jpg: true });
  console.log(LANG, JSON.stringify(R));
  await b.close();
})();
