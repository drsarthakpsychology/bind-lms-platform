-- Automatic calibration signals (Part 2): multi-model consensus + self-
-- consistency variance write to these columns, driven by the background
-- script scripts/calibration-auto.ts. `agreement` + `n_scored` stay the
-- human-vs-AI weighted kappa from the existing manual/passive path.
--
--   inter_model_agreement  model-A vs model-B agreement per dimension (0..1).
--   variance               self-consistency variance across 3 temperature-
--                          sampled scoring runs (stddev, scale-normalised).
--   last_auto_at           when the automatic signals last refreshed.
--
-- Additive + idempotent.
alter table public.rubric_dimensions
  add column if not exists inter_model_agreement numeric,
  add column if not exists variance numeric,
  add column if not exists last_auto_at timestamptz;
