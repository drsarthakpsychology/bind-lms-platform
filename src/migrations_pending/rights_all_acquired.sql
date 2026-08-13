-- =============================================================================
-- Casebook — mark all rights acquired (2026-08-14)
--
-- Kavya confirmed every corpus title's rights and author consent are in hand,
-- so the acquisition tracker no longer needs manual per-title status flips.
-- Flip every not-yet-ingestible title to 'licensed' + record author consent,
-- so the ingester picks them up on its next pass. public_domain / open_access
-- are already free and left as-is. Additive + reversible (re-set rights_status
-- per title to revert).
-- =============================================================================
update public.rights_registry
set rights_status = case
      when rights_status in ('public_domain', 'open_access') then rights_status
      else 'licensed'
    end,
    author_consent = true,
    updated_at = now();
