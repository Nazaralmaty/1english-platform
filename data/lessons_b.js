/*!
 * 1English · содержимое уроков Beginner (b1–b6).
 *
 * Структура одна на все уроки: конспект → 4 упражнения разных типов →
 * голосовое задание → тест из 6 вопросов. Видео есть только у b2 — остальные
 * уроки честно показывают четыре шага вместо пяти, а не пустой плеер.
 *
 * ВАЖНО: правильные ответы лежат в исходнике. Это допустимо до Ф3, дальше
 * они уезжают в закрытую таблицу Supabase (backend/schema.sql).
 */
window.LESSONS = window.LESSONS || {};

LESSONS.b1 = {
  notes: [
    { en:'I am ready.',        kk:'Мен дайынмын.' },
    { en:"I'm not ready yet.", kk:'Мен әлі дайын емеспін.' },
    { en:'Are you tired?',     kk:'Сен шаршадың ба?' },
    { en:"Yes, I am. / No, I'm not.", kk:'Иә / Жоқ — қысқа жауап.' },
    { en:'She is busy today.', kk:'Ол бүгін бос емес.' },
    { en:'You are right!',     kk:'Сен дұрыс айтасың!' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['tired','шаршаған'],['hungry','аш'],['busy','бос емес'],['ready','дайын'],['late','кеш'],['sure','сенімді']] },
    { type:'gap', title:'2 · am, is немесе are',
      items:[
        { text:'I ___ hungry.',        opts:['am','is','are'], a:0, ex:'I → әрқашан am.' },
        { text:'She ___ busy now.',    opts:['is','am','are'], a:0, ex:'He / she / it → is.' },
        { text:'You ___ right!',       opts:['are','is','am'], a:0, ex:'You → are, тіпті бір адам болса да.' },
        { text:'We ___ not late.',     opts:['are','is','am'], a:0, ex:'We / they → are.' }
      ] },
    { type:'listen', title:'3 · Тыңда да мағынасын таңда',
      items:[
        { say:'I am not ready.',  opts:['Мен дайын емеспін','Мен дайынмын','Сен дайынсың'], a:0 },
        { say:'Are you hungry?',  opts:['Сен ашсың ба?','Мен ашпын','Ол аш емес'],          a:0 },
        { say:'He is afraid.',    opts:['Ол қорқады','Ол қорықпайды','Мен қорқамын'],       a:0 },
        { say:'We are late.',     opts:['Біз кештік','Біз кешікпедік','Ол кешікті'],        a:0 }
      ] },
    { type:'order', title:'4 · Сөйлемді құрастыр',
      items:[
        { a:'I am not ready yet',   kk:'Мен әлі дайын емеспін' },
        { a:'Are you sure about it',kk:'Сен бұған сенімдісің бе' },
        { a:'My brother is busy today', kk:'Ағам бүгін бос емес' }
      ] }
  ],
  voice: { task:'Өзің туралы үш сөйлем айт — біреуі теріс болсын:',
           lines:['I am …','I am not …','Are you …?'], sec:30 },
  test: [
    { q:'I ___ not hungry.', opts:['am','is','are'], a:0, ex:'I + am, теріс болса am not.' },
    { q:'«Ол бос емес» —', opts:['He is not free.','He are not free.','He not free.'], a:0, ex:'is + not, етістік міндетті.' },
    { q:'A: Are you tired? B: ___', opts:["Yes, I am.",'Yes, I do.','Yes, I is.'], a:0, ex:'Қысқа жауапта сол етістік қайталанады: am.' },
    { q:'Сұрақ қалай құралады?', opts:['Are you late?','You are late?','Do you are late?'], a:0, ex:'Сұрақта are алға шығады.' },
    { q:'«Мен сенімді емеспін» —', opts:["I'm not sure.",'I not sure.','I am no sure.'], a:0, ex:"not етістіктен кейін: am not = I'm not." },
    { q:'They ___ ready.', opts:['are','is','am'], a:0, ex:'they → are.' }
  ]
};

