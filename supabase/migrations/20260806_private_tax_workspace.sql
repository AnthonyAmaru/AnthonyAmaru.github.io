insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tax-documents',
  'tax-documents',
  false,
  20971520,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administrators read their tax documents" on storage.objects;
create policy "Administrators read their tax documents"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'tax-documents'
    and (storage.foldername(name))[1] = 'anthony'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Administrators upload their tax documents" on storage.objects;
create policy "Administrators upload their tax documents"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'tax-documents'
    and (storage.foldername(name))[1] = 'anthony'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Administrators replace their tax documents" on storage.objects;
create policy "Administrators replace their tax documents"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'tax-documents'
    and (storage.foldername(name))[1] = 'anthony'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'tax-documents'
    and (storage.foldername(name))[1] = 'anthony'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Administrators delete their tax documents" on storage.objects;
create policy "Administrators delete their tax documents"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'tax-documents'
    and (storage.foldername(name))[1] = 'anthony'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );
