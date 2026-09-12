/*!
 * 1English · экраны платформы.
 *
 * Одно приложение на один файл: состояние, роутер, экраны. Экранов мало и
 * они простые, поэтому разносить их по модулям и тащить сборку не за что —
 * страница должна открываться по ссылке с телефона без установки.
 *
 * Состояние лежит в localStorage под ключом 1eng.v2. Когда включится
 * Supabase (backend/schema.sql уже написана), меняются только load и save:
 * экраны про хранилище ничего не знают.
 */
(function () {
'use strict';

/* ══════════════════════════════════════════════════════════════════════
   СОСТОЯНИЕ
   ══════════════════════════════════════════════════════════════════ */
var KEY = '1eng.v2';

function blank() {
  return {
    phone: '',
    level: null,          /* id уровня из COURSE */
    sound: true,
    lang: 'ru',           /* ru | kk */
    theme: 'system',      /* system | light | dark */
    name: '',
    gender: '',           /* m | f */
    consent: '',          /* дата согласия на обработку данных */
    p: {}                 /* lessonId: {read:true, task:{right,total}, words:true} */
  };
}

var S = (function () {
  try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch (e) { return blank(); }
})();

function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function prog(id) { return S.p[id] || (S.p[id] = {}); }



/* ══════════════════════════════════════════════════════════════════════
   СИНХРОНИЗАЦИЯ
   На экране всегда локальное состояние — оно рисуется мгновенно и живёт
   без сети. База — зеркало: при входе оттуда забираем всё, что уже есть,
   дальше отправляем копию каждого изменения.
   ══════════════════════════════════════════════════════════════════ */
function mergeServer(data) {
  if (!data) return;
  var p = data.profile;
  if (p) {
    ['name', 'gender', 'level', 'lang', 'theme'].forEach(function (k) {
      if (p[k]) S[k] = p[k];
    });
    applyTheme();
  }
  (data.progress || []).forEach(function (r) {
    var mine = prog(r.lesson);
    if (r.step === 'task') {
      /* результат не ухудшаем: на другом телефоне могло быть лучше */
      if (!mine.task || mine.task.right < r.right_count)
        mine.task = { right: r.right_count, total: r.total_count };
    } else mine[r.step] = true;
  });
  save();
}

function syncProfile() {
  if (!global_DB()) return;
  DB.saveProfile({
    phone: S.phone, name: S.name, gender: S.gender,
    level: S.level, lang: S.lang, theme: S.theme,
    consent_at: S.consent || null, consent_v: S.consent ? 'v1' : null
  });
}
function syncStep(lesson, step, right, total) {
  if (!global_DB()) return;
  DB.saveStep(lesson, step, right, total);
}
function global_DB() { return window.DB && DB.ready; }

/* ══════════════════════════════════════════════════════════════════════
   ЯЗЫК ИНТЕРФЕЙСА
   Русский — основной. Казахский заведён здесь же: переключатель меняет
   один словарь, экраны не трогаются. Содержание уроков (правила,
   переводы слов) пока только русское — это отдельная работа.
   ══════════════════════════════════════════════════════════════════ */
var LANG = {
  ru: {
    next:'Далее', enter:'Войти', phone:'Номер телефона',
    phoneNote:'Тот, на который вас записали на курс.',
    smsTitle:'Код доступа', smsTo:'Номер ', changePhone:'Изменить номер',
    smsHint:'Первый раз — придумайте код из шести цифр, он станет вашим паролем. Дальше входите с ним же.',
    wait:'Секунду…', offline:'Нет связи с базой. Прогресс сохранится на этом телефоне.',
    yourLevel:'Ваш уровень', levelNote:'Можно поменять в любой момент.',
    choose:'Выбрать', level:'Уровень',
    lessonsOf:function (a, b) { return a + ' из ' + b + ' уроков'; },
    soon:'Материалы скоро', videoLesson:'Видеоурок', ruleReview:'Разбор правила',
    lesson:'Урок', task:'Задание', dict:'Словарь',
    videoAndRule:'Видео и разбор', videoOnly:'Видео', noVideo:'Видео пока нет',
    noTasks:'Заданий пока нет', noWords:'Слов пока нет',
    nTasks:function (n) { return n + ' заданий'; },
    nWords:function (n) { return n + ' слов'; },
    resultOf:function (a, b) { return 'Результат ' + a + ' из ' + b; },
    got:'Понятно', check:'Проверить', more:'Дальше', total:'Итог',
    right:'Верно.', wrong:'Неверно.', correctIs:'Верно так: ',
    putAll:'Соберите всё предложение', noMistakes:'Без ошибок',
    canRetry:'Ошибки можно переиграть', toLessons:'К урокам', again:'Пройти заново',
    tapTranslate:'Нажмите, чтобы увидеть перевод', translation:'Перевод',
    know:'Знаю', oneMore:'Ещё раз', wordsDone:'слов пройдено',
    lessonsTab:'Уроки', gamesTab:'Игры', profileTab:'Профиль',
    gamesNote:'Слова берутся из вашего уровня.',
    gWordOrder:'Порядок слов', gWordOrderNote:'Собрать предложение из слов',
    gSort:'Сортировка', gSortNote:'Разложить слова по группам',
    gFlappyNote:'Лететь в тот проём, где верный перевод',
    profile:'Профиль', name:'Имя', notSetM:'Не указан',
    notSetN:'Не указано', gender:'Пол',
    male:'Мужской', female:'Женский',
    langLabel:'Язык интерфейса', langName:'Русский',
    theme:'Тема оформления', themeSystem:'Системная', themeLight:'Светлая', themeDark:'Тёмная',
    save:'Сохранить', logout:'Выйти',
    consentShort:'Согласен на обработку моих данных',
    consentLink:'Что это значит',
    consentTitle:'Обработка персональных данных',
    consentText:'1English хранит ваш номер телефона, имя, дату рождения, пол и то, какие уроки вы прошли. Это нужно, чтобы прогресс не терялся при смене телефона и чтобы преподаватель видел, кому нужна помощь.\n\nДанные лежат в базе Supabase и третьим лицам не передаются. Чтобы их удалили, напишите преподавателю с того же номера: аккаунт и всё, что с ним связано, стирается.',
    consentNeed:'Отметьте согласие, чтобы продолжить',
    tooMany:'Слишком много попыток. Подождите минуту.',
    notAllowed:'Этого номера нет в списке группы. Напишите преподавателю.',
    noAccess:'Неверный код, либо аккаунт ещё не заведён. Напишите преподавателю.',
    wipe:'Удалить мои данные', wipeCap:'Профиль, прогресс и сам аккаунт',
    wipeText:'Из базы пропадут: номер телефона, имя, дата рождения, пол и весь пройденный курс. Вернуть это будет нельзя — вход по этому номеру начнётся с чистого листа.',
    wipeGo:'Удалить', cancel:'Отмена', wiped:'Данные удалены'
  },
  kk: {
    next:'Әрі қарай', enter:'Кіру', phone:'Телефон нөмірі',
    phoneNote:'Курсқа тіркелген нөмір.',
    smsTitle:'Кіру коды', smsTo:'Нөмір ', changePhone:'Нөмірді өзгерту',
    smsHint:'Алғаш рет — алты саннан код ойлап табыңыз, ол сіздің құпиясөзіңіз болады. Әрі қарай сол кодпен кіресіз.',
    wait:'Бір секунд…', offline:'Базамен байланыс жоқ. Прогресс осы телефонда сақталады.',
    yourLevel:'Сіздің деңгейіңіз', levelNote:'Кез келген уақытта ауыстыруға болады.',
    choose:'Таңдау', level:'Деңгей',
    lessonsOf:function (a, b) { return a + ' / ' + b + ' сабақ'; },
    soon:'Материалдар жақында', videoLesson:'Бейнесабақ', ruleReview:'Ереже талдауы',
    lesson:'Сабақ', task:'Тапсырма', dict:'Сөздік',
    videoAndRule:'Бейне және талдау', videoOnly:'Бейне', noVideo:'Бейне әзірге жоқ',
    noTasks:'Тапсырма әзірге жоқ', noWords:'Сөздер әзірге жоқ',
    nTasks:function (n) { return n + ' тапсырма'; },
    nWords:function (n) { return n + ' сөз'; },
    resultOf:function (a, b) { return 'Нәтиже: ' + a + ' / ' + b; },
    got:'Түсінікті', check:'Тексеру', more:'Келесі', total:'Қорытынды',
    right:'Дұрыс.', wrong:'Қате.', correctIs:'Дұрысы: ',
    putAll:'Барлық сөзді қойыңыз', noMistakes:'Қатесіз',
    canRetry:'Қателерді қайта өтуге болады', toLessons:'Сабақтарға', again:'Қайта өту',
    tapTranslate:'Аударманы көру үшін басыңыз', translation:'Аудармасы',
    know:'Білемін', oneMore:'Тағы бір рет', wordsDone:'сөз өтілді',
    lessonsTab:'Сабақтар', gamesTab:'Ойындар', profileTab:'Профиль',
    gamesNote:'Сөздер деңгейіңізден алынады.',
    gWordOrder:'Сөз реті', gWordOrderNote:'Сөздерден сөйлем құрастыру',
    gSort:'Сұрыптау', gSortNote:'Сөздерді топтарға бөлу',
    gFlappyNote:'Дұрыс аудармасы бар саңылауға ұшу',
    profile:'Профиль', name:'Аты', notSetM:'Көрсетілмеген',
    notSetN:'Көрсетілмеген', gender:'Жынысы',
    male:'Ер', female:'Әйел',
    langLabel:'Интерфейс тілі', langName:'Қазақша',
    theme:'Безендіру тақырыбы', themeSystem:'Жүйелік', themeLight:'Ашық', themeDark:'Қараңғы',
    save:'Сақтау', logout:'Шығу',
    consentShort:'Деректерімді өңдеуге келісемін',
    consentLink:'Бұл нені білдіреді',
    consentTitle:'Дербес деректерді өңдеу',
    consentText:'1English сіздің телефон нөміріңізді, атыңызды, туған күніңізді, жынысыңызды және қандай сабақтарды өткеніңізді сақтайды. Бұл телефон ауысқанда прогресс жоғалмауы үшін және ұстаз кімге көмек керегін көруі үшін қажет.\n\nДеректер Supabase базасында жатыр, үшінші тұлғаларға берілмейді. Өшіру үшін ұстазға сол нөмірден жазыңыз: аккаунт және онымен байланысты бәрі жойылады.',
    consentNeed:'Жалғастыру үшін келісімді белгілеңіз',
    tooMany:'Тым көп әрекет. Бір минут күтіңіз.',
    notAllowed:'Бұл нөмір топ тізімінде жоқ. Ұстазға жазыңыз.',
    noAccess:'Код қате, немесе аккаунт әлі ашылмаған. Ұстазға жазыңыз.',
    wipe:'Деректерімді өшіру', wipeCap:'Профиль, прогресс және аккаунт',
    wipeText:'Базадан телефон нөмірі, аты, туған күні, жынысы және өтілген курс жойылады. Қайтару мүмкін болмайды — осы нөмірмен кіру таза беттен басталады.',
    wipeGo:'Өшіру', cancel:'Болдырмау', wiped:'Деректер өшірілді'
  }
};
function t(k) {
  var d = LANG[S.lang] || LANG.ru;
  return d[k] != null ? d[k] : (LANG.ru[k] != null ? LANG.ru[k] : k);
}

/* Тема живёт на <html>: system снимает атрибут и отдаёт выбор системе. */
function applyTheme() {
  var el = document.documentElement;
  if (S.theme === 'light' || S.theme === 'dark') el.setAttribute('data-theme', S.theme);
  else el.removeAttribute('data-theme');
}
applyTheme();

/* ══════════════════════════════════════════════════════════════════════
   КУРС: доступ к данным
   ══════════════════════════════════════════════════════════════════ */
function level(id) {
  return COURSE.levels.filter(function (l) { return l.id === (id || S.level); })[0] || COURSE.levels[0];
}
function lesson(id) {
  var out = null;
  COURSE.levels.forEach(function (l) {
    l.lessons.forEach(function (s) { if (s.id === id) out = s; });
  });
  return out;
}
function video(id) { return (window.VIDEOS || {})[id] || ''; }

/* Шага у урока три и других не будет: урок, задание, словарь. Но урок
   бывает пустым: ролик ещё не привязан, заданий пока нет. Шаг без
   материала не существует, а не «не пройден» — иначе прогресс врёт. */
function stepsOf(s) {
  var out = [];
  if (video(s.id) || s.rule) out.push('read');
  if (s.tasks.length)        out.push('task');
  if (s.words.length)        out.push('words');
  return out;
}
function stepsDone(s) {
  var p = S.p[s.id] || {};
  return stepsOf(s).filter(function (k) { return !!p[k]; }).length;
}
function levelStats(lv) {
  var done = 0, ready = 0, all = 0, mine = 0;
  lv.lessons.forEach(function (s) {
    var n = stepsOf(s).length;
    if (!n) return;                       /* пустой урок в счёт не идёт */
    ready++; all += n; mine += stepsDone(s);
    if (stepsDone(s) === n) done++;
  });
  return { done: done, total: ready, pct: all ? Math.round(mine / all * 100) : 0 };
}

/* ══════════════════════════════════════════════════════════════════════
   МЕЛОЧИ
   ══════════════════════════════════════════════════════════════════ */
var openId = null;   /* какой урок раскрыт в списке */
var view = document.getElementById('view');
var tabsEl = document.getElementById('tabs');

function h(html) { return html; }
function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); }
function $(sel, root) { return (root || view).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || view).querySelectorAll(sel)); }
function go(hash) { location.hash = hash; }

