-- 2026_11_14_scaling_indexes.sql
--
-- What: indexes on foreign-key columns that student pages and admin pages
-- filter or join on, and that had no index (Supabase performance advisor
-- "unindexed_foreign_keys", 113 findings on 2026-11-14; this file covers the
-- ones on read paths). Also the drug_id indexes that psychopharm_tools.sql
-- named but that are not in the live database.
--
-- Why: today every table here is small (under 1,000 rows), so Postgres scans
-- them quickly. At 300 students the per-student tables (doubts, quiz
-- attempts, wall, voice, sim turns) grow about 10 times and these lookups turn
-- into full scans on every page load. Deleting a student also checks each
-- foreign key, which is a full scan per table without these.
--
-- Safety:
-- * Additive only. No data is changed, nothing is dropped.
-- * Idempotent: CREATE INDEX IF NOT EXISTS. Safe to run twice.
-- * Plain CREATE INDEX, not CONCURRENTLY: the Supabase SQL editor sends the
--   whole file as one request, which Postgres runs as one transaction, and
--   CONCURRENTLY is not allowed inside a transaction. Every table here held
--   fewer than 1,000 rows on 2026-11-14 (largest: quiz_attempts about 240,
--   sim_turns about 340, psych tables under 1,200), so each build takes
--   milliseconds and the short write lock is not noticeable.
--   If a table here has grown past about 100,000 rows when you run this, run
--   that one line on its own with CONCURRENTLY added instead.
-- * Not applied by the docs agent. The owner pastes it into the Supabase SQL
--   editor (project hojhzwvuccojqkvkkslw) when ready.
--
-- Left out on purpose (owner decision, see docs/SCALABILITY_30_TO_300.md):
-- * Dropping the duplicate index notifications_user_idx (same as
--   notifications_user_created_idx). Dropping is safe but is a removal.
-- * The 40 "unused index" findings. Several serve features that are off.
-- * Audit-only columns (verified_by, approved_by, created_by, issued_by,
--   source_id). Nothing reads by them on a hot path.

-- Doubts board (every student, every cohort page)
create index if not exists doubts_user_id_idx on public.doubts (user_id);
create index if not exists doubt_replies_user_id_idx on public.doubt_replies (user_id);
create index if not exists doubt_votes_user_id_idx on public.doubt_votes (user_id);
create index if not exists doubt_followups_user_id_idx on public.doubt_followups (user_id);
create index if not exists doubt_followups_notification_id_idx on public.doubt_followups (notification_id);

-- Per-student practice and game history
create index if not exists quiz_attempts_user_id_idx on public.quiz_attempts (user_id);
create index if not exists sim_turns_user_id_idx on public.sim_turns (user_id);
create index if not exists match_answers_user_id_idx on public.match_answers (user_id);
create index if not exists quest_progress_user_id_idx on public.quest_progress (user_id);
create index if not exists cohort_goal_progress_user_id_idx on public.cohort_goal_progress (user_id);
create index if not exists games2_votes_user_id_idx on public.games2_votes (user_id);
create index if not exists ai_case_flags_user_id_idx on public.ai_case_flags (user_id);
create index if not exists formulation_attempts_case_id_idx on public.formulation_attempts (case_id);
create index if not exists mse_attempts_stimulus_id_idx on public.mse_attempts (stimulus_id);
create index if not exists osce_attempts_station_id_idx on public.osce_attempts (station_id);
create index if not exists competency_events_competency_id_idx on public.competency_events (competency_id);
create index if not exists supervision_entries_competency_id_idx on public.supervision_entries (competency_id);
create index if not exists sim_scores_case_id_idx on public.sim_scores (case_id);
create index if not exists sim_sessions_parent_session_id_idx on public.sim_sessions (parent_session_id);

-- Voice sessions
create index if not exists voice_sessions_user_id_idx on public.voice_sessions (user_id);
create index if not exists voice_sessions_session_id_idx on public.voice_sessions (session_id);
create index if not exists voice_metrics_user_id_idx on public.voice_metrics (user_id);
create index if not exists voice_metrics_voice_session_id_idx on public.voice_metrics (voice_session_id);

-- Wall, peer role-play, journal sharing
create index if not exists wall_replies_author_id_idx on public.wall_replies (author_id);
create index if not exists wall_reactions_author_id_idx on public.wall_reactions (author_id);
create index if not exists wall_reports_post_id_idx on public.wall_reports (post_id);
create index if not exists wall_reports_reply_id_idx on public.wall_reports (reply_id);
create index if not exists wall_reports_reported_by_idx on public.wall_reports (reported_by);
create index if not exists formulation_wall_posts_author_id_idx on public.formulation_wall_posts (author_id);
create index if not exists pair_sessions_student_a_idx on public.pair_sessions (student_a);
create index if not exists pair_sessions_student_b_idx on public.pair_sessions (student_b);
create index if not exists pair_messages_sender_id_idx on public.pair_messages (sender_id);
create index if not exists journal_shares_shared_to_idx on public.journal_shares (shared_to);
create index if not exists journal_shares_entry_id_idx on public.journal_shares (entry_id);

-- Access and course structure (read on every dashboard and lecture page)
create index if not exists module_access_student_id_idx on public.module_access (student_id);
create index if not exists credential_invites_user_id_idx on public.credential_invites (user_id);
create index if not exists modules_course_id_idx on public.modules (course_id);
create index if not exists cohorts_course_id_idx on public.cohorts (course_id);
create index if not exists achievements_course_id_idx on public.achievements (course_id);
create index if not exists certificates_course_id_idx on public.certificates (course_id);
create index if not exists cards_lesson_id_idx on public.cards (lesson_id);
create index if not exists transcript_chunks_transcript_id_idx on public.transcript_chunks (transcript_id);
create index if not exists profiles_scope_lesson_id_idx on public.profiles (scope_lesson_id);
create index if not exists master_login_events_user_id_idx on public.master_login_events (user_id);

-- Medicines (psychopharm) reference tables, read by drug on every medicine page
create index if not exists psych_observation_checklist_drug_id_idx on public.psych_observation_checklist (drug_id);
create index if not exists psych_session_observations_drug_id_idx on public.psych_session_observations (drug_id);
create index if not exists psych_red_flags_drug_id_idx on public.psych_red_flags (drug_id);
create index if not exists psych_med_timeline_drug_id_idx on public.psych_med_timeline (drug_id);
create index if not exists psych_case_vignettes_drug_id_idx on public.psych_case_vignettes (drug_id);
create index if not exists psych_therapist_questions_drug_id_idx on public.psych_therapist_questions (drug_id);
create index if not exists psych_clinical_pearls_drug_id_idx on public.psych_clinical_pearls (drug_id);
create index if not exists psych_dose_ranges_drug_id_idx on public.psych_dose_ranges (drug_id);
create index if not exists psych_therapy_planning_drug_id_idx on public.psych_therapy_planning (drug_id);
create index if not exists psych_observation_prompts_drug_id_idx on public.psych_observation_prompts (drug_id);
create index if not exists psych_case_format_notes_drug_id_idx on public.psych_case_format_notes (drug_id);
create index if not exists psych_comorbidity_notes_condition_id_idx on public.psych_comorbidity_notes (condition_id);

-- Refresh planner statistics for the tables touched above.
analyze public.doubts, public.doubt_replies, public.quiz_attempts, public.sim_turns,
        public.module_access, public.wall_replies, public.wall_reactions;
