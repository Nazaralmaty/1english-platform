-- Отметки страницы отправки демо (youngfuture-games/zavod/otpravka-*): отправлено / не отправлю.
-- Не данные школы: отдельная таблица, anon видит и пишет только её.
create table if not exists public.zavod_sent (
  lead_id text primary key,
  state   text not null check (state in ('sent', 'dropped')),
  ch      text,
  reason  text,
  at      timestamptz not null default now()
);
alter table public.zavod_sent enable row level security;
drop policy if exists zavod_sent_rw on public.zavod_sent;
create policy zavod_sent_rw on public.zavod_sent for all to anon using (true) with check (true);
grant select, insert, update, delete on public.zavod_sent to anon;
