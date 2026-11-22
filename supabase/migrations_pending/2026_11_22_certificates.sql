-- 2026_11_22_certificates.sql
-- A certificate can never be issued twice. Additive only: two unique indexes.
-- The website already checks both rules before saving; these make the
-- database refuse a double even if two clicks arrive at the same moment.
--
-- Checked before writing (read only, 22 Nov 2026): 129 records, no person
-- holds two live certificates with the same title, no batch holds a person
-- twice. If either index fails to build, a duplicate exists: revoke one of
-- the pair in Certificates, Issued, then run this again.

-- One person, one live certificate per title and kind. A revoked one does not
-- count, so a correction (old revoked first, then the new one) still works.
create unique index if not exists one_live_certificate
  on public.credentials (user_id, kind, lower(btrim(title)))
  where type = 'certificate' and status = 'issued' and revoked_at is null and title is not null and user_id is not null;

-- The batch id is the form's once-only key: one record per person per batch.
create unique index if not exists one_certificate_per_batch
  on public.credentials (batch_id, user_id)
  where batch_id is not null and user_id is not null;
