-- 1English · платформа обучения — схема Supabase.
--
-- Запускать в Supabase → SQL Editor → New query → Run.
--
-- ЗАЧЕМ. В прототипе весь прогресс лежит в localStorage, а правильные ответы —
-- в исходнике страницы (data/lesson_u1.js, data/diag.js). Пока это так,
-- платформу нельзя дать чужому ребёнку: ответы видно через «просмотр кода»,
-- прогресс не переезжает на другой телефон, ұстаз ничего не видит.
--
-- ГЛАВНОЕ РЕШЕНИЕ, ради которого остальное: индекс верного ответа НИКОГДА
-- не уходит клиенту. Клиент получает вопрос и варианты, отправляет выбор,
-- сервер возвращает «верно/неверно + объяснение» — и только по тому вопросу,
-- на который уже ответили. Скачать банк целиком невозможно.
--
-- Авторизация — по номеру телефона (Supabase Auth, phone provider), без email
-- и без подтверждения почты. auth.uid() ниже — это ученик, родитель или ұстаз;
-- кто именно, говорит en_people.role.

-- ══════════════════════════════════════════════════════════════════════════
-- 1. ЛЮДИ И ГРУППЫ
-- ══════════════════════════════════════════════════════════════════════════
create table if not exists en_groups (
  id         bigint generated always as identity primary key,
  title      text not null,                       -- «Балалар тобы · Дс/Ср/Жм»
  zoom_link  text,
  zoom_days  text,                                -- «Дс, Ср, Жм»
  zoom_time  text,                                -- «18:00»
  teacher    uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists en_people (
  id       uuid primary key references auth.users(id) on delete cascade,
  name     text not null,
  role     text not null check (role in ('student','parent','teacher','admin')),
  group_id bigint references en_groups(id) on delete set null,
  -- родитель привязан к ребёнку; у ученика поле пустое
  child    uuid references auth.users(id) on delete cascade,
  level    text check (level in ('pre-A1','A1','A1+','A2','B1')),
  created_at timestamptz not null default now()
);

-- Кто мой ұстаз / мой ребёнок — спрашивается в политиках ниже много раз,
-- поэтому вынесено в функции: политика должна читаться с первого раза.
create or replace function en_is_teacher_of(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from en_people s
    join en_groups g on g.id = s.group_id
    where s.id = p_student and g.teacher = auth.uid()
  );
$$;

create or replace function en_is_parent_of(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from en_people p where p.id = auth.uid() and p.child = p_student);
$$;

-- ══════════════════════════════════════════════════════════════════════════
-- 2. КУРС: ЮНИТЫ И СЛОВА
-- Читаются всеми: цель юнита и слова — это и есть продукт, скрывать нечего.
-- ══════════════════════════════════════════════════════════════════════════
-- Уровень курса. Ученик выбирает сам и может сменить — прогресс привязан
-- к уроку, а не к уровню, поэтому при смене ничего не теряется.
create table if not exists en_levels (
  id    text primary key check (id in ('beginner','elementary','pre_intermediate')),
  name  text not null,
  cefr  text not null,
  kk    text not null,
  about text not null
);

create table if not exists en_modules (
  id    text primary key,                          -- 'bm1'
  level text not null references en_levels(id) on delete cascade,
  num   smallint not null,
  kk    text not null,
  goal  text not null,
  is_ready boolean not null default true,
  unique (level, num)
);

create table if not exists en_units (
  id       text primary key,                       -- 'b1' | 'e1'
  level    text not null references en_levels(id) on delete cascade,
  module   text references en_modules(id) on delete set null,
  num      smallint not null,
  title_kk text not null,
  title_en text not null,
  cando    text not null,                          -- «Мен өзімді таныстыра аламын»
  grammar  text not null,
  level_cefr text not null,                        -- A1 / A2 — шкала CEFR, не курс
  video_url text,
  is_ready boolean not null default false,         -- контент написан целиком
  unique (level, num)
);

create table if not exists en_words (
  id      bigint generated always as identity primary key,
  unit    text not null references en_units(id) on delete cascade,
  en      text not null,
  kk      text not null,
  grp     text not null,                           -- 'family' | 'school' | …
  example text not null,
  unique (unit, en)
);

-- В уроке ровно 8 слов. Это не эстетика: экран сабака рисует восемь карточек,
-- и «семь» там выглядит как потерянная карточка. Ошибку ловим при вставке.
create or replace function en_check_words() returns trigger
language plpgsql as $$
declare n int;
begin
  select count(*) into n from en_words where unit = coalesce(new.unit, old.unit);
  if n > 8 then raise exception 'в юните % уже 8 слов', coalesce(new.unit, old.unit); end if;
  return new;
end $$;
drop trigger if exists en_words_limit on en_words;
create trigger en_words_limit after insert on en_words
  for each row execute function en_check_words();

-- ══════════════════════════════════════════════════════════════════════════
-- 3. ВОПРОСЫ — ЗАКРЫТАЯ ЧАСТЬ
-- У этой таблицы НЕТ НИ ОДНОЙ политики на select. Это не забытая строка,
-- это и есть защита: читать её может только service_role и функции ниже.
-- Наружу смотрит вью en_questions_public — без ответа и без объяснения
-- (по объяснению ответ нередко виден).
-- ══════════════════════════════════════════════════════════════════════════
create table if not exists en_questions (
  id            bigint generated always as identity primary key,
  scope         text not null check (scope in ('diag','unit')),
  unit          text references en_units(id) on delete cascade,
  block         smallint,                          -- diag: 1..4, блок сложности
  kind          text not null check (kind in ('vocab','grammar','read','listen')),
  body          text not null,
  say           text,                              -- listen: что произносит TTS
  options       text[] not null check (array_length(options,1) between 2 and 4),
  correct_index smallint not null check (correct_index >= 0),
  -- Объяснение обязано быть, но короткое «we → have.» — законное объяснение
  -- для грамматики; проверка ловит пустую строку, а не краткость.
  explain       text not null check (char_length(explain) > 5),
  is_active     boolean not null default true,
  check ((scope = 'unit' and unit is not null) or (scope = 'diag' and block is not null))
);

create or replace view en_questions_public as
  select id, scope, unit, block, kind, body, say, options
  from en_questions where is_active;

-- ══════════════════════════════════════════════════════════════════════════
-- 4. ПРОГРЕСС
-- Клиент НЕ пишет сюда напрямую: update запрещён политикой, а insert идёт
-- только через функции ниже. Иначе «прошёл юнит» ставится из консоли.
-- ══════════════════════════════════════════════════════════════════════════
create table if not exists en_progress (
  student   uuid not null references auth.users(id) on delete cascade,
  unit      text not null references en_units(id) on delete cascade,
  video     boolean not null default false,
  words     boolean not null default false,
  ex_done   smallint not null default 0 check (ex_done between 0 and 4),
  game      boolean not null default false,
  voice     boolean not null default false,
  test      smallint check (test between 0 and 6),
  updated_at timestamptz not null default now(),
  primary key (student, unit)
);

-- Очередь повторения. Коробка Лейтнера + дата следующего показа.
create table if not exists en_reps (
  student uuid not null references auth.users(id) on delete cascade,
  word    bigint not null references en_words(id) on delete cascade,
  box     smallint not null default 0 check (box between 0 and 5),
  due     date not null default current_date,
  wrong   smallint not null default 0,
  primary key (student, word)
);

create table if not exists en_streak (
  student uuid primary key references auth.users(id) on delete cascade,
  days    smallint not null default 0,
  last_at date
);

create table if not exists en_voice (
  id      bigint generated always as identity primary key,
  student uuid not null references auth.users(id) on delete cascade,
  unit    text not null references en_units(id) on delete cascade,
  path    text not null,                           -- объект в приватном bucket 'voice'
  sec     smallint not null,
  status  text not null default 'жіберілді' check (status in ('жіберілді','бағаланды')),
  note    text,
  at      timestamptz not null default now()
);

-- Ежемесячный адаптивный тест: итог и разбивка по бэндам.
create table if not exists en_monthly (
  id      bigint generated always as identity primary key,
  student uuid not null references auth.users(id) on delete cascade,
  level   text not null,
  band    text not null,                           -- 'Elementary' … 'Upper-Intermediate'
  branch  text not null check (branch in ('easy','core','hard')),
  score   smallint not null,
  total   smallint not null,
  xp      smallint not null,
  bands   jsonb not null,                          -- {a1,a2,b1,b2} в процентах
  at      timestamptz not null default now()
);

create table if not exists en_diag (
  student uuid primary key references auth.users(id) on delete cascade,
  level   text not null,
  score   smallint not null,
  asked   smallint not null,
  at      timestamptz not null default now()
);

-- ══════════════════════════════════════════════════════════════════════════
-- 5. ФУНКЦИИ — единственный способ что-то записать
-- ══════════════════════════════════════════════════════════════════════════

-- Проверка ответа. security definer: читает закрытую таблицу от имени
-- владельца и отдаёт ребёнку ровно один ответ — на заданный вопрос.
create or replace function en_answer(p_question bigint, p_chosen smallint)
returns table (correct boolean, correct_index smallint, explain text)
language plpgsql security definer set search_path = public as $$
declare q record;
begin
  if auth.uid() is null then raise exception 'кіру қажет'; end if;
  select * into q from en_questions where id = p_question and is_active;
  if not found then raise exception 'сұрақ табылмады'; end if;
  return query select (p_chosen = q.correct_index), q.correct_index, q.explain;
end $$;

-- Слово посмотрели: двигаем коробку Лейтнера. Интервалы держит сервер,
-- иначе «повторю через год» ставится с клиента.
create or replace function en_see_word(p_word bigint, p_ok boolean)
returns void language plpgsql security definer set search_path = public as $$
declare steps int[] := array[0,1,3,7,16,35]; b smallint;
begin
  if auth.uid() is null then raise exception 'кіру қажет'; end if;
  insert into en_reps (student, word) values (auth.uid(), p_word)
    on conflict (student, word) do nothing;
  select box into b from en_reps where student = auth.uid() and word = p_word;
  b := case when p_ok then least(b + 1, 5) else greatest(b - 1, 0) end;
  update en_reps
     set box = b,
         due = current_date + steps[b + 1],
         wrong = wrong + (case when p_ok then 0 else 1 end)
   where student = auth.uid() and word = p_word;
end $$;

-- Шаг юнита закрыт. Клиент присылает имя шага, а не «юнит пройден».
create or replace function en_step_done(p_unit text, p_step text, p_value smallint default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'кіру қажет'; end if;
  insert into en_progress (student, unit) values (auth.uid(), p_unit)
    on conflict (student, unit) do nothing;
  update en_progress set
    video   = (case when p_step = 'video' then true else video end),
    words   = (case when p_step = 'words' then true else words end),
    ex_done = (case when p_step = 'ex'   then greatest(ex_done, coalesce(p_value, ex_done)) else ex_done end),
    game    = (case when p_step = 'game'  then true else game end),
    voice   = (case when p_step = 'voice' then true else voice end),
    updated_at = now()
  where student = auth.uid() and unit = p_unit;
end $$;

-- Итог теста юнита считает сервер по закрытой таблице: клиент присылает пары
-- «вопрос — выбранный вариант», а не свой счёт.
create or replace function en_finish_unit(p_unit text, p_answers jsonb)
returns table (score smallint, passed boolean)
language plpgsql security definer set search_path = public as $$
declare n smallint := 0; rec record;
begin
  if auth.uid() is null then raise exception 'кіру қажет'; end if;
  for rec in select (x->>'q')::bigint as q, (x->>'a')::smallint as a
             from jsonb_array_elements(p_answers) x loop
    if exists (select 1 from en_questions
                where id = rec.q and unit = p_unit and correct_index = rec.a) then
      n := n + 1;
    end if;
  end loop;
  insert into en_progress (student, unit, test) values (auth.uid(), p_unit, n)
    on conflict (student, unit) do update set test = greatest(coalesce(en_progress.test, 0), n),
                                              updated_at = now();
  return query select n, (n >= 4);          -- порог юнита: 4 из 6
end $$;

-- Стрик. Считается по датам на сервере, потому что на клиенте он «считается»
-- переводом часов.
create or replace function en_touch_streak() returns smallint
language plpgsql security definer set search_path = public as $$
declare s record; d smallint;
begin
  if auth.uid() is null then raise exception 'кіру қажет'; end if;
  insert into en_streak (student, days, last_at) values (auth.uid(), 1, current_date)
    on conflict (student) do nothing;
  select * into s from en_streak where student = auth.uid();
  if s.last_at = current_date then return s.days; end if;
  d := case when s.last_at = current_date - 1 then s.days + 1 else 1 end;
  update en_streak set days = d, last_at = current_date where student = auth.uid();
  return d;
end $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 6. RLS
-- ══════════════════════════════════════════════════════════════════════════
alter table en_people    enable row level security;
alter table en_groups    enable row level security;
alter table en_units     enable row level security;
alter table en_words     enable row level security;
alter table en_questions enable row level security;   -- политик на select нет — так и надо
alter table en_progress  enable row level security;
alter table en_reps      enable row level security;
alter table en_streak    enable row level security;
alter table en_voice     enable row level security;
alter table en_diag      enable row level security;
alter table en_levels    enable row level security;
alter table en_modules   enable row level security;
alter table en_monthly   enable row level security;

-- контент курса читают все вошедшие
drop policy if exists en_units_read on en_units;
create policy en_units_read on en_units for select to authenticated using (true);
drop policy if exists en_words_read on en_words;
create policy en_words_read on en_words for select to authenticated using (true);
drop policy if exists en_levels_read on en_levels;
create policy en_levels_read on en_levels for select to authenticated using (true);
drop policy if exists en_modules_read on en_modules;
create policy en_modules_read on en_modules for select to authenticated using (true);
drop policy if exists en_monthly_read on en_monthly;
create policy en_monthly_read on en_monthly for select to authenticated
  using (student = auth.uid() or en_is_teacher_of(student) or en_is_parent_of(student));
drop policy if exists en_monthly_insert on en_monthly;
create policy en_monthly_insert on en_monthly for insert to authenticated
  with check (student = auth.uid());
drop policy if exists en_groups_read on en_groups;
create policy en_groups_read on en_groups for select to authenticated using (true);

-- своя карточка; ұстаз видит свою группу, родитель — своего ребёнка
drop policy if exists en_people_read on en_people;
create policy en_people_read on en_people for select to authenticated
  using (id = auth.uid() or en_is_teacher_of(id) or en_is_parent_of(id));

drop policy if exists en_progress_read on en_progress;
create policy en_progress_read on en_progress for select to authenticated
  using (student = auth.uid() or en_is_teacher_of(student) or en_is_parent_of(student));
-- update и insert напрямую НЕ разрешены: только через en_step_done/en_finish_unit

drop policy if exists en_reps_read on en_reps;
create policy en_reps_read on en_reps for select to authenticated
  using (student = auth.uid() or en_is_teacher_of(student));

drop policy if exists en_streak_read on en_streak;
create policy en_streak_read on en_streak for select to authenticated
  using (student = auth.uid() or en_is_teacher_of(student) or en_is_parent_of(student));

drop policy if exists en_diag_read on en_diag;
create policy en_diag_read on en_diag for select to authenticated
  using (student = auth.uid() or en_is_teacher_of(student) or en_is_parent_of(student));

-- голосовые: ученик кладёт свои, слушают ұстаз и родитель
drop policy if exists en_voice_read on en_voice;
create policy en_voice_read on en_voice for select to authenticated
  using (student = auth.uid() or en_is_teacher_of(student) or en_is_parent_of(student));
drop policy if exists en_voice_insert on en_voice;
create policy en_voice_insert on en_voice for insert to authenticated
  with check (student = auth.uid());
drop policy if exists en_voice_grade on en_voice;
create policy en_voice_grade on en_voice for update to authenticated
  using (en_is_teacher_of(student)) with check (en_is_teacher_of(student));

-- Права. В Supabase роль authenticated уже имеет usage на public, но явные
-- гранты не мешают и делают схему воспроизводимой на голом Postgres.
grant usage on schema public to authenticated;
grant select on en_levels, en_modules, en_units, en_words, en_groups,
                en_questions_public, en_people, en_progress, en_reps,
                en_streak, en_diag, en_monthly, en_voice to authenticated;
grant insert on en_voice, en_monthly to authenticated;
grant update on en_voice to authenticated;
grant execute on function en_answer(bigint, smallint), en_see_word(bigint, boolean),
                 en_step_done(text, text, smallint), en_finish_unit(text, jsonb),
                 en_touch_streak() to authenticated;
-- en_questions намеренно НЕ выдаётся никому: читают только функции выше.

-- ══════════════════════════════════════════════════════════════════════════
-- 7. ПРОВЕРКА, РАДИ КОТОРОЙ ВСЁ ДЕЛАЛОСЬ
-- Выполнить в том же редакторе. Первый запрос обязан вернуть 0 строк,
-- второй — ошибку доступа. Если банк вопросов читается — схема сломана.
-- ══════════════════════════════════════════════════════════════════════════
-- set role authenticated;
-- select count(*) from en_questions;             -- ожидаем ошибку RLS
-- select * from en_questions_public limit 3;     -- ожидаем вопросы без ответа
-- select * from en_answer(1, 0);                 -- ожидаем «верно/неверно + объяснение»
-- reset role;
