/*!
 * 1English · содержание курса.
 *
 * КАК ЭТО УСТРОЕНО. Уровней четыре, в каждом 14 уроков. Пустой урок — это
 * нормальное состояние: он виден в списке, но внутрь не пускает, пока к нему
 * не привязали видео или задания. Врать кнопкой «Смотреть» на пустом уроке
 * хуже, чем честно показать, что материала ещё нет.
 *
 * КУДА ЧТО ВСТАВЛЯТЬ.
 *   1. Ролики урока     → window.VIDEOS, пара [теория, практика] на урок.
 *   2. Тема и материалы → window.CONTENT, один объект на урок.
 * Больше нигде править не нужно: экраны собирают курс из этих двух таблиц.
 *
 * Урок разделён на две секции, в них пять шагов, других шагов у урока нет:
 *   Теория   — видеоурок с правилом и разбором            (шаг read);
 *   Практика — видеоурок на практику                      (шаг prac),
 *              чтение: текст с флип-картами слов урока      (text),
 *              задание: вопросы с тап-ответом, без клавиатуры (task),
 *              словарь: слова карточками                   (words).
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

   У урока два ролика, и лежат они парой [теория, практика]. На YouTube
   теория подписана «Grammar Lesson 1», практика — «Grammar Lesson 2».
   Пустая строка значит «ролик ещё не привязан»: его шаг закрыт, второй
   ролик урока при этом работает.

   Это казахские ролики — основная группа казахоязычная.
   ══════════════════════════════════════════════════════════════════ */
window.VIDEOS = {
  /* Beginner · Bastau */
  b1:  ['L8WgzJV_scE', 'rGaqiSrDJKA'], b2:  ['3HmW8IpNklA', 'pyqn323rv2Q'],
  b3:  ['URro5v8CSDc', 'l3AowtVng70'], b4:  ['_2oHr01yM6k', '2JukjUYj2-8'],
  b5:  ['IOQQRXshMWc', 'w7jJHmWGj74'], b6:  ['2sonvmOHQTw', '91_3H-adkN8'],
  b7:  ['mbrIxyMD7Sk', 'cISqphU3BTU'], b8:  ['sWBsaaukLaA', '64-bU7A9vZA'],
  b9:  ['pPEe3QWKZhU', 'DIW5heyt3Ok'], b10: ['Yw_o8147K3Y', 'BLG3UOkkLEI'],
  b11: ['bd9HWP0ez1k', 'i4mNTsBkiuI'], b12: ['_DyS_uSyxmg', 'M-OmCZteTog'],
  b13: ['2V0JpHx9FWk', 'Ha1OnkE9Gkg'], b14: ['Msu8vzdP1O0', 'PtwWgIZuLIk'],

  /* Elementary · Damu */
  e1:  ['7z4MJCFSix4', 'VB0EqXnRn-0'], e2:  ['XPuWHkfg99s', 'lyWAizWGFFM'],
  e3:  ['aQNj9qhgvAg', 'OQbeZ86dD4A'], e4:  ['nzQN_a2-VVo', 'jMmiCCQgPw0'],
  e5:  ['n19e3R4Jw9s', 'nh6Exmr5g2A'], e6:  ['nG9vh6UKAgM', 'OhpkcMVuVBM'],
  e7:  ['ZU2iWhI-2Ug', 'bJkHYyhOK5E'], e8:  ['iAaIsoa6qA0', 'ZxQvwtLOR4s'],
  e9:  ['24l0QWry0pA', 'U37AocSjufk'], e10: ['KX5tV5YPdFo', 'sG9HKHUcfl4'],
  e11: ['cLjdX1JomeY', 'FrKD2mi6CYE'], e12: ['oydLkS7aBXg', '1u3ZmMdqnR8'],
  e13: ['Vrs1ZkgcF98', 'J56U3DELZg0'], e14: ['VV9eRYoauPs', 'noxRjUgiczA'],

  /* Pre-Intermediate · Junior */
  p1:  ['-mQ7Todec64', 'fAVWTIrpjwI'], p2:  ['aZT6zsf__Ao', 'Hc9C13nbyws'],
  p3:  ['Z_xCsqhqvTA', 'bHAv8ILcvLc'], p4:  ['Tx8_jm3-ROQ', '5nJxHW7CB54'],
  p5:  ['DjEzWiSGoQo', 'HH1MWqxaHfc'], p6:  ['YR-9XEvoRXo', 'iogBqQx8UxQ'],
  p7:  ['v_4Dxi8IqcE', 's4jXSmhyz-M'], p8:  ['bJbuRNukN1s', 'BNnTlyw-3F4'],
  p9:  ['wfjq6Wr_q-w', 'uue0eLuP8As'], p10: ['9g-ccy6M2BA', 'xkXQtq0yHYU'],
  p11: ['afwpLGNC4Wo', 'rji0gJA5CSg'], p12: ['7EBbJMhOSpQ', 'ZioSsdYCM20'],
  p13: ['m7-2Sx1woug', '6lBnqmp3WgQ'], p14: ['pghgZl9NFDE', '3F4jLhrtjPQ'],

  /* Intermediate · Senior. Пока по одному ролику, и это теория: i1 на
     YouTube подписан «Grammar Lesson 1». Практика ещё не привязана. */
  i1:  ['pMv5TQ42BnE', ''],            i2:  ['1yxW3WnVWYk', ''],
  i3:  ['raf6-vUKkew', ''],            i4:  ['W6a_AVRPBjk', ''],
  i5:  ['fHPzEkE0Qf8', ''],            i6:  ['3pDvuCgDxEA', ''],
  i7:  ['20nkd_BSRoA', ''],            i8:  ['6ddhFDYoPcM', ''],
  i9:  ['C7dPPQFeN14', ''],            i10: ['CtS9EsXm_jE', ''],
  i11: ['c22jopxcXyM', ''],            i12: ['7DsgzGiygao', ''],
  i13: ['Kz7BYCq-888', ''],            i14: ['r92FIW9JEhY', ''],
};

/* ══════════════════════════════════════════════════════════════════════
   2b. ВИДЕО НА РУССКОМ
   Русская группа смотрит свои ролики, устроены они так же: пара
   [теория, практика]. Русского ролика нет — на его месте играет
   казахский из таблицы выше, и шаг из-за этого не пропадает.
   ══════════════════════════════════════════════════════════════════ */
window.VIDEOS_RU = {
  /* Beginner · Bastau */
  b1: ['ZbN4pRHz2yk', 'zpKu49rt4fo'],   b2: ['gVTRgYXBfJk', 'iOXRaFOKAPc'],
  b3: ['mIVMsgsXorY', 'pAi-OxO9oRQ'],   b4: ['fwHBcK_gOwE', 'wDoOHS9bpWI'],
  b5: ['PcUWO7WfeZk', 'pO3kKzbK8mk'],   b6: ['wSAqBbVVnjg', 'y_X-4GvZSIM'],
  b7: ['N546ZD8XHCE', 'SA2UkLNcHRU'],   b8: ['WkhGZrCS7b4', 'CQK3b-ETTHw'],
  b9: ['xtbaxHfLM00', 'lkwHwFo8RF8'],   b10:['e1XsmzWib60', '9B-VoS1sTO0'],
  b11:['U7ii7sI-RSU', 'taHIPKTGC-c'],   b12:['cTYVH3V9YEU', '1Y4DqYupsQg'],
  b13:['C2O7Hn1EN-Q', '93ZfINFs28I'],   b14:['F2yAqY5R60w', 'NihM3ay4jGE'],
};

/* Мультик урока (Forest English): mp4 лежит здесь же, в media/cartoon/, и
   играет в практике над видеоуроком. Шагов не добавляет: практика отмечается
   той же кнопкой. Исходники мультика — в vault, cartoon-english/<id>/. */
window.CARTOONS = {
  b1: { src: 'media/cartoon/b1.mp4', poster: 'media/cartoon/b1.jpg' },
  b2: { src: 'media/cartoon/b2.mp4', poster: 'media/cartoon/b2.jpg' },
  b3: { src: 'media/cartoon/b3.mp4', poster: 'media/cartoon/b3.jpg' },
  b14: { src: 'media/cartoon/b14.mp4', poster: 'media/cartoon/b14.jpg' }
};

/* Ролики урока на нужном языке: { theory, practice }. Одна функция на
   платформу, дашборд и проверки — иначе каждый считал бы шаги по-своему.
   Строка вместо пары читается как одна теория. */
window.lessonVideos = function (id, lang) {
  function pair(v) {
    if (!v) return ['', ''];
    return (typeof v === 'string') ? [v, ''] : [v[0] || '', v[1] || ''];
  }
  var kz = pair((window.VIDEOS || {})[id]);
  var ru = lang === 'ru' ? pair((window.VIDEOS_RU || {})[id]) : ['', ''];
  return { theory: ru[0] || kz[0], practice: ru[1] || kz[1] };
};

/* ══════════════════════════════════════════════════════════════════════
   3. МАТЕРИАЛЫ УРОКОВ
   Ключ — id урока из таблицы выше. Урока здесь нет — значит он пустой,
   и в списке он показан без темы, а его шаги закрыты.

   Урок двуязычный. Русское поле обязательное, казахское лежит рядом: у
   строки это хвост Kk (rule → ruleKk), у перевода это пара ru + kk.
   Казахского нет — покажется русский, урок из-за этого не ломается.

   g у слова — группа для игровых арен: act (действие), thing (предмет),
   sign (признак), time (время), word (служебное). Её читает words_bridge.js.

   Заготовка для нового урока:

   x1: {
     title:'Тема', subtitle:'Одной фразой, зачем это', subtitleKk:'Сол қазақша',
     rule:'Правило в двух предложениях, без терминов.',
     ruleKk:'Сол ереже қазақша.',
     examples:[ {en:'', ru:'', kk:''} ],
     words:[ {en:'', ru:'', kk:'', ex:'', g:'thing'} ],
     tasks:[
       {t:'choice', q:'Вопрос с ___ на месте пропуска', opts:['','',''], a:0,
        why:'Почему так', whyKk:'Неге олай'},
       {t:'order',  ru:'Фраза по-русски', kk:'Сол сөйлем қазақша',
        words:['I','can'], a:'I can'}
     ]
   }
   ══════════════════════════════════════════════════════════════════ */
