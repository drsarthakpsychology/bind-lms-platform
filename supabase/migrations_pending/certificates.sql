-- certificates: records issued certificates (admin-approved completion).
--
-- A certificate is only created AFTER the manual instructor/admin sign-off —
-- never automatically at 100% completion. The row powers the public
-- /verify/<id> page that the QR code on the PDF points to.
--
-- Run in the Supabase SQL Editor. Idempotent.
-- =============================================================================

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  course_id uuid references courses (id) on delete set null,
  student_name text not null,
  course_title text not null,
  issued_at timestamptz not null default now(),
  -- who approved the completion (admin/instructor sign-off)
  issued_by uuid references profiles (id) on delete set null,
  pdf_storage_path text
);

create index if not exists idx_certificates_user_id on certificates (user_id);
