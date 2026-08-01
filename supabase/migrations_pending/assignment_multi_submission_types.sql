-- Assignment submission types: multi-select support.
--
-- The original schema stored a single submission_type ('text' | 'audio') with
-- a CHECK limiting it to those two. This migration relaxes the column to hold
-- a comma-separated list of allowed types (e.g. 'text,audio') and widens the
-- allowed set to the full list the app supports.
--
-- Run in the Supabase SQL Editor. Safe to re-run (idempotent).
-- =============================================================================

-- 1) Drop the restrictive CHECK.
alter table assignments
  drop constraint if exists assignments_submission_type_check;

-- 2) Widen the column to plain text.
alter table assignments
  alter column submission_type type text;

-- 3) Add a CHECK: null or empty is allowed, otherwise a comma-separated list
--    of lowercase tokens (e.g. 'text,audio'). Applied to the hosted DB via
--    `supabase db query`. NOTE: Postgres forbids subqueries in CHECK
--    constraints, so this uses a regex instead of an allow-list subquery.
--    The app writes only known types, so the regex is the right trade-off.
alter table assignments
  add constraint assignments_submission_type_check
  check (
    submission_type is null
    or submission_type = ''
    or submission_type ~ '^[a-z]+(,[a-z]+)*$'
  );

-- 4) Document the column's new meaning.
comment on column assignments.submission_type is
  'Comma-separated list of allowed submission types (text, audio, video, pdf, docx, ppt, zip, url, link, rich_text).';
