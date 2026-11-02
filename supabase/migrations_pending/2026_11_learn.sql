-- =============================================================================
-- Learn (gamified lessons with Chai the cat). Additive and safe to run any time.
-- One JSON row per student; students can only read/write their own row.
-- The feature starts HIDDEN: switch it on in Admin -> Content -> What's live.
-- =============================================================================
create table if not exists public.learn_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists learn_progress_xp_idx on public.learn_progress (xp desc);
alter table public.learn_progress enable row level security;

drop policy if exists "learn_progress_own_select" on public.learn_progress;
create policy "learn_progress_own_select" on public.learn_progress
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "learn_progress_own_insert" on public.learn_progress;
create policy "learn_progress_own_insert" on public.learn_progress
  for insert with check (auth.uid() = user_id);
drop policy if exists "learn_progress_own_update" on public.learn_progress;
create policy "learn_progress_own_update" on public.learn_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The switch for the admin's "What's live" page (starts hidden).
insert into public.feature_flags (key, status, enabled)
select 'learn', 'off', false
where not exists (select 1 from public.feature_flags where key = 'learn');

-- Retire practice tools that were merged into Learn or the Lectures page.
-- (Rows are kept so nothing that reads them breaks; they are hidden in the UI.)
update public.feature_flags set status = 'off' where key in ('modules', 'rounds');
