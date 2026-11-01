/*!
 * 1English · семейный подарок: общее для kids/ и elders/.
 *
 * У ученика один промокод на обе платформы, ссылка kids/?c=ABCDEFGH или
 * elders/?c=ABCDEFGH. Вход — имя + промокод (en_guest_enter в
 * backend/patch_2026-11-01_family.sql): первый вход закрепляет платформу за
 * этим именем, другое имя с тем же промокодом уже не пустят. Прогресс живёт
 * на телефоне и копией уезжает в базу; «Рахмет» приходит уведомлением в
 * кабинет ученика.
 *
 * ?demo=1 — без базы: любой промокод подходит, пригласивший выдуман.
 */
(function (global) {
  'use strict';
  var q = new URLSearchParams(location.search);
  var DEMO = q.get('demo') === '1';

  function make(kind) {
    var KEY = '1eng.' + kind + (DEMO ? '.demo' : '');
    var F = { DEMO: DEMO, KIND: kind };
    F.S = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
    F.save = function () { try { localStorage.setItem(KEY, JSON.stringify(F.S)); } catch (e) {} };
    if (q.get('c')) F.linkCode = q.get('c').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (q.get('r')) { F.S.rel = q.get('r'); }
    F.S.seen = F.S.seen || [];
    F.S.done = F.S.done || [];
    F.save();

    F.signedIn = function () { return !!(F.S.code && F.S.name); };

    /* Вход. Ответ {ok} или {ok:false, reason: code|taken|name|net}. */
    F.enter = function (code, name) {
      code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      name = String(name || '').trim();
      if (name.length < 2) return Promise.resolve({ ok: false, reason: 'name' });
      if (code.length !== 8) return Promise.resolve({ ok: false, reason: 'code' });
      function done(r) {
        F.S.code = code; F.S.name = r.guest_name || name;
        F.S.owner = { name: r.owner_name || '', gender: r.owner_gender || '' };
        var pr = r.progress || {};
        /* прогресс с другого телефона складываем с этим, ничего не теряя */
        ['seen', 'done'].forEach(function (k) {
          (pr[k] || []).forEach(function (id) { if (F.S[k].indexOf(id) < 0) F.S[k].push(id); });
        });
        F.save();
        return { ok: true };
      }
      if (DEMO) return Promise.resolve(done({ owner_name: 'Асқар', owner_gender: 'm', guest_name: name }));
      return global.DB.anonRpc('en_guest_enter', { p_code: code, p_kind: kind, p_name: name })
        .then(function (r) { return r && r.ok ? done(r) : (r || { ok: false, reason: 'code' }); })
        .catch(function () { return { ok: false, reason: 'net' }; });
    };

    function push(note) {
      F.save();
      if (DEMO || !F.signedIn()) return Promise.resolve(true);
      return global.DB.anonRpc('en_guest_save', {
        p_code: F.S.code, p_kind: kind, p_name: F.S.name,
        p_progress: { seen: F.S.seen.slice(-60), done: F.S.done.slice(-60) }, p_note: note || null
      }).then(function (ok) { return ok !== false; }).catch(function () { return false; });
    }

    F.mark = function (list, id) {
      if (F.S[list].indexOf(id) < 0) { F.S[list].push(id); push(); return true; }
      return false;
    };

    /* «Рахмет» — уведомление в кабинет пригласившего. */
    F.thank = function (note) { F.S.thankedAt = Date.now(); return push(note); };

    F.owner = function () { return (F.S.owner && F.S.owner.name) || ''; };
    F.logout = function () { delete F.S.code; delete F.S.name; F.save(); };
    return F;
  }

  global.FAM = {
    make: make,
    speak: function (text, rate) {
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = rate || 0.9;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) {}
    },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  };
})(window);
