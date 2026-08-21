/*!
 * 1English · содержимое уроков Elementary (e1–e6).
 * Структура та же, что у Beginner: конспект → 4 упражнения → голосовое → тест.
 */
window.LESSONS = window.LESSONS || {};

LESSONS.e1 = {
  notes: [
    { en:'I went to the park yesterday.', kk:'Кеше саябаққа бардым.' },
    { en:'We saw a good film.',           kk:'Біз жақсы фильм көрдік.' },
    { en:"I didn't buy anything.",        kk:'Мен ештеңе сатып алмадым.' },
    { en:'She had a busy day.',           kk:'Оның күні қарбалас болды.' },
    { en:'They came late.',               kk:'Олар кеш келді.' },
    { en:'It became very cold.',          kk:'Ауа-райы қатты суыды.' }
  ],
  ex: [
    { type:'match', title:'1 · Дұрыс емес етістіктер',
      pairs:[['went','бардым'],['saw','көрдім'],['bought','сатып алдым'],['ate','жедім'],['came','келдім'],['told','айттым']] },
    { type:'gap', title:'2 · Өткен шақ формасы',
      items:[
        { text:'I ___ to school by bus.', opts:['went','goed','go'],       a:0, ex:'go → went, -ed жоқ.' },
        { text:'We ___ pizza last night.',opts:['ate','eated','eat'],      a:0, ex:'eat → ate.' },
        { text:'She ___ a new bag.',      opts:['bought','buyed','buy'],   a:0, ex:'buy → bought.' },
        { text:'They ___ at home.',       opts:['stayed','stayd','stay'],  a:0, ex:'Дұрыс етістік → -ed: stayed.' }
      ] },
    { type:'mistake', title:'3 · Қатені тап',
      items:[
        { bad:'I didn’t went there.',   good:"I didn't go there.",   ex:'didn’t-тен кейін бастапқы форма.' },
        { bad:'She goed home early.',   good:'She went home early.', ex:'go — дұрыс емес етістік.' },
        { bad:'We was at the cinema.',  good:'We were at the cinema.', ex:'we → were.' }
      ] },
    { type:'order', title:'4 · Сөйлемді құрастыр',
      items:[
        { a:'I went to the park yesterday', kk:'Кеше саябаққа бардым' },
        { a:'We did not see that film', kk:'Біз ол фильмді көрмедік' },
        { a:'She bought a new phone last week', kk:'Ол өткен аптада жаңа телефон алды' }
      ] }
  ],
  voice: { task:'Кешкі күнің туралы үш сөйлем айт, біреуі теріс:',
           lines:['Yesterday I …','I also …','I didn’t …'], sec:35 },
  test: [
    { q:'I ___ my friend yesterday.', opts:['saw','seen','see'], a:0, ex:'see → saw.' },
    { q:'«Мен бармадым» —', opts:["I didn't go.",'I didn’t went.','I not went.'], a:0, ex:'didn’t + go.' },
    { q:'She ___ tired after work.', opts:['was','were','is'], a:0, ex:'she → was.' },
    { q:'They ___ dinner at eight.', opts:['had','haved','has'], a:0, ex:'have → had.' },
    { q:'Дұрыс форма: stay →', opts:['stayed','staied','stay'], a:0, ex:'-y дауыстыдан кейін → -ed.' },
    { q:'«Ол кеш келді» —', opts:['He came late.','He comed late.','He come late.'], a:0, ex:'come → came.' }
  ]
};

