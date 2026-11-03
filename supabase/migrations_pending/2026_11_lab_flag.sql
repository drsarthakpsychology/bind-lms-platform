-- =============================================================================
-- Psychology Lab switch. Additive, idempotent, no table changes.
-- Lab progress lives inside the existing learn_progress.state JSON (key "lab"),
-- so no new table or policy is needed.
-- The Lab starts HIDDEN for students (admins can always preview it).
-- Switch it on in Admin -> What's live after educator review.
-- =============================================================================
insert into public.feature_flags (key, status, enabled)
select 'lab', 'off', false
where not exists (select 1 from public.feature_flags where key = 'lab');
