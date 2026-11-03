-- =============================================================================
-- Strict RBAC: Super Admin + View Admin
-- =============================================================================
-- 1. `role` gains 'view_admin' (read-only admin) and 'alumni' (already in the
--    app types). `admin` = Super Admin / Owner (the only account that may
--    create, invite, enrol, edit or remove users and admins).
-- 2. `is_admin()` is widened to mean "any admin" (admin OR view_admin) so the
--    read-only admin can view admin surfaces and data, while a NEW
--    `is_super_admin()` gates every write at the RLS layer.
-- 3. Owner protection: at most one Super Admin (unique index), and the Super
--    Admin row can never be deleted, demoted or deactivated.
-- 4. admin_audit_log: an append-only trail of sensitive administrative ops.
--
-- Idempotent. Run this BEFORE the policy split below (functions must exist
-- before the `create policy ... is_super_admin()` statements reference them).
-- =============================================================================

-- 1. Role enum ----------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'view_admin', 'student', 'alumni'));

-- 2. Auth helpers -------------------------------------------------------------
-- `admin` is the Super Admin / Owner. This is the WRITE gate.
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- `is_admin()` now means "any admin" (Super Admin or View Admin). Kept under
-- the same name so every existing SELECT policy automatically grants the
-- View Admin read access, with zero change to those policies.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'view_admin')
  );
$$;

-- 3. Owner protection ---------------------------------------------------------
-- At most ONE Super Admin (role = 'admin') may ever exist.
create unique index if not exists one_super_admin
  on public.profiles ((role)) where role = 'admin';

-- The Super Admin row can never be deleted, demoted or deactivated. This is a
-- trigger (not just RLS) so it also holds for service-role writes.
create or replace function public.protect_super_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'DELETE' then
    if old.role = 'admin' then
      raise exception 'The Super Admin account cannot be deleted.';
    end if;
    return old;
  end if;
  if TG_OP = 'UPDATE' then
    if old.role = 'admin' then
      if new.role is distinct from 'admin' then
        raise exception 'The Super Admin role cannot be changed.';
      end if;
      if new.status = 'blocked' then
        raise exception 'The Super Admin account cannot be deactivated.';
      end if;
    end if;
    return new;
  end if;
  return null;
end;
$$;

drop trigger if exists protect_super_admin_trigger on public.profiles;
create trigger protect_super_admin_trigger
  before update or delete on public.profiles
  for each row execute function public.protect_super_admin();

-- 4. Audit log ----------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;

drop policy if exists "admin_audit_log_select_admin" on public.admin_audit_log;
create policy "admin_audit_log_select_admin" on public.admin_audit_log
  for select to authenticated using (public.is_admin());

-- 5. Manual fixes for the policies NOT shaped `for all ... is_admin()` --------
-- (profiles insert/update/delete, own-or-admin updates, review updates, wall
-- inserts). Every admin-only WRITE becomes is_super_admin() so a View Admin
-- (now part of is_admin()) never gains a write path.

-- profiles: only the Super Admin may create / delete / alter roles; a student
-- may update their own row but can never grant themselves an admin role.
drop policy if exists "profiles_insert_admin_only" on public.profiles;
create policy "profiles_insert_admin_only" on public.profiles
  for insert to authenticated with check (public.is_super_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_super_admin())
  with check (public.is_super_admin() or (auth.uid() = id and role not in ('admin', 'view_admin')));

drop policy if exists "profiles_delete_admin_only" on public.profiles;
create policy "profiles_delete_admin_only" on public.profiles
  for delete to authenticated using (public.is_super_admin());

-- Own-or-admin UPDATE policies: keep the student's own-row write, but the
-- admin side narrows from is_admin() to is_super_admin().
drop policy if exists "practice_chains_update_own_or_admin" on public.practice_chains;
create policy "practice_chains_update_own_or_admin" on public.practice_chains
  for update to authenticated using (auth.uid() = user_id or public.is_super_admin());

drop policy if exists "sim_sessions_update_own_or_admin" on public.sim_sessions;
create policy "sim_sessions_update_own_or_admin" on public.sim_sessions
  for update to authenticated using (auth.uid() = user_id or public.is_super_admin());

drop policy if exists "student_details_own_update" on public.student_details;
create policy "student_details_own_update" on public.student_details
  for update to authenticated
  using (auth.uid() = user_id or public.is_super_admin())
  with check (auth.uid() = user_id or public.is_super_admin());

drop policy if exists "progress_own_update" on public.progress;
create policy "progress_own_update" on public.progress
  for update to authenticated using (auth.uid() = user_id or public.is_super_admin());

-- Admin-only UPDATE policies (grading, supervision, review): Super Admin only.
drop policy if exists "submissions_update_admin_only" on public.submissions;
create policy "submissions_update_admin_only" on public.submissions
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "supervision_update_admin" on public.supervision_entries;
create policy "supervision_update_admin" on public.supervision_entries
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "psych_dose_bands_review_admin" on public.psych_dose_bands;
create policy "psych_dose_bands_review_admin" on public.psych_dose_bands
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "psych_dose_ranges_review_admin" on public.psych_dose_ranges;
create policy "psych_dose_ranges_review_admin" on public.psych_dose_ranges
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "psych_drug_fields_review_admin" on public.psych_drug_fields;
create policy "psych_drug_fields_review_admin" on public.psych_drug_fields
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Wall inserts: only the Super Admin may post as faculty / pin a post.
drop policy if exists "wall_posts_insert_own" on public.wall_posts;
create policy "wall_posts_insert_own" on public.wall_posts
  for insert to authenticated
  with check (auth.uid() = author_id and (public.is_super_admin() or (is_faculty = false and is_pinned = false)));

