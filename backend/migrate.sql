-- Дописать колонки согласия в уже созданную таблицу.
-- Supabase → SQL Editor → Run. Безопасно запускать повторно.
alter table public.en_students add column if not exists consent_at timestamptz;
alter table public.en_students add column if not exists consent_v  text;

select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'en_students'
order by ordinal_position;
