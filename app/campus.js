/* Вузы для вкладки «Учёба за рубежом»: фото кампуса и города, кто здесь учился,
   направления. Грант каждого вуза — в app/unis.js (поле prog = id гранта).
   Фото — Wikimedia Commons, свободные лицензии (CC0, CC BY, CC BY-SA, PD),
   авторы в поле credit; файлы в assets/unis/. Факты о выпускниках сверены
   с Википедией 01.11.2026. Казахский текст не вычитан носителем. */
window.FIELDS = [
  { id: 'it',   ru: 'IT',          kk: 'IT' },
  { id: 'med',  ru: 'Медицина',    kk: 'Медицина' },
  { id: 'eng',  ru: 'Инженерия',   kk: 'Инженерия' },
  { id: 'biz',  ru: 'Бизнес',      kk: 'Бизнес' },
  { id: 'sci',  ru: 'Наука',       kk: 'Ғылым' },
  { id: 'law',  ru: 'Право',       kk: 'Құқық' },
  { id: 'arts', ru: 'Гуманитарные', kk: 'Гуманитарлық' }
];

/* Коротко о гранте для карточки: что дают и на каком языке учиться. */
window.PROG = {
  nu:      { perk: { ru: 'Бесплатно по госгранту', kk: 'Мемлекеттік грантпен тегін' },     study: { ru: 'На английском', kk: 'Ағылшынша' }, flag: '🇰🇿' },
  turkiye: { perk: { ru: 'Бесплатно + 6 500 лир в месяц', kk: 'Тегін + айына 6 500 лира' }, study: { ru: 'Турецкий или английский', kk: 'Түрікше не ағылшынша' }, flag: '🇹🇷' },
  hungary: { perk: { ru: 'Бесплатно + 43 700 форинтов в месяц', kk: 'Тегін + айына 43 700 форинт' }, study: { ru: 'Английский или венгерский', kk: 'Ағылшынша не венгрше' }, flag: '🇭🇺' },
  korea:   { perk: { ru: 'Бесплатно + 14,4 млн вон в год', kk: 'Тегін + жылына 14,4 млн вон' }, study: { ru: 'Корейский, год языка бесплатно', kk: 'Корейше, тіл жылы тегін' }, flag: '🇰🇷' },
  china:   { perk: { ru: 'Бесплатно + 2 500 юаней в месяц', kk: 'Тегін + айына 2 500 юань' },  study: { ru: 'Китайский, год языка', kk: 'Қытайша, тіл жылы' }, flag: '🇨🇳' },
  czech:   { perk: { ru: 'Бесплатно на чешском', kk: 'Чех тілінде тегін' },                 study: { ru: 'Чешский', kk: 'Чехше' }, flag: '🇨🇿' },
  russia:  { perk: { ru: 'Бесплатно по квоте', kk: 'Квота бойынша тегін' },                 study: { ru: 'Русский', kk: 'Орысша' }, flag: '🇷🇺' },
  germany: { perk: { ru: 'Бесплатно в госвузе', kk: 'Мемлекеттік ЖОО-да тегін' },           study: { ru: 'Немецкий', kk: 'Немісше' }, flag: '🇩🇪' }
};