drop policy if exists "wall_replies_insert_own" on public.wall_replies;
create policy "wall_replies_insert_own" on public.wall_replies
  for insert to authenticated
  with check (auth.uid() = author_id and (public.is_super_admin() or (is_faculty = false)));

-- Psych review audit inserts: Super Admin only.
drop policy if exists "psych_review_audit_admin_insert" on public.psych_review_audit;
create policy "psych_review_audit_admin_insert" on public.psych_review_audit
  for insert to authenticated with check (public.is_super_admin());

-- =============================================================================
-- 6. Generated policy split (below): every `for all ... is_admin()` policy is
--    replaced with select(is_admin) + insert/update/delete(is_super_admin).
-- =============================================================================

drop policy if exists "access_blocks_admin" on public.access_blocks;
create policy "access_blocks_admin_sel" on public.access_blocks for select to authenticated using (public.is_admin());
create policy "access_blocks_admin_ins" on public.access_blocks for insert to authenticated with check (public.is_super_admin());
create policy "access_blocks_admin_upd" on public.access_blocks for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "access_blocks_admin_del" on public.access_blocks for delete to authenticated using (public.is_super_admin());

drop policy if exists "account_setup_tokens_admin_all" on public.account_setup_tokens;
create policy "account_setup_tokens_admin_all_sel" on public.account_setup_tokens for select to authenticated using (public.is_admin());
create policy "account_setup_tokens_admin_all_ins" on public.account_setup_tokens for insert to authenticated with check (public.is_super_admin());
create policy "account_setup_tokens_admin_all_upd" on public.account_setup_tokens for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "account_setup_tokens_admin_all_del" on public.account_setup_tokens for delete to authenticated using (public.is_super_admin());

drop policy if exists "ai_response_cache_admin_manage" on public.ai_response_cache;
create policy "ai_response_cache_admin_manage_sel" on public.ai_response_cache for select to authenticated using (public.is_admin());
create policy "ai_response_cache_admin_manage_ins" on public.ai_response_cache for insert to authenticated with check (public.is_super_admin());
create policy "ai_response_cache_admin_manage_upd" on public.ai_response_cache for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "ai_response_cache_admin_manage_del" on public.ai_response_cache for delete to authenticated using (public.is_super_admin());

drop policy if exists "app_roles_admin_all" on public.app_roles;
create policy "app_roles_admin_all_sel" on public.app_roles for select to authenticated using (public.is_admin());
create policy "app_roles_admin_all_ins" on public.app_roles for insert to authenticated with check (public.is_super_admin());
create policy "app_roles_admin_all_upd" on public.app_roles for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "app_roles_admin_all_del" on public.app_roles for delete to authenticated using (public.is_super_admin());

drop policy if exists "assignments_admin_manage" on public.assignments;
create policy "assignments_admin_manage_sel" on public.assignments for select to authenticated using (public.is_admin());
create policy "assignments_admin_manage_ins" on public.assignments for insert to authenticated with check (public.is_super_admin());
create policy "assignments_admin_manage_upd" on public.assignments for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "assignments_admin_manage_del" on public.assignments for delete to authenticated using (public.is_super_admin());

drop policy if exists "calibration_pairs_admin_all" on public.calibration_pairs;
create policy "calibration_pairs_admin_all_sel" on public.calibration_pairs for select to authenticated using (public.is_admin());
create policy "calibration_pairs_admin_all_ins" on public.calibration_pairs for insert to authenticated with check (public.is_super_admin());
create policy "calibration_pairs_admin_all_upd" on public.calibration_pairs for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "calibration_pairs_admin_all_del" on public.calibration_pairs for delete to authenticated using (public.is_super_admin());

drop policy if exists "cards_admin_manage" on public.cards;
create policy "cards_admin_manage_sel" on public.cards for select to authenticated using (public.is_admin());
create policy "cards_admin_manage_ins" on public.cards for insert to authenticated with check (public.is_super_admin());
create policy "cards_admin_manage_upd" on public.cards for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "cards_admin_manage_del" on public.cards for delete to authenticated using (public.is_super_admin());

drop policy if exists "certificates_admin_all" on public.certificates;
create policy "certificates_admin_all_sel" on public.certificates for select to authenticated using (public.is_admin());
create policy "certificates_admin_all_ins" on public.certificates for insert to authenticated with check (public.is_super_admin());
create policy "certificates_admin_all_upd" on public.certificates for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "certificates_admin_all_del" on public.certificates for delete to authenticated using (public.is_super_admin());

drop policy if exists "cohort_goals_admin_manage" on public.cohort_goals;
create policy "cohort_goals_admin_manage_sel" on public.cohort_goals for select to authenticated using (public.is_admin());
create policy "cohort_goals_admin_manage_ins" on public.cohort_goals for insert to authenticated with check (public.is_super_admin());
create policy "cohort_goals_admin_manage_upd" on public.cohort_goals for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "cohort_goals_admin_manage_del" on public.cohort_goals for delete to authenticated using (public.is_super_admin());