function toast(text) {
  var el = document.createElement('div');
  el.className = 'toast'; el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, 1700);
}

/* Озвучка встроенная в браузер: файлов нет, интернет не нужен.
   Голос английский; если система его не знает, кнопка просто молчит. */
function speak(text) {
  if (!S.sound) return;
  try {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.9;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) {}
}

function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

/* ── иконки: один набор, одна толщина линии, никаких эмодзи в интерфейсе ── */
var IC = {
  book:  '<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="3.4"/><path d="M8.6 3.6v16.8"/><path d="M12.4 8.8h4.6M12.4 12.4h4.6"/>',
  game:  '<rect x="2.2" y="6.4" width="19.6" height="11.2" rx="5.6"/><path d="M7.3 9.8v2.9M5.85 11.25h2.9"/><circle cx="15.9" cy="10.6" r="1.15"/><circle cx="18.3" cy="13.6" r="1.15"/>',
  gear:  '<path d="M3.5 7.5h17M3.5 16.5h17"/><circle cx="9" cy="7.5" r="2.3"/><circle cx="15.5" cy="16.5" r="2.3"/>',
  left:  '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  right: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
  task:  '<rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4"/><path d="M8.3 12.1l2.6 2.6 4.9-5.3"/>',
  cards: '<rect x="6.4" y="3.4" width="14" height="14" rx="3.4"/><path d="M16.4 20.6H7.2a3.8 3.8 0 0 1-3.8-3.8V7.6"/>',
  play:  '<path d="M8 5.6v12.8L19 12z"/>',
  sound: '<path d="M4 9.5h3.4L12 5.6v12.8L7.4 14.5H4z"/><path d="M15.6 9.4a3.6 3.6 0 0 1 0 5.2"/><path d="M18.1 6.9a7 7 0 0 1 0 10.2"/>',
  close:   '<path d="M6 6l12 12M18 6 6 18"/>',
  profile: '<circle cx="12" cy="8.2" r="3.9"/><path d="M4.6 20.2a7.4 7.4 0 0 1 14.8 0"/>',
  edit:    '<path d="M4.4 19.6h3.6l9.7-9.7-3.6-3.6-9.7 9.7z"/><path d="M14.1 6.3 16.6 3.8l3.6 3.6-2.5 2.5"/>',
  cam:     '<path d="M3.6 8.6h3.2l1.4-2.2h7.6l1.4 2.2h3.2v9.8H3.6z"/><circle cx="12" cy="13.3" r="3.1"/>',
  globe:   '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.3 2.4 3.4 5.3 3.4 8.6s-1.1 6.2-3.4 8.6c-2.3-2.4-3.4-5.3-3.4-8.6S9.7 5.8 12 3.4z"/>',
  moon:    '<circle cx="12" cy="12" r="8.6"/><path d="M12 3.4v17.2a8.6 8.6 0 0 0 0-17.2z" fill="currentColor" stroke="none"/>'
};
function icon(name, size) {
  return '<svg width="' + (size || 24) + '" height="' + (size || 24) + '" viewBox="0 0 24 24" fill="none" ' +
         'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>';
}

