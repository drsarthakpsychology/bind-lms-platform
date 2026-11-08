-- =============================================================================
-- Answer history: which items each student has answered in each tool, and how.
-- One row per student, tool and item. Tools use it to pick a new round:
-- never-seen items first, then the ones answered wrong, and right ones only
-- after everything has been seen (oldest first).
--
-- Used by src/lib/history (server.ts writes, actions.ts reads for the browser).
-- Exam Prep keeps using prep_answers and prep_seen; it does not write here.
--
-- Additive and idempotent: safe to run any time, any number of times.
-- Until this runs, every tool still works (random order, browser copy only).
-- Students read and write only their own rows. The app writes through the
-- server with the service role.
-- =============================================================================

create table if not exists public.answer_history (
  user_id uuid not null references auth.users (id) on delete cascade,
  tool text not null check (char_length(tool) between 1 and 40),
  item text not null check (char_length(item) between 1 and 200),
  seen_count integer not null default 1 check (seen_count >= 0),
  last_correct boolean,
  last_seen_at timestamptz not null default now(),
  next_due timestamptz,
  primary key (user_id, tool, item)
);

create index if not exists answer_history_user_tool_seen_idx on public.answer_history (user_id, tool, last_seen_at desc);

alter table public.answer_history enable row level security;

drop policy if exists "answer_history_own_select" on public.answer_history;
create policy "answer_history_own_select" on public.answer_history
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "answer_history_own_insert" on public.answer_history;
create policy "answer_history_own_insert" on public.answer_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "answer_history_own_update" on public.answer_history;
create policy "answer_history_own_update" on public.answer_history
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- No delete for students; rows go when the account goes (on delete cascade).
revoke delete on public.answer_history from anon, authenticated;
revoke all on public.answer_history from anon;
grant select, insert, update on public.answer_history to authenticated;
