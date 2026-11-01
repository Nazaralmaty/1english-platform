/* Проверка черновика 01.11.2026: курс для старших, вакансии, гранты, мультики
   для детей. Ломается опечаткой: фраза без чтения или перевода, вакансия без
   ссылки, грант без официального сайта, мультик без слов урока. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['app/course.js', 'app/elders.js', 'app/jobs.js', 'app/unis.js'])
  vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const { ELDER, JOBS, UNIS, CARTOONS, CONTENT } = ctx.window;

/* старшие: 6 тем по 6 фраз, у каждой все четыре поля, тексты не повторяются */
assert.equal(ELDER.length, 6, 'тем для старших шесть');
const seen = new Set();
for (const p of ELDER) {
  assert.ok(p.id && p.kk && p.ru && p.noteKk && p.noteRu, 'тема без названия: ' + p.id);
  assert.equal(p.phrases.length, 6, 'в теме ' + p.id + ' не 6 фраз');
  for (const x of p.phrases) {
    for (const k of ['en', 'tr', 'kk', 'ru']) assert.ok(x[k] && x[k].trim(), p.id + ': у фразы нет ' + k + ' — ' + x.en);
    assert.ok(/^[^a-z]*$/i.test(x.tr.replace(/[.,!?’' ]/g, '')), 'чтение не кириллицей: ' + x.tr);
    assert.ok(!seen.has(x.en), 'фраза повторяется: ' + x.en);
    seen.add(x.en);
  }
  /* проверка ставит три разных перевода — одинаковые сделали бы вопрос без ответа */
  for (const L of ['kk', 'ru']) assert.equal(new Set(p.phrases.map(x => x[L])).size, 6, p.id + ': одинаковые переводы ' + L);
}

/* вакансии: у каждой название, ссылка на hh и известная профессия; дат нет */
const profs = new Set(JOBS.profs.map(p => p.id));
assert.ok(JOBS.items.length >= 40, 'вакансий меньше 40');
for (const j of JOBS.items) {
  assert.ok(j.t && /^https:\/\/([a-z]+\.)?hh\.(kz|ru)\/vacancy\/\d+$/.test(j.url), 'вакансия без ссылки: ' + j.t);
  assert.ok(profs.has(j.p), 'неизвестная профессия: ' + j.p);
  assert.ok(!('posted' in j) && !('date' in j), 'дата в вакансии');
}
for (const p of JOBS.profs) assert.ok(p.ru && p.kk, 'профессия без названия: ' + p.id);

/* гранты: официальный сайт, уровень, оба языка у текстовых полей */
assert.ok(UNIS.length >= 4, 'грантов меньше четырёх');
for (const u of UNIS) {
  assert.ok(/^https:\/\//.test(u.url), 'грант без сайта: ' + u.id);
  assert.ok(u.level && u.level.length, 'грант без уровня: ' + u.id);
  assert.ok(u.level.every(l => l === 'bachelor' || l === 'master'), 'уровень не bachelor/master: ' + u.id);
  for (const k of ['country', 'covers', 'when']) assert.ok(u[k] && u[k].ru && u[k].kk, u.id + ': нет ' + k);
  assert.ok(u.sources && u.sources.length, 'грант без источника: ' + u.id);
}
assert.ok(UNIS.some(u => u.level.includes('bachelor')), 'нет ни одного гранта для школьников');

/* дети: у каждого мультика есть слова урока и постер */
for (const id of Object.keys(CARTOONS)) {
  assert.ok(CARTOONS[id].poster && fs.existsSync(CARTOONS[id].poster), 'нет постера ' + id);
  assert.ok(((CONTENT[id] || {}).words || []).length >= 4, 'у мультика ' + id + ' нет слов');
}

console.log(`OK: старшим ${ELDER.length}×6 фраз, вакансий ${JOBS.items.length}, грантов ${UNIS.length}, мультиков ${Object.keys(CARTOONS).length}`);