function head(title, back) {
  return '<div class="head">' +
    (back ? '<button class="iconbtn" data-back="' + back + '">' + icon('left', 22) + '</button>' : '') +
    '<h1>' + esc(title) + '</h1></div>';
}


/* Шторка снизу: выбор уровня, дата рождения, пол, язык, тема — всё
   спрашивается одинаково, поэтому обёртка одна. */
function openSheet(html, wire) {
  var veil = document.createElement('div');
  veil.className = 'veil';
  veil.innerHTML = '<div class="sheet"><div class="grip"></div>' + html + '</div>';
  document.body.appendChild(veil);
  veil.onclick = function (e) { if (e.target === veil) veil.remove(); };
  if (wire) wire(veil, function () { veil.remove(); });
  return veil;
}

/* Список с галочкой: тема, язык, пол устроены одинаково. */
function pickSheet(title, items, current, onPick) {
  openSheet(
    '<h2 style="margin-bottom:16px">' + esc(title) + '</h2>' +
    '<div class="pick">' +
      items.map(function (it) {
        return '<button data-v="' + it.v + '" class="' + (it.v === current ? 'on' : '') + '">' +
          '<span>' + esc(it.name) + '</span>' +
          (it.v === current ? '<span class="tick">' + icon('check', 20) + '</span>' : '') +
        '</button>';
      }).join('') +
    '</div>',
    function (veil, close) {
      Array.prototype.forEach.call(veil.querySelectorAll('[data-v]'), function (b) {
        b.onclick = function () { close(); onPick(b.getAttribute('data-v')); };
      });
    });
}


