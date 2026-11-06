-- =============================================================================
-- Leagues, XP ledger, standing snapshots, streak repairs, profile alias/title.
-- (docs/plans/STUDENT_LEARNING_PLAN.md §4.3–4.4)
--
-- Additive and safe to run more than once. Nothing is dropped or renamed.
-- Run in Supabase → SQL Editor → paste → Run.
--
-- Every write goes through the server (service role). Students can only READ
-- their own rows; there are no student insert/update policies.
-- Until this runs, the app still works: league pages fall back to live maths
-- and the shop says it is not open yet.
-- =============================================================================

-- 1 ─ Weekly leagues ----------------------------------------------------------
-- One row per student per league week (week = the Monday, IST).
-- tier: 1 Neuron, 2 Synapse, 3 Circuit, 4 Cortex, 5 Mind.
create table if not exists public.league_weeks (
  week date not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  tier int not null default 1 check (tier between 1 and 5),
  group_no int not null default 1 check (group_no >= 1),
  points int not null default 0 check (points >= 0),
  final_rank int check (final_rank is null or final_rank >= 1),
  result text check (result is null or result in ('promoted', 'stayed', 'relegated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (week, user_id)
);
create index if not exists league_weeks_user_idx on public.league_weeks (user_id, week desc);
create index if not exists league_weeks_group_idx on public.league_weeks (week, tier, group_no);
alter table public.league_weeks enable row level security;
drop policy if exists "league_weeks_select_own" on public.league_weeks;
create policy "league_weeks_select_own" on public.league_weeks
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- 2 ─ XP ledger ---------------------------------------------------------------
-- Server-side XP: awards (duel wins, daily case, bonus) are positive; shop
-- spends are negative. `ref` makes an award idempotent (one row per
-- user + source + ref).
create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (char_length(source) between 1 and 80),
  amount int not null check (amount between -100000 and 100000),
  ref text check (ref is null or char_length(ref) <= 120),
  created_at timestamptz not null default now()
);
create index if not exists xp_ledger_user_idx on public.xp_ledger (user_id, created_at desc);
create index if not exists xp_ledger_created_idx on public.xp_ledger (created_at desc);
create unique index if not exists xp_ledger_once on public.xp_ledger (user_id, source, ref) where ref is not null;
alter table public.xp_ledger enable row level security;
drop policy if exists "xp_ledger_select_own" on public.xp_ledger;
create policy "xp_ledger_select_own" on public.xp_ledger
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- 3 ─ Standing snapshots ------------------------------------------------------
-- Taken by the twice-weekly standing job, so the next update can say what
-- changed ("Ananya passed you", "up 6 this month").
create table if not exists public.standing_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  taken_on date not null,
  week date not null,
  league_rank int,
  points int not null default 0,
  percentile int check (percentile is null or percentile between 0 and 100),
  ahead uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (user_id, taken_on)
);
create index if not exists standing_snapshots_user_idx on public.standing_snapshots (user_id, taken_on desc);
alter table public.standing_snapshots enable row level security;
drop policy if exists "standing_snapshots_select_own" on public.standing_snapshots;
create policy "standing_snapshots_select_own" on public.standing_snapshots
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- 4 ─ Streak repairs (one per student per league week) --------------------------
create table if not exists public.streak_repairs (
  user_id uuid not null references public.profiles (id) on delete cascade,
  week date not null,
  used_at timestamptz not null default now(),
  primary key (user_id, week)
);
alter table public.streak_repairs enable row level security;
drop policy if exists "streak_repairs_select_own" on public.streak_repairs;
create policy "streak_repairs_select_own" on public.streak_repairs
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- 5 ─ Profile alias, title and look -------------------------------------------
alter table public.profiles add column if not exists alias text;
alter table public.profiles add column if not exists title text;
alter table public.profiles add column if not exists look text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_alias_check') then
    alter table public.profiles add constraint profiles_alias_check
      check (alias is null or (char_length(alias) between 2 and 20 and alias ~ '^[A-Za-z0-9 ._-]+$'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_title_check') then
    alter table public.profiles add constraint profiles_title_check
      check (title is null or char_length(title) <= 60);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_look_check') then
    alter table public.profiles add constraint profiles_look_check
      check (look is null or char_length(look) <= 40);
  end if;
end $$;
create unique index if not exists profiles_alias_unique on public.profiles (lower(alias)) where alias is not null;

-- Alias, title and look are written by the server only (the title is earned,
-- the look is bought with XP). A separate trigger, so protect_profile_columns()
-- is left exactly as it is.
create or replace function public.protect_profile_rewards()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if NEW.title is distinct from OLD.title
      or NEW.look is distinct from OLD.look
      or NEW.alias is distinct from OLD.alias then
      raise exception 'Cannot change protected profile fields.';
    end if;
  end if;
  return NEW;
end;
$$;
drop trigger if exists protect_profile_rewards on public.profiles;
create trigger protect_profile_rewards
  before update on public.profiles
  for each row execute function public.protect_profile_rewards();
