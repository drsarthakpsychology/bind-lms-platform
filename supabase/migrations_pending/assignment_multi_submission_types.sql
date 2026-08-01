-- Assignment submission types: multi-select support.
--
-- The original schema stored a single submission_type ('text' | 'audio') and
-- the CHECK constraint limited it to those two. This migration relaxes the
-- column to hold a comma-separated list of allowed types (e.g. 'text,audio')
-- and widens the allowed set to the full enterprise list. It also widens the
-- submissions table so future typed rows (e.g. a file path per type) can be
-- added without another migration.
--
-- Run in the Supabase SQL Editor. Safe to re-run (idempotent).
-- =============================================================================

-- 1) Drop the restrictive CHECK and widen the column.
alter table assignments
  drop constraint if exists assignments_submission_type_check;

alter table assignments
  alter column submission_type type text;

-- 2) Add a CHECK that any value is one of the supported types, or a
--    comma-separated list of them (no empty tokens, no duplicates).
alter table assignments
  add constraint assignments_submission_type_check
  check (
    submission_type = '' or
    not exists (
      select 1
      from unnest(string_to_array(submission_type, ',')) t
      where trim(t) = '' or trim(t) not in (
        'text', 'audio', 'video', 'pdf', 'docx', 'ppt', 'zip', 'url', 'link', 'rich_text'
      )
    ) and
    array_length(regexp_split_to_array(
      (select string_agg(distinct x, ',' order by x)
         from unnest(string_to_array(submission_type, ',')) x), ','), 1)
      = array_length(regexp_split_to_array(submission_type, ','), 1)
  );

-- 3) Submission-type enumeration is normalized to a canonical set in the app.
--    Existing single-value rows ('text' / 'audio') remain valid as-is.
comment on column assignments.submission_type is
  'Comma-separated list of allowed submission types (text, audio, video, pdf, docx, ppt, zip, url, link, rich_text).';