/* Подбор кода. Шесть цифр перебираются, поэтому после пяти промахов ввод
   замирает на минуту. Это защита от соседа с чужим телефоном, а не от
   скрипта: скрипт пойдёт мимо экрана, прямо в API. Настоящая защита —
   список разрешённых номеров на сервере, см. РАЗВЁРТЫВАНИЕ.md. */
var TRY_KEY = '1eng.tries';
function tries() { try { return JSON.parse(localStorage.getItem(TRY_KEY)) || {}; } catch (e) { return {}; } }
function lockLeft(phone) {
  var t = tries()[phone];
  return t && t.until > Date.now() ? Math.ceil((t.until - Date.now()) / 1000) : 0;
}
function addTry(phone) {
  var all = tries(), t = all[phone] || { n: 0, until: 0 };
  t.n++;
  if (t.n >= 5) { t.until = Date.now() + 60000; t.n = 0; }
  all[phone] = t;
  try { localStorage.setItem(TRY_KEY, JSON.stringify(all)); } catch (e) {}
}
function clearTries(phone) {
  var all = tries(); delete all[phone];
  try { localStorage.setItem(TRY_KEY, JSON.stringify(all)); } catch (e) {}
}

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН: ВХОД
   ══════════════════════════════════════════════════════════════════ */
function scrLogin() {
  var phone = '';

  function askPhone() {
    paint(
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 0 40px">' +
        '<img src="assets/logo.png" alt="1English" style="height:38px;width:auto;margin-bottom:28px">' +
        '<h1 style="margin-bottom:8px">' + t('phone') + '</h1>' +
        '<p class="sub" style="margin-bottom:22px">' + t('phoneNote') + '</p>' +
        '<input class="field" id="ph" type="tel" inputmode="numeric" value="+7">' +
        '<div class="gap-lg"></div>' +
        '<button class="btn" id="go" disabled>' + t('next') + '</button>' +
      '</div>', true);

    var ph = $('#ph');
    ph.oninput = function () {
      var d = ph.value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
      if (!d) d = '7';
      var out = '+' + d[0];
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ') ' + d.slice(4, 7);
      if (d.length >= 7) out += ' ' + d.slice(7, 9);
      if (d.length >= 9) out += ' ' + d.slice(9, 11);
      ph.value = out;
      $('#go').disabled = d.length < 11;
    };
    ph.oninput();
    $('#go').onclick = function () { phone = ph.value; askCode(); };
  }

  function askCode() {
    paint(
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 0 40px">' +
        '<h1 style="margin-bottom:8px">' + t('smsTitle') + '</h1>' +
        '<p class="sub" style="margin-bottom:22px">' + t('smsTo') + esc(phone) + '</p>' +
        '<input class="field" id="cd" type="tel" inputmode="numeric" maxlength="6" placeholder="000000">' +
        '<label class="agree"><input type="checkbox" id="ag">' +
          '<span>' + t('consentShort') + '. <b id="more">' + t('consentLink') + '</b></span></label>' +
        '<p class="note" id="err" style="color:var(--accent);min-height:20px;margin:2px 0 10px"></p>' +
        '<button class="btn" id="go" disabled>' + t('enter') + '</button>' +
        '<div class="gap-sm"></div>' +
        '<button class="btn ghost" id="bk">' + t('changePhone') + '</button>' +
        '<div class="gap-lg"></div>' +
        '<p class="note">' + t('smsHint') + '</p>' +
      '</div>', true);

    var cd = $('#cd'), ag = $('#ag');
    function ok() { $('#go').disabled = !(cd.value.length === 6 && ag.checked); }
    cd.oninput = function () { cd.value = cd.value.replace(/\D/g, ''); ok(); };
    ag.onchange = ok;

    $('#more').onclick = function (e) {
      e.preventDefault();
      openSheet('<h2 style="margin-bottom:14px">' + t('consentTitle') + '</h2>' +
        '<p class="sub" style="white-space:pre-line;margin-bottom:22px">' + esc(t('consentText')) + '</p>' +
        '<button class="btn" id="cl">' + t('got') + '</button>',
        function (veil, close) { veil.querySelector('#cl').onclick = close; });
    };

    $('#go').onclick = function () {
      var btn = $('#go'), err = $('#err');
      var left = lockLeft(phone);
      if (left) { err.textContent = t('tooMany'); return; }

      btn.disabled = true; btn.textContent = t('wait'); err.textContent = '';

      DB.enter(phone, cd.value).then(function () {
        /* Список допущенных пуст — пускают всех; появился первый номер —
           только своих. Проверяет база, браузер лишь показывает ответ. */
        return DB.amIAllowed().then(function (okay) {
          if (!okay) { DB.signOut(); throw new Error(t('notAllowed')); }
        });
      }).then(function () {
        clearTries(phone);
        S.phone = phone;
        if (!S.consent) S.consent = new Date().toISOString();
        save();
        syncProfile();
        return DB.pull().then(mergeServer);
      }).then(function () {
        go(S.level ? '#/lessons' : '#/level');
      }).catch(function (e) {
        addTry(phone);
        btn.disabled = false; btn.textContent = t('enter');
        err.textContent = e.noAccess ? t('noAccess') : e.message;
      });
    };
    $('#bk').onclick = askPhone;
    setTimeout(function () { cd.focus(); }, 250);
  }

  askPhone();
}

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН: ВЫБОР УРОВНЯ
   ══════════════════════════════════════════════════════════════════ */
