-- Private bucket for lesson videos. Admin-only RLS: signed upload URLs are
-- minted server-side in `prepareVideoUpload` (after an admin check), and
-- playback goes through the authenticated /api/media/playback proxy — the
-- bucket is never public. This bucket existed on prod only because it was
-- created by hand; this migration gives fresh environments the same shape.
--
-- Idempotent: `on conflict (id) do nothing` leaves a manually-created bucket
-- untouched, and the policy is dropped/recreated so re-runs converge even if
-- a policy with the same name already exists.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'videos',
  'videos',
  false,
  524288000, -- 500MB, generous for a lecture capture
  array['video/mp4','video/quicktime','video/webm','video/x-matroska','video/mp2t','application/vnd.apple.mpegurl','application/x-mpegURL','application/mpegurl','application/octet-stream']
)
on conflict (id) do nothing;

drop policy if exists "videos_bucket_admin_all" on storage.objects;
create policy "videos_bucket_admin_all" on storage.objects
  for all
  using (bucket_id = 'videos' and public.is_admin())
  with check (bucket_id = 'videos' and public.is_admin());
