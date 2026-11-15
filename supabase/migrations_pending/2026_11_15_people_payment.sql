-- People (pipeline): record that someone has paid.
-- Additive only. Safe to paste more than once.
-- Until this is pasted, the Pipeline works as before and "Mark paid" says
-- the database step is missing; nothing breaks.

alter table public.crm_contacts add column if not exists paid_at timestamptz;
alter table public.crm_contacts add column if not exists paid_amount numeric(10, 2);
alter table public.crm_contacts add column if not exists paid_note text;
alter table public.crm_contacts add column if not exists paid_by uuid references auth.users (id) on delete set null;

-- The timeline gets a "payment" entry when someone is marked paid (or unmarked).
alter table public.crm_activities drop constraint if exists crm_activities_kind_check;
alter table public.crm_activities add constraint crm_activities_kind_check
  check (kind = any (array['note', 'call', 'whatsapp', 'email', 'meeting', 'stage', 'payment']));

create index if not exists crm_contacts_paid_at_idx on public.crm_contacts (paid_at);
