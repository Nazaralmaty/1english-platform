-- ═══════════════════════════════════════════════════════════════════════════
-- 1English · патч 01.11.2026: семейный подарок ученика.
--
-- Каждый ученик получает один случайный промокод (ABCD-EFGH) и две ссылки с
-- ним: детская платформа (kids/) и платформа для старших (elders/). Вход —
-- имя + промокод. Первый вход на платформе закрепляет её за этим именем:
-- тот же человек входит снова (хоть с другого телефона), другое имя с этим
-- промокодом уже не пускают. Детская и старшая — два отдельных места.
--
-- «Рахмет айту» гостя не уходит в WhatsApp, а приходит уведомлением в
-- кабинет ученика: «Аяулым рахмет айтады».
--
-- Гости в en_students не попадают: дашборд не считает бабушку учеником.
-- Запускать в Supabase → SQL Editor целиком. Повторный запуск безопасен,
-- в том числе поверх прошлой версии этого патча (с токенами).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.en_invite_codes (
  owner      uuid primary key references auth.users on delete cascade,
  code       text not null unique check (code ~ '^[A-Z2-9]{8}$'),
  created_at timestamptz not null default now()
);
comment on table public.en_invite_codes is '1English: промокод ученика на семейный подарок';

create table if not exists public.en_invites (
  owner      uuid not null references auth.users on delete cascade,
  kind       text not null check (kind in ('kid', 'elder')),
  primary key (owner, kind)
);
comment on table public.en_invites is '1English: занятое место на детской или старшей платформе';
-- прошлая версия патча держала здесь токен ссылки и телефон
alter table public.en_invites drop column if exists token;
alter table public.en_invites drop column if exists device;
alter table public.en_invites add column if not exists guest_name   text check (length(guest_name) <= 40);
alter table public.en_invites add column if not exists progress     jsonb not null default '{}'::jsonb;
alter table public.en_invites add column if not exists opened_at    timestamptz;
alter table public.en_invites add column if not exists last_seen    timestamptz;
alter table public.en_invites add column if not exists note         text check (length(note) <= 200);
alter table public.en_invites add column if not exists note_at      timestamptz;
alter table public.en_invites add column if not exists note_seen_at timestamptz;
alter table public.en_invites add column if not exists created_at   timestamptz not null default now();

drop function if exists public.en_invite_token();
drop function if exists public.en_invite_renew(text);
drop function if exists public.en_invite_open(text, text, text);
drop function if exists public.en_invite_ping(text, text, jsonb);
drop function if exists public.en_my_invites();

-- Прямого доступа нет, кроме чтения админом: всё через функции ниже.
alter table public.en_invite_codes enable row level security;
alter table public.en_invites      enable row level security;
drop policy if exists en_invite_codes_admin on public.en_invite_codes;
create policy en_invite_codes_admin on public.en_invite_codes for select using (public.en_is_admin());
drop policy if exists en_invites_admin on public.en_invites;
create policy en_invites_admin on public.en_invites for select using (public.en_is_admin());


-- 8 знаков без похожих (0/O, 1/I/L): 30^8 вариантов, перебором не угадать.
create or replace function public.en_new_code()
returns text language plpgsql volatile set search_path = public, extensions as $$
declare a text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; b bytea; s text; i int;
begin
  loop
    b := extensions.gen_random_bytes(8); s := '';
    for i in 0..7 loop s := s || substr(a, 1 + get_byte(b, i) % length(a), 1); end loop;
    exit when not exists (select 1 from public.en_invite_codes where code = s);
  end loop;
  return s;
end $$;
revoke execute on function public.en_new_code() from public, anon, authenticated;

create or replace function public.en_code_norm(p text)
returns text language sql immutable as $$ select upper(regexp_replace(coalesce(p, ''), '[^A-Za-z0-9]', '', 'g')); $$;

create or replace function public.en_name_norm(p text)
returns text language sql immutable as $$ select lower(regexp_replace(trim(coalesce(p, '')), '\s+', ' ', 'g')); $$;


