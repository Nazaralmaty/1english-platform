-- ═══════════════════════════════════════════════════════════════════════════
-- 1English · патч 01.11.2026: два семейных приглашения у каждого ученика.
--
-- Ученик покупает курс себе и получает две ссылки: одну ребёнку (kids/ —
-- мультики), одну старшему (elders/ — фразы для жизни). Ссылка и есть доступ:
-- ни номера, ни кода гость не вводит. Первый телефон, открывший ссылку,
-- становится её хозяином; на другом телефоне она уже не откроется, пока
-- ученик не выпустит новую («Обновить ссылку» в кабинете).
--
-- Гости живут в своей таблице и в en_students не попадают: иначе дашборд
-- считал бы бабушку учеником «без учителя» и красил строку через 48 часов.
-- Прогресс гостя (сколько мультиков, сколько фраз) лежит в той же строке —
-- ученик видит в кабинете, что мама сегодня занималась.
--
-- Запускать в Supabase → SQL Editor целиком. Повторный запуск безопасен.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.en_invites (
  owner      uuid not null references auth.users on delete cascade,
  kind       text not null check (kind in ('kid', 'elder')),
  token      text not null unique,
  device     text,                 -- первый открывший телефон; null — ссылку ещё не открывали
  guest_name text check (length(guest_name) <= 40),
  progress   jsonb not null default '{}'::jsonb,
  opened_at  timestamptz,
  last_seen  timestamptz,
  created_at timestamptz not null default now(),
  primary key (owner, kind)
);
comment on table public.en_invites is '1English: семейные приглашения ученика — ребёнку и старшему';

-- Прямого доступа нет ни у кого, кроме админа на чтение: всё идёт через
-- функции ниже. Токен — ключ к кабинету гостя, раздавать список токенов
-- через REST нельзя.
alter table public.en_invites enable row level security;
drop policy if exists en_invites_admin on public.en_invites;
create policy en_invites_admin on public.en_invites for select using (public.en_is_admin());


create or replace function public.en_invite_token()
returns text language sql volatile set search_path = public, extensions as $$
  select translate(encode(extensions.gen_random_bytes(12), 'base64'), '+/=', '-_');
$$;
revoke execute on function public.en_invite_token() from public, anon, authenticated;


-- Кабинет ученика: обе ссылки и что гости успели. Строки заводятся при
-- первом вызове. Гостям (у них нет строки в en_students) не выдаётся ничего.
create or replace function public.en_my_invites()
returns table (kind text, token text, guest_name text, progress jsonb,
               opened_at timestamptz, last_seen timestamptz)
language plpgsql security definer set search_path = public, extensions as $$
begin
  if auth.uid() is null or not exists (select 1 from public.en_students s where s.id = auth.uid()) then
    return;
  end if;
  insert into public.en_invites (owner, kind, token)
    select auth.uid(), k, public.en_invite_token() from unnest(array['kid', 'elder']) k
    on conflict (owner, kind) do nothing;
  return query
    select i.kind, i.token, i.guest_name, i.progress, i.opened_at, i.last_seen
      from public.en_invites i where i.owner = auth.uid() order by i.kind desc;
end $$;
revoke execute on function public.en_my_invites() from public, anon;
grant   execute on function public.en_my_invites() to authenticated;


-- Новая ссылка взамен старой: гость сменил телефон или ссылка ушла не тому.
-- Старая перестаёт открываться сразу, имя и прогресс гостя остаются.
create or replace function public.en_invite_renew(p_kind text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare v text := public.en_invite_token();
begin
  if auth.uid() is null then return null; end if;
  update public.en_invites set token = v, device = null
   where owner = auth.uid() and kind = p_kind;
  return case when found then v else null end;
end $$;
revoke execute on function public.en_invite_renew(text) from public, anon;
grant   execute on function public.en_invite_renew(text) to authenticated;


-- Гость открыл ссылку. Без входа: токен из 16 случайных символов и есть
-- пропуск. Ответ: ok, kind, имя пригласившего и его номер (кнопка «Рахмет»
-- пишет ему в WhatsApp), имя гостя; либо ok=false и причина bad | taken.
create or replace function public.en_invite_open(p_token text, p_device text, p_name text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r public.en_invites; s public.en_students;
begin
  if p_token is null or length(p_token) > 40 or p_device is null or length(p_device) > 64 then
    return jsonb_build_object('ok', false, 'reason', 'bad');
  end if;
  select * into r from public.en_invites where token = p_token;
  if not found then return jsonb_build_object('ok', false, 'reason', 'bad'); end if;
  if r.device is not null and r.device <> p_device then
    return jsonb_build_object('ok', false, 'reason', 'taken');
  end if;
  update public.en_invites
     set device = p_device,
         guest_name = coalesce(nullif(left(trim(p_name), 40), ''), guest_name),
         opened_at = coalesce(opened_at, now()),
         last_seen = now()
   where token = p_token
  returning * into r;
  select * into s from public.en_students where id = r.owner;
  return jsonb_build_object('ok', true, 'kind', r.kind, 'guest_name', r.guest_name,
                            'owner_name', s.name, 'owner_phone', s.phone, 'owner_gender', s.gender);
end $$;
revoke execute on function public.en_invite_open(text, text, text) from public;
grant   execute on function public.en_invite_open(text, text, text) to anon, authenticated;


-- Прогресс гостя: {"seen":[…], "done":[…]} — что посмотрел и прошёл.
-- Пишет только телефон-хозяин ссылки; больше 4 КБ не принимаем.
create or replace function public.en_invite_ping(p_token text, p_device text, p_progress jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_progress is null or length(p_progress::text) > 4000 then return false; end if;
  update public.en_invites set progress = p_progress, last_seen = now()
   where token = p_token and device = p_device;
  return found;
end $$;
revoke execute on function public.en_invite_ping(text, text, jsonb) from public;
grant   execute on function public.en_invite_ping(text, text, jsonb) to anon, authenticated;


-- Проверка: должно вернуть 0 строк у админа без строки в en_students и две
-- строки у ученика (вызывать из платформы, не из SQL Editor — там нет auth.uid()).
select count(*) as invites_total from public.en_invites;
