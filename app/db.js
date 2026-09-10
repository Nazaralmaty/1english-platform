/*!
 * 1English · Supabase.
 *
 * Чистый fetch, без библиотек: платформа остаётся набором файлов, который
 * открывается по ссылке и работает внутри WebView.
 *
 * ЧТО ЗДЕСЬ ЛЕЖИТ ОТКРЫТО. anon-ключ виден любому, кто откроет исходник
 * страницы, и так задумано. Сам по себе он ничего не открывает: вся защита
 * в правилах RLS (backend/supabase_min.sql) — ученик читает и пишет только
 * свои строки. Ключ, который нельзя показывать, — service_role, его в
 * браузере нет и быть не должно.
 *
 * ВХОД ПО НОМЕРУ. Телефонный вход в Supabase требует платного SMS-провайдера
 * (около 30 ₸ за сообщение, и при регистрации, и при каждом входе). Поэтому
 * номер превращается в технический адрес 77001234567@1eng.kz, письма туда
 * физически не уходят. Настоящий номер лежит в en_students.phone: когда
 * подключим SMS-шлюз, переход будет без потери аккаунтов.
 *
 * ОФЛАЙН. База — зеркало, а не источник правды на экране. Состояние живёт
 * в localStorage и рисуется мгновенно; на сервер уходит копия. Нет сети —
 * приложение работает как раньше, копия уедет при следующем сохранении.
 */
