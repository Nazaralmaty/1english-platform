/* Проверка дашборда без браузера: подставляем фальшивый DOM и данные,
   смотрим, что таблица собирается и цифры сходятся. */
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('dashboard.html', 'utf8');
const code = html.match(/<script>\n([\s\S]*?)<\/script>/)[1];

let rendered = '';
const el = () => ({ set innerHTML(v) { rendered = v; }, get innerHTML() { return rendered; },
                    querySelector: () => ({ onclick: null, textContent: '', className: '', lastChild: {} }),
                    style: {} });
const root = el();

const ctx = {
  console,
  document: { getElementById: () => root, addEventListener() {}, hidden: false },
  setInterval: () => 1, clearInterval() {},
  Date, Math, JSON, String, Number, Object, Promise, isNaN,
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
ctx.DB.listAll = () => Promise.resolve({
  isAdmin: true,
  students: [
    { id: 'a', phone: '77011234567', name: 'Айсұлтан', level: 'beginner', updated_at: now },
    { id: 'b', phone: '77029876543', name: '', level: 'elementary', updated_at: '2026-09-01T10:00:00Z' }
  ],
  progress: [
    { student_id: 'a', lesson: 'b1', step: 'read', updated_at: now },
    { student_id: 'a', lesson: 'b2', step: 'read', updated_at: now },
    { student_id: 'b', lesson: 'e13', step: 'read', updated_at: '2026-09-01T10:00:00Z' },
    { student_id: 'b', lesson: 'e13', step: 'task', right_count: 5, total_count: 6, updated_at: '2026-09-01T10:00:00Z' },
    { student_id: 'b', lesson: 'e13', step: 'words', updated_at: '2026-09-01T10:00:00Z' }
  ]
});
ctx.DB.init = () => true;

vm.runInContext(code, ctx);

await new Promise(r => setTimeout(r, 50));

const fails = [];
const has = (t, why) => { if (!rendered.includes(t)) fails.push(why + ' — нет «' + t + '»'); };
has('Айсұлтан', 'имя ученика');
has('Без имени', 'ученик без имени');
has('+7 (702) 987 65 43', 'форматирование номера');
has('Beginner', 'уровень');
has('Elementary', 'уровень');
has('>2<', 'учеников всего');
has('>5<', 'шагов пройдено');
/* Проценты считаем тем же способом, что и дашборд, а не цифрой в тексте:
   иначе проверка будет падать каждый раз, когда в курс добавят материал. */
const capacity = (lvl) => ctx.COURSE.levels
  .find(l => l.id === lvl).lessons
  .reduce((n, s) => n + ((ctx.VIDEOS[s.id] || s.rule) ? 1 : 0) + (s.tasks.length ? 1 : 0) + (s.words.length ? 1 : 0), 0);
has(Math.round(2 / capacity('beginner') * 100) + '%', 'процент по Beginner');
has(Math.round(3 / capacity('elementary') * 100) + '%', 'процент по Elementary');
if (!/Уроков закрыто[\s\S]*?<td>1<\/td>/.test(rendered)) fails.push('закрытые уроки не посчитались');

console.log(fails.length ? '✗ ' + fails.join('\n✗ ') : 'OK: дашборд собирается, цифры сходятся');
process.exit(fails.length ? 1 : 0);
