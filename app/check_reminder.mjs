/* Проверка плашки «скоро урок»: ближайший урок по графику ученика.
   Ломается молча — переходом через неделю, уроком, который уже идёт,
   датой из сетки учителя вне обычных дней. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app/schedule.js', 'utf8'), ctx);
const next = ctx.window.SCHED.next;

const wed = (h, m) => new Date(2026, 8, 30, h, m);   /* 30.09.2026 — среда */
const card = { days: 'mon,wed', time: '18:00' };

assert.equal(next([card], wed(17, 0)).left, 60 * 60000, 'сегодня через час');
assert.equal(next([card], wed(18, 30)).left, -30 * 60000, 'идёт полчаса — всё ещё ближайший');
assert.equal(next([card], wed(19, 0)).start.getDate(), 5, 'кончился — следующий в понедельник 5.10');
assert.equal(next([{ days: 'wed', time: '09:00' }], wed(10, 0)).start.getDate(), 7, 'через неделю, в ту же среду');
assert.equal(next([{ days: '', time: '12:00', planned: [{ date: '2026-10-02' }] }], wed(10, 0)).start.getDate(), 2,
             'дата из сетки учителя вне обычных дней');
assert.equal(next([card, { days: 'thu', time: '10:00' }], wed(20, 0)).start.getDate(), 1, 'из двух карточек — ближайшая');
assert.equal(next([{ days: 'mon', time: '' }], wed(10, 0)), null, 'без времени урока нет');
assert.equal(next([], wed(10, 0)), null, 'без графика — null');

console.log('OK: плашка «скоро урок» — ближайший урок считается верно');
