-- Hints and quests (plan section 9, owner decisions 7 Nov 2026).
-- Run after 2026_11_leagues.sql (xp_ledger) and 2026_11_games.sql.
--
-- One XP wallet: every XP earn and spend (quests, buying hints, the shop) is a
-- row in public.xp_ledger. Hints are their own small currency, kept here:
--   pool 'free'   one of today's 3 free hints   (delta 0)
--   pool 'bought' one of today's 3 bought hints (delta 0; the 30 XP is a
--                 'shop:hints_3' row in xp_ledger with ref = the IST day)
--   pool 'spare'  a spare hint used             (delta -1)
--   pool 'earn'   spare hints earned            (delta +n, capped at 10 in code)
-- The spare bank is 5 + the sum of delta.
--
-- `slot` is unique per student, so the daily limits hold even when two
-- requests race ('free:2026-11-07:1' to ':3', 'spare:<n>', 'earn:goal:<day>').
-- (user_id, item, step) is unique, so one hint on one item is charged once.
--
-- Until this runs, the app falls back to 3 free hints a day (tracked as
-- zero-amount 'hint:slot' and 'hint:item' rows in xp_ledger, or a signed
-- cookie when that table is missing too). Spares and buying stay off.

create table if not exists public.hint_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  pool text not null check (pool in ('free', 'bought', 'spare', 'earn')),
  delta int not null default 0 check (delta between -1 and 10),
  slot text not null check (char_length(slot) between 1 and 80),
  game text check (game is null or char_length(game) <= 20),
  item text check (item is null or char_length(item) <= 200),
  step int check (step is null or step between 1 and 5),
  created_at timestamptz not null default now(),
  constraint hint_ledger_slot unique (user_id, slot)
);
create unique index if not exists hint_ledger_item on public.hint_ledger (user_id, item, step) where item is not null;
create index if not exists hint_ledger_user_day on public.hint_ledger (user_id, day desc);

alter table public.hint_ledger enable row level security;
drop policy if exists "hint_ledger_select_own" on public.hint_ledger;
create policy "hint_ledger_select_own" on public.hint_ledger
  for select to authenticated using (auth.uid() = user_id or public.is_admin());
-- Writes only through server code (service role).
revoke insert, update, delete on public.hint_ledger from anon, authenticated;

-- The case table used to keep its own XP spend tally, a second wallet that
-- never saw the shop. Hint spends now live in hint_ledger and xp_ledger only.
-- daily_case_results.xp_spent is no longer read or written; it is kept (not dropped) so no stored data is lost.
