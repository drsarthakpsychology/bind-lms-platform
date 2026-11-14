-- =============================================================================
-- Case progress: where a student left a half-finished case (the Ward Week
-- day, the escape room door, the clue reached, the OSCE checklist), so it
-- resumes there on any device.
--
-- Stored in answer_history (run 2026_11_answer_history.sql first): one row
-- per student, tool and case, with tool = 'p:<tool>' and the saved step in a
-- new `state` column. The row goes when the case is finished.
--
-- Used by src/lib/cases/progress-server.ts (service role, server only).
-- Until this runs, progress is kept in the browser only (localStorage).
--
-- Additive and idempotent: safe to run any time, any number of times.
-- =============================================================================

alter table public.answer_history add column if not exists state jsonb;

-- Keep a saved step small (the app writes at most 16 KB).
alter table public.answer_history drop constraint if exists answer_history_state_size;
alter table public.answer_history add constraint answer_history_state_size
  check (state is null or pg_column_size(state) <= 32768);
