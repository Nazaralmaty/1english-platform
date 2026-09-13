/* Проверка дашборда без браузера: подставляем фальшивый DOM и данные,
   смотрим, что таблица собирается и цифры сходятся.

   Заглушка DOM должна уметь всё, что дашборд зовёт на самом деле:
   querySelectorAll, activeElement, contains. Раньше их не было, дашборд
   падал внутри busy(), исключение уходило в catch у pull(), рендера не
   происходило — и проверка краснела на всех пунктах, не находя при этом
   ни одной настоящей поломки. */
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('dashboard.html', 'utf8');
const code = html.match(/<script>\n([\s\S]*?)<\/script>/)[1];

let rendered = '';
const stub = () => ({ onclick: null, textContent: '', className: '', value: '',
                      lastChild: {}, style: {},
                      querySelector: () => stub(), querySelectorAll: () => [] });
const root = {
  set innerHTML(v) { rendered = v; }, get innerHTML() { return rendered; },
  querySelector: () => stub(), querySelectorAll: () => [],
  contains: () => false, style: {}
};

const ctx = {
  console,
  document: { getElementById: () => root, addEventListener() {}, hidden: false, activeElement: null },
  setInterval: () => 1, clearInterval() {},
  Date, Math, JSON, String, Number, Object, Array, RegExp, Promise, isNaN,
  window: {}
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app/course.js', 'utf8'), ctx);
ctx.COURSE = ctx.window.COURSE; ctx.VIDEOS = ctx.window.VIDEOS;

/* db.js трогает fetch и localStorage — подменяем на молчаливые заглушки */
ctx.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
ctx.fetch = () => Promise.reject(new Error('нет сети'));
vm.runInContext(fs.readFileSync('app/db.js', 'utf8'), ctx);
ctx.DB = ctx.window.DB;

const now = new Date().toISOString();

/* Ученик «в» прошёл весь Beginner и ушёл на Elementary. Его старые строки
   никуда не делись: если считать их в знаменателе нового уровня, процент
   улетает за сотню. Ученик «г» пишет себе номер с кавычкой — так выглядит
   попытка вылезти из атрибута в разметку дашборда. */
const movedOn = [];
for (let i = 1; i <= 14; i++)
  for (const step of ['read', 'task', 'words'])
    movedOn.push({ student_id: 'v', lesson: 'b' + i, step, updated_at: now });

ctx.DB.listAll = () => Promise.resolve({
  isAdmin: true,
  students: [
    { id: 'a', phone: '77011234567', name: 'Айсұлтан', level: 'beginner', updated_at: now },
    { id: 'b', phone: '77029876543', name: '', level: 'elementary', updated_at: '2026-09-01T10:00:00Z' },
    { id: 'v', phone: '77015550000', name: 'Сменил уровень', level: 'elementary', updated_at: now },
    { id: 'g', phone: '77013334444" onmouseover="beda()', name: 'Кавычка', level: 'beginner', updated_at: now }
  ],
  progress: [
    { student_id: 'a', lesson: 'b1', step: 'read', updated_at: now },
    { student_id: 'a', lesson: 'b2', step: 'read', updated_at: now },
    { student_id: 'b', lesson: 'e13', step: 'read', updated_at: '2026-09-01T10:00:00Z' },
    { student_id: 'b', lesson: 'e13', step: 'task', right_count: 5, total_count: 6, updated_at: '2026-09-01T10:00:00Z' },
    { student_id: 'b', lesson: 'e13', step: 'words', updated_at: '2026-09-01T10:00:00Z' }
  ].concat(movedOn),
  /* партии в играх: en_games появилась патчем, дашборд считает их отдельно */
  games: [
    { student_id: 'a', game: 'flappy_english', right_count: 7, wrong_count: 2, created_at: now },
    { student_id: 'a', game: 'surypta', right_count: 5, wrong_count: 1, created_at: now },
    { student_id: 'b', game: 'soilem', right_count: 4, wrong_count: 0, created_at: '2026-01-01T10:00:00Z' }
  ]
});
ctx.DB.allowed = { list: () => Promise.resolve([]) };
ctx.DB.init = () => true;

vm.runInContext(code, ctx);

await new Promise(r => setTimeout(r, 50));

const fails = [];
const has = (t, why) => { if (!rendered.includes(t)) fails.push(why + ' — нет «' + t + '»'); };

if (!rendered) {
  console.log('✗ дашборд вообще ничего не нарисовал — смотрите заглушку DOM выше');
  process.exit(1);
}

has('Айсұлтан', 'имя ученика');
has('Без имени', 'ученик без имени');
has('+7 (702) 987 65 43', 'форматирование номера');
has('Beginner', 'уровень');
has('Elementary', 'уровень');
has('>4<', 'учеников всего');
has('>47<', 'шагов пройдено');

/* Проценты считаем тем же способом, что и дашборд, а не цифрой в тексте:
   иначе проверка будет падать каждый раз, когда в курс добавят материал. */
const capacity = (lvl) => ctx.COURSE.levels
  .find(l => l.id === lvl).lessons
  .reduce((n, s) => n + ((ctx.VIDEOS[s.id] || s.rule) ? 1 : 0) + (s.tasks.length ? 1 : 0) + (s.words.length ? 1 : 0), 0);
has(Math.round(2 / capacity('beginner') * 100) + '%', 'процент по Beginner');
has(Math.round(3 / capacity('elementary') * 100) + '%', 'процент по Elementary');
/* у «б» закрыт ровно один урок — e13, единственный с полным материалом */
const closed = /Без имени[\s\S]*?<td class="num">(\d+)<\/td>/.exec(rendered);
if (!closed) fails.push('строки «Без имени» нет в таблице');
else if (closed[1] !== '1') fails.push('закрытые уроки не посчитались: ' + closed[1] + ' вместо 1');

/* Прогресс чужого уровня в знаменатель не идёт: у «Сменил уровень» весь
   Beginner пройден, а Elementary он ещё не начинал — значит 0%. */
const moved = /Сменил уровень[\s\S]*?<span>(\d+)%<\/span>/.exec(rendered);
if (!moved) fails.push('строки «Сменил уровень» нет в таблице');
else if (moved[1] !== '0') fails.push('прогресс чужого уровня попал в процент — ' + moved[1] + '%');
if (/<span>(\d{3,})%<\/span>/.test(rendered)) fails.push('процент больше 100');

/* Игры: за неделю две партии, у «а» их всего две, у давней не считается. */
has('партий в играх за 7 дней', 'плитка по играм');
if (!/<b>2<\/b><span>партий в играх за 7 дней<\/span>/.test(rendered))
  fails.push('партии за неделю посчитались неверно');

/* Кавычка в номере не должна выламываться из атрибута. */
if (/data-reset="[^"]*"\s+on/i.test(rendered)) fails.push('номер вылез из атрибута data-reset');
if (/onmouseover/i.test(rendered)) fails.push('в разметку попал чужой обработчик');

console.log(fails.length ? '✗ ' + fails.join('\n✗ ') : 'OK: дашборд собирается, цифры сходятся');
process.exit(fails.length ? 1 : 0);
