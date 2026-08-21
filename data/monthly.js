/*!
 * 1English · ай сайынғы тест — банк вопросов с эскалацией.
 *
 * Как работает эскалация: сначала все проходят пробный блок m1 (8 вопросов
 * разной сложности). По нему считается взвешенный балл, и дальше ребёнок
 * уходит в одну из трёх веток — easy / core / hard. Ветка меняет и сложность,
 * и формат: в hard появляются чтение, cloze и категоризация, в easy остаются
 * выбор и аудирование. Итог теста — уровень, а не «12 из 18».
 *
 * d — сложность (1 → a1, 2 → a2, 3 → b1, 4 → b2), sk — навык.
 * Форматы: mcq, listen (аудио + выбор), gap (вписать), order (собрать),
 * match, cloze (пропуски в тексте), categorize, reading.
 */
window.MONTHLY = {
  beginner: {
    m1: [
      { d:1, sk:'vocab',   type:'mcq', big:'🎒', q:'Мынау ағылшынша?', o:['bag','book','pen','desk'], c:0 },
      { d:1, sk:'grammar', type:'mcq', q:'I ___ hungry.', o:['am','is','are','be'], c:0 },
      { d:1, sk:'listening', type:'listen', audio:'She has got a pet.', q:'Не естідің?',
        o:['Онда үй жануары бар','Менде мысық жоқ','Ол мектепте'], c:0 },
      { d:2, sk:'grammar', type:'mcq', q:'She ___ to school every day.', o:['goes','go','going','went'], c:0 },
      { d:2, sk:'vocab',   type:'match', q:'Жұбын тап:',
        pairs:[['tired','шаршаған'],['busy','бос емес'],['money','ақша'],['question','сұрақ']] },
      { d:2, sk:'grammar', type:'gap', q:'He ___ like coffee.', a:"doesn't", hint:'he + теріс форма' },
      { d:2, sk:'grammar', type:'order', q:'Сөйлем құра:', a:'I do not have time' },
      { d:3, sk:'reading', type:'reading', q:'Where does Aisha study?',
        passage:'Aisha is twelve. She studies at school number five and she learns English twice a week.',
        o:['at school number five','at home','at university'], c:0 }
    ],
    speed: [
      { d:1, sk:'vocab', type:'mcq', speed:true, q:'«кеш» —', o:['late','early','never'], c:0 },
      { d:2, sk:'grammar', type:'mcq', speed:true, q:'They ___ football now.', o:['are playing','play','plays'], c:0 }
    ],
    easy: [
      { d:1, sk:'vocab',   type:'mcq', big:'📱', q:'Мынау не?', o:['phone','money','idea','time'], c:0 },
      { d:1, sk:'grammar', type:'mcq', q:'We ___ ready.', o:['are','is','am'], c:0 },
      { d:1, sk:'listening', type:'listen', audio:'I am not ready.', q:'Мағынасы?',
        o:['Мен дайын емеспін','Мен дайынмын','Сен дайынсың'], c:0 },
      { d:1, sk:'vocab',   type:'mcq', q:'«сұрақ» —', o:['question','answer','idea'], c:0 },
      { d:2, sk:'grammar', type:'mcq', q:'___ you got a pet?', o:['Have','Has','Do'], c:0 }
    ],
    core: [
      { d:2, sk:'grammar', type:'gap', q:'She ___ got a new phone.', a:'has', hint:'she + got' },
      { d:2, sk:'grammar', type:'order', q:'Сұрақ құра:', a:'Where do you live' },
      { d:2, sk:'listening', type:'listen', audio:'What are you doing now?', q:'Сұрақ не туралы?',
        o:['дәл қазір не істеп жатқаны','әдетте не істейтіні','кеше не істегені'], c:0 },
      { d:3, sk:'grammar', type:'mcq', q:'Look! It ___.', o:['is raining','rains','rained'], c:0 },
      { d:3, sk:'vocab',   type:'categorize', q:'Дұрыс топқа салы:', cats:['feeling','thing'],
        items:[{w:'tired',c:0},{w:'money',c:1},{w:'hungry',c:0},{w:'homework',c:1}] }
    ],
    hard: [
      { d:3, sk:'grammar', type:'cloze', q:'Толтыр:',
        passage:'My sister ___ English every day, but today she ___ maths.',
        blanks:[{o:['studies','study','studying'],c:0},{o:['is studying','studies','studied'],c:0}] },
      { d:3, sk:'grammar', type:'mcq', q:'He ___ have a car.', o:["doesn't",'don’t','not'], c:0 },
      { d:3, sk:'reading', type:'reading', q:'Why did they stay at home?',
        passage:'It was raining all day, so we stayed at home and watched two films.',
        o:['because of the rain','because they were tired','because of school'], c:0 },
      { d:3, sk:'grammar', type:'order', q:'Сөйлем құра:', a:'She does not like fish' },
      { d:4, sk:'grammar', type:'mcq', q:'I usually walk, but today I ___ the bus.', o:['am taking','take','took'], c:0 }
    ]
  },

  elementary: {
    m1: [
      { d:2, sk:'grammar', type:'mcq', q:'I ___ to the park yesterday.', o:['went','go','goed','gone'], c:0 },
      { d:2, sk:'vocab',   type:'match', q:'Жұбын тап:',
        pairs:[['bought','сатып алдым'],['ago','бұрын'],['cheaper','арзанырақ'],['maybe','мүмкін']] },
      { d:2, sk:'listening', type:'listen', audio:'How was your weekend?', q:'Сұрақ не туралы?',
        o:['демалыс қалай өтті','демалыс қашан','кім келді'], c:0 },
      { d:3, sk:'grammar', type:'gap', q:'What ___ you do yesterday?', a:'did', hint:'өткен шақ сұрағы' },
      { d:3, sk:'grammar', type:'mcq', q:'This hotel is ___ than that one.', o:['cheaper','more cheap','cheapest'], c:0 },
      { d:3, sk:'grammar', type:'order', q:'Сөйлем құра:', a:'I am going to call you tomorrow' },
      { d:3, sk:'reading', type:'reading', q:'What did Arman do after the exam?',
        passage:'After the exam Arman met his friends and they went to a cafe near the school.',
        o:['met his friends','went home','called his teacher'], c:0 },
      { d:4, sk:'grammar', type:'mcq', q:'If it rains, we ___ at home.', o:['will stay','stayed','staying'], c:0 }
    ],
    speed: [
      { d:2, sk:'vocab', type:'mcq', speed:true, q:'«кеше» —', o:['yesterday','tomorrow','today'], c:0 },
      { d:3, sk:'grammar', type:'mcq', speed:true, q:'Could you ___ that, please?', o:['repeat','repeated','repeating'], c:0 }
    ],
    easy: [
      { d:2, sk:'grammar', type:'mcq', q:'She ___ tired after work.', o:['was','were','is'], c:0 },
      { d:2, sk:'vocab',   type:'mcq', q:'«сапар» —', o:['trip','shop','plan'], c:0 },
      { d:2, sk:'listening', type:'listen', audio:'I did not go anywhere.', q:'Мағынасы?',
        o:['Ешқайда бармадым','Барлық жерге бардым','Ол бармады'], c:0 },
      { d:2, sk:'grammar', type:'gap', q:'They ___ pizza last night.', a:'ate', hint:'eat → ?' },
      { d:3, sk:'grammar', type:'mcq', q:'Your idea is ___ than mine.', o:['better','gooder','best'], c:0 }
    ],
    core: [
      { d:3, sk:'grammar', type:'order', q:'Сұрақ құра:', a:'Where did you stay in Astana' },
      { d:3, sk:'grammar', type:'cloze', q:'Толтыр:',
        passage:'Last weekend we ___ to the mountains and ___ many photos.',
        blanks:[{o:['went','go','goes'],c:0},{o:['took','take','taked'],c:0}] },
      { d:3, sk:'vocab',   type:'categorize', q:'Дұрыс етістікке салы:', cats:['make','do','take'],
        items:[{w:'a decision',c:0},{w:'homework',c:1},{w:'a photo',c:2},{w:'a mistake',c:0}] },
      { d:3, sk:'listening', type:'listen', audio:'Do you mind if I open the window?', q:'Бұл не?',
        o:['сыпайы рұқсат сұрау','бұйрық','шағым'], c:0 },
      { d:4, sk:'grammar', type:'mcq', q:'I have tickets, so I ___ fly on Monday.',
        o:['am going to','will','would'], c:0 }
    ],
    hard: [
      { d:4, sk:'reading', type:'reading', q:'Why was the trip difficult?',
        passage:'Although the hotel was cheap and the people were friendly, the trip was difficult because we did not speak the language.',
        o:['they did not speak the language','the hotel was expensive','the people were rude'], c:0 },
      { d:4, sk:'grammar', type:'mcq', q:'She said she ___ call me later.', o:['would','will','is'], c:0 },
      { d:4, sk:'grammar', type:'cloze', q:'Толтыр:',
        passage:'I ___ working here for two years, and I ___ to stay.',
        blanks:[{o:['have been','am','was'],c:0},{o:['am going','go','went'],c:0}] },
      { d:4, sk:'vocab',   type:'mcq', q:'“I am looking forward to it” дегені —',
        o:['асыға күтемін','ұмытып кеттім','мен қарсымын'], c:0 },
      { d:4, sk:'grammar', type:'order', q:'Сөйлем құра:', a:'I would rather stay at home' }
    ]
  }
};
