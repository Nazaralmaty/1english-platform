/*!
 * 1English · содержимое юнита u1 «Сәлем! Мен...».
 *
 * Единственный юнит, написанный целиком: видео с чекпоинтами, конспект,
 * четыре упражнения разных типов, голосовое задание и тест из шести
 * вопросов. Остальные юниты повторяют эту же структуру — форма одна,
 * меняется только контент.
 *
 * ВАЖНО: правильные ответы лежат здесь, в исходнике. Это допустимо ровно
 * до Ф3: в Supabase-схеме correct уезжает в закрытую таблицу и наружу
 * никогда не отдаётся (см. план, §3 «Данные и безопасность»).
 */
window.LESSON_U1 = {
  id: 'u1',
  video: {
    src: '../media/u1_sabaq.mp4',
    poster: '../media/u1_poster.jpg',
    /* чекпоинт останавливает видео и спрашивает — это retrieval practice,
       а не «посмотрел и пошёл дальше» */
    checkpoints: [
      { t: 26, q: '«Менің атым Арман» ағылшынша қалай?',
        opts: ['My name is Arman.', 'I name Arman.', 'Me Arman name.'], a: 0,
        ex: '«My name is …» — есімді осылай айтамыз. «I name» деп айтылмайды.' },
      { t: 40, q: 'Танысқанда жауап ретінде не айтамыз?',
        opts: ['Nice to meet you.', 'Nice to see it.', 'Good night.'], a: 0,
        ex: 'Nice to meet you — «танысқаныма қуаныштымын».' },
      { t: 51, q: '«Мен Алматыданмын» дегенді таңда.',
        opts: ['I am from Almaty.', 'I am Almaty.', 'I from Almaty.'], a: 0,
        ex: 'from — «қайдан» дегенді білдіреді, am сөзі міндетті түрде керек.' }
    ]
  },
  notes: [
    { en: 'Hello! / Hi!',            kk: 'Сәлем!' },
    { en: 'My name is Arman.',       kk: 'Менің атым — Арман.' },
    { en: "I'm eleven years old.",   kk: 'Мен он бір жастамын.' },
    { en: 'I am from Almaty.',       kk: 'Мен Алматыданмын.' },
    { en: 'Nice to meet you.',       kk: 'Танысқаныма қуаныштымын.' },
    { en: 'Goodbye! See you.',       kk: 'Сау бол! Кездескенше.' }
  ],
  ex: [
    { type:'match', title:'1 · Сәйкестендір',
      pairs:[['hello','сәлем'],['friend','дос'],['teacher','мұғалім'],['city','қала'],['student','оқушы'],['goodbye','сау бол']] },

    { type:'gap', title:'2 · Сөйлемді толықтыр',
      items:[
        { text:'Hello! My ___ is Aisha.', opts:['name','city','friend'], a:0, ex:'name — есім.' },
        { text:'I ___ from Astana.',      opts:['am','is','are'],        a:0, ex:'I деген сөзбен әрқашан am.' },
        { text:'This is my ___. We study together.', opts:['friend','teacher','city'], a:0, ex:'Бірге оқитын адам — friend.' },
        { text:'___ to meet you!',        opts:['Nice','Name','Hello'],  a:0, ex:'Nice to meet you — тұрақты тіркес.' }
      ] },

    { type:'listen', title:'3 · Тыңда да таңда',
      items:[
        { say:'teacher',  opts:['мұғалім','оқушы','дос'],  a:0 },
        { say:'goodbye',  opts:['сау бол','сәлем','жақсы'], a:0 },
        { say:'city',     opts:['қала','аты','дос'],        a:0 },
        { say:'student',  opts:['оқушы','мұғалім','отбасы'],a:0 }
      ] },

    { type:'write', title:'4 · Ағылшынша жаз',
      items:[
        { kk:'сәлем',   a:'hello' },
        { kk:'дос',     a:'friend' },
        { kk:'мұғалім', a:'teacher' },
        { kk:'қала',    a:'city' }
      ] }
  ],
  voice: {
    task:'Өзіңді таныстыр. Үш сөйлем айт:',
    lines:['Hello! My name is …', 'I am … years old.', 'I am from … .'],
    sec: 30
  },
  test: [
    { q:'Choose the right greeting.', opts:['Hello!','Hollo!','Halo!'], a:0, ex:'Дұрыс жазылуы — hello.' },
    { q:'My name ___ Dana.', opts:['is','am','are'], a:0, ex:'name — ол (it), сондықтан is.' },
    { q:'«Мен оқушымын» —', opts:['I am a student.','I am a teacher.','I am a city.'], a:0, ex:'student — оқушы.' },
    { q:'Which word means «дос»?', opts:['friend','family','father'], a:0, ex:'friend — дос.' },
    { q:'A: Nice to meet you. B: ___', opts:['Nice to meet you, too.','Goodbye.','I am ten.'], a:0, ex:'Жауап ретінде too қосамыз.' },
    { q:'«Сау бол» —', opts:['Goodbye','Hello','Nice'], a:0, ex:'Goodbye — қоштасу.' }
  ]
};