window.CITIES = {
  astana:   { ru: 'Астана',   kk: 'Астана',   img: 'c_astana',   line: { ru: 'Столица на Есиле: Байтерек, Хан Шатыр и набережная.', kk: 'Есіл бойындағы елорда: Бәйтерек, Хан Шатыр, жағалау.' } },
  istanbul: { ru: 'Стамбул',  kk: 'Стамбул',  img: 'c_istanbul', line: { ru: 'Город на двух континентах: Европа и Азия через Босфор.', kk: 'Екі құрлықтағы қала: Еуропа мен Азияны Босфор бөледі.' } },
  budapest: { ru: 'Будапешт', kk: 'Будапешт', img: 'c_budapest', line: { ru: 'Дунай, Парламент и купальни на горячих источниках.', kk: 'Дунай, Парламент және ыстық бұлақтағы моншалар.' } },
  seoul:    { ru: 'Сеул',     kk: 'Сеул',     img: 'c_seoul',    line: { ru: 'Дворцы Чосон рядом с небоскрёбами и K-pop.', kk: 'Чосон сарайлары, зәулім үйлер және K-pop.' } },
  beijing:  { ru: 'Пекин',    kk: 'Бейжің',   img: 'c_beijing',  line: { ru: 'Запретный город, небоскрёбы и Великая стена за городом.', kk: 'Тыйым салынған қала, зәулім үйлер, қала сыртында Ұлы қорған.' } },
  prague:   { ru: 'Прага',    kk: 'Прага',    img: 'c_prague',   line: { ru: 'Карлов мост, Пражский град и старый город, как из сказки.', kk: 'Карл көпірі, Прага қамалы, ертегідей ескі қала.' } },
  moscow:   { ru: 'Москва',   kk: 'Мәскеу',   img: 'c_moscow',   line: { ru: 'Красная площадь, Кремль и самое большое метро Европы.', kk: 'Қызыл алаң, Кремль және Еуропадағы ең үлкен метро.' } },
  spb:      { ru: 'Санкт-Петербург', kk: 'Санкт-Петербург', img: 'c_spb', line: { ru: 'Белые ночи, Эрмитаж и разводные мосты над Невой.', kk: 'Ақ түндер, Эрмитаж, Нева үстіндегі ашылатын көпірлер.' } },
  munich:   { ru: 'Мюнхен',   kk: 'Мюнхен',   img: 'c_munich',   line: { ru: 'Старый город, BMW и Альпы в часе езды.', kk: 'Ескі қала, BMW, бір сағаттық жерде Альпі.' } },
  berlin:   { ru: 'Берлин',   kk: 'Берлин',   img: 'c_berlin',   line: { ru: 'Музейный остров, Бранденбургские ворота и стартапы.', kk: 'Музейлер аралы, Бранденбург қақпасы, стартаптар.' } }
};

