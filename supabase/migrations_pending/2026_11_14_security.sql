-- =============================================================================
-- Security hardening, 14 Nov 2026 (docs/security/SECURITY_AUDIT_2026_11.md).
--
-- ORDER: deploy the agent/sec code FIRST, then paste this file into the
-- Supabase SQL editor. Sections 7 to 9 stop students writing some tables
-- directly; the new code writes those tables on the server instead. Applied
-- before the code, lecture progress, practice attempts and the judgment arena
-- would stop saving until the code goes live.
--
-- Idempotent: safe to run more than once. Nothing here deletes data.
-- =============================================================================

-- 1. device_setup_codes had row level security OFF, so anyone holding the
--    public anon key could read, add, change or delete rows. No app code uses
--    it; server-side tools use the service role, which is unaffected.
alter table if exists public.device_setup_codes enable row level security;
revoke all on table public.device_setup_codes from anon, authenticated;

-- 2. media_assets: every signed-in account could read every column of every
--    lecture's media row, including the at-rest `encryption_key` column. Keep
--    the columns the player needs; hide the key columns from students.
revoke select on table public.media_assets from anon, authenticated;
grant select (id, lesson_id, provider, key_prefix, mime_type, duration_seconds, ladder,
              master_playlist, created_at, updated_at, encrypted, bucket, progress, stage,
              worker_started_at, target_resolutions, progress_detail)
  on table public.media_assets to authenticated;

-- 3. course_enrollments: "select true" for everyone (anon included) listed
--    every student's enrolments. Students now see only their own rows; admins
--    keep enrollments_admin_manage_sel.
drop policy if exists "enrollments_select_all" on public.course_enrollments;
drop policy if exists "enrollments_select_own" on public.course_enrollments;
create policy "enrollments_select_own" on public.course_enrollments
  for select to authenticated using ((select auth.uid()) = user_id);

-- 4. certificates: the anon "public verify" policy returned every certificate
--    (student name, user id, file path) to anyone. Verification goes through
--    the server (credentials + admin client), so the policy is not needed.
drop policy if exists "certificates_public_verify" on public.certificates;
drop policy if exists "certificates_select_own" on public.certificates;
create policy "certificates_select_own" on public.certificates
  for select to authenticated using ((select auth.uid()) = user_id);

-- 5. formulation_wall_posts: the base table was readable by anyone (anon
--    included) with author_id, which undid the wall's anonymity. Signed-in
--    users keep the columns the anonymous view needs; author_id is hidden.
drop policy if exists "formulation_wall_select_visible" on public.formulation_wall_posts;
drop policy if exists "formulation_wall_select_signed_in" on public.formulation_wall_posts;
create policy "formulation_wall_select_signed_in" on public.formulation_wall_posts
  for select to authenticated using (true);
revoke select on table public.formulation_wall_posts from anon, authenticated;
grant select (id, organization_id, narrative, case_title, created_at)
  on table public.formulation_wall_posts to authenticated;

-- 6. ai_usage_log accepted inserts from anyone (with check true, role public).
--    Only the server (service role) writes it.
drop policy if exists "ai_usage_insert_server" on public.ai_usage_log;

-- 7. Learn XP and league points (learn_progress). Students could PATCH their
--    own row through the REST API and skip the server clamp. saveLearnState
--    already writes with the service role. (Same as the older optional file
--    2026_11_learn_progress_server_writes.sql.)
drop policy if exists "learn_progress_own_insert" on public.learn_progress;
drop policy if exists "learn_progress_own_update" on public.learn_progress;

-- 8. Lecture progress (watched seconds, completed): the server clamp in
--    pingProgress was skippable through the REST API. The code now writes
--    progress with the service role.
drop policy if exists "progress_own_upsert" on public.progress;
drop policy if exists "progress_own_update" on public.progress;

-- 9. Scores and evidence that only the server should write. The routes now
--    write these with the service role after their own checks.
drop policy if exists "sct_attempts_insert_own" on public.sct_attempts;
drop policy if exists "sct_attempts_update_own" on public.sct_attempts;
drop policy if exists "sim_scores_insert_own" on public.sim_scores;
drop policy if exists "competency_events_insert_own" on public.competency_events;
drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
drop policy if exists "mse_attempts_insert_own" on public.mse_attempts;
drop policy if exists "osce_attempts_insert_own" on public.osce_attempts;
drop policy if exists "formulation_attempts_insert_own" on public.formulation_attempts;
-- No app code writes these two; students could set their own counts.
drop policy if exists "quest_progress_insert_own" on public.quest_progress;
drop policy if exists "quest_progress_update_own" on public.quest_progress;
drop policy if exists "cohort_goal_progress_insert_own" on public.cohort_goal_progress;
drop policy if exists "cohort_goal_progress_update_own" on public.cohort_goal_progress;

