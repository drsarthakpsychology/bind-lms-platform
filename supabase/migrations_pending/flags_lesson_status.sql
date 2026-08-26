-- 3-state go-live control for features + lessons (2026-08-26, per Kavya).
--
-- feature_flags.status: off | live | unlocked
--   off      = hidden entirely — no card, route blocked ("not available").
--   live     = students SEE the section exists but it is "yet to be live":
--              the card shows a locked state and the route shows a locked
--              screen instead of content.
--   unlocked = full content access.
-- `enabled` is kept in sync (status != 'off') so nothing else that reads it
-- regresses.
--
-- lessons.status: hidden | live | unlocked
--   hidden   = only in the builder; students don't see the lesson row.
--   live     = students see the lesson row but it is locked ("yet to be live").
--   unlocked = students see + play it.
--
-- Backfill: existing enabled flags stay unlocked; disabled flags become off.
-- Existing lessons stay unlocked (playable) so the current live course is
-- unaffected; NEW lessons default to `live` (visible but locked until the
-- admin unlocks them).
--
-- Additive + idempotent.
alter table public.feature_flags
  add column if not exists status text not null default 'unlocked'
    check (status in ('off', 'live', 'unlocked'));

update public.feature_flags
  set status = case when enabled then 'unlocked' else 'off' end
  where status = 'unlocked' and enabled = false;

alter table public.lessons
  add column if not exists status text not null default 'live'
    check (status in ('hidden', 'live', 'unlocked'));

update public.lessons set status = 'unlocked' where status = 'live';