drop policy if exists "cohort_members_admin" on public.cohort_members;
create policy "cohort_members_admin_sel" on public.cohort_members for select to authenticated using (public.is_admin());
create policy "cohort_members_admin_ins" on public.cohort_members for insert to authenticated with check (public.is_super_admin());
create policy "cohort_members_admin_upd" on public.cohort_members for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "cohort_members_admin_del" on public.cohort_members for delete to authenticated using (public.is_super_admin());

drop policy if exists "cohorts_admin" on public.cohorts;
create policy "cohorts_admin_sel" on public.cohorts for select to authenticated using (public.is_admin());
create policy "cohorts_admin_ins" on public.cohorts for insert to authenticated with check (public.is_super_admin());
create policy "cohorts_admin_upd" on public.cohorts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "cohorts_admin_del" on public.cohorts for delete to authenticated using (public.is_super_admin());

drop policy if exists "competencies_admin_manage" on public.competencies;
create policy "competencies_admin_manage_sel" on public.competencies for select to authenticated using (public.is_admin());
create policy "competencies_admin_manage_ins" on public.competencies for insert to authenticated with check (public.is_super_admin());
create policy "competencies_admin_manage_upd" on public.competencies for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "competencies_admin_manage_del" on public.competencies for delete to authenticated using (public.is_super_admin());

drop policy if exists "corpus_admin_manage_chunks" on public.corpus_chunks;
create policy "corpus_admin_manage_chunks_sel" on public.corpus_chunks for select to authenticated using (public.is_admin());
create policy "corpus_admin_manage_chunks_ins" on public.corpus_chunks for insert to authenticated with check (public.is_super_admin());
create policy "corpus_admin_manage_chunks_upd" on public.corpus_chunks for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "corpus_admin_manage_chunks_del" on public.corpus_chunks for delete to authenticated using (public.is_super_admin());

drop policy if exists "corpus_admin_manage_docs" on public.corpus_documents;
create policy "corpus_admin_manage_docs_sel" on public.corpus_documents for select to authenticated using (public.is_admin());
create policy "corpus_admin_manage_docs_ins" on public.corpus_documents for insert to authenticated with check (public.is_super_admin());
create policy "corpus_admin_manage_docs_upd" on public.corpus_documents for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "corpus_admin_manage_docs_del" on public.corpus_documents for delete to authenticated using (public.is_super_admin());

drop policy if exists "corpus_admin_manage" on public.corpus_sources;
create policy "corpus_admin_manage_sel" on public.corpus_sources for select to authenticated using (public.is_admin());
create policy "corpus_admin_manage_ins" on public.corpus_sources for insert to authenticated with check (public.is_super_admin());
create policy "corpus_admin_manage_upd" on public.corpus_sources for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "corpus_admin_manage_del" on public.corpus_sources for delete to authenticated using (public.is_super_admin());

drop policy if exists "enrollments_admin_manage" on public.course_enrollments;
create policy "enrollments_admin_manage_sel" on public.course_enrollments for select to authenticated using (public.is_admin());
create policy "enrollments_admin_manage_ins" on public.course_enrollments for insert to authenticated with check (public.is_super_admin());
create policy "enrollments_admin_manage_upd" on public.course_enrollments for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "enrollments_admin_manage_del" on public.course_enrollments for delete to authenticated using (public.is_super_admin());

drop policy if exists "courses_admin_manage" on public.courses;
create policy "courses_admin_manage_sel" on public.courses for select to authenticated using (public.is_admin());
create policy "courses_admin_manage_ins" on public.courses for insert to authenticated with check (public.is_super_admin());
create policy "courses_admin_manage_upd" on public.courses for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "courses_admin_manage_del" on public.courses for delete to authenticated using (public.is_super_admin());

drop policy if exists "credential_invites_admin_all" on public.credential_invites;
create policy "credential_invites_admin_all_sel" on public.credential_invites for select to authenticated using (public.is_admin());
create policy "credential_invites_admin_all_ins" on public.credential_invites for insert to authenticated with check (public.is_super_admin());
create policy "credential_invites_admin_all_upd" on public.credential_invites for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "credential_invites_admin_all_del" on public.credential_invites for delete to authenticated using (public.is_super_admin());

drop policy if exists "crm_activities_admin_all" on public.crm_activities;
create policy "crm_activities_admin_all_sel" on public.crm_activities for select to authenticated using (public.is_admin());
create policy "crm_activities_admin_all_ins" on public.crm_activities for insert to authenticated with check (public.is_super_admin());
create policy "crm_activities_admin_all_upd" on public.crm_activities for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "crm_activities_admin_all_del" on public.crm_activities for delete to authenticated using (public.is_super_admin());

drop policy if exists "crm_contacts_admin_all" on public.crm_contacts;
create policy "crm_contacts_admin_all_sel" on public.crm_contacts for select to authenticated using (public.is_admin());
create policy "crm_contacts_admin_all_ins" on public.crm_contacts for insert to authenticated with check (public.is_super_admin());
create policy "crm_contacts_admin_all_upd" on public.crm_contacts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "crm_contacts_admin_all_del" on public.crm_contacts for delete to authenticated using (public.is_super_admin());

drop policy if exists "doubt_replies_admin" on public.doubt_replies;
create policy "doubt_replies_admin_sel" on public.doubt_replies for select to authenticated using (public.is_admin());
create policy "doubt_replies_admin_ins" on public.doubt_replies for insert to authenticated with check (public.is_super_admin());
create policy "doubt_replies_admin_upd" on public.doubt_replies for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "doubt_replies_admin_del" on public.doubt_replies for delete to authenticated using (public.is_super_admin());

