-- Performance pass Part 2 — missing database indexes.
--
-- Each index below is backed by EXPLAIN ANALYZE evidence of a seq scan /
-- post-scan filter / sort on the actual query the app runs (see
-- PERFORMANCE_FIXES.md Part 2 for the before/after plans). Only columns that
-- are genuinely filtered / joined / ordered by are indexed — NOT defensively.
-- Columns like lessons.status, feature_flags.status, credential_invites.status,
-- profiles.status are intentionally NOT indexed (they are only SELECTed, never
-- filtered on in a WHERE).
--
-- Additive + idempotent. Plain CREATE INDEX (not CONCURRENTLY): this DB is
-- small (hundreds of rows) so the write-lock is momentary, and the migration
-- runner issues each file as one simple query (CONCURRENTLY can't run there).

-- Hot student path: learning-profile / weak-spots reads a student's scores
-- newest-first (was a full seq scan + sort per student).
create index if not exists idx_sim_scores_user_created
  on public.sim_scores (user_id, created_at desc);

-- Admin recency sorts (sim-review, triage, calibration, admin overview).
create index if not exists idx_sim_scores_created
  on public.sim_scores (created_at desc);

-- Resume "active session" + MSE transcript filters (status was a post-scan filter).
create index if not exists idx_sim_sessions_user_status
  on public.sim_sessions (user_id, status, ended_at);

-- Every transcript load sorts after the session index.
create index if not exists idx_sim_turns_session_created
  on public.sim_turns (session_id, created_at);

-- Calibration / sim-review .in(session_id) lookups.
create index if not exists idx_scoring_corrections_session
  on public.scoring_corrections (session_id, created_at);

-- Wall page .in(post_id) loads.
create index if not exists idx_wall_replies_post
  on public.wall_replies (post_id, created_at);

-- Notifications feed .eq(author_id).
create index if not exists idx_wall_posts_author
  on public.wall_posts (author_id, created_at);

-- Moderation queue .eq(status,'open').
create index if not exists idx_wall_reports_status
  on public.wall_reports (status, created_at);

-- Record page + supervision review (user_id/date and signoff_status/date).
create index if not exists idx_supervision_user_date
  on public.supervision_entries (user_id, date desc);
create index if not exists idx_supervision_signoff
  on public.supervision_entries (signoff_status, date desc);

-- Admin pending-review count + submissions page filter.
create index if not exists idx_submissions_status
  on public.submissions (status);

-- Cron alumni transition (role, cohort_ended_at) + admin role filters.
create index if not exists idx_profiles_role_cohort
  on public.profiles (role, cohort_ended_at);

-- Modules route .eq(scope) filters.
create index if not exists idx_profiles_scope
  on public.profiles (scope);

-- RLS subquery + card-draft script correlate transcripts by lesson.
create index if not exists idx_lesson_transcripts_lesson
  on public.lesson_transcripts (lesson_id);

-- A1 retry branch lookup .eq(new_session_id).
create index if not exists idx_sim_branches_new_session
  on public.sim_branches (new_session_id);
