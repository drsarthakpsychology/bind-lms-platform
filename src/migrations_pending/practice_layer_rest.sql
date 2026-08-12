-- =============================================================================
-- Lumen Practice Layer — journal, check-in, wall, corpus, competencies, usage
-- =============================================================================

-- ---------------------------------------------------------------------------
-- reflective journal — OWNER-ONLY RLS, NO admin read path. Tested.
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  prompt_id text,
  content text not null,
  mood_tag text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- per-entry sharing, revocable, logged
create table if not exists public.journal_shares (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  entry_id uuid not null references public.journal_entries (id) on delete cascade,
  shared_by uuid not null references public.profiles (id) on delete cascade,
  shared_to uuid not null references public.profiles (id) on delete cascade,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- check-ins — NON-CLINICAL. Admin sees cohort aggregate ONLY via a view with
-- no user identifiers.
-- ---------------------------------------------------------------------------
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  workload integer check (workload between 1 and 5),
  energy integer check (energy between 1 and 5),
  preparedness integer check (preparedness between 1 and 5),
  free_line text,
  week_label text not null,
  created_at timestamptz not null default now()
);

-- Cohort-aggregate view — NO user identifiers. This is the ONLY admin read
-- path for check-ins.
create or replace view public.checkins_aggregate as
select
  week_label,
  count(*) as n_responses,
  round(avg(workload)::numeric, 2) as avg_workload,
  round(avg(energy)::numeric, 2) as avg_energy,
  round(avg(preparedness)::numeric, 2) as avg_preparedness
from public.checkins
group by week_label;

-- ---------------------------------------------------------------------------
-- cohort wall — threaded, anonymous toggle (author_id never leaves server
-- on a student query — the SELECT policy hides it entirely).
-- ---------------------------------------------------------------------------
create table if not exists public.wall_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  is_anonymous boolean not null default false,
  is_pinned boolean not null default false,
  is_faculty boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wall_replies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  post_id uuid not null references public.wall_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  is_anonymous boolean not null default false,
  is_faculty boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wall_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  post_id uuid references public.wall_posts (id) on delete cascade,
  reply_id uuid references public.wall_replies (id) on delete cascade,
  reported_by uuid not null references public.profiles (id) on delete cascade,
  reason text,
  status text not null default 'open' check (status in ('open','resolved')),
  created_at timestamptz not null default now()
);


-- reactions — not upvotes. Ranking by popularity selects for confidence,
-- not correctness; reactions signal without ranking.
create table if not exists public.wall_reactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  post_id uuid references public.wall_posts (id) on delete cascade,
  reply_id uuid references public.wall_replies (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  reaction text not null check (reaction in ('heart','insight','question','applause','worry')),
  created_at timestamptz not null default now(),
  unique (post_id, reply_id, author_id, reaction)
);

alter table public.wall_reactions enable row level security;
create policy "wall_reactions_select_visible" on public.wall_reactions
  for select using (public.is_admin() or true);
create policy "wall_reactions_insert_own" on public.wall_reactions
  for insert with check (auth.uid() = author_id);
create policy "wall_reactions_delete_own" on public.wall_reactions
  for delete using (auth.uid() = author_id);
create index if not exists idx_wall_reactions_post on public.wall_reactions (post_id);
create index if not exists idx_wall_reactions_reply on public.wall_reactions (reply_id);

-- ---------------------------------------------------------------------------
-- competencies + events — Skills Passport (Part 6.9)
-- ---------------------------------------------------------------------------
create table if not exists public.competencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  key text not null unique,
  name text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.competency_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  competency_id uuid not null references public.competencies (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (source in ('sim','sct','formulation','mse','osce','rounds','supervision','manual')),
  source_ref uuid,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- supervision — log real-world contact hours with sign-off flow
-- ---------------------------------------------------------------------------
create table if not exists public.supervision_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  competency_id uuid references public.competencies (id),
  activity text not null,
  hours numeric not null default 0,
  date date not null,
  supervisor_name text,
  supervisor_email text,
  signoff_status text not null default 'pending'
    check (signoff_status in ('pending','requested','signed','rejected')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- corpus — R2 raw, Postgres normalised, pgvector embeddings
-- ---------------------------------------------------------------------------
create table if not exists public.corpus_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,
  url text not null,
  licence text not null,
  fetched_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.corpus_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  source_id uuid references public.corpus_sources (id) on delete cascade,
  title text,
  url text,
  licence text,
  hash text,
  raw_path text, -- R2 path
  content text,
  classification jsonb not null default '{}'::jsonb,
  status text not null default 'raw'
    check (status in ('raw','normalised','classified','embedded','rejected')),
  needs_review boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.corpus_chunks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  document_id uuid not null references public.corpus_documents (id) on delete cascade,
  chunk_text text not null,
  embedding halfvec(384),
  style_pattern text not null default 'clinical'
    check (style_pattern in ('clinical','style')),
  created_at timestamptz not null default now()
);

create table if not exists public.style_patterns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  pattern text not null,
  kind text not null check (kind in ('deflection','hesitation','topic_shift','indirect','hedge','self_interruption')),
  source_book text,
  style_pattern text not null default 'style',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- usage + provider health — every AI call logged
-- ---------------------------------------------------------------------------
create table if not exists public.ai_usage_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid references public.profiles (id) on delete set null,
  workload text not null,
  provider text not null,
  tokens_in integer not null default 0,
  tokens_out integer not null default 0,
  latency_ms integer,
  status text not null default 'ok' check (status in ('ok','failover','error')),
  created_at timestamptz not null default now()
);