LESSONS.b2 = {
  /* Секунды выставлены по фактической склейке (media/script/build_u2.sh
     печатает конец каждого слайда) — вопрос приходит ровно после того,
     как правило объяснили. */
  video: { src:'../media/u2_sabaq.mp4', poster:'../media/u2_poster.jpg', checkpoints:[
    { t:17, q:'Ол туралы айтқанда қайсысы дұрыс?',
      opts:['She has got a phone.','She have got a phone.','She has get a phone.'], a:0,
      ex:'he · she · it → has got. Қалғанының бәрі — have got.' },
    { t:30, q:'Сұрақ қалай құралады?',
      opts:['Have you got a pet?','Do you have got a pet?','You have got a pet?'], a:0,
      ex:'Сұрақта have алға шығады, do мүлде қатыспайды.' },
    { t:36, q:'Теріс сөйлемде not қайда тұрады?',
      opts:['have мен got арасында','got-тан кейін','сөйлемнің соңында'], a:0,
      ex:'I have not got time. Қысқаша — haven’t got.' }
  ] },
  notes: [
    { en:'I have got a question.',   kk:'Менде сұрақ бар.' },
    { en:"I haven't got much time.", kk:'Менің уақытым көп емес.' },
    { en:'She has got a new phone.', kk:'Онда жаңа телефон бар.' },
    { en:'Have you got a pet?',      kk:'Сенде үй жануары бар ма?' },
    { en:'Yes, I have. / No, I haven’t.', kk:'Қысқа жауап.' },
    { en:'How many brothers have you got?', kk:'Нешеу ағаң бар?' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['brother','аға'],['money','ақша'],['pet','үй жануары'],['homework','үй тапсырмасы'],['idea','идея'],['question','сұрақ']] },
    { type:'gap', title:'2 · have got немесе has got',
      items:[
        { text:'I ___ got two sisters.',   opts:['have','has','having'], a:0, ex:'I / you / we / they → have got.' },
        { text:'She ___ got a new phone.', opts:['has','have','is'],     a:0, ex:'He / she / it → has got.' },
        { text:'___ you got a pet?',       opts:['Have','Has','Do'],     a:0, ex:'Сұрақта have алға шығады.' },
        { text:"He hasn't ___ time.",      opts:['got','get','have'],    a:0, ex:'hasn’t got — тұрақты құрылым.' }
      ] },
    { type:'listen', title:'3 · Тыңда да таңда',
      items:[
        { say:'I have got a question.', opts:['Менде сұрақ бар','Менде сұрақ жоқ','Сенде сұрақ бар'], a:0 },
        { say:'She has got a pet.',     opts:['Онда үй жануары бар','Менде ит бар','Оның ақшасы бар'], a:0 },
        { say:'We have not got money.', opts:['Бізде ақша жоқ','Бізде ақша бар','Онда ақша жоқ'],      a:0 },
        { say:'Have you got homework?', opts:['Сенде үй тапсырмасы бар ма?','Мен тапсырма жасадым','Онда тапсырма жоқ'], a:0 }
      ] },
    { type:'mistake', title:'4 · Қатені тап',
      items:[
        { bad:'I have got not time.',   good:"I have not got time.", ex:'not — have мен got арасында.' },
        { bad:'She have got a phone.',  good:'She has got a phone.', ex:'she → has.' },
        { bad:'Do you have got a pet?', good:'Have you got a pet?',  ex:'have got-та do қолданылмайды.' }
      ] }
  ],
  voice: { task:'Өз бөлмең туралы айт: не бар, не жоқ:',
           lines:['I have got …','I have not got …','Have you got …?'], sec:30 },
  test: [
    { q:'He ___ got a bike.', opts:['has','have','is'], a:0, ex:'he → has got.' },
    { q:'«Менде уақыт жоқ» —', opts:["I haven't got time.",'I have not time.','I not have time.'], a:0, ex:"haven't got — дұрыс форма." },
    { q:'A: Have you got a pet? B: ___', opts:['Yes, I have.','Yes, I do.','Yes, I got.'], a:0, ex:'Қысқа жауапта have қайталанады.' },
    { q:'Дұрыс сұрақ:', opts:['Has she got money?','Does she has got money?','She has got money?'], a:0, ex:'Has алға шығады.' },
    { q:'We ___ got a big family.', opts:['have','has','are'], a:0, ex:'we → have.' },
    { q:'«Онда идея бар» —', opts:['He has got an idea.','He have got idea.','He is got an idea.'], a:0, ex:'has got + an idea.' }
  ]
};

