-- =============================================================================
-- Harden SECURITY DEFINER functions (security audit 2026-08-14)
--
-- RLS is enabled on every public table with a consistent policy set (verified
-- via pg_class.relrowsecurity + pg_policies). The remaining advisor findings are
-- the 12 SECURITY DEFINER functions that carry the default PUBLIC EXECUTE grant
-- (`=X/postgres` in proacl), so `anon` — and, for the trigger functions,
-- `authenticated` — can invoke them via PostgREST `/rpc/<name>`.
--
-- Key Postgres fact: `REVOKE ... FROM anon/authenticated` does NOT override a
-- privilege inherited from PUBLIC; the PUBLIC grant (`=X`) must be revoked
-- directly. Explicit grants (`authenticated=X`, `service_role=X`, owner) remain
-- untouched, so:
--   * app_role() / publish_medication_document() keep their explicit
--     `authenticated=X` (server-side RPC + read-only self-referential helpers).
--   * the 9 trigger functions drop to owner+service_role only (they fire as the
--     table owner; PostgREST can't meaningfully call a trigger fn anyway).
--
-- Additive + reversible (`GRANT EXECUTE ... TO PUBLIC` to revert). Trigger
-- functions all run SECURITY DEFINER + `SET search_path TO 'public'`, and fire
-- as the table owner, so revoking direct EXECUTE does NOT affect signup
-- (handle_new_user) or the touch/demote/publish triggers.
-- =============================================================================

-- anon never executes a SECURITY DEFINER function; authenticated never executes
-- a trigger function directly. Revoking PUBLIC removes both at once.
revoke execute on function public.app_role() from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.is_admin() from public;
revoke execute on function public.med_docs_block_editor_publish() from public;
revoke execute on function public.medication_documents_demote() from public;
revoke execute on function public.medication_documents_touch() from public;
revoke execute on function public.psych_demote_on_published_edit() from public;
revoke execute on function public.publish_medication_document(uuid, text) from public;
revoke execute on function public.touch_assignment() from public;
revoke execute on function public.touch_material() from public;
revoke execute on function public.touch_media_asset() from public;
revoke execute on function public.update_practice_chains_updated_at() from public;
