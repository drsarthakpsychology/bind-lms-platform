-- =============================================================================
-- Platform rebuild (2026-11): secure account setup, email tracking + inbox,
-- and the People CRM. Additive except ONE deliberate destructive step: the
-- plain-text `credential_invites.password` column is dropped (security fix).
-- Apply after deploying the matching code. All tables admin-only via RLS;
-- server code uses the service role.
-- =============================================================================

-- 1. One-time account setup links ------------------------------------------
create table if not exists public.account_setup_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  token_hash text not null unique,          -- sha256 of the token; the token itself is never stored
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists account_setup_tokens_user_idx on public.account_setup_tokens (user_id);
alter table public.account_setup_tokens enable row level security;
drop policy if exists "account_setup_tokens_admin_all" on public.account_setup_tokens;
create policy "account_setup_tokens_admin_all" on public.account_setup_tokens
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.credential_invites add column if not exists setup_completed_at timestamptz;

-- 2. Email tracking (Resend webhooks) + a body copy for the reading pane ------
alter table public.email_sends add column if not exists provider_id text;
alter table public.email_sends add column if not exists body_text text;
alter table public.email_sends add column if not exists delivered_at timestamptz;
alter table public.email_sends add column if not exists opened_at timestamptz;
alter table public.email_sends add column if not exists clicked_at timestamptz;
alter table public.email_sends add column if not exists bounced_at timestamptz;
alter table public.email_sends add column if not exists complained_at timestamptz;
create index if not exists email_sends_provider_idx on public.email_sends (provider_id);

-- 3. Inbound replies (Resend inbound → webhook) --------------------------------
create table if not exists public.email_inbound (
  id uuid primary key default gen_random_uuid(),
  provider_id text unique,
  from_email text not null,
  from_name text,
  to_email text,
  subject text,
  body_text text,
  body_html text,
  received_at timestamptz not null default now(),
  read_at timestamptz,
  archived_at timestamptz
);
create index if not exists email_inbound_received_idx on public.email_inbound (received_at desc);
create index if not exists email_inbound_from_idx on public.email_inbound (lower(from_email));
alter table public.email_inbound enable row level security;
drop policy if exists "email_inbound_admin_all" on public.email_inbound;
create policy "email_inbound_admin_all" on public.email_inbound
  for all using (public.is_admin()) with check (public.is_admin());

-- 4. People CRM ---------------------------------------------------------------
-- One row per person (keyed by lower-cased email): their pipeline stage and
-- next follow-up. Enquiries and student accounts stay where they are; the CRM
-- joins them by email.
create table if not exists public.crm_contacts (
  email text primary key,
  name text,
  phone text,
  stage text not null default 'new'
    check (stage in ('new','contacted','call_done','fee_shared','joined','not_interested','no_reply')),
  next_follow_up_at timestamptz,
  owner_id uuid,
  college text,
  updated_at timestamptz not null default now()
);
create index if not exists crm_contacts_follow_up_idx on public.crm_contacts (next_follow_up_at);
alter table public.crm_contacts enable row level security;
drop policy if exists "crm_contacts_admin_all" on public.crm_contacts;
create policy "crm_contacts_admin_all" on public.crm_contacts
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null check (kind in ('note','call','whatsapp','email','meeting','stage')),
  body text,
  created_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists crm_activities_email_idx on public.crm_activities (email, created_at desc);
alter table public.crm_activities enable row level security;
drop policy if exists "crm_activities_admin_all" on public.crm_activities;
create policy "crm_activities_admin_all" on public.crm_activities
  for all using (public.is_admin()) with check (public.is_admin());
