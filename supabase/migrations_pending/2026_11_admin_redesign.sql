-- Admin redesign (2026-11-06) — additive and safe to run more than once.
-- Nothing is deleted. Run in Supabase → SQL Editor → paste → Run.
--
-- 1. Email retry: keep the HTML copy of each email and link a retry to the
--    failed email it retries (so nobody is sent the same email twice).
-- 2. Notifications from the admin: messages and nudges (until now only
--    badge / certificate notifications could be stored).
-- 3. "Still watching?" checks during lectures.

-- 1 ─ email_sends
alter table public.email_sends add column if not exists html text;
alter table public.email_sends add column if not exists retry_of uuid references public.email_sends (id) on delete set null;
alter table public.email_sends add column if not exists retried_at timestamptz;
create index if not exists email_sends_retry_of_idx on public.email_sends (retry_of);
create index if not exists email_sends_status_idx on public.email_sends (status, created_at desc);

-- 2 ─ notifications
alter table public.notifications alter column credential_id drop not null;
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check
  check (type in ('badge', 'certificate', 'message', 'nudge'));
alter table public.notifications add column if not exists body_html text;
alter table public.notifications add column if not exists sent_by uuid references public.profiles (id) on delete set null;
alter table public.notifications add column if not exists batch_id uuid;
alter table public.notifications add column if not exists opened_at timestamptz;
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index if not exists notifications_batch_idx on public.notifications (batch_id);
-- Students keep their existing policies (read own, mark own read). Admins read all:
drop policy if exists "notifications_admin_select" on public.notifications;
create policy "notifications_admin_select" on public.notifications
  for select using (public.is_admin());

-- 3 ─ attention_checks
create table if not exists public.attention_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete cascade,
  asked_at timestamptz not null default now(),
  answered_at timestamptz,
  missed boolean not null default false,
  position_seconds integer,
  created_at timestamptz not null default now()
);
create index if not exists attention_checks_user_idx on public.attention_checks (user_id, asked_at desc);
create index if not exists attention_checks_lesson_idx on public.attention_checks (lesson_id);
alter table public.attention_checks enable row level security;
drop policy if exists "attention_checks_select" on public.attention_checks;
create policy "attention_checks_select" on public.attention_checks
  for select using (auth.uid() = user_id or public.is_admin());
-- Writes go through the server (service role) only; no student insert/update policy.

-- Speeds up the Activity page.
create index if not exists page_visits_entered_idx on public.page_visits (entered_at desc);
create index if not exists page_visits_user_entered_idx on public.page_visits (user_id, entered_at desc);
create index if not exists progress_updated_idx on public.progress (updated_at desc);
