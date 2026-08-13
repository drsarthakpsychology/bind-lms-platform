-- =============================================================================
-- Enquiries — the public site's lead form (VIBHA landing CTA).
-- =============================================================================
-- Anonymous visitors submit via a server action (admin/service client) — there
-- is NO anon insert policy, so the browser can never write directly. Faculty
-- read submissions at /admin/enquiries (admin-only select).
-- Additive + idempotent.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,
  email text not null,
  phone text,
  status text check (status in ('student','early_career','practitioner','other')),
  message text,
  source text not null default 'landing',
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

-- Admin-only read. No insert/update/delete for any role via RLS — writes go
-- through the server action with the service-role client.
create policy "enquiries_admin_select" on public.enquiries
  for select using (public.is_admin());
