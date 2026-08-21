#!/usr/bin/env node
/*! Контент прототипа → seed.sql для Supabase.
 *
 *   node backend/export.mjs > backend/seed.sql
 *
 * Источник правды — те же файлы, которые читает браузер (data/*.js), поэтому
 * контент не переписывается руками во второй раз и не разъезжается. */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const D = (f) => path.join(HERE, '..', 'data', f);

const win = {};
for (const f of ['course.js', 'words.js', 'lesson_u1.js', 'diag.js'])
  new Function('window', readFileSync(D(f), 'utf8'))(win);

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a) => 'array[' + a.map(q).join(',') + ']';
const out = [];
out.push('-- сгенерировано: node backend/export.mjs. Руками не править.');
out.push('begin;');

for (const u of win.COURSE.units)
  out.push(`insert into en_units (id,week,num,title_kk,title_en,cando,grammar,level,is_ready) values (${q(u.id)},${u.w},${u.num},${q(u.kk)},${q(u.en)},${q(u.cando)},${q(u.gram)},${q(u.lvl)},${!!u.ready}) on conflict (id) do update set title_kk=excluded.title_kk, cando=excluded.cando, is_ready=excluded.is_ready;`);

for (const w of win.WORDS)
  out.push(`insert into en_words (unit,en,kk,grp,example) values (${q(w.u)},${q(w.en)},${q(w.kk)},${q(w.g)},${q(w.ex)}) on conflict (unit,en) do update set kk=excluded.kk, example=excluded.example;`);

/* вопросы: диагностика блоками + тест юнита + чекпоинты видео */
win.DIAG.blocks.forEach((b, bi) => b.q.forEach((x) =>
  out.push(`insert into en_questions (scope,block,kind,body,say,options,correct_index,explain) values ('diag',${bi + 1},${q(x.t === 'read' ? 'read' : x.t)},${q(x.q)},${x.say ? q(x.say) : 'null'},${arr(x.opts)},${x.a},${q('Диагностика: түсіндірме сабақта беріледі.')});`)));

const L = win.LESSON_U1;
L.test.forEach((x) =>
  out.push(`insert into en_questions (scope,unit,kind,body,options,correct_index,explain) values ('unit',${q(L.id)},'grammar',${q(x.q)},${arr(x.opts)},${x.a},${q(x.ex)});`));
L.video.checkpoints.forEach((c) =>
  out.push(`insert into en_questions (scope,unit,kind,body,options,correct_index,explain) values ('unit',${q(L.id)},'read',${q('[' + c.t + 'с] ' + c.q)},${arr(c.opts)},${c.a},${q(c.ex)});`));

out.push(`update en_units set video_url = ${q('media/u1_sabaq.mp4')} where id = 'u1';`);
out.push('commit;');
console.log(out.join('\n'));
