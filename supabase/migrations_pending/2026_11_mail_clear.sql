-- Mail → Failed: a "Clear failed" button hides failed sends the admin has
-- dealt with, so the red count stops nagging. Nothing is deleted: the rows
-- stay (with the time they were cleared) for the record. Additive and safe to
-- run twice.
alter table public.email_sends add column if not exists dismissed_at timestamptz;

create index if not exists email_sends_open_failures
  on public.email_sends (created_at desc)
  where status = 'failed' and dismissed_at is null;
