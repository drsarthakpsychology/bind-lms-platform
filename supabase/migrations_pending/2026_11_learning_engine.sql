-- =============================================================================
-- Learning engine: the adaptive student model ("like Duolingo").
-- Additive and idempotent: safe to run any time, any number of times.
-- Students can READ their own rows (admins read all). Every write goes through
-- the server with the service role (src/lib/learn/model/server.ts), so there
-- are no insert/update policies for signed-in users.
-- The app copes with these tables being absent (reads come back empty).
-- =============================================================================

-- 1. Raw learning events (one row per answer / widget / game round). Columns
--    match exactly what src/app/api/learn/events/route.ts inserts.
create table if not exists public.learn_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  kind text not null,
  ok boolean,
  score real,
  skill text,
  item text,
  prompt text,
  ms integer,
  path text,
  created_at timestamptz not null default now()
);
create index if not exists learn_events_user_created_idx on public.learn_events (user_id, created_at);
alter table public.learn_events enable row level security;
drop policy if exists "learn_events_own_select" on public.learn_events;
create policy "learn_events_own_select" on public.learn_events
  for select using (auth.uid() = user_id or public.is_admin());

-- 2. Ability per student per skill ("topic:competency", e.g. "depression:criteria").
--    theta: Elo/IRT ability (logits). n: graded answers. correct_days: one date
--    per correct first attempt (last 10), used by the mastery rule.
create table if not exists public.skill_state (
  user_id uuid not null references auth.users (id) on delete cascade,
  skill text not null,
  theta real not null default 0,
  n integer not null default 0,
  last_at timestamptz,
  mastery text not null default 'new',
  correct_days date[] not null default '{}',
  primary key (user_id, skill)
);
create index if not exists skill_state_skill_idx on public.skill_state (skill);
alter table public.skill_state enable row level security;
drop policy if exists "skill_state_own_select" on public.skill_state;
create policy "skill_state_own_select" on public.skill_state
  for select using (auth.uid() = user_id or public.is_admin());

-- 3. Difficulty per question (shared by everyone; not personal data).
create table if not exists public.item_stats (
  item text primary key,
  b real not null default 0,
  n integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.item_stats enable row level security;
drop policy if exists "item_stats_signed_in_select" on public.item_stats;
create policy "item_stats_signed_in_select" on public.item_stats
  for select using (auth.uid() is not null);

-- 4. What a student picks instead of the right answer ("mix-ups").
--    skill: where the mix-up last happened (for the "Fix it" link).
create table if not exists public.confusions (
  user_id uuid not null references auth.users (id) on delete cascade,
  chosen text not null,
  correct text not null,
  n integer not null default 0,
  last_at timestamptz not null default now(),
  skill text,
  primary key (user_id, chosen, correct)
);
alter table public.confusions add column if not exists skill text;
alter table public.confusions enable row level security;
drop policy if exists "confusions_own_select" on public.confusions;
create policy "confusions_own_select" on public.confusions
  for select using (auth.uid() = user_id or public.is_admin());

-- 5. Spaced-review cards (FSRS-style), one per student per question.
create table if not exists public.review_cards (
  user_id uuid not null references auth.users (id) on delete cascade,
  item text not null,
  stability real not null,
  difficulty real not null,
  due_at timestamptz not null,
  last_at timestamptz,
  reps integer not null default 0,
  lapses integer not null default 0,
  primary key (user_id, item)
);
create index if not exists review_cards_user_due_idx on public.review_cards (user_id, due_at);
alter table public.review_cards enable row level security;
drop policy if exists "review_cards_own_select" on public.review_cards;
create policy "review_cards_own_select" on public.review_cards
  for select using (auth.uid() = user_id or public.is_admin());

-- 6. The placement quiz result (one row per student; retakes overwrite).
create table if not exists public.placement (
  user_id uuid primary key references auth.users (id) on delete cascade,
  done_at timestamptz not null default now(),
  result jsonb not null default '{}'::jsonb
);
alter table public.placement enable row level security;
drop policy if exists "placement_own_select" on public.placement;
create policy "placement_own_select" on public.placement
  for select using (auth.uid() = user_id or public.is_admin());
