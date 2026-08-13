-- =============================================================================
-- VIBHA Practice Layer — habit layer: streaks, quests, cards (Rounds), goals
-- =============================================================================
-- Streaks count SHOWING UP, not scoring. IST rollover (all times localised).

-- ---------------------------------------------------------------------------
-- cards + card_reviews — Rounds (Part 6.5), ts-fsrs scheduler
-- ---------------------------------------------------------------------------
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  lesson_id uuid references public.lessons (id) on delete set null,
  front text not null,
  back text not null,
  source text not null default 'ai_generated'
    check (source in ('ai_generated','faculty','manual')),
  status text not null default 'draft'
    check (status in ('draft','in_review','published','archived')),
  approved boolean not null default false,
  approved_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.card_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  card_id uuid not null references public.cards (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- ts-fsrs state
  stability numeric not null default 0,
  difficulty numeric not null default 0,
  retrievability numeric not null default 0,
  due_at timestamptz not null default now(),
  rating integer not null check (rating between 1 and 4),
  reviewed_at timestamptz not null default now(),
  unique (card_id, user_id)
);

-- ---------------------------------------------------------------------------
-- streaks — IST rollover, freezes
-- ---------------------------------------------------------------------------
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  freezes_used_this_month integer not null default 0,
  manual_grace_used integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- quests + quest_progress — weekly quests, 3 mixed modality
-- ---------------------------------------------------------------------------
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  title text not null,
  description text,
  quest_type text not null check (quest_type in ('sct','rounds','sim','formulation','osce','journal','custom')),
  target_count integer not null default 1,
  week_label text not null, -- e.g. "2026-W34"
  starts_at date not null,
  ends_at date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quest_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  quest_id uuid not null references public.quests (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  count integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (quest_id, user_id)
);

-- ---------------------------------------------------------------------------
-- cohort goals — shared goal bar, default on
-- ---------------------------------------------------------------------------
create table if not exists public.cohort_goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  title text not null,
  goal_count integer not null default 0,
  activity_type text not null default 'sim'
    check (activity_type in ('sim','sct','rounds','journal','custom')),
  week_label text,
  created_at timestamptz not null default now()
);

create table if not exists public.cohort_goal_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  goal_id uuid not null references public.cohort_goals (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (goal_id, user_id)
);

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.cards enable row level security;
alter table public.card_reviews enable row level security;
alter table public.streaks enable row level security;
alter table public.quests enable row level security;
alter table public.quest_progress enable row level security;
alter table public.cohort_goals enable row level security;
alter table public.cohort_goal_progress enable row level security;

-- cards: published visible; admin manages.
create policy "cards_select_published" on public.cards
  for select using (status = 'published' and approved = true or public.is_admin());
create policy "cards_admin_manage" on public.cards
  for all using (public.is_admin()) with check (public.is_admin());

-- card_reviews: owner + admin.
create policy "card_reviews_select_own_or_admin" on public.card_reviews
  for select using (auth.uid() = user_id or public.is_admin());
create policy "card_reviews_insert_own" on public.card_reviews
  for insert with check (auth.uid() = user_id);
create policy "card_reviews_update_own" on public.card_reviews
  for update using (auth.uid() = user_id);

-- streaks: owner only (+ admin).
create policy "streaks_select_own_or_admin" on public.streaks
  for select using (auth.uid() = user_id or public.is_admin());
create policy "streaks_insert_own" on public.streaks
  for insert with check (auth.uid() = user_id);
create policy "streaks_update_own" on public.streaks
  for update using (auth.uid() = user_id);

-- quests: all students see active quests; admin manages.
create policy "quests_select_all" on public.quests
  for select using (true);
create policy "quests_admin_manage" on public.quests
  for all using (public.is_admin()) with check (public.is_admin());

-- quest_progress: owner + admin.
create policy "quest_progress_select_own_or_admin" on public.quest_progress
  for select using (auth.uid() = user_id or public.is_admin());
create policy "quest_progress_insert_own" on public.quest_progress
  for insert with check (auth.uid() = user_id);
create policy "quest_progress_update_own" on public.quest_progress
  for update using (auth.uid() = user_id);

-- cohort goals: all see; progress owner + admin.
create policy "cohort_goals_select_all" on public.cohort_goals
  for select using (true);
create policy "cohort_goals_admin_manage" on public.cohort_goals
  for all using (public.is_admin()) with check (public.is_admin());
create policy "cohort_goal_progress_select_own_or_admin" on public.cohort_goal_progress
  for select using (auth.uid() = user_id or public.is_admin());
create policy "cohort_goal_progress_insert_own" on public.cohort_goal_progress
  for insert with check (auth.uid() = user_id);
create policy "cohort_goal_progress_update_own" on public.cohort_goal_progress
  for update using (auth.uid() = user_id);

-- indexes
create index if not exists idx_card_reviews_due on public.card_reviews (user_id, due_at);
create index if not exists idx_quests_week on public.quests (week_label);
