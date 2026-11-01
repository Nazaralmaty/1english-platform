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
/* index.html?demo=1 — вся платформа на выдуманных данных: вход не нужен,
   в базу не уходит ни одна строка, состояние лежит под своим ключом и не
   трогает прогресс настоящего ученика на этом же телефоне. */
var DEMO = /[?&]demo=1/.test(location.search);
var KEY = DEMO ? '1eng.demo' : '1eng.v2';

/* Черновик 01.11.2026: «Подарок семье» на главной и вкладка «Вакансии /
   Гранты». Живые ученики их не видят, пока не включено: ?beta=1 включает на
   этом телефоне, ?beta=0 выключает. Включить всем — BETA = true. */
var BETA = (function () {
  var m = /[?&]beta=([01])/.exec(location.search);
  try { if (m) localStorage.setItem('1eng.beta', m[1]); return DEMO || localStorage.getItem('1eng.beta') === '1'; }
  catch (e) { return DEMO; }
})();

function blank() {
  return {
    phone: '',
    level: null,          /* id уровня из COURSE */
    sound: true,
    lang: 'kk',           /* kk | ru — по умолчанию казахский: группа казахоязычная */
    theme: 'system',      /* system | light | dark */
    name: '',
    gender: '',           /* m | f */
    consent: '',          /* дата согласия на обработку данных */
    p: {},                /* lessonId: {read:true, prac:true, text:true, task:{right,total}, words:true} */
    g: {}                 /* game: {plays,best,right,wrong,last} — пишет games/bridge.js */
  };
}

var S = (function () {
  try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch (e) { return blank(); }
})();

/* Номер хранится и уезжает в базу только цифрами — 77011234567. Красивый
   вид с плюсом и скобками собирается при показе. Раньше при входе в базу
   ложились цифры, а при первой же правке профиля — строка из поля ввода
   «+7 (701) 123 45 67», и один и тот же человек лежал в en_students в двух
   видах: сверять с en_allowed и с выгрузками по такому полю нельзя. */
function phoneDigits(raw) {
  var d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11 && d.charAt(0) === '8') d = '7' + d.slice(1);
  if (d.length === 10) d = '7' + d;
  return (d.length === 11 && d.charAt(0) === '7') ? d : '';
}
function phoneShow(raw) {
  var d = phoneDigits(raw);
  if (!d) return String(raw || '');
  return '+' + d[0] + ' (' + d.slice(1, 4) + ') ' + d.slice(4, 7) + ' ' + d.slice(7, 9) + ' ' + d.slice(9);
}
/* состояние с прошлой версии могло сохранить номер строкой с разделителями */
if (S.phone) S.phone = phoneDigits(S.phone) || S.phone;

function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function prog(id) { return S.p[id] || (S.p[id] = {}); }

if (DEMO) demoMode();

/* Демо: DB подменяется заглушкой с тем же набором методов. Ближайший
   урок ученика — через сутки с небольшим, чтобы плашка «скоро урок» с
   отсчётом была видна сразу. */
function demoMode() {
  if (!S.phone) {
    S.phone = '77011234567'; S.name = 'Аяжан'; S.gender = 'f'; S.level = 'beginner';
    S.consent = new Date().toISOString(); save();
  }
  var at = new Date(Date.now() + (29 * 60 + 12) * 60000);
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ok(v) { return Promise.resolve(v); }
  window.DB = {
    ready: true, online: true, userId: 'demo', normPhone: phoneDigits,
    init: function () { return true; },
    enter: function () { return ok({ created: false }); },
    signOut: function () {},
    saveProfile: function () { return ok(null); },
    saveStep: function () { return ok(true); },
    saveGame: function () { return ok(true); },
    logError: function () { return ok(true); },
    amIAllowed: function () { return ok(true); },
    deleteMe: function () { return ok(true); },
    pull: function () { return ok({ profile: null, progress: [] }); },
    rpc: function (name) {
      if (name === 'en_my_schedule') {
        var key = ['sun','mon','tue','wed','thu','fri','sat'][at.getDay()];
        return ok([{ format: 'individual', days: key,
                     time: pad(at.getHours()) + ':' + pad(at.getMinutes()), planned: [] }]);
      }
      return ok(null);
    }
  };
  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('afterbegin',
      '<div class="demo-strip">Демо: данные выдуманные, в базу ничего не уходит</div>');
  });
}



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
    /* номер мог смениться в дашборде — берём серверный */
    if (p.phone) S.phone = p.phone;
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

