/* Проверка данных вкладки «Учёба»: node app/check_campus.mjs
   Каждый вуз ссылается на существующий грант, город и направления; у каждой
   картинки есть файл и автор. Падает с кодом 1 на первой же дыре — запускать
   после каждого нового вуза. */
import fs from 'fs';
const window = {}; globalThis.window = window;
for (const f of ['app/unis.js', 'app/campus.js']) new Function('window', fs.readFileSync(f, 'utf8'))(window);
const err = [];
const progs = new Set(window.UNIS.map(u => u.id)), fields = new Set(window.FIELDS.map(f => f.id));
const file = n => fs.existsSync(`assets/unis/${n}.jpg`) || err.push(`нет файла assets/unis/${n}.jpg`);
for (const id of progs) if (!window.PROG[id]) err.push(`PROG без гранта ${id}`);
for (const c of window.CAMPUS) {
  if (!progs.has(c.prog)) err.push(`${c.id}: нет гранта ${c.prog}`);
  const city = window.CITIES[c.city];
  if (!city) err.push(`${c.id}: нет города ${c.city}`); else { file(city.img); if (!window.PHOTO_CREDIT[city.img]) err.push(`нет автора ${city.img}`); }
  file(c.img); if (!window.PHOTO_CREDIT[c.img]) err.push(`нет автора ${c.img}`);
  c.fields.forEach(f => fields.has(f) || err.push(`${c.id}: направление ${f}`));
  if (!c.fact.ru || !c.fact.kk) err.push(`${c.id}: факт без перевода`);
  c.alumni.forEach(a => { file('p_' + a.p); if (!a.what.kk) err.push(`${c.id}/${a.p}: без казахского`); });
}
for (const f of window.FIELDS) if (!window.CAMPUS.some(c => c.fields.includes(f.id))) err.push(`направление ${f.id} без вузов`);
if (err.length) { console.error(err.join('\n')); process.exit(1); }
console.log(`OK: ${window.CAMPUS.length} вузов, ${Object.keys(window.CITIES).length} городов, ${window.UNIS.length} грантов`);
