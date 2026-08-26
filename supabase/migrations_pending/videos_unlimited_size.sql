-- Performance/UX pass — remove the admin video upload size cap.
--
-- Kavya asked to remove the maximum size limit when uploading videos as admin.
-- The `videos` Storage bucket had file_size_limit = 524288000 (500MB), which
-- rejected larger source videos at the signed-URL upload step. Setting it to
-- NULL removes the per-file cap (the project's account-level storage quota
-- still applies).
--
-- Additive + idempotent.
update storage.buckets
  set file_size_limit = null
  where name = 'videos';