/* Номер уходит, потому что без него строку не создать (phone not null),
   но в базе его всё равно перепишет триггер: номер там всегда тот, каким
   ученик входит. Поэтому устаревшая локальная копия ничего не портит. */
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
   Казахский — основной: группа казахоязычная, ролики сняты на казахском.
   Русский переключается в профиле и с главного экрана. Переключатель
   меняет один словарь, экраны не трогаются.

   Содержание урока (правило, примеры, слова, объяснения к заданиям)
   двуязычное тоже: рядом с русским полем лежит поле с хвостом Kk, а
   перевод слова и примера — пара {ru, kk}. Нет казахского — покажется
   русский, урок из-за этого не ломается.
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
    homeTab:'Главная', myCourse:'Мой курс', otherCourses:'Другие курсы',
    allCourses:'Курсы', pickCourse:'Выберите курс — с него начнётся обучение.',
    brandLine1:'Видеоуроки, задания и словарь.',
    brandLine2:'4 уровня · 56 уроков',
    nLessons:function (n) { return n + ' уроков'; },
    lessonsOf:function (a, b) { return a + ' из ' + b + ' уроков'; },
    soon:'Материалы скоро', videoLesson:'Видеоурок', ruleReview:'Разбор правила',
    lesson:'Урок', task:'Задание', dict:'Словарь',
    videoAndRule:'Видео и разбор', videoOnly:'Видео', noVideo:'Видео пока нет',
    cartoon:'Мультик', videoAndCartoon:'Мультик и видео',
    theory:'Теория', practice:'Практика',
    reading:'Чтение', noText:'Текста пока нет', tapWord:'Нажмите на выделенное слово',
    readCap:function (n) { return 'Текст, ' + n + ' слов урока'; },
    wordsOpen:function (a, b) { return a + ' из ' + b + ' слов'; },
    inText:'в тексте: ', flipHint:'Нажмите, чтобы перевернуть', readDone:'Прочитал',
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
    gPlays:function (n) { return 'Сыграно ' + n; },
    gBest:function (n) { return 'лучший счёт ' + n; },
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
    consentText:'1English хранит ваш номер телефона, имя, пол и то, какие уроки вы прошли. Это нужно, чтобы прогресс не терялся при смене телефона и чтобы преподаватель видел, кому нужна помощь.\n\nДанные лежат в базе Supabase и третьим лицам не передаются. Чтобы их удалили, напишите преподавателю с того же номера: аккаунт и всё, что с ним связано, стирается.',
    consentNeed:'Отметьте согласие, чтобы продолжить',
    tooMany:'Слишком много попыток. Подождите минуту.',
    notAllowed:'Этого номера нет в списке группы. Напишите преподавателю.',
    noAccess:'Неверный код, либо аккаунт ещё не заведён. Напишите преподавателю.',
    wipe:'Удалить мои данные', wipeCap:'Профиль, прогресс и сам аккаунт',
    wipeText:'Из базы пропадут: номер телефона, имя, пол и весь пройденный курс. Вернуть это будет нельзя — вход по этому номеру начнётся с чистого листа.',
    wipeGo:'Удалить', cancel:'Отмена', wiped:'Данные удалены',
    lessonAt:function (when, time) { return 'Скоро урок: ' + when + ', ' + time; },
    leftTime:function (x) { return 'Осталось ' + x; },
    lessonNow:'Урок идёт сейчас', startedAt:function (x) { return 'Начался в ' + x; },
    today:'сегодня', tomorrow:'завтра',
    weekday:['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
    uDay:'дн', uHour:'ч', uMin:'мин',
    famTitle:'Подарок семье', famSub:'К вашему курсу — два приглашения. Близкие учатся бесплатно, каждый в своём кабинете.',
    famKid:'Ребёнку: английский по мультикам', famElder:'Старшим: английский для жизни',
    famNotSent:'Ещё не открыли', famOpened:function (n) { return (n || 'Приглашённый') + ' открыл(а) подарок'; },
    famProgKid:function (n) { return n + ' мульт. посмотрено'; }, famProgElder:function (n) { return n + ' тем пройдено'; },
    famKidAbout:'Детский кабинет: 14 мультиков Forest English, слова с озвучкой и звёзды за каждый мультик. Ребёнку не нужен ни номер, ни код — ссылка открывает всё.',
    famElderAbout:'Кабинет для старших: фразы для поездки, врача, магазина, звонка детям. Крупный шрифт, чтение русскими буквами, медленная озвучка. Первая строка — «Скажите спасибо»: подарок от вас.',
    famWho:'Кому отправляем?', famRel:{ mama:'Маме', papa:'Папе', aje:'Бабушке', ata:'Дедушке', aga:'Брату', apke:'Сестре' },
    famSend:'Отправить в WhatsApp', famCopy:'Скопировать ссылку', famCopied:'Ссылка скопирована',
    famPreview:'Посмотреть, что увидят', famRenew:'Новая ссылка', famRenewCap:'Старая ссылка перестанет открываться',
    famOff:'Подарок заработает после обновления базы.',
    famCode:'Ваш промокод', famCodeCap:'Один на обе платформы. Ребёнок и старший входят с ним и своим именем; первый вход закрепляет платформу за этим человеком.',
    famNoteThanks:function (n) { return (n || 'Ваш близкий') + ' говорит спасибо за подарок'; },
    famNoteDone:function (n) { return (n || 'Ваш близкий') + ' прошёл(а) новую тему'; },
    famOk:'Хорошо', famRow:'Подарок семье', famRowCap:'Промокод и две платформы',
    famMsgKid:function (l, c) { return 'Тебе подарок: английский по мультикам в 1English. Открой ссылку: ' + l + ' Промокод: ' + c; },
    famMsgElder:function (l, c) { return 'Дарю вам английский: короткие фразы для жизни, по 5 минут в день. Откройте ссылку: ' + l + ' Промокод: ' + c; },
    futTab:function (w) { return w === 'school' ? 'Учёба' : 'Работа'; },
    segJobs:'Работа', segUnis:'Учёба',
    jobsTitle:'Работа с английским', jobsFoot:'Вакансии с hh.kz, где просят английский. Обновляем каждую неделю.',
    allProfs:'Все сферы', jobsEmpty:'Вакансий этой сферы сейчас нет',
    howTitle:'Как это работает', howCap:'Видео и 4 слайда',
    unisTitle:'Учёба за рубежом', allCountries:'Все страны', allFields:'Все направления',
    forYou:'Для тебя', forYouCap:'Бесплатная учёба, стипендия и сильные выпускники', forYouField:function (f) { return 'Направление: ' + f; },
    allUnis:'Все вузы', found:function (n) { return 'Нашли: ' + n; }, noUnis:'Таких вузов пока нет. Сними один из фильтров.',
    since:function (y) { return 'с ' + y + ' г.'; },
    unisFoot:function (d) { return 'Условия грантов сверены с официальными сайтами ' + d + '. Перед подачей проверь на сайте программы.'; },
    uniGrant:'по гранту', uniStudy:'язык учёбы', alumni:'Здесь учились', taught:'преподавал', city:'Город',
    uniGrantH:'Грант', goalIelts:function (b, me) { return 'Нужен IELTS ' + b + ', это примерно B2.' + (me ? ' У тебя сейчас ' + me + ': каждый урок приближает.' : ''); },
    uniCovers:'Что оплачивают', uniEnglish:'Язык', uniOther:'Требования', uniCost:'Без гранта',
    uniWhen:'Когда подавать', uniHow:'Как подать', uniSite:'Сайт программы', photo:'Фото', toLessons:'К урокам'
  },
  kk: {
    next:'Әрі қарай', enter:'Кіру', phone:'Телефон нөмірі',
    phoneNote:'Курсқа тіркелген нөмір.',
    smsTitle:'Кіру коды', smsTo:'Нөмір ', changePhone:'Нөмірді өзгерту',
    smsHint:'Алғаш рет — алты саннан код ойлап табыңыз, ол сіздің құпиясөзіңіз болады. Әрі қарай сол кодпен кіресіз.',
    wait:'Бір секунд…', offline:'Базамен байланыс жоқ. Прогресс осы телефонда сақталады.',
    yourLevel:'Сіздің деңгейіңіз', levelNote:'Кез келген уақытта ауыстыруға болады.',
    choose:'Таңдау', level:'Деңгей',
    homeTab:'Басты бет', myCourse:'Менің курсым', otherCourses:'Басқа курстар',
    allCourses:'Курстар', pickCourse:'Курс таңдаңыз — оқу содан басталады.',
    brandLine1:'Бейнесабақ, тапсырма және сөздік.',
    brandLine2:'4 деңгей · 56 сабақ',
    nLessons:function (n) { return n + ' сабақ'; },
    lessonsOf:function (a, b) { return a + ' / ' + b + ' сабақ'; },
    soon:'Материалдар жақында', videoLesson:'Бейнесабақ', ruleReview:'Ереже талдауы',
    lesson:'Сабақ', task:'Тапсырма', dict:'Сөздік',
    videoAndRule:'Бейне және талдау', videoOnly:'Бейне', noVideo:'Бейне әзірге жоқ',
    cartoon:'Мультфильм', videoAndCartoon:'Мультфильм және бейне',
    theory:'Теория', practice:'Жаттығу',
    reading:'Оқылым', noText:'Мәтін әзірге жоқ', tapWord:'Белгіленген сөзді басыңыз',
    readCap:function (n) { return 'Мәтін, сабақтың ' + n + ' сөзі'; },
    wordsOpen:function (a, b) { return a + ' / ' + b + ' сөз'; },
    inText:'мәтінде: ', flipHint:'Аудару үшін басыңыз', readDone:'Оқыдым',
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
    gPlays:function (n) { return n + ' ойын ойналды'; },
    gBest:function (n) { return 'үздік нәтиже ' + n; },
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
    consentText:'1English сіздің телефон нөміріңізді, атыңызды, жынысыңызды және қандай сабақтарды өткеніңізді сақтайды. Бұл телефон ауысқанда прогресс жоғалмауы үшін және ұстаз кімге көмек керегін көруі үшін қажет.\n\nДеректер Supabase базасында жатыр, үшінші тұлғаларға берілмейді. Өшіру үшін ұстазға сол нөмірден жазыңыз: аккаунт және онымен байланысты бәрі жойылады.',
    consentNeed:'Жалғастыру үшін келісімді белгілеңіз',
    tooMany:'Тым көп әрекет. Бір минут күтіңіз.',
    notAllowed:'Бұл нөмір топ тізімінде жоқ. Ұстазға жазыңыз.',
    noAccess:'Код қате, немесе аккаунт әлі ашылмаған. Ұстазға жазыңыз.',
    wipe:'Деректерімді өшіру', wipeCap:'Профиль, прогресс және аккаунт',
    wipeText:'Базадан телефон нөмірі, аты, жынысы және өтілген курс жойылады. Қайтару мүмкін болмайды — осы нөмірмен кіру таза беттен басталады.',
    wipeGo:'Өшіру', cancel:'Болдырмау', wiped:'Деректер өшірілді',
    lessonAt:function (when, time) { return 'Жақында сабақ: ' + when + ', сағат ' + time; },
    leftTime:function (x) { return x + ' қалды'; },
    lessonNow:'Сабақ қазір жүріп жатыр', startedAt:function (x) { return 'Басталды: ' + x; },
    today:'бүгін', tomorrow:'ертең',
    weekday:['жексенбі','дүйсенбі','сейсенбі','сәрсенбі','бейсенбі','жұма','сенбі'],
    uDay:'күн', uHour:'сағ', uMin:'мин',
    famTitle:'Отбасыңызға сыйлық', famSub:'Курсыңызға екі шақыру қосылды. Жақындарыңыз тегін оқиды, әрқайсысы өз кабинетінде.',
    famKid:'Балаға: мультфильммен ағылшын', famElder:'Үлкендерге: өмірге керек ағылшын',
    famNotSent:'Әлі ашылмаған', famOpened:function (n) { return (n || 'Шақырылған адам') + ' сыйлықты ашты'; },
    famProgKid:function (n) { return n + ' мультфильм көрді'; }, famProgElder:function (n) { return n + ' тақырып өтті'; },
    famKidAbout:'Балалар кабинеті: Forest English-тің 14 мультфильмі, дыбысталатын сөздер және әр мультфильм үшін жұлдыз. Балаға нөмір де, код та керек емес — бәрін сілтеме ашады.',
    famElderAbout:'Үлкендерге арналған кабинет: сапарға, дәрігерге, дүкенге, балаларға қоңырау шалуға керек фразалар. Ірі әріп, қазақ әрпімен оқылуы, баяу дыбыс. Алғашқы жолы — «Рахмет айтыңыз»: сыйлық сізден.',
    famWho:'Кімге жібересіз?', famRel:{ mama:'Анама', papa:'Әкеме', aje:'Әжеме', ata:'Атама', aga:'Ағама', apke:'Әпкеме' },
    famSend:'WhatsApp-қа жіберу', famCopy:'Сілтемені көшіру', famCopied:'Сілтеме көшірілді',
    famPreview:'Олар не көреді', famRenew:'Жаңа сілтеме', famRenewCap:'Ескі сілтеме ашылмай қалады',
    famOff:'Сыйлық база жаңартылғаннан кейін іске қосылады.',
    famCode:'Сіздің промокодыңыз', famCodeCap:'Екі платформаға бір промокод. Бала мен үлкен адам оны өз атымен енгізеді; алғашқы кіру платформаны сол адамға бекітеді.',
    famNoteThanks:function (n) { return (n || 'Жақыныңыз') + ' сыйлық үшін рахмет айтады'; },
    famNoteDone:function (n) { return (n || 'Жақыныңыз') + ' жаңа тақырып өтті'; },
    famOk:'Жақсы', famRow:'Отбасыға сыйлық', famRowCap:'Промокод және екі платформа',
    famMsgKid:function (l, c) { return 'Саған сыйлық: 1English-те мультфильммен ағылшын тілі. Сілтемені аш: ' + l + ' Промокод: ' + c; },
    famMsgElder:function (l, c) { return 'Сізге ағылшын тілін сыйлаймын: өмірге керек қысқа фразалар, күніне 5 минут. Сілтемені ашыңыз: ' + l + ' Промокод: ' + c; },
    futTab:function (w) { return w === 'school' ? 'Оқу' : 'Жұмыс'; },
    segJobs:'Жұмыс', segUnis:'Оқу',
    jobsTitle:'Ағылшынмен жұмыс', jobsFoot:'hh.kz-тегі ағылшын тілі сұралатын вакансиялар. Әр апта жаңарады.',
    allProfs:'Барлық салалар', jobsEmpty:'Бұл сала бойынша қазір вакансия жоқ',
    howTitle:'Бұл қалай жұмыс істейді', howCap:'Видео және 4 слайд',
    unisTitle:'Шетелде оқу', allCountries:'Барлық елдер', allFields:'Барлық бағыттар',
    forYou:'Саған', forYouCap:'Тегін оқу, шәкіртақы және мықты түлектер', forYouField:function (f) { return 'Бағыт: ' + f; },
    allUnis:'Барлық ЖОО', found:function (n) { return 'Табылды: ' + n; }, noUnis:'Мұндай ЖОО әзірге жоқ. Бір сүзгіні алып таста.',
    since:function (y) { return y + ' жылдан'; },
    unisFoot:function (d) { return 'Грант шарттары ресми сайттармен ' + d + ' салыстырылды. Тапсырар алдында бағдарлама сайтынан тексер.'; },
    uniGrant:'грант бойынша', uniStudy:'оқу тілі', alumni:'Мұнда оқығандар', taught:'сабақ берген', city:'Қала',
    uniGrantH:'Грант', goalIelts:function (b, me) { return 'IELTS ' + b + ' керек, бұл шамамен B2.' + (me ? ' Сенде қазір ' + me + ': әр сабақ жақындатады.' : ''); },
    uniCovers:'Не төленеді', uniEnglish:'Тіл', uniOther:'Талаптар', uniCost:'Грантсыз',
    uniWhen:'Қашан тапсыру керек', uniHow:'Қалай тапсыру керек', uniSite:'Бағдарлама сайты', photo:'Фото', toLessons:'Сабақтарға'
  }
};
function t(k) {
  var d = LANG[S.lang] || LANG.ru;
  return d[k] != null ? d[k] : (LANG.ru[k] != null ? LANG.ru[k] : k);
}

