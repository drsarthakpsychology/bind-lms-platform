-- =============================================================================
-- Lumen Practice Layer — Peer role-play message thread (Part 6.6)
-- =============================================================================
-- The pair_sessions table already exists (practice_layer_rest.sql). This adds
-- the message thread it needs, with participant-only RLS. Additive + idempotent.

create table if not exists public.pair_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  session_id uuid not null references public.pair_sessions (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.pair_messages enable row level security;

-- Participants of the session (or admin) may read the thread.
create policy "pair_messages_select_participant_or_admin" on public.pair_messages
  for select using (
    exists (
      select 1 from public.pair_sessions ps
      where ps.id = pair_messages.session_id
        and (auth.uid() = ps.student_a or auth.uid() = ps.student_b)
    )
    or public.is_admin()
  );

-- A participant may insert into their own thread.
create policy "pair_messages_insert_participant" on public.pair_messages
  for insert with check (
    exists (
      select 1 from public.pair_sessions ps
      where ps.id = pair_messages.session_id
        and (auth.uid() = ps.student_a or auth.uid() = ps.student_b)
    )
    and auth.uid() = sender_id
  );

create index if not exists idx_pair_messages_session on public.pair_messages (session_id, created_at);
