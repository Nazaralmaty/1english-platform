/*  Выгрузка базы в файл.
 *
 *  На бесплатном тарифе Supabase автоматических бэкапов нет вообще: если
 *  данные пропадут, восстанавливать будет нечего. Этот скрипт забирает всё
 *  через обычный API от имени админского аккаунта и кладёт в JSON.
 *
 *  Запуск:
 *      node backend/backup.mjs 77011234567 123456
 *  либо, чтобы код не оставался в истории команд:
 *      EN_PHONE=77011234567 EN_CODE=123456 node backend/backup.mjs
 *
 *  Рядом с JSON кладётся .sql — им же и восстанавливать: вставить в
 *  Supabase → SQL Editor → Run. Восстановление через обычный API невозможно,
 *  правила доступа не дают писать чужие строки, и это правильно.
 *
 *  Файлы ложатся в backups/. Папка в .gitignore: данные учеников в публичном
 *  репозитории не нужны.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://ckayydaqncvnbecjlltf.supabase.co';
const KEY = fs.readFileSync(new URL('../app/db.js', import.meta.url), 'utf8')
              .match(/eyJ[A-Za-z0-9._-]+/)[0];

const phone = (process.env.EN_PHONE || process.argv[2] || '').replace(/\D/g, '');
const code  = process.env.EN_CODE  || process.argv[3] || '';
if (phone.length !== 11 || !code) {
  console.error('Нужны номер и код: node backend/backup.mjs 77011234567 123456');
  process.exit(1);
}

async function api(pathname, opt = {}) {
  const res = await fetch(BASE + pathname, {
    method: opt.method || 'GET',
    headers: {
      apikey: KEY, 'Content-Type': 'application/json',
      ...(opt.token ? { Authorization: 'Bearer ' + opt.token } : {})
    },
    body: opt.body ? JSON.stringify(opt.body) : undefined
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || data?.msg || 'HTTP ' + res.status);
  return data;
}

const auth = await api('/auth/v1/token?grant_type=password', {
  method: 'POST', body: { email: phone + '@1eng.kz', password: code }
});
const token = auth.access_token;

const [students, progress, admins] = await Promise.all([
  api('/rest/v1/en_students?select=*', { token }),
  api('/rest/v1/en_progress?select=*', { token }),
  api('/rest/v1/en_admins?select=id', { token })
]);

if (!admins.length) {
  console.error('Этот аккаунт не в en_admins — выгрузятся только его собственные строки.');
}

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'backups');
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const file = path.join(dir, stamp + '.json');
fs.writeFileSync(file, JSON.stringify({
  taken_at: new Date().toISOString(), students, progress
}, null, 2));

/* ── тот же слепок в виде SQL ──────────────────────────────────────────
   Восстановление идёт через панель, потому что через API чужие строки не
   записать: RLS не даст, и убирать её ради восстановления нельзя. */
const q = (v) => v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;

const cols = ['id','phone','name','gender','level','lang','theme','consent_at','consent_v','created_at'];
const sql = [
  `-- Восстановление из выгрузки ${stamp}. Supabase → SQL Editor → Run.`,
  `-- Существующие строки перезаписываются, лишние не удаляются.`,
  '',
  ...students.map(s => `insert into public.en_students (${cols.join(', ')}) values (${
    cols.map(c => q(s[c])).join(', ')}) on conflict (id) do update set ${
    cols.filter(c => c !== 'id').map(c => `${c} = excluded.${c}`).join(', ')};`),
  '',
  ...progress.map(p => `insert into public.en_progress (student_id, lesson, step, right_count, total_count, updated_at) values (${
    q(p.student_id)}, ${q(p.lesson)}, ${q(p.step)}, ${p.right_count ?? 'null'}, ${p.total_count ?? 'null'}, ${q(p.updated_at)
    }) on conflict (student_id, lesson, step) do update set right_count = excluded.right_count, total_count = excluded.total_count, updated_at = excluded.updated_at;`)
].join('\n');

const sqlFile = path.join(dir, stamp + '.sql');
fs.writeFileSync(sqlFile, sql + '\n');

console.log(`Сохранено:\n  ${file}\n  ${sqlFile}\nучеников ${students.length}, шагов ${progress.length}`);
