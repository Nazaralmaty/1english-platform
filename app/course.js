/*!
 * 1English · содержание курса.
 *
 * КАК ЭТО УСТРОЕНО. Уровней четыре, в каждом 14 уроков. Пустой урок — это
 * нормальное состояние: он виден в списке, но внутрь не пускает, пока к нему
 * не привязали видео или задания. Врать кнопкой «Смотреть» на пустом уроке
 * хуже, чем честно показать, что материала ещё нет.
 *
 * КУДА ЧТО ВСТАВЛЯТЬ.
 *   1. Ссылка на ролик  → window.VIDEOS, одна строка на урок.
 *   2. Тема и материалы → window.CONTENT, один объект на урок.
 * Больше нигде править не нужно: экраны собирают курс из этих двух таблиц.
 *
 * Урок собран из трёх шагов, других шагов у урока нет:
 *   1. Урок    — видео и разбор правила;
 *   2. Задание — вопросы с тап-ответом, без клавиатуры;
 *   3. Словарь — слова карточками.
 *
 * Типы заданий:
 *   choice — вопрос и 3 варианта, a — индекс верного;
 *   order  — собрать предложение из плиток, a — верный порядок строкой.
 *
 * Правильный ответ пока лежит рядом с вопросом: это прототип на одном
 * устройстве. Когда включится Supabase, поля a и why уезжают на сервер
 * (backend/schema.sql) и в браузер не приходят.
 */

/* ══════════════════════════════════════════════════════════════════════
   1. УРОВНИ
   ══════════════════════════════════════════════════════════════════ */
window.LEVELS = [
  { id:'beginner',        code:'A1',  title:'Beginner',
    tagline:'Начинаю с нуля',
    about:'Знаете отдельные слова, но фразу собрать трудно. Первые 14 уроков — про себя: кто вы, что у вас есть, что делаете каждый день.' },

  { id:'elementary',      code:'A1+', title:'Elementary',
    tagline:'Собираю первые фразы',
    about:'Простые фразы уже получаются, но в них теряются мелочи: артикли, окончания, порядок слов. 14 уроков на то, чтобы речь перестала рассыпаться.' },

  { id:'pre-intermediate', code:'A2', title:'Pre-Intermediate',
    tagline:'Говорю простыми фразами',
    about:'Настоящее время даётся, а прошедшее и планы разваливаются. 14 уроков про вчера, сейчас, сравнение и завтра.' },

  { id:'intermediate',    code:'B1',  title:'Intermediate',
    tagline:'Держу разговор',
    about:'Говорите, но спотыкаетесь на временах и звучите проще, чем думаете. 14 уроков про времена, условия, пассив и оттенки смысла.' }
];

window.LESSONS_PER_LEVEL = 14;

/* ══════════════════════════════════════════════════════════════════════
   2. ВИДЕО
   Ролики на YouTube закрытые (unlisted): по ссылке открываются, в поиске
   их нет. Плееру нужен только id — хвост ссылки после youtu.be/ или после
   watch?v=. Из https://youtu.be/3ZkombMruHM берётся 3ZkombMruHM.
   Пустая строка значит «ролик ещё не привязан».
   ══════════════════════════════════════════════════════════════════ */
window.VIDEOS = {
  /* Beginner · Bastau */
  b1:'rGaqiSrDJKA',  b2:'pyqn323rv2Q',  b3:'l3AowtVng70',  b4:'2JukjUYj2-8',
  b5:'w7jJHmWGj74',  b6:'91_3H-adkN8',  b7:'cISqphU3BTU',  b8:'64-bU7A9vZA',
  b9:'DIW5heyt3Ok',  b10:'BLG3UOkkLEI', b11:'i4mNTsBkiuI', b12:'M-OmCZteTog',
  b13:'Ha1OnkE9Gkg', b14:'PtwWgIZuLIk',

  /* Elementary */
  e1:'',  e2:'3ZkombMruHM',       e3:'',  e4:'',  e5:'',  e6:'',  e7:'',
  e8:'',  e9:'',  e10:'', e11:'', e12:'', e13:'', e14:'',

  /* Pre-Intermediate */
  p1:'',  p2:'',  p3:'',  p4:'',  p5:'',  p6:'',  p7:'',
  p8:'',  p9:'',  p10:'', p11:'', p12:'', p13:'', p14:'',

  /* Intermediate */
  i1:'',  i2:'',  i3:'',  i4:'',  i5:'',  i6:'',  i7:'',
  i8:'',  i9:'',  i10:'', i11:'', i12:'', i13:'', i14:''
};

