-- =============================================================================
-- 2026-11-14  Data saving fixes (docs/qa/DATA_SAVING_2026_11.md)
--
-- Safe to paste into the Supabase SQL editor and run as a whole, any number of
-- times: every step checks before it changes anything, nothing is dropped
-- except the one CHECK it replaces with a wider one, and no row is changed.
--
-- The code fixes in the same branch do not need this file to work: each step
-- below backs up a code change, or closes a gap that no code uses yet.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Weekly check-in: let a student update their own row.
--
-- The check-in form saves with an upsert on (user_id, week_label). Its second
-- save in a week becomes an UPDATE, and checkins had no UPDATE policy, so row
-- level security refused it ("Couldn't save" on every re-submit). The route now
-- writes with the server key; this policy makes the student's own client able
-- to do the same, so the two can never disagree again.
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'checkins' and policyname = 'checkins_update_own'
  ) then
    create policy checkins_update_own on public.checkins
      for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Exam Prep goal: allow "md-psychiatry".
--
-- The app offers five goals (src/lib/prep/catalog.ts GOALS) but the database
-- CHECK only knew four. Saving the goal, or a starting check taken with that
-- goal, failed the CHECK and was dropped without a word. Picking a goal is
-- switched off today, so nothing has been lost yet; this keeps it that way when
-- it is switched back on.
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.prep_profile'::regclass
      and conname = 'prep_profile_goal_check'
      and pg_get_constraintdef(oid) not like '%md-psychiatry%'
  ) then
    alter table public.prep_profile drop constraint prep_profile_goal_check;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.prep_profile'::regclass and conname = 'prep_profile_goal_check'
  ) then
    alter table public.prep_profile add constraint prep_profile_goal_check
      check (goal is null or goal in ('cuet-pg', 'ugc-net', 'mcp-entrance', 'ma-semester', 'md-psychiatry'));
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 3. Lecture progress: keep progress.updated_at fresh on every write.
--
-- The column exists (it bounds how far a saved lecture position may jump), but
-- the trigger from 2026_11_progress_updated_at.sql was never created, so a
-- write that did not set the column (the old "Next lesson" button) left an old
-- time behind. The code now sets it on every write; the trigger makes that
-- true for any write, including future ones.
-- -----------------------------------------------------------------------------
alter table public.progress add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_progress_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.progress'::regclass and tgname = 'progress_touch_updated_at' and not tgisinternal
  ) then
    create trigger progress_touch_updated_at before update on public.progress
      for each row execute function public.touch_progress_updated_at();
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 4. Record that this file ran (the app's own list of applied steps).
-- -----------------------------------------------------------------------------
do $$
begin
  if to_regclass('public._migrations_applied') is not null then
    insert into public._migrations_applied (name)
    select '2026_11_14_data_fixes.sql'
    where not exists (select 1 from public._migrations_applied where name = '2026_11_14_data_fixes.sql');
  end if;
end $$;

commit;