/* who — фото assets/unis/p_<id>.jpg; role: studied (учился) | taught (преподавал) */
window.CAMPUS = [
  { id: 'nu', prog: 'nu', name: 'Nazarbayev University', city: 'astana', since: 2010, img: 'u_nu',
    fields: ['it', 'eng', 'biz', 'sci', 'med'],
    fact: { ru: 'Все предметы на английском, преподаватели со всего мира.', kk: 'Барлық пән ағылшынша, оқытушылар әлемнің түкпір-түкпірінен.' },
    alumni: [] },
  { id: 'bogazici', prog: 'turkiye', name: 'Boğaziçi University', city: 'istanbul', since: 1863, img: 'u_bogazici',
    fields: ['biz', 'eng', 'sci', 'it', 'arts'],
    fact: { ru: 'Кампус на берегу Босфора, учёба на английском.', kk: 'Кампус Босфор жағасында, оқу ағылшынша.' },
    alumni: [{ p: 'davutoglu', ru: 'Ахмет Давутоглу', kk: 'Ахмет Давутоглу', what: { ru: 'Премьер-министр Турции', kk: 'Түркия премьер-министрі' }, role: 'studied' }] },
  { id: 'itu', prog: 'turkiye', name: 'Istanbul Technical University', city: 'istanbul', since: 1773, img: 'u_itu',
    fields: ['eng', 'it', 'arts'],
    fact: { ru: 'Один из старейших технических вузов мира.', kk: 'Әлемдегі ең көне техникалық ЖОО-ның бірі.' },
    alumni: [{ p: 'pamuk', ru: 'Орхан Памук', kk: 'Орхан Памук', what: { ru: 'Нобелевская премия по литературе', kk: 'Әдебиет бойынша Нобель сыйлығы' }, role: 'studied' }] },
  { id: 'bme', prog: 'hungary', name: 'Budapest University of Technology', city: 'budapest', since: 1782, img: 'u_bme',
    fields: ['eng', 'it', 'arts', 'biz'],
    fact: { ru: 'Здания на берегу Дуная, много программ на английском.', kk: 'Ғимараттар Дунай жағасында, ағылшынша бағдарлама көп.' },
    alumni: [{ p: 'rubik', ru: 'Эрнё Рубик', kk: 'Эрнё Рубик', what: { ru: 'Изобрёл кубик Рубика', kk: 'Рубик текшесін ойлап тапты' }, role: 'studied' },
             { p: 'gabor', ru: 'Деннис Габор', kk: 'Деннис Габор', what: { ru: 'Изобрёл голографию, Нобель', kk: 'Голографияны ойлап тапты, Нобель' }, role: 'studied' }] },
  { id: 'elte', prog: 'hungary', name: 'Eötvös Loránd University', city: 'budapest', since: 1635, img: 'u_elte',
    fields: ['sci', 'law', 'it', 'arts'],
    fact: { ru: 'Старейший университет Венгрии.', kk: 'Венгриядағы ең көне университет.' },
    alumni: [{ p: 'neumann', ru: 'Джон фон Нейман', kk: 'Джон фон Нейман', what: { ru: 'Один из отцов компьютера', kk: 'Компьютердің негізін салушылардың бірі' }, role: 'studied' }] },
  { id: 'snu', prog: 'korea', name: 'Seoul National University', city: 'seoul', since: 1946, img: 'u_snu',
    fields: ['med', 'law', 'eng', 'it', 'biz', 'sci'],
    fact: { ru: 'Вуз номер один в Корее.', kk: 'Кореядағы бірінші нөмірлі ЖОО.' },
    alumni: [{ p: 'ban', ru: 'Пан Ги Мун', kk: 'Пан Ги Мун', what: { ru: 'Генсек ООН', kk: 'БҰҰ Бас хатшысы' }, role: 'studied' },
             { p: 'huh', ru: 'Джун Хо', kk: 'Джун Хо', what: { ru: 'Филдсовская премия по математике', kk: 'Математикадан Филдс сыйлығы' }, role: 'studied' }] },
  { id: 'yonsei', prog: 'korea', name: 'Yonsei University', city: 'seoul', since: 1885, img: 'u_yonsei',
    fields: ['med', 'biz', 'it', 'arts'],
    fact: { ru: 'Кампус с зелёными аллеями в центре Сеула.', kk: 'Сеул орталығындағы жасыл аллеялы кампус.' },
    alumni: [{ p: 'bong', ru: 'Пон Джун Хо', kk: 'Пон Джун Хо', what: { ru: 'Режиссёр «Паразитов», четыре «Оскара»', kk: '«Паразиттер» режиссері, төрт «Оскар»' }, role: 'studied' }] },
  { id: 'tsinghua', prog: 'china', name: 'Tsinghua University', city: 'beijing', since: 1911, img: 'u_tsinghua',
    fields: ['eng', 'it', 'biz', 'sci', 'arts'],
    fact: { ru: 'Лучший технический вуз Китая.', kk: 'Қытайдағы ең мықты техникалық ЖОО.' },
    alumni: [{ p: 'xi', ru: 'Си Цзиньпин', kk: 'Си Цзиньпин', what: { ru: 'Председатель КНР', kk: 'ҚХР Төрағасы' }, role: 'studied' }] },
  { id: 'pku', prog: 'china', name: 'Peking University', city: 'beijing', since: 1898, img: 'u_pku',
    fields: ['sci', 'med', 'law', 'biz', 'it'],
    fact: { ru: 'Кампус с озером Вэйминху и пагодой.', kk: 'Вэйминху көлі мен пагодасы бар кампус.' },
    alumni: [{ p: 'robinli', ru: 'Робин Ли', kk: 'Робин Ли', what: { ru: 'Основал Baidu, китайский Google', kk: 'Baidu-ды құрды, қытайлық Google' }, role: 'studied' }] },
  { id: 'charles', prog: 'czech', name: 'Charles University', city: 'prague', since: 1348, img: 'u_charles',
    fields: ['med', 'law', 'sci', 'arts'],
    fact: { ru: 'Старейший университет Центральной Европы.', kk: 'Орталық Еуропадағы ең көне университет.' },
    alumni: [{ p: 'kafka', ru: 'Франц Кафка', kk: 'Франц Кафка', what: { ru: 'Писатель, «Превращение»', kk: 'Жазушы, «Құбылу»' }, role: 'studied' },
             { p: 'einstein', ru: 'Альберт Эйнштейн', kk: 'Альберт Эйнштейн', what: { ru: 'Физик', kk: 'Физик' }, role: 'taught' }] },
  { id: 'msu', prog: 'russia', name: 'МГУ им. Ломоносова', city: 'moscow', since: 1755, img: 'u_msu',
    fields: ['sci', 'law', 'it', 'biz', 'med'],
    fact: { ru: 'Главное здание — сталинская высотка на Воробьёвых горах.', kk: 'Бас ғимарат — Воробьёв тауындағы биік үй.' },
    alumni: [{ p: 'chekhov', ru: 'Антон Чехов', kk: 'Антон Чехов', what: { ru: 'Писатель, учился на врача', kk: 'Жазушы, дәрігерлікке оқыды' }, role: 'studied' },
             { p: 'gorbachev', ru: 'Михаил Горбачёв', kk: 'Михаил Горбачёв', what: { ru: 'Президент СССР', kk: 'КСРО Президенті' }, role: 'studied' }] },
  { id: 'spbu', prog: 'russia', name: 'СПбГУ', city: 'spb', since: 1724, img: 'u_spbu',
    fields: ['sci', 'law', 'med', 'arts'],
    fact: { ru: 'Здание Двенадцати коллегий на Неве, XVIII век.', kk: 'Нева бойындағы Он екі коллегия ғимараты, XVIII ғасыр.' },
    alumni: [{ p: 'pavlov', ru: 'Иван Павлов', kk: 'Иван Павлов', what: { ru: 'Первый нобелевский лауреат России', kk: 'Ресейдің алғашқы Нобель лауреаты' }, role: 'studied' },
             { p: 'perelman', ru: 'Григорий Перельман', kk: 'Григорий Перельман', what: { ru: 'Доказал гипотезу Пуанкаре', kk: 'Пуанкаре гипотезасын дәлелдеді' }, role: 'studied' }] },
  { id: 'tum', prog: 'germany', name: 'Technical University of Munich', city: 'munich', since: 1868, img: 'u_tum',
    fields: ['eng', 'it', 'sci', 'med'],
    fact: { ru: 'Лучший технический вуз Германии.', kk: 'Германиядағы ең мықты техникалық ЖОО.' },
    alumni: [{ p: 'diesel', ru: 'Рудольф Дизель', kk: 'Рудольф Дизель', what: { ru: 'Изобрёл дизельный двигатель', kk: 'Дизель қозғалтқышын ойлап тапты' }, role: 'studied' }] },
  { id: 'lmu', prog: 'germany', name: 'LMU München', city: 'munich', since: 1472, img: 'u_lmu',
    fields: ['med', 'law', 'sci', 'biz', 'arts'],
    fact: { ru: 'Главное здание с фонтанами в центре Мюнхена.', kk: 'Мюнхен орталығындағы субұрқақты бас ғимарат.' },
    alumni: [{ p: 'heisenberg', ru: 'Вернер Гейзенберг', kk: 'Вернер Гейзенберг', what: { ru: 'Нобелевская премия по физике', kk: 'Физикадан Нобель сыйлығы' }, role: 'studied' }] },
  { id: 'hu', prog: 'germany', name: 'Humboldt University of Berlin', city: 'berlin', since: 1810, img: 'u_hu',
    fields: ['law', 'sci', 'arts', 'biz'],
    fact: { ru: 'Здание напротив Оперы на Унтер-ден-Линден.', kk: 'Унтер-ден-Линдендегі Опера театрының қарсы бетінде.' },
    alumni: [{ p: 'einstein', ru: 'Альберт Эйнштейн', kk: 'Альберт Эйнштейн', what: { ru: 'Физик', kk: 'Физик' }, role: 'taught' },
             { p: 'marx', ru: 'Карл Маркс', kk: 'Карл Маркс', what: { ru: 'Философ', kk: 'Философ' }, role: 'studied' }] }
];