drop policy if exists "doubts_admin" on public.doubts;
create policy "doubts_admin_sel" on public.doubts for select to authenticated using (public.is_admin());
create policy "doubts_admin_ins" on public.doubts for insert to authenticated with check (public.is_super_admin());
create policy "doubts_admin_upd" on public.doubts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "doubts_admin_del" on public.doubts for delete to authenticated using (public.is_super_admin());

drop policy if exists "doubts_admin_all" on public.doubts_legacy;
create policy "doubts_admin_all_sel" on public.doubts_legacy for select to authenticated using (public.is_admin());
create policy "doubts_admin_all_ins" on public.doubts_legacy for insert to authenticated with check (public.is_super_admin());
create policy "doubts_admin_all_upd" on public.doubts_legacy for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "doubts_admin_all_del" on public.doubts_legacy for delete to authenticated using (public.is_super_admin());

drop policy if exists "email_inbound_admin_all" on public.email_inbound;
create policy "email_inbound_admin_all_sel" on public.email_inbound for select to authenticated using (public.is_admin());
create policy "email_inbound_admin_all_ins" on public.email_inbound for insert to authenticated with check (public.is_super_admin());
create policy "email_inbound_admin_all_upd" on public.email_inbound for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "email_inbound_admin_all_del" on public.email_inbound for delete to authenticated using (public.is_super_admin());

drop policy if exists "email_sends_admin_all" on public.email_sends;
create policy "email_sends_admin_all_sel" on public.email_sends for select to authenticated using (public.is_admin());
create policy "email_sends_admin_all_ins" on public.email_sends for insert to authenticated with check (public.is_super_admin());
create policy "email_sends_admin_all_upd" on public.email_sends for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "email_sends_admin_all_del" on public.email_sends for delete to authenticated using (public.is_super_admin());

drop policy if exists "feature_flags_admin_manage" on public.feature_flags;
create policy "feature_flags_admin_manage_sel" on public.feature_flags for select to authenticated using (public.is_admin());
create policy "feature_flags_admin_manage_ins" on public.feature_flags for insert to authenticated with check (public.is_super_admin());
create policy "feature_flags_admin_manage_upd" on public.feature_flags for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "feature_flags_admin_manage_del" on public.feature_flags for delete to authenticated using (public.is_super_admin());

drop policy if exists "formulation_cases_admin_manage" on public.formulation_cases;
create policy "formulation_cases_admin_manage_sel" on public.formulation_cases for select to authenticated using (public.is_admin());
create policy "formulation_cases_admin_manage_ins" on public.formulation_cases for insert to authenticated with check (public.is_super_admin());
create policy "formulation_cases_admin_manage_upd" on public.formulation_cases for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "formulation_cases_admin_manage_del" on public.formulation_cases for delete to authenticated using (public.is_super_admin());

drop policy if exists "formulation_wall_admin_manage" on public.formulation_wall_posts;
create policy "formulation_wall_admin_manage_sel" on public.formulation_wall_posts for select to authenticated using (public.is_admin());
create policy "formulation_wall_admin_manage_ins" on public.formulation_wall_posts for insert to authenticated with check (public.is_super_admin());
create policy "formulation_wall_admin_manage_upd" on public.formulation_wall_posts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "formulation_wall_admin_manage_del" on public.formulation_wall_posts for delete to authenticated using (public.is_super_admin());

drop policy if exists "idioms_admin_manage" on public.idioms;
create policy "idioms_admin_manage_sel" on public.idioms for select to authenticated using (public.is_admin());
create policy "idioms_admin_manage_ins" on public.idioms for insert to authenticated with check (public.is_super_admin());
create policy "idioms_admin_manage_upd" on public.idioms for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "idioms_admin_manage_del" on public.idioms for delete to authenticated using (public.is_super_admin());

drop policy if exists "infra_snapshots_admin_all" on public.infra_snapshots;
create policy "infra_snapshots_admin_all_sel" on public.infra_snapshots for select to authenticated using (public.is_admin());
create policy "infra_snapshots_admin_all_ins" on public.infra_snapshots for insert to authenticated with check (public.is_super_admin());
create policy "infra_snapshots_admin_all_upd" on public.infra_snapshots for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "infra_snapshots_admin_all_del" on public.infra_snapshots for delete to authenticated using (public.is_super_admin());

drop policy if exists "knowledge_chunk_concepts_admin_manage" on public.knowledge_chunk_concepts;
create policy "knowledge_chunk_concepts_admin_manage_sel" on public.knowledge_chunk_concepts for select to authenticated using (public.is_admin());
create policy "knowledge_chunk_concepts_admin_manage_ins" on public.knowledge_chunk_concepts for insert to authenticated with check (public.is_super_admin());
create policy "knowledge_chunk_concepts_admin_manage_upd" on public.knowledge_chunk_concepts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "knowledge_chunk_concepts_admin_manage_del" on public.knowledge_chunk_concepts for delete to authenticated using (public.is_super_admin());

drop policy if exists "knowledge_concepts_admin_manage" on public.knowledge_concepts;
create policy "knowledge_concepts_admin_manage_sel" on public.knowledge_concepts for select to authenticated using (public.is_admin());
create policy "knowledge_concepts_admin_manage_ins" on public.knowledge_concepts for insert to authenticated with check (public.is_super_admin());
create policy "knowledge_concepts_admin_manage_upd" on public.knowledge_concepts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "knowledge_concepts_admin_manage_del" on public.knowledge_concepts for delete to authenticated using (public.is_super_admin());

