-- infra_metrics() was only revoked from anon/authenticated — PUBLIC still has
-- EXECUTE by default, so any signed-out visitor could call the RPC. Revoke from
-- PUBLIC too (service_role keeps it). Idempotent.
revoke all on function public.infra_metrics() from public;