-- Кабинет ученика: промокод (заводится при первом вызове) и обе платформы.
-- Только для учеников: у кого нет строки в en_students, получает null.
create or replace function public.en_my_invites()
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_code text;
begin
  if auth.uid() is null or not exists (select 1 from public.en_students where id = auth.uid()) then
    return null;
  end if;
  insert into public.en_invite_codes (owner, code) values (auth.uid(), public.en_new_code())
    on conflict (owner) do nothing;
  insert into public.en_invites (owner, kind) select auth.uid(), k from unnest(array['kid', 'elder']) k
    on conflict do nothing;
  select code into v_code from public.en_invite_codes where owner = auth.uid();
  return jsonb_build_object('code', v_code) || coalesce((
    select jsonb_object_agg(i.kind, jsonb_build_object(
             'guest_name', i.guest_name, 'progress', i.progress, 'opened_at', i.opened_at,
             'note', i.note, 'note_at', i.note_at,
             'note_new', i.note_at is not null and (i.note_seen_at is null or i.note_at > i.note_seen_at)))
      from public.en_invites i where i.owner = auth.uid()), '{}'::jsonb);
end $$;
revoke execute on function public.en_my_invites() from public, anon;
grant   execute on function public.en_my_invites() to authenticated;


-- Ученик прочитал уведомления «рахмет».
create or replace function public.en_invite_seen()
returns void language sql security definer set search_path = public as $$
  update public.en_invites set note_seen_at = now() where owner = auth.uid() and note_at is not null;
$$;
revoke execute on function public.en_invite_seen() from public, anon;
grant   execute on function public.en_invite_seen() to authenticated;


-- Вход гостя: промокод + платформа + имя. Свободное место закрепляется за
-- этим именем; то же имя входит снова, другое — reason 'taken'. Возвращает
-- прогресс, чтобы на новом телефоне он не начинался с нуля.
create or replace function public.en_guest_enter(p_code text, p_kind text, p_name text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_owner uuid; r public.en_invites; s public.en_students;
begin
  if p_kind not in ('kid', 'elder') or length(trim(coalesce(p_name, ''))) < 2 or length(p_name) > 40 then
    return jsonb_build_object('ok', false, 'reason', 'name');
  end if;
  select owner into v_owner from public.en_invite_codes where code = public.en_code_norm(p_code);
  if v_owner is null then return jsonb_build_object('ok', false, 'reason', 'code'); end if;
  insert into public.en_invites (owner, kind) values (v_owner, p_kind) on conflict do nothing;
  select * into r from public.en_invites where owner = v_owner and kind = p_kind for update;
  if r.guest_name is not null and public.en_name_norm(r.guest_name) <> public.en_name_norm(p_name) then
    return jsonb_build_object('ok', false, 'reason', 'taken');
  end if;
  update public.en_invites
     set guest_name = coalesce(guest_name, left(trim(p_name), 40)),
         opened_at = coalesce(opened_at, now()), last_seen = now()
   where owner = v_owner and kind = p_kind returning * into r;
  select * into s from public.en_students where id = v_owner;
  return jsonb_build_object('ok', true, 'guest_name', r.guest_name, 'progress', r.progress,
                            'owner_name', s.name, 'owner_gender', s.gender);
end $$;
revoke execute on function public.en_guest_enter(text, text, text) from public;
grant   execute on function public.en_guest_enter(text, text, text) to anon, authenticated;


-- Прогресс гостя и «рахмет». Пускают по той же паре промокод + имя.
create or replace function public.en_guest_save(p_code text, p_kind text, p_name text,
                                                p_progress jsonb default null, p_note text default null)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_progress is not null and length(p_progress::text) > 4000 then return false; end if;
  update public.en_invites i
     set progress = coalesce(p_progress, i.progress),
         note     = coalesce(left(nullif(trim(p_note), ''), 200), i.note),
         note_at  = case when nullif(trim(p_note), '') is not null then now() else i.note_at end,
         last_seen = now()
    from public.en_invite_codes c
   where c.code = public.en_code_norm(p_code) and i.owner = c.owner and i.kind = p_kind
     and public.en_name_norm(i.guest_name) = public.en_name_norm(p_name);
  return found;
end $$;
revoke execute on function public.en_guest_save(text, text, text, jsonb, text) from public;
grant   execute on function public.en_guest_save(text, text, text, jsonb, text) to anon, authenticated;


select count(*) as codes from public.en_invite_codes;
