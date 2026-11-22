-- Speed for the question bank (r2speed, 22 Nov 2026).
-- Additive only: new indexes, nothing dropped or changed. Safe to run more than once.
-- The code works the same before and after this runs; it only makes reads faster.
-- Row rules (RLS) on these tables are unchanged (already on).

-- "Pick up where you left off" before prep_answers existed reads a student's
-- most recently seen question: prep_seen by user, newest first.
create index if not exists prep_seen_user_last_idx on public.prep_seen (user_id, last_at desc);

-- Spaced-review cards for the bank are read by user and an item prefix ('prep:%').
-- text_pattern_ops lets the prefix match use the index whatever the database collation.
create index if not exists review_cards_user_item_pattern_idx on public.review_cards (user_id, item text_pattern_ops);

-- Prep skills are read by user and a skill prefix ('prep-%').
create index if not exists skill_state_user_skill_pattern_idx on public.skill_state (user_id, skill text_pattern_ops);
