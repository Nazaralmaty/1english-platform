/* Проверка reading.html: каждое [слово] в тексте есть в словаре урока, и
   каждое слово урока хоть раз встречается в тексте. Иначе на экране будет
   некликабельная пометка или слово, которое нигде не открыть. */
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app/course.js', 'utf8'), ctx);
const C = ctx.window.CONTENT;
const html = fs.readFileSync('reading.html', 'utf8');
const src = html.match(/var TEXTS = (\{[\s\S]*?\n  \});/)[1];
const TEXTS = vm.runInNewContext('(' + src + ')');

const fails = [];
Object.keys(TEXTS).forEach(id => {
  const words = (C[id] || { words: [] }).words.map(w => w.en);
  const used = new Set();
  for (const m of TEXTS[id].matchAll(/\[([^\]|]+)(?:\|([^\]]+))?\]/g)) {
    const key = m[2] || m[1];
    const hit = words.find(w => w === key || w === key.toLowerCase());
    if (!hit) fails.push(id + ': «' + key + '» нет в словаре урока');
    else used.add(hit);
  }
  words.forEach(w => { if (!used.has(w)) fails.push(id + ': слово «' + w + '» не встречается в тексте'); });
});
console.log(fails.length ? '✗ ' + fails.join('\n✗ ') : 'OK: чтение — ' + Object.keys(TEXTS).length + ' текстов, все слова уроков на месте');
process.exit(fails.length ? 1 : 0);
