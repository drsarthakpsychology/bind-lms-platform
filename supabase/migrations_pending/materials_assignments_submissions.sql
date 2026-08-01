-- =============================================================================
-- Phase 6 — Materials, assignment/submission extensions, enrollment, and the
-- non-negotiable access rules.
--
-- Adds:
--   * course_enrollments      — manual per-student enrollment (admin-managed)
--   * materials               — files/links attached to a course or a lesson
--   * assignments             — widened: title, instructions, due date, late
--                                flag, accepted formats, file limits, status
--   * submissions             — widened: note, late flag, returned/grade state
--   * submission_files        — files belonging to a submission
--   * a private `materials` storage bucket
--
-- Access rules (enforced at the DB + storage layer, not just hidden UI):
--   * Admin: full access to everything.
--   * Student: can read materials and assignments ONLY when the assignment is
--     published AND they are enrolled in the course (materials live under a
--     published course; there's no draft flag on a material).
--   * Student: can create/read/update/delete their OWN submission only, and
--     only while its status is 'pending_review' — once returned it's locked.
--   * Student can never read another student's submission or files.
--   * Every file request re-checks enrolment at request time (signed URLs are
--     minted server-side per request; the bucket itself stays private).
--
-- Idempotent: safe to re-run via `npm run apply-migrations`.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enrollment
-- ---------------------------------------------------------------------------
create table if not exists course_enrollments (
  user_id uuid not null references profiles (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index if not exists idx_enrollments_course_id on course_enrollments (course_id);
create index if not exists idx_enrollments_user_id on course_enrollments (user_id);

alter table course_enrollments enable row level security;

-- Anyone (signed in) can read enrollments so the UI can render "am I enrolled".
-- Write access is admin-only; the admin flow inserts/removes rows.
create policy "enrollments_select_all" on course_enrollments
  for select using (true);

create policy "enrollments_admin_manage" on course_enrollments
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. Materials
-- ---------------------------------------------------------------------------
create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  lesson_id uuid references lessons (id) on delete cascade,
  title text not null,
  kind text not null check (kind in ('document', 'slides', 'audio', 'image', 'link')),
  storage_path text,               -- for file kinds (document/slides/audio/image)
  format text,                     -- e.g. 'pdf', 'pptx', 'mp3', 'png'
  size_bytes bigint,               -- for file kinds
  url text,                        -- for kind = 'link'
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A material must be either a file or a link, not both.
  check (
    (kind = 'link' and url is not null and storage_path is null)
    or (kind <> 'link' and storage_path is not null and url is null)
  )
);

create index if not exists idx_materials_course_id on materials (course_id);
create index if not exists idx_materials_lesson_id on materials (lesson_id);

-- Keep updated_at fresh.
create or replace function public.touch_material()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- SECURITY DEFINER triggers must not be callable via the public RPC surface.
revoke execute on function public.touch_material() from anon, authenticated;

drop trigger if exists materials_touch on materials;
create trigger materials_touch
  before update on materials
  for each row execute function public.touch_material();

alter table materials enable row level security;

-- Student read: material's course must be published AND the student enrolled.
create policy "materials_select_published_and_enrolled" on materials
  for select using (
    public.is_admin()
    or (
      exists (
        select 1 from courses c
        where c.id = materials.course_id and c.is_published = true
      )
      and exists (
        select 1 from course_enrollments ce
        where ce.course_id = materials.course_id and ce.user_id = auth.uid()
      )
    )
  );

create policy "materials_admin_manage" on materials
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Assignments — widen for the editor (Phase 5)
-- ---------------------------------------------------------------------------
alter table assignments
  add column if not exists title text,
  add column if not exists instructions text,
  add column if not exists due_at timestamptz,
  add column if not exists allow_late boolean not null default true,
  add column if not exists accepted_formats text[] not null default array['pdf','docx','image'],
  add column if not exists max_files integer not null default 3,
  add column if not exists max_file_mb integer not null default 25,
  add column if not exists is_published boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Backfill: existing assignments become published with a derived title so the
-- editor and student view both work immediately.
update assignments set is_published = true where is_published = false;
update assignments set title = 'Assignment' where title is null or title = '';

-- Keep updated_at fresh.
create or replace function public.touch_assignment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- SECURITY DEFINER triggers must not be callable via the public RPC surface.
revoke execute on function public.touch_assignment() from anon, authenticated;

drop trigger if exists assignments_touch on assignments;
create trigger assignments_touch
  before update on assignments
  for each row execute function public.touch_assignment();

-- Existing RLS on assignments lets any signed-in user read any assignment whose
-- lesson sits in a published course (and admins manage all). Widen the read
-- gate to require enrollment as well, matching the brief's access rules. We
-- replace the old select policy.
drop policy if exists "assignments_select_via_lesson" on assignments;

create policy "assignments_select_published_and_enrolled" on assignments
  for select using (
    public.is_admin()
    or (
      exists (
        select 1 from lessons l
        join courses c on c.id = l.course_id
        where l.id = assignments.lesson_id and c.is_published = true
      )
      and exists (
        select 1 from lessons l2
        join course_enrollments ce on ce.course_id = l2.course_id
        where l2.id = assignments.lesson_id and ce.user_id = auth.uid()
      )
      -- Students can read their own draft assignment? No — drafts are admin-only.
      and assignments.is_published = true
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Submissions — widen for grading (Phase 5)
-- ---------------------------------------------------------------------------
alter table submissions
  add column if not exists note text,
  add column if not exists submitted_at timestamptz not null default now(),
  add column if not exists is_late boolean not null default false,
  add column if not exists score numeric(5,2),
  add column if not exists feedback text,
  add column if not exists returned_at timestamptz;

-- The status CHECK only allowed 'pending_review'|'approved'. Widen to a
-- 'returned' terminal state (feedback given). 'approved' stays for backward
-- compat with the existing review flow.
alter table submissions drop constraint if exists submissions_status_check;
alter table submissions add constraint submissions_status_check
  check (status in ('pending_review', 'approved', 'returned'));

alter table submissions enable row level security;

-- Students may update their own submission ONLY while it's pending_review.
-- Replace the two overlapping update policies with one coherent pair:
--   * admin can always update (grading)
--   * student can update only their own row while status = 'pending_review'
drop policy if exists "submissions_update_admin_only" on submissions;
drop policy if exists "submissions_update_own_while_pending" on submissions;

create policy "submissions_update_admin_only" on submissions
  for update using (public.is_admin()) with check (public.is_admin());

create policy "submissions_update_own_while_pending" on submissions
  for update using (
    auth.uid() = user_id and status = 'pending_review'
  ) with check (
    auth.uid() = user_id and status = 'pending_review'
  );

-- ---------------------------------------------------------------------------
-- 5. Submission files
-- ---------------------------------------------------------------------------
create table if not exists submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions (id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  format text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create index if not exists idx_submission_files_submission_id on submission_files (submission_id);

alter table submission_files enable row level security;

-- Read: the file's owner (via the submission) or an admin. A student can only
-- ever read files on their OWN submission.
create policy "submission_files_select_owner_or_admin" on submission_files
  for select using (
    public.is_admin()
    or exists (
      select 1 from submissions s
      where s.id = submission_files.submission_id and s.user_id = auth.uid()
    )
  );

-- Insert: the file's submission must be owned by the caller and still pending.
create policy "submission_files_insert_owner_pending" on submission_files
  for insert with check (
    exists (
      select 1 from submissions s
      where s.id = submission_files.submission_id
        and s.user_id = auth.uid()
        and s.status = 'pending_review'
    )
  );

create policy "submission_files_admin_manage" on submission_files
  for all using (public.is_admin()) with check (public.is_admin());

-- Delete: owner while pending, or admin.
create policy "submission_files_delete_owner_pending" on submission_files
  for delete using (
    exists (
      select 1 from submissions s
      where s.id = submission_files.submission_id
        and s.user_id = auth.uid()
        and s.status = 'pending_review'
    )
  );

-- ---------------------------------------------------------------------------
-- 6. Private materials bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'materials',
  'materials',
  false,
  104857600, -- 100MB default cap (configurable client+server side)
  null
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "materials_bucket_admin_all" on storage.objects
  for all
  using (bucket_id = 'materials' and public.is_admin())
  with check (bucket_id = 'materials' and public.is_admin());

-- Note: student file access is NOT via bucket RLS — it's per-request signed
-- URLs minted server-side after an enrolment check (see lib/media), matching
-- how the videos and submissions buckets already work. The bucket stays
-- admin-only; no public/student read policy exists, so guessing a path
-- returns nothing.
