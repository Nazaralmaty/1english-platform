#!/usr/bin/env node
/*!
 * 1English · один прогон всех проверок прототипа.
 *
 *   node check.mjs              все экраны
 *   node check.mjs sabaq oiyn   только названные
 *
 * Открывает каждый экран в настоящем Chrome на 390×844, гоняет его
 * собственный `?test=1`, ловит ошибки консоли, упавшие ресурсы и битые
 * картинки. Второй проход — 360×640: у детей в регионах телефоны уже,
 * и вёрстку, которая держится только на большом экране, на своём
 * телефоне не увидишь.
 *
 * Ничего не мокается. Зелено здесь — значит открывается на телефоне.
 */
'use strict';

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/* Экраны со своим ?test=1. id — то, что можно назвать аргументом. */
const SCREENS = [
  { id:'stend',  name:'Стенд',            file:'index.html' },
  { id:'kiru',   name:'Кіру',             file:'bala/kiru.html' },
  { id:'dengey', name:'Деңгей таңдау',     file:'bala/dengey.html' },
  { id:'bugin',  name:'Бүгін',            file:'bala/index.html' },
  { id:'diag',   name:'Диагностика',      file:'bala/diagnostika.html' },
  { id:'jol',    name:'Оқу жолы',         file:'bala/jol.html' },
  { id:'sabaq',  name:'Сабақ · b2 (бейне)', file:'bala/sabaq.html', q:'?u=b2&test=1' },
  { id:'sabaq2', name:'Сабақ · e2',        file:'bala/sabaq.html', q:'?u=e2&test=1' },
  { id:'sozdik', name:'Сөздік',           file:'bala/sozdik.html' },
  { id:'tapsyrma', name:'Сабақ тесті',     file:'bala/tapsyrma.html', q:'?u=b2&test=1' },
  { id:'aitest', name:'Ай сайынғы тест',   file:'bala/ai_test.html' },
  { id:'oiyn',   name:'Ойындар',          file:'bala/oiyn.html' },
  { id:'profil', name:'Профиль',          file:'bala/profil.html' },
  { id:'surypta',name:'Сөз сұрыптау',     file:'games/surypta.html' },
  { id:'soilem', name:'Сөйлем құрастыр',  file:'games/soilem.html' },
  { id:'ustaz',  name:'Ұстаз кабинеті',   file:'ustaz/index.html' },
  { id:'ata',    name:'Ата-ана кабинеті', file:'ata/index.html' },
];
/* Экраны без своего теста — проверяем только, что открываются без ошибок. */
const PAGES = [
  { id:'flappy', name:'Flappy English', file:'games/flappy.html' },
];

const only = process.argv.slice(2);
const want = (id) => !only.length || only.includes(id);

let totalChecks = 0, totalFails = 0;
const rows = [];

const puppeteer = await (async () => {
  const root = execSync('ls -d ~/.npm/_npx/*/node_modules/puppeteer-core 2>/dev/null | head -1').toString().trim();
  if (!root) { console.error('puppeteer-core не найден. Один раз: npx -y puppeteer-core@23 --version'); process.exit(1); }
  for (const rel of ['/lib/esm/puppeteer/puppeteer-core.js', '/lib/puppeteer/puppeteer-core.js', '/lib/cjs/puppeteer/puppeteer-core.js'])
    if (existsSync(root + rel)) return (await import('file://' + root + rel)).default;
  console.error('не нашёл точку входа puppeteer-core в ' + root); process.exit(1);
})();

const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });

