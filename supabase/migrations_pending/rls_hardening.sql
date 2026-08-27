-- RLS hardening sweep (Round-16 architecture audit).
--
-- 1. media_assets: the SELECT policy was `to anon, authenticated` with qual
--    true — a signed-out visitor could list every video's storage key. Video
--    playback always runs through an authenticated session (the stream proxy
--    requires a session + token), so anon never needs this. Scope to
--    authenticated.
-- 2. wall_posts/wall_replies/wall_reactions: the SELECT policies were
--    `to public`, leaking author_id to signed-out visitors on the wall.
--    INSERT/DELETE already fail closed for anon (auth.uid() is null), so only
--    the SELECT policies need scoping to authenticated.
-- 3. profiles: the UPDATE policy has USING (own-or-admin) but NO with_check —
--    a student can UPDATE their own row to role='admin' at the RLS layer
--    (the protect_profile_columns trigger is the only thing stopping it, and
--    RLS should not depend solely on a trigger). Add a with_check that keeps
--    non-admins from writing an admin role onto any row.
--
-- Idempotent.
drop policy if exists "media_assets_authenticated_read" on public.media_assets;
create policy "media_assets_authenticated_read" on public.media_assets
  for select to authenticated using (true);

drop policy if exists "wall_posts_select_visible" on public.wall_posts;
create policy "wall_posts_select_visible" on public.wall_posts
  for select to authenticated using (public.is_admin() or (is_anonymous = false));

drop policy if exists "wall_replies_select_visible" on public.wall_replies;
create policy "wall_replies_select_visible" on public.wall_replies
  for select to authenticated using (public.is_admin() or (is_anonymous = false));

drop policy if exists "wall_reactions_select_visible" on public.wall_reactions;
create policy "wall_reactions_select_visible" on public.wall_reactions
  for select to authenticated using (true);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (public.is_admin() or (auth.uid() = id and role <> 'admin'));
