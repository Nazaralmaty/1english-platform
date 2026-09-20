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

/* Недельная сетка живёт отдельным файлом: её рисуют и дашборд, и кабинет.
   Свои стили она вставляет в <head> — заглушке хватает пустышек. */
ctx.document.createElement = () => ({ style: {} });
ctx.document.head = { appendChild() {} };
vm.runInContext(fs.readFileSync('app/schedule.js', 'utf8'), ctx);
ctx.SCHED = ctx.window.SCHED;

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
ctx.DB.rest = () => Promise.resolve([]);
ctx.DB.rpc = () => Promise.resolve('Готово');

/* Учитель с графиком и два его ученика. «Данияр» сидит в четверг 20:00 —
   вне рабочих часов: такую накладку сетка обязана показать словами, иначе
   её не найдёт никто. */
const base = ctx.DB.listAll;
const lessons = (done) => Array.from({ length: 12 }, (_, i) => ({
  id: 'l' + i, done: i < done,
  done_at: i < done ? new Date().toISOString() : null }));
ctx.DB.listAll = () => base().then(d => Object.assign(d, {
  teachers: [{ id: 't1', name: 'Айгерім', phone: '77015550000', rate: 1150,
               slots: 'mon@18:00,tue@18:00,wed@18:00,thu@18:00,fri@18:00,mon@19:00' }],
  cards: [
    { id: 'c1', teacher_id: 't1', name: 'Аяжан', phone: '77011234567', format: 'individual',
      days: 'mon,wed,fri', time_at: '18:00', archived: false, rate: null, lessons: lessons(9) },
    { id: 'c2', teacher_id: 't1', name: 'Данияр', phone: '77029876543', format: 'group',
      days: 'thu', time_at: '20:00', archived: false, rate: 2000, lessons: lessons(4) }
  ]
}));
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

/* Вкладки: на «Учениках» анкеты нет, она на «Завести». */
if (rendered.includes('id="nsTeacher"')) fails.push('анкета нового ученика попала на вкладку «Ученики»');
has('data-view="sched"', 'кнопка вкладки «Графики»');
has('data-view="all"', 'кнопка вкладки «Сводная»');

/* Кавычка в номере не должна выламываться из атрибута. */
if (/data-reset="[^"]*"\s+on/i.test(rendered)) fails.push('номер вылез из атрибута data-reset');
if (/onmouseover/i.test(rendered)) fails.push('в разметку попал чужой обработчик');

/* ── остальные вкладки ──────────────────────────────────────────────
   Вкладка живёт в замыкании, поэтому каждую проверяем своим запуском с
   другим значением по умолчанию — так же, как это делает пользователь
   кнопкой. */
async function tab(name) {
  rendered = '';
  vm.runInContext(code.replace("var view = 'students';", "var view = '" + name + "';"), ctx);
  await new Promise(r => setTimeout(r, 50));
  return rendered;
}

/* Завести: анкета ученика заполняется здесь целиком — учитель её не
   создаёт, он в неё преподаёт. Пропало поле — пропала половина кабинета. */
await tab('new');
['nsTeacher','nsAge','nsCity','nsLvlText','nsFormat','nsTime','nsMonths','nsPer',
 'nsRate','nsStart','nsGoal','nsNote','nsTopics','nsHw'].forEach(
  id => has('id="' + id + '"', 'поле анкеты ' + id));
has('data-day="mon"', 'дни недели в анкете');
has('id="tcAdd"', 'панель «Учителя»');
has('data-tday="mon"', 'дни недели в графике учителя');
has('Айгерім', 'учитель в списке');
has('2 ученика', 'склонение: «2 ученика», а не «2 учеников»');
has('6 окон в неделю', 'сколько рабочих окон у учителя');

/* Графики: недельная сетка одного учителя. */
await tab('sched');
has('data-sheet="t1"', 'лист учителя');
has('Аяжан', 'ученик в сетке');
has('вне графика', 'ученик вне рабочих часов учителя подсвечен');
has('свободно 3', 'счёт свободных окон');   /* пн 19:00, вт 18:00, чт 18:00 */
if (!/data-slot="mon@18:00"/.test(rendered)) fails.push('занятая клетка без data-slot');
if (!/data-slot="tue@18:00"[^>]*>свободно/.test(rendered))
  fails.push('свободное окно не помечено как свободное');

/* Сводная: все ученики всех учителей. */
await tab('all');
has('Аяжан', 'ученик в сводной');
has('Данияр', 'второй ученик в сводной');
has('Айгерім', 'учитель в сводной');
has('1150 ₸', 'ставка по умолчанию 1150');
has('2000 ₸', 'своя ставка из карточки');
/* 9 уроков Аяжан по 1150 и 4 Данияра по 2000 — 10 350 + 8 000 = 18 350 */
has('18 350 ₸', 'итого к выплате за месяц');
has('>13<', 'уроков в этом месяце');

console.log(fails.length ? '✗ ' + fails.join('\n✗ ') : 'OK: дашборд собирается, цифры сходятся');
process.exit(fails.length ? 1 : 0);