create table if not exists public.provider_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  provider text not null,
  consecutive_failures integer not null default 0,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (provider)
);

-- ---------------------------------------------------------------------------
-- peer role-play — Part 6.14
-- ---------------------------------------------------------------------------
create table if not exists public.pair_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  case_id uuid references public.sim_cases (id) on delete set null,
  student_a uuid not null references public.profiles (id),
  student_b uuid not null references public.profiles (id),
  role_a text not null default 'patient' check (role_a in ('patient','clinician')),
  status text not null default 'active' check (status in ('active','complete')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Ask the Syllabus — lesson transcripts + chunks (pgvector)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_transcripts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  transcript text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.transcript_chunks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  transcript_id uuid not null references public.lesson_transcripts (id) on delete cascade,
  chunk_text text not null,
  start_seconds numeric,
  embedding halfvec(384),
  created_at timestamptz not null default now()
);

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.journal_entries enable row level security;
alter table public.journal_shares enable row level security;
alter table public.checkins enable row level security;
alter table public.wall_posts enable row level security;
alter table public.wall_replies enable row level security;
alter table public.wall_reports enable row level security;
alter table public.competencies enable row level security;
alter table public.competency_events enable row level security;
alter table public.supervision_entries enable row level security;
alter table public.corpus_sources enable row level security;
alter table public.corpus_documents enable row level security;
alter table public.corpus_chunks enable row level security;
alter table public.style_patterns enable row level security;
alter table public.ai_usage_log enable row level security;
alter table public.provider_health enable row level security;
alter table public.pair_sessions enable row level security;
alter table public.lesson_transcripts enable row level security;
alter table public.transcript_chunks enable row level security;

-- JOURNAL: OWNER-ONLY. No admin path. Deliberate.
create policy "journal_entries_owner_only" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "journal_shares_owner_only" on public.journal_shares
  for all using (auth.uid() = shared_by) with check (auth.uid() = shared_by);

-- checkins: owner writes/reads own; admin reads AGGREGATE VIEW ONLY.
create policy "checkins_select_own" on public.checkins
  for select using (auth.uid() = user_id);
create policy "checkins_insert_own" on public.checkins
  for insert with check (auth.uid() = user_id);

-- wall: anonymous posts never expose author_id to non-admins (RLS hides it).
create policy "wall_posts_select_visible" on public.wall_posts
  for select using (public.is_admin() or is_anonymous = false);
create policy "wall_posts_insert_own" on public.wall_posts
  for insert with check (auth.uid() = author_id);
create policy "wall_posts_admin_manage" on public.wall_posts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "wall_replies_select_visible" on public.wall_replies
  for select using (public.is_admin() or is_anonymous = false);
create policy "wall_replies_insert_own" on public.wall_replies
  for insert with check (auth.uid() = author_id);
create policy "wall_replies_admin_manage" on public.wall_replies
  for all using (public.is_admin()) with check (public.is_admin());

create policy "wall_reports_select_own_or_admin" on public.wall_reports
  for select using (auth.uid() = reported_by or public.is_admin());
create policy "wall_reports_insert_own" on public.wall_reports
  for insert with check (auth.uid() = reported_by);

-- competencies: all read; admin manages.
create policy "competencies_select_all" on public.competencies
  for select using (true);
create policy "competencies_admin_manage" on public.competencies
  for all using (public.is_admin()) with check (public.is_admin());

-- competency_events: owner + admin.
create policy "competency_events_select_own_or_admin" on public.competency_events
  for select using (auth.uid() = user_id or public.is_admin());
create policy "competency_events_insert_own" on public.competency_events
  for insert with check (auth.uid() = user_id);

-- supervision: owner + admin.
create policy "supervision_select_own_or_admin" on public.supervision_entries
  for select using (auth.uid() = user_id or public.is_admin());
create policy "supervision_insert_own" on public.supervision_entries
  for insert with check (auth.uid() = user_id);

-- corpus: admin manages; students may read published-normalised content.
create policy "corpus_admin_manage" on public.corpus_sources
  for all using (public.is_admin()) with check (public.is_admin());
create policy "corpus_admin_manage_docs" on public.corpus_documents
  for all using (public.is_admin()) with check (public.is_admin());
create policy "corpus_admin_manage_chunks" on public.corpus_chunks
  for all using (public.is_admin()) with check (public.is_admin());
create policy "style_patterns_admin_all" on public.style_patterns
  for all using (public.is_admin()) with check (public.is_admin());

-- usage: insert by server (service role), admin + owner read.
create policy "ai_usage_insert_server" on public.ai_usage_log
  for insert with check (true);