(function (global) {
  'use strict';

  var URL_BASE = 'https://ckayydaqncvnbecjlltf.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYXl5ZGFxbmN2bmJlY2psbHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODE1MjUsImV4cCI6MjA3NTI1NzUyNX0.o_7QJTdpkl14axm8vDfVH7NahbTvJreHAuI62dYG6U8';
  var AUTH_DOMAIN = '1eng.kz';
  var STORE_KEY = '1eng.session';

  var session = null;

  /* ── сессия ───────────────────────────────────────────────────────── */
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
  }
  function keep(s) {
    session = s;
    try {
      if (s) localStorage.setItem(STORE_KEY, JSON.stringify(s));
      else localStorage.removeItem(STORE_KEY);
    } catch (e) {}
  }
  function store(data) {
    if (!data || !data.access_token) return null;
    keep({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user && data.user.id,
      expires_at: Date.now() + ((data.expires_in || 3600) - 60) * 1000
    });
    return session;
  }

  /* ── запрос ───────────────────────────────────────────────────────── */
  function req(path, opt) {
    opt = opt || {};
    var headers = { apikey: ANON_KEY, 'Content-Type': 'application/json' };
    if (opt.token) headers.Authorization = 'Bearer ' + opt.token;
    if (opt.headers) Object.keys(opt.headers).forEach(function (k) { headers[k] = opt.headers[k]; });

    return fetch(URL_BASE + path, {
      method: opt.method || 'GET',
      headers: headers,
      body: opt.body ? JSON.stringify(opt.body) : undefined
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
        if (!res.ok) {
          var e = new Error((data && (data.msg || data.message || data.error_description ||
                                      data.error || data.hint)) || ('Ошибка ' + res.status));
          e.status = res.status;
          e.code = data && (data.error_code || data.code);
          throw e;
        }
        return data;
      });
    });
  }

  /* Токен живёт час. Истёк — молча обновляем. */
  function token() {
    if (!session) return Promise.reject(new Error('Нужно войти'));
    if (Date.now() < session.expires_at) return Promise.resolve(session.access_token);
    return req('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', body: { refresh_token: session.refresh_token }
    }).then(function (d) { return store(d).access_token; })
      .catch(function (err) { keep(null); throw err; });
  }

  /* Любой казахстанский формат → 77001234567, чтобы один человек не завёл
     два аккаунта, набрав номер по-разному. */
  function normPhone(raw) {
    var d = (raw || '').replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '8') d = '7' + d.slice(1);
    if (d.length === 10) d = '7' + d;
    return (d.length === 11 && d.charAt(0) === '7') ? d : null;
  }
  function asEmail(phone) { return phone + '@' + AUTH_DOMAIN; }

  var DB = {
    ready: false,          /* есть живая сессия */
    online: true,          /* последняя запись прошла */
    userId: null,

    init: function () {
      session = load();
      DB.ready = !!session;
      DB.userId = session && session.user_id;
      return DB.ready;
    },

    /* Вход и регистрация одной кнопкой: сначала пробуем войти, и только
       если такого аккаунта нет — заводим. Ошибка «уже зарегистрирован»
       означает, что человек ошибся кодом, а не что он новый. */
    enter: function (rawPhone, pin) {
      var phone = normPhone(rawPhone);
      if (!phone) return Promise.reject(new Error('Проверьте номер'));
      if (!pin || pin.length < 6) return Promise.reject(new Error('Код из шести цифр'));

      return req('/auth/v1/token?grant_type=password', {
        method: 'POST', body: { email: asEmail(phone), password: pin }
      }).then(function (d) {
        store(d);
        return { created: false };
      }).catch(function (err) {
        if (err.status !== 400) throw err;
        return req('/auth/v1/signup', {
          method: 'POST', body: { email: asEmail(phone), password: pin }
        }).then(function (d) {
          if (d && d.access_token) { store(d); return { created: true }; }
          /* в проекте включено подтверждение — входим сразу */
          return req('/auth/v1/token?grant_type=password', {
            method: 'POST', body: { email: asEmail(phone), password: pin }
          }).then(function (d2) { store(d2); return { created: true }; });
        }).catch(function (e2) {
          if (/already/i.test(e2.message)) throw new Error('Неверный код');
          throw e2;
        });
      }).then(function (res) {
        DB.ready = true;
        DB.userId = session.user_id;
        return DB.saveProfile({ phone: phone }).then(function () { return res; });
      });
    },

    signOut: function () { keep(null); DB.ready = false; DB.userId = null; },

    /* Профиль: одна строка на ученика, перезаписывается целиком.
       Если в базе ещё нет какой-то колонки (схему обновили позже кода),
       PostgREST называет её по имени — выкидываем и пробуем снова, чтобы
       из-за одного нового поля не потерялось всё остальное. */
    saveProfile: function (fields) {
      if (!DB.ready) return Promise.resolve(null);

      var body = { id: session.user_id };
      Object.keys(fields).forEach(function (k) {
        if (fields[k] !== undefined && fields[k] !== '' && fields[k] !== null) body[k] = fields[k];
      });

      function attempt(left) {
        return token().then(function (tk) {
          return req('/rest/v1/en_students?on_conflict=id', {
            method: 'POST', token: tk,
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: body
          });
        }).catch(function (err) {
          var miss = /Could not find the '([a-z_]+)' column/i.exec(err.message || '');
          if (miss && left > 0 && (miss[1] in body)) {
            console.warn('[db] в базе нет колонки ' + miss[1] + ', отправляю без неё');
            delete body[miss[1]];
            return attempt(left - 1);
          }
          throw err;
        });
      }

      return attempt(3)
        .then(function (rows) { DB.online = true; return (rows && rows[0]) || null; })
        .catch(function (err) { DB.online = false; console.warn('[db] профиль не сохранён:', err.message); return null; });
    },

    /* Шаг урока: read | task | words. */
    saveStep: function (lesson, step, right, total) {
      if (!DB.ready) return Promise.resolve(null);
      return token().then(function (tk) {
        return req('/rest/v1/en_progress?on_conflict=student_id,lesson,step', {
          method: 'POST', token: tk,
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: {
            student_id: session.user_id, lesson: lesson, step: step,
            right_count: right == null ? null : right,
            total_count: total == null ? null : total
          }
        });
      }).then(function () { DB.online = true; return true; })
        .catch(function (err) { DB.online = false; console.warn('[db] шаг не сохранён:', err.message); return false; });
    },

    /* Всё, что есть на сервере: профиль и прогресс. */
    pull: function () {
      if (!DB.ready) return Promise.resolve(null);
      return token().then(function (tk) {
        return Promise.all([
          req('/rest/v1/en_students?select=*&limit=1', { token: tk }),
          req('/rest/v1/en_progress?select=*', { token: tk })
        ]);
      }).then(function (r) {
        DB.online = true;
        return { profile: (r[0] && r[0][0]) || null, progress: r[1] || [] };
      }).catch(function (err) {
        DB.online = false;
        console.warn('[db] не прочитали сервер:', err.message);
        return null;
      });
    },

    /* Дашборд: всё, что есть в базе. Обычному ученику RLS отдаст только
       его собственные строки, поэтому запрос безопасен сам по себе. */
    listAll: function () {
      return token().then(function (tk) {
        return Promise.all([
          req('/rest/v1/en_students?select=*&order=updated_at.desc', { token: tk }),
          req('/rest/v1/en_progress?select=*', { token: tk }),
          req('/rest/v1/en_admins?select=id', { token: tk })
        ]);
      }).then(function (r) {
        return { students: r[0] || [], progress: r[1] || [], isAdmin: (r[2] || []).length > 0 };
      });
    },

    /* Удалить себя целиком: строки и сам аккаунт. Делает функция в базе,
       потому что удаление пользователей из браузера закрыто. */
    deleteMe: function () {
      if (!DB.ready) return Promise.resolve(false);
      return token().then(function (tk) {
        return req('/rest/v1/rpc/en_delete_me', { method: 'POST', token: tk, body: {} });
      }).then(function () { keep(null); DB.ready = false; DB.userId = null; return true; });
    },

    normPhone: normPhone
  };

  global.DB = DB;
})(window);
