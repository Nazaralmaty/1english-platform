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
 *  Файл ложится в backups/ГГГГ-ММ-ДД.json. Папка в .gitignore: данные
 *  учеников в публичном репозитории не нужны.
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
const file = path.join(dir, new Date().toISOString().slice(0, 10) + '.json');
fs.writeFileSync(file, JSON.stringify({
  taken_at: new Date().toISOString(), students, progress
}, null, 2));

console.log(`Сохранено: ${file}\nучеников ${students.length}, шагов ${progress.length}`);
