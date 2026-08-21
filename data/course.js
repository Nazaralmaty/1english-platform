/*!
 * 1English · курс «Балаларға ағылшын», 8 апта × 3 юнит.
 *
 * Каркас всего курса — настоящий: у каждого юнита своя can-do цель в
 * формулировке CEFR («Мен ... аламын»), а не тема грамматики. Контент
 * (слова, упражнения, видео) написан для юнитов первых двух недель;
 * дальше — только цели. Что не написано, отмечено ready:false, и экран
 * «Жол» честно показывает это замком, а не поддельным прогрессом.
 */
window.COURSE = {
  title_kk: 'Балаларға ағылшын · 8 апта',
  level: 'pre-A1 → A2',
  zoom: { day: 'Дс, Ср, Жм', time: '18:00', link: 'https://zoom.us/j/0000000000' },
  units: [
    /* ── 1-апта · Танысу ─────────────────────────────────────────── */
    { id:'u1',  w:1, num:1,  kk:'Сәлем! Мен...',        en:'Hello, I am…',
      cando:'Мен өзімді таныстыра аламын: атым, жасым, қаладан.', gram:'to be: I am / You are', lvl:'pre-A1', ready:true },
    { id:'u2',  w:1, num:2,  kk:'Менің отбасым',        en:'My family',
      cando:'Мен отбасым туралы 4-5 сөйлем айта аламын.', gram:'my / his / her', lvl:'pre-A1', ready:true },
    { id:'u3',  w:1, num:3,  kk:'Сандар мен жас',       en:'Numbers and age',
      cando:'Мен 1-20 санай аламын және жасымды айта аламын.', gram:'How old are you?', lvl:'pre-A1', ready:true },
    /* ── 2-апта · Мектеп ─────────────────────────────────────────── */
    { id:'u4',  w:2, num:4,  kk:'Мектеп заттары',       en:'School things',
      cando:'Мен сөмкемдегі заттарды атай аламын.', gram:'a / an, plural -s', lvl:'pre-A1', ready:true },
    { id:'u5',  w:2, num:5,  kk:'Түстер',               en:'Colours',
      cando:'Мен заттың түсін сұрай және айта аламын.', gram:'What colour is it?', lvl:'pre-A1', ready:true },
    { id:'u6',  w:2, num:6,  kk:'Менің сыныбым',        en:'My classroom',
      cando:'Мен сыныбымда не бар екенін айта аламын.', gram:'There is / There are', lvl:'A1', ready:true },
    /* ── 3-апта · Менің күнім ────────────────────────────────────── */
    { id:'u7',  w:3, num:7,  kk:'Менің күнім',          en:'My day',
      cando:'Мен күнделікті ісімді айта аламын: тұрамын, оқимын, ойнаймын.', gram:'Present Simple, I/you', lvl:'A1' },
    { id:'u8',  w:3, num:8,  kk:'Уақыт',                en:'Time',
      cando:'Мен сағат нешеде екенін сұрай және айта аламын.', gram:"What time is it? at + time", lvl:'A1' },
    { id:'u9',  w:3, num:9,  kk:'Сабақ кестесі',        en:'My timetable',
      cando:'Мен қай күні қандай сабақ бар екенін айта аламын.', gram:'days of the week, on Monday', lvl:'A1' },
    /* ── 4-апта · Тамақ ──────────────────────────────────────────── */
    { id:'u10', w:4, num:10, kk:'Тамақ',                en:'Food',
      cando:'Мен не жегенді ұнататынымды айта аламын.', gram:'I like / I don’t like', lvl:'A1' },
    { id:'u11', w:4, num:11, kk:'Дүкенде',              en:'At the shop',
      cando:'Мен дүкенде бір нәрсе сұрай аламын.', gram:'Can I have…?, How much…?', lvl:'A1' },
    { id:'u12', w:4, num:12, kk:'Дәмі қандай?',         en:'How does it taste?',
      cando:'Мен тағамды сипаттай аламын: тәтті, ащы, дәмді.', gram:'adjectives + is', lvl:'A1' },
    /* ── 5-апта · Үй ─────────────────────────────────────────────── */
    { id:'u13', w:5, num:13, kk:'Менің үйім',           en:'My house',
      cando:'Мен үйімде қандай бөлмелер бар екенін айта аламын.', gram:'There is / are + rooms', lvl:'A1' },
    { id:'u14', w:5, num:14, kk:'Менің бөлмем',         en:'My room',
      cando:'Мен бөлмемдегі заттардың орнын айта аламын.', gram:'in / on / under', lvl:'A1' },
    { id:'u15', w:5, num:15, kk:'Қайда?',               en:'Where is it?',
      cando:'Мен затты іздеп, орнын сұрай аламын.', gram:'Where is / Where are', lvl:'A1' },
    /* ── 6-апта · Хобби ──────────────────────────────────────────── */
    { id:'u16', w:6, num:16, kk:'Хобби',                en:'Hobbies',
      cando:'Мен бос уақытта не істейтінімді айта аламын.', gram:'like + -ing', lvl:'A1' },
    { id:'u17', w:6, num:17, kk:'Спорт',                en:'Sport',
      cando:'Мен қандай спортпен айналысатынымды айта аламын.', gram:'play / do / go', lvl:'A2' },
    { id:'u18', w:6, num:18, kk:'Мен істей аламын',     en:'I can',
      cando:'Мен не істей алатынымды және алмайтынымды айта аламын.', gram:'can / can’t', lvl:'A2' },
    /* ── 7-апта · Ауа райы ───────────────────────────────────────── */
    { id:'u19', w:7, num:19, kk:'Ауа райы',             en:'Weather',
      cando:'Мен бүгінгі ауа райын сипаттай аламын.', gram:"It's + weather", lvl:'A2' },
    { id:'u20', w:7, num:20, kk:'Киім',                 en:'Clothes',
      cando:'Мен киімімді және ауа райына сай не киетінімді айта аламын.', gram:'wear + Present Continuous', lvl:'A2' },
    { id:'u21', w:7, num:21, kk:'Жоспарым',             en:'My plans',
      cando:'Мен демалыста не істейтінімді жоспарлай аламын.', gram:'going to', lvl:'A2' },
    /* ── 8-апта · Саяхат және жоба ───────────────────────────────── */
    { id:'u22', w:8, num:22, kk:'Саяхат',               en:'Travel',
      cando:'Мен қайда барғым келетінін және неге екенін айта аламын.', gram:'want to + verb', lvl:'A2' },
    { id:'u23', w:8, num:23, kk:'Достарым туралы',      en:'About my friends',
      cando:'Мен досымды сипаттай аламын: мінезі, сыртқы келбеті.', gram:'he/she is + adjective', lvl:'A2' },
    { id:'u24', w:8, num:24, kk:'Финалдық жоба',        en:'Final project',
      cando:'Мен өзім туралы 1 минут бейне жаза аламын.', gram:'бәрін бірге', lvl:'A2' }
  ]
};

window.COURSE.byId = function (id) {
  return window.COURSE.units.filter(function (u) { return u.id === id; })[0];
};
