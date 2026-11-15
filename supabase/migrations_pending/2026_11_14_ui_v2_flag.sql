-- =============================================================================
-- New design (ui_v2) for everyone. Additive and safe to run twice.
-- Until this runs there is no ui_v2 row, and the new design shows to admins only
-- (including "view as student"), so the owner can check it first.
-- To turn it OFF for everyone (admins too):
--   update public.feature_flags set status = 'off', enabled = false where key = 'ui_v2';
-- =============================================================================
insert into public.feature_flags (key, status, enabled)
select 'ui_v2', 'unlocked', true
where not exists (select 1 from public.feature_flags where key = 'ui_v2');

update public.feature_flags set status = 'unlocked', enabled = true where key = 'ui_v2';