/* Пара переводов рядом: {ru:'…', kk:'…'} — пример, слово, задание. */
function trn(o) {
  if (!o) return '';
  return (S.lang === 'kk' && o.kk) ? o.kk : (o.ru || o.kk || '');
}
/* Поле с казахским соседом: rule ↔ ruleKk, subtitle ↔ subtitleKk, why ↔ whyKk. */
function tx(o, key) {
  if (!o) return '';
  return (S.lang === 'kk' && o[key + 'Kk']) ? o[key + 'Kk'] : (o[key] || o[key + 'Kk'] || '');
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
/* Ролики урока: { theory, practice }. Пара и подмена русского ролика
   казахским живут в course.js — тем же правилом шаги считает дашборд. */
function videos(id) { return window.lessonVideos(id, S.lang); }
function video(id) { var v = videos(id); return v.theory || v.practice; }
function cartoonOf(id) { return (window.CARTOONS || {})[id]; }

/* Урок — две секции и пять шагов, других не будет. Теория: видеоурок
   с правилом. Практика: свой видеоурок, чтение, задание, словарь. Но урок
   бывает пустым: ролик ещё не привязан, заданий пока нет. Шаг без
   материала не существует, а не «не пройден» — иначе прогресс врёт. */
function stepsOf(s) {
  var v = videos(s.id), out = [];
  if (v.theory || s.rule) out.push('read');
  if (v.practice)         out.push('prac');
  if (s.text)             out.push('text');
  if (s.tasks.length)     out.push('task');
  if (s.words.length)     out.push('words');
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
/* Кавычки тоже: часть значений подставляется в атрибуты (value у поля
   имени, title у плеера), и имя с кавычкой иначе ломает разметку. */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}
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
  home:  '<path d="M3.6 10.4 12 3.6l8.4 6.8v9.2a1 1 0 0 1-1 1h-4.6v-6.2H9.2v6.2H4.6a1 1 0 0 1-1-1z"/>',
  left:  '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  right: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
  task:  '<rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4"/><path d="M8.3 12.1l2.6 2.6 4.9-5.3"/>',
  cards: '<rect x="6.4" y="3.4" width="14" height="14" rx="3.4"/><path d="M16.4 20.6H7.2a3.8 3.8 0 0 1-3.8-3.8V7.6"/>',
  play:  '<path d="M8 5.6v12.8L19 12z"/>',
  bell:  '<path d="M6.2 16.6V11a5.8 5.8 0 0 1 11.6 0v5.6l1.6 1.8H4.6z"/><path d="M10 20.6a2.2 2.2 0 0 0 4 0"/>',
  sound: '<path d="M4 9.5h3.4L12 5.6v12.8L7.4 14.5H4z"/><path d="M15.6 9.4a3.6 3.6 0 0 1 0 5.2"/><path d="M18.1 6.9a7 7 0 0 1 0 10.2"/>',
  close:   '<path d="M6 6l12 12M18 6 6 18"/>',
  profile: '<circle cx="12" cy="8.2" r="3.9"/><path d="M4.6 20.2a7.4 7.4 0 0 1 14.8 0"/>',
  edit:    '<path d="M4.4 19.6h3.6l9.7-9.7-3.6-3.6-9.7 9.7z"/><path d="M14.1 6.3 16.6 3.8l3.6 3.6-2.5 2.5"/>',
  cam:     '<path d="M3.6 8.6h3.2l1.4-2.2h7.6l1.4 2.2h3.2v9.8H3.6z"/><circle cx="12" cy="13.3" r="3.1"/>',
  globe:   '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.3 2.4 3.4 5.3 3.4 8.6s-1.1 6.2-3.4 8.6c-2.3-2.4-3.4-5.3-3.4-8.6S9.7 5.8 12 3.4z"/>',
  gift:    '<rect x="3.6" y="8.4" width="16.8" height="4.4" rx="1.2"/><path d="M5.2 12.8v7.6h13.6v-7.6M12 8.4v12"/><path d="M12 8.4c-1.6-3.6-6.2-3.8-5.6-1 .4 1.4 3.4 1 5.6 1zM12 8.4c1.6-3.6 6.2-3.8 5.6-1-.4 1.4-3.4 1-5.6 1z"/>',
  brief:   '<rect x="3.4" y="7.4" width="17.2" height="12.4" rx="2.6"/><path d="M8.8 7.4V5.6a1.6 1.6 0 0 1 1.6-1.6h3.2a1.6 1.6 0 0 1 1.6 1.6v1.8M3.4 12.6h17.2"/>',
  cap:     '<path d="M2.6 9.4 12 5l9.4 4.4L12 13.8z"/><path d="M6.6 11.4v4.4c3.2 2.6 7.6 2.6 10.8 0v-4.4M21.4 9.4v5"/>',
  kid:     '<circle cx="12" cy="9" r="5.2"/><path d="M9.8 9.6h.01M14.2 9.6h.01M10.2 11.6a2.6 2.6 0 0 0 3.6 0"/><path d="M6.4 20.4a5.6 5.6 0 0 1 11.2 0"/>',
  heart:   '<path d="M12 20s-7.6-4.6-7.6-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.6 2.4C19.6 15.4 12 20 12 20z"/>',
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


/* Шторка снизу: выбор уровня, имя, пол, язык, тема — всё спрашивается
   одинаково, поэтому обёртка одна. */
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
        '<p class="sub" style="margin-bottom:22px">' + t('smsTo') + esc(phoneShow(phone)) + '</p>' +
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
        S.phone = phoneDigits(phone) || phone;
        if (!S.consent) S.consent = new Date().toISOString();
        save();
        syncProfile();
        return DB.pull().then(mergeServer);
      }).then(function () {
        loadSchedule();
        go('#/home');
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
   ЭКРАН: ГЛАВНАЯ — школа и курсы
   Первое, что видит ученик после входа. Сверху школа: обложка, логотип,
   переключатель языка. Ниже «мой курс» с прогрессом и остальные курсы
   карточками — уровень выбирается и меняется здесь, отдельного экрана
   выбора уровня больше нет.
   ══════════════════════════════════════════════════════════════════ */
function courseCard(l, mine) {
  var st = levelStats(l);
  return '<button class="ccard' + (mine ? ' mine' : '') + '" data-lv="' + l.id + '">' +
    '<span class="pic">' +
      '<img src="app/covers/' + l.id + '.jpg" alt="" loading="lazy">' +
      '<span class="code">' + l.code + '</span>' +
      '<b' + (l.title.length > 12 ? ' class="long"' : '') + '>' + l.title + '</b>' +
      '<i>' + esc(tx(l, 'tagline')) + '</i>' +
    '</span>' +
    '<span class="foot">' +
      '<span class="grow"><b>' + l.title + '</b>' +
        '<span class="cap">' + (mine && st.total
            ? t('lessonsOf')(st.done, st.total)
            : t('nLessons')(l.lessons.length)) + '</span></span>' +
      (mine ? '<span class="pct num">' + st.pct + '%</span>'
            : '<span class="chev">' + icon('right', 20) + '</span>') +
    '</span>' +
    (mine ? '<span class="bar"><i style="width:' + st.pct + '%"></i></span>' : '') +
  '</button>';
}

function scrHome() {
  var mine = S.level ? level(S.level) : null;
  var rest = COURSE.levels.filter(function (l) { return !mine || l.id !== mine.id; });

  paint(
    '<div class="hero">' +
      /* обложка школы, а не курса: под ней сразу лежит карточка курса
         со своей картинкой, и две одинаковые читались бы как сбой */
      '<img src="app/covers/school.jpg" alt="">' +
      '<img class="brand" src="assets/logo-white.png" alt="1English">' +
      '<div class="lang">' +
        '<button data-l="kk"' + (S.lang === 'kk' ? ' class="on"' : '') + '>KZ</button>' +
        '<button data-l="ru"' + (S.lang === 'ru' ? ' class="on"' : '') + '>RU</button>' +
      '</div>' +
    '</div>' +

    '<div class="ava logo"><img src="assets/logo.png" alt=""></div>' +
    '<div class="who">' +
      '<h2>1English</h2>' +
      '<p>' + t('brandLine1') + '<br>' + t('brandLine2') + '</p>' +
    '</div>' +
    '<div id="bn"></div>' + famNotes() +

    (mine
      ? '<h2 class="sect">' + t('myCourse') + '</h2>' + courseCard(mine, true) + famBlock() +
        '<h2 class="sect">' + t('otherCourses') + '</h2>'
      : '<h2 class="sect">' + t('allCourses') + '</h2>' +
        '<p class="sub" style="margin:-6px 0 14px">' + t('pickCourse') + '</p>') +

    rest.map(function (l) { return courseCard(l, false); }).join(''));

  $$('[data-l]').forEach(function (b) {
    b.onclick = function () {
      var v = b.getAttribute('data-l');
      if (v === S.lang) return;
      S.lang = v; save(); syncProfile(); route();
    };
  });

  wireFam();

  $$('[data-lv]').forEach(function (b) {
    b.onclick = function () {
      var id = b.getAttribute('data-lv');
      if (id === S.level) return go('#/lessons');
      sheet(id);
    };
  });

  function sheet(id) {
    var l = level(id);
    openSheet(
      '<span class="chip accent">' + l.code + '</span>' +
      '<h1 style="margin:14px 0 10px">' + l.title + '</h1>' +
      '<p class="sub" style="margin-bottom:22px">' + esc(tx(l, 'about')) + '</p>' +
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
    '<div id="bn"></div>' +
    '<button class="cover" data-nav="#/home">' +
      '<img src="app/covers/' + lv.id + '.jpg" alt="" loading="lazy">' +
      '<img class="brand" src="assets/logo-white.png" alt="1English">' +
      '<span class="code">' + lv.code + '</span>' +
      /* длинное название уровня не должно наезжать на предмет справа */
      '<h2' + (lv.title.length > 12 ? ' style="font-size:clamp(20px,6.2vw,28px)"' : '') + '>' + lv.title + '</h2>' +
      '<p>' + esc(tx(lv, 'tagline')) + '</p>' +
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
      var cap = tx(s, 'subtitle') || (av.length ? (video(s.id) ? t('videoLesson') : t('ruleReview')) : t('soon'));
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

/* Раскрытая карточка урока: две секции, теория и практика. В теории —
   видеоурок с правилом. В практике — свой видеоурок, чтение, задание и
   словарь: правило отрабатывается там, где его применяют. */
var STEP_IC = { read: 'play', prac: 'play', text: 'book', task: 'task', words: 'cards' };

function steps(s) {
  var p = S.p[s.id] || {}, av = stepsOf(s), v = videos(s.id);
  function sect(name) { return '<div class="sgrp">' + name + '</div>'; }
  function row(to, name, note, done) {
    var open = av.indexOf(to) >= 0;
    return '<button class="step' + (open ? '' : ' off') + '"' +
      (open ? ' data-nav="#/lesson/' + s.id + '/' + to + '"' : ' disabled') + '>' +
      '<span class="smark' + (done ? ' done' : '') + '">' + icon(done ? 'check' : STEP_IC[to], 20) + '</span>' +
      '<span class="grow"><b>' + name + '</b><span class="cap">' + note + '</span></span>' +
      (open ? '<span class="chev">' + icon('right', 18) + '</span>' : '') + '</button>';
  }
  return sect(t('theory')) +
         row('read', t('videoLesson'),
             v.theory ? (s.rule ? t('videoAndRule') : t('videoOnly')) : (s.rule ? t('ruleReview') : t('noVideo')), !!p.read) +
         sect(t('practice')) +
         row('prac', t('videoLesson'), v.practice ? (cartoonOf(s.id) ? t('videoAndCartoon') : t('videoOnly')) : t('noVideo'), !!p.prac) +
         (s.text ? row('text', t('reading'), t('readCap')(s.words.length), !!p.text) : '') +
         row('task', t('task'),
             s.tasks.length ? (p.task ? t('resultOf')(p.task.right, p.task.total) : t('nTasks')(s.tasks.length)) : t('noTasks'), !!p.task) +
         row('words', t('dict'),
             s.words.length ? t('nWords')(s.words.length) : t('noWords'), !!p.words);
}

/* Плеер одного ролика. Подпись над ним говорит, какая это секция:
   заголовок экрана у теории и практики один — название урока. */
function player(s, yt, cap) {
  return '<div class="vcap">' + cap + '</div>' +
    (yt
      ? '<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + yt +
        '?rel=0&modestbranding=1&playsinline=1" title="' + esc((s.title || (t('lesson') + ' ' + s.n)) + ' · ' + cap) + '" allowfullscreen ' +
        'allow="accelerometer; encrypted-media; picture-in-picture"></iframe></div>'
      : '');
}

/* Мультик урока: свой файл, а не YouTube — ролик детский и короткий. */
function cartoonPlayer(c) {
  return c ? '<div class="vcap">' + t('cartoon') + '</div>' +
    '<div class="frame"><video src="' + c.src + '" poster="' + c.poster + '" controls playsinline preload="none"></video></div>' : '';
}

/* ── теория: видеоурок и правило ────────────────────────────────────── */
function scrRead(id) {
  var s = lesson(id); if (!s) return go('#/lessons');

  paint(
    head(s.title || (t('lesson') + ' ' + s.n), '#/lessons') +
    player(s, videos(id).theory, t('theory')) +
    (tx(s, 'rule') ? '<div class="rule">' + esc(tx(s, 'rule')) + '</div>' : '') +
    (s.examples.length
      ? '<div class="card" style="padding:4px 16px;margin-bottom:8px">' +
          s.examples.map(function (e, i) {
            return '<button class="ex" data-say="' + i + '">' +
              '<span class="grow"><b>' + esc(e.en) + '</b><span class="cap">' + esc(trn(e)) + '</span></span>' +
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

/* ── практика: видеоурок ────────────────────────────────────────────── */
function scrPrac(id) {
  var s = lesson(id); if (!s) return go('#/lessons');
  var yt = videos(id).practice;
  if (!yt) return go('#/lessons');

  paint(
    head(s.title || (t('lesson') + ' ' + s.n), '#/lessons') +
    cartoonPlayer(cartoonOf(id)) +
    player(s, yt, t('practice')) +
    '<div class="dock"><button class="btn" id="ok">' + t('got') + '</button></div>', true);

  $('#ok').onclick = function () {
    prog(id).prac = true; save(); syncStep(id, 'prac'); go('#/lessons');
  };
}

/* ── практика: чтение ───────────────────────────────────────────────
   Текст урока, в котором слова этого урока — кнопки. Нажал — флип-карта:
   лицо — слово (и форма, в которой оно стоит в тексте), оборот — перевод
   и пример из словаря урока. Новые слова учатся там, где их читают. */
function textWord(s, key) {
  return s.words.filter(function (w) { return w.en === key || w.en === key.toLowerCase(); })[0];
}
function scrText(id) {
  var s = lesson(id); if (!s || !s.text) return go('#/lessons');
  var seen = {};

  /* [слово] и [форма|слово] → кнопка. Остальной текст экранируется. */
  function markup() {
    return s.text.split('\n').map(function (para) {
      var out = '', last = 0, re = /\[([^\]|]+)(?:\|([^\]]+))?\]/g, m;
      while ((m = re.exec(para))) {
        out += esc(para.slice(last, m.index));
        var w = textWord(s, m[2] || m[1]);
        out += w ? '<button class="rw' + (seen[w.en] ? ' seen' : '') + '" data-w="' + esc(w.en) +
                   '" data-form="' + esc(m[1]) + '">' + esc(m[1]) + '</button>'
                 : esc(m[1]);
        last = re.lastIndex;
      }
      return '<p>' + out + esc(para.slice(last)) + '</p>';
    }).join('');
  }
  function count() {
    var n = s.words.filter(function (w) { return seen[w.en]; }).length;
    return '<div class="rcount"><span class="track"><i style="transform:scaleX(' +
      (s.words.length ? n / s.words.length : 0) + ')"></i></span><span class="num">' +
      t('wordsOpen')(n, s.words.length) + '</span></div>';
  }
  function draw() {
    var y = window.scrollY;
    paint(
      head(s.title || (t('lesson') + ' ' + s.n), '#/lessons') +
      '<div class="vcap">' + t('reading') + ' · ' + t('tapWord') + '</div>' +
      '<div class="rtext">' + markup() + count() + '</div>' +
      '<div class="dock"><button class="btn" id="ok">' + t('readDone') + '</button></div>', true);
    window.scrollTo(0, y);
    $$('[data-w]').forEach(function (b) {
      b.onclick = function () {
        var w = textWord(s, b.getAttribute('data-w'));
        flipCard(w, b.getAttribute('data-form'), function () {
          if (!seen[w.en]) { seen[w.en] = true; draw(); }
        });
      };
    });
    $('#ok').onclick = function () {
      prog(id).text = true; save(); syncStep(id, 'text'); go('#/lessons');
    };
  }
  draw();
}

/* Флип-карта поверх экрана. Первое нажатие переворачивает, второе
   закрывает; мимо карты — закрыть. onFlip — «слово открыто». */
function flipCard(w, form, onFlip) {
  var other = form && form.toLowerCase() !== w.en.toLowerCase();
  var say = '<button class="say" data-say="1" aria-label="Listen">' + icon('sound', 20) + '</button>';
  var veil = document.createElement('div');
  veil.className = 'veil fveil';
  veil.innerHTML = '<div class="flip" role="button" tabindex="0"><div class="flip-in">' +
      '<div class="face">' + say + '<div class="en">' + esc(w.en) + '</div>' +
        (other ? '<div class="form">' + t('inText') + esc(form) + '</div>' : '') +
        '<div class="hint">' + t('flipHint') + '</div></div>' +
      '<div class="face b">' + say + '<div class="tr">' + esc(trn(w)) + '</div>' +
        '<div class="en sm">' + esc(w.en) + '</div>' +
        (w.ex ? '<div class="wex">' + esc(w.ex) + '</div>' : '') + '</div>' +
    '</div></div>';
  document.body.appendChild(veil);
  var flip = veil.querySelector('.flip');
  speak(w.en);
  function close() { veil.remove(); document.removeEventListener('keydown', key); }
  function key(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', key);
  veil.onclick = function (e) {
    if (e.target === veil) return close();
    if (e.target.closest('[data-say]')) return speak(flip.classList.contains('back') && w.ex ? w.ex : w.en);
    if (flip.classList.contains('back')) return close();
    flip.classList.add('back');
    if (onFlip) onFlip();
  };
}

/* ── практика: задание ──────────────────────────────────────────────── */
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
        feedback(good, tx(q, 'why'));
      };
    });
  }

  function drawOrder(q) {
    var placed = [];
    paint(
      head(t('task'), '#/lessons') + bar() +
      '<div class="q" style="font-size:20px">' + esc(trn(q)) + '</div>' +
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
      '<div class="fin">' +
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

/* ── практика: словарь ──────────────────────────────────────────────── */
function scrWords(id) {
  var s = lesson(id); if (!s) return go('#/lessons');
  var queue = s.words.slice(), known = 0;

  /* Флип-карта, как в чтении: лицо — слово, оборот — перевод и пример.
     Переворот идёт классом на месте, без перерисовки экрана, иначе
     анимации не видно. */
  function draw() {
    if (!queue.length) return end();
    var w = queue[0], say = '<button class="say" data-say="1" aria-label="Listen">' + icon('sound', 20) + '</button>';
    paint(
      head(t('dict'), '#/lessons') +
      '<div class="steps" style="margin:0 0 18px">' +
        s.words.map(function (_, k) { return '<i class="' + (k < known ? 'on' : '') + '"></i>'; }).join('') +
      '</div>' +
      '<div class="flip wflip" id="card" role="button" tabindex="0"><div class="flip-in">' +
        '<div class="face">' + say + '<div class="en">' + esc(w.en) + '</div>' +
          '<div class="hint">' + t('tapTranslate') + '</div></div>' +
        '<div class="face b">' + say + '<div class="tr">' + esc(trn(w)) + '</div>' +
          '<div class="en sm">' + esc(w.en) + '</div>' +
          (w.ex ? '<div class="wex">' + esc(w.ex) + '</div>' : '') + '</div>' +
      '</div></div>' +
      '<div class="dock" id="dock"></div>', true);

    var card = $('#card');
    function isOpen() { return card.classList.contains('back'); }
    function dock() {
      $('#dock').innerHTML = isOpen()
        ? '<div class="pair"><button class="btn quiet" id="no">' + t('oneMore') + '</button>' +
          '<button class="btn" id="yes">' + t('know') + '</button></div>'
        : '<button class="btn" id="flip">' + t('translation') + '</button>';
      if ($('#flip')) $('#flip').onclick = turn;
      if ($('#yes')) $('#yes').onclick = function () { known++; queue.shift(); draw(); };
      if ($('#no')) $('#no').onclick = function () { queue.push(queue.shift()); draw(); };
    }
    function turn() { if (!isOpen()) { card.classList.add('back'); speak(w.en); dock(); } }
    card.onclick = function (e) {
      if (e.target.closest('[data-say]')) return speak(isOpen() && w.ex ? w.ex : w.en);
      if (isOpen()) return speak(w.ex || w.en);
      turn();
    };
    card.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turn(); } };
    dock();
  }

  function end() {
    prog(id).words = true; save(); syncStep(id, 'words');
    paint(
      head(t('dict'), '#/lessons') +
      '<div class="fin">' +
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
/* ══════════════════════════════════════════════════════════════════════
   ПОДАРОК СЕМЬЕ (черновик, BETA)
   Две ссылки ученика: ребёнку (kids/) и старшему (elders/). Строки
   приглашений заводит en_my_invites() при первом вызове — патч
   backend/patch_2026-11-01_family.sql. Нет патча — блок говорит, что
   приглашения заработают после обновления базы, остальное не трогается.
   ══════════════════════════════════════════════════════════════════ */
var INV = null;               /* null — ещё не спрашивали; 'off' — в базе нет функций; {code, kid, elder} */

function loadInvites() {
  if (!BETA) return;
  if (DEMO) {
    INV = { code: 'K7M4PX2Q',
            kid:   { guest_name: 'Айсұлу', progress: { seen: ['b1', 'b2', 'b3'] }, note: 'thanks', note_new: true },
            elder: { guest_name: '', progress: {} } };
    return;
  }
  if (!global_DB() || !DB.rpc) return;
  DB.rpc('en_my_invites', {}).then(function (r) {
    INV = r && r.code ? r : 'off';
    if (/^#\/?(home|settings)/.test(location.hash)) route();
  }).catch(function () { INV = 'off'; });
}

function inv(kind) { return INV && INV !== 'off' ? INV[kind] || {} : null; }

function famLink(kind, rel) {
  var base = location.href.split('#')[0].split('?')[0].replace(/[^\/]*$/, '');
  return base + (kind === 'kid' ? 'kids/' : 'elders/') + '?c=' + INV.code + (rel ? '&r=' + rel : '') +
    (DEMO ? '&demo=1' : ''); /* демо-код выдуман, живая база его не знает */
}
function codeShow(c) { return c ? c.slice(0, 4) + '-' + c.slice(4) : ''; }

function famState(kind) {
  var x = inv(kind);
  if (!x) return INV === 'off' ? t('famOff') : '';
  var pr = x.progress || {}, n = kind === 'kid' ? (pr.seen || []).length : (pr.done || []).length;
  if (!x.guest_name) return t('famNotSent');
  return t('famOpened')(x.guest_name) + (n ? ' · ' + t(kind === 'kid' ? 'famProgKid' : 'famProgElder')(n) : '');
}

/* «Аяулым рахмет айтады» — уведомление от гостя, висит, пока не нажали «Жақсы». */
function famNotes() {
  if (!BETA || !INV || INV === 'off') return '';
  return ['kid', 'elder'].map(function (k) {
    var x = INV[k];
    if (!x || !x.note_new) return '';
    var txt = /^done/.test(x.note || '') ? t('famNoteDone')(x.guest_name) : t('famNoteThanks')(x.guest_name);
    return '<div class="bn note">' + icon('heart', 22) + '<span><b>' + esc(txt) + '</b></span>' +
      '<button class="chip" data-seen>' + t('famOk') + '</button></div>';
  }).join('');
}

function famRows() {
  function row(kind, ic, name) {
    return '<button class="row" data-fam="' + kind + '"><span class="mark">' + icon(ic, 24) + '</span>' +
      '<span class="grow"><b>' + name + '</b><span class="cap">' + esc(famState(kind)) + '</span></span>' +
      '<span class="chev">' + icon('right', 20) + '</span></button>';
  }
  return (INV && INV !== 'off' ? '<div class="code-card"><span class="cap">' + t('famCode') + '</span><b class="num">' + codeShow(INV.code) +
      '</b><span class="cap">' + t('famCodeCap') + '</span></div>' : '') +
    '<div class="rows">' + row('kid', 'kid', t('famKid')) + row('elder', 'heart', t('famElder')) + '</div>';
}

function famBlock() {
  if (!BETA) return '';
  return '<div class="fam"><h2 class="sect">' + icon('gift', 22) + t('famTitle') + '</h2>' +
    '<p class="sub" style="margin:-6px 0 12px">' + t('famSub') + '</p>' + famRows() + '</div>';
}

function wireFam(root) {
  Array.prototype.forEach.call((root || view).querySelectorAll('[data-fam]'), function (b) {
    b.onclick = function () { famSheet(b.getAttribute('data-fam')); };
  });
  Array.prototype.forEach.call((root || view).querySelectorAll('[data-seen]'), function (b) {
    b.onclick = function () {
      ['kid', 'elder'].forEach(function (k) { if (INV[k]) INV[k].note_new = false; });
      b.parentNode.remove();
      if (!DEMO) DB.rpc('en_invite_seen', {}).catch(function () {});
    };
  });
}

function famSheet(kind) {
  var rel = kind === 'elder' ? 'mama' : '';
  var rels = t('famRel');
  function body() {
    var ok = INV && INV !== 'off';
    var link = ok ? famLink(kind, rel) : '';
    return '<h1 style="margin:0 0 10px">' + t(kind === 'kid' ? 'famKid' : 'famElder') + '</h1>' +
      '<p class="sub" style="margin-bottom:16px">' + t(kind === 'kid' ? 'famKidAbout' : 'famElderAbout') + '</p>' +
      (!ok ? '<p class="note" style="text-align:left">' + t('famOff') + '</p>' :
        '<p class="cap" style="margin:0 0 14px">' + esc(famState(kind)) + '</p>' +
        (kind === 'elder' ? '<b style="display:block;margin-bottom:8px">' + t('famWho') + '</b><div class="chips wrap">' +
          Object.keys(rels).map(function (k) {
            return '<button data-rel="' + k + '"' + (k === rel ? ' class="on"' : '') + '>' + rels[k] + '</button>';
          }).join('') + '</div>' : '') +
        '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=' +
          encodeURIComponent(t(kind === 'kid' ? 'famMsgKid' : 'famMsgElder')(link, codeShow(INV.code))) + '">' + t('famSend') + '</a>' +
        '<div class="gap-sm"></div><button class="btn ghost" id="fcopy">' + t('famCopy') + '</button>' +
        '<div class="gap-sm"></div><a class="btn quiet" target="_blank" rel="noopener" href="' +
          (kind === 'kid' ? 'kids/' : 'elders/') + '?demo=1' + (rel ? '&r=' + rel : '') + '">' + t('famPreview') + '</a>');
  }
  openSheet('<div id="fsheet">' + body() + '</div>', function (veil) {
    function wire() {
      Array.prototype.forEach.call(veil.querySelectorAll('[data-rel]'), function (b) {
        b.onclick = function () { rel = b.getAttribute('data-rel'); veil.querySelector('#fsheet').innerHTML = body(); wire(); };
      });
      var cp = veil.querySelector('#fcopy');
      if (cp) cp.onclick = function () {
        var l = famLink(kind, rel);
        (navigator.clipboard ? navigator.clipboard.writeText(l) : Promise.reject())
          .then(function () { toast(t('famCopied')); }, function () { window.prompt('', l); });
      };
    }
    wire();
  });
}

/* Профиль: тот же подарок — промокод и обе платформы в шторке. */
function famFromProfile() {
  var v = openSheet('<h1 style="margin:0 0 10px">' + t('famTitle') + '</h1><p class="sub" style="margin-bottom:14px">' + t('famSub') + '</p>' + famRows());
  Array.prototype.forEach.call(v.querySelectorAll('[data-fam]'), function (b) {
    b.onclick = function () { v.remove(); famSheet(b.getAttribute('data-fam')); };
  });
}

/* ══════════════════════════════════════════════════════════════════════
   ВКЛАДКА «ВАКАНСИИ / ГРАНТЫ» (BETA)
   Сверху сегмент «Работа | Учёба», под заголовком — сторис «Как это
   работает»: видео, потом слайды. Работа: сферы списком, внутри вакансии.
   Учёба: фильтр по стране и направлению, подборка «Для тебя», вузы с фото;
   вуз открывается во весь экран: кампус, кто учился, город, грант.
   Данные: app/jobs.js (backend/jobs.py раз в неделю), app/unis.js (гранты,
   проверены по сайтам), app/campus.js (вузы, фото, выпускники).
   ══════════════════════════════════════════════════════════════════ */
function needScript(src, done) {
  var id = 'js-' + src.replace(/\W/g, '');
  var el = document.getElementById(id);
  if (el) return el.dataset.ok ? done() : el.addEventListener('load', done);
  el = document.createElement('script');
  el.id = id; el.src = src; el.onerror = done;
  el.onload = function () { el.dataset.ok = '1'; done(); };
  document.head.appendChild(el);
}
function needScripts(list, done) {
  var n = list.length;
  list.forEach(function (s) { needScript(s, function () { if (--n === 0) done(); }); });
}

function seg() {
  return '<div class="seg2"><button data-who="adult"' + (S.who !== 'school' ? ' class="on"' : '') + '>' + t('segJobs') + '</button>' +
    '<button data-who="school"' + (S.who === 'school' ? ' class="on"' : '') + '>' + t('segUnis') + '</button></div>';
}
function futHead(title) {
  return seg() + '<h1 class="lt">' + esc(title) + '</h1>' +
    '<button class="spill' + (S.storySeen ? ' seen' : '') + '" data-story><span class="ring"><img src="assets/stories/poster.jpg" alt=""></span>' +
    '<span class="grow"><b>' + t('howTitle') + '</b><span class="cap">' + t('howCap') + '</span></span>' +
    '<span class="go">' + icon('play', 16) + '</span></button>';
}
function wireFut() {
  $$('[data-who]').forEach(function (b) {
    b.onclick = function () { var w = b.getAttribute('data-who'); if (w === S.who) return; S.who = w; save(); route(); };
  });
  var s = $('[data-story]'); if (s) s.onclick = openStories;
}

function scrFuture() {
  if (S.who === 'school') return needScripts(['app/unis.js', 'app/campus.js'], scrUnis);
  needScript('app/jobs.js', scrJobs);
}

var JOB_PROF = '';
function scrJobs() {
  var J = window.JOBS || { profs: [], items: [] };
  function count(p) { return J.items.filter(function (j) { return j.p === p; }).length; }
  if (!JOB_PROF) {
    paint(futHead(t('jobsTitle')) +
      '<div class="glist">' + J.profs.map(function (p) {
        return '<button class="gi" data-prof="' + p.id + '"><span class="grow">' + esc(p[S.lang] || p.ru) + '</span>' +
          '<span class="n">' + count(p.id) + '</span><span class="chev">' + icon('right', 16) + '</span></button>';
      }).join('') + '</div><p class="foot">' + t('jobsFoot') + '</p>');
  } else {
    var prof = J.profs.filter(function (p) { return p.id === JOB_PROF; })[0] || {};
    var list = J.items.filter(function (j) { return j.p === JOB_PROF; });
    paint(seg() + '<button class="crumb" data-prof="">' + icon('left', 18) + t('allProfs') + '</button>' +
      '<h1 class="lt">' + esc(prof[S.lang] || prof.ru || '') + '</h1>' +
      (list.length ? '<div class="glist">' + list.map(function (j) {
        return '<a class="gi job" target="_blank" rel="noopener" href="' + esc(j.url) + '"><span class="grow"><b>' + esc(j.t) + '</b>' +
          '<span class="cap">' + [j.c, j.city].filter(Boolean).map(esc).join(' · ') + '</span>' +
          (j.sal ? '<span class="sal">' + esc(j.sal) + '</span>' : '') + '</span>' +
          '<span class="chev">' + icon('right', 16) + '</span></a>';
      }).join('') + '</div>' : '<p class="note">' + t('jobsEmpty') + '</p>'));
  }
  $$('[data-prof]').forEach(function (b) {
    b.onclick = function () { JOB_PROF = b.getAttribute('data-prof'); scrJobs(); };
  });
  wireFut();
}

/* ── Учёба ── */
var UNI_C = '';   /* фильтр страны — id гранта; направление помнится в S.field */
function uL() { return S.lang === 'kk' ? 'kk' : 'ru'; }
function tr(o) { return o ? (o[uL()] || o.ru || '') : ''; }
function progOf(c) { return (window.UNIS || []).filter(function (u) { return u.id === c.prog; })[0] || {}; }
function myCode() { var l = (window.LEVELS || []).filter(function (x) { return x.id === S.level; })[0]; return l ? l.code : ''; }
function img(name) { return 'assets/unis/' + name + '.jpg'; }

/* «Для тебя»: в выбранном направлении. Выше — где учат на английском (с A2
   это реальная цель), потом где платят стипендию, потом с известными
   выпускниками; одна страна — один вуз, чтобы подборка была разной. */
function recommend(f) {
  var EN = { nu: 1, bogazici: 1, bme: 1 }, STIP = { turkiye: 1, hungary: 1, korea: 1, china: 1 };
  var lv = (window.LEVELS || []).map(function (x) { return x.id; }).indexOf(S.level);
  function score(c) { return (EN[c.id] ? (lv >= 2 ? 3 : 1.5) : 0) + (STIP[c.prog] ? 2 : 0) + (c.alumni.length ? 0.5 : 0); }
  var seen = {}, out = [];
  (window.CAMPUS || []).filter(function (c) { return !f || c.fields.indexOf(f) >= 0; })
    .sort(function (a, b) { return score(b) - score(a); })
    .forEach(function (c) { if (!seen[c.prog] && out.length < 5) { seen[c.prog] = 1; out.push(c); } });
  return out;
}

function uniCard(c, big) {
  var P = (window.PROG || {})[c.prog] || {}, city = (window.CITIES || {})[c.city] || {};
  if (big) return '<button class="bc" data-uni="' + c.id + '"><img src="' + img(c.img) + '" alt="" loading="lazy">' +
    '<span class="bcx"><span class="cap">' + P.flag + ' ' + esc(tr(city)) + '</span><b>' + esc(c.name) + '</b>' +
    '<span class="perk">' + esc(tr(P.perk)) + '</span></span></button>';
  return '<button class="uc" data-uni="' + c.id + '"><span class="ph"><img src="' + img(c.img) + '" alt="" loading="lazy"></span>' +
    '<b>' + esc(c.name) + '</b><span class="cap">' + P.flag + ' ' + esc(tr(city)) + ' · ' + t('since')(c.since) + '</span>' +
    '<span class="perk">' + esc(tr(P.perk)) + '</span></button>';
}

function scrUnis() {
  var U = window.UNIS || [], C = window.CAMPUS || [], F = window.FIELDS || [], P = window.PROG || {};
  var f = S.field || '';
  var list = C.filter(function (c) { return (!UNI_C || c.prog === UNI_C) && (!f || c.fields.indexOf(f) >= 0); });
  var recs = UNI_C ? [] : recommend(f);
  var fname = f ? tr(F.filter(function (x) { return x.id === f; })[0]) : '';
  var checked = U.map(function (u) { return u.checked || ''; }).sort().pop() || '';
  paint(futHead(t('unisTitle')) +
    '<div class="fchips">' + [''].concat(U.map(function (u) { return u.id; })).map(function (id) {
      var u = U.filter(function (x) { return x.id === id; })[0];
      return '<button data-fc="' + id + '"' + (UNI_C === id ? ' class="on"' : '') + '>' +
        (id ? (P[id] ? P[id].flag + ' ' : '') + esc(tr(u.country)) : t('allCountries')) + '</button>';
    }).join('') + '</div>' +
    '<div class="fchips">' + [{ id: '' }].concat(F).map(function (x) {
      return '<button data-ff="' + x.id + '"' + (f === x.id ? ' class="on"' : '') + '>' + (x.id ? esc(tr(x)) : t('allFields')) + '</button>';
    }).join('') + '</div>' +
    (recs.length ? '<h2 class="sh">' + t('forYou') + '</h2><p class="shcap">' + (f ? t('forYouField')(fname) : t('forYouCap')) + '</p>' +
      '<div class="rail">' + recs.map(function (c) { return uniCard(c, true); }).join('') + '</div>' : '') +
    '<h2 class="sh">' + (UNI_C || f ? t('found')(list.length) : t('allUnis')) + '</h2>' +
    (list.length ? '<div class="ulist">' + list.map(function (c) { return uniCard(c); }).join('') + '</div>' : '<p class="note">' + t('noUnis') + '</p>') +
    '<p class="foot">' + t('unisFoot')(checked.split('-').reverse().join('.')) + '</p>');
  $$('.fchips .on').forEach(function (b) { b.parentNode.scrollLeft = b.offsetLeft - 60; });
  $$('[data-fc]').forEach(function (b) { b.onclick = function () { UNI_C = b.getAttribute('data-fc'); scrUnis(); }; });
  $$('[data-ff]').forEach(function (b) { b.onclick = function () { S.field = b.getAttribute('data-ff'); save(); scrUnis(); }; });
  $$('[data-uni]').forEach(function (b) { b.onclick = function () { openUni(b.getAttribute('data-uni')); }; });
  wireFut();
}

/* Полноэкранный слой поверх вкладки: вуз и сторис. */
function overlay(cls, html) {
  var el = document.createElement('div');
  el.className = cls; el.innerHTML = html;
  document.body.appendChild(el);
  document.documentElement.classList.add('locked');
  function close() { el.remove(); document.documentElement.classList.remove('locked'); document.removeEventListener('keydown', esc_); }
  function esc_(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', esc_);
  return { el: el, close: close };
}

function openUni(id) {
  var c = (window.CAMPUS || []).filter(function (x) { return x.id === id; })[0]; if (!c) return;
  var u = progOf(c), P = (window.PROG || {})[c.prog] || {}, city = (window.CITIES || {})[c.city] || {}, en = u.english || {};
  var how = (u.how && (u.how[uL()] || u.how.ru)) || [], cr = window.PHOTO_CREDIT || {};
  function row(k, v) { return v ? '<div class="kv2"><span>' + t(k) + '</span><p>' + esc(v) + '</p></div>' : ''; }
  function credit(k) { var x = cr[k]; return x ? '<a href="' + esc(x.u) + '" target="_blank" rel="noopener">' + esc(x.a) + '</a>, ' + esc(x.l) : ''; }
  var goal = en.ielts ? t('goalIelts')(en.ielts, myCode()) : '';
  var o = overlay('full', '<div class="fs">' +
    '<div class="hero"><img src="' + img(c.img) + '" alt=""><button class="xbtn" data-x aria-label="close">' + icon('close', 20) + '</button></div>' +
    '<div class="fpad">' +
      '<p class="eyebrow">' + P.flag + ' ' + esc(tr(u.country)) + ' · ' + esc(tr(city)) + ' · ' + t('since')(c.since) + '</p>' +
      '<h1 class="lt">' + esc(c.name) + '</h1>' +
      '<p class="lead">' + esc(tr(c.fact)) + '</p>' +
      '<div class="pair"><span><b>' + esc(tr(P.perk)) + '</b>' + t('uniGrant') + '</span><span><b>' + esc(tr(P.study)) + '</b>' + t('uniStudy') + '</span></div>' +
      (c.alumni.length ? '<h2 class="sh">' + t('alumni') + '</h2><div class="ppl">' + c.alumni.map(function (a) {
        return '<div class="pp"><img src="' + img('p_' + a.p) + '" alt=""><b>' + esc(a[uL()] || a.ru) + '</b><span>' +
          esc(tr(a.what)) + (a.role === 'taught' ? ' · ' + t('taught') : '') + '</span></div>';
      }).join('') + '</div>' : '') +
      '<h2 class="sh">' + t('city') + '</h2>' +
      '<div class="cityc"><img src="' + img(city.img) + '" alt="" loading="lazy"><span><b>' + esc(tr(city)) + '</b>' + esc(tr(city.line)) + '</span></div>' +
      '<h2 class="sh">' + t('uniGrantH') + '</h2><p class="shcap">' + esc(uL() === 'kk' && u.name_kk || u.name) + '</p>' +
      (goal ? '<p class="goal">' + esc(goal) + '</p>' : '') +
      '<div class="glist plain">' + row('uniCovers', tr(u.covers)) + row('uniEnglish', tr(en.note)) + row('uniOther', tr(u.other)) +
        row('uniWhen', tr(u.when)) + row('uniCost', tr(u.cost)) + '</div>' +
      (how.length ? '<h2 class="sh">' + t('uniHow') + '</h2><ol class="steps2">' + how.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' : '') +
      '<a class="btn" target="_blank" rel="noopener" href="' + esc(u.url) + '">' + t('uniSite') + '</a>' +
      '<p class="credit">' + t('photo') + ': ' + [credit(c.img), credit(city.img)].filter(Boolean).join('; ') + '. Wikimedia Commons</p>' +
    '</div></div>');
  o.el.querySelector('[data-x]').onclick = o.close;
}

/* ── Сторис «Как это работает» ──
   Первый слайд — видео (media/stories/howto_<lang>.mp4, собрано HyperFrames
   из promo/howto), дальше картинки с короткой подписью. Тап справа — дальше,
   слева — назад, удержание — пауза. Нет видео на этом языке — берём русское,
   нет и его — слайд пропускается. */
var STORY = [
  { video: 1 },
  { pic: 's_jobs',
    h: { ru: 'Работа с английским', kk: 'Ағылшынмен жұмыс' },
    p: { ru: 'Каждую неделю собираем с hh.kz вакансии, где просят английский. Выбери сферу: увидишь компанию, город и зарплату.',
         kk: 'Әр апта hh.kz-тен ағылшын тілі сұралатын вакансияларды жинаймыз. Саланы таңда: компания, қала және жалақы көрінеді.' } },
  { pic: 's_filters',
    h: { ru: 'Страна и направление', kk: 'Ел және бағыт' },
    p: { ru: 'Во вкладке «Учёба» выбери страну и что хочешь изучать. Сверху соберём вузы для тебя.',
         kk: '«Шетелде оқу» бөлімінде елді және не оқығың келетінін таңда. Жоғарыда саған лайық ЖОО-лар шығады.' } },
  { pic: 's_uni',
    h: { ru: 'Открой вуз', kk: 'ЖОО-ны аш' },
    p: { ru: 'Кампус и город на фото, кто там учился, что даёт грант, когда и как подавать.',
         kk: 'Кампус пен қала суретте, онда кім оқыған, грант не береді, қашан және қалай тапсыру керек.' } },
  { photo: 'assets/unis/u_nu.jpg',
    h: { ru: 'Английский — твой пропуск', kk: 'Ағылшын тілі — сенің жолдамаң' },
    p: { ru: 'Nazarbayev University просит IELTS 6.0, это примерно B2. Каждый уровень курса — шаг к нему.',
         kk: 'Nazarbayev University IELTS 6.0 сұрайды, бұл шамамен B2. Курстың әр деңгейі — соған бір қадам.' },
    cta: 1 }
];

function openStories() {
  S.storySeen = true; save();
  var pill = $('[data-story]'); if (pill) pill.classList.add('seen');
  var o = overlay('story', '<div class="bars">' + STORY.map(function () { return '<i><b></b></i>'; }).join('') + '</div>' +
    '<button class="sx" aria-label="close">' + icon('close', 22) + '</button><div class="stage"></div>');
  var el = o.el, stage = el.querySelector('.stage'), bars = el.querySelectorAll('.bars b');
  var i = -1, t0 = 0, held = 0, paused = false, vid = null, raf = 0, DUR = 7000;

  function go(n) {
    if (n < 0) n = 0;
    if (n >= STORY.length) return end();
    i = n; t0 = performance.now(); held = 0; vid = null;
    Array.prototype.forEach.call(bars, function (b, k) { b.style.width = k < i ? '100%' : '0%'; });
    var s = STORY[i];
    el.classList.toggle('lt', !!s.pic);
    if (s.video) {
      var src = 'media/stories/howto_' + uL() + '.mp4';
      stage.innerHTML = '<video class="sv" playsinline preload="auto" poster="assets/stories/poster.jpg"></video>';
      vid = stage.firstChild;
      vid.onerror = function () { if (vid.src.indexOf('_ru') < 0) { vid.src = 'media/stories/howto_ru.mp4'; vid.play(); } else go(i + 1); };
      vid.onended = function () { go(i + 1); };
      vid.src = src;
      var pr = vid.play(); if (pr && pr.catch) pr.catch(function () { vid.muted = true; vid.play(); });
    } else if (s.photo) {
      stage.innerHTML = '<div class="sphoto"><img src="' + s.photo + '" alt=""><div class="stx"><h2>' + esc(tr(s.h)) + '</h2><p>' + esc(tr(s.p)) + '</p>' +
        (s.cta ? '<button class="btn light" data-cta>' + t('toLessons') + '</button>' : '') + '</div></div>';
      var b = stage.querySelector('[data-cta]'); if (b) b.onclick = function (e) { e.stopPropagation(); end(); go_('#/lessons'); };
    } else {
      stage.innerHTML = '<div class="spic"><div class="stx"><h2>' + esc(tr(s.h)) + '</h2><p>' + esc(tr(s.p)) + '</p></div>' +
        '<div class="phone"><img src="assets/stories/' + s.pic + '_' + uL() + '.jpg" alt=""></div></div>';
    }
  }
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (i < 0) return;
    var p;
    if (vid) p = vid.duration ? vid.currentTime / vid.duration : 0;
    else { if (paused) { t0 = now - held; return; } held = now - t0; p = held / DUR; if (p >= 1) return go(i + 1); }
    bars[i].style.width = Math.min(100, p * 100) + '%';
  }
  function end() { cancelAnimationFrame(raf); if (vid) vid.pause(); o.close(); }
  function go_(h) { location.hash = h; }

  var down = 0, dx = 0;
  stage.addEventListener('pointerdown', function (e) { down = performance.now(); dx = e.clientX; paused = true; if (vid) vid.pause(); });
  stage.addEventListener('pointerup', function (e) {
    var quick = performance.now() - down < 250; paused = false;
    if (quick) { if (e.clientX < window.innerWidth * 0.3) go(i - 1); else go(i + 1); }
    else if (vid) vid.play();
  });
  el.querySelector('.sx').onclick = end;
  go(0); raf = requestAnimationFrame(tick);
}

function games() {
  return [
    { file: 'flappy.html',  id: 'flappy_english', name: 'Flappy English', note: t('gFlappyNote') },
    { file: 'soilem.html',  id: 'soilem',         name: t('gWordOrder'),  note: t('gWordOrderNote') },
    { file: 'surypta.html', id: 'surypta',        name: t('gSort'),       note: t('gSortNote') }
  ];
}

/* Что ребёнок уже сыграл. Итог кладёт games/bridge.js после партии, здесь
   он только показывается: игра без следа читается как игрушка в стороне
   от курса, а она часть курса. */
function gameLine(id, dflt) {
  var it = (S.g || {})[id];
  if (!it || !it.plays) return dflt;
  return t('gPlays')(it.plays) + (it.best ? ' · ' + t('gBest')(it.best) : '');
}

function scrGames() {
  paint(
    '<div class="head"><h1>' + t('gamesTab') + '</h1></div>' +
    '<p class="sub" style="margin:-8px 0 20px">' + t('gamesNote') + '</p>' +
    '<div class="rows">' +
      games().map(function (g) {
        return '<a class="row" href="games/' + g.file + '?g=' + g.id +
          '&back=' + encodeURIComponent('../index.html#/games') + '">' +
          '<span class="mark">' + icon('game', 24) + '</span>' +
          '<span class="grow"><b>' + g.name + '</b><span class="cap">' +
            esc(gameLine(g.id, g.note)) + '</span></span>' +
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
      '<p>' + esc(phoneShow(S.phone)) + '</p>' +
    '</div>' +

    '<div class="group">' +
      row('edit', t('name'), S.name || t('notSetN'), 'rName') +
      row('profile', t('gender'), nameOf(GENDERS, S.gender, t('notSetM')), 'rGender') +
    '</div>' +

    (BETA ? '<div class="group">' + row('gift', t('famRow'), INV && INV !== 'off' ? codeShow(INV.code) : t('famRowCap'), 'rFam') + '</div>' : '') +
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

  if ($('#rFam')) $('#rFam').onclick = famFromProfile;

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
   ПЛАШКА «СКОРО УРОК»
   Висит всегда, пока у ученика есть график: когда ближайший урок и
   сколько до него осталось — дни, часы, минуты. За час до начала и пока
   урок идёт — красная. Учителя и темы урока в ней нет: учителей
   подключаем позже.

   График лежит в карточке ученика, которую заполняет админ в дашборде.
   Ученику карточку читать нельзя (там ставка и заметки про него), поэтому
   база отдаёт выжимку функцией en_my_schedule(): дни, время и даты
   уроков на неделю вперёд. Ближайший урок считает SCHED.next
   (app/schedule.js), проверка — node app/check_reminder.mjs.
   ══════════════════════════════════════════════════════════════════ */
var MY_SCHED = null;          /* ответ en_my_schedule; null — ещё не спрашивали */

function loadSchedule() {
  if (!global_DB() || !DB.rpc) return;
  DB.rpc('en_my_schedule', {}).then(function (c) {
    MY_SCHED = Array.isArray(c) ? c : [];
    fillBanner();
  }).catch(function () { MY_SCHED = []; });
}

/* «2 дн 5 ч 12 мин»: нулевые старшие единицы не пишем */
function countdown(ms) {
  var m = Math.max(1, Math.ceil(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60);
  var out = [];
  if (d) out.push(d + ' ' + t('uDay'));
  if (d || h) out.push(h + ' ' + t('uHour'));
  out.push(m % 60 + ' ' + t('uMin'));
  return out.join(' ');
}

function reminder(cards, now) {
  var n = window.SCHED && SCHED.next(cards, now, 60);
  if (!n) return null;
  function pad(x) { return (x < 10 ? '0' : '') + x; }
  var time = pad(n.start.getHours()) + ':' + pad(n.start.getMinutes());
  if (n.left <= 0) return { soon: true, head: t('lessonNow'), sub: t('startedAt')(time) };
  var days = Math.round((new Date(n.start).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 864e5);
  var when = days === 0 ? t('today') : days === 1 ? t('tomorrow') : t('weekday')[n.start.getDay()];
  return { soon: n.left <= 3600000, head: t('lessonAt')(when, time), sub: t('leftTime')(countdown(n.left)) };
}

/* Плашка над главной и уроками. */
function fillBanner() {
  var box = document.getElementById('bn');
  if (!box) return;
  var r = reminder(MY_SCHED, new Date());
  box.innerHTML = r ? '<div class="bn' + (r.soon ? ' soon' : '') + '">' + icon('bell', 22) +
                      '<span><b>' + esc(r.head) + '</b><span>' + esc(r.sub) + '</span></span></div>' : '';
}
/* Отсчёт живёт по часам: пересчёт раз в полминуты и сразу, как только
   ученик вернулся в свёрнутую платформу. */
setInterval(fillBanner, 30000);
document.addEventListener('visibilitychange', function () { if (!document.hidden) fillBanner(); });

/* ══════════════════════════════════════════════════════════════════════
   РОУТЕР
   ══════════════════════════════════════════════════════════════════ */
function tabs() {
  return [
    { to: '#/home',     ic: 'home',    name: t('homeTab') },
    { to: '#/lessons',  ic: 'book',    name: t('lessonsTab') },
    { to: '#/games',    ic: 'game',    name: t('gamesTab') },
    BETA ? { to: '#/future', ic: S.who === 'school' ? 'cap' : 'brief', name: t('futTab')(S.who) } : null,
    { to: '#/settings', ic: 'profile', name: t('profileTab') }
  ].filter(Boolean);
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
  tabsEl.className = 'tabs' + (active ? '' : ' off') + (BETA ? ' five' : '');
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

  /* Два входных условия, и оба обязательные: сначала номер, потом курс.
     Курс выбирается на главной — туда и упирается вход без уровня. */
  if (!S.phone) { if (r !== 'login') return go('#/login'); }
  else if (!S.level && r !== 'home' && r !== 'level') return go('#/home');

  if (r === 'login')  { drawTabs(null); return scrLogin(); }
  if (r === 'home' || r === 'level') {
    drawTabs(S.level ? '#/home' : null);   /* без курса вкладки некуда вести */
    scrHome(); return fillBanner();
  }
  if (r === 'games')  { drawTabs('#/games'); return scrGames(); }
  if (r === 'settings') { drawTabs('#/settings'); return scrProfile(); }
  if (r === 'future' && BETA) { drawTabs('#/future'); return scrFuture(); }

  if (r === 'lesson' && parts[1]) {
    var id = parts[1], step = parts[2];
    openId = id;
    if (step === 'read')  { drawTabs(null); return scrRead(id); }
    if (step === 'prac')  { drawTabs(null); return scrPrac(id); }
    if (step === 'text')  { drawTabs(null); return scrText(id); }
    if (step === 'task')  { drawTabs(null); return scrTask(id); }
    if (step === 'words') { drawTabs(null); return scrWords(id); }
    return go('#/lessons');   /* отдельного экрана урока нет: шаги живут в списке */
  }

  drawTabs('#/lessons');
  scrLessons(); return fillBanner();
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
  loadSchedule();
  loadInvites();
}
if (DEMO) loadInvites();
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
