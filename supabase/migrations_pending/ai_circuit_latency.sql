-- Performance pass Part 9 — circuit breaker latency signal.
--
-- The router's breaker previously keyed ONLY on consecutive failures, so a
-- provider that returns 200 but takes ~19s was never tripped and blocked every
-- request for up to the 20s timeout. These columns let the breaker persist a
-- rolling latency EMA per provider so sustained high latency opens the circuit
-- the same way repeated failures do.
--
-- Additive + idempotent.
alter table public.provider_health
  add column if not exists avg_latency_ms integer,
  add column if not exists latency_samples integer not null default 0;