async function openAndAudit(file, query, vp) {
  const p = await browser.newPage();
  await p.setViewport({ width: (vp && vp[0]) || 390, height: (vp && vp[1]) || 844, isMobile: true, hasTouch: true });
  const errs = [];
  let oks = 0;
  p.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  p.on('console', (m) => {
    const t = m.text();
    if (t.startsWith('OK ')) { oks++; return; }
    /* console.assert печатается как error и несёт наш текст — это и есть провал */
    /* отсутствующее медиа прототипа Chrome печатает и в консоль — на него
       уже смотрит requestfailed ниже, второй раз считать не надо */
    if (/Failed to load resource/.test(t)) return;
    if (m.type() === 'error' || m.type() === 'assert') errs.push(t.slice(0, 160));
  });
  p.on('requestfailed', (r) => {
    /* закрытая панель обрывает докачку видео — это отмена, а не поломка */
    if ((r.failure() && r.failure().errorText || '').includes('ABORTED')) return;
    errs.push('не загрузилось: ' + r.url().split('/').pop());
  });
  await p.goto('file://' + encodeURI(path.join(HERE, file)) + (query || ''), { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2600));
  const dom = await p.evaluate(() => ({
    hOver: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    nested: document.querySelectorAll('a a').length,
    brokenImg: [...document.querySelectorAll('img')].filter((i) => i.naturalWidth === 0).length,
  }));
  await p.close();
  return { oks, errs, dom };
}

function audit(name, r, expectOk) {
  const problems = [...r.errs];
  if (r.dom.hOver > 0) problems.push('ездит вбок на ' + r.dom.hOver + 'px');
  if (r.dom.nested) problems.push('вложенных <a>: ' + r.dom.nested);
  if (r.dom.brokenImg) problems.push('битых картинок: ' + r.dom.brokenImg);
  if (expectOk && !r.oks) problems.push('нет строки OK — свой ?test=1 не доехал');
  totalChecks += r.oks; totalFails += problems.length;
  rows.push([name, r.oks ? r.oks + ' блок теста' : 'страница', problems.length ? problems.join(' · ') : 'чисто']);
}

for (const s of [...SCREENS]) {
  if (!want(s.id)) continue;
  if (!existsSync(path.join(HERE, s.file))) { rows.push([s.name, '—', 'файл не найден']); totalFails++; continue; }
  audit(s.name, await openAndAudit(s.file, s.q || '?test=1'), true);
}
for (const g of PAGES) {
  if (!want(g.id)) continue;
  audit(g.name, await openAndAudit(g.file, ''), false);
}

/* ── узкий экран ─────────────────────────────────────────────────────── */
const SMALL = [360, 640];
for (const s of [...SCREENS, ...PAGES]) {
  if (!want(s.id) || !existsSync(path.join(HERE, s.file))) continue;
  const r = await openAndAudit(s.file, s.q ? s.q.replace('&test=1','') : '', SMALL);
  const problems = [];
  if (r.dom.hOver > 0) problems.push('ездит вбок на ' + r.dom.hOver + 'px');
  if (r.errs.length) problems.push(r.errs[0]);
  totalFails += problems.length;
  rows.push([s.name + ' · 360px', 'узкий экран', problems.length ? problems.join(' · ') : 'чисто']);
}

/* ── ссылки стенда ───────────────────────────────────────────────────── */
if (want('stend')) {
  const p = await browser.newPage();
  await p.goto('file://' + encodeURI(path.join(HERE, 'index.html')), { waitUntil: 'networkidle0' });
  const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')]
    .map((a) => a.getAttribute('href')).filter((h) => h && !/^https?:|^#/.test(h)));
  await p.close();
  const dead = links.filter((h) => !existsSync(path.join(HERE, decodeURIComponent(h.split('?')[0]))));
  totalFails += dead.length;
  rows.push(['Ссылки стенда', links.length + ' шт', dead.length ? 'битые: ' + dead.join(', ') : 'все живые']);
}

/* ── контент: банк слов и курс не должны разъезжаться ────────────────────
   Экран сабака рисует ровно 8 карточек на юнит и берёт их из общего банка.
   Если в банке для готового юнита не 8 слов — экран молча покажет меньше,
   и это заметят на показе, а не здесь. Поэтому сверяем числом. */
{
  const { readFileSync } = await import('fs');
  const words  = readFileSync(path.join(HERE, 'data/words.js'), 'utf8');
  const course = readFileSync(path.join(HERE, 'data/course.js'), 'utf8');
  const lessons = readFileSync(path.join(HERE, 'data/lessons_b.js'), 'utf8')
                + readFileSync(path.join(HERE, 'data/lessons_e.js'), 'utf8');
  const readyIds = [...course.matchAll(/id:'([be]\d+)'[^}]*ready:true/g)].map((m) => m[1]);
  const noWords  = readyIds.filter((id) => (words.match(new RegExp("u:'" + id + "'", 'g')) || []).length !== 8);
  const noText   = readyIds.filter((id) => !lessons.includes('LESSONS.' + id + ' ='));
  totalFails += noWords.length + noText.length;
  rows.push(['Слова ↔ курс', readyIds.length + ' готовых уроков',
    noWords.length ? 'не по 8 слов: ' + noWords.join(', ') : 'по 8 слов в каждом']);
  rows.push(['Контент ↔ курс', readyIds.length + ' готовых уроков',
    noText.length ? 'нет содержимого: ' + noText.join(', ') : 'у каждого есть содержимое']);
}

