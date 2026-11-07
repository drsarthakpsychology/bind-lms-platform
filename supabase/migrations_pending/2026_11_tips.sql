-- =============================================================================
-- First-time tips: which short how-to boxes a student has already closed
-- ("Got it"), so they are not shown again on another device.
-- Additive and safe to run any time. Until this runs, the app keeps the same
-- list in the browser (localStorage) and nothing breaks.
-- =============================================================================
create table if not exists public.tip_dismissals (
  user_id uuid not null references auth.users (id) on delete cascade,
  tip_id text not null check (char_length(tip_id) between 1 and 64),
  dismissed_at timestamptz not null default now(),
  primary key (user_id, tip_id)
);
alter table public.tip_dismissals enable row level security;

drop policy if exists "tip_dismissals_own_select" on public.tip_dismissals;
create policy "tip_dismissals_own_select" on public.tip_dismissals
  for select using (auth.uid() = user_id);
drop policy if exists "tip_dismissals_own_insert" on public.tip_dismissals;
create policy "tip_dismissals_own_insert" on public.tip_dismissals
  for insert with check (auth.uid() = user_id);
drop policy if exists "tip_dismissals_own_delete" on public.tip_dismissals;
create policy "tip_dismissals_own_delete" on public.tip_dismissals
  for delete using (auth.uid() = user_id);
