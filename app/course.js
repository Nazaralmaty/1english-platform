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
    taglineKk:'Нөлден бастаймын',
    about:'Знаете отдельные слова, но фразу собрать трудно. Первые 14 уроков — про себя: кто вы, что у вас есть, что делаете каждый день.',
    aboutKk:'Жеке сөздерді білесіз, бірақ сөйлем құрау қиын. Алғашқы 14 сабақ — өзіңіз туралы: кімсіз, не бар, күнде не істейсіз.' },

  { id:'elementary',      code:'A1+', title:'Elementary',
    tagline:'Собираю первые фразы',
    taglineKk:'Алғашқы сөйлемдерді құраймын',
    about:'Простые фразы уже получаются, но в них теряются мелочи: артикли, окончания, порядок слов. 14 уроков на то, чтобы речь перестала рассыпаться.',
    aboutKk:'Қарапайым сөйлем шығады, бірақ ішінде ұсақ нәрсе жоғалады: артикль, жалғау, сөз реті. 14 сабақ — сөзіңіз шашырамауы үшін.' },

  { id:'pre-intermediate', code:'A2', title:'Pre-Intermediate',
    tagline:'Говорю простыми фразами',
    taglineKk:'Қарапайым сөйлеммен сөйлеймін',
    about:'Настоящее время даётся, а прошедшее и планы разваливаются. 14 уроков про вчера, сейчас, сравнение и завтра.',
    aboutKk:'Осы шақ шығады, ал өткен шақ пен жоспар шашырайды. 14 сабақ — кеше, қазір, салыстыру және ертең туралы.' },

  { id:'intermediate',    code:'B1',  title:'Intermediate',
    tagline:'Держу разговор',
    taglineKk:'Әңгімені ұстап тұрамын',
    about:'Говорите, но спотыкаетесь на временах и звучите проще, чем думаете. 14 уроков про времена, условия, пассив и оттенки смысла.',
    aboutKk:'Сөйлейсіз, бірақ шақтарға сүрінесіз және ойыңыздан қарапайым естілесіз. 14 сабақ — шақтар, шарт, ырықсыз етіс және мағына реңктері.' }
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

  /* Elementary · Damu */
  e1: 'VB0EqXnRn-0',   e2: 'lyWAizWGFFM',   e3: 'OQbeZ86dD4A',   e4: 'jMmiCCQgPw0',
  e5: 'nh6Exmr5g2A',   e6: 'OhpkcMVuVBM',   e7: 'bJkHYyhOK5E',   e8: 'ZxQvwtLOR4s',
  e9: 'U37AocSjufk',   e10:'sG9HKHUcfl4',   e11:'FrKD2mi6CYE',   e12:'1u3ZmMdqnR8',
  e13:'J56U3DELZg0',   e14:'noxRjUgiczA',

  /* Pre-Intermediate · Junior */
  p1: 'fAVWTIrpjwI',   p2: 'Hc9C13nbyws',   p3: 'bHAv8ILcvLc',   p4: '5nJxHW7CB54',
  p5: 'HH1MWqxaHfc',   p6: 'iogBqQx8UxQ',   p7: 's4jXSmhyz-M',   p8: 'BNnTlyw-3F4',
  p9: 'uue0eLuP8As',   p10:'xkXQtq0yHYU',   p11:'rji0gJA5CSg',   p12:'ZioSsdYCM20',
  p13:'6lBnqmp3WgQ',   p14:'3F4jLhrtjPQ',

  /* Intermediate · Senior */
  i1: 'pMv5TQ42BnE',   i2: '1yxW3WnVWYk',   i3: 'raf6-vUKkew',   i4: 'W6a_AVRPBjk',
  i5: 'fHPzEkE0Qf8',   i6: '3pDvuCgDxEA',   i7: '20nkd_BSRoA',   i8: '6ddhFDYoPcM',
  i9: 'C7dPPQFeN14',   i10:'CtS9EsXm_jE',   i11:'c22jopxcXyM',   i12:'7DsgzGiygao',
  i13:'Kz7BYCq-888',   i14:'r92FIW9JEhY',
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

  /* Elementary · Damu */
  e1:  { title:'To Be' },
  e2:  { title:'Possessive Adjectives' },
  e3:  { title:'Possessive Pronouns' },
  e4:  { title:'Articles' },
  e5:  { title:'Demonstratives' },
  e6:  { title:'There Is' },
  e7:  { title:'Have Got' },
  e8:  { title:'Present Continuous' },
  e9:  { title:'Present Simple' },
  e10: { title:'Would You' },
  e11: { title:'Adverbs' },
  e12: { title:'Prepositions of Place' },
  e14: { title:'Imperatives' },

  /* Pre-Intermediate · Junior */
  p1:  { title:'Past Simple' },
  p2:  { title:'Past Continuous' },
  p3:  { title:'Used To' },
  p4:  { title:'Future Simple' },
  p5:  { title:'Going To' },
  p6:  { title:'Present Continuous' },
  p7:  { title:'Have To' },
  p8:  { title:'Should' },
  p9:  { title:'Get Used To' },
  p10: { title:'Quantifiers' },
  p11: { title:'However' },
  p12: { title:'Present Perfect' },
  p13: { title:'Expressing Purpose' },
  p14: { title:'First Conditional' },

  /* Intermediate · Senior */
  i1:  { title:'Past Perfect' },
  i2:  { title:'Past Perfect Continuous' },
  i3:  { title:'Present Perfect Continuous' },
  i4:  { title:'Future Continuous' },
  i5:  { title:'Future Perfect' },
  i6:  { title:'Second Conditional' },
  i7:  { title:'Passive Voice' },
  i8:  { title:'Relative Clauses' },
  i9:  { title:'Modals' },
  i10: { title:'Gerund and Infinitive' },
  i11: { title:'Reported Speech' },
  i12: { title:'Question Tags' },
  i13: { title:'Enough' },
  i14: { title:'Reflexive Pronouns' },

  e13: {
    title:'Can', subtitle:'Умею и можно',
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
        subtitle: c.subtitle || '', subtitleKk: c.subtitleKk || '',
        rule:     c.rule     || '', ruleKk:     c.ruleKk     || '',
        examples: c.examples || [],
        words:    c.words    || [],
        tasks:    c.tasks    || []
      });
    }
    return {
      id: lv.id, code: lv.code, title: lv.title,
      tagline: lv.tagline, taglineKk: lv.taglineKk,
      about: lv.about, aboutKk: lv.aboutKk, lessons: out
    };
  })
};
