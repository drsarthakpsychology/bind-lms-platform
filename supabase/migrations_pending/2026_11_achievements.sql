-- =============================================================================
-- Achievements & Credentials — schema + RLS
-- =============================================================================
-- Reuses the existing tracking (learn_progress for study/XP, progress for
-- video watch time, submissions/assignments for assessed work) — no parallel
-- tracking tables. Two new tables only:
--   achievements  — badge/certificate templates + configurable requirements
--   credentials   — issued records (badges AND certificates) with a public
--                   opaque credential_id, approval/revocation audit, signature.
-- The legacy `certificates` table is left untouched; its rows keep working.
-- Idempotent. Additive only.
-- =============================================================================

-- 1. Achievement templates -----------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null default 'badge' check (type in ('badge', 'certificate')),
  title text not null,
  description text,
  -- Badge: study-module slug (e.g. 'interview-mse'). Certificate: course id.
  module_id text,
  course_id uuid references public.courses (id) on delete set null,
  icon text,
  tone text not null default 'lime',
  -- Configurable requirements (see src/lib/achievements/rules.ts):
  --   {kind:'module_complete', module}
  --   {kind:'sections_read', module, count}
  --   {kind:'xp', min}
  --   {kind:'watch_seconds', min}
  --   {kind:'course_complete', course_id}
  requirements jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  -- Certificate-only: the authorised signature asset (managed by Super Admin).
  signature_asset_path text,
  signature_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

drop policy if exists "achievements_select_admin" on public.achievements;
create policy "achievements_select_admin" on public.achievements
  for select to authenticated using (public.is_admin());

drop policy if exists "achievements_write_super" on public.achievements;
create policy "achievements_write_super" on public.achievements
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- 2. Issued credentials (badges + certificates) --------------------------------
create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  -- Public, opaque, non-sequential identifier (never the internal PK).
  credential_id text not null unique,
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete restrict,
  type text not null check (type in ('badge', 'certificate')),
  status text not null default 'issued' check (status in ('draft', 'approved', 'issued', 'revoked')),
  -- Snapshot of the approved display name at award/issue time.
  student_name text not null,
  issued_at timestamptz,
  approved_at timestamptz,
  approved_by uuid,
  issued_by uuid,
  signature_asset_path text,
  revoked_at timestamptz,
  revoke_reason text,
  revoked_by uuid,
  pdf_storage_path text,
  -- Human-readable record of why this was awarded (requirement snapshot).
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One badge per student per achievement (idempotent awarding).
create unique index if not exists one_badge_per_student_achievement
  on public.credentials (user_id, achievement_id) where type = 'badge';
create index if not exists credentials_user_idx on public.credentials (user_id);
create index if not exists credentials_achievement_idx on public.credentials (achievement_id);

alter table public.credentials enable row level security;

-- Students read their own (including drafts, so they see "pending approval");
-- admins read all.
drop policy if exists "credentials_select_own_or_admin" on public.credentials;
create policy "credentials_select_own_or_admin" on public.credentials
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- Only the Super Admin writes (badge awarding + certificate issuance run
-- through server actions with the service role; this is the client backstop).
drop policy if exists "credentials_write_super" on public.credentials;
create policy "credentials_write_super" on public.credentials
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
