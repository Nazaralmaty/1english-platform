/*!
 * 1English · мост «курс → игровые арены».
 *
 * Арены перенесены из StudyLine и ждут глобальный WORDS со своим форматом:
 * {u, en, kk, g, ex}. Курс живёт в app/course.js и знает только про уроки,
 * поэтому банк собирается здесь, а не дублируется вторым файлом со словами.
 *
 * kk оставлено ради совместимости с кодом арен: в него кладётся русский
 * перевод. Переписывать три игры ради имени поля дороже, чем эта строка.
 *
 * g — смысловая группа, по ней сортировочная арена строит корзины, а
 * Flappy берёт правдоподобный неверный вариант. Группа игровая, в курсе она
 * не нужна, поэтому таблица лежит рядом с игрой, а не в данных урока.
 */
(function (global) {
  'use strict';

  var GROUP = {
    /* действие */
    swim:'act', drive:'act', ask:'act', lift:'act', borrow:'act',
    'get up':'act', work:'act', study:'act', help:'act', watch:'act', finish:'act',
    call:'act', stay:'act', wait:'act', cook:'act', rain:'act', wear:'act',
    try:'act', listen:'act', visit:'act', move:'act', promise:'act', hope:'act',
    happen:'act', afford:'act', invite:'act', repair:'act', deliver:'act', guess:'act',
    /* предмет */
    student:'thing', sister:'thing', friend:'thing', city:'thing', ticket:'thing',
    dinner:'thing', brother:'thing', phone:'thing', pet:'thing', money:'thing',
    time:'thing', homework:'thing', question:'thing', idea:'thing', noise:'thing',
    plan:'thing', advice:'thing', chance:'thing', order:'thing',
    /* признак */
    tired:'sign', busy:'sign', ready:'sign', late:'sign', strong:'sign',
    cheap:'sign', expensive:'sign', crowded:'sign', quiet:'sign', better:'sign',
    worse:'sign', available:'sign', sure:'sign', stuck:'sign',
    /* время */
    yesterday:'time', 'last week':'time', ago:'time', 'right now':'time',
    tomorrow:'time', 'next month':'time',
    /* служебное */
    never:'word', usually:'word', than:'word', enough:'word', maybe:'word',
    ever:'word', already:'word', yet:'word', just:'word', since:'word', for:'word',
    abroad:'word', if:'word', would:'word', unless:'word', 'in my place':'word',
    by:'word', 'must be':'word', "can’t be":'word', might:'word', could:'word',
    probably:'word'
  };

  /* Слова уровня, на котором ученик сейчас. Уровня нет (открыли игру
     напрямую) — берём весь курс, пустая арена хуже чужих слов. */
  function levelId() {
    try { return (JSON.parse(localStorage.getItem('1eng.v2')) || {}).level || null; }
    catch (e) { return null; }
  }

  var lv = levelId(), out = [];
  (global.COURSE ? global.COURSE.levels : []).forEach(function (l) {
    if (lv && l.id !== lv) return;
    l.lessons.forEach(function (s) {
      s.words.forEach(function (w) {
        /* «go / went» — это пара форм, а не слово: в проёме Flappy и в
           корзине сортировки она читается как ошибка. Оставляем словарю. */
        if (w.en.indexOf('/') >= 0) return;
        out.push({ u: s.id, en: w.en, kk: w.ru, ru: w.ru, ex: w.ex, g: GROUP[w.en] || 'word' });
      });
    });
  });
  if (!out.length && global.COURSE) {
    global.COURSE.levels.forEach(function (l) {
      l.lessons.forEach(function (s) {
        s.words.forEach(function (w) {
          if (w.en.indexOf('/') < 0) out.push({ u: s.id, en: w.en, kk: w.ru, ru: w.ru, ex: w.ex, g: GROUP[w.en] || 'word' });
        });
      });
    });
  }

  global.WORDS = out;
})(window);
