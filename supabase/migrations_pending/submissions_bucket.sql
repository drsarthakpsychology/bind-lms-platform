-- Private bucket for audio assignment submissions. Same pattern as the
-- videos bucket: admin-only RLS, signed URLs minted server-side after an
-- explicit ownership/access check (not left to bucket RLS to sort out).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submissions',
  'submissions',
  false,
  52428800, -- 50MB, generous for an audio assignment response
  array['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/x-m4a']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "submissions_bucket_admin_all" on storage.objects
  for all
  using (bucket_id = 'submissions' and public.is_admin())
  with check (bucket_id = 'submissions' and public.is_admin());
