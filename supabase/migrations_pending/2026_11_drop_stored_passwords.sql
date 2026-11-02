-- =============================================================================
-- Run ONLY after the platform rebuild is merged and live on production.
-- SECURITY: destroys every stored plain-text password. Students keep signing
-- in with the password they already have; it just isn't readable anywhere.
-- (The old code read this column, so dropping it earlier would break it.)
-- =============================================================================
alter table public.credential_invites drop column if exists password;
