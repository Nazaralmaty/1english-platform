#!/usr/bin/env node
/*! Контент прототипа → seed.sql для Supabase.
 *
 *   node backend/export.mjs > backend/seed.sql
 *
 * Источник правды — те же файлы, которые читает браузер (data/*.js):
 * контент не переписывается второй раз руками и не разъезжается. */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const D = (f) => path.join(HERE, '..', 'data', f);

const win = {};
for (const f of ['course.js', 'words.js', 'lessons_b.js', 'lessons_e.js', 'diag.js', 'monthly.js'])
  new Function('window', readFileSync(D(f), 'utf8')
    .replace(/^(COURSE|WORDS|LESSONS)\./gm, 'window.$1.'))(win);

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a) => 'array[' + a.map(q).join(',') + ']';
const out = ['-- сгенерировано: node backend/export.mjs. Руками не править.', 'begin;'];

for (const l of win.COURSE.levels)
  out.push(`insert into en_levels (id,name,cefr,kk,about) values (${q(l.id)},${q(l.name)},${q(l.cefr)},${q(l.kk)},${q(l.about)}) on conflict (id) do update set name=excluded.name, about=excluded.about;`);

for (const m of win.COURSE.modules)
  out.push(`insert into en_modules (id,level,num,kk,goal,is_ready) values (${q(m.id)},${q(m.level)},${m.num},${q(m.kk)},${q(m.goal)},${m.ready !== false}) on conflict (id) do update set kk=excluded.kk, goal=excluded.goal, is_ready=excluded.is_ready;`);

for (const u of win.COURSE.units)
  out.push(`insert into en_units (id,level,module,num,title_kk,title_en,cando,grammar,level_cefr,is_ready) values (${q(u.id)},${q(u.level)},${q(u.mod)},${u.num},${q(u.kk)},${q(u.en)},${q(u.cando)},${q(u.gram)},${q(u.lvl)},${!!u.ready}) on conflict (id) do update set title_kk=excluded.title_kk, cando=excluded.cando, is_ready=excluded.is_ready;`);

for (const w of win.WORDS)
  out.push(`insert into en_words (unit,en,kk,grp,example) values (${q(w.u)},${q(w.en)},${q(w.kk)},${q(w.g)},${q(w.ex)}) on conflict (unit,en) do update set kk=excluded.kk, example=excluded.example;`);

/* вопросы: входная диагностика, тесты уроков, чекпоинты видео, месячный тест */
win.DIAG.blocks.forEach((b, bi) => b.q.forEach((x) =>
  out.push(`insert into en_questions (scope,block,kind,body,say,options,correct_index,explain) values ('diag',${bi + 1},${q(x.t === 'read' ? 'read' : x.t)},${q(x.q)},${x.say ? q(x.say) : 'null'},${arr(x.opts)},${x.a},${q('Диагностика: түсіндірме сабақта беріледі.')});`)));

for (const [id, L] of Object.entries(win.LESSONS)) {
  L.test.forEach((x) =>
    out.push(`insert into en_questions (scope,unit,kind,body,options,correct_index,explain) values ('unit',${q(id)},'grammar',${q(x.q)},${arr(x.opts)},${x.a},${q(x.ex)});`));
  (L.video ? L.video.checkpoints : []).forEach((c) =>
    out.push(`insert into en_questions (scope,unit,kind,body,options,correct_index,explain) values ('unit',${q(id)},'read',${q('[' + c.t + 'с] ' + c.q)},${arr(c.opts)},${c.a},${q(c.ex)});`));
  if (L.video) out.push(`update en_units set video_url = ${q('media/' + L.video.src.split('/').pop())} where id = ${q(id)};`);
}
out.push('commit;');
console.log(out.join('\n'));
