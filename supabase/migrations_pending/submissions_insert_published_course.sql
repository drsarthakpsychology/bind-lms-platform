-- Defense-in-depth: tighten the submissions INSERT policy.
--
-- The original policy (submissions_insert_own) only checked
-- `auth.uid() = user_id`, so a caller with valid auth could POST a row for
-- ANY assignment id — even one belonging to an unpublished course — by
-- calling the Supabase REST API directly, bypassing the app-level
-- assertCanSubmit() check in the server action.
--
-- This replaces it with one that also requires the assignment's parent
-- lesson to sit in a published course (or the caller to be an admin).
--
-- Run in the Supabase SQL Editor. Idempotent.
-- =============================================================================

drop policy if exists "submissions_insert_own" on submissions;

create policy "submissions_insert_published_lesson" on submissions
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1
      from assignments a
      join lessons l on l.id = a.lesson_id
      join courses c on c.id = l.course_id
      where a.id = submissions.assignment_id
        and c.is_published = true
    )
  );
