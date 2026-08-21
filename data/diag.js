/*!
 * 1English · входная диагностика. 20 вопросов четырьмя блоками по 5,
 * от pre-A1 к A2. Это не маркетинговый тест: он ставит ребёнка на уровень
 * внутри курса и рисует карту can-do, с которой работает ұстаз.
 *
 * Адаптивность честная и простая: если в блоке меньше двух верных —
 * потолок найден, дальше не спрашиваем. ponytail: без IRT и без модели
 * способности; на 20 вопросах она всё равно ничего не добавит.
 */
window.DIAG = {
  blocks: [
    { lvl:'pre-A1', q:[
      { t:'vocab',   q:'apple —',                       opts:['алма','нан','сүт'],                 a:0 },
      { t:'vocab',   q:'«кітап» —',                     opts:['book','bag','pen'],                 a:0 },
      { t:'grammar', q:'I ___ a student.',              opts:['am','is','are'],                    a:0 },
      { t:'listen',  say:'red',   q:'Не естідің?',      opts:['қызыл','көк','жасыл'],              a:0 },
      { t:'vocab',   q:'Which one is a colour?',        opts:['green','table','sister'],           a:0 }
    ]},
    { lvl:'A1', q:[
      { t:'grammar', q:'She ___ my sister.',            opts:['is','am','are'],                    a:0 },
      { t:'grammar', q:'There ___ two windows.',        opts:['are','is','be'],                    a:0 },
      { t:'vocab',   q:'«сағат» (қабырғадағы) —',       opts:['clock','watch','time'],             a:0 },
      { t:'listen',  say:'thirteen', q:'Қай сан?',      opts:['13','30','3'],                      a:0 },
      { t:'read',    q:'“I get up at 7 and go to school at 8.” Мектепке сағат нешеде барады?',
                     opts:['8','7','9'],                                                           a:0 }
    ]},
    { lvl:'A1+ / A2', q:[
      { t:'grammar', q:'He ___ football every day.',    opts:['plays','play','playing'],           a:0 },
      { t:'grammar', q:'I ___ like fish.',              opts:["don't",'not','no'],                 a:0 },
      { t:'vocab',   q:'Opposite of “cheap” —',         opts:['expensive','small','new'],          a:0 },
      { t:'listen',  say:'She is wearing a jacket.', q:'Не киіп тұр?',
                     opts:['куртка','көйлек','етік'],                                              a:0 },
      { t:'read',    q:'“Sorry, the shop is closed on Sunday.” Жексенбіде дүкен —',
                     opts:['жабық','ашық','түстен кейін ашық'],                                    a:0 }
    ]},
    { lvl:'A2+', q:[
      { t:'grammar', q:'We ___ to Turkey last summer.', opts:['went','go','going'],                a:0 },
      { t:'grammar', q:'If it rains, we ___ at home.',  opts:['will stay','stayed','staying'],     a:0 },
      { t:'vocab',   q:'“I am looking forward to it” дегені —',
                     opts:['асыға күтемін','ұмытып кеттім','мен қарсымын'],                        a:0 },
      { t:'read',    q:'“Although he was tired, he finished the test.” Ол —',
                     opts:['шаршаса да аяқтады','шаршағандықтан тастады','аяқтамады'],             a:0 },
      { t:'listen',  say:'I have already finished my homework.', q:'Үй тапсырмасы —',
                     opts:['бітті','басталған жоқ','ертең'],                                       a:0 }
    ]}
  ],
  /* Порог уровня. Считается по количеству верных из заданных. */
  /* Итог диагностики — совет, какой КУРС брать, а не приговор по уровню.
     Ученик всё равно выбирает сам (см. bala/dengey.html). */
  levelOf: function (score, asked) {
    if (score <= 7)  return { code:'pre-A1', kk:'Нөлден бастаймыз',    course:'beginner' };
    if (score <= 12) return { code:'A1',     kk:'Негізі бар',           course:'beginner' };
    if (score <= 17) return { code:'A1+',    kk:'Жақсы негіз',          course:'elementary' };
    return { code:'A2', kk:'Сенімді деңгей', course:'elementary' };
  }
};
