-- =============================================================================
-- Exam Prep question bank: one row per student per question.
-- Holds the last answer (for "percent right" per topic, "Wrong answers" and
-- resuming a set) and the Saved flag (bookmarks).
-- Additive and idempotent: safe to run any time, any number of times.
-- Students can READ their own rows (admins read all). Every write goes through
-- the server with the service role (src/lib/prep/answers.ts).
-- Until this runs, the app degrades quietly: no Save button, Wrong answers
-- come from spaced-review cards, resume comes from prep_seen.
-- =============================================================================

create table if not exists public.prep_answers (
  user_id uuid not null references auth.users (id) on delete cascade,
  item text not null,
  last_choice smallint check (last_choice between 0 and 3),
  last_ok boolean,
  right_n integer not null default 0,
  wrong_n integer not null default 0,
  saved boolean not null default false,
  saved_at timestamptz,
  last_at timestamptz not null default now(),
  primary key (user_id, item)
);
create index if not exists prep_answers_user_last_idx on public.prep_answers (user_id, last_at desc);
create index if not exists prep_answers_user_saved_idx on public.prep_answers (user_id) where saved;

alter table public.prep_answers enable row level security;
drop policy if exists "prep_answers_own_select" on public.prep_answers;
create policy "prep_answers_own_select" on public.prep_answers
  for select using (auth.uid() = user_id or public.is_admin());

-- Signed-in users never write directly.
revoke insert, update, delete on public.prep_answers from anon, authenticated;