drop policy if exists "lesson_cohorts_admin" on public.lesson_cohorts;
create policy "lesson_cohorts_admin_sel" on public.lesson_cohorts for select to authenticated using (public.is_admin());
create policy "lesson_cohorts_admin_ins" on public.lesson_cohorts for insert to authenticated with check (public.is_super_admin());
create policy "lesson_cohorts_admin_upd" on public.lesson_cohorts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "lesson_cohorts_admin_del" on public.lesson_cohorts for delete to authenticated using (public.is_super_admin());

drop policy if exists "lesson_grants_admin" on public.lesson_grants;
create policy "lesson_grants_admin_sel" on public.lesson_grants for select to authenticated using (public.is_admin());
create policy "lesson_grants_admin_ins" on public.lesson_grants for insert to authenticated with check (public.is_super_admin());
create policy "lesson_grants_admin_upd" on public.lesson_grants for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "lesson_grants_admin_del" on public.lesson_grants for delete to authenticated using (public.is_super_admin());

drop policy if exists "lesson_transcripts_admin_manage" on public.lesson_transcripts;
create policy "lesson_transcripts_admin_manage_sel" on public.lesson_transcripts for select to authenticated using (public.is_admin());
create policy "lesson_transcripts_admin_manage_ins" on public.lesson_transcripts for insert to authenticated with check (public.is_super_admin());
create policy "lesson_transcripts_admin_manage_upd" on public.lesson_transcripts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "lesson_transcripts_admin_manage_del" on public.lesson_transcripts for delete to authenticated using (public.is_super_admin());

drop policy if exists "lessons_admin_manage" on public.lessons;
create policy "lessons_admin_manage_sel" on public.lessons for select to authenticated using (public.is_admin());
create policy "lessons_admin_manage_ins" on public.lessons for insert to authenticated with check (public.is_super_admin());
create policy "lessons_admin_manage_upd" on public.lessons for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "lessons_admin_manage_del" on public.lessons for delete to authenticated using (public.is_super_admin());

drop policy if exists "library_notes_admin_all" on public.library_notes;
create policy "library_notes_admin_all_sel" on public.library_notes for select to authenticated using (public.is_admin());
create policy "library_notes_admin_all_ins" on public.library_notes for insert to authenticated with check (public.is_super_admin());
create policy "library_notes_admin_all_upd" on public.library_notes for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "library_notes_admin_all_del" on public.library_notes for delete to authenticated using (public.is_super_admin());

drop policy if exists "materials_admin_manage" on public.materials;
create policy "materials_admin_manage_sel" on public.materials for select to authenticated using (public.is_admin());
create policy "materials_admin_manage_ins" on public.materials for insert to authenticated with check (public.is_super_admin());
create policy "materials_admin_manage_upd" on public.materials for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "materials_admin_manage_del" on public.materials for delete to authenticated using (public.is_super_admin());

drop policy if exists "media_assets_admin_all" on public.media_assets;
create policy "media_assets_admin_all_sel" on public.media_assets for select to authenticated using (public.is_admin());
create policy "media_assets_admin_all_ins" on public.media_assets for insert to authenticated with check (public.is_super_admin());
create policy "media_assets_admin_all_upd" on public.media_assets for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "media_assets_admin_all_del" on public.media_assets for delete to authenticated using (public.is_super_admin());

drop policy if exists "module_access_admin_manage" on public.module_access;
create policy "module_access_admin_manage_sel" on public.module_access for select to authenticated using (public.is_admin());
create policy "module_access_admin_manage_ins" on public.module_access for insert to authenticated with check (public.is_super_admin());
create policy "module_access_admin_manage_upd" on public.module_access for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "module_access_admin_manage_del" on public.module_access for delete to authenticated using (public.is_super_admin());

drop policy if exists "module_items_admin_manage" on public.module_items;
create policy "module_items_admin_manage_sel" on public.module_items for select to authenticated using (public.is_admin());
create policy "module_items_admin_manage_ins" on public.module_items for insert to authenticated with check (public.is_super_admin());
create policy "module_items_admin_manage_upd" on public.module_items for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "module_items_admin_manage_del" on public.module_items for delete to authenticated using (public.is_super_admin());

drop policy if exists "modules_admin_manage" on public.modules;
create policy "modules_admin_manage_sel" on public.modules for select to authenticated using (public.is_admin());
create policy "modules_admin_manage_ins" on public.modules for insert to authenticated with check (public.is_super_admin());
create policy "modules_admin_manage_upd" on public.modules for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "modules_admin_manage_del" on public.modules for delete to authenticated using (public.is_super_admin());

drop policy if exists "mse_codings_admin_all" on public.mse_expert_codings;
create policy "mse_codings_admin_all_sel" on public.mse_expert_codings for select to authenticated using (public.is_admin());
create policy "mse_codings_admin_all_ins" on public.mse_expert_codings for insert to authenticated with check (public.is_super_admin());
create policy "mse_codings_admin_all_upd" on public.mse_expert_codings for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "mse_codings_admin_all_del" on public.mse_expert_codings for delete to authenticated using (public.is_super_admin());

drop policy if exists "mse_stimuli_admin_manage" on public.mse_stimuli;
create policy "mse_stimuli_admin_manage_sel" on public.mse_stimuli for select to authenticated using (public.is_admin());
create policy "mse_stimuli_admin_manage_ins" on public.mse_stimuli for insert to authenticated with check (public.is_super_admin());
create policy "mse_stimuli_admin_manage_upd" on public.mse_stimuli for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "mse_stimuli_admin_manage_del" on public.mse_stimuli for delete to authenticated using (public.is_super_admin());

