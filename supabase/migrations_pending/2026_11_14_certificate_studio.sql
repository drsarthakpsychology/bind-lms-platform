-- =============================================================================
-- Certificate studio (2026-11-14)
-- =============================================================================
-- Admin → Credentials → Certificate studio: completion, provisional (with an
-- expiry date), special recognition and custom certificates, issued to one
-- student, several, or a whole cohort, with a live preview, in-app notice,
-- email (queued past the daily limit), revoke, reissue and resend.
--
-- Builds on the existing `credentials` table (2026_11_achievements.sql and
-- 2026_11_custom_credentials.sql), so /verify, My Achievements, revoke and
-- the monthly merit certificates keep working unchanged.
--
-- Run in the Supabase SQL Editor. Idempotent. Additive only: no rows are
-- changed except the safety backfill of recipient_email/recipient_name on
-- existing certificates (so a certificate outlives a deleted account).
-- =============================================================================

-- 1. New columns on credentials ------------------------------------------------
alter table public.credentials add column if not exists kind text;
alter table public.credentials add column if not exists title text;
alter table public.credentials add column if not exists wording jsonb not null default '{}'::jsonb;
alter table public.credentials add column if not exists expires_at timestamptz;
alter table public.credentials add column if not exists signatories jsonb not null default '[]'::jsonb;
alter table public.credentials add column if not exists course_id uuid;
alter table public.credentials add column if not exists course_label text;
alter table public.credentials add column if not exists module_label text;
alter table public.credentials add column if not exists cohort_id uuid;
alter table public.credentials add column if not exists batch_id uuid;
alter table public.credentials add column if not exists replaces text;
alter table public.credentials add column if not exists replaced_by text;
alter table public.credentials add column if not exists email_status text;
-- Make sure these exist even if 2026_11_custom_credentials.sql was skipped.
alter table public.credentials add column if not exists recipient_name text;
alter table public.credentials add column if not exists recipient_email text;
alter table public.credentials add column if not exists reason text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'credentials_kind_check') then
    alter table public.credentials add constraint credentials_kind_check
      check (kind is null or kind in ('completion', 'provisional', 'recognition', 'custom'));
  end if;
  -- A provisional certificate always has an end date.
  if not exists (select 1 from pg_constraint where conname = 'credentials_provisional_expires') then
    alter table public.credentials add constraint credentials_provisional_expires
      check (kind is distinct from 'provisional' or expires_at is not null);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_email_status_check') then
    alter table public.credentials add constraint credentials_email_status_check
      check (email_status is null or email_status in ('sent', 'queued', 'failed', 'none'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_course_id_fkey') then
    alter table public.credentials add constraint credentials_course_id_fkey
      foreign key (course_id) references public.courses (id) on delete set null;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_cohort_id_fkey') then
    alter table public.credentials add constraint credentials_cohort_id_fkey
      foreign key (cohort_id) references public.cohorts (id) on delete set null;
  end if;
end $$;

create index if not exists credentials_kind_idx on public.credentials (kind) where kind is not null;
create index if not exists credentials_cohort_idx on public.credentials (cohort_id) where cohort_id is not null;
create index if not exists credentials_created_idx on public.credentials (created_at desc);

-- 2. Certificates are never deleted (revoke instead) ---------------------------
-- Backfill so every certificate names its owner even without an account.
update public.credentials c
   set recipient_email = lower(p.email)
  from public.profiles p
 where c.type = 'certificate' and c.user_id = p.id and c.recipient_email is null and p.email is not null;
update public.credentials
   set recipient_name = student_name
 where type = 'certificate' and recipient_name is null;

-- Deleting a student account keeps their certificates (detached from the
-- account, still verifiable). Badges still go with the account.
create or replace function public.keep_certificates_on_profile_delete()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.credentials
     set recipient_email = coalesce(recipient_email, lower(old.email), 'deleted-account@invalid'),
         recipient_name = coalesce(recipient_name, student_name),
         user_id = null
   where user_id = old.id and type = 'certificate';
  return old;
end $$;

drop trigger if exists keep_certificates_on_profile_delete on public.profiles;
create trigger keep_certificates_on_profile_delete
  before delete on public.profiles
  for each row execute function public.keep_certificates_on_profile_delete();

create or replace function public.block_certificate_delete()
returns trigger language plpgsql as $$
begin
  if old.type = 'certificate' then
    raise exception 'Certificates are never deleted. Revoke it instead.';
  end if;
  return old;
end $$;

drop trigger if exists block_certificate_delete on public.credentials;
create trigger block_certificate_delete
  before delete on public.credentials
  for each row execute function public.block_certificate_delete();

-- 3. Email queue (emails over the daily limit wait here) -----------------------
create table if not exists public.certificate_email_queue (
  id uuid primary key default gen_random_uuid(),
  credential_id text not null references public.credentials (credential_id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  recipient text not null,
  name text,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'cancelled')),
  attempts int not null default 0,
  last_error text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists certificate_email_queue_status_idx on public.certificate_email_queue (status, created_at);
create unique index if not exists certificate_email_queue_one_open
  on public.certificate_email_queue (credential_id) where status = 'queued';

alter table public.certificate_email_queue enable row level security;

drop policy if exists "cert_email_queue_select_admin" on public.certificate_email_queue;
create policy "cert_email_queue_select_admin" on public.certificate_email_queue
  for select to authenticated using (public.is_admin());

drop policy if exists "cert_email_queue_write_super" on public.certificate_email_queue;
create policy "cert_email_queue_write_super" on public.certificate_email_queue
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- 4. Row level security on credentials (restated; unchanged in meaning) -------
-- Students read their own (by account or by email); admins read all; only the
-- Super Admin writes. The app writes through the service role after its own
-- Super Admin check; these policies are the backstop.
alter table public.credentials enable row level security;

drop policy if exists "credentials_select_own_or_admin" on public.credentials;
create policy "credentials_select_own_or_admin" on public.credentials
  for select to authenticated using (
    auth.uid() = user_id
    or public.is_admin()
    or (recipient_email is not null and lower(recipient_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  );

drop policy if exists "credentials_write_super" on public.credentials;
create policy "credentials_write_super" on public.credentials
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
