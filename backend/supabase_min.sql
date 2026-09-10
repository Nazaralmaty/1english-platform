-- ═══════════════════════════════════════════════════════════════════════════
-- 1English · минимальная схема: профиль ученика и его прогресс
-- ═══════════════════════════════════════════════════════════════════════════
--
-- КАК ПРИМЕНИТЬ. Supabase → SQL Editor → New query → вставить целиком → Run.
-- Скрипт можно запускать повторно: он ничего не удаляет и не дублирует.
--
-- ЗАЧЕМ ОТДЕЛЬНЫЙ ФАЙЛ, если есть schema.sql. Тот файл — полная схема на
-- вырост: группы, ұстаз, банк вопросов, проверка ответов на сервере. Здесь
-- ровно два стола, которые нужны прямо сейчас: кто вошёл и что он прошёл.
--
-- ГЛАВНОЕ ПРО ДОСТУП. Платформа — статические файлы, её anon-ключ виден
-- любому, кто откроет исходник страницы. Так и задумано: ключ ничего не
-- открывает сам по себе, вся защита живёт в правилах RLS ниже. Ученик
-- читает и пишет только свои строки, чужие для него не существуют.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 1. Профиль ученика ─────────────────────────────────────────────────────
-- Строка появляется сразу после входа. Вход по номеру телефона: номер
-- превращается в технический адрес 77001234567@1eng.kz, потому что вход по
-- SMS в Supabase требует платного провайдера. Настоящий номер лежит здесь.

create table if not exists public.en_students (
  id         uuid primary key references auth.users on delete cascade,
  phone      text not null,
  name       text check (length(name) <= 40),
  birth      date,
  gender     text check (gender in ('m','f')),
  level      text check (level in ('beginner','elementary','pre-intermediate','intermediate')),
  lang       text not null default 'ru'     check (lang  in ('ru','kk')),
  theme      text not null default 'system' check (theme in ('system','light','dark')),
  -- фото ужато до 256 px и лежит строкой data:URL. Когда фото станет много,
  -- поле переезжает в Supabase Storage, здесь останется ссылка.
  photo      text check (photo is null or length(photo) < 400000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table  public.en_students       is '1English: профиль ученика';
comment on column public.en_students.phone is 'Настоящий номер. Логин — производный от него адрес';


-- ── 2. Прогресс по шагам ───────────────────────────────────────────────────
-- Одна строка на «урок + шаг». Шага три: read (урок), task (задание),
-- words (словарь). У задания дополнительно счёт: сколько верных из скольких.

create table if not exists public.en_progress (
  student_id  uuid not null references public.en_students on delete cascade,
  lesson      text not null check (length(lesson) between 2 and 8),
  step        text not null check (step in ('read','task','words')),
  right_count int check (right_count >= 0),
  total_count int check (total_count >= 0),
  updated_at  timestamptz not null default now(),
  primary key (student_id, lesson, step)
);

create index if not exists en_progress_student_idx
  on public.en_progress (student_id, updated_at desc);


-- ── 3. updated_at сам себя проставляет ─────────────────────────────────────
-- Клиент может забыть, а по этому полю потом считается активность.

create or replace function public.en_touch()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists en_students_touch on public.en_students;
create trigger en_students_touch before update on public.en_students
  for each row execute function public.en_touch();

drop trigger if exists en_progress_touch on public.en_progress;
create trigger en_progress_touch before update on public.en_progress
  for each row execute function public.en_touch();


-- ── 4. Правила доступа ─────────────────────────────────────────────────────
-- Без этого anon-ключ открыл бы базу любому. Включать обязательно.

alter table public.en_students enable row level security;
alter table public.en_progress enable row level security;

drop policy if exists en_students_own on public.en_students;
create policy en_students_own on public.en_students
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists en_progress_own on public.en_progress;
create policy en_progress_own on public.en_progress
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);


-- ── 5. Проверка ────────────────────────────────────────────────────────────
-- После Run должно вернуться две строки: en_students и en_progress.

select tablename, rowsecurity as rls_on
from pg_tables
where schemaname = 'public' and tablename in ('en_students','en_progress');
