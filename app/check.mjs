/*  Проверка данных курса и игрового банка слов.
 *  Запуск: node app/check.mjs
 *  Экраны проверяются в браузере (index.html?test=1), здесь — только данные:
 *  их ломает опечатка в course.js, а не вёрстка.
 */
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {}, localStorage: { getItem: () => null }, console };
ctx.global = ctx;
vm.createContext(ctx);
for (const f of ['app/course.js', 'app/words_bridge.js']) {
  vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
}
const { COURSE, VIDEOS, WORDS } = ctx.window;

let bad = 0;
const fail = (m) => { console.error('✗ ' + m); bad++; };

/* Плитка задания может быть из нескольких слов («a lot of», «going to»),
   поэтому ответ не разрезается по пробелам, а собирается из плиток.
   Длинные пробуются первыми: иначе «a» съест начало «a lot of». */
function canForm(tokens, answer) {
  let rest = answer, pool = tokens.slice();
  while (rest.length) {
    const order = pool.map((t, i) => [t, i]).sort((x, y) => y[0].length - x[0].length);
    const hit = order.find(([t]) => rest === t || rest.startsWith(t + ' '));
    if (!hit) return false;
    rest = rest.slice(hit[0].length).replace(/^ /, '');
    pool.splice(hit[1], 1);
  }
  return pool.length === 0;
}

/* ── курс ─────────────────────────────────────────────────────────── */
const ids = new Set();
/* Группы для игровых арен: по ним сортировка строит корзины. */
const GROUPS = new Set(['act', 'thing', 'sign', 'time', 'word']);
let lessons = 0, filled = 0, withVideo = 0, kkWords = 0;
for (const lv of COURSE.levels) {
  if (lv.lessons.length !== 14) fail(`уровень ${lv.id}: уроков ${lv.lessons.length}, а надо 14`);
  for (const s of lv.lessons) {
    lessons++;
    if (ids.has(s.id)) fail(`id урока повторяется: ${s.id}`);
    ids.add(s.id);
    if (!(s.id in VIDEOS)) fail(`${s.id}: нет слота под видео в window.VIDEOS`);
    if (VIDEOS[s.id]) {
      withVideo++;
      if (!/^[A-Za-z0-9_-]{11}$/.test(VIDEOS[s.id]))
        fail(`${s.id}: «${VIDEOS[s.id]}» не похоже на id ролика YouTube (11 символов)`);
    }
    /* Пустой урок — нормальное состояние. Проверяем только заполненные. */
    if (!s.words.length && !s.tasks.length && !s.rule) continue;
    filled++;
    for (const w of s.words) {
      if (!w.ru || !w.ex) fail(`${s.id}/${w.en}: нет перевода или примера`);
      if (w.g && !GROUPS.has(w.g)) fail(`${s.id}/${w.en}: группа «${w.g}» не из списка ${[...GROUPS].join(', ')}`);
      if (w.kk) kkWords++;
    }
    for (const t of s.tasks) {
      if (t.t === 'choice') {
        if (t.opts.length !== 3) fail(`${s.id}: у вопроса «${t.q}» вариантов ${t.opts.length}`);
        if (t.opts[t.a] == null) fail(`${s.id}: индекс верного ответа за пределами вариантов`);
        if (!t.why) fail(`${s.id}: у вопроса «${t.q}» нет объяснения`);
        /* Пропуск — это целое слово: ученик жмёт плитку, а не набирает буквы. */
        if (t.q.includes('___') && !/(^|[\s«"(])___($|[\s.,!?»")])/.test(t.q))
          fail(`${s.id}: пропуск стоит внутри слова — «${t.q}»`);
      } else if (t.t === 'order') {
        if (!canForm(t.words, t.a)) fail(`${s.id}: из слов не собирается ответ «${t.a}»`);
      } else fail(`${s.id}: неизвестный тип задания ${t.t}`);
    }
  }
}
/* Ключи VIDEOS без урока — опечатка в id, которую иначе не заметить. */
for (const id of Object.keys(VIDEOS)) if (!ids.has(id)) fail(`в VIDEOS есть ${id}, а урока с таким id нет`);

/* ── игровой банк ─────────────────────────────────────────────────── */
const groups = {};
for (const w of WORDS) {
  if (w.en.includes('/')) fail(`в банк игр попала пара форм: ${w.en}`);
  if (!w.kk) fail(`${w.en}: игры ждут перевод в поле kk`);
  groups[w.g] = (groups[w.g] || 0) + 1;
}
/* Сортировочная арена строит корзины по группам: группа из одного слова
   делает выбор очевидным. Пока слов в курсе мало, требовать это рано —
   правило включается, когда банк дорос до осмысленной партии. */
if (WORDS.length >= 12) {
  for (const [g, n] of Object.entries(groups)) if (n < 2) fail(`группа ${g}: всего ${n} слово`);
} else {
  console.log(`  (в банке ${WORDS.length} слов — для игр этого мало, проверка групп отложена)`);
}

console.log(bad
  ? `\n${bad} ошибок в данных`
  : `OK: уровней ${COURSE.levels.length}, уроков ${lessons} (с материалом ${filled}, с видео ${withVideo}), ` +
    `слов в банке ${WORDS.length}, групп ${Object.keys(groups).length}, ` +
    `с казахским переводом ${kkWords}`);
process.exit(bad ? 1 : 0);