window.CONTENT = {

  /* Beginner · Bastau. Разбор, слова и задания сняты с самих роликов:
     слайды урока плюс расшифровка речи преподавателя. */
  b1: {
    title:'Sound Combinations in Real Life', subtitle:'Читать сочетания звуков', subtitleKk:'Дыбыс тіркестерін оқу',
    rule:'Две согласные рядом читаются обе, гласную между ними не вставляем: bread, spoon, tree. Две гласные рядом дают один звук: train — «трэйн», sheep — долгое «и», book — короткое «у».',
    ruleKk:'Қатар тұрған екі дауыссыздың екеуі де айтылады, арасына дауысты дыбыс қоспаймыз: bread, spoon, tree. Ал қатар тұрған екі дауысты бір ғана дыбыс береді: train — «трэйн», sheep — созылыңқы «и», book — қысқа «у».',
    examples:[
      {en:'I like fresh bread.', ru:'Я люблю свежий хлеб.', kk:'Мен балғын нанды жақсы көремін.'},
      {en:'We have fresh fruit on a plate.', ru:'У нас на тарелке свежие фрукты.', kk:'Табақта балғын жеміс тұр.'},
      {en:'Look at that tall tree.', ru:'Посмотри на то высокое дерево.', kk:'Анау биік ағашқа қара.'},
      {en:'The train comes in the rain.', ru:'Поезд приходит под дождём.', kk:'Пойыз жаңбырда келеді.'},
    ],
    words:[
      {en:'bread', ru:'хлеб', kk:'нан', ex:'I like fresh bread.', g:'thing'},
      {en:'spoon', ru:'ложка', kk:'қасық', ex:'I stir my tea with a spoon.', g:'thing'},
      {en:'fruit', ru:'фрукты', kk:'жеміс', ex:'We have fresh fruit on a plate.', g:'thing'},
      {en:'tree', ru:'дерево', kk:'ағаш', ex:'Look at that tall tree.', g:'thing'},
      {en:'flowers', ru:'цветы', kk:'гүлдер', ex:'Let’s smell the flowers.', g:'thing'},
      {en:'train', ru:'поезд', kk:'пойыз', ex:'I go home by train.', g:'thing'},
      {en:'book', ru:'книга', kk:'кітап', ex:'I want to buy a book.', g:'thing'},
      {en:'blue', ru:'голубой', kk:'көк', ex:'The sky is blue today.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'I like fresh ___.', opts:['bread', 'tree', 'train'], a:0,
       why:'Свежим называют хлеб; дерево и поезд свежими не бывают.',
       whyKk:'Балғын деп нанды айтады; ағаш пен пойыз балғын болмайды.'},
      {t:'choice', q:'We have fresh fruit on a ___.', opts:['plate', 'spoon', 'book'], a:0,
       why:'Фрукты кладут на тарелку, ложка и книга для этого не нужны.',
       whyKk:'Жемісті табаққа салады, қасық пен кітап оған керек емес.'},
      {t:'choice', q:'A big ___ sails on the sea.', opts:['sheep', 'ship', 'shop'], a:1,
       why:'По морю плывёт корабль — ship с коротким «и»; sheep с долгим «и» это овца.',
       whyKk:'Теңізде кеме жүзеді — ship, «и» қысқа айтылады; созып айтсаң, sheep — қой болып кетеді.'},
      {t:'choice', q:'The train comes in the ___.', opts:['rain', 'brain', 'train'], a:0,
       why:'Все три слова звучат с одним и тем же «эй», поэтому выбираем по смыслу: поезд идёт в дождь.',
       whyKk:'Үш сөз де бірдей «эй» дыбысымен айтылады, сондықтан мағынасына қарап таңдаймыз: пойыз жаңбырда жүреді.'},
      {t:'order', ru:'Я хочу купить книгу.', kk:'Мен кітап сатып алғым келеді.',
       words:['I', 'want', 'to', 'buy', 'a', 'book'], a:'I want to buy a book'},
      {t:'order', ru:'Я мешаю чай ложкой.', kk:'Мен шәйді қасықпен араластырамын.',
       words:['I', 'stir', 'my', 'tea', 'with', 'a', 'spoon'], a:'I stir my tea with a spoon'},
    ]
  },

  b2: {
    title:'Numbers, Colors', subtitle:'Сказать, что ты видишь', subtitleKk:'Көргеніңді айту',
    rule:'На вопрос What do you see? отвечают по порядку: число, цвет, предмет — I see one red apple. Если предметов больше одного, к предмету добавляется -s: four blue books.',
    ruleKk:'What do you see? деген сұраққа рет-ретімен жауап береміз: сан, түс, зат — I see one red apple. Зат біреуден көп болса, зат атауына -s жалғанады: four blue books.',
    examples:[
      {en:'What do you see?', ru:'Что ты видишь?', kk:'Не көріп тұрсың?'},
      {en:'I see one red apple.', ru:'Я вижу одно красное яблоко.', kk:'Мен бір қызыл алма көріп тұрмын.'},
      {en:'I see four blue books.', ru:'Я вижу четыре синие книги.', kk:'Мен төрт көк кітап көріп тұрмын.'},
      {en:'I see ten green trees.', ru:'Я вижу десять зелёных деревьев.', kk:'Мен он жасыл ағаш көріп тұрмын.'},
    ],
    words:[
      {en:'see', ru:'видеть', kk:'көру', ex:'What do you see?', g:'act'},
      {en:'red', ru:'красный', kk:'қызыл', ex:'Five red chairs are here.', g:'sign'},
      {en:'yellow', ru:'жёлтый', kk:'сары', ex:'I see eight yellow balls.', g:'sign'},
      {en:'blue', ru:'синий', kk:'көк', ex:'Nine blue bikes are here.', g:'sign'},
      {en:'green', ru:'зелёный', kk:'жасыл', ex:'I see six green notebooks.', g:'sign'},
      {en:'one', ru:'один', kk:'бір', ex:'I see one red apple.', g:'word'},
      {en:'ten', ru:'десять', kk:'он', ex:'Ten green trees are here.', g:'word'},
      {en:'apple', ru:'яблоко', kk:'алма', ex:'This apple is red.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'___ do you see?', opts:['What', 'Who', 'Where'], a:0,
       why:'Спрашиваем про вещи, а не про человека или место.',
       whyKk:'Сұрақ зат туралы, адам немесе орын туралы емес.'},
      {t:'choice', q:'I see one red ___.', opts:['apple', 'apples', 'an apple'], a:0,
       why:'Число one уже говорит, что предмет один: ни -s, ни артикль не нужны.',
       whyKk:'one саны заттың біреу екенін көрсетеді, сондықтан -s те, артикль де керек емес.'},
      {t:'choice', q:'I see four blue ___.', opts:['book', 'books', 'the books'], a:1,
       why:'После four предметов много, поэтому у слова book появляется -s.',
       whyKk:'four дегеннен кейін зат көп, сондықтан book сөзіне -s жалғанады.'},
      {t:'choice', q:'There are ___ chairs here.', opts:['five red', 'red five', 'five reds'], a:0,
       why:'Порядок такой: сколько, какого цвета, что именно; цвет при этом -s не получает.',
       whyKk:'Реті осылай: қанша, қандай түсті, не; түске -s жалғанбайды.'},
      {t:'order', ru:'Я вижу три зелёных киви.', kk:'Мен үш жасыл киви көріп тұрмын.',
       words:['I', 'see', 'three', 'green', 'kiwis'], a:'I see three green kiwis'},
      {t:'order', ru:'Я вижу девять синих велосипедов и десять зелёных деревьев.', kk:'Мен тоғыз көк велосипед пен он жасыл ағаш көріп тұрмын.',
       words:['I', 'see', 'nine', 'blue', 'bikes', 'and', 'ten', 'green', 'trees'], a:'I see nine blue bikes and ten green trees'},
    ]
  },

  b3: {
    title:'Countable and Uncountable Nouns', subtitle:'Считаемое и несчитаемое', subtitleKk:'Саналатын және саналмайтын',
    rule:'Считаемое идёт с числом, во множественном получает -s: a chair, three chairs; про него спрашивают how many. Несчитаемое по штукам не считают — water, sugar, bread; про него спрашивают how much, а счёт идёт через меру: a bottle of water, a cup of tea.',
    ruleKk:'Саналатын зат санмен тұрады, көпше түрде -s жалғанады: a chair, three chairs; оған how many деп сұраймыз. Саналмайтын затты дана-дана санамайды — water, sugar, bread; оған how much деп сұраймыз, ал санағанда өлшеммен айтамыз: a bottle of water, a cup of tea.',
    examples:[
      {en:'an apple, two apples', ru:'яблоко, два яблока', kk:'бір алма, екі алма'},
      {en:'a chair, three chairs', ru:'стул, три стула', kk:'бір орындық, үш орындық'},
      {en:'a bottle of water', ru:'бутылка воды', kk:'бір бөтелке су'},
      {en:'How many apples? How much sugar?', ru:'Сколько яблок? Сколько сахара?', kk:'Неше алма? Қанша қант?'},
    ],
    words:[
      {en:'apple', ru:'яблоко', kk:'алма', ex:'I have two apples.', g:'thing'},
      {en:'book', ru:'книга', kk:'кітап', ex:'I have four books.', g:'thing'},
      {en:'chair', ru:'стул', kk:'орындық', ex:'There are three chairs here.', g:'thing'},
      {en:'water', ru:'вода', kk:'су', ex:'She drinks water every day.', g:'thing'},
      {en:'sugar', ru:'сахар', kk:'қант', ex:'We need sugar for tea.', g:'thing'},
      {en:'bread', ru:'хлеб', kk:'нан', ex:'I eat a slice of bread.', g:'thing'},
      {en:'many', ru:'много (о том, что считают)', kk:'көп (саналатын затпен)', ex:'How many apples do you want?', g:'word'},
      {en:'much', ru:'много (о том, что не считают)', kk:'көп (саналмайтын затпен)', ex:'How much tea do you drink?', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'How ___ apples do you have?', opts:['much', 'many', 'old'], a:1,
       why:'Яблоки можно посчитать по штукам, поэтому здесь many.',
       whyKk:'Алманы дана-дана санауға болады, сондықтан мұнда many.'},
      {t:'choice', q:'How ___ sugar do you need?', opts:['many', 'much', 'long'], a:1,
       why:'Сахар не считают по штукам, для таких слов идёт much.',
       whyKk:'Қантты дана-дана санамайды, ондай сөздерге much қойылады.'},
      {t:'choice', q:'There are three ___ in the room.', opts:['chair', 'chairs', 'water'], a:1,
       why:'После числа больше одного у считаемого слова появляется -s.',
       whyKk:'Бірден үлкен саннан кейін саналатын сөзге -s жалғанады.'},
      {t:'choice', q:'I drink two ___ of tea every morning.', opts:['cup', 'cups', 'tea'], a:1,
       why:'Чай по штукам не считают, считают чашки — поэтому -s получает cup, а не tea.',
       whyKk:'Шайды дана-дана санамайды, кесені санайды — сондықтан -s шайға емес, cup сөзіне жалғанады.'},
      {t:'order', ru:'Мне нужна бутылка воды.', kk:'Маған бір бөтелке су керек.',
       words:['I', 'need', 'a', 'bottle', 'of', 'water'], a:'I need a bottle of water'},
      {t:'order', ru:'Сколько у тебя книг?', kk:'Сенде неше кітап бар?',
       words:['How', 'many', 'books', 'do', 'you', 'have'], a:'How many books do you have'},
    ]
  },

  b4: {
    title:'Food, Drink', subtitle:'Сделать заказ в кафе', subtitleKk:'Кафеде тапсырыс беру',
    rule:'В кафе не говори «I want» — звучит грубо. Говори «I’d like», а дальше ставь «a» перед тем, что считают по штукам: a sandwich, и «some» перед тем, что наливают: some tea.',
    ruleKk:'Кафеде «I want» деме — дөрекі естіледі. «I’d like» деп айт, одан кейін дана-данамен саналатын нәрсеге «a» қой: a sandwich, ал құйылатын нәрсеге «some» келеді: some tea.',
    examples:[
      {en:'What would you like?', ru:'Что вы будете?', kk:'Не аласыз?'},
      {en:'I’d like some green tea, please.', ru:'Мне, пожалуйста, зелёный чай.', kk:'Маған көк шай берсеңіз.'},
      {en:'I’d like a chicken sandwich.', ru:'Я бы хотел сэндвич с курицей.', kk:'Менің тауық етті сэндвич алғым келеді.'},
      {en:'Anything else? No, thank you.', ru:'Что-нибудь ещё? Нет, спасибо.', kk:'Тағы бірдеңе қалайсыз ба? Жоқ, рахмет.'},
    ],
    words:[
      {en:'water', ru:'вода', kk:'су', ex:'I’d like some water.', g:'thing'},
      {en:'tea', ru:'чай', kk:'шай', ex:'Green tea, please.', g:'thing'},
      {en:'coffee', ru:'кофе', kk:'кофе', ex:'I’d like some coffee.', g:'thing'},
      {en:'ice cream', ru:'мороженое', kk:'балмұздақ', ex:'I’d like some ice cream.', g:'thing'},
      {en:'soup', ru:'суп', kk:'сорпа', ex:'The soup is hot.', g:'thing'},
      {en:'salad', ru:'салат', kk:'салат', ex:'I’d like a salad.', g:'thing'},
      {en:'sandwich', ru:'сэндвич', kk:'сэндвич', ex:'A chicken sandwich, please.', g:'thing'},
      {en:'cake', ru:'торт', kk:'торт', ex:'A piece of cake, please.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'___ like some tea, please.', opts:['I’d', 'I’m', 'I'], a:0,
       why:'I’d — это короткое «I would», с него и начинается вежливая просьба.',
       whyKk:'I’d дегеніміз «I would» сөзінің қысқа түрі, сыпайы өтініш содан басталады.'},
      {t:'choice', q:'I’d like ___ coffee.', opts:['a', 'some', 'an'], a:1,
       why:'Кофе наливают, по штукам его не считают — поэтому «some».',
       whyKk:'Кофе құйылады, оны данамен санамайды — сондықтан «some».'},
      {t:'choice', q:'I’d like ___ chicken sandwich.', opts:['some', 'a', 'an'], a:1,
       why:'Сэндвич один, его можно посчитать, и слово начинается с согласного звука — «a».',
       whyKk:'Сэндвич біреу, оны санауға болады, әрі сөз дауыссыз дыбыстан басталады — «a».'},
      {t:'choice', q:'What ___ you like?', opts:['would', 'are', 'do'], a:0,
       why:'Официант вежливо спрашивает про заказ, а такой вопрос строится с «would».',
       whyKk:'Даяшы тапсырысты сыпайы сұрайды, ондай сұрақ «would» арқылы жасалады.'},
      {t:'order', ru:'Я бы хотел мороженое.', kk:'Менің балмұздақ алғым келеді.',
       words:['I’d', 'like', 'some', 'ice', 'cream'], a:'I’d like some ice cream'},
      {t:'order', ru:'Я бы хотел кусок торта.', kk:'Менің бір тілім торт алғым келеді.',
       words:['I’d', 'like', 'a', 'piece', 'of', 'cake'], a:'I’d like a piece of cake'},
    ]
  },

  b5: {
    title:'Plural, Singular', subtitle:'Один предмет и много', subtitleKk:'Бір зат және көп зат',
    rule:'Когда предметов больше одного, в конце слова появляется -s: an apple — three apples. После s, ch, sh, x пишем -es, буква y после согласной меняется на i и даёт -ies, а child, man, foot меняются целиком.',
    ruleKk:'Зат біреуден көп болса, сөздің соңына -s жалғанады: an apple — three apples. s, ch, sh, x әріптерінен кейін -es жазылады, дауыссыздан кейінгі y әрпі i-ге ауысып -ies болады, ал child, man, foot сөздері мүлдем басқаша өзгереді.',
    examples:[
      {en:'One apple, three apples.', ru:'Одно яблоко, три яблока.', kk:'Бір алма, үш алма.'},
      {en:'I read two books.', ru:'Я читаю две книги.', kk:'Мен екі кітап оқимын.'},
      {en:'Three buses stop here.', ru:'Здесь останавливаются три автобуса.', kk:'Мұнда үш автобус тоқтайды.'},
      {en:'My sister has three children.', ru:'У моей сестры трое детей.', kk:'Менің әпкемнің үш баласы бар.'},
    ],
    words:[
      {en:'apple', ru:'яблоко', kk:'алма', ex:'Three apples are on the table.', g:'thing'},
      {en:'book', ru:'книга', kk:'кітап', ex:'I read two books.', g:'thing'},
      {en:'car', ru:'машина', kk:'көлік', ex:'We see three cars.', g:'thing'},
      {en:'friend', ru:'друг', kk:'дос', ex:'My friend lives here.', g:'thing'},
      {en:'bus', ru:'автобус', kk:'автобус', ex:'Two buses stop here.', g:'thing'},
      {en:'city', ru:'город', kk:'қала', ex:'I know two big cities.', g:'thing'},
      {en:'child', ru:'ребёнок', kk:'бала', ex:'One child, two children.', g:'thing'},
      {en:'window', ru:'окно', kk:'терезе', ex:'The room has two windows.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'Three ___ are on the table.', opts:['apple', 'apples', 'an apple'], a:1,
       why:'Перед словом стоит число больше одного, значит нужна форма множественного числа.',
       whyKk:'Сөздің алдында біреуден үлкен сан тұр, сондықтан көпше түрі керек.'},
      {t:'choice', q:'Two ___ stop near the school.', opts:['bus', 'buss', 'buses'], a:2,
       why:'Слово кончается на s, после такого конца ставят -es, иначе его не выговорить.',
       whyKk:'Сөз s дыбысына бітеді, ондай сөзге -es жалғанады.'},
      {t:'choice', q:'I know two big ___.', opts:['citys', 'cities', 'city'], a:1,
       why:'Перед y стоит согласная, поэтому y меняется на i и получается -ies.',
       whyKk:'y әрпінің алдында дауыссыз тұр, сондықтан y әрпі i-ге ауысып, -ies болады.'},
      {t:'choice', q:'My sister has three ___.', opts:['childs', 'children', 'childrens'], a:1,
       why:'У слова child своя форма для многих, её просто запоминают и -s к ней не добавляют.',
       whyKk:'child сөзінің көпше түрі бөлек, оны жаттап аламыз да, үстіне -s жалғамаймыз.'},
      {t:'order', ru:'У меня много друзей.', kk:'Менің достарым көп.',
       words:['I', 'have', 'many', 'friends'], a:'I have many friends'},
      {t:'order', ru:'В комнате два окна.', kk:'Бөлмеде екі терезе бар.',
       words:['There', 'are', 'two', 'windows', 'in', 'the', 'room'], a:'There are two windows in the room'},
    ]
  },

  b6: {
    title:'Some, Any', subtitle:'Говорить о количестве', subtitleKk:'Мөлшер жайлы айту',
    rule:'Some говорим в утверждении, any — в отрицании и в вопросе: I have some books, I don’t have any money. Если предмет считают поштучно, рядом ставим many и a few, если не считают — much и a little.',
    ruleKk:'Хабарлы сөйлемде some, болымсыз сөйлем мен сұрақта any қолданамыз: I have some books, I don’t have any money. Зат данамен саналса — many, a few, саналмаса — much, a little.',
    examples:[
      {en:'I have some books.', ru:'У меня есть несколько книг.', kk:'Менде бірнеше кітап бар.'},
      {en:'I don’t have any money.', ru:'У меня нет денег.', kk:'Менде ақша жоқ.'},
      {en:'Do you have any questions?', ru:'У вас есть вопросы?', kk:'Сұрақтарыңыз бар ма?'},
      {en:'How many students are in your class?', ru:'Сколько учеников в твоём классе?', kk:'Сыныбыңда қанша оқушы бар?'},
    ],
    words:[
      {en:'some', ru:'несколько, немного', kk:'біраз, бірнеше', ex:'I have some books.', g:'word'},
      {en:'any', ru:'никакой, какой-нибудь', kk:'ешқандай, қандай да бір', ex:'I don’t have any money.', g:'word'},
      {en:'many', ru:'много (о счётном)', kk:'көп (саналатын зат)', ex:'I have many friends.', g:'word'},
      {en:'much', ru:'много (о несчётном)', kk:'көп (саналмайтын зат)', ex:'We don’t have much energy.', g:'word'},
      {en:'a few', ru:'несколько', kk:'бірнеше', ex:'I have a few questions.', g:'word'},
      {en:'a little', ru:'немного', kk:'азғана', ex:'I need a little sugar.', g:'word'},
      {en:'water', ru:'вода', kk:'су', ex:'I need some water.', g:'thing'},
      {en:'money', ru:'деньги', kk:'ақша', ex:'I don’t have any money.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'We need to buy ___ apples.', opts:['some', 'any', 'much'], a:0,
       why:'Обычное утверждение, здесь ставим some.',
       whyKk:'Жай хабарлы сөйлем, сондықтан some қойылады.'},
      {t:'choice', q:'Do you have ___ questions?', opts:['some', 'any', 'much'], a:1,
       why:'В вопросе вместо some ставят any.',
       whyKk:'Сұрақта some емес, any тұрады.'},
      {t:'choice', q:'How ___ students are in your class?', opts:['much', 'many', 'a little'], a:1,
       why:'Учеников можно посчитать, а для счётного идёт many.',
       whyKk:'Оқушыны санап шығуға болады, саналатын затқа many келеді.'},
      {t:'choice', q:'I have ___ free time today.', opts:['a few', 'a little', 'many'], a:1,
       why:'Время не считают по штукам, поэтому a little.',
       whyKk:'Уақыт данамен саналмайды, сол үшін a little.'},
      {t:'order', ru:'У меня есть несколько книг.', kk:'Менде бірнеше кітап бар.',
       words:['books', 'some', 'I', 'have'], a:'I have some books'},
      {t:'order', ru:'У меня нет денег.', kk:'Менде ақша жоқ.',
       words:['any', 'I', 'money', 'have', 'don’t'], a:'I don’t have any money'},
    ]
  },

  b7: {
    title:'Subject Pronouns', subtitle:'Описывать людей на фото', subtitleKk:'Суреттегі адамдарды сипаттау',
    rule:'Чтобы не повторять имя, ставим вместо него местоимение: he — про мужчину, she — про женщину, it — про предмет или погоду, they — про нескольких. Местоимение стоит в начале, перед действием.',
    ruleKk:'Атын қайталамау үшін оның орнына есімдік қоямыз: he — ер адам, she — әйел адам, it — зат пен ауа райы, they — бірнеше адам. Есімдік сөйлемнің басында, әрекеттің алдында тұрады.',
    examples:[
      {en:'He is grilling some barbecue.', ru:'Он жарит барбекю.', kk:'Ол барбекю пісіріп жатыр.'},
      {en:'She is reading a book.', ru:'Она читает книгу.', kk:'Ол кітап оқып отыр.'},
      {en:'It is a beautiful day.', ru:'Прекрасный день.', kk:'Керемет күн.'},
      {en:'They are sitting on the bench.', ru:'Они сидят на скамейке.', kk:'Олар орындықта отыр.'},
    ],
    words:[
      {en:'I', ru:'я', kk:'мен', ex:'I visit my friend.', g:'word'},
      {en:'he', ru:'он', kk:'ол (ер адам туралы)', ex:'He is grilling some barbecue.', g:'word'},
      {en:'she', ru:'она', kk:'ол (әйел адам туралы)', ex:'She is reading a book.', g:'word'},
      {en:'it', ru:'оно (о предмете, о погоде)', kk:'ол (зат, ауа райы туралы)', ex:'It is a beautiful day.', g:'word'},
      {en:'we', ru:'мы', kk:'біз', ex:'We drink tea together.', g:'word'},
      {en:'they', ru:'они', kk:'олар', ex:'They are sitting on the bench.', g:'word'},
      {en:'father', ru:'отец', kk:'әке', ex:'This is my father.', g:'thing'},
      {en:'mother', ru:'мама', kk:'ана', ex:'My mother is reading a book.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'This is my father. ___ is grilling some barbecue.', opts:['He', 'She', 'It'], a:0,
       why:'Отец — мужчина, о нём говорят he.',
       whyKk:'Әке — ер адам, ол туралы he дейді.'},
      {t:'choice', q:'That is my mother. ___ is reading a book.', opts:['He', 'She', 'They'], a:1,
       why:'О женщине говорят she.',
       whyKk:'Әйел адам туралы she дейді.'},
      {t:'choice', q:'The sun is shining. ___ is a beautiful day.', opts:['He', 'It', 'They'], a:1,
       why:'По-казахски и о человеке, и о погоде говорят «ол», а по-английски о погоде и предметах — it.',
       whyKk:'Қазақша адам да, ауа райы да «ол», ал ағылшынша ауа райы мен зат — it.'},
      {t:'choice', q:'My grandparents are on the bench. ___ are talking.', opts:['He', 'We', 'They'], a:2,
       why:'Людей несколько, поэтому they, и рядом стоит are.',
       whyKk:'Адам бірнешеу, сондықтан they, қасында are тұрады.'},
      {t:'order', ru:'Она читает книгу.', kk:'Ол кітап оқып отыр.',
       words:['She', 'is', 'reading', 'a', 'book'], a:'She is reading a book'},
      {t:'order', ru:'Они сидят на скамейке.', kk:'Олар орындықта отыр.',
       words:['They', 'are', 'sitting', 'on', 'the', 'bench'], a:'They are sitting on the bench'},
    ]
  },

  b8: {
    title:'Object Pronouns', subtitle:'Сказать «меня» и «его»', subtitleKk:'«Мені», «оны» деп айту',
    rule:'Перед глаголом стоят I, he, she, we, they — это мы уже знаем. Но если местоимение стоит после глагола, оно меняет форму: I → me, he → him, she → her, we → us, they → them. You и it остаются такими же.',
    ruleKk:'Етістіктің алдында I, he, she, we, they тұрады — оны біз білеміз. Ал есімдік етістіктен кейін тұрса, түрі өзгереді: I → me, he → him, she → her, we → us, they → them. You мен it өзгермейді.',
    examples:[
      {en:'I know her very well.', ru:'Я её хорошо знаю.', kk:'Мен оны жақсы білемін.'},
      {en:'She loves it very much.', ru:'Она очень его любит.', kk:'Ол оны қатты жақсы көреді.'},
      {en:'Anna often calls him.', ru:'Анна часто ему звонит.', kk:'Анна оған жиі қоңырау шалады.'},
      {en:'He plays with them.', ru:'Он играет с ними.', kk:'Ол олармен ойнайды.'},
    ],
    words:[
      {en:'me', ru:'меня, мне', kk:'мені, маған', ex:'They wave to me.', g:'word'},
      {en:'you', ru:'тебя, тебе', kk:'сені, саған', ex:'I can see you.', g:'word'},
      {en:'him', ru:'его, ему (о мужчине)', kk:'оны, оған (ер адам туралы)', ex:'Anna often calls him.', g:'word'},
      {en:'her', ru:'её, ей (о женщине)', kk:'оны, оған (әйел адам туралы)', ex:'I know her very well.', g:'word'},
      {en:'it', ru:'его, её (о предмете или животном)', kk:'оны (зат не жануар туралы)', ex:'She loves it very much.', g:'word'},
      {en:'us', ru:'нас, нам', kk:'бізді, бізге', ex:'She gives a task to us.', g:'word'},
      {en:'them', ru:'их, им', kk:'оларды, оларға', ex:'He plays with them.', g:'word'},
      {en:'give', ru:'дать, давать', kk:'беру', ex:'Can you give us some water?', g:'act'},
    ],
    tasks:[
      {t:'choice', q:'I like these shoes. I want to buy ___.', opts:['them', 'they', 'their'], a:0,
       why:'После глагола buy ставим форму them, а не they.',
       whyKk:'Buy етістігінен кейін they емес, them тұрады.'},
      {t:'choice', q:'Anna has a cute dog. She loves ___ very much.', opts:['he', 'it', 'its'], a:1,
       why:'О животном говорят it, и эта форма не меняется.',
       whyKk:'Жануар туралы it дейді, оның түрі өзгермейді.'},
      {t:'choice', q:'Your brother is calling. Please answer ___.', opts:['his', 'he', 'him'], a:2,
       why:'Отвечают брату, а после глагола he превращается в him.',
       whyKk:'Ағаға жауап береміз, ал етістіктен кейін he — him болады.'},
      {t:'choice', q:'We are thirsty. Can you give ___ some water?', opts:['our', 'us', 'we'], a:1,
       why:'Воду дают нам, а на месте того, кому дают, стоит us.',
       whyKk:'Суды бізге береді, ал кімге беретінін білдіретін орында us тұрады.'},
      {t:'order', ru:'Они машут мне.', kk:'Олар маған қол бұлғайды.',
       words:['They', 'wave', 'to', 'me'], a:'They wave to me'},
      {t:'order', ru:'Она даёт нам задание.', kk:'Ол бізге тапсырма береді.',
       words:['She', 'gives', 'a', 'task', 'to', 'us'], a:'She gives a task to us'},
    ]
  },

  b9: {
    title:'Adjectives', subtitle:'Сравнивать две вещи', subtitleKk:'Екі затты салыстыру',
    rule:'Когда сравниваешь два предмета, к короткому слову добавляй -er: cheap — cheaper, big — bigger. Перед длинным словом ставь more: more expensive. Второй предмет идёт после than.',
    ruleKk:'Екі затты салыстырғанда қысқа сөзге -er жалғанады: cheap — cheaper, big — bigger. Ұзын сөздің алдына more қойылады: more expensive. Салыстырылатын екінші зат than-нан кейін тұрады.',
    examples:[
      {en:'The café is cheaper than the cinema.', ru:'Кафе дешевле кино.', kk:'Кафе кинотеатрдан арзанырақ.'},
      {en:'Model A is more expensive than model B.', ru:'Модель A дороже модели B.', kk:'A моделі B моделінен қымбатырақ.'},
      {en:'This phone is thinner and lighter.', ru:'Этот телефон тоньше и легче.', kk:'Бұл телефон жұқалау әрі жеңілірек.'},
      {en:'My English is getting better.', ru:'Мой английский становится лучше.', kk:'Менің ағылшыным жақсарып келеді.'},
    ],
    words:[
      {en:'cheaper', ru:'дешевле', kk:'арзанырақ', ex:'The café is cheaper.', g:'sign'},
      {en:'more expensive', ru:'дороже', kk:'қымбатырақ', ex:'This laptop is more expensive.', g:'sign'},
      {en:'better', ru:'лучше', kk:'жақсырақ', ex:'My English is getting better.', g:'sign'},
      {en:'bigger', ru:'больше', kk:'үлкенірек', ex:'The screen on model B is bigger.', g:'sign'},
      {en:'lighter', ru:'легче по весу', kk:'жеңілірек', ex:'This phone is thinner and lighter.', g:'sign'},
      {en:'closer', ru:'ближе', kk:'жақынырақ', ex:'The new café is closer.', g:'sign'},
      {en:'longer', ru:'дольше', kk:'ұзағырақ', ex:'The battery life is longer.', g:'sign'},
      {en:'than', ru:'чем', kk:'қарағанда', ex:'Model A is cheaper than model B.', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'This café is ___ than the cinema.', opts:['cheap', 'cheaper', 'more cheap'], a:1,
       why:'Cheap — короткое слово, при сравнении к нему добавляют -er.',
       whyKk:'Cheap — қысқа сөз, салыстырғанда оған -er жалғанады.'},
      {t:'choice', q:'Model B is ___ than model A.', opts:['expensive', 'more expensive', 'expensiver'], a:1,
       why:'Expensive — длинное слово, перед ним ставят more.',
       whyKk:'Expensive — ұзын сөз, оның алдына more қойылады.'},
      {t:'choice', q:'This summer is hotter ___ last year.', opts:['than', 'then', 'from'], a:0,
       why:'Второй предмет сравнения вводят словом than.',
       whyKk:'Салыстырылатын екінші зат than арқылы қосылады.'},
      {t:'choice', q:'My English is getting ___.', opts:['gooder', 'better', 'more good'], a:1,
       why:'У good нет формы с -er, вместо неё стоит better.',
       whyKk:'Good сөзінің -er түрі жоқ, оның орнына better тұрады.'},
      {t:'order', ru:'Кафе ближе к моему дому.', kk:'Кафе менің үйіме жақынырақ.',
       words:['The', 'café', 'is', 'closer', 'to', 'my', 'house'], a:'The café is closer to my house'},
      {t:'order', ru:'Новый телефон легче моего старого.', kk:'Жаңа телефон менің ескісінен жеңілірек.',
       words:['The', 'new', 'phone', 'is', 'lighter', 'than', 'my', 'old', 'one'], a:'The new phone is lighter than my old one'},
    ]
  },

  b10: {
    title:'Superlative', subtitle:'Говорить «самый…»', subtitleKk:'«Ең…» деп айту',
    rule:'Здесь мы уже не сравниваем двоих, а выделяем одного из всех. Перед словом ставим the: короткое слово берёт -est (the tallest, the cheapest), а длинному нужен the most (the most comfortable).',
    ruleKk:'Мұнда біз екеуін салыстырмаймыз, бәрінің ішінен біреуін бөліп айтамыз. Сөздің алдына the қоямыз: қысқа сөз -est жалғауын алады (the tallest, the cheapest), ұзын сөзге the most керек (the most comfortable).',
    examples:[
      {en:'Ali is the tallest student in our class.', ru:'Али — самый высокий ученик в нашем классе.', kk:'Әли — сыныбымыздағы ең ұзын бойлы оқушы.'},
      {en:'But that one is the most comfortable.', ru:'А вот та пара самая удобная.', kk:'Ал анау тұрғаны ең ыңғайлысы.'},
      {en:'Paris is one of the most beautiful cities.', ru:'Париж — один из самых красивых городов.', kk:'Париж — ең әдемі қалалардың бірі.'},
      {en:'This is the best day of my life.', ru:'Это лучший день в моей жизни.', kk:'Бұл — өмірімдегі ең жақсы күн.'},
    ],
    words:[
      {en:'tallest', ru:'самый высокий (о человеке)', kk:'ең ұзын бойлы', ex:'Ali is the tallest student.', g:'sign'},
      {en:'kindest', ru:'самый добрый', kk:'ең мейірімді', ex:'Maria is the kindest person here.', g:'sign'},
      {en:'talkative', ru:'разговорчивый', kk:'көп сөйлейтін', ex:'My friend Sara is the most talkative.', g:'sign'},
      {en:'cheapest', ru:'самый дешёвый', kk:'ең арзан', ex:'This pair is the cheapest.', g:'sign'},
      {en:'comfortable', ru:'удобный', kk:'ыңғайлы', ex:'That one is the most comfortable.', g:'sign'},
      {en:'funniest', ru:'самый смешной', kk:'ең күлкілі', ex:'My teacher is the funniest person.', g:'sign'},
      {en:'best', ru:'самый лучший', kk:'ең жақсы', ex:'This is the best day.', g:'sign'},
      {en:'delicious', ru:'вкусный', kk:'дәмді', ex:'Pizza is the most delicious food.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'Ali is the ___ student in our class.', opts:['tall', 'taller', 'tallest'], a:2,
       why:'Он выше всех в классе, а не выше одного человека.',
       whyKk:'Ол бір адамнан емес, сыныптағы бәрінен ұзын.'},
      {t:'choice', q:'My English teacher is the ___ person.', opts:['funny', 'funnier', 'funniest'], a:2,
       why:'После the нужна форма «самый», иначе получится просто «смешной».',
       whyKk:'The-дан кейін «ең» мағынасындағы түрі керек, әйтпесе жай «күлкілі» болып қалады.'},
      {t:'choice', q:'But that one is the ___ comfortable.', opts:['most', 'more', 'much'], a:0,
       why:'Слово comfortable длинное, к таким словам -est не добавляют.',
       whyKk:'Comfortable сөзі ұзын, ондай сөздерге -est жалғанбайды.'},
      {t:'choice', q:'Paris is ___ the most beautiful cities.', opts:['one of', 'one', 'the one'], a:0,
       why:'Красивых городов много, Париж — один из них, поэтому one of.',
       whyKk:'Әдемі қала көп, Париж соның бірі, сондықтан one of керек.'},
      {t:'order', ru:'Мария здесь самая добрая.', kk:'Мұндағы ең мейірімді адам — Мария.',
       words:['Maria', 'is', 'the', 'kindest', 'person', 'here'], a:'Maria is the kindest person here'},
      {t:'order', ru:'Пицца для меня самая вкусная еда.', kk:'Мен үшін пицца — ең дәмді тамақ.',
       words:['Pizza', 'is', 'the', 'most', 'delicious', 'food', 'for', 'me'], a:'Pizza is the most delicious food for me'},
    ]
  },

  b11: {
    title:'My House', subtitle:'Описать комнаты дома', subtitleKk:'Үй бөлмелерін сипаттау',
    rule:'Когда говорим, что есть в комнате, начинаем с «There is» про один предмет и «There are» про несколько. А какая сама комната — говорим прямо: The kitchen is sunny and bright.',
    ruleKk:'Бөлмеде не бар екенін айтқанда бір зат болса «There is», бірнешеу болса «There are» деп бастаймыз. Бөлменің өзі қандай екенін тура айтамыз: The kitchen is sunny and bright.',
    examples:[
      {en:'There is a big sofa, a TV and a piano.', ru:'Здесь большой диван, телевизор и пианино.', kk:'Мұнда үлкен диван, теледидар және фортепиано бар.'},
      {en:'There are many books in my bedroom.', ru:'В моей спальне много книг.', kk:'Менің жатын бөлмемде кітап көп.'},
      {en:'The kitchen is sunny and bright.', ru:'Кухня солнечная и светлая.', kk:'Ас үй күнгей әрі жарық.'},
      {en:'I like to walk in the garden in the morning.', ru:'Утром я люблю гулять в саду.', kk:'Таңертең бақта серуендегенді ұнатамын.'},
    ],
    words:[
      {en:'living room', ru:'гостиная', kk:'қонақ бөлме', ex:'There is a TV in the living room.', g:'thing'},
      {en:'kitchen', ru:'кухня', kk:'ас үй', ex:'There is a fridge in the kitchen.', g:'thing'},
      {en:'bedroom', ru:'спальня', kk:'жатын бөлме', ex:'My bedroom is quiet.', g:'thing'},
      {en:'bathroom', ru:'ванная', kk:'жуынатын бөлме', ex:'The bathroom is clean.', g:'thing'},
      {en:'garden', ru:'сад', kk:'бақ', ex:'We play football in the garden.', g:'thing'},
      {en:'sofa', ru:'диван', kk:'диван', ex:'Your sofa is big and comfortable.', g:'thing'},
      {en:'comfortable', ru:'удобный', kk:'жайлы', ex:'This chair is very comfortable.', g:'sign'},
      {en:'quiet', ru:'тихий', kk:'тыныш', ex:'My room is quiet in the evening.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'Mom cooks breakfast in the ___.', opts:['kitchen', 'bedroom', 'garden'], a:0,
       why:'Еду готовят там, где плита и посуда.',
       whyKk:'Тамақты плита мен ыдыс тұрған бөлмеде пісіреді.'},
      {t:'choice', q:'Your sofa is so big and ___.', opts:['comfortable', 'sunny', 'loud'], a:0,
       why:'Про диван говорят, каково на нём сидеть.',
       whyKk:'Диван туралы айтқанда оның отыруға қандай екенін айтады.'},
      {t:'choice', q:'___ a big mirror in the bathroom.', opts:['There is', 'There are', 'They are'], a:0,
       why:'Зеркало одно, поэтому нужна форма единственного числа.',
       whyKk:'Айна біреу, сондықтан жекеше түрі керек.'},
      {t:'choice', q:'There ___ many chairs in the kitchen.', opts:['is', 'are', 'be'], a:1,
       why:'Стульев несколько, а для множественного числа берём «are».',
       whyKk:'Орындық бірнешеу, көпше түрде «are» алынады.'},
      {t:'order', ru:'В спальне есть стол и много книг.', kk:'Жатын бөлмеде үстел және көп кітап бар.',
       words:['There', 'is', 'a', 'desk', 'and', 'many', 'books'], a:'There is a desk and many books'},
      {t:'order', ru:'Спальня тихая, и там я могу заниматься.', kk:'Жатын бөлме тыныш, сонда мен сабақ оқи аламын.',
       words:['The', 'bedroom', 'is', 'quiet', 'and', 'I', 'can', 'study', 'there'], a:'The bedroom is quiet and I can study there'},
    ]
  },

  b12: {
    title:'Wh- Questions', subtitle:'Задавать вопросы с wh', subtitleKk:'Wh-сөздермен сұрақ қою',
    rule:'Вопрос начинается с вопросительного слова: what, when, where, who, why, how. Сразу за ним идёт остальная часть вопроса: When will we go on holiday?',
    ruleKk:'Сұрақ сұрау сөзінен басталады: what, when, where, who, why, how. Одан кейін сұрақтың қалған бөлігі тұрады: When will we go on holiday?',
    examples:[
      {en:'What’s the weather like today?', ru:'Какая сегодня погода?', kk:'Бүгін ауа райы қандай?'},
      {en:'When will the weather be sunny?', ru:'Когда будет солнечно?', kk:'Ауа райы қашан ашық болады?'},
      {en:'Where are we going on holiday this summer?', ru:'Куда мы поедем отдыхать этим летом?', kk:'Биыл жазда демалысқа қайда барамыз?'},
      {en:'How often do we go camping?', ru:'Как часто мы ездим в поход?', kk:'Біз қаншалықты жиі жорыққа шығамыз?'},
    ],
    words:[
      {en:'what', ru:'что, какой', kk:'не, қандай', ex:'What is the weather like?', g:'word'},
      {en:'when', ru:'когда', kk:'қашан', ex:'When will we go on holiday?', g:'word'},
      {en:'where', ru:'где, куда', kk:'қайда', ex:'Where are we going this summer?', g:'word'},
      {en:'who', ru:'кто', kk:'кім', ex:'Who will travel with us?', g:'word'},
      {en:'why', ru:'почему', kk:'неге', ex:'Why do we love holidays?', g:'word'},
      {en:'how long', ru:'как долго', kk:'қанша уақыт', ex:'How long will we stay here?', g:'word'},
      {en:'weather', ru:'погода', kk:'ауа райы', ex:'The weather is sunny today.', g:'thing'},
      {en:'holiday', ru:'отдых, каникулы', kk:'демалыс', ex:'We go on holiday in summer.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'___ is the weather like today?', opts:['What', 'Where', 'Who'], a:0,
       why:'Мы спрашиваем про саму погоду — солнце, дождь, ветер.',
       whyKk:'Ауа райының өзін сұраймыз — күн, жаңбыр, жел.'},
      {t:'choice', q:'___ will we go on holiday?', opts:['Why', 'When', 'Who'], a:1,
       why:'Речь о времени поездки, а не о причине.',
       whyKk:'Сапардың себебі емес, уақыты туралы айтылып тұр.'},
      {t:'choice', q:'___ will travel with us?', opts:['What', 'Where', 'Who'], a:2,
       why:'Спрашиваем про людей, а про людей говорят who.',
       whyKk:'Адам туралы сұраймыз, адамға who қолданылады.'},
      {t:'choice', q:'___ will we stay in the hotel?', opts:['How often', 'How long', 'Why'], a:1,
       why:'Нужен срок — сколько дней, а не сколько раз.',
       whyKk:'Мерзімі керек — қанша күн, қанша рет емес.'},
      {t:'order', ru:'Куда мы едем на отдых?', kk:'Біз демалысқа қайда барамыз?',
       words:['Where', 'are', 'we', 'going', 'on', 'holiday'], a:'Where are we going on holiday'},
      {t:'order', ru:'Как часто мы ездим в поход?', kk:'Біз қаншалықты жиі жорыққа шығамыз?',
       words:['How', 'often', 'do', 'we', 'go', 'camping'], a:'How often do we go camping'},
    ]
  },

  b13: {
    title:'My Family', subtitle:'Семья и друзья', subtitleKk:'Отбасы мен достар',
    rule:'Про одного человека говорим this is, про двоих и больше — these are. Это начало предложения, дальше идёт сам человек: this is my uncle, these are my classmates.',
    ruleKk:'Бір адам туралы this is, екі не одан көп адам туралы these are деп айтамыз. Осы сөздер сөйлемнің басында тұрады, олардан кейін адамның өзі аталады.',
    examples:[
      {en:'This is my cousin. We always play together.', ru:'Это мой двоюродный брат. Мы всегда играем вместе.', kk:'Бұл — менің немере ағам. Біз үнемі бірге ойнаймыз.'},
      {en:'These are my grandparents. They live in a village.', ru:'Это мои бабушка и дедушка. Они живут в ауле.', kk:'Бұл — менің атам мен әжем. Олар ауылда тұрады.'},
      {en:'This is my best friend. She helps me with my homework.', ru:'Это моя лучшая подруга. Она помогает мне с домашним заданием.', kk:'Бұл — менің ең жақын құрбым. Ол маған үй тапсырмасын орындауға көмектеседі.'},
      {en:'These are my team-mates. We play football in the same team.', ru:'Это мои товарищи по команде. Мы играем в футбол в одной команде.', kk:'Бұл — менің командаластарым. Біз бір командада футбол ойнаймыз.'},
    ],
    words:[
      {en:'cousin', ru:'двоюродный брат, двоюродная сестра', kk:'немере туыс', ex:'My cousin and I play together.', g:'thing'},
      {en:'grandparents', ru:'бабушка и дедушка', kk:'ата-әже', ex:'My grandparents live in a village.', g:'thing'},
      {en:'uncle', ru:'дядя', kk:'нағашы', ex:'My uncle is very kind.', g:'thing'},
      {en:'aunt', ru:'тётя', kk:'тәте', ex:'This is my aunt.', g:'thing'},
      {en:'best friend', ru:'лучший друг', kk:'ең жақын дос', ex:'My best friend helps me.', g:'thing'},
      {en:'classmate', ru:'одноклассник', kk:'сыныптас', ex:'My classmate sits next to me.', g:'thing'},
      {en:'team-mate', ru:'товарищ по команде', kk:'командалас', ex:'These are my team-mates.', g:'thing'},
      {en:'online friend', ru:'друг из интернета', kk:'интернеттегі дос', ex:'My online friend is from Turkey.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'This ___ my best friend.', opts:['is', 'are', 'am'], a:0,
       why:'Человек один, поэтому после this идёт is.',
       whyKk:'Адам біреу, сондықтан this-тен кейін is тұрады.'},
      {t:'choice', q:'___ are my grandparents.', opts:['This', 'These', 'It'], a:1,
       why:'Людей двое, а про двоих и больше говорим these.',
       whyKk:'Адам екеу, ал екі не одан көп адам туралы these деп айтамыз.'},
      {t:'choice', q:'This is my ___. He is my mother’s brother.', opts:['uncle', 'aunt', 'cousin'], a:0,
       why:'Брата мамы называют дядей.',
       whyKk:'Ананың ағасын нағашы дейді.'},
      {t:'choice', q:'These are my ___. We play in the same football team.', opts:['classmates', 'team-mates', 'grandparents'], a:1,
       why:'Речь про одну команду, а не про школу или семью.',
       whyKk:'Әңгіме бір команда туралы, мектеп не отбасы туралы емес.'},
      {t:'order', ru:'Это мой двоюродный брат.', kk:'Бұл — менің немере ағам.',
       words:['This', 'is', 'my', 'cousin'], a:'This is my cousin'},
      {t:'order', ru:'Это мои одноклассники.', kk:'Бұл — менің сыныптастарым.',
       words:['These', 'are', 'my', 'classmates'], a:'These are my classmates'},
    ]
  },

  b14: {
    title:'How Much', subtitle:'Спрашивать «сколько?»', subtitleKk:'«Қанша?» деп сұрау',
    rule:'Milk, water, sugar по штукам не считают — про них спрашиваем how much. Apples, chairs, books, students пересчитать можно — про них how many. Оба стоят в самом начале вопроса.',
    ruleKk:'Milk, water, sugar данамен саналмайды — олар туралы how much деп сұраймыз. Apples, chairs, books, students санауға келеді — олар туралы how many. Екеуі де сұрақтың ең басында тұрады.',
    examples:[
      {en:'How much milk do we need?', ru:'Сколько молока нам нужно?', kk:'Бізге қанша сүт керек?'},
      {en:'How many apples should I buy?', ru:'Сколько яблок мне купить?', kk:'Маған қанша алма алу керек?'},
      {en:'How much homework do we have today?', ru:'Сколько у нас сегодня домашнего задания?', kk:'Бүгін қанша үй тапсырмасы бар?'},
      {en:'How many students are absent today?', ru:'Сколько учеников сегодня нет?', kk:'Бүгін қанша оқушы жоқ?'},
    ],
    words:[
      {en:'how much', ru:'сколько (то, что не считают по штукам)', kk:'қанша (данамен саналмайтын зат)', ex:'How much milk do we need?', g:'word'},
      {en:'how many', ru:'сколько (штук)', kk:'қанша (дана)', ex:'How many apples should I buy?', g:'word'},
      {en:'milk', ru:'молоко', kk:'сүт', ex:'We need one liter of milk.', g:'thing'},
      {en:'water', ru:'вода', kk:'су', ex:'How much water is in the glass?', g:'thing'},
      {en:'sugar', ru:'сахар', kk:'қант', ex:'How much sugar is in the tea?', g:'thing'},
      {en:'homework', ru:'домашнее задание', kk:'үй тапсырмасы', ex:'We have only two exercises.', g:'thing'},
      {en:'apple', ru:'яблоко', kk:'алма', ex:'I want to buy six apples.', g:'thing'},
      {en:'absent', ru:'отсутствует, нет на месте', kk:'жоқ, келмеген', ex:'Two students are absent today.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'___ water is in the glass?', opts:['How much', 'How many', 'How old'], a:0,
       why:'Воду не считают по штукам, у неё нет множественного числа.',
       whyKk:'Суды данамен санамайды, оның көпше түрі жоқ.'},
      {t:'choice', q:'___ apples should I buy?', opts:['How much', 'How many', 'How long'], a:1,
       why:'Яблоки можно пересчитать: одно, два, шесть.',
       whyKk:'Алманы санап шығуға болады: бір, екі, алты.'},
      {t:'choice', q:'___ money do you need?', opts:['How many', 'How much', 'How often'], a:1,
       why:'Деньги в английском считают не штуками, а суммой.',
       whyKk:'Ағылшынша ақшаны данамен емес, сомамен санайды.'},
      {t:'choice', q:'How many ___ are absent today?', opts:['student', 'students', 'a student'], a:1,
       why:'После how many предмет всегда стоит во множественном числе.',
       whyKk:'How many-дан кейін зат әрқашан көпше түрде тұрады.'},
      {t:'order', ru:'Сколько молока нам нужно?', kk:'Бізге қанша сүт керек?',
       words:['How', 'much', 'milk', 'do', 'we', 'need'], a:'How much milk do we need'},
      {t:'order', ru:'Сколько там шариков?', kk:'Онда қанша шар бар?',
       words:['How', 'many', 'balloons', 'are', 'there'], a:'How many balloons are there'},
    ]
  },

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

  /* Intermediate · Senior. Разбор, слова и задания сняты с самих роликов:
     слайды урока плюс речь преподавателя. Ролик здесь один, теория. */
  i1: {
    title:'Past Perfect', subtitle:'Что случилось ещё раньше', subtitleKk:'Одан да бұрын не болды',
    rule:'Рассказываешь о прошлом и надо вернуться к тому, что случилось ещё раньше, — бери had + третью форму глагола: had finished, had eaten. Раннее действие стоит в Past Perfect, позднее — в Past Simple: When I got home, my dog had eaten my shoes.',
    ruleKk:'Өткен оқиғаны айтып отырып, одан да ертерек болған нәрсеге оралу керек болса, had + етістіктің үшінші формасын аламыз: had finished, had eaten. Ертерек болған әрекет Past Perfect-те, кейінгісі Past Simple-да тұрады: When I got home, my dog had eaten my shoes.',
    examples:[
      {en:'When I got home, my dog had eaten my shoes.', ru:'Когда я пришёл домой, собака уже съела мои туфли.', kk:'Үйге келсем, итім аяқ киімімді жеп қойыпты.'},
      {en:'After she had saved enough money, she bought a car.', ru:'Когда она накопила достаточно денег, она купила машину.', kk:'Жеткілікті ақша жинағаннан кейін ол көлік сатып алды.'},
      {en:'By the time we arrived, the film had started.', ru:'Когда мы пришли, фильм уже начался.', kk:'Біз келгенше фильм басталып кеткен еді.'},
      {en:'She felt tired because she had worked all night.', ru:'Она устала, потому что работала всю ночь.', kk:'Ол түні бойы жұмыс істегендіктен шаршады.'},
    ],
    words:[
      {en:'realize', ru:'понять, осознать', kk:'түсіну, аңғару', ex:'When I got home, I realized that my dog had eaten my shoes.', g:'act'},
      {en:'save', ru:'копить (деньги)', kk:'(ақша) жинау', ex:'She had saved enough money for a car.', g:'act'},
      {en:'enough', ru:'достаточно', kk:'жеткілікті', ex:'After she had saved enough money, she bought a car.', g:'word'},
      {en:'arrive', ru:'приехать, прийти', kk:'келу, жету', ex:'The film had started before we arrived.', g:'act'},
      {en:'by the time', ru:'к тому времени, как', kk:'…ған кезде, …ғанша', ex:'By the time we arrived, the film had started.', g:'word'},
      {en:'exhausted', ru:'вымотанный', kk:'әбден шаршаған', ex:'He was exhausted because he hadn’t slept well.', g:'sign'},
      {en:'prepare', ru:'готовить', kk:'дайындау', ex:'When I came home, my family had prepared dinner.', g:'act'},
      {en:'finish', ru:'закончить', kk:'бітіру, аяқтау', ex:'I had finished my work before the meeting.', g:'act'},
    ],
    tasks:[
      {t:'choice', q:'When I got home, my dog ___ my shoes.', opts:['had eaten', 'has eaten', 'eats'], a:0,
       why:'Собака съела туфли раньше, чем я пришёл. Более раннее действие в прошлом — had + третья форма.',
       whyKk:'Ит аяқ киімді мен келмей тұрып жеп қойған. Өткендегі ертерек әрекет — had + үшінші форма.'},
      {t:'choice', q:'By the time we arrived, the film ___ started.', opts:['has', 'was', 'had'], a:2,
       why:'Фильм начался раньше нашего прихода, и вся история уже в прошлом — значит had.',
       whyKk:'Фильм біз келмей тұрып басталған, оқиғаның бәрі өткенде — сондықтан had.'},
      {t:'choice', q:'He was exhausted because he ___ well.', opts:['hasn’t slept', 'doesn’t sleep', 'hadn’t slept'], a:2,
       why:'Плохо спал он раньше, чем почувствовал усталость. Отрицание в Past Perfect — hadn’t + третья форма.',
       whyKk:'Ол алдымен нашар ұйықтады, кейін шаршады. Past Perfect-тің болымсыз түрі — hadn’t + үшінші форма.'},
      {t:'choice', q:'The theater lights went up because the movie ___.', opts:['has finished', 'finishes', 'had finished'], a:2,
       why:'Сначала кончился фильм, потом зажёгся свет. Причина случилась раньше — had finished.',
       whyKk:'Алдымен фильм бітті, содан кейін жарық жанды. Себеп ертерек болған — had finished.'},
      {t:'order', ru:'Когда я пришёл домой, семья уже приготовила ужин.', kk:'Мен үйге келгенде, отбасым кешкі асты дайындап қойған еді.',
       words:['When', 'I', 'came', 'home,', 'my', 'family', 'had', 'prepared', 'dinner'], a:'When I came home, my family had prepared dinner'},
      {t:'order', ru:'Ты к тому времени закончил работу?', kk:'Сол уақытқа дейін жұмысыңды бітіріп қойған ба едің?',
       words:['Had', 'you', 'finished', 'your', 'work'], a:'Had you finished your work'},
    ]
  },

  i2: {
    title:'Past Perfect Continuous', subtitle:'Сколько длилось до момента в прошлом', subtitleKk:'Өткендегі бір сәтке дейін қанша созылды',
    rule:'Формула: had been + глагол с -ing. Так говорят о действии, которое шло какое-то время до момента в прошлом: I had been reading for two hours before he arrived. Часто оно объясняет то, что было после: She was tired because she had been working all day.',
    ruleKk:'Формуласы: had been + -ing жалғанған етістік. Өткендегі бір сәтке дейін біраз уақыт созылған әрекетті осылай айтамыз: I had been reading for two hours before he arrived. Көбіне ол кейінгі жағдайдың себебін түсіндіреді: She was tired because she had been working all day.',
    examples:[
      {en:'I had been reading for two hours before he arrived.', ru:'Когда он пришёл, я читал уже два часа.', kk:'Ол келгенше мен екі сағат бойы кітап оқып отырдым.'},
      {en:'She was tired because she had been working all day.', ru:'Она устала, потому что весь день работала.', kk:'Ол күні бойы жұмыс істегендіктен шаршап қалды.'},
      {en:'They had been playing football, so they were dirty.', ru:'Они играли в футбол, поэтому были грязные.', kk:'Олар футбол ойнаған, сондықтан үсті-бастары кір болды.'},
      {en:'She had been living in London since 2015.', ru:'Она жила в Лондоне с 2015 года.', kk:'Ол 2015 жылдан бері Лондонда тұрып келген еді.'},
    ],
    words:[
      {en:'dirty', ru:'грязный', kk:'кір', ex:'They had been playing football, so they were dirty.', g:'sign'},
      {en:'hungry', ru:'голодный', kk:'аш', ex:'They were hungry because they had been running.', g:'sign'},
      {en:'wait', ru:'ждать', kk:'күту', ex:'We had been waiting for an hour when the bus came.', g:'act'},
      {en:'run', ru:'бегать', kk:'жүгіру', ex:'They had been running, so they were hungry.', g:'act'},
      {en:'all day', ru:'весь день', kk:'күні бойы', ex:'She had been working all day.', g:'time'},
      {en:'since', ru:'с (какого-то момента)', kk:'…бері', ex:'She had been living in London since 2015.', g:'word'},
      {en:'until', ru:'до (какого-то момента)', kk:'…дейін', ex:'I had been studying until midnight.', g:'word'},
      {en:'letter', ru:'письмо', kk:'хат', ex:'She had been writing letters before lunch.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'I ___ for two hours before he arrived.', opts:['have been reading', 'am reading', 'had been reading'], a:2,
       why:'Чтение шло до момента в прошлом — до его прихода. Это had been + -ing.',
       whyKk:'Оқу өткендегі бір сәтке дейін, ол келгенге дейін созылды. Бұл — had been + -ing.'},
      {t:'choice', q:'They were dirty because they had been ___ football.', opts:['playing', 'play', 'played'], a:0,
       why:'После had been глагол всегда с -ing.',
       whyKk:'had been-нен кейін етістікке әрқашан -ing жалғанады.'},
      {t:'choice', q:'She ___ letters all morning, so her hand hurt.', opts:['had written', 'had been writing', 'has been writing'], a:1,
       why:'All morning говорит, сколько это длилось, а не сколько писем готово. Длительность до момента в прошлом — had been writing.',
       whyKk:'All morning әрекеттің қанша созылғанын айтады, дайын хаттың санын емес. Өткендегі сәтке дейінгі ұзақтық — had been writing.'},
      {t:'choice', q:'She had been living in London ___ 2015.', opts:['for', 'during', 'since'], a:2,
       why:'Since ставят перед точкой отсчёта: годом, датой. For — перед отрезком: for three hours.',
       whyKk:'Since басталған уақыттың алдына қойылады: жыл, күн. For уақыт аралығының алдында тұрады: for three hours.'},
      {t:'order', ru:'Они были голодные, потому что бегали.', kk:'Олар жүгіргендіктен қарындары ашып қалды.',
       words:['They', 'were', 'hungry', 'because', 'they', 'had', 'been', 'running'], a:'They were hungry because they had been running'},
      {t:'order', ru:'Ты долго ждал?', kk:'Сен ұзақ күттің бе?',
       words:['Had', 'you', 'been', 'waiting', 'long'], a:'Had you been waiting long'},
    ]
  },

  i3: {
    title:'Present Perfect Continuous', subtitle:'Началось раньше и идёт до сих пор', subtitleKk:'Бұрын басталып, әлі жалғасып жатыр',
    rule:'have/has been + глагол с -ing — для действия, которое началось в прошлом и идёт до сих пор: I have been studying English for three years. Время показывают for (сколько) и since (с какого момента), а спрашивают How long have you been…? Если дело только что кончилось, а след виден сейчас, — тоже он: She is tired because she has been working all day.',
    ruleKk:'have/has been + -ing жалғанған етістік — бұрын басталып, әлі жалғасып жатқан әрекет үшін: I have been studying English for three years. Уақытты for (қанша уақыт) пен since (қашаннан бері) көрсетеді, ал сұрақ How long have you been…? деп қойылады. Іс жаңа ғана біткенімен, ізі қазір көрініп тұрса да, осы шақ керек: She is tired because she has been working all day.',
    examples:[
      {en:'I have been studying English for three years.', ru:'Я учу английский уже три года.', kk:'Мен ағылшын тілін үш жылдан бері оқып жүрмін.'},
      {en:'She is tired because she has been working all day.', ru:'Она устала, потому что весь день работала.', kk:'Ол күні бойы жұмыс істегендіктен шаршап тұр.'},
      {en:'It has been raining all day.', ru:'Весь день идёт дождь.', kk:'Күні бойы жаңбыр жауып тұр.'},
      {en:'How long have you been studying English?', ru:'Сколько ты уже учишь английский?', kk:'Ағылшын тілін қанша уақыттан бері оқып жүрсің?'},
    ],
    words:[
      {en:'lately', ru:'в последнее время', kk:'соңғы кездері', ex:'I have been feeling tired lately.', g:'time'},
      {en:'recently', ru:'недавно, в последнее время', kk:'жақында, соңғы уақытта', ex:'She has been working a lot recently.', g:'time'},
      {en:'how long', ru:'как долго, сколько времени', kk:'қанша уақыт', ex:'How long have you been waiting?', g:'word'},
      {en:'rain', ru:'идти (о дожде)', kk:'жаңбыр жауу', ex:'It has been raining all day.', g:'act'},
      {en:'live', ru:'жить', kk:'тұру', ex:'She has been living here since 2018.', g:'act'},
      {en:'write', ru:'писать', kk:'жазу', ex:'I have been writing letters all morning.', g:'act'},
      {en:'tired', ru:'уставший', kk:'шаршаған', ex:'She is tired because she has been working all day.', g:'sign'},
      {en:'all morning', ru:'всё утро', kk:'таңертеңнен бері', ex:'I have been writing letters all morning.', g:'time'},
    ],
    tasks:[
      {t:'choice', q:'I ___ English for three years.', opts:['had been studying', 'have been studying', 'am studying'], a:1,
       why:'Начал три года назад и учу до сих пор — have been + -ing. Am studying for three years — частая ошибка.',
       whyKk:'Үш жыл бұрын бастадым, әлі оқып жүрмін — have been + -ing. Am studying for three years деу — жиі кездесетін қате.'},
      {t:'choice', q:'She ___ been working all day, so she is tired.', opts:['have', 'has', 'had'], a:1,
       why:'С she ставят has. И устала она сейчас, поэтому время настоящее, а не had.',
       whyKk:'She-мен has қойылады. Ол қазір шаршап тұр, сондықтан шақ — осы шақ, had емес.'},
      {t:'choice', q:'They have been waiting ___ two hours.', opts:['since', 'during', 'for'], a:2,
       why:'Two hours — отрезок времени, перед ним for. Since — перед точкой отсчёта: since 2018.',
       whyKk:'Two hours — уақыт аралығы, оның алдында for тұрады. Since басталған уақыттың алдына қойылады: since 2018.'},
      {t:'choice', q:'I ___ three letters today.', opts:['have written', 'have been writing', 'am writing'], a:0,
       why:'Важно, сколько писем готово, — это результат. Результат даёт Present Perfect: have written.',
       whyKk:'Қанша хат дайын екені маңызды — бұл нәтиже. Нәтижені Present Perfect береді: have written.'},
      {t:'order', ru:'Сколько ты уже учишь английский?', kk:'Ағылшын тілін қанша уақыттан бері оқып жүрсің?',
       words:['How', 'long', 'have', 'you', 'been', 'studying', 'English'], a:'How long have you been studying English'},
      {t:'order', ru:'Весь день идёт дождь.', kk:'Күні бойы жаңбыр жауып тұр.',
       words:['It', 'has', 'been', 'raining', 'all', 'day'], a:'It has been raining all day'},
    ]
  },

  i4: {
    title:'Future Continuous', subtitle:'Что будет идти в момент в будущем', subtitleKk:'Болашақтағы бір сәтте не болып жатады',
    rule:'will be + глагол с -ing — действие, которое будет идти в конкретный момент в будущем: At this time tomorrow, I will be flying to Paris. Future Simple сообщает решение (I will call you later), Future Continuous показывает процесс. Им же вежливо спрашивают о чужих планах: Will you be joining us for dinner?',
    ruleKk:'will be + -ing жалғанған етістік — болашақтағы нақты бір сәтте жүріп жатқан әрекет: At this time tomorrow, I will be flying to Paris. Future Simple шешімді хабарлайды (I will call you later), Future Continuous процесті көрсетеді. Біреудің жоспарын сыпайы сұрағанда да осы қолданылады: Will you be joining us for dinner?',
    examples:[
      {en:'I will be studying at 8 p.m. tomorrow.', ru:'Завтра в восемь вечера я буду заниматься.', kk:'Ертең кешкі сегізде сабақ оқып отыратын боламын.'},
      {en:'At this time tomorrow, I will be flying to Paris.', ru:'Завтра в это время я буду лететь в Париж.', kk:'Ертең дәл осы уақытта Парижге ұшып бара жатамын.'},
      {en:'Will you be joining us for dinner?', ru:'Вы присоединитесь к нам за ужином?', kk:'Бізбен бірге кешкі асқа қосыласыз ба?'},
      {en:'This time next year, I will be living in another city.', ru:'Через год в это время я буду жить в другом городе.', kk:'Келесі жылы дәл осы кезде басқа қалада тұратын боламын.'},
    ],
    words:[
      {en:'fly', ru:'лететь', kk:'ұшу', ex:'At this time tomorrow, I will be flying to Paris.', g:'act'},
      {en:'join', ru:'присоединиться', kk:'қосылу', ex:'Will you be joining us for dinner?', g:'act'},
      {en:'sleep', ru:'спать', kk:'ұйықтау', ex:'She will be sleeping when you arrive.', g:'act'},
      {en:'office', ru:'офис', kk:'кеңсе', ex:'They will be working in the office next week.', g:'thing'},
      {en:'as usual', ru:'как обычно', kk:'әдеттегідей', ex:'She will be working next week as usual.', g:'word'},
      {en:'at this time tomorrow', ru:'завтра в это же время', kk:'ертең дәл осы уақытта', ex:'At this time tomorrow, I will be flying to Paris.', g:'time'},
      {en:'next week', ru:'на следующей неделе', kk:'келесі аптада', ex:'They will be working in the office next week.', g:'time'},
      {en:'later', ru:'позже', kk:'кейінірек', ex:'I will call you later.', g:'time'},
    ],
    tasks:[
      {t:'choice', q:'At this time tomorrow, I ___ to Paris.', opts:['will fly', 'am flying', 'will be flying'], a:2,
       why:'Речь о процессе в конкретный момент завтра — will be + -ing.',
       whyKk:'Ертеңгі нақты бір сәтте жүріп жатқан процесс туралы — will be + -ing.'},
      {t:'choice', q:'Don’t call at 8 p.m. I ___ then.', opts:['will studying', 'will be studying', 'study'], a:1,
       why:'Нужны оба слова, will и be, а глагол берёт -ing.',
       whyKk:'will мен be екеуі де керек, ал етістікке -ing жалғанады.'},
      {t:'choice', q:'___ you be joining us for dinner?', opts:['Are', 'Will', 'Do'], a:1,
       why:'В вопросе will выходит вперёд: Will you be joining…? Так вежливо спрашивают о чужих планах.',
       whyKk:'Сұраулы сөйлемде will алға шығады: Will you be joining…? Біреудің жоспарын осылай сыпайы сұрайды.'},
      {t:'choice', q:'She ___ when you arrive, so please be quiet.', opts:['sleeps', 'will be sleeping', 'slept'], a:1,
       why:'Когда ты придёшь, сон уже будет идти. Процесс в момент в будущем — will be sleeping.',
       whyKk:'Сен келгенде ол ұйықтап жатқан болады. Болашақтағы бір сәтте жүріп жатқан әрекет — will be sleeping.'},
      {t:'order', ru:'Они не будут нас ждать.', kk:'Олар бізді күтіп отырмайды.',
       words:['They', 'will', 'not', 'be', 'waiting', 'for', 'us'], a:'They will not be waiting for us'},
      {t:'order', ru:'Через год в это время я буду жить в другом городе.', kk:'Келесі жылы дәл осы кезде басқа қалада тұратын боламын.',
       words:['This', 'time', 'next', 'year,', 'I', 'will', 'be', 'living', 'in', 'another', 'city'], a:'This time next year, I will be living in another city'},
    ]
  },

  i5: {
    title:'Future Perfect', subtitle:'Что будет готово к сроку', subtitleKk:'Белгілі мерзімге не дайын болады',
    rule:'will have + третья форма глагола: к моменту в будущем дело уже будет сделано. I will have finished my homework by 8 p.m. Срок задают by, by the time, before: by tomorrow, by next year. Так же строят уверенную догадку о том, что уже случилось: He will have reached home by now.',
    ruleKk:'will have + етістіктің үшінші формасы: болашақтағы бір сәтке дейін іс бітіп қояды. I will have finished my homework by 8 p.m. Мерзімді by, by the time, before береді: by tomorrow, by next year. Болып қойған іс туралы сенімді болжам да осылай құрылады: He will have reached home by now.',
    examples:[
      {en:'I will have finished my homework by 8 p.m.', ru:'К восьми вечера я уже сделаю домашнее задание.', kk:'Кешкі сегізге дейін үй тапсырмамды орындап қоямын.'},
      {en:'She will have left the office before you arrive.', ru:'Она уйдёт из офиса до твоего прихода.', kk:'Сен келгенше ол кеңседен кетіп қалады.'},
      {en:'They will have built the bridge by next year.', ru:'К следующему году мост уже построят.', kk:'Келесі жылға дейін олар көпірді салып бітіреді.'},
      {en:'By the time you arrive, we will have eaten dinner.', ru:'К твоему приходу мы уже поужинаем.', kk:'Сен келгенше біз кешкі асты ішіп қоямыз.'},
    ],
    words:[
      {en:'graduate', ru:'окончить учёбу', kk:'оқуды бітіру', ex:'I will have graduated by next June.', g:'act'},
      {en:'bridge', ru:'мост', kk:'көпір', ex:'They will have built the bridge by next year.', g:'thing'},
      {en:'leave', ru:'уйти, уехать', kk:'кету', ex:'She will have left the office before you arrive.', g:'act'},
      {en:'reach', ru:'добраться до', kk:'жету', ex:'He will have reached home by now.', g:'act'},
      {en:'move', ru:'переехать', kk:'көшу', ex:'They will have moved to a new house by next month.', g:'act'},
      {en:'project', ru:'проект', kk:'жоба', ex:'I will have completed my project by tomorrow.', g:'thing'},
      {en:'by', ru:'к (сроку)', kk:'…ға дейін (мерзім)', ex:'I will have finished my homework by 8 p.m.', g:'word'},
      {en:'by now', ru:'уже, к этому моменту', kk:'осы уақытқа дейін', ex:'He will have reached home by now.', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'I will have ___ my homework by 8 p.m.', opts:['finish', 'finishing', 'finished'], a:2,
       why:'После will have нужна третья форма глагола: finished.',
       whyKk:'will have-тен кейін етістіктің үшінші формасы керек: finished.'},
      {t:'choice', q:'They will have built the bridge ___ next year.', opts:['since', 'by', 'for'], a:1,
       why:'By задаёт срок: к следующему году.',
       whyKk:'By мерзімді көрсетеді: келесі жылға дейін.'},
      {t:'choice', q:'By the time you arrive, we ___ dinner.', opts:['will eat', 'will have eaten', 'have eaten'], a:1,
       why:'Ужин закончится раньше, чем ты придёшь, — will have + третья форма.',
       whyKk:'Сен келмей тұрып кешкі ас бітеді — will have + үшінші форма.'},
      {t:'choice', q:'It’s nine o’clock. He ___ home by now.', opts:['will have reached', 'reaches', 'will reach'], a:0,
       why:'Это догадка о том, что уже случилось: скорее всего, он уже дома.',
       whyKk:'Бұл болып қойған іс туралы болжам: ол үйге жетіп қалған шығар.'},
      {t:'order', ru:'Она уйдёт до твоего прихода?', kk:'Сен келгенше ол кетіп қала ма?',
       words:['Will', 'she', 'have', 'left', 'before', 'you', 'arrive'], a:'Will she have left before you arrive'},
      {t:'order', ru:'К следующему июню я уже окончу учёбу.', kk:'Келесі маусымға дейін оқуымды бітіріп қоямын.',
       words:['I', 'will', 'have', 'graduated', 'by', 'next', 'June'], a:'I will have graduated by next June'},
    ]
  },

  i6: {
    title:'Second Conditional', subtitle:'«Если бы…»: мечты и советы', subtitleKk:'«Егер… болса»: арман мен кеңес',
    rule:'Нереальную ситуацию в настоящем или будущем строят так: if + Past Simple, потом would + глагол: If I had more time, I would travel the world. После if со всеми лицами ставят were: If I were you, I would study more.',
    ruleKk:'Осы шақтағы не болашақтағы шынайы емес жағдай былай құрылады: if + Past Simple, одан кейін would + етістік: If I had more time, I would travel the world. if-тен кейін барлық жақпен were қойылады: If I were you, I would study more.',
    examples:[
      {en:'If I had more time, I would travel the world.', ru:'Будь у меня больше времени, я бы путешествовал по миру.', kk:'Уақытым көбірек болса, әлемді аралап шығар едім.'},
      {en:'If I were you, I would study more.', ru:'На твоём месте я бы занимался больше.', kk:'Сенің орныңда болсам, көбірек оқыр едім.'},
      {en:'What would you do if you won the lottery?', ru:'Что бы ты сделал, если бы выиграл в лотерею?', kk:'Лотереядан ұтып алсаң, не істер едің?'},
      {en:'If he weren’t busy, he would help us.', ru:'Если бы он не был занят, он бы нам помог.', kk:'Бос болса, ол бізге көмектесер еді.'},
    ],
    words:[
      {en:'travel', ru:'путешествовать', kk:'саяхаттау', ex:'If I had more time, I would travel the world.', g:'act'},
      {en:'lottery', ru:'лотерея', kk:'лотерея', ex:'What would you do if you won the lottery?', g:'thing'},
      {en:'millionaire', ru:'миллионер', kk:'миллионер', ex:'If I were a millionaire, I would buy a big house.', g:'thing'},
      {en:'exam', ru:'экзамен', kk:'емтихан', ex:'If she studied harder, she would pass the exam.', g:'thing'},
      {en:'rich', ru:'богатый', kk:'бай', ex:'If I were rich, I would travel the world.', g:'sign'},
      {en:'busy', ru:'занятой', kk:'бос емес', ex:'If he weren’t busy, he would help us.', g:'sign'},
      {en:'if', ru:'если', kk:'егер', ex:'If it rained, we would stay at home.', g:'word'},
      {en:'would', ru:'бы', kk:'…ар еді', ex:'I would call him if I knew his number.', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'If I ___ more time, I would travel the world.', opts:['have', 'had', 'will have'], a:1,
       why:'Во втором условном после if стоит Past Simple: had.',
       whyKk:'Екінші шартты сөйлемде if-тен кейін Past Simple тұрады: had.'},
      {t:'choice', q:'If I were you, I ___ study more.', opts:['would', 'will', 'am'], a:0,
       why:'Во второй части нереального условия — would + глагол.',
       whyKk:'Шынайы емес шарттың екінші бөлігінде would + етістік тұрады.'},
      {t:'choice', q:'If she ___ here, she would help us.', opts:['is', 'were', 'be'], a:1,
       why:'В нереальном условии после if ставят were, даже с he, she, it.',
       whyKk:'Шынайы емес шартта if-тен кейін he, she, it-пен де were қойылады.'},
      {t:'choice', q:'If it rains tomorrow, I ___ at home.', opts:['would stay', 'will stay', 'stayed'], a:1,
       why:'Rains — настоящее время, дождь вполне возможен. Это первое условие, в нём will.',
       whyKk:'Rains — осы шақ, жаңбырдың жаууы әбден мүмкін. Бұл бірінші шартты сөйлем, онда will тұрады.'},
      {t:'order', ru:'Что бы ты сделал, если бы выиграл в лотерею?', kk:'Лотереядан ұтып алсаң, не істер едің?',
       words:['What', 'would', 'you', 'do', 'if', 'you', 'won', 'the', 'lottery'], a:'What would you do if you won the lottery'},
      {t:'order', ru:'Если бы у меня не было машины, я бы ездил на автобусе.', kk:'Көлігім болмаса, автобуспен жүрер едім.',
       words:['If', 'I', 'didn’t', 'have', 'a', 'car,', 'I', 'would', 'take', 'the', 'bus'], a:'If I didn’t have a car, I would take the bus'},
    ]
  },

  i7: {
    title:'Passive Voice', subtitle:'Говорить о деле, не называя, кто его сделал', subtitleKk:'Істі кім істегенін атамай айту',
    rule:'Пассив строят так: to be в нужном времени + третья форма глагола: Cars are made in Japan, A bridge was built, The report has been finished. Того, кто сделал, добавляют через by, и только если это важно: The song was written by Taylor Swift.',
    ruleKk:'Ырықсыз етіс былай құрылады: керекті шақтағы to be + етістіктің үшінші формасы: Cars are made in Japan, A bridge was built, The report has been finished. Кім істегенін by арқылы қосамыз, ол да маңызды болса ғана: The song was written by Taylor Swift.',
    examples:[
      {en:'Cars are made in Japan.', ru:'Машины делают в Японии.', kk:'Көліктер Жапонияда жасалады.'},
      {en:'The meal was cooked by the chef.', ru:'Еду приготовил шеф-повар.', kk:'Тамақты бас аспаз дайындады.'},
      {en:'My wallet was stolen.', ru:'У меня украли кошелёк.', kk:'Әмиянымды ұрлап кетті.'},
      {en:'The wall is being painted.', ru:'Стену сейчас красят.', kk:'Қабырға қазір боялып жатыр.'},
    ],
    words:[
      {en:'steal', ru:'украсть', kk:'ұрлау', ex:'My wallet was stolen.', g:'act'},
      {en:'wallet', ru:'кошелёк', kk:'әмиян', ex:'My wallet was stolen on the bus.', g:'thing'},
      {en:'paint', ru:'красить', kk:'бояу', ex:'The wall is being painted.', g:'act'},
      {en:'repair', ru:'чинить', kk:'жөндеу', ex:'The car was repaired yesterday.', g:'act'},
      {en:'be born', ru:'родиться', kk:'туылу', ex:'I was born in 2003.', g:'act'},
      {en:'wood', ru:'дерево (материал)', kk:'ағаш (материал)', ex:'The chair is made of wood.', g:'thing'},
      {en:'interested in', ru:'интересуется', kk:'…ға қызығады', ex:'She is interested in art.', g:'sign'},
      {en:'known for', ru:'известен (чем-то)', kk:'…мен танымал', ex:'Italy is known for its food.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'Cars ___ made in Japan.', opts:['is', 'are', 'be'], a:1,
       why:'Cars — множественное число, в Present Simple с ним are.',
       whyKk:'Cars — көпше түр, Present Simple-да онымен are тұрады.'},
      {t:'choice', q:'My wallet was ___ yesterday.', opts:['stole', 'stolen', 'stealing'], a:1,
       why:'В пассиве после to be идёт третья форма: steal — stole — stolen.',
       whyKk:'Ырықсыз етісте to be-ден кейін үшінші форма келеді: steal — stole — stolen.'},
      {t:'choice', q:'The car ___ yesterday.', opts:['repaired', 'is repairing', 'was repaired'], a:2,
       why:'Машина сама себя не чинила, её починили. Без was получается ошибка: The car repaired.',
       whyKk:'Көлік өзін-өзі жөндеген жоқ, оны жөндеді. was болмаса, қате шығады: The car repaired.'},
      {t:'choice', q:'Something strange ___ last night.', opts:['was happened', 'is happened', 'happened'], a:2,
       why:'У happen нет объекта, поэтому пассива у него не бывает. Так же с die, sleep, arrive.',
       whyKk:'happen етістігінің объектісі жоқ, сондықтан ырықсыз етісі болмайды. die, sleep, arrive да солай.'},
      {t:'order', ru:'Я родился в 2003 году.', kk:'Мен 2003 жылы туылдым.',
       words:['I', 'was', 'born', 'in', '2003'], a:'I was born in 2003'},
      {t:'order', ru:'Мне подарили подарок.', kk:'Маған сыйлық берілді.',
       words:['I', 'was', 'given', 'a', 'present'], a:'I was given a present'},
    ]
  },

  i8: {
    title:'Relative Clauses', subtitle:'Добавить подробность в то же предложение', subtitleKk:'Сол сөйлемге қосымша мәлімет қосу',
    rule:'Чтобы сказать больше о человеке, вещи или месте, не начиная новое предложение, ставь who (о людях), which (о вещах), where (о месте), when (о времени), whose (чей): The man who lives next door is a doctor. That годится и для людей, и для вещей, но только без запятых.',
    ruleKk:'Адам, зат немесе орын туралы жаңа сөйлем бастамай толығырақ айту үшін who (адам), which (зат), where (орын), when (уақыт), whose (кімнің) қоямыз: The man who lives next door is a doctor. That адамға да, затқа да жарайды, бірақ тек үтірсіз сөйлемде.',
    examples:[
      {en:'The man who lives next door is a doctor.', ru:'Мужчина, который живёт по соседству, — врач.', kk:'Көршіде тұратын кісі — дәрігер.'},
      {en:'The book that I bought yesterday is very interesting.', ru:'Книга, которую я купил вчера, очень интересная.', kk:'Кеше сатып алған кітабым өте қызық.'},
      {en:'My brother, who lives in Canada, is an engineer.', ru:'Мой брат, который живёт в Канаде, инженер.', kk:'Канадада тұратын ағам — инженер.'},
      {en:'That’s the student whose laptop was stolen.', ru:'Это тот студент, у которого украли ноутбук.', kk:'Ноутбугі ұрланған студент — осы.'},
    ],
    words:[
      {en:'next door', ru:'по соседству', kk:'көршіде', ex:'The man who lives next door is a doctor.', g:'word'},
      {en:'engineer', ru:'инженер', kk:'инженер', ex:'My brother, who lives in Canada, is an engineer.', g:'thing'},
      {en:'laptop', ru:'ноутбук', kk:'ноутбук', ex:'That’s the student whose laptop was stolen.', g:'thing'},
      {en:'boss', ru:'начальник', kk:'бастық', ex:'The woman whom I met is my boss.', g:'thing'},
      {en:'traffic', ru:'пробки', kk:'көлік кептелісі', ex:'The reason why I’m late is traffic.', g:'thing'},
      {en:'polite', ru:'вежливый', kk:'сыпайы', ex:'The person I spoke to was very polite.', g:'sign'},
      {en:'helpful', ru:'отзывчивый, готовый помочь', kk:'көмектесуге дайын', ex:'The woman who works here is very helpful.', g:'sign'},
      {en:'whose', ru:'чей', kk:'кімнің', ex:'The boy whose father is a pilot is my friend.', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'The man ___ lives next door is a doctor.', opts:['which', 'where', 'who'], a:2,
       why:'Речь о человеке, поэтому who. Which — для вещей.',
       whyKk:'Сөз адам туралы, сондықтан who. Which зат үшін қолданылады.'},
      {t:'choice', q:'The book ___ I bought is interesting.', opts:['which', 'who', 'where'], a:0,
       why:'Книга — вещь, для неё which или that. Who о книге — частая ошибка.',
       whyKk:'Кітап — зат, оған which не that керек. Кітап туралы who деу — жиі кездесетін қате.'},
      {t:'choice', q:'My brother, ___ lives in Canada, is an engineer.', opts:['who', 'that', 'what'], a:0,
       why:'Когда подробность выделена запятыми, that не ставят. О человеке — who.',
       whyKk:'Қосымша мәлімет үтірмен бөлінсе, that қойылмайды. Адам туралы — who.'},
      {t:'choice', q:'That’s the student ___ laptop was stolen.', opts:['who', 'which', 'whose'], a:2,
       why:'Чей ноутбук? Принадлежность показывает whose.',
       whyKk:'Кімнің ноутбугі? Тиесілікті whose көрсетеді.'},
      {t:'order', ru:'Это ресторан, где мы ужинали.', kk:'Бұл — біз кешкі ас ішкен мейрамхана.',
       words:['That’s', 'the', 'restaurant', 'where', 'we', 'had', 'dinner'], a:'That’s the restaurant where we had dinner'},
      {t:'order', ru:'Я помню день, когда мы впервые встретились.', kk:'Біз алғаш кездескен күн есімде.',
       words:['I', 'remember', 'the', 'day', 'when', 'we', 'first', 'met'], a:'I remember the day when we first met'},
    ]
  },

  i9: {
    title:'Modals', subtitle:'Умел, может быть, должен, не обязан', subtitleKk:'Істей алдым, мүмкін, керек, міндетті емес',
    rule:'could — умел в прошлом или вежливая просьба: Could you help me? might — может быть, уверенности нет: It might snow tomorrow. must — правило, которое ставишь себе сам; have to — правило извне: закон, школа, начальник. don’t have to значит «не обязательно», mustn’t — «нельзя».',
    ruleKk:'could — өткенде істей алдым немесе сыпайы өтініш: Could you help me? might — мүмкін, сенім жоқ: It might snow tomorrow. must — өзіңе қойған ереже; have to — сырттан келген ереже: заң, мектеп, бастық. don’t have to — «міндетті емес», mustn’t — «болмайды».',
    examples:[
      {en:'When I was a child, I could swim very well.', ru:'В детстве я очень хорошо плавал.', kk:'Бала кезімде өте жақсы жүзе алатынмын.'},
      {en:'She might come to the party.', ru:'Может быть, она придёт на вечеринку.', kk:'Ол кешке келуі мүмкін.'},
      {en:'You must wear a seatbelt.', ru:'Нужно пристегнуться ремнём безопасности.', kk:'Қауіпсіздік белдігін тағу керек.'},
      {en:'You don’t have to come if you’re busy.', ru:'Если ты занят, можешь не приходить.', kk:'Бос болмасаң, келуің міндетті емес.'},
    ],
    words:[
      {en:'could', ru:'мог, умел', kk:'істей алатын', ex:'When I was a child, I could swim very well.', g:'word'},
      {en:'might', ru:'может быть', kk:'мүмкін', ex:'It might snow tomorrow.', g:'word'},
      {en:'have to', ru:'приходится, нужно', kk:'керек, тура келеді', ex:'I have to get up early tomorrow.', g:'word'},
      {en:'be able to', ru:'смочь, суметь', kk:'…а алу', ex:'I was able to win the race yesterday.', g:'act'},
      {en:'race', ru:'забег, гонка', kk:'жарыс', ex:'I was able to win the race.', g:'thing'},
      {en:'seatbelt', ru:'ремень безопасности', kk:'қауіпсіздік белдігі', ex:'You must wear a seatbelt.', g:'thing'},
      {en:'flight', ru:'перелёт, рейс', kk:'рейс, ұшу', ex:'He must be tired after the long flight.', g:'thing'},
      {en:'necessary', ru:'необходимый', kk:'қажет', ex:'You don’t have to go. It’s not necessary.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'When I was a child, I ___ swim very well.', opts:['can', 'must', 'could'], a:2,
       why:'Умел в прошлом — could.',
       whyKk:'Өткенде істей алу — could.'},
      {t:'choice', q:'I ___ win the race yesterday.', opts:['could', 'might', 'was able to'], a:2,
       why:'Получилось один раз в прошлом — was able to. Could в таком случае не говорят.',
       whyKk:'Өткенде бір рет қолымнан келді — was able to. Мұндайда could айтылмайды.'},
      {t:'choice', q:'Take an umbrella. It ___ rain later.', opts:['must', 'might', 'has to'], a:1,
       why:'Дождь только возможен, уверенности нет — might.',
       whyKk:'Жаңбыр жаууы мүмкін ғана, сенім жоқ — might.'},
      {t:'choice', q:'You ___ bring food. It’s not necessary.', opts:['don’t have to', 'mustn’t', 'can’t'], a:0,
       why:'Не обязательно — don’t have to. Mustn’t значит «нельзя».',
       whyKk:'Міндетті емес — don’t have to. Mustn’t «болмайды» дегенді білдіреді.'},
      {t:'order', ru:'Мне пришлось рано уйти домой.', kk:'Маған үйге ерте кетуге тура келді.',
       words:['I', 'had', 'to', 'go', 'home', 'early'], a:'I had to go home early'},
      {t:'order', ru:'Тебе вчера надо было делать домашнее задание?', kk:'Кеше саған үй тапсырмасын орындау керек болды ма?',
       words:['Did', 'you', 'have', 'to', 'do', 'homework', 'yesterday'], a:'Did you have to do homework yesterday'},
    ]
  },

  i10: {
    title:'Gerund and Infinitive', subtitle:'Reading или to read', subtitleKk:'Reading пе, to read пе',
    rule:'Герундий — глагол с -ing (reading), инфинитив — to + глагол (to read). После enjoy, finish, avoid, can’t stand и после предлогов идёт -ing: I enjoy reading, good at playing. После want, decide, plan, promise и после easy, happy идёт to: I want to go home, It’s easy to learn English.',
    ruleKk:'Герундий — -ing жалғанған етістік (reading), инфинитив — to + етістік (to read). enjoy, finish, avoid, can’t stand сөздерінен кейін және предлогтан кейін -ing келеді: I enjoy reading, good at playing. want, decide, plan, promise және easy, happy сөздерінен кейін to келеді: I want to go home, It’s easy to learn English.',
    examples:[
      {en:'I enjoy reading.', ru:'Я люблю читать.', kk:'Кітап оқығанды ұнатамын.'},
      {en:'He’s good at playing football.', ru:'Он хорошо играет в футбол.', kk:'Ол футболды жақсы ойнайды.'},
      {en:'She promised to call me.', ru:'Она обещала мне позвонить.', kk:'Ол маған қоңырау шалуға уәде берді.'},
      {en:'It’s easy to learn English.', ru:'Учить английский легко.', kk:'Ағылшын тілін үйрену оңай.'},
    ],
    words:[
      {en:'enjoy', ru:'получать удовольствие, любить', kk:'ұнату, рахаттану', ex:'I enjoy reading.', g:'act'},
      {en:'avoid', ru:'избегать', kk:'қашу, болдырмау', ex:'He avoided talking to her.', g:'act'},
      {en:'can’t stand', ru:'терпеть не могу', kk:'көргім келмейді, жек көремін', ex:'She can’t stand doing homework.', g:'act'},
      {en:'decide', ru:'решить', kk:'шешу', ex:'She decided to learn Italian.', g:'act'},
      {en:'promise', ru:'обещать', kk:'уәде беру', ex:'She promised to call me.', g:'act'},
      {en:'remember', ru:'помнить, не забыть', kk:'есте сақтау, ұмытпау', ex:'Remember to meet her at six.', g:'act'},
      {en:'good at', ru:'хорошо умеет', kk:'…ға шебер', ex:'He’s good at playing football.', g:'sign'},
      {en:'without', ru:'без', kk:'…сыз, …май', ex:'They left without saying goodbye.', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'I enjoy ___.', opts:['reading', 'read', 'to read'], a:0,
       why:'После enjoy глагол идёт с -ing.',
       whyKk:'enjoy-дан кейін етістікке -ing жалғанады.'},
      {t:'choice', q:'I want ___ home.', opts:['go', 'going', 'to go'], a:2,
       why:'После want идёт инфинитив: to + глагол.',
       whyKk:'want-тан кейін инфинитив келеді: to + етістік.'},
      {t:'choice', q:'He’s good at ___ football.', opts:['playing', 'play', 'to play'], a:0,
       why:'После предлога (at, in, without) глагол всегда с -ing.',
       whyKk:'Предлогтан кейін (at, in, without) етістікке әрқашан -ing жалғанады.'},
      {t:'choice', q:'He stopped ___. Now he doesn’t smoke at all.', opts:['smoking', 'to smoke', 'smoke'], a:0,
       why:'Stopped smoking — бросил курить. Stopped to smoke — остановился, чтобы покурить.',
       whyKk:'Stopped smoking — темекіні тастады. Stopped to smoke — темекі шегу үшін тоқтады.'},
      {t:'order', ru:'Я не знаю, что делать.', kk:'Не істерімді білмеймін.',
       words:['I', 'don’t', 'know', 'what', 'to', 'do'], a:'I don’t know what to do'},
      {t:'order', ru:'Они ушли, не попрощавшись.', kk:'Олар қоштаспай кетіп қалды.',
       words:['They', 'left', 'without', 'saying', 'goodbye'], a:'They left without saying goodbye'},
    ]
  },

  i11: {
    title:'Reported Speech', subtitle:'Пересказать чужие слова', subtitleKk:'Біреудің сөзін жеткізу',
    rule:'Пересказываешь чужие слова после said — время сдвигается на шаг назад: am → was, will → would, can → could, saw → had seen. Меняются и местоимения, и слова времени: tomorrow → the next day, yesterday → the day before. Просьбу передают через told или asked + to: She told me to sit down.',
    ruleKk:'Біреудің сөзін said арқылы жеткізгенде шақ бір саты артқа жылжиды: am → was, will → would, can → could, saw → had seen. Есімдіктер мен уақыт сөздері де өзгереді: tomorrow → the next day, yesterday → the day before. Өтінішті told немесе asked + to арқылы жеткіземіз: She told me to sit down.',
    examples:[
      {en:'She said she was tired.', ru:'Она сказала, что устала.', kk:'Ол шаршағанын айтты.'},
      {en:'He said he would help me.', ru:'Он сказал, что поможет мне.', kk:'Ол маған көмектесетінін айтты.'},
      {en:'She asked where I lived.', ru:'Она спросила, где я живу.', kk:'Ол менің қайда тұратынымды сұрады.'},
      {en:'She told me not to be late.', ru:'Она сказала мне не опаздывать.', kk:'Ол маған кешікпе деді.'},
    ],
    words:[
      {en:'say', ru:'сказать', kk:'айту', ex:'She said she was busy.', g:'act'},
      {en:'tell', ru:'сказать (кому-то)', kk:'(біреуге) айту', ex:'He told me that he liked cats.', g:'act'},
      {en:'ask', ru:'спросить, попросить', kk:'сұрау, өтіну', ex:'She asked me to help her.', g:'act'},
      {en:'whether', ru:'ли', kk:'…ма, …ме', ex:'She asked whether he was coming.', g:'word'},
      {en:'the next day', ru:'на следующий день', kk:'келесі күні', ex:'She said she would call me the next day.', g:'time'},
      {en:'the day before', ru:'накануне', kk:'бір күн бұрын', ex:'She said she had met him the day before.', g:'time'},
      {en:'coffee', ru:'кофе', kk:'кофе', ex:'She asked if I liked coffee.', g:'thing'},
      {en:'late', ru:'опоздавший, поздно', kk:'кешіккен', ex:'She told me not to be late.', g:'sign'},
    ],
    tasks:[
      {t:'choice', q:'“I am tired.” She said she ___ tired.', opts:['is', 'be', 'was'], a:2,
       why:'После said время сдвигается назад: am → was.',
       whyKk:'said-тан кейін шақ артқа жылжиды: am → was.'},
      {t:'choice', q:'“I will call you.” She said she ___ call me.', opts:['will', 'would', 'can'], a:1,
       why:'В пересказе will становится would.',
       whyKk:'Сөзді жеткізгенде will — would болады.'},
      {t:'choice', q:'“Do you like coffee?” She asked ___ I liked coffee.', opts:['if', 'that', 'do'], a:0,
       why:'Вопрос, на который отвечают «да» или «нет», пересказывают через if или whether.',
       whyKk:'«Иә» не «жоқ» деп жауап берілетін сұрақ if немесе whether арқылы жеткізіледі.'},
      {t:'choice', q:'“Don’t be late.” She told me ___ late.', opts:['not to be', 'don’t be', 'not be'], a:0,
       why:'Запрет передают через not to + глагол.',
       whyKk:'Тыйымды not to + етістік арқылы жеткіземіз.'},
      {t:'order', ru:'Она спросила, где я живу.', kk:'Ол менің қайда тұратынымды сұрады.',
       words:['She', 'asked', 'where', 'I', 'lived'], a:'She asked where I lived'},
      {t:'order', ru:'Он сказал, что видел её накануне.', kk:'Ол оны бір күн бұрын көргенін айтты.',
       words:['He', 'said', 'he', 'had', 'seen', 'her', 'the', 'day', 'before'], a:'He said he had seen her the day before'},
    ]
  },

  i12: {
    title:'Question Tags', subtitle:'Переспросить: «…, правда?»', subtitleKk:'Қайта сұрау: «…, солай ма?»',
    rule:'Короткий вопрос в конце фразы просит подтвердить: You are a student, aren’t you? К утверждению добавляют хвостик с not, к отрицанию — без not. В хвостике тот же вспомогательный глагол (is, can, have), а если его нет — do, does или did: She likes music, doesn’t she?',
    ruleKk:'Сөйлем соңындағы қысқа сұрақ айтылғанды растап алу үшін керек: You are a student, aren’t you? Болымды сөйлемге not-пен келетін сұрақ, болымсызға not-сыз сұрақ жалғанады. Сұрақта сол көмекші етістік тұрады (is, can, have), ол жоқ болса — do, does немесе did: She likes music, doesn’t she?',
    examples:[
      {en:'You’re a student, aren’t you?', ru:'Ты ведь студент, да?', kk:'Сен студентсің ғой, солай ма?'},
      {en:'She can drive, can’t she?', ru:'Она ведь умеет водить?', kk:'Ол көлік жүргізе алады ғой, солай ма?'},
      {en:'They don’t live here, do they?', ru:'Они ведь здесь не живут?', kk:'Олар мұнда тұрмайды ғой, солай ма?'},
      {en:'Let’s go for a walk, shall we?', ru:'Давай прогуляемся, а?', kk:'Серуендеп қайтайық, қалай қарайсың?'},
    ],
    words:[
      {en:'drive', ru:'водить машину', kk:'көлік жүргізу', ex:'She can drive, can’t she?', g:'act'},
      {en:'walk', ru:'прогулка', kk:'серуен', ex:'Let’s go for a walk, shall we?', g:'thing'},
      {en:'meat', ru:'мясо', kk:'ет', ex:'She never eats meat, does she?', g:'thing'},
      {en:'movie', ru:'фильм', kk:'фильм', ex:'She’s seen that movie, hasn’t she?', g:'thing'},
      {en:'sure', ru:'уверенный', kk:'сенімді', ex:'You’re sure, aren’t you?', g:'sign'},
      {en:'never', ru:'никогда', kk:'ешқашан', ex:'She never eats meat, does she?', g:'word'},
      {en:'hardly', ru:'почти не', kk:'әрең, дерлік …май', ex:'He hardly works, does he?', g:'word'},
      {en:'shall we', ru:'давай…?', kk:'…айық па?', ex:'Let’s sit down, shall we?', g:'word'},
    ],
    tasks:[
      {t:'choice', q:'You are tired, ___?', opts:['are you', 'aren’t you', 'don’t you'], a:1,
       why:'Фраза утвердительная, значит хвостик с not, а глагол тот же: are → aren’t.',
       whyKk:'Сөйлем болымды, демек сұрақ not-пен келеді, етістік сол күйі: are → aren’t.'},
      {t:'choice', q:'She likes music, ___?', opts:['doesn’t she', 'isn’t she', 'don’t she'], a:0,
       why:'Вспомогательного глагола нет, у глагола -s, значит в хвостике does: doesn’t she.',
       whyKk:'Көмекші етістік жоқ, етістікте -s бар, демек сұрақта does тұрады: doesn’t she.'},
      {t:'choice', q:'I am late, ___?', opts:['amn’t I', 'aren’t I', 'don’t I'], a:1,
       why:'I am — особый случай, хвостик у него aren’t I.',
       whyKk:'I am — ерекше жағдай, оның сұрағы aren’t I болады.'},
      {t:'choice', q:'He hardly works, ___?', opts:['doesn’t he', 'does he', 'is he'], a:1,
       why:'Hardly уже делает фразу отрицательной, поэтому хвостик без not.',
       whyKk:'Hardly сөйлемді болымсыз етеді, сондықтан сұрақ not-сыз келеді.'},
      {t:'order', ru:'Давай прогуляемся, а?', kk:'Серуендеп қайтайық, қалай қарайсың?',
       words:['Let’s', 'go', 'for', 'a', 'walk,', 'shall', 'we'], a:'Let’s go for a walk, shall we'},
      {t:'order', ru:'Ты ведь из Казахстана?', kk:'Сен Қазақстаннансың ғой, солай ма?',
       words:['You’re', 'from', 'Kazakhstan,', 'aren’t', 'you'], a:'You’re from Kazakhstan, aren’t you'},
    ]
  },

  i13: {
    title:'Enough and Too', subtitle:'Достаточно или слишком', subtitleKk:'Жеткілікті ме, тым артық па',
    rule:'too ставят перед прилагательным, и это «слишком», то есть проблема: It’s too cold to swim. enough ставят после прилагательного, и это «достаточно»: The water is warm enough to swim. Перед существительным enough идёт первым: We have enough chairs.',
    ruleKk:'too сын есімнің алдына қойылады, мағынасы — «тым», яғни мәселе бар: It’s too cold to swim. enough сын есімнен кейін тұрады, мағынасы — «жеткілікті»: The water is warm enough to swim. Зат есімнің алдында enough бірінші тұрады: We have enough chairs.',
    examples:[
      {en:'She is old enough to drive.', ru:'Она уже достаточно взрослая, чтобы водить.', kk:'Оның көлік жүргізуге жасы жетеді.'},
      {en:'It’s too cold to swim.', ru:'Слишком холодно, чтобы купаться.', kk:'Шомылуға тым суық.'},
      {en:'We have enough money to buy the tickets.', ru:'Денег на билеты нам хватает.', kk:'Билет алуға ақшамыз жетеді.'},
      {en:'This bag is too heavy to carry.', ru:'Эта сумка слишком тяжёлая, её не унести.', kk:'Бұл сөмке көтеруге тым ауыр.'},
    ],
    words:[
      {en:'enough', ru:'достаточно', kk:'жеткілікті', ex:'He is tall enough to play basketball.', g:'word'},
      {en:'too', ru:'слишком', kk:'тым', ex:'The dress is too big.', g:'word'},
      {en:'too many', ru:'слишком много (того, что считают)', kk:'тым көп (саналатын)', ex:'I have too many books.', g:'word'},
      {en:'tall', ru:'высокий (о человеке)', kk:'ұзын бойлы', ex:'He is tall enough to play basketball.', g:'sign'},
      {en:'heavy', ru:'тяжёлый', kk:'ауыр', ex:'This bag is too heavy to carry.', g:'sign'},
      {en:'dark', ru:'тёмный, темно', kk:'қараңғы', ex:'It’s too dark to see anything.', g:'sign'},
      {en:'carry', ru:'нести', kk:'көтеріп апару', ex:'This bag is too heavy to carry.', g:'act'},
      {en:'hold', ru:'вмещать', kk:'сыйғызу', ex:'The room is big enough to hold 50 people.', g:'act'},
    ],
    tasks:[
      {t:'choice', q:'He is ___ to play basketball.', opts:['enough tall', 'too tall enough', 'tall enough'], a:2,
       why:'Enough ставят после прилагательного: tall enough. Too и enough вместе не ставят.',
       whyKk:'Enough сын есімнен кейін тұрады: tall enough. Too мен enough бірге қойылмайды.'},
      {t:'choice', q:'This bag is ___ heavy to carry.', opts:['enough', 'too', 'very'], a:1,
       why:'Унести не получается, значит «слишком» — too.',
       whyKk:'Көтеріп апару мүмкін емес, яғни «тым» — too.'},
      {t:'choice', q:'We don’t have ___ to finish the test.', opts:['time enough', 'too time', 'enough time'], a:2,
       why:'Перед существительным enough идёт первым: enough time.',
       whyKk:'Зат есімнің алдында enough бірінші тұрады: enough time.'},
      {t:'choice', q:'I have too ___ books.', opts:['many', 'much', 'little'], a:0,
       why:'Книги можно посчитать, поэтому too many. Too much — для того, что не считают: too much water.',
       whyKk:'Кітапты санауға болады, сондықтан too many. Too much саналмайтын затқа айтылады: too much water.'},
      {t:'order', ru:'Слишком темно, ничего не видно.', kk:'Тым қараңғы, ештеңе көрінбейді.',
       words:['It’s', 'too', 'dark', 'to', 'see', 'anything'], a:'It’s too dark to see anything'},
      {t:'order', ru:'Комната достаточно большая, чтобы вместить 50 человек.', kk:'Бөлме 50 адамды сыйғызатындай үлкен.',
       words:['The', 'room', 'is', 'big', 'enough', 'to', 'hold', '50', 'people'], a:'The room is big enough to hold 50 people'},
    ]
  },

  i14: {
    title:'Reflexive Pronouns', subtitle:'Себя и сам: myself, herself', subtitleKk:'Өзі: myself, herself',
    rule:'myself, yourself, himself, herself, itself, ourselves, themselves ставят, когда действие возвращается к тому, кто его делает: I cut myself while cooking. Они же значат «сам, без помощи»: I did it myself. Если двое делают что-то друг другу, нужно each other: They looked at each other.',
    ruleKk:'myself, yourself, himself, herself, itself, ourselves, themselves әрекет оны істеген адамның өзіне қайтқанда қойылады: I cut myself while cooking. Олар «өзім, ешкімнің көмегінсіз» дегенді де білдіреді: I did it myself. Екі адам бір-біріне бір нәрсе істесе, each other керек: They looked at each other.',
    examples:[
      {en:'She taught herself to play guitar.', ru:'Она сама научилась играть на гитаре.', kk:'Ол гитара ойнауды өз бетімен үйренді.'},
      {en:'They enjoyed themselves at the party.', ru:'Они хорошо повеселились на вечеринке.', kk:'Олар кеште көңілді уақыт өткізді.'},
      {en:'I did it myself.', ru:'Я сделал это сам.', kk:'Мұны өзім істедім.'},
      {en:'She looked at herself in the mirror.', ru:'Она посмотрела на себя в зеркало.', kk:'Ол айнадан өзіне қарады.'},
    ],
    words:[
      {en:'myself', ru:'себя, сам (я)', kk:'өзім, өзімді', ex:'I cut myself while cooking.', g:'word'},
      {en:'herself', ru:'себя, сама (она)', kk:'өзі, өзін (ол, әйел)', ex:'She taught herself to play guitar.', g:'word'},
      {en:'themselves', ru:'себя, сами (они)', kk:'өздері, өздерін', ex:'They enjoyed themselves at the party.', g:'word'},
      {en:'each other', ru:'друг друга', kk:'бір-бірін', ex:'They looked at each other.', g:'word'},
      {en:'introduce', ru:'представить', kk:'таныстыру', ex:'Please introduce yourself to the class.', g:'act'},
      {en:'behave', ru:'вести себя', kk:'өзін ұстау', ex:'The children behaved themselves.', g:'act'},
      {en:'hurt', ru:'поранить, ушибить', kk:'жарақаттау', ex:'Don’t hurt yourself with that knife.', g:'act'},
      {en:'mirror', ru:'зеркало', kk:'айна', ex:'She looked at herself in the mirror.', g:'thing'},
    ],
    tasks:[
      {t:'choice', q:'I cut ___ while cooking.', opts:['me', 'mine', 'myself'], a:2,
       why:'Порезал сам себя: действие вернулось к тому, кто его сделал, — myself.',
       whyKk:'Өзімді-өзім кесіп алдым: әрекет істеген адамның өзіне қайтты — myself.'},
      {t:'choice', q:'She taught ___ to play guitar.', opts:['her', 'himself', 'herself'], a:2,
       why:'Она учила саму себя — herself. Himself говорят о мужчине.',
       whyKk:'Ол өзін-өзі үйретті — herself. Himself ер адам туралы айтылады.'},
      {t:'choice', q:'They enjoyed ___ at the party.', opts:['themselves', 'them', 'theirselves'], a:0,
       why:'Enjoy oneself — хорошо провести время. С they — themselves; theirselves такого слова нет.',
       whyKk:'Enjoy oneself — көңілді уақыт өткізу. they-мен — themselves; theirselves деген сөз жоқ.'},
      {t:'choice', q:'Ali looked at Dana, and Dana looked at Ali. They looked at ___.', opts:['themselves', 'ourselves', 'each other'], a:2,
       why:'Двое смотрят друг на друга — each other. Themselves значило бы, что каждый смотрит на себя.',
       whyKk:'Екеуі бір-біріне қарайды — each other. Themselves десек, әрқайсысы өзіне қарағаны болар еді.'},
      {t:'order', ru:'Можешь представиться?', kk:'Өзіңді таныстыра аласың ба?',
       words:['Can', 'you', 'introduce', 'yourself'], a:'Can you introduce yourself'},
      {t:'order', ru:'Не поранься этим ножом.', kk:'Ана пышақпен қолыңды кесіп алма.',
       words:['Don’t', 'hurt', 'yourself', 'with', 'that', 'knife'], a:'Don’t hurt yourself with that knife'},
    ]
  },

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
   3b. ТЕКСТЫ ДЛЯ ЧТЕНИЯ
   Шаг «Чтение» в практике урока: короткий текст, где слова этого урока
   кликабельны. Нажал — флип-карта с переводом и примером из словаря
   урока, поэтому перевод здесь не повторяется.

   [слово] — слово урока; [форма|слово], когда в тексте другая форма
   (apples → apple). Ключ после черты — ровно поле en из words урока.
   \n — новый абзац. Урока здесь нет — шага «Чтение» у него нет.
   node app/check_reading.mjs проверяет, что каждое слово урока в тексте
   есть и что каждая пометка находит своё слово.
   ══════════════════════════════════════════════════════════════════ */
window.TEXTS = {
  b1: 'It is Sunday morning. Mom puts [bread] and [fruit] on the table. I take a [spoon] and eat my yogurt.\n' +
      'After breakfast we go to the park by [train]. In the park there is a big [tree] with pink [flowers]. ' +
      'The sky is [blue]. I sit under the tree and read my [book].',
  b2: 'Look at the market table. What do you [see]? I [see] [ten] [apples|apple]. ' +
      '[One] apple is [green], and nine apples are [red].\n' +
      'Next to them there is a [yellow] banana. My bag is [blue]. I buy [one] kilo of apples and go home.',
  b3: 'There are [many] things in our kitchen. There are four [chairs|chair] and a table. ' +
      'On the table there are two [books|book] and three [apples|apple].\n' +
      'We have some [bread], but not [much]. There is [water] in the bottle. ' +
      'My brother puts too [much] [sugar] in his tea!',
  b4: 'Today is my birthday. We are in a small café. I want [soup] and a [salad]. My sister wants a [sandwich].\n' +
      'Dad drinks [coffee] and Mom drinks [tea]. I drink [water]. ' +
      'Then the waiter brings a big [cake] and [ice cream]. What a great day!',
  b5: 'I live in a big [city]. There are many [cars|car] and [buses|bus] on the streets. ' +
      'Every morning I go to school by [bus]. I sit by the [window] and look outside.\n' +
      'My two [friends|friend] sit next to me. One [child] reads a [book], another eats an [apple]. ' +
      'Our [city] has many [children|child] and many schools.',
  b6: 'We are going on a picnic. Do we have [any] bread? Yes, we have [some]. ' +
      'Do we have [much] [water]? No, only [a little]. Let\'s buy [some] water.\n' +
      'We have [a few] apples, but not [many]. How [much] [money] do we have? Only [a little], but it is enough.',
  b7: 'This is my family. [I] am Aruzhan. My [father] is a doctor. [He] works in a hospital. ' +
      'My [mother] is a teacher. [She] teaches English.\n' +
      'We have a cat. [It] is white and very lazy. My grandparents live in a village. ' +
      '[They] have a big garden. On Sundays [we] visit them.',
  b8: 'Tomorrow is Asel\'s birthday. I call my brother. "Can you help [me]?" I ask. ' +
      '"Of course, I can help [you]," he says.\n' +
      'We buy a book for [her]. Dad wants to [give] her flowers. Our uncle is late, so we wait for [him]. ' +
      'Our cousins come too, and we invite [them] to dinner. ' +
      'Asel opens the box and says: "Thank you! I love [it]!" Then she hugs [us].',
  b9: 'I want a new phone. The black phone is [bigger] [than] the white one. ' +
      'The white phone is [lighter] and [cheaper].\n' +
      'The black phone is [more expensive], but its camera is [better]. ' +
      'The shop near my house is [closer] [than] the mall, and the line in the mall is [longer]. ' +
      'So I buy the white phone in the small shop.',
  b10: 'Let me tell you about my class. Daniyar is the [tallest] boy. Aigerim is the [kindest] girl: she always helps.\n' +
       'Timur is very [talkative]. He talks all day! He is also the [funniest]. ' +
       'Our school café has the [cheapest] lunch in town, and the soup is [delicious]. ' +
       'The [most comfortable|comfortable] chair is in the library. It is the [best] place to read.',
  b11: 'Welcome to my house! It is small but [comfortable]. This is the [living room]. ' +
       'We have a big grey [sofa] here. Next to it is the [kitchen], where my mom cooks.\n' +
       'My [bedroom] is upstairs. The [bathroom] is next to my bedroom. ' +
       'Behind the house there is a little [garden]. It is very [quiet] there in the evening.',
  b12: 'Every summer my family goes on [holiday]. [Where] do we go? To the mountains near Almaty. ' +
       '[When] do we go? In July. [Who] goes with us? My cousins.\n' +
       '[Why] the mountains? Because the [weather] is cool there. [What] do we do? We walk and swim in the lake. ' +
       '[How long] do we stay? Ten days.',
  b13: 'I have a big family. My [grandparents] live in Shymkent. My [uncle] Serik is my father\'s brother, ' +
       'and my [aunt] Gulnar is my mother\'s sister. Their son Arman is my [cousin]. He is also my [best friend].\n' +
       'At school my [classmate] Dana sits next to me. In football, Timur is my [team-mate]. ' +
       'I also have an [online friend] from Turkey. We play games together.',
  b14: 'Today Aliya is [absent]. She is sick. Her mom goes to the shop. [How much] [milk] does she need? One litre. ' +
       '[How many] [apples|apple] does she need? Five. She also buys [water] and a little [sugar].\n' +
       'In the evening Aliya asks her friend: "[How much] [homework] do we have?" "Not much," says her friend.',

  i1: 'Last Friday was a bad day. I left work late, and [by the time] I [arrived|arrive] at the station, my train had gone. ' +
      'Then I [realized|realize] that I had left my wallet in the office.\n' +
      'When I finally got home, I was [exhausted]. Luckily, Mom had [prepared|prepare] dinner, and my little brother had [finished|finish] his homework. ' +
      'He told me he had [saved|save] [enough] money for a new bike.',
  i2: 'Yesterday our team had a big match. We had been training [since] March, so we felt ready. ' +
      'It had been raining [all day], and the field was wet.\n' +
      'We had been [running|run] for ninety minutes when the game ended. After the match we were [dirty] and very [hungry]. ' +
      'Mom had been [waiting|wait] for us with dinner, and we sat at the table [until] ten. ' +
      'Later I found a [letter] from the coach in my bag: "You played well!"',
  i3: 'My name is Dana. I have been [living|live] in Almaty for five years. [Lately] I have been learning to cook. ' +
      'My friends ask: "[How long] have you been cooking?" Only two months!\n' +
      'Today it has been [raining|rain] since the morning, so I am at home. I have been [writing|write] my food blog [all morning], ' +
      'and I am a little [tired] now. [Recently] a hundred new people have started reading it.',
  i4: 'Tomorrow is a busy day for my family. [At this time tomorrow] my dad will be [flying|fly] to Astana for work. ' +
      'Mom will be working in her [office] [as usual].\n' +
      'My little sister will be [sleeping|sleep] when I come home. In the evening I will be studying, so I will call my friend [later]. ' +
      '[Next week] our cousins will be visiting us. Will you be [joining|join] us for dinner on Saturday?',
  i5: 'My brother Arman is a student. He will have [graduated|graduate] [by] next June. ' +
      'Now he is working on a big [project]: a model of a new [bridge] for our town.\n' +
      'Our family is busy too. We will have [moved|move] to a new flat before spring. ' +
      'This morning Arman [left|leave] for Astana by train. It’s nine now, so he will have [reached|reach] the city [by now].',
  i6: 'What would you do if you were [rich]? My friend Aliya often asks this question. ' +
      'She says: "[If] I won the [lottery], I [would] [travel] around the world."\n' +
      'My answer is different. If I were a [millionaire], I would open a free school. ' +
      'But now I am a student, and I am [busy] with my [exam]. If I had more time, I would read more books.',
  i7: 'Our school was built in 1975. It is [known for] its big library. Last summer the old roof was [repaired|repair], ' +
      'and now the walls are being [painted|paint].\n' +
      'Last week my [wallet] was [stolen|steal] on the bus. The next day it was found by a teacher. ' +
      'My friend Asel is [interested in] history. She told me that our first director [was born|be born] in this town. ' +
      'Even the desks in our library are made of [wood].',
  i8: 'This is my street. The man who lives [next door] is a doctor. His wife is an [engineer] who builds roads. ' +
      'Their son Timur, [whose] dog barks every morning, is my best friend.\n' +
      'Yesterday I was late for work. The reason why I was late was [traffic]. My [boss], who is usually strict, only smiled. ' +
      'The woman who works at reception was very [helpful]: she gave me a charger for my [laptop]. ' +
      'People in our office are always [polite].',
  i9: 'When I was ten, I [could] run very fast. Once I [was able to|be able to] win a [race] at school.\n' +
      'Now I am a pilot. I [have to] get up at five every day. Before a [flight] every passenger must wear a [seatbelt]. ' +
      'Tomorrow it [might] snow, and the flight could be late. Passengers often ask me: "Is it [necessary] to come two hours early?" ' +
      'Yes, it is.',
  i10: 'My sister Madina [enjoys|enjoy] cooking, but she [can’t stand] washing the dishes. Last month she [decided|decide] ' +
       'to learn Italian food. Now she is really [good at] making pasta.\n' +
       'I [promised|promise] to help her on Sunday. I usually [avoid] cooking, because I always forget the salt. ' +
       'This time I [remembered|remember] to buy everything. We cooked for three hours [without] stopping, and the pasta was delicious.',
  i11: 'On Monday my friend Aruzhan called me. She [said|say] she was [late] for her train. ' +
       'She [asked|ask] [whether] I could meet her at the station.\n' +
       'I [told|tell] her I would come. At the station she said she had arrived in Almaty [the day before]. ' +
       'We had [coffee] together, and she told me to visit her [the next day].',
  i12: 'Aidar meets his old friend Dana in a café. "You can [drive] now, can’t you?" he asks. ' +
       '"Yes, I got my licence last year," she says.\n' +
       '"You [never] eat [meat], do you?" "No, I don’t." "You have seen the new [movie], haven’t you?" ' +
       '"No, I [hardly] go to the cinema." "Are you [sure]? Then let’s go tonight, [shall we]?" ' +
       'After the film they go for a [walk] in the park.',
  i13: 'Our class wants to play basketball after school. Daniyar is [tall] [enough] to be the captain. ' +
       'Little Ali is [too] short, but he runs very fast.\n' +
       'The gym can [hold] a hundred people, but today there are [too many] students in it. ' +
       'The bag with the balls is too [heavy] for one boy, so two boys [carry] it. At seven it gets [dark], and we go home.',
  i14: 'It’s the first lesson in a new class. The teacher says: "Please [introduce] yourselves." ' +
       'Dana stands up: "Hi, I’m Dana. Last summer I taught [myself] to play the guitar."\n' +
       'The twins Aidar and Arman look at [each other] and laugh. They made the class video [themselves]. ' +
       'The teacher asks everyone to [behave] well. After the lesson Dana looks at [herself] in the [mirror] and smiles. ' +
       'On the way home she falls, but she doesn’t [hurt] herself.'
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
        tasks:    c.tasks    || [],
        text:     window.TEXTS[id] || ''
      });
    }
    return {
      id: lv.id, code: lv.code, title: lv.title,
      tagline: lv.tagline, taglineKk: lv.taglineKk,
      about: lv.about, aboutKk: lv.aboutKk, lessons: out
    };
  })
};
