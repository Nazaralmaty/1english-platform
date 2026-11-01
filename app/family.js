/*!
 * 1English · семейное приглашение: общее для kids/ и elders/.
 *
 * Ученик отправляет ссылку kids/?i=<токен> или elders/?i=<токен>&r=mama.
 * Ссылка и есть доступ: гость не вводит ни номер, ни код. Первый телефон,
 * открывший ссылку, становится её хозяином (en_invite_open в
 * backend/patch_2026-11-01_family.sql). Прогресс гостя живёт на телефоне и
 * копией уезжает в строку приглашения — ученик видит его в своём кабинете.
 *
 * ?demo=1 — без базы и без токена, пригласивший выдуман.
 */
(function (global) {
  'use strict';
  var q = new URLSearchParams(location.search);
  var DEMO = q.get('demo') === '1';
  var KEY = '1eng.fam' + (DEMO ? '.demo' : '');

  var F = {
    DEMO: DEMO,
    S: (function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    })()
  };
  F.save = function () { try { localStorage.setItem(KEY, JSON.stringify(F.S)); } catch (e) {} };

  /* Токен из ссылки запоминаем: дальше ребёнок открывает страницу с
     домашнего экрана, где хвоста ?i= уже нет. */
  if (q.get('i')) { F.S.token = q.get('i'); }
  if (q.get('r')) { F.S.rel = q.get('r'); }
  if (!F.S.lang) F.S.lang = 'kk';
  if (!F.S.dev) {
    var a = new Uint8Array(12);
    (global.crypto || global.msCrypto).getRandomValues(a);
    F.S.dev = Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }
  if (!F.S.seen) F.S.seen = [];
  if (!F.S.done) F.S.done = [];
  F.save();

  /* Открыть приглашение. Ответ: {ok, kind, owner_name, owner_phone,
     owner_gender, guest_name} или {ok:false, reason: bad|taken|none}.
     Нет сети, а раньше уже открывали — пускаем по прошлому ответу. */
  F.open = function (name) {
    if (DEMO) {
      F.S.owner = F.S.owner || { owner_name: 'Асқар', owner_phone: '77011234567', owner_gender: 'm' };
      if (name) F.S.name = name;
      F.save();
      return Promise.resolve({ ok: true, kind: F.KIND, guest_name: F.S.name });
    }
    if (!F.S.token) return Promise.resolve({ ok: false, reason: 'none' });
    return global.DB.anonRpc('en_invite_open', { p_token: F.S.token, p_device: F.S.dev, p_name: name || null })
      .then(function (r) {
        if (r && r.ok) {
          F.S.owner = { owner_name: r.owner_name, owner_phone: r.owner_phone, owner_gender: r.owner_gender };
          if (r.guest_name) F.S.name = r.guest_name;
          F.S.okAt = Date.now();
          F.save();
        }
        return r || { ok: false, reason: 'bad' };
      })
      .catch(function () {
        return F.S.okAt ? { ok: true, kind: F.KIND, guest_name: F.S.name, offline: true }
                        : { ok: false, reason: 'net' };
      });
  };

  /* Копия прогресса в базу: что посмотрел (seen) и что прошёл (done). */
  F.ping = function () {
    F.save();
    if (DEMO || !F.S.token) return;
    global.DB.anonRpc('en_invite_ping', {
      p_token: F.S.token, p_device: F.S.dev,
      p_progress: { seen: F.S.seen.slice(-60), done: F.S.done.slice(-60), lang: F.S.lang }
    }).catch(function () {});
  };

  F.mark = function (list, id) {
    if (F.S[list].indexOf(id) < 0) { F.S[list].push(id); F.ping(); return true; }
    return false;
  };

  F.owner = function () { return (F.S.owner && F.S.owner.owner_name) || ''; };

  /* «Рахмет» — сразу в WhatsApp пригласившему; номера нет — общий выбор чата. */
  F.wa = function (text) {
    var p = F.S.owner && F.S.owner.owner_phone;
    return 'https://wa.me/' + (p ? String(p).replace(/\D/g, '') : '') + '?text=' + encodeURIComponent(text);
  };

  F.speak = function (text, rate) {
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = rate || 0.9;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  };

  F.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  global.FAM = F;
})(window);
