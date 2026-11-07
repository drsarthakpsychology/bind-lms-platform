-- =============================================================================
-- Study notes and bookmarks, saved per student on the server.
-- One row per student per Study section ("module/section" key). A row holds the
-- section's bookmark (on or off) and the student's own note, each with the
-- time (milliseconds since 1970, from the device) of its last change, so two
-- devices merge field by field: the newest change wins and removals are kept
-- (bookmark_on false, note '').
--
-- Additive and idempotent: safe to run any time, any number of times.
-- Row level security: each signed-in student reads and writes only their own
-- rows. The app reads and writes with the student's own session
-- (src/lib/study/marks-actions.ts). Until this runs the app keeps working on
-- the browser copy alone, with no errors shown.
-- =============================================================================

create table if not exists public.study_marks (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null check (char_length(key) between 3 and 200 and position('/' in key) > 1),
  bookmark_on boolean,
  bookmark_at bigint check (bookmark_at is null or bookmark_at >= 0),
  note text check (note is null or char_length(note) <= 4000),
  note_at bigint check (note_at is null or note_at >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, key),
  -- A bookmark value always comes with its time, and so does a note.
  check ((bookmark_on is null) = (bookmark_at is null)),
  check ((note is null) = (note_at is null))
);

alter table public.study_marks enable row level security;

drop policy if exists "study_marks_own_select" on public.study_marks;
create policy "study_marks_own_select" on public.study_marks
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "study_marks_own_insert" on public.study_marks;
create policy "study_marks_own_insert" on public.study_marks
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "study_marks_own_update" on public.study_marks;
create policy "study_marks_own_update" on public.study_marks
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "study_marks_own_delete" on public.study_marks;
create policy "study_marks_own_delete" on public.study_marks
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.study_marks from anon;
grant select, insert, update, delete on public.study_marks to authenticated;