LESSONS.b3 = {
  notes: [
    { en:'I get up at seven.',        kk:'Мен жетіде тұрамын.' },
    { en:"I don't watch TV.",         kk:'Мен теледидар қарамаймын.' },
    { en:'We study English on Monday.', kk:'Дүйсенбіде ағылшын оқимыз.' },
    { en:'I never drink coffee.',     kk:'Мен ешқашан кофе ішпеймін.' },
    { en:'They play football after school.', kk:'Олар сабақтан кейін ойнайды.' },
    { en:'I finish my homework at eight.', kk:'Тапсырманы сегізде аяқтаймын.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['get up','тұрамын'],['study','оқимын'],['help','көмектесемін'],['watch','қараймын'],['sleep','ұйықтаймын'],['never','ешқашан']] },
    { type:'gap', title:'2 · Теріс сөйлем',
      items:[
        { text:"I ___ like fish.",         opts:["don't",'not','no'],       a:0, ex:"I → don't + етістік." },
        { text:'We ___ study on Sunday.',  opts:["don't",'doesn’t','not'],  a:0, ex:'we → don’t.' },
        { text:'They ___ play chess.',     opts:["don't",'doesn’t','isn’t'],a:0, ex:'they → don’t.' },
        { text:'I ___ get up early.',      opts:['usually','usual','use'],  a:0, ex:'usually — жиілік үстеуі, етістіктің алдында.' }
      ] },
    { type:'write', title:'3 · Ағылшынша жаз',
      items:[
        { kk:'тұрамын (get up)', a:'get up' },
        { kk:'аяқтаймын',        a:'finish' },
        { kk:'ешқашан',          a:'never' },
        { kk:'көмектесемін',     a:'help' }
      ] },
    { type:'order', title:'4 · Сөйлемді құрастыр',
      items:[
        { a:'I get up at seven', kk:'Мен жетіде тұрамын' },
        { a:'We do not study on Sunday', kk:'Біз жексенбіде оқымаймыз' },
        { a:'They play football every day', kk:'Олар күнде футбол ойнайды' }
      ] }
  ],
  voice: { task:'Күніңді айт — үш сөйлем, біреуі теріс:',
           lines:['I get up at …','I usually …','I don’t …'], sec:35 },
  test: [
    { q:"I ___ watch TV in the morning.", opts:["don't",'doesn’t','not'], a:0, ex:'I → don’t.' },
    { q:'«Біз жексенбіде оқымаймыз» —', opts:["We don't study on Sunday.",'We not study on Sunday.','We don’t studies on Sunday.'], a:0, ex:"don't + бастапқы форма." },
    { q:'Жиілік үстеуі қай жерде тұрады?', opts:['I always help my mother.','I help always my mother.','Always I help my mother.'], a:0, ex:'Негізгі етістіктің алдында.' },
    { q:'«Мен сегізде аяқтаймын» —', opts:['I finish at eight.','I finishing at eight.','I am finish at eight.'], a:0, ex:'Present Simple: finish.' },
    { q:'They ___ English every week.', opts:['study','studies','are study'], a:0, ex:'they → -s жоқ.' },
    { q:'«Ешқашан» қалай?', opts:['never','ever','not never'], a:0, ex:'never — өзі теріс мағына береді.' }
  ]
};

LESSONS.b4 = {
  notes: [
    { en:'Where do you live?',      kk:'Сен қайда тұрасың?' },
    { en:'What do you do after school?', kk:'Сабақтан кейін не істейсің?' },
    { en:'Why do you ask?',         kk:'Неге сұрап тұрсың?' },
    { en:'How often do you read?',  kk:'Қаншалықты жиі оқисың?' },
    { en:'Who is your best friend?',kk:'Ең жақын досың кім?' },
    { en:'Do you speak English at home?', kk:'Үйде ағылшынша сөйлейсің бе?' }
  ],
  ex: [
    { type:'match', title:'1 · Сұрақ сөздер',
      pairs:[['where','қайда'],['when','қашан'],['why','неге'],['how','қалай'],['who','кім'],['often','жиі']] },
    { type:'gap', title:'2 · Сұрақ сөзін таңда',
      items:[
        { text:'___ do you live?',        opts:['Where','When','Who'], a:0, ex:'Орын → where.' },
        { text:'___ do you start school?',opts:['When','Where','Why'], a:0, ex:'Уақыт → when.' },
        { text:'___ is your teacher?',    opts:['Who','What','How'],   a:0, ex:'Адам → who.' },
        { text:'___ do you go there?',    opts:['How','Who','Where'],  a:0, ex:'Тәсіл → how.' }
      ] },
    { type:'mistake', title:'3 · Қатені тап',
      items:[
        { bad:'Where you live?',        good:'Where do you live?',   ex:'Сұрақта do керек.' },
        { bad:'What you do yesterday?', good:'What do you do?',      ex:'Present Simple: do + бастапқы форма.' },
        { bad:'Do you speaks English?', good:'Do you speak English?', ex:'do-дан кейін -s жоқ.' }
      ] },
    { type:'order', title:'4 · Сұрақ құрастыр',
      items:[
        { a:'Where do you live', kk:'Сен қайда тұрасың' },
        { a:'How often do you read books', kk:'Қаншалықты жиі кітап оқисың' },
        { a:'Why do you like this game', kk:'Неге бұл ойын саған ұнайды' }
      ] }
  ],
  voice: { task:'Жаңа танысқан адамға үш сұрақ қой:',
           lines:['Where do you …?','What do you …?','How often do you …?'], sec:30 },
  test: [
    { q:'___ do you live?', opts:['Where','What','Who'], a:0, ex:'Орын туралы → where.' },
    { q:'Дұрыс сұрақ:', opts:['Do you like music?','You like music?','Does you like music?'], a:0, ex:'you → do.' },
    { q:'«Неге?» —', opts:['Why','How','When'], a:0, ex:'why — себеп.' },
    { q:'A: Do you speak English? B: ___', opts:['Yes, I do.','Yes, I am.','Yes, I speak.'], a:0, ex:'do-мен сұраққа do-мен жауап.' },
    { q:'___ often do you play football?', opts:['How','What','Why'], a:0, ex:'how often — жиілік.' },
    { q:'«Сен қашан бастайсың?» —', opts:['When do you start?','When you start?','When are you start?'], a:0, ex:'when + do you + етістік.' }
  ]
};

LESSONS.b5 = {
  notes: [
    { en:'She teaches English.',       kk:'Ол ағылшын тілінен сабақ береді.' },
    { en:"He doesn't cook at home.",   kk:'Ол үйде ас пісірмейді.' },
    { en:'Does she like music?',       kk:'Оған музыка ұнай ма?' },
    { en:'My father drives to work.',  kk:'Әкем жұмысқа көлікпен барады.' },
    { en:'She watches films at night.',kk:'Ол түнде фильм көреді.' },
    { en:'They study together.',       kk:'Олар бірге оқиды.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['teach','сабақ береді'],['drive','жүргізеді'],['cook','ас пісіреді'],['read','оқиды'],['sing','ән салады'],['draw','сурет салады']] },
    { type:'gap', title:'2 · -s қою керек пе?',
      items:[
        { text:'She ___ English.',     opts:['teaches','teach','teachs'], a:0, ex:'-ch → -es: teaches.' },
        { text:'He ___ a car.',        opts:['drives','drive','driveing'],a:0, ex:'he → -s.' },
        { text:'They ___ together.',   opts:['study','studies','studys'], a:0, ex:'they → -s жоқ.' },
        { text:"She ___ like coffee.", opts:["doesn't",'don’t','not'],    a:0, ex:'she → doesn’t + бастапқы форма.' }
      ] },
    { type:'listen', title:'3 · Тыңда да таңда',
      items:[
        { say:'She teaches English.',    opts:['Ол сабақ береді','Ол оқиды','Мен сабақ беремін'], a:0 },
        { say:'He does not cook.',       opts:['Ол ас пісірмейді','Ол ас пісіреді','Біз пісірмейміз'], a:0 },
        { say:'Does she like music?',    opts:['Оған музыка ұнай ма?','Ол ән салады','Маған музыка ұнайды'], a:0 },
        { say:'My father drives a car.', opts:['Әкем көлік жүргізеді','Әкем жаяу жүреді','Ағам көлік жүргізеді'], a:0 }
      ] },
    { type:'mistake', title:'4 · Қатені тап',
      items:[
        { bad:'She don’t like fish.',   good:"She doesn't like fish.", ex:'she → doesn’t.' },
        { bad:'He doesn’t works here.', good:"He doesn't work here.",  ex:'doesn’t-тен кейін -s жоқ.' },
        { bad:'Does she likes music?',  good:'Does she like music?',   ex:'Does бар жерде -s жоқ.' }
      ] }
  ],
  voice: { task:'Отбасыңның бір мүшесі туралы айт:',
           lines:['My … works …','He / She likes …','He / She doesn’t …'], sec:35 },
  test: [
    { q:'She ___ books every day.', opts:['reads','read','readen'], a:0, ex:'she → -s.' },
    { q:'«Ол ән салмайды» —', opts:["He doesn't sing.",'He don’t sing.','He not sings.'], a:0, ex:'he → doesn’t.' },
    { q:'Дұрыс сұрақ:', opts:['Does he cook well?','Do he cook well?','Does he cooks well?'], a:0, ex:'Does + бастапқы форма.' },
    { q:'My sister ___ films at night.', opts:['watches','watchs','watch'], a:0, ex:'-ch → -es.' },
    { q:'A: Does she like tea? B: ___', opts:['Yes, she does.','Yes, she is.','Yes, she like.'], a:0, ex:'does-пен жауап.' },
    { q:'They ___ together after school.', opts:['study','studies','studys'], a:0, ex:'they → -s жоқ.' }
  ]
};

LESSONS.b6 = {
  notes: [
    { en:'I am eating now.',            kk:'Мен қазір тамақ жеп жатырмын.' },
    { en:'I usually eat at home.',      kk:'Мен әдетте үйде тамақтанамын.' },
    { en:'She is working today.',       kk:'Ол бүгін жұмыс істеп жатыр.' },
    { en:'Look! It is raining.',        kk:'Қара! Жаңбыр жауып тұр.' },
    { en:'What are you doing?',         kk:'Сен не істеп жатырсың?' },
    { en:'He is always late.',          kk:'Ол әрқашан кешігеді.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['now','қазір'],['usually','әдетте'],['always','әрқашан'],['sometimes','кейде'],['wait','күту'],['listen','тыңдау']] },
    { type:'gap', title:'2 · Simple әлде Continuous?',
      items:[
        { text:'Look! She ___ to us.',       opts:['is running','runs','run'],       a:0, ex:'Дәл қазір → is + -ing.' },
        { text:'I usually ___ at seven.',    opts:['get up','am getting up','gets up'],a:0,ex:'usually → Present Simple.' },
        { text:'They ___ football now.',     opts:['are playing','play','plays'],     a:0, ex:'now → Continuous.' },
        { text:'He ___ coffee every morning.',opts:['drinks','is drinking','drink'],  a:0, ex:'every morning → Simple.' }
      ] },
    { type:'listen', title:'3 · Тыңда да таңда',
      items:[
        { say:'I am waiting for you.',   opts:['Мен сені күтіп тұрмын','Мен сені күтпедім','Ол күтіп тұр'], a:0 },
        { say:'She usually walks home.', opts:['Ол әдетте жаяу қайтады','Ол қазір жүріп келеді','Біз жаяу жүреміз'], a:0 },
        { say:'What are you doing?',     opts:['Сен не істеп жатырсың?','Сен не істейсің әдетте?','Ол не істеді?'], a:0 },
        { say:'It is raining now.',      opts:['Қазір жаңбыр жауып тұр','Жаңбыр жиі жауады','Күн ашық'], a:0 }
      ] },
    { type:'order', title:'4 · Сөйлемді құрастыр',
      items:[
        { a:'I am listening to music now', kk:'Мен қазір музыка тыңдап жатырмын' },
        { a:'She usually goes to school by bus', kk:'Ол әдетте мектепке автобуспен барады' },
        { a:'What are you doing right now', kk:'Сен дәл қазір не істеп жатырсың' }
      ] }
  ],
  voice: { task:'Айнала не болып жатқанын айт — екеуі Continuous, біреуі Simple:',
           lines:['I am … now','My … is … now','I usually …'], sec:35 },
  test: [
    { q:'Look! The bus ___.', opts:['is coming','comes','come'], a:0, ex:'Look! → дәл қазір.' },
    { q:'I ___ tea every morning.', opts:['drink','am drinking','drinks'], a:0, ex:'every morning → Simple.' },
    { q:'«Сен не істеп жатырсың?» —', opts:['What are you doing?','What do you do?','What you doing?'], a:0, ex:'Дәл қазір → are + doing.' },
    { q:'She ___ TV at the moment.', opts:['is watching','watches','watch'], a:0, ex:'at the moment → Continuous.' },
    { q:'Қай сөйлем «әдетте» дегенді білдіреді?', opts:['I walk to school.','I am walking to school.','I walked to school.'], a:0, ex:'Present Simple — тұрақты іс.' },
    { q:'They ___ now, do not call them.', opts:['are sleeping','sleep','sleeps'], a:0, ex:'now → Continuous.' }
  ]
};