/* Авторы фото (Wikimedia Commons). */
window.PHOTO_CREDIT = {
"c_astana": {
"a": "Dauren Nabijan",
"l": "CC0",
"u": "https://commons.wikimedia.org/wiki/File:Astana_Esil_view.jpg"
},
"c_beijing": {
"a": "N509FZ",
"l": "CC BY 4.0",
"u": "https://commons.wikimedia.org/wiki/File:Skyline_of_Beijing_CBD_with_B-5906_approaching_(20211016171955)_(1).jpg"
},
"c_berlin": {
"a": "Kasa Fue, Georgfotoart",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:Museumsinsel_Berlin_Juli_2021_1_(cropped)_b.jpg"
},
"c_budapest": {
"a": "Visions of Domino",
"l": "CC BY 2.0",
"u": "https://commons.wikimedia.org/wiki/File:View_from_Gell%C3%A9rt_Hill_to_the_Danube,_Hungary_-_Budapest_(28493220635).jpg"
},
"c_istanbul": {
"a": "Hunanuk",
"l": "CC0",
"u": "https://commons.wikimedia.org/wiki/File:Historical_peninsula_and_modern_skyline_of_Istanbul.jpg"
},
"c_moscow": {
"a": "U.S. Department of State",
"l": "Public domain",
"u": "https://commons.wikimedia.org/wiki/File:Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg"
},
"c_munich": {
"a": "Martin Falbisoner",
"l": "CC BY-SA 3.0",
"u": "https://commons.wikimedia.org/wiki/File:Frauenkirche_and_Neues_Rathaus_Munich_March_2013.JPG"
},
"c_prague": {
"a": "Moyan Brenn from Italy",
"l": "CC BY 2.0",
"u": "https://commons.wikimedia.org/wiki/File:Prague_(6365119737).jpg"
},
"c_seoul": {
"a": "Eunmi Park",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg"
},
"c_spb": {
"a": "A.Savin",
"l": "FAL",
"u": "https://commons.wikimedia.org/wiki/File:Spb_06-2017_img20_StMichael_Castle_(cropped).jpg"
},
"u_bme": {
"a": "Bonpethu",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:BME_K_building.png"
},
"u_bogazici": {
"a": "MHIRM",
"l": "CC BY-SA 2.0",
"u": "https://commons.wikimedia.org/wiki/File:Anderson_Hall,_Bo%C4%9Fazi%C3%A7i_University_-_December_2016.jpg"
},
"u_charles": {
"a": "Mister No",
"l": "CC BY 3.0",
"u": "https://commons.wikimedia.org/wiki/File:Univerzita_Karlova_v_Praze_Pr%C3%A1vnick%C3%A1_fakulta_-_panoramio.jpg"
},
"u_elte": {
"a": "Globetrotter19",
"l": "CC BY-SA 3.0",
"u": "https://commons.wikimedia.org/wiki/File:ELTE_University_Library,_elements,_2016_Budapest.jpg"
},
"u_hu": {
"a": "A.Savin",
"l": "CC BY-SA 3.0",
"u": "https://commons.wikimedia.org/wiki/File:Berlin-Mitte_Humboldt-Uni_05-2014.jpg"
},
"u_itu": {
"a": "Kurmanbek",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:Gate_of_the_Istanbul_Technical_University_and_metro_entry.jpg"
},
"u_lmu": {
"a": "Perituss",
"l": "CC0",
"u": "https://commons.wikimedia.org/wiki/File:Geschwister-Scholl-Platz_fountain_2015.jpg"
},
"u_msu": {
"a": "Dmitry A. Mottl (cropped by King of Hearts)",
"l": "CC BY-SA 3.0",
"u": "https://commons.wikimedia.org/wiki/File:Moscow_State_University_crop.jpg"
},
"u_nu": {
"a": "Beshbarmak",
"l": "CC-BY-SA-4.0",
"u": "https://en.wikipedia.org/wiki/File:NU_Building.jpg"
},
"u_pku": {
"a": "星外之神",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:Autumn_in_Peking_University%27s_Weiming_Lake_Island_002.jpg"
},
"u_snu": {
"a": "วิทวัส มงคลนวเสถียร",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:SNU_Maingate.jpg"
},
"u_spbu": {
"a": "GAlexandrova",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:5175-2._St._Petersburg._Building_of_the_Twelve_Collegia.jpg"
},
"u_tsinghua": {
"a": "User:Wwbread",
"l": "CC BY-SA 3.0",
"u": "https://commons.wikimedia.org/wiki/File:TsinghuaUniversityGate.JPG"
},
"u_tum": {
"a": "Burkhard Mücke",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:Bibliothek_der_TU_M%C3%BCnchen_07.jpg"
},
"u_yonsei": {
"a": "Tungdangthanh",
"l": "CC BY-SA 4.0",
"u": "https://commons.wikimedia.org/wiki/File:Underwood_Hall_Front.jpg"
}
};
