/*!
 * 1English · мост «арена → платформа».
 *
 * Арены перенесены из StudyLine и разговаривают контрактом SL.* (init/ready/
 * progress/finish/close). Здесь тот же контракт, но вместо postMessage в
 * мобильное приложение результат кладётся в состояние платформы:
 *   • слово, отвеченное верно/неверно, идёт в очередь повторения;
 *   • завершённая партия закрывает шаг «Ойын аренасы» у текущего юнита.
 * Так игра остаётся отдельным файлом и ничего не знает про экраны.
 */
(function (global) {
  'use strict';
  var qs = new URLSearchParams(location.search);
  var unit = qs.get('u') || '';
  var back = qs.get('back') || '../bala/oiyn.html';
  var listeners = {};

  function app() { return global.App || null; }

  var SL = {
    isInApp: false,                       /* WebView нет — мы в обычном браузере */
    init: function () {},
    ready: function () {},
    on: function (ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); },
    emit: function (ev, d) { (listeners[ev] || []).forEach(function (f) { try { f(d); } catch (e) {} }); },

    /* Сырой прогресс. Слово знаем — отправляем в повторение. */
    progress: function (p) {
      var A = app(); if (!A || !p) return;
      if (p.word) A.seeWord(p.word, !!p.correct);
      if (p.errors) p.errors.forEach(function (e) { A.seeWord(e.word, false); });
      if (p.words)  p.words.forEach(function (w) { A.seeWord(w, true); });
    },

    /* Партия закончена: закрываем шаг юнита и возвращаем ребёнка назад. */
    finish: function (res) {
      var A = app(); if (!A) return;
      SL.progress(res);
      if (unit) { A.unit(unit).game = true; }
      A.touchStreak(); A.save();
    },
    close: function () { location.href = back; }
  };

  global.SL = SL;
  global.SL_BACK = back;
})(window);
