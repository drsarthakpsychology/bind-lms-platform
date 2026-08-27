-- First-login mobile-number capture (Kavya: ask for Mobile + Confirm on first
-- login for WhatsApp, save it; ask on next login if we don't have it yet).
--
-- 1. profiles.mobile_number — the student's WhatsApp number (canonical 10-digit
--    Indian mobile, NULL until captured). Owned by the student, admin-readable.
-- 2. profiles.mobile_prompt_skipped_at — when a student chose "Later" so the
--    prompt doesn't nag every single login.
-- 3. A CHECK constraint enforcing the canonical format.
-- 4. protect_profile_columns() — closes a CRITICAL privilege-escalation hole
--    the mobile capture would otherwise widen: profiles_update_own_or_admin has
--    USING (auth.uid()=id OR is_admin()) with NO with_check, so a student can
--    already UPDATE their own row to role='admin'/scope/status/is_test. Once we
--    invite students to self-update mobile_number, this becomes easy to hit. The
--    trigger blocks non-admin row updates that change privilege-bearing columns.
--
-- Additive + idempotent. Service-role writes (auth.uid() is null) pass through.

alter table public.profiles
  add column if not exists mobile_number text,
  add column if not exists mobile_prompt_skipped_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_mobile_number_check'
  ) then
    alter table public.profiles
      add constraint profiles_mobile_number_check
      check (mobile_number is null or mobile_number ~ '^[6-9][0-9]{9}$');
  end if;
end $$;

-- Block non-admin row updates that change privilege-bearing columns. A student
-- may update their own mobile_number / mobile_prompt_skipped_at, nothing else.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if NEW.role is distinct from OLD.role
      or NEW.scope is distinct from OLD.scope
      or NEW.status is distinct from OLD.status
      or NEW.is_test is distinct from OLD.is_test
      or NEW.cohort_ended_at is distinct from OLD.cohort_ended_at
      or NEW.expires_at is distinct from OLD.expires_at then
      raise exception 'Cannot change protected profile fields.';
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();
