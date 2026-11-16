-- Search everything (17 Nov 2026). Optional speed-up, safe to run more than once.
--
-- The search works without this file: it keeps its list in the server's
-- memory (the content lives in code, and the database rows are few). These
-- indexes only matter once the student or lecture lists grow into the
-- thousands, for "name contains" lookups with ILIKE or similarity().
--
-- pg_trgm is already installed on the live project (checked read-only on
-- 17 Nov 2026, in the public schema), so the CREATE EXTENSION line is a no-op there.

create extension if not exists pg_trgm;

create index if not exists profiles_name_trgm_idx on public.profiles using gin (lower(coalesce(name, '')) gin_trgm_ops);
create index if not exists profiles_email_trgm_idx on public.profiles using gin (lower(coalesce(email, '')) gin_trgm_ops);
create index if not exists lessons_title_trgm_idx on public.lessons using gin (lower(coalesce(title, '')) gin_trgm_ops);
create index if not exists materials_title_trgm_idx on public.materials using gin (lower(coalesce(title, '')) gin_trgm_ops);