drop policy if exists "osce_stations_admin_manage" on public.osce_stations;
create policy "osce_stations_admin_manage_sel" on public.osce_stations for select to authenticated using (public.is_admin());
create policy "osce_stations_admin_manage_ins" on public.osce_stations for insert to authenticated with check (public.is_super_admin());
create policy "osce_stations_admin_manage_upd" on public.osce_stations for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "osce_stations_admin_manage_del" on public.osce_stations for delete to authenticated using (public.is_super_admin());

drop policy if exists "provider_health_admin_all" on public.provider_health;
create policy "provider_health_admin_all_sel" on public.provider_health for select to authenticated using (public.is_admin());
create policy "provider_health_admin_all_ins" on public.provider_health for insert to authenticated with check (public.is_super_admin());
create policy "provider_health_admin_all_upd" on public.provider_health for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "provider_health_admin_all_del" on public.provider_health for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_cf_admin_all" on public.psych_case_format_notes;
create policy "psych_cf_admin_all_sel" on public.psych_case_format_notes for select to authenticated using (public.is_admin());
create policy "psych_cf_admin_all_ins" on public.psych_case_format_notes for insert to authenticated with check (public.is_super_admin());
create policy "psych_cf_admin_all_upd" on public.psych_case_format_notes for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_cf_admin_all_del" on public.psych_case_format_notes for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_cv_admin_all" on public.psych_case_vignettes;
create policy "psych_cv_admin_all_sel" on public.psych_case_vignettes for select to authenticated using (public.is_admin());
create policy "psych_cv_admin_all_ins" on public.psych_case_vignettes for insert to authenticated with check (public.is_super_admin());
create policy "psych_cv_admin_all_upd" on public.psych_case_vignettes for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_cv_admin_all_del" on public.psych_case_vignettes for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_pearls_admin_all" on public.psych_clinical_pearls;
create policy "psych_pearls_admin_all_sel" on public.psych_clinical_pearls for select to authenticated using (public.is_admin());
create policy "psych_pearls_admin_all_ins" on public.psych_clinical_pearls for insert to authenticated with check (public.is_super_admin());
create policy "psych_pearls_admin_all_upd" on public.psych_clinical_pearls for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_pearls_admin_all_del" on public.psych_clinical_pearls for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_comorbidity_notes_admin_all" on public.psych_comorbidity_notes;
create policy "psych_comorbidity_notes_admin_all_sel" on public.psych_comorbidity_notes for select to authenticated using (public.is_admin());
create policy "psych_comorbidity_notes_admin_all_ins" on public.psych_comorbidity_notes for insert to authenticated with check (public.is_super_admin());
create policy "psych_comorbidity_notes_admin_all_upd" on public.psych_comorbidity_notes for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_comorbidity_notes_admin_all_del" on public.psych_comorbidity_notes for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_conditions_admin_all" on public.psych_conditions;
create policy "psych_conditions_admin_all_sel" on public.psych_conditions for select to authenticated using (public.is_admin());
create policy "psych_conditions_admin_all_ins" on public.psych_conditions for insert to authenticated with check (public.is_super_admin());
create policy "psych_conditions_admin_all_upd" on public.psych_conditions for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_conditions_admin_all_del" on public.psych_conditions for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_dose_bands_admin_all" on public.psych_dose_bands;
create policy "psych_dose_bands_admin_all_sel" on public.psych_dose_bands for select to authenticated using (public.is_admin());
create policy "psych_dose_bands_admin_all_ins" on public.psych_dose_bands for insert to authenticated with check (public.is_super_admin());
create policy "psych_dose_bands_admin_all_upd" on public.psych_dose_bands for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_dose_bands_admin_all_del" on public.psych_dose_bands for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_dose_ranges_admin_all" on public.psych_dose_ranges;
create policy "psych_dose_ranges_admin_all_sel" on public.psych_dose_ranges for select to authenticated using (public.is_admin());
create policy "psych_dose_ranges_admin_all_ins" on public.psych_dose_ranges for insert to authenticated with check (public.is_super_admin());
create policy "psych_dose_ranges_admin_all_upd" on public.psych_dose_ranges for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_dose_ranges_admin_all_del" on public.psych_dose_ranges for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_drug_fields_admin_all" on public.psych_drug_fields;
create policy "psych_drug_fields_admin_all_sel" on public.psych_drug_fields for select to authenticated using (public.is_admin());
create policy "psych_drug_fields_admin_all_ins" on public.psych_drug_fields for insert to authenticated with check (public.is_super_admin());
create policy "psych_drug_fields_admin_all_upd" on public.psych_drug_fields for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_drug_fields_admin_all_del" on public.psych_drug_fields for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_drug_links_admin_all" on public.psych_drug_links;
create policy "psych_drug_links_admin_all_sel" on public.psych_drug_links for select to authenticated using (public.is_admin());
create policy "psych_drug_links_admin_all_ins" on public.psych_drug_links for insert to authenticated with check (public.is_super_admin());
create policy "psych_drug_links_admin_all_upd" on public.psych_drug_links for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_drug_links_admin_all_del" on public.psych_drug_links for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_drugs_admin_all" on public.psych_drugs;
create policy "psych_drugs_admin_all_sel" on public.psych_drugs for select to authenticated using (public.is_admin());
create policy "psych_drugs_admin_all_ins" on public.psych_drugs for insert to authenticated with check (public.is_super_admin());
create policy "psych_drugs_admin_all_upd" on public.psych_drugs for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_drugs_admin_all_del" on public.psych_drugs for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_mechanism_tags_admin_all" on public.psych_mechanism_tags;
create policy "psych_mechanism_tags_admin_all_sel" on public.psych_mechanism_tags for select to authenticated using (public.is_admin());
create policy "psych_mechanism_tags_admin_all_ins" on public.psych_mechanism_tags for insert to authenticated with check (public.is_super_admin());
create policy "psych_mechanism_tags_admin_all_upd" on public.psych_mechanism_tags for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_mechanism_tags_admin_all_del" on public.psych_mechanism_tags for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_timeline_admin_all" on public.psych_med_timeline;
create policy "psych_timeline_admin_all_sel" on public.psych_med_timeline for select to authenticated using (public.is_admin());
create policy "psych_timeline_admin_all_ins" on public.psych_med_timeline for insert to authenticated with check (public.is_super_admin());
create policy "psych_timeline_admin_all_upd" on public.psych_med_timeline for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_timeline_admin_all_del" on public.psych_med_timeline for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_checklist_admin_all" on public.psych_observation_checklist;
create policy "psych_checklist_admin_all_sel" on public.psych_observation_checklist for select to authenticated using (public.is_admin());
create policy "psych_checklist_admin_all_ins" on public.psych_observation_checklist for insert to authenticated with check (public.is_super_admin());
create policy "psych_checklist_admin_all_upd" on public.psych_observation_checklist for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_checklist_admin_all_del" on public.psych_observation_checklist for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_observation_prompts_admin_all" on public.psych_observation_prompts;
create policy "psych_observation_prompts_admin_all_sel" on public.psych_observation_prompts for select to authenticated using (public.is_admin());
create policy "psych_observation_prompts_admin_all_ins" on public.psych_observation_prompts for insert to authenticated with check (public.is_super_admin());
create policy "psych_observation_prompts_admin_all_upd" on public.psych_observation_prompts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_observation_prompts_admin_all_del" on public.psych_observation_prompts for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_rf_admin_all" on public.psych_red_flags;
create policy "psych_rf_admin_all_sel" on public.psych_red_flags for select to authenticated using (public.is_admin());
create policy "psych_rf_admin_all_ins" on public.psych_red_flags for insert to authenticated with check (public.is_super_admin());
create policy "psych_rf_admin_all_upd" on public.psych_red_flags for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_rf_admin_all_del" on public.psych_red_flags for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_session_obs_admin_all" on public.psych_session_observations;
create policy "psych_session_obs_admin_all_sel" on public.psych_session_observations for select to authenticated using (public.is_admin());
create policy "psych_session_obs_admin_all_ins" on public.psych_session_observations for insert to authenticated with check (public.is_super_admin());
create policy "psych_session_obs_admin_all_upd" on public.psych_session_observations for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_session_obs_admin_all_del" on public.psych_session_observations for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_sources_admin_all" on public.psych_sources;
create policy "psych_sources_admin_all_sel" on public.psych_sources for select to authenticated using (public.is_admin());
create policy "psych_sources_admin_all_ins" on public.psych_sources for insert to authenticated with check (public.is_super_admin());
create policy "psych_sources_admin_all_upd" on public.psych_sources for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_sources_admin_all_del" on public.psych_sources for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_tq_admin_all" on public.psych_therapist_questions;
create policy "psych_tq_admin_all_sel" on public.psych_therapist_questions for select to authenticated using (public.is_admin());
create policy "psych_tq_admin_all_ins" on public.psych_therapist_questions for insert to authenticated with check (public.is_super_admin());
create policy "psych_tq_admin_all_upd" on public.psych_therapist_questions for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_tq_admin_all_del" on public.psych_therapist_questions for delete to authenticated using (public.is_super_admin());