function scrLevel() {
  var can = !!S.level;   /* уровень уже выбран — значит сюда пришли из настроек */

  paint(
    (can ? head(t('level'), '#/lessons') : '<div class="head"><h1>' + t('yourLevel') + '</h1></div>') +
    '<p class="sub" style="margin:-8px 0 20px">' + t('levelNote') + '</p>' +
    '<div class="rows">' +
      COURSE.levels.map(function (l) {
        return '<button class="row" data-lv="' + l.id + '">' +
          '<span class="mark' + (l.id === S.level ? ' on' : '') + '">' + l.code + '</span>' +
          '<span class="grow"><b>' + l.title + '</b><span class="cap">' + esc(l.tagline) + '</span></span>' +
          '<span class="chev">' + icon('right', 20) + '</span></button>';
      }).join('') +
    '</div>', true);

  $$('[data-lv]').forEach(function (b) {
    b.onclick = function () { sheet(b.getAttribute('data-lv')); };
  });

  function sheet(id) {
    var l = level(id);
    openSheet(
      '<span class="chip accent">' + l.code + '</span>' +
      '<h1 style="margin:14px 0 10px">' + l.title + '</h1>' +
      '<p class="sub" style="margin-bottom:22px">' + esc(l.about) + '</p>' +
      '<button class="btn" id="pick">' + t('choose') + '</button>',
      function (veil, close) {
        veil.querySelector('#pick').onclick = function () {
          S.level = id; save(); syncProfile(); close(); go('#/lessons');
        };
      });
  }
}

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН: УРОКИ (главная вкладка)
   ══════════════════════════════════════════════════════════════════ */
function scrLessons() {
  var lv = level(), st = levelStats(lv);

  paint(
    '<button class="cover" data-nav="#/level">' +
      '<img src="app/covers/' + lv.id + '.jpg" alt="" loading="lazy">' +
      '<img class="brand" src="assets/logo-white.png" alt="1English">' +
      '<span class="code">' + lv.code + '</span>' +
      /* длинное название уровня не должно наезжать на предмет справа */
      '<h2' + (lv.title.length > 12 ? ' style="font-size:clamp(20px,6.2vw,28px)"' : '') + '>' + lv.title + '</h2>' +
      '<p>' + esc(lv.tagline) + '</p>' +
      '<span class="swap">' + icon('right', 18) + '</span>' +
    '</button>' +

    '<div class="summary">' +
      '<div class="row2">' +
        '<span class="big num">' + st.pct + '%</span>' +
        '<span class="eyebrow num">' + (st.total ? t('lessonsOf')(st.done, st.total) : t('soon')) + '</span>' +
      '</div>' +
      '<div class="bar"><i style="width:' + st.pct + '%"></i></div>' +
    '</div>' +

    lv.lessons.map(function (s) {
      var av = stepsOf(s), n = stepsDone(s), full = av.length && n === av.length;
      var cap = s.subtitle || (av.length ? (video(s.id) ? t('videoLesson') : t('ruleReview')) : t('soon'));
      return '<div class="item' + (s.id === openId ? ' on' : '') + (av.length ? '' : ' empty') +
             '" data-item="' + s.id + '">' +
        '<button class="itop" data-open="' + s.id + '">' +
          '<span class="mark' + (full ? ' done' : '') + '">' +
            (full ? icon('check', 22) : s.n) + '</span>' +
          '<span class="grow"><b>' + esc(s.title || (t('lesson') + ' ' + s.n)) + '</b>' +
            '<span class="cap">' + esc(cap) + '</span>' +
            (av.length ? '<span class="steps">' + av.map(function (_, k) {
                return '<i class="' + (k < n ? 'on' : '') + '"></i>'; }).join('') + '</span>' : '') +
          '</span>' +
          '<span class="chev">' + icon('right', 20) + '</span>' +
        '</button>' +
        '<div class="panel"><div class="pin">' + steps(s) + '</div></div>' +
      '</div>';
    }).join(''));

  $$('[data-open]').forEach(function (b) {
    b.onclick = function () {
      var id = b.getAttribute('data-open');
      openId = (openId === id) ? null : id;      /* открыт всегда один урок */
      $$('.item').forEach(function (it) {
        it.classList.toggle('on', it.getAttribute('data-item') === openId);
      });
    };
  });
}

/* Три шага урока: единственное содержимое раскрытой карточки. */
var STEP_IC = { read: 'play', task: 'task', words: 'cards' };

function steps(s) {
  var p = S.p[s.id] || {}, av = stepsOf(s);
  function row(to, name, note, done) {
    var open = av.indexOf(to) >= 0;
    return '<button class="step' + (open ? '' : ' off') + '"' +
      (open ? ' data-nav="#/lesson/' + s.id + '/' + to + '"' : ' disabled') + '>' +
      '<span class="smark' + (done ? ' done' : '') + '">' + icon(done ? 'check' : STEP_IC[to], 20) + '</span>' +
      '<span class="grow"><b>' + name + '</b><span class="cap">' + note + '</span></span>' +
      (open ? '<span class="chev">' + icon('right', 18) + '</span>' : '') + '</button>';
  }
  return row('read', t('lesson'),
             video(s.id) ? (s.rule ? t('videoAndRule') : t('videoOnly')) : (s.rule ? t('ruleReview') : t('noVideo')), !!p.read) +
         row('task', t('task'),
             s.tasks.length ? (p.task ? t('resultOf')(p.task.right, p.task.total) : t('nTasks')(s.tasks.length)) : t('noTasks'), !!p.task) +
         row('words', t('dict'),
             s.words.length ? t('nWords')(s.words.length) : t('noWords'), !!p.words);
}

/* ── шаг 1: правило ─────────────────────────────────────────────────── */
function scrRead(id) {
  var s = lesson(id); if (!s) return go('#/lessons');
  var yt = video(id);

  paint(
    head(s.title || ('Урок ' + s.n), '#/lessons') +
    (yt
      ? '<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + yt +
        '?rel=0&modestbranding=1&playsinline=1" title="' + esc(s.title || (t('lesson') + ' ' + s.n)) + '" allowfullscreen ' +
        'allow="accelerometer; encrypted-media; picture-in-picture"></iframe></div>'
      : '') +
    (s.rule ? '<div class="rule">' + esc(s.rule) + '</div>' : '') +
    (s.examples.length
      ? '<div class="card" style="padding:4px 16px;margin-bottom:8px">' +
          s.examples.map(function (e, i) {
            return '<button class="ex" data-say="' + i + '">' +
              '<span class="grow"><b>' + esc(e.en) + '</b><span class="cap">' + esc(e.ru) + '</span></span>' +
              '<span class="snd">' + icon('sound', 20) + '</span></button>';
          }).join('') +
        '</div>'
      : '') +
    '<div class="dock"><button class="btn" id="ok">' + t('got') + '</button></div>', true);

  $$('[data-say]').forEach(function (b) {
    b.onclick = function () { speak(s.examples[+b.getAttribute('data-say')].en); };
  });
  $('#ok').onclick = function () {
    prog(id).read = true; save(); syncStep(id, 'read'); go('#/lessons');
  };
}

