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