drop policy if exists "psych_tp_admin_all" on public.psych_therapy_planning;
create policy "psych_tp_admin_all_sel" on public.psych_therapy_planning for select to authenticated using (public.is_admin());
create policy "psych_tp_admin_all_ins" on public.psych_therapy_planning for insert to authenticated with check (public.is_super_admin());
create policy "psych_tp_admin_all_upd" on public.psych_therapy_planning for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "psych_tp_admin_all_del" on public.psych_therapy_planning for delete to authenticated using (public.is_super_admin());

drop policy if exists "quests_admin_manage" on public.quests;
create policy "quests_admin_manage_sel" on public.quests for select to authenticated using (public.is_admin());
create policy "quests_admin_manage_ins" on public.quests for insert to authenticated with check (public.is_super_admin());
create policy "quests_admin_manage_upd" on public.quests for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "quests_admin_manage_del" on public.quests for delete to authenticated using (public.is_super_admin());

drop policy if exists "rights_registry_admin_all" on public.rights_registry;
create policy "rights_registry_admin_all_sel" on public.rights_registry for select to authenticated using (public.is_admin());
create policy "rights_registry_admin_all_ins" on public.rights_registry for insert to authenticated with check (public.is_super_admin());
create policy "rights_registry_admin_all_upd" on public.rights_registry for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "rights_registry_admin_all_del" on public.rights_registry for delete to authenticated using (public.is_super_admin());

