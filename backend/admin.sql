-- Кто смотрит дашборд. Выполнить в Supabase → SQL Editor → Run.
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

-- ↓ подставьте свой номер и выполните ещё раз
select public.en_make_admin('+7 701 123 45 67');
