-- =============================================================================
-- Calendar link: one private calendar link per student, so their classes and
-- OPD days show in Google Calendar or Apple Calendar and update on their own.
--
-- The link is https://vibhapsychology.com/api/calendar/<token>.ics. The
-- token is the only key, so this table is service role only (no policy for
-- anyone, like clinic_session_secrets). "Make a new link" replaces the token
-- and the old link stops working.
--
-- Additive and idempotent: safe to run any time, any number of times.
-- Run after 2026_11_16_clinic.sql.
-- =============================================================================

create table if not exists public.clinic_calendar_tokens (
  user_id uuid primary key references auth.users (id) on delete cascade,
  token text not null check (char_length(token) between 40 and 64),
  created_at timestamptz not null default now()
);

create unique index if not exists clinic_calendar_tokens_token_key on public.clinic_calendar_tokens (token);

alter table public.clinic_calendar_tokens enable row level security;
revoke all on public.clinic_calendar_tokens from anon;
revoke all on public.clinic_calendar_tokens from authenticated;
