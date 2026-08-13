-- =============================================================================
-- MSE stimuli — title column so Level 4 renders authored vignette titles from
-- the DB (Part 6.4 content wiring; additive + idempotent). Level 4's
-- FullMseStimulus needs a human title ("Sandeep, 35 — the man who can't sit in
-- a meeting"), not the stable slug ("mse4-sandeep"). Seeded by
-- scripts/upsert-mse-stimuli.ts. Null for Level 1/2 rows — those levels render
-- the content itself, not a title.
-- =============================================================================

alter table if exists public.mse_stimuli
  add column if not exists title text;