-- 10. Supervision log: a student could set signoff_status to "approved"
--     themselves, or edit hours after sign-off. Students may only add pending
--     entries, ask for sign-off (pending -> requested) and edit while pending.
create or replace function public.protect_supervision_signoff()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.is_super_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.signoff_status := 'pending';
    return new;
  end if;
  if new.user_id is distinct from old.user_id then
    raise exception 'Cannot move a supervision entry.';
  end if;
  if old.signoff_status is distinct from 'pending' then
    raise exception 'This entry is waiting for or has a sign-off and cannot be changed.';
  end if;
  if new.signoff_status is distinct from old.signoff_status and new.signoff_status is distinct from 'requested' then
    raise exception 'Only a supervisor can sign off an entry.';
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_supervision_signoff() from public, anon, authenticated;
drop trigger if exists protect_supervision_signoff on public.supervision_entries;
create trigger protect_supervision_signoff
  before insert or update on public.supervision_entries
  for each row execute function public.protect_supervision_signoff();

-- 11. Assignment submissions: while pending, a student could write their own
--     score, feedback, returned_at, is_late and submitted_at through the REST
--     API. For students the database now sets those itself.
create or replace function public.protect_submission_grading()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  due timestamptz;
begin
  if auth.uid() is null or public.is_super_admin() then
    return new;
  end if;
  select a.due_at into due from public.assignments a where a.id = new.assignment_id;
  if tg_op = 'INSERT' then
    new.score := null;
    new.feedback := null;
    new.returned_at := null;
    new.submitted_at := now();
    new.is_late := coalesce(due < now(), false);
    return new;
  end if;
  new.user_id := old.user_id;
  new.assignment_id := old.assignment_id;
  new.score := old.score;
  new.feedback := old.feedback;
  new.returned_at := old.returned_at;
  if new.text_content is distinct from old.text_content
     or new.audio_storage_path is distinct from old.audio_storage_path
     or new.note is distinct from old.note then
    new.submitted_at := now();
    new.is_late := coalesce(due < now(), false);
  else
    new.submitted_at := old.submitted_at;
    new.is_late := old.is_late;
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_submission_grading() from public, anon, authenticated;
drop trigger if exists protect_submission_grading on public.submissions;
create trigger protect_submission_grading
  before insert or update on public.submissions
  for each row execute function public.protect_submission_grading();

-- 12. Notifications: a student could rewrite the title, body and link of
--     their own notifications. They may only mark them read/opened.
revoke update on table public.notifications from anon, authenticated;
grant update (read_at, opened_at) on table public.notifications to authenticated;

-- 13. Storage: the admin bucket policies used is_admin(), which includes the
--     View Admin, so a View Admin could upload, replace or delete lecture
--     videos, course materials and student submissions. Reading stays with
--     any admin; writing is Super Admin only.
drop policy if exists "materials_bucket_admin_all" on storage.objects;
drop policy if exists "submissions_bucket_admin_all" on storage.objects;
drop policy if exists "videos_admin_all" on storage.objects;
drop policy if exists "videos_bucket_admin_all" on storage.objects;
drop policy if exists "admin_buckets_read" on storage.objects;
drop policy if exists "admin_buckets_super_write" on storage.objects;
create policy "admin_buckets_read" on storage.objects
  for select to authenticated
  using (bucket_id in ('materials', 'submissions', 'videos') and public.is_admin());
create policy "admin_buckets_super_write" on storage.objects
  for all to authenticated
  using (bucket_id in ('materials', 'submissions', 'videos') and public.is_super_admin())
  with check (bucket_id in ('materials', 'submissions', 'videos') and public.is_super_admin());

-- 14. Functions callable through /rest/v1/rpc that should not be.
--     Trigger functions (they still fire as triggers without EXECUTE):
do $$
declare f text;
begin
  foreach f in array array[
    'public.assign_roll_number()', 'public.award_membership()', 'public.protect_credential_id()',
    'public.protect_roll_number()', 'public.protect_super_admin()', 'public.sync_lesson_video_path_on_hls()',
    'public.sync_profile_name_from_invite()'
  ] loop
    if to_regprocedure(f) is not null then
      execute format('revoke execute on function %s from public, anon, authenticated', f);
    end if;
  end loop;
end $$;

-- A signed-in student could call rate_limit_incr('login:<someone>@...', ...)
-- and lock another person out of login; the corpus search functions handed the
-- whole licensed library to any account, past the feature and scope checks.
-- The app calls all three with the service role.
revoke execute on function public.rate_limit_incr(text, integer, bigint) from public, anon, authenticated;
grant execute on function public.rate_limit_incr(text, integer, bigint) to service_role;
do $$
begin
  if to_regprocedure('public.match_corpus_chunks(halfvec, integer, text, text)') is not null then
    revoke execute on function public.match_corpus_chunks(halfvec, integer, text, text) from public, anon, authenticated;
    grant execute on function public.match_corpus_chunks(halfvec, integer, text, text) to service_role;
  end if;
  if to_regprocedure('public.search_corpus_keyword(text, integer, text)') is not null then
    revoke execute on function public.search_corpus_keyword(text, integer, text) from public, anon, authenticated;
    grant execute on function public.search_corpus_keyword(text, integer, text) to service_role;
  end if;
end $$;

-- is_super_admin() is used by policies for signed-in users only.
revoke execute on function public.is_super_admin() from public, anon;
grant execute on function public.is_super_admin() to authenticated, service_role;

-- 15. Function with a mutable search_path (advisor WARN).
alter function public.sync_lesson_video_path_on_hls() set search_path = public;

-- =============================================================================
-- Check after running (should return no rows):
--   select relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
--   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
-- =============================================================================
