-- Account status: an UNCONDITIONAL override checked on every authenticated
-- request, not just at sign-in. `blocked` is independent of credential
-- validity — an account can have a correct password and a valid session token
-- and still be rejected. Setting it takes effect on the very next request
-- (the session guard re-reads the profile per request; there is no TTL cache
-- on this check).
--
--   status       'active' | 'blocked'
--   block_reason internal-only note ("fee not paid", "requested pause", …),
--                never shown to the student.
--
-- Additive + idempotent.
alter table public.profiles
  add column if not exists status text not null default 'active'
    check (status in ('active','blocked')),
  add column if not exists block_reason text;
