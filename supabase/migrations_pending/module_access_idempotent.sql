-- grant_cohort idempotency: repeated clicks on Grant inserted duplicate
-- module_access rows. Enforce one grant per (module, scope, student).
-- NULLS NOT DISTINCT so two cohort rows (student_id null) for the same module
-- collide, not slip past the NULL-distinct default. The API route upserts.
-- Idempotent.
create unique index if not exists module_access_grant_unique
  on public.module_access (module_id, scope, student_id) nulls not distinct;