create policy "ai_usage_select_own_or_admin" on public.ai_usage_log
  for select using (auth.uid() = user_id or public.is_admin());

create policy "provider_health_admin_all" on public.provider_health
  for all using (public.is_admin()) with check (public.is_admin());

-- pair_sessions: participants + admin.
create policy "pair_sessions_select_participant_or_admin" on public.pair_sessions
  for select using (auth.uid() = student_a or auth.uid() = student_b or public.is_admin());
create policy "pair_sessions_insert_participant" on public.pair_sessions
  for insert with check (auth.uid() = student_a or auth.uid() = student_b);

-- transcripts: admin manages; published lessons' transcripts visible to students.
create policy "lesson_transcripts_select_admin_or_published" on public.lesson_transcripts
  for select using (public.is_admin() or exists (
    select 1 from public.lessons l join public.courses c on c.id = l.course_id
    where l.id = lesson_transcripts.lesson_id and c.is_published = true
  ));
create policy "lesson_transcripts_admin_manage" on public.lesson_transcripts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "transcript_chunks_select_admin_or_published" on public.transcript_chunks
  for select using (public.is_admin());
create policy "transcript_chunks_admin_manage" on public.transcript_chunks
  for all using (public.is_admin()) with check (public.is_admin());


-- Anonymous wall posts are VISIBLE to students but author_id never is.
-- Row-level security cannot hide a column, so students read through a view
-- that nulls author_id for anonymous rows; the base table keeps admin-only
-- select on anonymous rows.
-- Projection-only views run as the QUERYING user (SECURITY INVOKER) so the
-- base tables' RLS applies per viewer. The nulled author_id is the only
-- transformation — no privilege escalation.
create or replace view public.wall_posts_visible
with (security_invoker = true) as
select
  id,
  organization_id,
  content,
  is_anonymous,
  is_faculty,
  is_pinned,
  created_at,
  case when is_anonymous then null else author_id end as author_id
from public.wall_posts;

alter view public.wall_posts_visible owner to postgres;

revoke all on public.wall_posts_visible from anon, authenticated;
grant select on public.wall_posts_visible to authenticated;


-- Anonymous wall REPLIES are visible to students but author_id never is
-- (same treatment as posts — see wall_posts_visible).
create or replace view public.wall_replies_visible
with (security_invoker = true) as
select
  id,
  organization_id,
  post_id,
  content,
  is_anonymous,
  is_faculty,
  created_at,
  case when is_anonymous then null else author_id end as author_id
from public.wall_replies;

alter view public.wall_replies_visible owner to postgres;

revoke all on public.wall_replies_visible from anon, authenticated;
grant select on public.wall_replies_visible to authenticated;

-- indexes
create index if not exists idx_journal_user on public.journal_entries (user_id, created_at);
create index if not exists idx_checkins_week on public.checkins (week_label);
create index if not exists idx_wall_posts_pinned on public.wall_posts (is_pinned, created_at);
create index if not exists idx_corpus_chunks_doc on public.corpus_chunks (document_id);
create index if not exists idx_ai_usage_user on public.ai_usage_log (user_id, created_at);
create index if not exists idx_competency_events_user on public.competency_events (user_id);

-- HNSW indexes on embeddings (vector 768).
create index if not exists idx_corpus_chunks_embedding on public.corpus_chunks
  using hnsw (embedding halfvec_cosine_ops);
create index if not exists idx_transcript_chunks_embedding on public.transcript_chunks
  using hnsw (embedding halfvec_cosine_ops);

-- ---------------------------------------------------------------------------
-- Case Library annotations (v5 §4 — annotate; your notes unlock peers').
-- A private note per (user, doc). When a student has their own note on a
-- doc, the OTHER students' notes on that doc become readable (peers-unlock-
-- after-yours). author_id of a note is visible to those who can read it.
-- ---------------------------------------------------------------------------
create table if not exists public.library_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  document_id uuid not null references public.corpus_documents (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  unique (user_id, document_id)
);

alter table public.library_notes enable row level security;
create policy "library_notes_select_own" on public.library_notes
  for select using (auth.uid() = user_id);
create policy "library_notes_insert_own" on public.library_notes
  for insert with check (auth.uid() = user_id);
create policy "library_notes_update_own" on public.library_notes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "library_notes_admin_all" on public.library_notes
  for all using (public.is_admin()) with check (public.is_admin());
create index if not exists idx_library_notes_doc on public.library_notes (document_id);

-- ---------------------------------------------------------------------------
-- Quiz attempts (round 4) — persisted so /admin/triage can surface low-
-- confidence quiz areas. One row per (user, item) reveal; owner-only RLS,
-- admin reads for the triage signal.
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  item_type text not null default 'quiz',
  chosen integer,
  correct boolean not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;
create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);
create policy "quiz_attempts_select_own_or_admin" on public.quiz_attempts
  for select using (auth.uid() = user_id or public.is_admin());
create index if not exists idx_quiz_attempts_item on public.quiz_attempts (item_id);
