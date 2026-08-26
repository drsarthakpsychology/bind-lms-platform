-- credential_invites.password — the student's 8-char login password.
--
-- 2026-08-26 (per Kavya): invites now share a plain password instead of a
-- password-recovery link (the Supabase Auth redirect allowlist rejected our
-- redirect target, so every link fell back to redirect_to=localhost). The
-- password is set on the auth user (hashed) and stored here in plaintext so
-- the /admin/roster list can show Kavya the whole batch to share individually.
--
-- The table is admin-only RLS, so only an admin can read these. This is the
-- explicit product design; the auth_user password itself is always hashed.
--
-- Additive + idempotent.
alter table public.credential_invites
  add column if not exists password text;
