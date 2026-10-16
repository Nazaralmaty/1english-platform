/* Проверка демо «Контроль уроков» без браузера: подставляем фальшивый DOM,
   смотрим, что деньги и очередь расхождений сходятся.

   Проверяется ровно то, что ломается молча: зарплата (начислено =
   подтверждено + на проверке), четыре типа расхождений (спор, молчание
   клиента, урок без отметки учителя, низкая оценка) и то, что готовый
   урок берётся из настоящего курса, а не из пустоты. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('proverka.html', 'utf8');
const code = html.match(/<script>\n([\s\S]*?)<\/script>/)[1];

const stub = () => ({ onclick: null, onchange: null, textContent: '', className: '', value: '',
                      checked: false, disabled: false, style: {}, focus() {}, open: false,
                      showModal() {}, close() {},
                      getAttribute: () => '', querySelector: () => stub(), querySelectorAll: () => [] });
const root = {
  set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h || ''; },
  querySelector: () => stub(), querySelectorAll: () => [], style: {}
};
const dlgBody = { set innerHTML(v) {}, get innerHTML() { return ''; },
                  querySelector: () => stub(), querySelectorAll: () => [] };

const ctx = {
  console,
  document: {
    getElementById: (id) => (id === 'root' ? root : id === 'dlgBody' ? dlgBody : stub()),
    addEventListener() {}
  },
  setTimeout, clearTimeout, Date, Math, JSON, String, Number, Object, Array, RegExp,
  Promise, isNaN, encodeURIComponent,
  window: {}
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app/course.js', 'utf8'), ctx);
vm.runInContext(code, ctx);
const P = ctx.window.PROVERKA;

/* ── деньги ────────────────────────────────────────────────────────────
   Аяжан 7 уроков × 1150 = 8050, из них подтверждено 5 (5750).
   Тимур 5 × 1400 = 7000, клиент молчит — всё на проверке.
   Диана 4 × 1150 = 4600, подтверждено 2 (2300), один урок клиент
   подтвердил, а учитель его не отметил. */
const sum = P.students.reduce((a, s) => {
  const st = P.stat(s);
  a.accrued += st.accrued; a.confirmed += st.confirmed; a.hold += st.hold;
  return a;
}, { accrued: 0, confirmed: 0, hold: 0 });

assert.equal(sum.accrued, 19650, 'начислено по журналу');
assert.equal(sum.confirmed, 8050, 'подтверждено клиентами');
assert.equal(sum.hold, 11600, 'висит на проверке');
assert.equal(sum.accrued, sum.confirmed + sum.hold, 'начислено = подтверждено + на проверке');

/* ── очередь расхождений ────────────────────────────────────────────── */
const tk = P.tickets();
assert.equal(tk.length, 4, 'четыре расхождения');
assert.equal(tk.map((t) => t.kind).sort().join(','),
             'dispute,ghost,quality,silent',
             'каждый тип расхождения представлен');

/* Спор: урок 12.10 у Аяжана учитель отметил, клиент ответил «не прошёл».
   Разворачиваем в пользу урока — 1150 уходят из «на проверке» в
   «подтверждено», очередь пустеет. */
const before = P.stat(P.byId('s1'));
P.resolve(tk.find((t) => t.kind === 'dispute'), 'paid');
const after = P.stat(P.byId('s1'));
assert.equal(after.confirmed, before.confirmed + 1150, 'спор разобран в пользу урока');
assert.equal(after.hold, before.hold - 1150, 'деньги ушли из проверки');
assert.equal(P.tickets().length, 3, 'спор исчез из очереди');

/* ── готовый урок из курса ──────────────────────────────────────────── */
const ayazhan = P.byId('s1');
const next = P.plan(ayazhan, ayazhan.nextCourse);
assert.ok(next && next.title, 'следующий урок курса существует');
assert.equal(next.title, 'Future: Present Continuous', 'Аяжан на шестом уроке A2');
assert.ok(next.words.length >= 8, 'в уроке восемь слов курса');
assert.ok(/Слова:/.test(next.homework), 'домашка собирается из курса');

/* Темы уже стоящих уроков — тоже из курса, а не выдуманы. */
const les = ayazhan.lessons[0];
assert.ok(/Used To/.test(les.topic), 'тема урока взята из CONTENT курса');
assert.ok(/Слова:/.test(les.homework), 'домашка урока взята из CONTENT курса');

/* ── запрос клиенту ─────────────────────────────────────────────────── */
assert.equal(P.requestFor(P.byId('s2')).id, 'p1', 'Тимур ждёт подтверждения за 1–14 октября');
assert.equal(P.requestFor(P.byId('s1')).id, 'p2', 'Аяжан ответила — видит текущий период');
assert.ok(P.letter(P.byId('s2'), P.periods[0]).includes('Тимур'), 'в уведомлении имя клиента');

console.log('proverka ok: 19 650 ₸ начислено, 8 050 подтверждено, 4 расхождения, уроки из курса');