/* ══════════════════════════════════════════════════════════════════════
   3. МАТЕРИАЛЫ УРОКОВ
   Ключ — id урока из таблицы выше. Урока здесь нет — значит он пустой,
   и в списке он показан без темы, а его шаги закрыты.

   Заготовка для нового урока:

   x1: {
     title:'Тема', subtitle:'Одной фразой, зачем это',
     rule:'Правило в двух предложениях, без терминов.',
     examples:[ {en:'', ru:''} ],
     words:[ {en:'', ru:'', ex:''} ],
     tasks:[
       {t:'choice', q:'Вопрос с ___ на месте пропуска', opts:['','',''], a:0, why:'Почему так'},
       {t:'order',  ru:'Фраза по-русски', words:['I','can'], a:'I can'}
     ]
   }
   ══════════════════════════════════════════════════════════════════ */
window.CONTENT = {

  /* Beginner · Bastau. Темы взяты из названий роликов; задания и словарь
     добавляются позже — урок с одним видео открывается и так. */
  b1:  { title:'Sound Combinations in Real Live' },
  b2:  { title:'Numbers, Colors' },
  b3:  { title:'Countable and Uncountable Nouns' },
  b4:  { title:'Food, Drink' },
  b5:  { title:'Plural, Singular' },
  b6:  { title:'Some, Any' },
  b7:  { title:'Subject Pronouns' },
  b8:  { title:'Object Pronouns' },
  b9:  { title:'Adjectives' },
  b10: { title:'Superlative' },
  b11: { title:'My House' },
  b12: { title:'Wh- Questions' },
  b13: { title:'My Family' },
  b14: { title:'How Much' },

  e2: {
    title:'Can / can’t', subtitle:'Умею и можно',
    rule:'can — умею или можно, can’t — не умею или нельзя. После can глагол идёт голым, без to и без окончания: I can swim, а не I can to swim.',
    examples:[
      {en:'I can swim.',              ru:'Я умею плавать.'},
      {en:'He can’t drive a car.',    ru:'Он не умеет водить машину.'},
      {en:'Can I open the window?',   ru:'Можно я открою окно?'},
      {en:'Can we leave now?',        ru:'Нам можно сейчас уйти?'}
    ],
    words:[
      {en:'swim',    ru:'плавать',        ex:'I can swim well.'},
      {en:'drive',   ru:'водить машину',  ex:'My mother can drive.'},
      {en:'ask',     ru:'спросить',       ex:'Can I ask a question?'},
      {en:'lift',    ru:'поднять',        ex:'He can lift that box.'},
      {en:'ticket',  ru:'билет',          ex:'I can’t buy a ticket.'},
      {en:'strong',  ru:'сильный',        ex:'My dad is strong.'},
      {en:'borrow',  ru:'взять на время', ex:'Can I borrow your pen?'},
      {en:'dinner',  ru:'ужин',           ex:'Wash your hands before dinner.'}
    ],
    tasks:[
      {t:'choice', q:'I have no money. I ___ buy a ticket.',     opts:['can','can’t','am not'], a:1, why:'Денег нет, значит купить не получится: can’t.'},
      {t:'choice', q:'___ I ask a question, please?',            opts:['Can','Am','Do'], a:0, why:'Просьба и разрешение — тоже can, и оно встаёт первым.'},
      {t:'choice', q:'My dad is strong. He ___ lift that box.',  opts:['can’t','can','is'], a:1, why:'Сильный, значит может: can.'},
      {t:'choice', q:'No, you ___ eat the cake before dinner.',  opts:['can','can’t','don’t'], a:1, why:'Запрет — can’t.'},
      {t:'order',  ru:'Я не умею водить машину.', words:['I','can’t','drive','a','car'], a:'I can’t drive a car'},
      {t:'order',  ru:'Можно взять твою ручку?',  words:['Can','I','borrow','your','pen'], a:'Can I borrow your pen'}
    ]
  }

};

/* ══════════════════════════════════════════════════════════════════════
   4. СБОРКА
   Экраны читают только window.COURSE и про таблицы выше не знают.
   ══════════════════════════════════════════════════════════════════ */
window.COURSE = {
  levels: window.LEVELS.map(function (lv) {
    var pre = lv.id[0] === 'p' ? 'p' : lv.id[0];   /* beginner→b, elementary→e, pre→p, intermediate→i */
    var out = [];
    for (var n = 1; n <= window.LESSONS_PER_LEVEL; n++) {
      var id = pre + n, c = window.CONTENT[id] || {};
      out.push({
        id: id, n: n,
        title:    c.title    || '',
        subtitle: c.subtitle || '',
        rule:     c.rule     || '',
        examples: c.examples || [],
        words:    c.words    || [],
        tasks:    c.tasks    || []
      });
    }
    return {
      id: lv.id, code: lv.code, title: lv.title,
      tagline: lv.tagline, about: lv.about, lessons: out
    };
  })
};
