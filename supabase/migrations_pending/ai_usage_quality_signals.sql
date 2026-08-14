-- T170: persist per-session conversation-quality signals so bad
-- conversations are findable, not just prevented. Additive only.
alter table ai_usage_log
  add column if not exists used_fallback boolean,
  add column if not exists regenerated int;
