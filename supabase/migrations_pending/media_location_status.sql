-- Media location + status — record where files live, never infer it.
--
-- Round 13, PASS 1. Adds the columns that make delivery location explicit:
-- every file-backed row records provider + bucket alongside the key, written
-- at upload time by the code that performed the upload. Status captures the
-- upload lifecycle: pending → ready → failed. A row only becomes `ready`
-- after the server has verified the object exists and is non-zero; until then
-- it is hidden from students.
--
-- Deliberately does NOT touch materials.kind: legacy `slides` rows must keep
-- validating (round 12 tolerates them; pptx is already rejected at upload).
--
-- Backfill is `pending`, never `ready`. A separate promote step (run after
-- this migration + media-doctor) flips rows to `ready` only where the object
-- verifies. Between migration and promote, students see nothing — run both at
-- a quiet hour.
--
-- Idempotent. Run in the Supabase SQL Editor.
-- =============================================================================

-- materials: record where + status lifecycle.
alter table public.materials
  add column if not exists provider text not null default 'supabase',
  add column if not exists bucket text not null default 'materials',
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'ready', 'failed'));

-- lessons: video location + status.
alter table public.lessons
  add column if not exists video_provider text not null default 'supabase',
  add column if not exists video_bucket text not null default 'videos',
  add column if not exists video_status text not null default 'pending'
    check (video_status in ('pending', 'ready', 'failed'));

-- submission_files: record where + status lifecycle.
alter table public.submission_files
  add column if not exists provider text not null default 'supabase',
  add column if not exists bucket text not null default 'submissions',
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'ready', 'failed'));

-- media_assets: HLS assets already have `provider`; record the bucket too.
alter table public.media_assets
  add column if not exists bucket text not null default 'videos';
