/*!
 * 1English · банк слов. По 8 слов на урок, 12 уроков (Beginner b1–b6,
 * Elementary e1–e6).
 *
 * Слова подобраны под коммуникативную задачу урока, а не по алфавиту:
 * в уроке про have got — то, что реально «есть/нет» у ребёнка, в уроке про
 * Past Simple — неправильные глаголы, без которых прошедшего не расскажешь.
 * g — смысловая группа, по ней работает сортировочная арена.
 */
window.WORDS = [
  /* ── b1 · Мен кіммін (to be) ───────────────────────────────────── */
  {u:'b1', en:'tired',      kk:'шаршаған',      g:'feel',  ex:'I am tired today.'},
  {u:'b1', en:'hungry',     kk:'аш',            g:'feel',  ex:'We are hungry now.'},
  {u:'b1', en:'busy',       kk:'бос емес',      g:'feel',  ex:'My father is busy.'},
  {u:'b1', en:'ready',      kk:'дайын',         g:'feel',  ex:'I am not ready yet.'},
  {u:'b1', en:'late',       kk:'кеш',           g:'feel',  ex:'Am I late again?'},
  {u:'b1', en:'afraid',     kk:'қорқады',       g:'feel',  ex:'She is afraid of dogs.'},
  {u:'b1', en:'right',      kk:'дұрыс',         g:'feel',  ex:'You are right about it.'},
  {u:'b1', en:'sure',       kk:'сенімді',       g:'feel',  ex:'I am not sure now.'},
  /* ── b2 · Менде бар, менде жоқ (have got) ──────────────────────── */
  {u:'b2', en:'brother',    kk:'аға, іні',      g:'thing', ex:'I have got one brother.'},
  {u:'b2', en:'phone',      kk:'телефон',       g:'thing', ex:'She has got a new phone.'},
  {u:'b2', en:'pet',        kk:'үй жануары',    g:'thing', ex:'Have you got a pet?'},
  {u:'b2', en:'money',      kk:'ақша',          g:'thing', ex:'I have not got money.'},
  {u:'b2', en:'time',       kk:'уақыт',         g:'thing', ex:'We have got no time.'},
  {u:'b2', en:'homework',   kk:'үй тапсырмасы', g:'thing', ex:'I have got a lot of homework.'},
  {u:'b2', en:'question',   kk:'сұрақ',         g:'thing', ex:'I have got a question.'},
  {u:'b2', en:'idea',       kk:'идея',          g:'thing', ex:'He has got a good idea.'},
  /* ── b3 · Менің күнім (Present Simple I) ───────────────────────── */
  {u:'b3', en:'get up',     kk:'тұрамын',       g:'daily', ex:'I get up at seven.'},
  {u:'b3', en:'study',      kk:'оқимын',        g:'daily', ex:'We study English here.'},
  {u:'b3', en:'help',       kk:'көмектесемін',  g:'daily', ex:'I help my mother.'},
  {u:'b3', en:'watch',      kk:'қараймын',      g:'daily', ex:'I watch videos at night.'},
  {u:'b3', en:'play',       kk:'ойнаймын',      g:'daily', ex:'They play football.'},
  {u:'b3', en:'finish',     kk:'аяқтаймын',     g:'daily', ex:'I finish my homework.'},
  {u:'b3', en:'sleep',      kk:'ұйықтаймын',    g:'daily', ex:'I sleep eight hours.'},
  {u:'b3', en:'never',      kk:'ешқашан',       g:'daily', ex:'I never drink coffee.'},
  /* ── b4 · Сұрақ қою ────────────────────────────────────────────── */
  {u:'b4', en:'where',      kk:'қайда',         g:'quest', ex:'Where do you live?'},
  {u:'b4', en:'when',       kk:'қашан',         g:'quest', ex:'When do you start?'},
  {u:'b4', en:'why',        kk:'неге',          g:'quest', ex:'Why do you ask me?'},
  {u:'b4', en:'how',        kk:'қалай',         g:'quest', ex:'How do you go there?'},
  {u:'b4', en:'who',        kk:'кім',           g:'quest', ex:'Who is your teacher?'},
  {u:'b4', en:'live',       kk:'тұрамын',       g:'quest', ex:'Do you live in Almaty?'},
  {u:'b4', en:'work',       kk:'жұмыс істеу',   g:'quest', ex:'Where do your parents work?'},
  {u:'b4', en:'often',      kk:'жиі',           g:'quest', ex:'How often do you read?'},
  /* ── b5 · Ол туралы (-s) ───────────────────────────────────────── */
  {u:'b5', en:'teach',      kk:'сабақ береді',  g:'people',ex:'She teaches English.'},
  {u:'b5', en:'drive',      kk:'жүргізеді',     g:'people',ex:'My father drives a car.'},
  {u:'b5', en:'cook',       kk:'ас пісіреді',   g:'people',ex:'He cooks very well.'},
  {u:'b5', en:'read',       kk:'оқиды',         g:'people',ex:'She reads books every day.'},
  {u:'b5', en:'write',      kk:'жазады',        g:'people',ex:'He writes his name.'},
  {u:'b5', en:'sing',       kk:'ән салады',     g:'people',ex:'My sister sings well.'},
  {u:'b5', en:'draw',       kk:'сурет салады',  g:'people',ex:'He draws every evening.'},
  {u:'b5', en:'together',   kk:'бірге',         g:'people',ex:'They study together.'},
  /* ── b6 · Қазір не болып жатыр ─────────────────────────────────── */
  {u:'b6', en:'now',        kk:'қазір',         g:'time',  ex:'I am eating now.'},
  {u:'b6', en:'today',      kk:'бүгін',         g:'time',  ex:'She is working today.'},
  {u:'b6', en:'usually',    kk:'әдетте',        g:'time',  ex:'I usually walk home.'},
  {u:'b6', en:'always',     kk:'әрқашан',       g:'time',  ex:'He is always late.'},
  {u:'b6', en:'sometimes',  kk:'кейде',         g:'time',  ex:'Sometimes we play chess.'},
  {u:'b6', en:'wait',       kk:'күту',          g:'time',  ex:'I am waiting for you.'},
  {u:'b6', en:'listen',     kk:'тыңдау',        g:'time',  ex:'They are listening to music.'},
  {u:'b6', en:'look',       kk:'қарау',         g:'time',  ex:'Look! It is raining.'},

  /* ── e1 · Кеше не болды (Past Simple) ──────────────────────────── */
  {u:'e1', en:'went',       kk:'бардым',        g:'past',  ex:'I went to the park.'},
  {u:'e1', en:'saw',        kk:'көрдім',        g:'past',  ex:'We saw a good film.'},
  {u:'e1', en:'had',        kk:'болды, бар еді',g:'past',  ex:'She had a busy day.'},
  {u:'e1', en:'bought',     kk:'сатып алдым',   g:'past',  ex:'He bought new shoes.'},
  {u:'e1', en:'ate',        kk:'жедім',         g:'past',  ex:'They ate pizza together.'},
  {u:'e1', en:'came',       kk:'келдім',        g:'past',  ex:'My friend came late.'},
  {u:'e1', en:'told',       kk:'айттым',        g:'past',  ex:'I told him the truth.'},
  {u:'e1', en:'became',     kk:'болды',         g:'past',  ex:'It became very cold.'},
  /* ── e2 · Өткен шақтағы сұрақ ──────────────────────────────────── */
  {u:'e2', en:'yesterday',  kk:'кеше',          g:'ago',   ex:'What did you do yesterday?'},
  {u:'e2', en:'ago',        kk:'бұрын',         g:'ago',   ex:'I finished it two hours ago.'},
  {u:'e2', en:'weekend',    kk:'демалыс күндері',g:'ago',  ex:'How was your weekend?'},
  {u:'e2', en:'trip',       kk:'сапар',         g:'ago',   ex:'Did you enjoy the trip?'},
  {u:'e2', en:'happen',     kk:'болу, орын алу',g:'ago',   ex:'What happened after that?'},
  {u:'e2', en:'stay',       kk:'қалу',          g:'ago',   ex:'Where did you stay there?'},
  {u:'e2', en:'meet',       kk:'кездесу',       g:'ago',   ex:'Did you meet your friends?'},
  {u:'e2', en:'enjoy',      kk:'ұнату, рахат алу',g:'ago', ex:'I really enjoyed the day.'},
  /* ── e3 · Салыстыру ────────────────────────────────────────────── */
  {u:'e3', en:'cheaper',    kk:'арзанырақ',     g:'comp',  ex:'This one is cheaper than that.'},
  {u:'e3', en:'expensive',  kk:'қымбат',        g:'comp',  ex:'The hotel was very expensive.'},
  {u:'e3', en:'easy',       kk:'оңай',          g:'comp',  ex:'This task is easier for me.'},
  {u:'e3', en:'difficult',  kk:'қиын',          g:'comp',  ex:'Speaking is more difficult.'},
  {u:'e3', en:'better',     kk:'жақсырақ',      g:'comp',  ex:'Your idea is better than mine.'},
  {u:'e3', en:'worse',      kk:'нашарырақ',     g:'comp',  ex:'The weather got worse.'},
  {u:'e3', en:'than',       kk:'қарағанда',     g:'comp',  ex:'She is taller than me.'},
  {u:'e3', en:'the best',   kk:'ең жақсы',      g:'comp',  ex:'It is the best day.'},
  /* ── e4 · Болашақ жоспар ───────────────────────────────────────── */
  {u:'e4', en:'plan',       kk:'жоспар',        g:'plan',  ex:'What is your plan for summer?'},
  {u:'e4', en:'tomorrow',   kk:'ертең',         g:'plan',  ex:'I am going to call you tomorrow.'},
  {u:'e4', en:'next week',  kk:'келесі аптада', g:'plan',  ex:'We are going to move next week.'},
  {u:'e4', en:'maybe',      kk:'мүмкін',        g:'plan',  ex:'Maybe I will go with you.'},
  {u:'e4', en:'hope',       kk:'үміттену',      g:'plan',  ex:'I hope you will like it.'},
  {u:'e4', en:'decide',     kk:'шешу',          g:'plan',  ex:'I decided to start today.'},
  {u:'e4', en:'promise',    kk:'уәде беру',     g:'plan',  ex:'I promise I will help you.'},
  {u:'e4', en:'later',      kk:'кейінірек',     g:'plan',  ex:'I will do it later.'},
  /* ── e5 · Сыпайы өтініш ────────────────────────────────────────── */
  {u:'e5', en:'borrow',     kk:'қарызға алу',   g:'polite',ex:'Could I borrow your pen?'},
  {u:'e5', en:'repeat',     kk:'қайталау',      g:'polite',ex:'Could you repeat that, please?'},
  {u:'e5', en:'explain',    kk:'түсіндіру',     g:'polite',ex:'Can you explain it again?'},
  {u:'e5', en:'mind',       kk:'қарсы болу',    g:'polite',ex:'Do you mind if I sit here?'},
  {u:'e5', en:'offer',      kk:'ұсыну',         g:'polite',ex:'Let me offer you some tea.'},
  {u:'e5', en:'favour',     kk:'жақсылық, өтініш',g:'polite',ex:'Can I ask you a favour?'},
  {u:'e5', en:'polite',     kk:'сыпайы',        g:'polite',ex:'Try to be polite with people.'},
  {u:'e5', en:'of course',  kk:'әрине',         g:'polite',ex:'Of course you can.'},
  /* ── e6 · Әңгімені жалғастыру ──────────────────────────────────── */
  {u:'e6', en:'because',    kk:'себебі',        g:'talk',  ex:'I like it because it is easy.'},
  {u:'e6', en:'but',        kk:'бірақ',         g:'talk',  ex:'I tried, but it was hard.'},
  {u:'e6', en:'so',         kk:'сондықтан',     g:'talk',  ex:'It was late, so I went home.'},
  {u:'e6', en:'really',     kk:'шынымен',       g:'talk',  ex:'Really? Tell me more.'},
  {u:'e6', en:'actually',   kk:'шын мәнінде',   g:'talk',  ex:'Actually, I like it a lot.'},
  {u:'e6', en:'agree',      kk:'келісу',        g:'talk',  ex:'I agree with you here.'},
  {u:'e6', en:'mean',       kk:'мағынасы',      g:'talk',  ex:'What do you mean by that?'},
  {u:'e6', en:'sounds good',kk:'жақсы екен',    g:'talk',  ex:'Sounds good to me.'}
];

WORDS.byUnit = function (u) { return WORDS.filter(function (w) { return w.u === u; }); };
/* Слова уровня по порядку уроков — по ним играют арены и идёт повторение. */
WORDS.upTo = function (u) {
  var lv = u.charAt(0), n = parseInt(u.slice(1), 10);
  return WORDS.filter(function (w) {
    return w.u.charAt(0) === lv && parseInt(w.u.slice(1), 10) <= n;
  });
};
WORDS.byLevel = function (l) {
  var p = l === 'beginner' ? 'b' : 'e';
  return WORDS.filter(function (w) { return w.u.charAt(0) === p; });
};
