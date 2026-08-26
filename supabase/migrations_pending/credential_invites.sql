-- credential_invites — the send queue for the roster credential emails.
--
-- Import and send are two separate steps (Part 1). Import creates the auth
-- account + stamps scope and records a `pending` row here WITHOUT emailing.
-- The admin reviews the batch, then explicitly sends — each row flips to
-- `sent` (with sent_at) or `failed` (with error_reason) so retries are per-row
-- and a bad Resend key or template surfaces here before it reaches a student.
--
-- The set-your-password link is minted FRESH at send time (generateLink), never
-- stored, so a link can never expire between import and send.
--
-- Additive + idempotent.
create table if not exists public.credential_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  status text not null default 'pending'
    check (status in ('pending','sent','failed')),
  error_reason text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.credential_invites enable row level security;
create policy "credential_invites_admin_all" on public.credential_invites
  for all using (public.is_admin()) with check (public.is_admin());
