-- Doubt answered → notify the student (owner decision 2026-11-06).
-- An in-app notice when an admin answers; ONE email if that notice is still
-- unopened 48 hours later. One row per admin answer; the email is claimed
-- with email_claimed_at before sending, so nobody is emailed twice.
-- Used by /api/cron/doubt-followup (daily) and a cheap check on admin pages.
-- The app works without this table (no notices are sent until it exists).

create table if not exists public.doubt_followups (
  reply_id uuid primary key references public.doubt_replies (id) on delete cascade,
  doubt_id uuid not null references public.doubts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  notification_id uuid references public.notifications (id) on delete set null,
  notified_at timestamptz not null default now(),
  email_claimed_at timestamptz,
  emailed_at timestamptz,
  -- sent | failed | opened (no email needed) | skipped (blocked/hidden) | merged (folded into an earlier notice)
  email_status text check (email_status in ('sent', 'failed', 'opened', 'skipped', 'merged')),
  created_at timestamptz not null default now()
);

create index if not exists doubt_followups_due_idx
  on public.doubt_followups (notified_at)
  where emailed_at is null and email_claimed_at is null and email_status is null;
create index if not exists doubt_followups_doubt_idx on public.doubt_followups (doubt_id);

-- Server only (service role). No policies = no browser access.
alter table public.doubt_followups enable row level security;
