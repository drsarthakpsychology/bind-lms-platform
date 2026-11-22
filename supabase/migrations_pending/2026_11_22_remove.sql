-- =============================================================================
-- 2026_11_22_remove.sql
--
-- Removing people from VIBHA (admin: "Remove access" and "Delete account").
--
-- The code works without this file: it marks a removal in
-- profiles.block_reason ("[removed] ..." or "[deleted]"), a column every
-- database already has. This file adds clean dates and a quick index so the
-- lists and checks read faster and the history is clearer.
--
--   profiles.removed_at   when access was removed (null = has access)
--   profiles.removed_by   which admin removed it
--   profiles.deleted_at   when the account was deleted for good
--
-- Additive and idempotent: safe to run any time, any number of times. It
-- drops nothing and changes no existing rule. Row level security on profiles
-- stays as it is; the new columns are only written by the server (service
-- role), and protect_profile_columns below stops a student changing them.
-- =============================================================================

alter table public.profiles add column if not exists removed_at timestamptz;
alter table public.profiles add column if not exists removed_by uuid references auth.users (id) on delete set null;
alter table public.profiles add column if not exists deleted_at timestamptz;

-- Fill the dates for removals made before this ran (marked in block_reason).
update public.profiles
   set removed_at = coalesce(removed_at, now())
 where status = 'blocked'
   and (block_reason like '[removed]%' or block_reason like '[deleted]%')
   and removed_at is null;
update public.profiles
   set deleted_at = coalesce(deleted_at, removed_at, now())
 where block_reason like '[deleted]%'
   and deleted_at is null;

-- Students' lists skip removed people: a small partial index keeps that cheap.
create index if not exists profiles_removed_idx on public.profiles (id) where removed_at is not null;

-- A signed-in student can never set or clear these on their own row.
create or replace function public.protect_profile_removal()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.removed_at is distinct from old.removed_at
      or new.removed_by is distinct from old.removed_by
      or new.deleted_at is distinct from old.deleted_at
      or new.block_reason is distinct from old.block_reason then
      raise exception 'Cannot change protected profile fields.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_removal_trigger on public.profiles;
create trigger protect_profile_removal_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_removal();

-- The app's deletion requests: keep who answered and when (columns exist since
-- 2026_11_15_app_deletion_requests.sql); RLS stays on, no new policy needed.
alter table public.app_deletion_requests enable row level security;
