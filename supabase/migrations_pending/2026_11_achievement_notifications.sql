-- =============================================================================
-- Achievement & certificate notifications (in-app) — additive
-- =============================================================================
-- The existing /notifications page is a schema-free derived feed (wall replies
-- + reports); it has no persisted store, so achievement notifications need a
-- small table for unread state + mark-as-read. Email delivery reuses
-- email_sends (already tracks sent/failed for retry). Idempotent + additive.
-- =============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('badge', 'certificate')),
  credential_id text not null,
  title text not null,
  body text not null,
  href text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

-- Students read and mark-as-read their own; no client INSERT/DELETE (written
-- server-side only, so a student can never fabricate an achievement notice).
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