drop policy if exists "rubric_dimensions_admin_all" on public.rubric_dimensions;
create policy "rubric_dimensions_admin_all_sel" on public.rubric_dimensions for select to authenticated using (public.is_admin());
create policy "rubric_dimensions_admin_all_ins" on public.rubric_dimensions for insert to authenticated with check (public.is_super_admin());
create policy "rubric_dimensions_admin_all_upd" on public.rubric_dimensions for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "rubric_dimensions_admin_all_del" on public.rubric_dimensions for delete to authenticated using (public.is_super_admin());

drop policy if exists "scoring_corrections_admin_all" on public.scoring_corrections;
create policy "scoring_corrections_admin_all_sel" on public.scoring_corrections for select to authenticated using (public.is_admin());
create policy "scoring_corrections_admin_all_ins" on public.scoring_corrections for insert to authenticated with check (public.is_super_admin());
create policy "scoring_corrections_admin_all_upd" on public.scoring_corrections for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "scoring_corrections_admin_all_del" on public.scoring_corrections for delete to authenticated using (public.is_super_admin());

drop policy if exists "sct_expert_admin_all" on public.sct_expert_responses;
create policy "sct_expert_admin_all_sel" on public.sct_expert_responses for select to authenticated using (public.is_admin());
create policy "sct_expert_admin_all_ins" on public.sct_expert_responses for insert to authenticated with check (public.is_super_admin());
create policy "sct_expert_admin_all_upd" on public.sct_expert_responses for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "sct_expert_admin_all_del" on public.sct_expert_responses for delete to authenticated using (public.is_super_admin());

drop policy if exists "sct_items_admin_manage" on public.sct_items;
create policy "sct_items_admin_manage_sel" on public.sct_items for select to authenticated using (public.is_admin());
create policy "sct_items_admin_manage_ins" on public.sct_items for insert to authenticated with check (public.is_super_admin());
create policy "sct_items_admin_manage_upd" on public.sct_items for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "sct_items_admin_manage_del" on public.sct_items for delete to authenticated using (public.is_super_admin());

drop policy if exists "sct_panel_admin_manage" on public.sct_panel_members;
create policy "sct_panel_admin_manage_sel" on public.sct_panel_members for select to authenticated using (public.is_admin());
create policy "sct_panel_admin_manage_ins" on public.sct_panel_members for insert to authenticated with check (public.is_super_admin());
create policy "sct_panel_admin_manage_upd" on public.sct_panel_members for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "sct_panel_admin_manage_del" on public.sct_panel_members for delete to authenticated using (public.is_super_admin());

drop policy if exists "sim_cases_admin_manage" on public.sim_cases;
create policy "sim_cases_admin_manage_sel" on public.sim_cases for select to authenticated using (public.is_admin());
create policy "sim_cases_admin_manage_ins" on public.sim_cases for insert to authenticated with check (public.is_super_admin());
create policy "sim_cases_admin_manage_upd" on public.sim_cases for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "sim_cases_admin_manage_del" on public.sim_cases for delete to authenticated using (public.is_super_admin());

drop policy if exists "style_patterns_admin_all" on public.style_patterns;
create policy "style_patterns_admin_all_sel" on public.style_patterns for select to authenticated using (public.is_admin());
create policy "style_patterns_admin_all_ins" on public.style_patterns for insert to authenticated with check (public.is_super_admin());
create policy "style_patterns_admin_all_upd" on public.style_patterns for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "style_patterns_admin_all_del" on public.style_patterns for delete to authenticated using (public.is_super_admin());

drop policy if exists "submission_files_admin_manage" on public.submission_files;
create policy "submission_files_admin_manage_sel" on public.submission_files for select to authenticated using (public.is_admin());
create policy "submission_files_admin_manage_ins" on public.submission_files for insert to authenticated with check (public.is_super_admin());
create policy "submission_files_admin_manage_upd" on public.submission_files for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "submission_files_admin_manage_del" on public.submission_files for delete to authenticated using (public.is_super_admin());

drop policy if exists "transcript_chunks_admin_manage" on public.transcript_chunks;
create policy "transcript_chunks_admin_manage_sel" on public.transcript_chunks for select to authenticated using (public.is_admin());
create policy "transcript_chunks_admin_manage_ins" on public.transcript_chunks for insert to authenticated with check (public.is_super_admin());
create policy "transcript_chunks_admin_manage_upd" on public.transcript_chunks for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "transcript_chunks_admin_manage_del" on public.transcript_chunks for delete to authenticated using (public.is_super_admin());

drop policy if exists "wall_posts_admin_manage" on public.wall_posts;
create policy "wall_posts_admin_manage_sel" on public.wall_posts for select to authenticated using (public.is_admin());
create policy "wall_posts_admin_manage_ins" on public.wall_posts for insert to authenticated with check (public.is_super_admin());
create policy "wall_posts_admin_manage_upd" on public.wall_posts for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "wall_posts_admin_manage_del" on public.wall_posts for delete to authenticated using (public.is_super_admin());

drop policy if exists "wall_replies_admin_manage" on public.wall_replies;
create policy "wall_replies_admin_manage_sel" on public.wall_replies for select to authenticated using (public.is_admin());
create policy "wall_replies_admin_manage_ins" on public.wall_replies for insert to authenticated with check (public.is_super_admin());
create policy "wall_replies_admin_manage_upd" on public.wall_replies for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "wall_replies_admin_manage_del" on public.wall_replies for delete to authenticated using (public.is_super_admin());
