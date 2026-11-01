#!/usr/bin/env python3
"""1English · вакансии с английским по Казахстану для вкладки «Вакансии».

python3 backend/jobs.py          # собрать hh.kz → app/jobs.js (≈ 1 мин)
python3 backend/jobs.py --test   # самопроверка разбора, без сети

Раз в неделю его запускает backend/jobs_weekly.sh (launchd на Air): свежий
список целиком заменяет прошлый, поэтому дат в данных нет и старое не копится.
Вакансия не перепечатывается: название, компания, город, зарплата и ссылка
на оригинал. Сеть упала и вакансий меньше 40 — файл не трогаем, остаётся
прошлая неделя.
"""
import html, json, os, re, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'jobs.js')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36'
EN = '(английский OR english OR "английского языка")'
PER = 25     # вакансий на профессию
MIN_TOTAL = 40

# id, ru, kk, что должно быть в названии вакансии (язык запросов hh)
PROFS = [
    ('office',  'Офис и ассистент',      'Кеңсе және ассистент',   'офис-менеджер OR ассистент OR секретарь OR координатор OR "office manager" OR assistant'),
    ('sales',   'Продажи и закупки',      'Сату және сатып алу',    'продаж OR закуп OR ВЭД OR "sales manager" OR "account manager"'),
    ('hotel',   'Отели и туризм',         'Қонақ үй және туризм',   'гостиниц OR отел OR ресепшн OR администратор OR туризм OR турагент OR reception'),
    ('air',     'Авиация и сервис',       'Авиация және сервис',    'бортпроводник OR стюард OR авиа OR аэропорт OR официант OR бариста'),
    ('it',      'IT',                     'IT',                     'разработчик OR программист OR тестировщик OR аналитик OR developer OR QA OR "support"'),
    ('finance', 'Бухгалтерия и финансы',  'Бухгалтерия және қаржы', 'бухгалтер OR финанс OR аудитор OR accountant OR finance'),
    ('logist',  'Логистика',              'Логистика',              'логист OR логистик OR склад OR logistics OR "supply chain"'),
    ('oil',     'Нефть, газ, инженеры',   'Мұнай, газ, инженерлер', 'инженер OR engineer OR нефт OR буров OR HSE'),
    ('teach',   'Учителя и няни',         'Мұғалім және бала күтуші', 'учитель OR преподаватель OR репетитор OR педагог OR няня OR teacher OR tutor'),
    ('market',  'Маркетинг и SMM',        'Маркетинг және SMM',     'маркетолог OR SMM OR marketing OR PR OR контент'),
    ('med',     'Медицина',               'Медицина',               'медсестра OR врач OR фармацевт OR медицинск OR nurse OR doctor'),
]


def get(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'ru'})
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.read().decode('utf-8', 'replace')
    except Exception as e:  # одна упавшая страница не роняет сбор
        print('  ! ' + str(e)[:100], file=sys.stderr)
        return ''


def parse(rss):
    """RSS hh → [{t, c, city, sal, url}]."""
    out = []
    for it in re.findall(r'<item>(.*?)</item>', rss, re.S):
        link = re.search(r'<link>([^<]+)', it)
        title = re.search(r'<title>(.*?)</title>', it, re.S)
        desc = re.search(r'<description>(.*?)</description>', it, re.S)
        if not (link and title):
            continue
        d = re.sub(r'<[^>]+>', '\n', html.unescape(re.sub(r'<!\[CDATA\[|\]\]>', '', desc.group(1) if desc else '')))
        pick = lambda rx: (re.search(rx, d) or [None, ''])[1].strip()
        sal = pick(r'дохода: (.+)')
        out.append({
            't': html.unescape(title.group(1)).strip()[:120],
            'c': pick(r'Вакансия компании: (.+)')[:80],
            'city': pick(r'Регион: (.+)')[:40],
            'sal': '' if 'не указан' in sal else sal[:40],
            'url': link.group(1).strip().split('?')[0],
        })
    return out


def collect():
    def one(prof):
        q = f'NAME:({prof[3]}) AND {EN}'
        rows, seen = [], set()
        for page in (0, 1, 2):
            for j in parse(get('https://hh.ru/search/vacancy/rss?' + urllib.parse.urlencode(
                    {'text': q, 'area': 40, 'order_by': 'publication_time', 'page': page}))):
                key = re.sub(r'\W+', '', (j['t'] + j['c']).lower())
                if key not in seen:
                    seen.add(key)
                    rows.append(dict(j, p=prof[0]))
        return rows[:PER]
    with ThreadPoolExecutor(4) as ex:
        groups = list(ex.map(one, PROFS))
    for p, g in zip(PROFS, groups):
        print(f'  {p[0]:8} {len(g)}')
    return [j for g in groups for j in g]


def write(items):
    data = {'profs': [{'id': p[0], 'ru': p[1], 'kk': p[2]} for p in PROFS], 'items': items}
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* Сгенерировано backend/jobs.py — руками не править. Вакансии hh.kz, где просят английский. */\n')
        f.write('window.JOBS = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')


def test():
    rss = ('<item><title>Senior Accountant</title><link>https://hh.kz/vacancy/1?from=rss</link>'
           '<description><![CDATA[<p>Вакансия компании: Volvo</p> <p>Регион: Алматы</p>'
           '<p>Предполагаемый уровень месячного дохода: от 500 000 ₸</p>]]></description></item>'
           '<item><title>Reception &amp; Admin</title><link>https://hh.kz/vacancy/2</link>'
           '<description><![CDATA[<p>Регион: Астана</p><p>Предполагаемый уровень месячного дохода: не указан</p>]]></description></item>')
    a, b = parse(rss)
    assert a == {'t': 'Senior Accountant', 'c': 'Volvo', 'city': 'Алматы', 'sal': 'от 500 000 ₸',
                 'url': 'https://hh.kz/vacancy/1'}, a
    assert b['t'] == 'Reception & Admin' and b['c'] == '' and b['sal'] == '', b
    assert len({p[0] for p in PROFS}) == len(PROFS)
    print('OK jobs.py')


if __name__ == '__main__':
    if '--test' in sys.argv:
        sys.exit(test())
    items = collect()
    if len(items) < MIN_TOTAL:
        sys.exit(f'только {len(items)} вакансий — app/jobs.js не трогаю')
    write(items)
    print(f'{len(items)} вакансий → {OUT}')