/* ── видеоурок ────────────────────────────────────────────────────────────
   Проверяем не «файл лежит», а то, ради чего он лежит: ролик открывается в
   экране сабака, доигрывает до чекпоинта и чекпоинт останавливает видео
   вопросом. Разъехавшиеся секунды в data/lessons_b.js ловятся именно здесь. */
if (want('sabaq') || want('video')) {
  const { readFileSync } = await import('fs');
  const les = readFileSync(path.join(HERE, 'data/lessons_b.js'), 'utf8');
  const times = [...les.matchAll(/\{ t:(\d+),/g)].map((m) => +m[1]);
  if (!times.length) { rows.push(['Видеоурок', '—', 'у урока b2 не осталось чекпоинтов']); totalFails++; }
  const p = await browser.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await p.goto('file://' + encodeURI(path.join(HERE, 'bala/sabaq.html')) + '?u=b2',
               { waitUntil: 'networkidle0' });
  const r = times.length ? await p.evaluate(async (t0) => {
    document.querySelectorAll('.step')[0].click();          /* шаг «Бейнесабақ» */
    const v = document.getElementById('v');
    await new Promise((res) => {
      if (v.readyState >= 1) return res();
      v.onloadedmetadata = res; setTimeout(res, 6000);
    });
    const dur = v.duration;
    v.currentTime = t0 + 0.6;                                /* прыжок на чекпоинт */
    await new Promise((res) => setTimeout(res, 900));
    return { dur: dur, paused: v.paused, ask: !!document.querySelector('#cpbox .cp') };
  }, times[0]) : { dur:0, paused:false, ask:false };
  await p.close();
  const problems = [...errs];
  if (!(r.dur > 0)) problems.push('видео не открылось (нет длительности)');
  else if (r.dur < times[times.length - 1] + 3) problems.push('ролик короче последнего чекпоинта: ' + Math.round(r.dur) + 'с < ' + times[times.length - 1] + 'с');
  if (!r.ask) problems.push('чекпоинт не задал вопрос на ' + times[0] + 'с');
  if (!r.paused) problems.push('чекпоинт не остановил видео');
  totalFails += problems.length;
  rows.push(['Видеоурок', Math.round(r.dur || 0) + 'с · ' + times.length + ' чекпоинта',
             problems.length ? problems.join(' · ') : 'чисто']);
}

await browser.close();

const w0 = Math.max(...rows.map((r) => r[0].length));
const w1 = Math.max(...rows.map((r) => r[1].length));
console.log('');
for (const [a, b, c] of rows) {
  const bad = !['чисто', 'все живые', 'по 8 слов в каждом', 'у каждого есть содержимое'].includes(c);
  console.log((bad ? '✗ ' : '✓ ') + a.padEnd(w0) + '  ' + b.padEnd(w1) + '  ' + c);
}
console.log('\n' + (totalFails ? '✗ ' : '✓ ') + totalChecks + ' блоков теста, ' + totalFails + ' проблем\n');
process.exit(totalFails ? 1 : 0);
