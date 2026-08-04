create index if not exists music_tracks_playlist_id_idx
  on public.music_tracks (playlist_id);

drop policy if exists "Public can read site music" on storage.objects;

drop policy if exists "Admins can read their membership" on public.site_admins;
create policy "Admins can read their membership"
  on public.site_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Admins can add music playlists" on public.music_playlists;
create policy "Admins can add music playlists"
  on public.music_playlists for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "Admins can update music playlists" on public.music_playlists;
create policy "Admins can update music playlists"
  on public.music_playlists for update to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "Admins can delete music playlists" on public.music_playlists;
create policy "Admins can delete music playlists"
  on public.music_playlists for delete to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );

drop policy if exists "Admins can add music tracks" on public.music_tracks;
create policy "Admins can add music tracks"
  on public.music_tracks for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "Admins can update music tracks" on public.music_tracks;
create policy "Admins can update music tracks"
  on public.music_tracks for update to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "Admins can delete music tracks" on public.music_tracks;
create policy "Admins can delete music tracks"
  on public.music_tracks for delete to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );

drop policy if exists "Administrators manage their test attempts" on public.test_attempts;
create policy "Administrators manage their test attempts"
  on public.test_attempts for all to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Administrators manage their site content" on public.site_content;
create policy "Administrators manage their site content"
  on public.site_content for all to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Administrators manage their artwork" on public.art_items;
create policy "Administrators manage their artwork"
  on public.art_items for all to authenticated
  using (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Administrators can add shopping products" on public.shopping_products;
create policy "Administrators can add shopping products"
  on public.shopping_products for insert to authenticated
  with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
drop policy if exists "Administrators can update shopping products" on public.shopping_products;
create policy "Administrators can update shopping products"
  on public.shopping_products for update to authenticated
  using (exists (select 1 from public.site_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
drop policy if exists "Administrators can delete shopping products" on public.shopping_products;
create policy "Administrators can delete shopping products"
  on public.shopping_products for delete to authenticated
  using (exists (select 1 from public.site_admins where user_id = (select auth.uid())));

drop policy if exists "Admins can upload site music" on storage.objects;
create policy "Admins can upload site music"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-music'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "Admins can update site music" on storage.objects;
create policy "Admins can update site music"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'site-music'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'site-music'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "Admins can delete site music" on storage.objects;
create policy "Admins can delete site music"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-music'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
  );

drop policy if exists "Administrators read their artwork files" on storage.objects;
create policy "Administrators read their artwork files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'site-art'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );
drop policy if exists "Administrators upload their artwork files" on storage.objects;
create policy "Administrators upload their artwork files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-art'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );
drop policy if exists "Administrators delete their artwork files" on storage.objects;
create policy "Administrators delete their artwork files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-art'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );
