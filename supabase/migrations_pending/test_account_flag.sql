-- Add an is_test flag to profiles so test accounts are clearly marked in the
-- admin student list. Idempotent.

alter table profiles add column if not exists is_test boolean not null default false;
