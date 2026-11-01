/* Входы и выходы платформы: кнопки «назад», системный «назад» телефона, шторки, вуз и сторис во вкладке «Работа / Учёба».
   Нужен сервер из корня репо: python3 -m http.server 8790, потом node app/check_nav.cjs [url]. Браузер — из ~/.claude/engine. */
const puppeteer = require(process.env.HOME + '/.claude/engine/node_modules/puppeteer');
const BASE = process.argv[2] || 'http://localhost:8790/index.html?demo=1&beta=1';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
function ok(cond, name, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra ? '  → ' + extra : '')); if (!cond) fails++; }
(async () => {
  const b = await puppeteer.launch({ headless: 'new', protocolTimeout: 30000, executablePath: require(process.env.HOME + '/.claude/engine/browser.js').exe, args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.evaluateOnNewDocument(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', 1);
      localStorage.setItem('1eng.demo', JSON.stringify({ phone: '77011234567', name: 'Аяжан', gender: 'f', level: 'preint', consent: '2026-11-01', lang: 'ru', who: 'adult', theme: 'light', p: {}, g: {} }));
    }
  });
  const H = () => p.evaluate(() => location.hash);
  const has = sel => p.evaluate(s => !!document.querySelector(s), sel);
  const click = async sel => { await p.evaluate(s => document.querySelector(s).click(), sel); await sleep(450); };
  const back = async () => { await p.goBack(); await sleep(450); };
  const locked = () => p.evaluate(() => document.documentElement.classList.contains('locked'));

  await p.goto(BASE + '#/home', { waitUntil: 'load' }); await sleep(900);
  console.log('1. Уроки: шаг урока и кнопка «назад»');
  await click('[data-to="#/lessons"]');
  const item = await p.evaluate(() => { const b = document.querySelector('[data-step]') || document.querySelector('.item button'); return b ? b.outerHTML.slice(0, 120) : null; });
  await p.evaluate(() => { const i = document.querySelector('.item .ihead, .item > button'); if (i) i.click(); }); await sleep(300);
  const stepSel = await p.evaluate(() => { const a = document.querySelector('[data-go*="/read"], [data-nav*="/read"], a[href*="/read"]'); return a ? (a.getAttribute('data-go') || a.getAttribute('data-nav') || a.getAttribute('href')) : null; });
  if (stepSel) { await p.evaluate(h => { location.hash = h; }, stepSel); await sleep(500); }
  const inStep = await H();
  await click('[data-back]');
  ok((await H()) === '#/lessons', 'кнопка назад в шаге ведёт к урокам', await H());
  await back();
  ok((await H()) !== inStep, 'системный «назад» после кнопки не возвращает в шаг', await H());

  console.log('2. Вакансии: сфера и «назад»');
  await p.evaluate(() => { location.hash = '#/future'; }); await sleep(500);
  await click('[data-prof="it"]');
  ok(await has('.crumb'), 'открылась сфера IT');
  await back();
  ok((await H()).indexOf('#/future') === 0 && !(await has('.crumb')), 'системный «назад» из сферы → список сфер', await H());
  await click('[data-prof="it"]');
  await click('.crumb');
  ok(!(await has('.crumb')), 'кнопка «Все сферы» → список');
  await back();
  ok(!(await has('.crumb')), '«назад» после «Все сферы» не открывает сферу снова', await H());

  console.log('3. Учёба: вуз во весь экран');
  await p.evaluate(() => { location.hash = '#/future'; }); await sleep(400);
  await click('[data-who="school"]');
  await p.evaluate(() => window.scrollTo(0, 900)); await sleep(200);
  const y0 = await p.evaluate(() => window.scrollY);
  await click('.ulist [data-uni="snu"]');
  ok(await has('.full'), 'вуз открылся');
  await back();
  ok(!(await has('.full')) && !(await locked()), 'системный «назад» закрывает вуз', await H());
  ok((await H()).indexOf('#/future') === 0, 'после закрытия вуза остаёмся во вкладке', await H());
  ok(Math.abs((await p.evaluate(() => window.scrollY)) - y0) < 40, 'прокрутка списка сохранилась', `${y0} → ${await p.evaluate(() => window.scrollY)}`);
  await click('.ulist [data-uni="snu"]');
  await click('.full [data-x]');
  ok(!(await has('.full')) && !(await locked()), 'крестик закрывает вуз');
  await back();
  ok(!(await has('.full')), '«назад» после крестика не открывает вуз снова', await H());
  await p.evaluate(() => { location.hash = '#/future'; }); await sleep(400);
  await p.evaluate(() => window.scrollTo(0, 250)); await sleep(150);
  await click('[data-ff="med"]');
  ok(Math.abs((await p.evaluate(() => window.scrollY)) - 250) < 5, 'фильтр не прыгает наверх', String(await p.evaluate(() => window.scrollY)));
  ok(await p.evaluate(() => document.querySelector('[data-ff="med"]').classList.contains('on')), 'фильтр выбран');
  await click('[data-ff=""]');
  await p.evaluate(() => { location.hash = '#/future/uni/nope'; }); await sleep(400);
  ok((await H()) === '#/future' && !(await has('.full')), 'несуществующий вуз → корень вкладки', await H());
  await p.evaluate(() => { location.hash = '#/future/uni/tum'; }); await sleep(400);
  await p.reload({ waitUntil: 'load' }); await sleep(900);
  ok(await has('.full'), 'перезагрузка на вузе открывает вуз');
  await click('.full [data-x]');
  ok((await H()) === '#/future' && !(await has('.full')), 'крестик после перезагрузки → корень вкладки', await H());

  console.log('4. Сторис');
  await p.evaluate(() => { location.hash = '#/future'; }); await sleep(400);
  await click('[data-story]'); await sleep(1500);
  ok(await has('.story'), 'сторис открылась');
  ok(await p.evaluate(() => { const v = document.querySelector('.story video'); return v && !v.paused && !v.muted && v.currentTime > 0.3; }), 'видео играет со звуком');
  await p.mouse.click(330, 500); await sleep(300); await p.mouse.click(330, 500); await sleep(300);
  await p.mouse.click(30, 500); await sleep(300); await p.mouse.click(30, 500); await sleep(1200);
  ok(await p.evaluate(() => { const v = document.querySelector('.story video'); return v && !v.paused; }), 'вернулись тапом назад к видео — играет');
  await back();
  ok(!(await has('.story')) && !(await locked()), 'системный «назад» закрывает сторис', await H());
  ok((await H()).indexOf('#/future') === 0, 'после сторис остаёмся во вкладке', await H());
  const vidPlaying = await p.evaluate(() => [...document.querySelectorAll('video')].some(v => !v.paused));
  ok(!vidPlaying, 'видео не играет после закрытия');
  await click('[data-story]'); await sleep(400);
  for (let k = 0; k < 4; k++) { await p.mouse.click(330, 500); await sleep(250); }
  await click('[data-cta]'); await sleep(300);
  ok((await H()) === '#/lessons' && !(await has('.story')), '«К урокам» в сторис → уроки', await H());
  await back();
  ok((await H()) === '#/future' && !(await has('.story')), '«назад» из уроков → вкладка, не сторис', await H());
  await click('[data-story]'); await sleep(400);
  await p.mouse.move(200, 300); await p.mouse.down(); await p.mouse.move(200, 520, { steps: 5 }); await p.mouse.up(); await sleep(400);
  ok(!(await has('.story')), 'смахивание вниз закрывает сторис', await H());
  await click('[data-story]'); await sleep(400);
  await p.keyboard.press('Escape'); await sleep(300);
  ok(!(await has('.story')), 'Esc закрывает сторис');
  await back();
  ok(!(await has('.story')), '«назад» после Esc не открывает сторис снова', await H());

  console.log('5. Переход по вкладкам с открытым слоем');
  await p.evaluate(() => { location.hash = '#/future'; }); await sleep(400);
  await click('.ulist [data-uni="msu"]');
  await p.evaluate(() => { location.hash = '#/games'; }); await sleep(400);
  ok(!(await has('.full')) && !(await locked()), 'смена вкладки убирает открытый вуз');

  console.log('6. Шторка (уровень) и «назад»');
  await p.evaluate(() => { location.hash = '#/home'; }); await sleep(500);
  await p.evaluate(() => { location.hash = '#/settings'; }); await sleep(500);
  const rows = await p.evaluate(() => [...document.querySelectorAll('.view button, .view .row')].map(b => b.textContent.trim().slice(0, 30)));
  console.log('     профиль:', rows.join(' | '));
  for (const label of ['Язык', 'Тема']) {
    const okc = await p.evaluate(l => { const b = [...document.querySelectorAll('.view button')].find(x => x.textContent.indexOf(l) >= 0); if (b) { b.click(); return true; } return false; }, label); await sleep(400);
    if (!okc) { ok(false, 'нет кнопки ' + label); continue; }
    ok(await has('.veil'), 'шторка «' + label + '» открылась');
    await back();
    ok(!(await has('.veil')) && (await H()) === '#/settings', 'системный «назад» закрывает шторку «' + label + '»', await H());
  }
  await p.evaluate(() => [...document.querySelectorAll('.view button')].find(x => x.textContent.indexOf('Тема') >= 0).click()); await sleep(300);
  await p.evaluate(() => document.querySelectorAll('.veil [data-v]')[2].click()); await sleep(500);
  ok(!(await has('.veil')) && (await H()) === '#/settings', 'выбор в шторке закрывает её', await H());
  await back();
  ok((await H()) !== '#/settings' || !(await has('.veil')), '«назад» после выбора уходит со страницы, шторка не всплывает', await H());

  ok(errs.length === 0, 'ошибок JS нет', errs.join(' | '));
  console.log(fails ? `ИТОГ: ${fails} провалов` : 'ИТОГ: всё ок');
  await b.close();
})();