/* ── шаг 2: задание ─────────────────────────────────────────────────── */
function scrTask(id) {
  var s = lesson(id); if (!s) return go('#/lessons');
  var deck = s.tasks, i = 0, right = 0, answered = false;

  function bar() {
    return '<div class="steps" style="margin:0 0 18px">' +
      deck.map(function (_, k) { return '<i class="' + (k <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
  }

  function draw() {
    var q = deck[i];
    answered = false;
    if (q.t === 'choice') drawChoice(q); else drawOrder(q);
  }

  function drawChoice(q) {
    var text = esc(q.q).replace(/___/g, '<span class="gap">___</span>');
    paint(
      head(t('task'), '#/lessons') + bar() +
      '<div class="q">' + text + '</div>' +
      '<div class="rows" id="opts">' +
        q.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') +
      '</div>' +
      '<div class="gap-lg"></div><div id="fb"></div>' +
      '<div class="dock" id="dock"></div>', true);

    $$('#opts .opt').forEach(function (b) {
      b.onclick = function () {
        if (answered) return;
        answered = true;
        var k = +b.getAttribute('data-k'), good = k === q.a;
        if (good) right++;
        $$('#opts .opt').forEach(function (o, n) {
          if (n === q.a) o.className = 'opt ok';
          else if (n === k) o.className = 'opt no';
          else o.className = 'opt mute';
        });
        feedback(good, q.why);
      };
    });
  }

  function drawOrder(q) {
    var placed = [];
    paint(
      head(t('task'), '#/lessons') + bar() +
      '<div class="q" style="font-size:20px">' + esc(q.ru) + '</div>' +
      '<div class="line" id="line"></div>' +
      '<div class="bank" id="bank"></div>' +
      '<div class="gap-lg"></div><div id="fb"></div>' +
      '<div class="dock" id="dock"><button class="btn" id="check">' + t('check') + '</button></div>', true);

    var bank = $('#bank');
    shuffle(q.words).forEach(function (w) {
      var b = document.createElement('button');
      b.className = 'tok'; b.textContent = w;
      b.onclick = function () {
        if (answered) return;
        b.classList.add('used'); placed.push({ w: w, el: b }); line();
      };
      bank.appendChild(b);
    });

    function line() {
      var el = $('#line'); el.innerHTML = '';
      placed.forEach(function (p, k) {
        var b = document.createElement('button');
        b.className = 'tok inline'; b.textContent = p.w;
        b.onclick = function () {
          if (answered) return;
          p.el.classList.remove('used'); placed.splice(k, 1); line();
        };
        el.appendChild(b);
      });
    }

    $('#check').onclick = function () {
      if (answered) return;
      if (placed.length !== q.words.length) return toast(t('putAll'));
      var got = placed.map(function (p) { return p.w; }).join(' ');
      var good = got === q.a;
      answered = true;
      $('#line').className = 'line ' + (good ? 'ok' : 'no');
      /* банк отработал: пустая полоса из невидимых слов под ответом не нужна */
      $('#bank').style.display = 'none';
      if (good) right++;
      feedback(good, good ? q.a : t('correctIs') + q.a);
      speak(q.a);
    };
  }

  function feedback(good, why) {
    $('#fb').innerHTML = '<div class="why"><b>' + (good ? t('right') : t('wrong')) + '</b> ' + esc(why || '') + '</div>';
    $('#dock').innerHTML = '<button class="btn" id="next">' + (i === deck.length - 1 ? t('total') : t('more')) + '</button>';
    $('#next').onclick = function () {
      i++;
      if (i >= deck.length) return end();
      draw();
    };
  }

  function end() {
    var was = S.p[id] && S.p[id].task;
    /* Результат не ухудшаем: перепройти задание можно, но лучший счёт остаётся. */
    if (!was || was.right < right) prog(id).task = { right: right, total: deck.length };
    save(); syncStep(id, 'task', right, deck.length);
    paint(
      head(t('task'), '#/lessons') +
      '<div class="done">' +
        '<div class="score num">' + right + ' / ' + deck.length + '</div>' +
        '<div class="cap">' + (right === deck.length ? t('noMistakes') : t('canRetry')) + '</div>' +
      '</div>' +
      '<div class="dock">' +
        '<button class="btn" data-nav="#/lessons">' + t('toLessons') + '</button>' +
        '<div class="gap-sm"></div>' +
        '<button class="btn ghost" id="again">' + t('again') + '</button>' +
      '</div>', true);
    $('#again').onclick = function () { i = 0; right = 0; draw(); };
  }

  draw();
}

/* ── шаг 3: словарь ─────────────────────────────────────────────────── */
function scrWords(id) {
  var s = lesson(id); if (!s) return go('#/lessons');
  var queue = s.words.slice(), known = 0, open = false;

  function draw() {
    if (!queue.length) return end();
    var w = queue[0];
    paint(
      head(t('dict'), '#/lessons') +
      '<div class="steps" style="margin:0 0 18px">' +
        s.words.map(function (_, k) { return '<i class="' + (k < known ? 'on' : '') + '"></i>'; }).join('') +
      '</div>' +
      '<div class="wcard" id="card">' +
        '<div class="en">' + esc(w.en) + '</div>' +
        (open
          ? '<div class="ru">' + esc(w.ru) + '</div><div class="wex">' + esc(w.ex) + '</div>'
          : '<div class="hint">' + t('tapTranslate') + '</div>') +
      '</div>' +
      '<div class="dock">' +
        (open
          ? '<div class="pair"><button class="btn quiet" id="no">' + t('oneMore') + '</button>' +
            '<button class="btn" id="yes">' + t('know') + '</button></div>'
          : '<button class="btn" id="flip">' + t('translation') + '</button>') +
      '</div>', true);

    $('#card').onclick = function () {
      if (!open) { open = true; draw(); speak(w.en); }
      else speak(w.ex);
    };
    if ($('#flip')) $('#flip').onclick = function () { open = true; draw(); speak(w.en); };
    if ($('#yes')) $('#yes').onclick = function () { known++; queue.shift(); open = false; draw(); };
    if ($('#no')) $('#no').onclick = function () { queue.push(queue.shift()); open = false; draw(); };
  }

  function end() {
    prog(id).words = true; save(); syncStep(id, 'words');
    paint(
      head(t('dict'), '#/lessons') +
      '<div class="done">' +
        '<div class="score num">' + s.words.length + '</div>' +
        '<div class="cap">' + t('wordsDone') + '</div>' +
      '</div>' +
      '<div class="dock"><button class="btn" data-nav="#/lessons">' + t('toLessons') + '</button></div>', true);
  }

  draw();
}

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН: ИГРЫ
   ══════════════════════════════════════════════════════════════════ */
function games() {
  return [
    { file: 'flappy.html',  name: 'Flappy English', note: t('gFlappyNote') },
    { file: 'soilem.html',  name: t('gWordOrder'),  note: t('gWordOrderNote') },
    { file: 'surypta.html', name: t('gSort'),       note: t('gSortNote') }
  ];
}

function scrGames() {
  paint(
    '<div class="head"><h1>' + t('gamesTab') + '</h1></div>' +
    '<p class="sub" style="margin:-8px 0 20px">' + t('gamesNote') + '</p>' +
    '<div class="rows">' +
      games().map(function (g) {
        return '<a class="row" href="games/' + g.file + '?back=' + encodeURIComponent('../index.html#/games') + '">' +
          '<span class="mark">' + icon('game', 24) + '</span>' +
          '<span class="grow"><b>' + g.name + '</b><span class="cap">' + g.note + '</span></span>' +
          '<span class="chev">' + icon('right', 20) + '</span></a>';
      }).join('') +
    '</div>');
}


/* Аватар вместо фото. Фото никто не ставит, а пустой кружок с иконкой
   выглядит как недоделка, поэтому рисуем силуэт по полу. Волосы — цветом
   текста, лицо и плечи — тоном светлее (--skin), иначе на тёмной теме
   картинка сливается в пятно. */
function avatar(g, size) {
  var hair = '', front = '';
  if (g === 'm') {
    hair = '<ellipse cx="32" cy="25" rx="14.5" ry="14" fill="currentColor"/>';
  } else if (g === 'f') {
    hair  = '<ellipse cx="32" cy="28" rx="17.5" ry="18" fill="currentColor"/>';
    front = '<rect x="14.5" y="28" width="7" height="24" rx="3.5" fill="currentColor"/>' +
            '<rect x="42.5" y="28" width="7" height="24" rx="3.5" fill="currentColor"/>';
  }
  var cy = g === 'f' ? 31 : (g === 'm' ? 29 : 27);
  return '<svg viewBox="0 0 64 64" width="' + (size || 96) + '" height="' + (size || 96) + '" aria-hidden="true">' +
    hair +
    '<circle cx="32" cy="' + cy + '" r="12.5" fill="var(--skin)"/>' +
    '<path d="M10 60c0-11 10-17 22-17s22 6 22 17z" fill="var(--skin)"/>' +
    front +
  '</svg>';
}

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН: ПРОФИЛЬ
   Уровень отсюда убран: он меняется нажатием на обложку курса, там же,
   где ученик его и видит. Здесь только то, что относится к человеку и к
   виду приложения.
   ══════════════════════════════════════════════════════════════════ */
function scrProfile() {
  var THEMES = [
    { v:'system', name:t('themeSystem') },
    { v:'light',  name:t('themeLight') },
    { v:'dark',   name:t('themeDark') }
  ];
  var LANGS = [ { v:'ru', name:'Русский' }, { v:'kk', name:'Қазақша' } ];
  var GENDERS = [ { v:'m', name:t('male') }, { v:'f', name:t('female') } ];

  function nameOf(list, v, dflt) {
    var hit = list.filter(function (x) { return x.v === v; })[0];
    return hit ? hit.name : dflt;
  }
  function row(ic, label, value, id) {
    return '<button class="gr" id="' + id + '">' +
      '<span class="ic">' + icon(ic, 22) + '</span>' +
      '<span class="grow"><span class="lbl">' + esc(label) + '</span>' +
        '<span class="val">' + esc(value) + '</span></span>' +
      '<span class="chev">' + icon('right', 18) + '</span></button>';
  }

  paint(
    '<div class="head" style="justify-content:center"><h1 style="flex:0;font-size:22px">' + t('profile') + '</h1></div>' +

    '<div class="ava' + (S.gender ? ' set' : '') + '">' + avatar(S.gender, 96) + '</div>' +

    '<div class="who">' +
      '<h2 id="nm">' + esc(S.name || t('notSetN')) + '</h2>' +
      '<p>' + esc(S.phone) + '</p>' +
    '</div>' +

    '<div class="group">' +
      row('edit', t('name'), S.name || t('notSetN'), 'rName') +
      row('profile', t('gender'), nameOf(GENDERS, S.gender, t('notSetM')), 'rGender') +
    '</div>' +

    '<div class="group">' + row('globe', t('langLabel'), nameOf(LANGS, S.lang, 'Русский'), 'rLang') + '</div>' +
    '<div class="group">' + row('moon', t('theme'), nameOf(THEMES, S.theme, t('themeSystem')), 'rTheme') + '</div>' +

    '<div class="group">' +
      '<button class="gr" id="rWipe">' +
        '<span class="ic" style="color:var(--accent)">' + icon('close', 22) + '</span>' +
        '<span class="grow"><span class="lbl">' + t('wipeCap') + '</span>' +
          '<span class="val" style="color:var(--accent)">' + t('wipe') + '</span></span>' +
      '</button>' +
    '</div>' +

    '<div class="gap-sm"></div>' +
    '<button class="btn danger" id="out">' + t('logout') + '</button>');

  $('#rWipe').onclick = function () {
    openSheet(
      '<h2 style="margin-bottom:12px">' + t('wipe') + '</h2>' +
      '<p class="sub" style="margin-bottom:22px">' + esc(t('wipeText')) + '</p>' +
      '<button class="btn danger" id="yes">' + t('wipeGo') + '</button>' +
      '<div class="gap-sm"></div>' +
      '<button class="btn quiet" id="no">' + t('cancel') + '</button>',
      function (veil, close) {
        veil.querySelector('#no').onclick = close;
        veil.querySelector('#yes').onclick = function () {
          var b = this; b.disabled = true; b.textContent = t('wait');
          DB.deleteMe().then(function () {
            close(); S = blank(); save(); applyTheme(); toast(t('wiped')); go('#/login');
          }).catch(function (e) {
            b.disabled = false; b.textContent = t('wipeGo'); toast(e.message);
          });
        };
      });
  };

  $('#rName').onclick = function () {
    openSheet(
      '<h2 style="margin-bottom:16px">' + t('name') + '</h2>' +
      '<input class="field" id="v" type="text" value="' + esc(S.name) + '" placeholder="' + esc(t('notSetN')) + '">' +
      '<div class="gap-lg"></div><button class="btn" id="ok">' + t('save') + '</button>',
      function (veil, close) {
        var inp = veil.querySelector('#v');
        setTimeout(function () { inp.focus(); }, 250);
        veil.querySelector('#ok').onclick = function () {
          S.name = inp.value.trim().slice(0, 40); save(); syncProfile(); close(); route();
        };
      });
  };

  $('#rGender').onclick = function () {
    pickSheet(t('gender'), GENDERS, S.gender, function (v) { S.gender = v; save(); syncProfile(); route(); });
  };
  $('#rLang').onclick = function () {
    pickSheet(t('langLabel'), LANGS, S.lang, function (v) { S.lang = v; save(); syncProfile(); route(); });
  };
  $('#rTheme').onclick = function () {
    pickSheet(t('theme'), THEMES, S.theme, function (v) {
      S.theme = v; save(); applyTheme(); syncProfile(); route();
    });
  };

  $('#out').onclick = function () { DB.signOut(); S = blank(); save(); applyTheme(); go('#/login'); };
}

/* ══════════════════════════════════════════════════════════════════════
   РОУТЕР
   ══════════════════════════════════════════════════════════════════ */
function tabs() {
  return [
    { to: '#/lessons',  ic: 'book',    name: t('lessonsTab') },
    { to: '#/games',    ic: 'game',    name: t('gamesTab') },
    { to: '#/settings', ic: 'profile', name: t('profileTab') }
  ];
}

function paint(html, plain) {
  view.className = 'view enter' + (plain ? ' plain' : '');
  view.innerHTML = html;
  view.scrollTop = 0;
  window.scrollTo(0, 0);
  $$('[data-nav]').forEach(function (b) {
    b.onclick = function () { go(b.getAttribute('data-nav')); };
  });
  $$('[data-back]').forEach(function (b) {
    b.onclick = function () { go(b.getAttribute('data-back')); };
  });
}

function drawTabs(active) {
  tabsEl.className = 'tabs' + (active ? '' : ' off');
  if (!active) return;
  tabsEl.innerHTML = tabs().map(function (x) {
    return '<button class="tab' + (x.to === active ? ' on' : '') + '" data-to="' + x.to + '">' +
      icon(x.ic, 23) + '<span>' + x.name + '</span></button>';
  }).join('');
  Array.prototype.forEach.call(tabsEl.children, function (b) {
    b.onclick = function () { go(b.getAttribute('data-to')); };
  });
}

function route() {
  var parts = (location.hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  var r = parts[0] || '';

  /* Два входных условия, и оба обязательные: сначала номер, потом уровень. */
  if (!S.phone) { if (r !== 'login') return go('#/login'); }
  else if (!S.level && r !== 'level') return go('#/level');

  if (r === 'login')  { drawTabs(null); return scrLogin(); }
  if (r === 'level')  { drawTabs(null); return scrLevel(); }
  if (r === 'games')  { drawTabs('#/games'); return scrGames(); }
  if (r === 'settings') { drawTabs('#/settings'); return scrProfile(); }

  if (r === 'lesson' && parts[1]) {
    var id = parts[1], step = parts[2];
    openId = id;
    if (step === 'read')  { drawTabs(null); return scrRead(id); }
    if (step === 'task')  { drawTabs(null); return scrTask(id); }
    if (step === 'words') { drawTabs(null); return scrWords(id); }
    return go('#/lessons');   /* отдельного экрана урока нет: шаги живут в списке */
  }

  drawTabs('#/lessons');
  return scrLessons();
}

/* Падение у ученика иначе никто не увидит: он просто закроет вкладку. */
window.addEventListener('error', function (e) {
  if (window.DB && DB.ready) DB.logError(e.message, (e.filename || '') + ':' + (e.lineno || 0));
});
window.addEventListener('unhandledrejection', function (e) {
  var r = e.reason;
  if (window.DB && DB.ready) DB.logError((r && r.message) || String(r), 'promise');
});

window.addEventListener('hashchange', route);

/* Сессия могла остаться с прошлого раза: поднимаем её до первой отрисовки,
   а свежие данные подтягиваем следом и перерисовываем экран. */
if (window.DB && DB.init() && S.phone) {
  DB.pull().then(function (d) { if (d) { mergeServer(d); route(); } });
}
route();

/* автопроверка экрана: открыть index.html?test=1 и посмотреть консоль.
   Данные курса проверяет node app/check.mjs — здесь только вёрстка. */
if (location.search.indexOf('test=1') >= 0) {
  console.assert(document.body.scrollWidth <= window.innerWidth + 1, 'экран едет вбок');
  console.assert($$('.item').length > 0 || location.hash.indexOf('lessons') < 0, 'список уроков пуст');
  console.log('OK: ' + COURSE.levels.reduce(function (n, l) { return n + l.lessons.length; }, 0) +
              ' уроков, экран ' + window.innerWidth + 'px');
}

})();
