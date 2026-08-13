-- =============================================================================
-- Make sim scoring idempotent under concurrency (2026-08-14)
--
-- Two concurrent debrief POSTs could both pass the "already scored?" read,
-- double-spend the AI call, insert duplicate sim_scores rows, and double-credit
-- the Skills Passport (competency_events). Unique indexes + upsert close it.
-- Additive + reversible (drop the indexes to revert).
-- =============================================================================
create unique index if not exists sim_scores_session_id_key
  on public.sim_scores (session_id);

-- Deduplicate double-credit artifacts that already landed (keep one row per
-- tuple), then index. Applied: 21 duplicate rows removed.
delete from public.competency_events a
using public.competency_events b
where a.ctid < b.ctid
  and a.user_id = b.user_id
  and a.source = b.source
  and a.source_ref = b.source_ref;

create unique index if not exists competency_events_user_source_ref_key
  on public.competency_events (user_id, source, source_ref);
