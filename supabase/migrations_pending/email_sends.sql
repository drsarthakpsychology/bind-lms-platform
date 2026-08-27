-- email_sends — the /admin/emails control center's unified send history.
--
-- Every send logs a row here: credential emails (from sendCredentialEmails)
-- AND campaign emails (from the compose tab). One feed powers the "Sent" tab
-- with status per recipient. Admin-only RLS (is_admin()).
--
-- Additive + idempotent.
create table if not exists public.email_sends (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  name text,
  subject text not null,
  template_id text,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed')),
  error_reason text,
  sent_at timestamptz,
  sent_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists email_sends_created_at_idx on public.email_sends (created_at desc);
create index if not exists email_sends_recipient_idx on public.email_sends (recipient);

alter table public.email_sends enable row level security;

create policy "email_sends_admin_all" on public.email_sends
  for all using (public.is_admin()) with check (public.is_admin());
