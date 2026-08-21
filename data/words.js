/*!
 * 1English · банк слов. По 8 слов на юнит, юниты 1-6 (первые две недели).
 * g — категория, по ней работает сортировочная арена; ex — пример
 * предложения, он же используется в сборщике предложений.
 */
window.WORDS = [
  /* u1 · Сәлем! Мен... */
  {u:'u1', en:'hello',     kk:'сәлем',        g:'talk',   ex:'Hello! I am Aisha.'},
  {u:'u1', en:'name',      kk:'аты',          g:'talk',   ex:'My name is Arman.'},
  {u:'u1', en:'friend',    kk:'дос',          g:'people', ex:'This is my friend.'},
  {u:'u1', en:'teacher',   kk:'мұғалім',      g:'people', ex:'She is a teacher.'},
  {u:'u1', en:'student',   kk:'оқушы',        g:'people', ex:'I am a student.'},
  {u:'u1', en:'city',      kk:'қала',         g:'talk',   ex:'I am from Almaty city.'},
  {u:'u1', en:'goodbye',   kk:'сау бол',      g:'talk',   ex:'Goodbye! See you.'},
  {u:'u1', en:'nice',      kk:'жақсы',        g:'talk',   ex:'Nice to meet you.'},
  /* u2 · Менің отбасым */
  {u:'u2', en:'family',    kk:'отбасы',       g:'family', ex:'My family is big.'},
  {u:'u2', en:'mother',    kk:'анам',         g:'family', ex:'My mother is a doctor.'},
  {u:'u2', en:'father',    kk:'әкем',         g:'family', ex:'My father is at work.'},
  {u:'u2', en:'sister',    kk:'қарындасым',   g:'family', ex:'I have one sister.'},
  {u:'u2', en:'brother',   kk:'ағам',         g:'family', ex:'My brother is ten.'},
  {u:'u2', en:'grandmother', kk:'әжем',       g:'family', ex:'My grandmother lives here.'},
  {u:'u2', en:'grandfather', kk:'атам',       g:'family', ex:'My grandfather is kind.'},
  {u:'u2', en:'baby',      kk:'бөбек',        g:'family', ex:'The baby is small.'},
  /* u3 · Сандар мен жас */
  {u:'u3', en:'number',    kk:'сан',          g:'number', ex:'What number is it?'},
  {u:'u3', en:'age',       kk:'жас',          g:'number', ex:'What is your age?'},
  {u:'u3', en:'one',       kk:'бір',          g:'number', ex:'I have one bag.'},
  {u:'u3', en:'five',      kk:'бес',          g:'number', ex:'I have five pens.'},
  {u:'u3', en:'ten',       kk:'он',           g:'number', ex:'She is ten years old.'},
  {u:'u3', en:'twenty',    kk:'жиырма',       g:'number', ex:'Twenty students are here.'},
  {u:'u3', en:'birthday',  kk:'туған күн',    g:'number', ex:'My birthday is in May.'},
  {u:'u3', en:'year',      kk:'жыл',          g:'number', ex:'I am eleven years old.'},
  /* u4 · Мектеп заттары */
  {u:'u4', en:'bag',       kk:'сөмке',        g:'school', ex:'My bag is heavy.'},
  {u:'u4', en:'book',      kk:'кітап',        g:'school', ex:'This is my book.'},
  {u:'u4', en:'pen',       kk:'қалам',        g:'school', ex:'I have a blue pen.'},
  {u:'u4', en:'pencil',    kk:'қарындаш',     g:'school', ex:'Where is my pencil?'},
  {u:'u4', en:'ruler',     kk:'сызғыш',       g:'school', ex:'The ruler is long.'},
  {u:'u4', en:'rubber',    kk:'өшіргіш',      g:'school', ex:'Can I have a rubber?'},
  {u:'u4', en:'notebook',  kk:'дәптер',       g:'school', ex:'Open your notebook.'},
  {u:'u4', en:'desk',      kk:'парта',        g:'school', ex:'My desk is clean.'},
  /* u5 · Түстер */
  {u:'u5', en:'colour',    kk:'түс',          g:'colour', ex:'What colour is it?'},
  {u:'u5', en:'red',       kk:'қызыл',        g:'colour', ex:'The apple is red.'},
  {u:'u5', en:'blue',      kk:'көк',          g:'colour', ex:'The sky is blue.'},
  {u:'u5', en:'green',     kk:'жасыл',        g:'colour', ex:'The tree is green.'},
  {u:'u5', en:'yellow',    kk:'сары',         g:'colour', ex:'The sun is yellow.'},
  {u:'u5', en:'black',     kk:'қара',         g:'colour', ex:'My bag is black.'},
  {u:'u5', en:'white',     kk:'ақ',           g:'colour', ex:'The paper is white.'},
  {u:'u5', en:'orange',    kk:'қызғылт сары', g:'colour', ex:'I like orange colour.'},
  /* u6 · Менің сыныбым */
  {u:'u6', en:'classroom', kk:'сынып',        g:'school', ex:'Our classroom is big.'},
  {u:'u6', en:'board',     kk:'тақта',        g:'school', ex:'Look at the board.'},
  {u:'u6', en:'window',    kk:'терезе',       g:'school', ex:'There is a window.'},
  {u:'u6', en:'door',      kk:'есік',         g:'school', ex:'Close the door, please.'},
  {u:'u6', en:'chair',     kk:'орындық',      g:'school', ex:'Sit on the chair.'},
  {u:'u6', en:'table',     kk:'үстел',        g:'school', ex:'The table is brown.'},
  {u:'u6', en:'map',       kk:'карта',        g:'school', ex:'There is a map here.'},
  {u:'u6', en:'clock',     kk:'сағат',        g:'school', ex:'The clock is on the wall.'}
];

window.WORDS.byUnit = function (u) {
  return window.WORDS.filter(function (w) { return w.u === u; });
};
window.WORDS.upTo = function (u) {
  var n = parseInt(String(u).slice(1), 10);
  return window.WORDS.filter(function (w) { return parseInt(w.u.slice(1), 10) <= n; });
};
