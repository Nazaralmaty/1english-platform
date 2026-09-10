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
  -- согласие на обработку персональных данных: когда нажал и какую версию
  -- текста видел. Без даты согласие ничего не значит.
  consent_at timestamptz,
  consent_v  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table  public.en_students       is '1English: профиль ученика';
comment on column public.en_students.phone is 'Настоящий номер. Логин — производный от него адрес';


-- Если таблица уже была создана раньше, create table её не трогает. Поэтому
-- новые колонки добавляются отдельно: скрипт должен доводить до нужного вида
-- и старую базу, а не только пустую.
alter table public.en_students add column if not exists phone      text;
alter table public.en_students add column if not exists name       text;
alter table public.en_students add column if not exists birth      date;
alter table public.en_students add column if not exists gender     text;
alter table public.en_students add column if not exists level      text;
alter table public.en_students add column if not exists lang       text not null default 'ru';
alter table public.en_students add column if not exists theme      text not null default 'system';
alter table public.en_students add column if not exists consent_at timestamptz;
alter table public.en_students add column if not exists consent_v  text;


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


-- ── 4. Кто смотрит дашборд ─────────────────────────────────────────────────
-- Ученик видит только себя. Чтобы видеть всех, аккаунт должен лежать в этой
-- таблице. Номер сюда не пишется: здесь id пользователя из auth.users.
--
-- КАК ДОБАВИТЬ СЕБЯ.
--   1. Сначала войдите в платформу своим номером — без этого аккаунта нет.
--   2. Потом одной строкой, со своим номером в любом виде:
--
--        select public.en_make_admin('+7 701 123 45 67');
--
--      Функция сама найдёт id и ответит словами, что получилось.

create table if not exists public.en_admins (
  id         uuid primary key references auth.users on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

-- Ищет пользователя по номеру и кладёт его в en_admins.
-- security definer нужен, чтобы функция дотянулась до auth.users; сразу
-- после неё права на вызов отбираются у всех, кроме владельца базы —
-- иначе любой залогиненный сделал бы админом сам себя и увидел всех.
create or replace function public.en_make_admin(p_phone text)
returns text language plpgsql security definer set search_path = public, auth as $$
declare
  v_digits text;
  v_id     uuid;
begin
  v_digits := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  if length(v_digits) = 10 then v_digits := '7' || v_digits; end if;
  if length(v_digits) = 11 and left(v_digits, 1) = '8' then
    v_digits := '7' || substring(v_digits from 2);
  end if;
  if length(v_digits) <> 11 then
    return 'Не похоже на номер: ' || coalesce(p_phone, '');
  end if;

  select id into v_id from auth.users where email = v_digits || '@1eng.kz';
  if v_id is null then
    return 'Аккаунта с номером ' || v_digits || ' ещё нет. Сначала войдите в платформу этим номером.';
  end if;

  insert into public.en_admins (id, note) values (v_id, v_digits)
  on conflict (id) do nothing;
  return 'Готово: ' || v_digits || ' видит дашборд.';
end $$;

revoke execute on function public.en_make_admin(text) from public;
revoke execute on function public.en_make_admin(text) from anon, authenticated;

-- security definer: функция читает en_admins в обход RLS, иначе политика,
-- которая спрашивает «а он админ?», уходила бы в бесконечную рекурсию.
create or replace function public.en_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.en_admins where id = auth.uid());
$$;


-- ── 5. Правила доступа ─────────────────────────────────────────────────────
-- Без этого anon-ключ открыл бы базу любому. Включать обязательно.

alter table public.en_students enable row level security;
alter table public.en_progress enable row level security;
alter table public.en_admins   enable row level security;

-- старая политика «всё своё» заменяется на разделённые: писать — только своё,
-- читать — своё либо всё, если аккаунт в en_admins
drop policy if exists en_students_own    on public.en_students;
drop policy if exists en_students_read   on public.en_students;
drop policy if exists en_students_write  on public.en_students;
drop policy if exists en_students_update on public.en_students;

create policy en_students_read on public.en_students
  for select using (auth.uid() = id or public.en_is_admin());
create policy en_students_write on public.en_students
  for insert with check (auth.uid() = id);
create policy en_students_update on public.en_students
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists en_progress_own    on public.en_progress;
drop policy if exists en_progress_read   on public.en_progress;
drop policy if exists en_progress_write  on public.en_progress;
drop policy if exists en_progress_update on public.en_progress;

create policy en_progress_read on public.en_progress
  for select using (auth.uid() = student_id or public.en_is_admin());
create policy en_progress_write on public.en_progress
  for insert with check (auth.uid() = student_id);
create policy en_progress_update on public.en_progress
  for update using (auth.uid() = student_id) with check (auth.uid() = student_id);

drop policy if exists en_admins_self on public.en_admins;
create policy en_admins_self on public.en_admins
  for select using (auth.uid() = id);


-- ── 6. Проверка ────────────────────────────────────────────────────────────
-- После Run должно вернуться три строки, у всех rls_on = true.

select tablename, rowsecurity as rls_on
from pg_tables
where schemaname = 'public' and tablename in ('en_students','en_progress','en_admins');
