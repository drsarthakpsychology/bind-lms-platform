-- =============================================================================
-- MSE stimuli — expert_coding jsonb so levels 2/4 can read their ground truth
-- from the DB (Part 6.4 content wiring; additive + idempotent).
-- =============================================================================
-- mse_expert_codings (tag + confidence) is too thin to carry the domain-level
-- green/amber coding the ladder scores against. Store the authored coding on
-- the stimulus row instead: { expertTags, amberTags } for Level 2, and
-- { expert: MseCode, amber: Record<domain,string[]> } for Level 4. Seeded by
-- scripts/upsert-mse-stimuli.ts. Empty object {} for Level 1 observe vignettes
-- (they score against behavioural vocabulary, not a code).

alter table if exists public.mse_stimuli
  add column if not exists expert_coding jsonb not null default '{}'::jsonb;
