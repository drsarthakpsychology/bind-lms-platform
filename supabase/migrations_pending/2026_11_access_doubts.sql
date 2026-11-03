-- =============================================================================
-- Per-student switches, the cohort Doubts board, and the master password.
--
-- Additive and safe to run on the live site: only new tables. Nothing is
-- dropped or renamed. Until this runs, the app behaves exactly as before
-- (nobody has anything switched off, the Doubts page says "coming soon",
-- and the master password can't be set).
-- =============================================================================

-- ------------------------------------------------- per-student switches ---
-- One row = one section switched OFF for one student (e.g. 'games',
-- 'practice', 'tool:judgment'). No row = on.
create table if not exists public.access_blocks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  feature text not null check (char_length(feature) between 2 and 60),
  created_at timestamptz not null default now(),
  created_by uuid,
  primary key (user_id, feature)
);
alter table public.access_blocks enable row level security;
drop policy if exists "access_blocks_own" on public.access_blocks;
create policy "access_blocks_own" on public.access_blocks for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "access_blocks_admin" on public.access_blocks;
create policy "access_blocks_admin" on public.access_blocks for all using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------- doubts ---
-- A doubt belongs to one cohort (null = everyone). Complaints are kept
-- private: only the writer and the admin can see them.
create table if not exists public.doubts (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references public.cohorts (id) on delete set null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 200),
  body text not null default '' check (char_length(body) <= 5000),
  topic text,
  kind text not null default 'doubt' check (kind in ('doubt', 'complaint')),
  status text not null default 'open' check (status in ('open', 'solved', 'hidden')),
  solved_reply_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists doubts_cohort_idx on public.doubts (cohort_id, created_at desc);
create index if not exists doubts_kind_idx on public.doubts (kind, status);
alter table public.doubts enable row level security;
drop policy if exists "doubts_own" on public.doubts;
create policy "doubts_own" on public.doubts for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "doubts_admin" on public.doubts;
create policy "doubts_admin" on public.doubts for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.doubt_replies (
  id uuid primary key default gen_random_uuid(),
  doubt_id uuid not null references public.doubts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists doubt_replies_doubt_idx on public.doubt_replies (doubt_id, created_at);
alter table public.doubt_replies enable row level security;
drop policy if exists "doubt_replies_own" on public.doubt_replies;
create policy "doubt_replies_own" on public.doubt_replies for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "doubt_replies_admin" on public.doubt_replies;
create policy "doubt_replies_admin" on public.doubt_replies for all using (public.is_admin()) with check (public.is_admin());

-- "This helped" marks on answers (one per person per answer).
create table if not exists public.doubt_votes (
  reply_id uuid not null references public.doubt_replies (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);
alter table public.doubt_votes enable row level security;
drop policy if exists "doubt_votes_own" on public.doubt_votes;
create policy "doubt_votes_own" on public.doubt_votes for select using (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------ master password ---
-- Settings only the server can read (no policies = no browser access).
-- The master password is stored as a scrypt hash, never as text.
create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.admin_settings enable row level security;

-- Every sign-in made with the master password, for the admin to review.
create table if not exists public.master_login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  ip text,
  created_at timestamptz not null default now()
);
create index if not exists master_login_events_at on public.master_login_events (created_at desc);
alter table public.master_login_events enable row level security;
