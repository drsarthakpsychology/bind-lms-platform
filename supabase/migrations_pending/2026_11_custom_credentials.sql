-- =============================================================================
-- Custom certificates for anyone (volunteers, guest speakers, helpers)
-- =============================================================================
-- Owner decision 2026-11-06: admins can issue a certificate to someone who is
-- NOT a student. They get a certificate only: no login, no account. When the
-- email matches a student the certificate is linked to that student as well,
-- so it shows on their Achievements page.
--
--   user_id          now nullable (null = recipient without an account)
--   recipient_name   name typed by the admin
--   recipient_email  lower-cased; used to link to a student, now or later
--   recipient_phone  kept private (never on the verify page)
--   reason           the paragraph about what the person did (already exists
--                    from 2026_11_achievements.sql; "if not exists" keeps this safe)
--
-- Depends on: 2026_11_achievements.sql. Idempotent. Additive only.
-- =============================================================================

alter table public.credentials alter column user_id drop not null;

alter table public.credentials add column if not exists recipient_name text;
alter table public.credentials add column if not exists recipient_email text;
alter table public.credentials add column if not exists recipient_phone text;
alter table public.credentials add column if not exists reason text;

-- Every credential still belongs to someone: a student, or a named recipient
-- with an email address.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'credentials_has_owner'
  ) then
    alter table public.credentials
      add constraint credentials_has_owner
      check (user_id is not null or (recipient_email is not null and recipient_name is not null));
  end if;
end $$;

-- Find a student's email-linked certificates quickly.
create index if not exists credentials_recipient_email_idx
  on public.credentials (lower(recipient_email))
  where recipient_email is not null;

-- Students may read certificates sent to their own email address (the app
-- reads through the service role; this is the client-side backstop).
drop policy if exists "credentials_select_own_or_admin" on public.credentials;
create policy "credentials_select_own_or_admin" on public.credentials
  for select to authenticated using (
    auth.uid() = user_id
    or public.is_admin()
    or (recipient_email is not null and lower(recipient_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  );
