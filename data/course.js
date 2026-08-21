/*!
 * 1English · курсы по уровням.
 *
 * Уровень выбирает сам ученик при входе и может сменить в любой момент —
 * диагностика только советует, но не запирает.
 *
 * Почему Beginner не начинается с «My name is»: дети учат английский и в
 * школе, к нам приходят чаще на Elementary и «как меня зовут» уже знают.
 * Поэтому даже нулевой курс стартует с того, что реально не работает в речи:
 * to be в отрицании и вопросе, have got, отличие «делаю вообще» от «делаю сейчас».
 *
 * Юнит = урок. Модуль = 3 урока с общей коммуникативной целью.
 * Написано по 6 уроков на уровень; дальше — каркас, помеченный ready:false.
 */
window.COURSE = {
  zoom: { day: 'Дс, Ср, Жм', time: '18:00', link: 'https://zoom.us/j/0000000000' },

  levels: [
    { id:'beginner', name:'Beginner', cefr:'pre-A1 → A1',
      kk:'Нөлден бастаймын',
      about:'Сөздерді танимын, бірақ сөйлем құрай алмаймын. Мектепте өткенім есімде жоқ.',
      check:'«I am not», «Do you…?», «I have got» — осылардың айырмасын білмесем, осында.' },
    { id:'elementary', name:'Elementary', cefr:'A1 → A2',
      kk:'Түсінемін, бірақ сөйлей алмаймын',
      about:'Мектептен базам бар: сөздер, қарапайым сөйлемдер. Ауызша сөйлеу тұрып қалады.',
      check:'Өткен шақ, жоспар, салыстыру және сұхбатты жалғастыру — осында.' }
  ],

  modules: [
    { id:'bm1', level:'beginner',   num:1, kk:'Мен және айналам',
      goal:'Өзің туралы, отбасың туралы және күніңді айта аласың.' },
    { id:'bm2', level:'beginner',   num:2, kk:'Сұрақ қоя білу',
      goal:'Сұрақ қоясың және басқа адам туралы айта аласың.' },
    { id:'bm3', level:'beginner',   num:3, kk:'Қалада және дүкенде', ready:false,
      goal:'Жол сұрайсың, сатып аласың, тапсырыс бересің.' },
    { id:'em1', level:'elementary', num:1, kk:'Өткен шақ',
      goal:'Кеше, демалыста, өткен жазда не болғанын айта аласың.' },
    { id:'em2', level:'elementary', num:2, kk:'Жоспар және әңгіме',
      goal:'Жоспарыңды айтасың, сыпайы өтінесің, әңгімені жалғастырасың.' },
    { id:'em3', level:'elementary', num:3, kk:'Жұмыс және саяхат', ready:false,
      goal:'Сұхбат, әуежай, қонақүй — нақты жағдайлар.' }
  ],

  units: [
    /* ── BEGINNER · модуль 1 ────────────────────────────────────────── */
    { id:'b1', level:'beginner', mod:'bm1', num:1, kk:'Мен кіммін', en:'I am / I am not',
      cando:'Мен өзім туралы бес сөйлем айта аламын: кіммін, қандаймын, қайдамын.',
      gram:'to be: am / is / are, теріс және сұрақ', lvl:'pre-A1', ready:true },
    { id:'b2', level:'beginner', mod:'bm1', num:2, kk:'Менде бар, менде жоқ', en:'have got',
      cando:'Менде не бар, не жоқ екенін айта аламын және сұрай аламын.',
      gram:'have / has got, don’t have', lvl:'pre-A1', ready:true, video:'u2' },
    { id:'b3', level:'beginner', mod:'bm1', num:3, kk:'Менің күнім', en:'Present Simple: I',
      cando:'Күнделікті ісімді айта аламын: тұрамын, барамын, ұнатпаймын.',
      gram:'Present Simple I/you/we + don’t', lvl:'A1', ready:true },
    /* ── BEGINNER · модуль 2 ────────────────────────────────────────── */
    { id:'b4', level:'beginner', mod:'bm2', num:4, kk:'Сұрақ қою', en:'Do you…? Where…?',
      cando:'Мен таныс емес адамға бес сұрақ қоя аламын.',
      gram:'Do you…?, What / Where / When / How', lvl:'A1', ready:true },
    { id:'b5', level:'beginner', mod:'bm2', num:5, kk:'Ол туралы', en:'He / She works',
      cando:'Мен басқа адам туралы айта аламын: не істейді, не ұнатады.',
      gram:'-s жалғауы, doesn’t', lvl:'A1', ready:true },
    { id:'b6', level:'beginner', mod:'bm2', num:6, kk:'Қазір не болып жатыр', en:'Present Continuous',
      cando:'«Әрқашан істеймін» мен «дәл қазір істеп жатырмын» дегенді ажырата аламын.',
      gram:'am/is/are + -ing, Simple ↔ Continuous', lvl:'A1+', ready:true },
    { id:'b7', level:'beginner', mod:'bm3', num:7, kk:'Қалада', en:'In the city', ready:false,
      cando:'Жол сұрай аламын және бағытты түсіне аламын.', gram:'there is / prepositions', lvl:'A1' },
    { id:'b8', level:'beginner', mod:'bm3', num:8, kk:'Дүкенде', en:'Shopping', ready:false,
      cando:'Дүкенде сұрай аламын, бағасын білемін.', gram:'How much…?, Can I have…?', lvl:'A1' },
    { id:'b9', level:'beginner', mod:'bm3', num:9, kk:'Кафеде', en:'At the cafe', ready:false,
      cando:'Тапсырыс бере аламын.', gram:'I’d like…', lvl:'A1' },

    /* ── ELEMENTARY · модуль 1 ──────────────────────────────────────── */
    { id:'e1', level:'elementary', mod:'em1', num:1, kk:'Кеше не болды', en:'Past Simple',
      cando:'Кеше не істегенімді айта аламын: бардым, көрдім, жасадым.',
      gram:'Past Simple: -ed және дұрыс емес етістіктер', lvl:'A1+', ready:true },
    { id:'e2', level:'elementary', mod:'em1', num:2, kk:'Өткен шақтағы сұрақ', en:'Did you…?',
      cando:'Демалысы қалай өткенін сұрай аламын және жауап бере аламын.',
      gram:'did / didn’t, What did you…?', lvl:'A2', ready:true },
    { id:'e3', level:'elementary', mod:'em1', num:3, kk:'Салыстыру', en:'Comparatives',
      cando:'Екі нәрсені салыстырып, таңдауымды түсіндіре аламын.',
      gram:'-er / more, the best, than', lvl:'A2', ready:true },
    /* ── ELEMENTARY · модуль 2 ──────────────────────────────────────── */
    { id:'e4', level:'elementary', mod:'em2', num:4, kk:'Болашақ жоспар', en:'going to / will',
      cando:'Жоспарымды айта аламын және шешімді сол жерде қабылдай аламын.',
      gram:'be going to ↔ will', lvl:'A2', ready:true },
    { id:'e5', level:'elementary', mod:'em2', num:5, kk:'Сыпайы өтініш', en:'Could you…?',
      cando:'Сыпайы өтіне аламын және ұсыныс жасай аламын.',
      gram:'can / could / would you, Let’s', lvl:'A2', ready:true },
    { id:'e6', level:'elementary', mod:'em2', num:6, kk:'Әңгімені жалғастыру', en:'Keep talking',
      cando:'Қысқа жауап бермей, әңгімені жалғастыра аламын.',
      gram:'because / but / so, қайта сұрақ', lvl:'A2+', ready:true },
    { id:'e7', level:'elementary', mod:'em3', num:7, kk:'Жұмыс туралы', en:'About work', ready:false,
      cando:'Жұмысым туралы айта аламын.', gram:'present perfect кіріспе', lvl:'A2' },
    { id:'e8', level:'elementary', mod:'em3', num:8, kk:'Әуежайда', en:'At the airport', ready:false,
      cando:'Тіркеуден өтіп, сұрақ қоя аламын.', gram:'сұрақ формалары', lvl:'A2' },
    { id:'e9', level:'elementary', mod:'em3', num:9, kk:'Қонақүйде', en:'At the hotel', ready:false,
      cando:'Бөлме сұрай аламын, мәселені шеше аламын.', gram:'сыпайы формалар', lvl:'A2' }
  ]
};

COURSE.byId    = function (id) { return COURSE.units.filter(function (u) { return u.id === id; })[0]; };
COURSE.ofLevel = function (l)  { return COURSE.units.filter(function (u) { return u.level === l; }); };
COURSE.mods    = function (l)  { return COURSE.modules.filter(function (m) { return m.level === l; }); };
COURSE.level   = function (l)  { return COURSE.levels.filter(function (x) { return x.id === l; })[0]; };
COURSE.inMod   = function (m)  { return COURSE.units.filter(function (u) { return u.mod === m; }); };
