-- Lecture-only access scope for the roster cohort.
--
-- `profiles.scope` marks how much of the platform an account can reach:
--   'full'          (default) — a normal student; every student surface.
--   'lectures_only' — only the lecture list + the player for lectures on it.
--                     Everything else (courses grid, practice, journal, wall,
--                     tools) is locked server-side in the route guard.
--
-- The role stays 'student' (so every existing "is a student" check keeps
-- working); `scope` is an orthogonal restriction layered on top of role.
--
-- Additive + idempotent.
alter table public.profiles
  add column if not exists scope text not null default 'full'
  check (scope in ('full', 'lectures_only'));
