-- =============================================================================
-- 2026_11_15_app_deletion_requests.sql
--
-- app_deletion_requests  one row each time a person asks, from the Vibha
--                        Psychology app, for their account to be deleted
--                        (Google Play requires a way to ask from inside the
--                        app). A person checks each request; nothing is
--                        deleted automatically.
--
-- Additive and idempotent: safe to run any time, any number of times. It
-- changes no existing table.
--
-- Row level security: a signed-in person can read their own requests; admins
-- can read all. Nobody writes from the app or the browser: the server writes
-- with the service role after its own checks (src/lib/app-api/deletion.ts).
--
-- Before this is run the request still reaches the team: the super admin gets
-- a bell notice (and a phone push) for every request. Only the stored list is
-- missing.
-- =============================================================================

create table if not exists public.app_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text,
  reason text check (reason is null or char_length(reason) <= 1000),
  status text not null default 'open' check (status in ('open', 'done', 'declined')),
  created_at timestamptz not null default now(),
  handled_at timestamptz,
  handled_by uuid references auth.users (id) on delete set null
);

create index if not exists app_deletion_requests_user_idx on public.app_deletion_requests (user_id, created_at desc);
create index if not exists app_deletion_requests_open_idx on public.app_deletion_requests (created_at desc) where status = 'open';

alter table public.app_deletion_requests enable row level security;

drop policy if exists "app_deletion_requests_own_select" on public.app_deletion_requests;
create policy "app_deletion_requests_own_select" on public.app_deletion_requests
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "app_deletion_requests_admin_select" on public.app_deletion_requests;
create policy "app_deletion_requests_admin_select" on public.app_deletion_requests
  for select to authenticated using (
    exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('admin', 'view_admin'))
  );

revoke insert, update, delete on public.app_deletion_requests from anon, authenticated;