LESSONS.e2 = {
  notes: [
    { en:'What did you do yesterday?', kk:'Кеше не істедің?' },
    { en:'How was your weekend?',      kk:'Демалысың қалай өтті?' },
    { en:'Did you enjoy the trip?',    kk:'Сапар ұнады ма?' },
    { en:'Where did you stay?',        kk:'Қайда тұрдың?' },
    { en:'It happened two days ago.',  kk:'Бұл екі күн бұрын болды.' },
    { en:'I met my friends there.',    kk:'Онда достарыммен кездестім.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['yesterday','кеше'],['ago','бұрын'],['weekend','демалыс'],['trip','сапар'],['stay','қалу'],['meet','кездесу']] },
    { type:'gap', title:'2 · Сұрақ құрылымы',
      items:[
        { text:'What ___ you do yesterday?', opts:['did','do','does'],       a:0, ex:'Өткен шақ сұрағы → did.' },
        { text:'Did you ___ the film?',      opts:['like','liked','likes'],  a:0, ex:'did-тен кейін бастапқы форма.' },
        { text:'___ was your weekend?',      opts:['How','What','Where'],    a:0, ex:'How was…? — тұрақты сұрақ.' },
        { text:'Where ___ you stay?',        opts:['did','was','were'],      a:0, ex:'stay — етістік, сондықтан did.' }
      ] },
    { type:'listen', title:'3 · Тыңда да таңда',
      items:[
        { say:'What did you do yesterday?', opts:['Кеше не істедің?','Бүгін не істейсің?','Ертең не істейсің?'], a:0 },
        { say:'How was your weekend?',      opts:['Демалысың қалай өтті?','Демалысың қашан?','Демалыс жақсы'],  a:0 },
        { say:'I did not go anywhere.',     opts:['Мен ешқайда бармадым','Мен барлық жерге бардым','Ол бармады'], a:0 },
        { say:'Did you meet your friends?', opts:['Достарыңмен кездестің бе?','Достарың келді','Мен кездестім'], a:0 }
      ] },
    { type:'order', title:'4 · Сұрақ құрастыр',
      items:[
        { a:'What did you do last weekend', kk:'Өткен демалыста не істедің' },
        { a:'Did you enjoy the trip', kk:'Сапар ұнады ма' },
        { a:'Where did you stay in Astana', kk:'Астанада қайда тұрдың' }
      ] }
  ],
  voice: { task:'Досыңның демалысы туралы үш сұрақ қой:',
           lines:['What did you …?','Did you …?','How was …?'], sec:30 },
  test: [
    { q:'What ___ you do yesterday?', opts:['did','do','does'], a:0, ex:'Өткен шақ → did.' },
    { q:'Дұрыс сұрақ:', opts:['Did you see him?','Did you saw him?','Do you saw him?'], a:0, ex:'did + бастапқы форма.' },
    { q:'A: Did you like it? B: ___', opts:['Yes, I did.','Yes, I liked.','Yes, I was.'], a:0, ex:'did-пен жауап.' },
    { q:'«Демалысың қалай өтті?» —', opts:['How was your weekend?','How is your weekend?','How were your weekend?'], a:0, ex:'weekend — жекеше → was.' },
    { q:'I finished it two hours ___.', opts:['ago','before','back'], a:0, ex:'уақыт + ago.' },
    { q:'Where ___ you stay?', opts:['did','was','have'], a:0, ex:'stay — негізгі етістік, сондықтан did.' }
  ]
};

LESSONS.e3 = {
  notes: [
    { en:'This one is cheaper than that.', kk:'Мынау анаудан арзанырақ.' },
    { en:'Speaking is more difficult for me.', kk:'Маған сөйлеу қиынырақ.' },
    { en:'Your idea is better than mine.', kk:'Сенің идеяң менікінен жақсырақ.' },
    { en:'It was the best day of the year.', kk:'Бұл жылдың ең жақсы күні болды.' },
    { en:'The weather got worse.',         kk:'Ауа-райы нашарлады.' },
    { en:'She is taller than her brother.',kk:'Ол ағасынан ұзынырақ.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['cheaper','арзанырақ'],['expensive','қымбат'],['easy','оңай'],['difficult','қиын'],['better','жақсырақ'],['worse','нашарырақ']] },
    { type:'gap', title:'2 · -er әлде more?',
      items:[
        { text:'This bag is ___ than that one.', opts:['cheaper','more cheap','cheap'], a:0, ex:'Қысқа сөз → -er.' },
        { text:'English is ___ than Chinese.',   opts:['easier','more easy','easy'],    a:0, ex:'easy → easier.' },
        { text:'Speaking is ___ difficult.',     opts:['more','much','many'],           a:0, ex:'Ұзын сөз → more.' },
        { text:'It is the ___ film of the year.',opts:['best','better','goodest'],      a:0, ex:'Ең жақсы → the best.' }
      ] },
    { type:'mistake', title:'3 · Қатені тап',
      items:[
        { bad:'She is more taller than me.', good:'She is taller than me.', ex:'-er мен more бірге қолданылмайды.' },
        { bad:'This is more good.',          good:'This is better.',        ex:'good → better.' },
        { bad:'It is the most cheap hotel.', good:'It is the cheapest hotel.', ex:'Қысқа сөз → -est.' }
      ] },
    { type:'write', title:'4 · Ағылшынша жаз',
      items:[
        { kk:'арзанырақ', a:'cheaper' },
        { kk:'жақсырақ',  a:'better' },
        { kk:'қиын',      a:'difficult' },
        { kk:'қарағанда', a:'than' }
      ] }
  ],
  voice: { task:'Екі нәрсені салыстыр және таңдауыңды түсіндір:',
           lines:['… is better than …','… is more … than …','I choose … because …'], sec:35 },
  test: [
    { q:'This phone is ___ than mine.', opts:['cheaper','more cheap','cheapest'], a:0, ex:'Қысқа сөз → -er + than.' },
    { q:'«Ең жақсы күн» —', opts:['the best day','the better day','the goodest day'], a:0, ex:'good → the best.' },
    { q:'Speaking is ___ difficult than writing.', opts:['more','much','most'], a:0, ex:'Ұзын сөз → more … than.' },
    { q:'The weather got ___.', opts:['worse','worst','bad'], a:0, ex:'bad → worse.' },
    { q:'Дұрыс сөйлем:', opts:['She is taller than me.','She is more tall than me.','She is tallest than me.'], a:0, ex:'tall → taller than.' },
    { q:'«Қымбатырақ» —', opts:['more expensive','expensiver','most expensive'], a:0, ex:'Ұзын сөз → more.' }
  ]
};

LESSONS.e4 = {
  notes: [
    { en:'I am going to study tonight.', kk:'Бүгін кешке оқимын деп жоспарладым.' },
    { en:'We are going to move next week.', kk:'Келесі аптада көшеміз.' },
    { en:'I think it will rain.',        kk:'Менің ойымша жаңбыр жауады.' },
    { en:'OK, I will help you.',         kk:'Жарайды, көмектесемін (дәл қазір шештім).' },
    { en:'Maybe I will go with you.',    kk:'Мүмкін сенімен барамын.' },
    { en:'I promise I will call you.',   kk:'Қоңырау шаламын деп уәде беремін.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['plan','жоспар'],['tomorrow','ертең'],['maybe','мүмкін'],['hope','үміттену'],['decide','шешу'],['later','кейінірек']] },
    { type:'gap', title:'2 · going to әлде will?',
      items:[
        { text:'I have tickets. I ___ fly on Monday.', opts:['am going to','will','go'], a:0, ex:'Жоспар дайын → going to.' },
        { text:'The bag is heavy — I ___ help you.',   opts:['will','am going to','go'], a:0, ex:'Дәл қазір шешім → will.' },
        { text:'Maybe it ___ rain tomorrow.',          opts:['will','is going','goes'],  a:0, ex:'Болжам → will.' },
        { text:'We ___ visit grandma next week.',      opts:['are going to','will to','go'], a:0, ex:'Келісілген жоспар → going to.' }
      ] },
    { type:'listen', title:'3 · Тыңда да таңда',
      items:[
        { say:'I am going to study tonight.', opts:['Бүгін оқуды жоспарладым','Мен қазір оқып жатырмын','Мен кеше оқыдым'], a:0 },
        { say:'I will help you.',             opts:['Мен көмектесемін','Мен көмектесіп жатырмын','Мен көмектестім'], a:0 },
        { say:'It will be cold tomorrow.',    opts:['Ертең суық болады','Кеше суық болды','Қазір суық'], a:0 },
        { say:'What are you going to do?',    opts:['Не істемекшісің?','Не істедің?','Не істеп жатырсың?'], a:0 }
      ] },
    { type:'order', title:'4 · Сөйлемді құрастыр',
      items:[
        { a:'I am going to visit my grandmother', kk:'Мен әжеме барамын деп жоспарладым' },
        { a:'I think it will be a good day', kk:'Менің ойымша жақсы күн болады' },
        { a:'What are you going to do tomorrow', kk:'Ертең не істемекшісің' }
      ] }
  ],
  voice: { task:'Демалыс жоспарыңды айт:',
           lines:['I am going to …','I think I will …','Maybe I will …'], sec:35 },
  test: [
    { q:'I bought tickets. I ___ travel in July.', opts:['am going to','will','go'], a:0, ex:'Дайын жоспар → going to.' },
    { q:'The phone is ringing. I ___ answer it.', opts:['will','am going to','answer'], a:0, ex:'Сол сәттегі шешім → will.' },
    { q:'«Ертең не істемекшісің?» —', opts:['What are you going to do tomorrow?','What you going do tomorrow?','What will you doing tomorrow?'], a:0, ex:'be going to + do.' },
    { q:'Maybe she ___ come later.', opts:['will','is going','goes'], a:0, ex:'Болжам → will.' },
    { q:'We ___ move next month, everything is ready.', opts:['are going to','will to','go to'], a:0, ex:'are going to + move.' },
    { q:'Дұрыс сөйлем:', opts:['I will call you later.','I will to call you later.','I will calling you later.'], a:0, ex:'will + бастапқы форма.' }
  ]
};

LESSONS.e5 = {
  notes: [
    { en:'Could you repeat that, please?', kk:'Қайталап жіберіңізші.' },
    { en:'Could I borrow your pen?',       kk:'Қаламыңызды алуға бола ма?' },
    { en:'Do you mind if I sit here?',     kk:'Осында отырсам, қарсы емессіз бе?' },
    { en:"Let's start now.",               kk:'Қазір бастайық.' },
    { en:'Can I ask you a favour?',        kk:'Бір өтініш жасасам бола ма?' },
    { en:'Of course, no problem.',         kk:'Әрине, мәселе жоқ.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['borrow','қарызға алу'],['repeat','қайталау'],['explain','түсіндіру'],['mind','қарсы болу'],['favour','өтініш'],['polite','сыпайы']] },
    { type:'gap', title:'2 · Сыпайы форма',
      items:[
        { text:'___ you repeat that, please?', opts:['Could','Do','Are'],   a:0, ex:'Could you…? — сыпайы өтініш.' },
        { text:'Could I ___ your pen?',        opts:['borrow','lend','take away'], a:0, ex:'borrow — өзіме алу.' },
        { text:'___ start with question two.', opts:["Let's",'Let','We let'], a:0, ex:'Let’s + етістік — ұсыныс.' },
        { text:'Do you ___ if I open the window?', opts:['mind','want','like'], a:0, ex:'Do you mind if…? — рұқсат сұрау.' }
      ] },
    { type:'mistake', title:'3 · Қатені тап',
      items:[
        { bad:'Repeat it!',              good:'Could you repeat it, please?', ex:'Бұйрық — дөрекі естіледі.' },
        { bad:'Can you to help me?',     good:'Can you help me?',             ex:'can-нан кейін to жоқ.' },
        { bad:'Let’s to go home.',       good:"Let's go home.",               ex:'Let’s + бастапқы форма.' }
      ] },
    { type:'listen', title:'4 · Тыңда да таңда',
      items:[
        { say:'Could you help me, please?', opts:['Көмектесіңізші','Мен көмектесемін','Ол көмектесті'], a:0 },
        { say:'Do you mind if I sit here?', opts:['Осында отырсам бола ма?','Мен отырдым','Сен қайда отырасың?'], a:0 },
        { say:'Of course, no problem.',     opts:['Әрине, мәселе жоқ','Жоқ, болмайды','Мен білмеймін'], a:0 },
        { say:'Can I ask you a favour?',    opts:['Өтініш жасасам бола ма?','Мен сұрадым','Саған көмек керек пе?'], a:0 }
      ] }
  ],
  voice: { task:'Үш сыпайы өтініш айт:',
           lines:['Could you …, please?','Could I …?','Do you mind if I …?'], sec:30 },
  test: [
    { q:'Ең сыпайы нұсқа:', opts:['Could you help me, please?','Help me.','You must help me.'], a:0, ex:'Could you … please — сыпайы.' },
    { q:'Can you ___ me your book?', opts:['lend','borrow','give up'], a:0, ex:'lend — біреуге беру, borrow — өзіңе алу.' },
    { q:'«Бастайық» —', opts:["Let's start.",'Let’s to start.','Let us starting.'], a:0, ex:'Let’s + бастапқы форма.' },
    { q:'A: Do you mind if I sit here? B: ___', opts:['Not at all.','Yes, I mind not.','Of course I mind not.'], a:0, ex:'Not at all — «қарсы емеспін».' },
    { q:'Could I ___ your charger?', opts:['borrow','lend','rent'], a:0, ex:'Өзіме алу → borrow.' },
    { q:'Дұрыс сөйлем:', opts:['Could you explain it again?','Could you to explain it again?','Could you explaining it?'], a:0, ex:'could + бастапқы форма.' }
  ]
};

LESSONS.e6 = {
  notes: [
    { en:'I like it because it is useful.', kk:'Маған ұнайды, себебі пайдалы.' },
    { en:'I tried, but it was hard.',       kk:'Тырыстым, бірақ қиын болды.' },
    { en:'It was late, so I went home.',    kk:'Кеш болды, сондықтан үйге кеттім.' },
    { en:'Really? Tell me more.',           kk:'Шынымен бе? Тағы айтшы.' },
    { en:'What do you mean by that?',       kk:'Мұныңның мағынасы не?' },
    { en:'I agree with you, actually.',     kk:'Шын мәнінде, мен сенімен келісемін.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['because','себебі'],['but','бірақ'],['so','сондықтан'],['really','шынымен'],['agree','келісу'],['mean','мағынасы']] },
    { type:'gap', title:'2 · Байланыстырушы сөз',
      items:[
        { text:'I like this game ___ it is fast.', opts:['because','but','so'], a:0, ex:'Себеп → because.' },
        { text:'I wanted to go, ___ I was busy.',  opts:['but','because','so'], a:0, ex:'Қарама-қайшылық → but.' },
        { text:'It was raining, ___ we stayed home.', opts:['so','because','but'], a:0, ex:'Нәтиже → so.' },
        { text:'A: I went to Turkey. B: ___',      opts:['Really? How was it?','Yes.','I know.'], a:0, ex:'Әңгімені жалғастыратын жауап.' }
      ] },
    { type:'order', title:'3 · Толық жауап құрастыр',
      items:[
        { a:'I like it because it is easy', kk:'Маған ұнайды, себебі оңай' },
        { a:'It was late so I went home', kk:'Кеш болды, сондықтан үйге кеттім' },
        { a:'I wanted to come but I was busy', kk:'Келгім келді, бірақ бос болмадым' }
      ] },
    { type:'listen', title:'4 · Тыңда да таңда',
      items:[
        { say:'Really? Tell me more.',      opts:['Шынымен бе? Тағы айтшы','Мен білемін','Бұл қызық емес'], a:0 },
        { say:'What do you mean by that?',  opts:['Мұның мағынасы не?','Сен не істедің?','Қашан келесің?'], a:0 },
        { say:'I agree with you.',          opts:['Мен келісемін','Мен келіспеймін','Мен білмеймін'],       a:0 },
        { say:'It was late, so I went home.',opts:['Кеш болды, сондықтан кеттім','Кеш болды, бірақ қалдым','Ерте болды'], a:0 }
      ] }
  ],
  voice: { task:'Сұраққа қысқа емес, толық жауап бер: «How was your weekend?»',
           lines:['It was …, because …','I also …','What about you?'], sec:35 },
  test: [
    { q:'I stayed home ___ it was raining.', opts:['because','but','so'], a:0, ex:'Себеп → because.' },
    { q:'A: I passed the test! B: ___', opts:['Really? Congratulations!','OK.','I know it.'], a:0, ex:'Реакция әңгімені жалғастырады.' },
    { q:'It was cold, ___ we took a taxi.', opts:['so','because','but'], a:0, ex:'Нәтиже → so.' },
    { q:'«Шын мәнінде» —', opts:['actually','really not','of course'], a:0, ex:'actually — «шын мәнінде».' },
    { q:'Ең жақсы жауап: «Did you like the film?»', opts:['Yes, because the story was strong.','Yes.','No comment.'], a:0, ex:'Себеп қосылса — әңгіме жалғасады.' },
    { q:'What do you ___ by that?', opts:['mean','think','say'], a:0, ex:'What do you mean…? — тұрақты сұрақ.' }
  ]
};
