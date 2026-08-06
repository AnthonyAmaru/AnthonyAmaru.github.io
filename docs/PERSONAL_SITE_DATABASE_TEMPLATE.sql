-- Reusable Supabase schema for the Anthony/Rauny personal-site architecture.
-- Run this in a NEW Supabase project's SQL editor, then create an Auth user and
-- bootstrap that user's UUID into public.site_admins as described at the end.

create extension if not exists pgcrypto;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.music_playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null check (site in ('anthony', 'rauny')),
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null check (site in ('anthony', 'rauny')),
  playlist_id uuid references public.music_playlists(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  file_name text not null,
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  content_hash text,
  file_fingerprint text,
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists music_tracks_user_site_content_hash_uidx
  on public.music_tracks (user_id, site, content_hash)
  where content_hash is not null;
create index if not exists music_tracks_user_site_file_fingerprint_idx
  on public.music_tracks (user_id, site, file_fingerprint)
  where file_fingerprint is not null;
create index if not exists music_tracks_playlist_id_idx
  on public.music_tracks (playlist_id);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null default 'anthony',
  subject text not null check (subject in ('aviation', 'mandarin')),
  mode text,
  section text,
  correct integer not null check (correct >= 0),
  total integer not null check (total > 0),
  percent integer not null check (percent between 0 and 100),
  wrong_answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists test_attempts_user_subject_completed_idx
  on public.test_attempts (user_id, subject, completed_at desc);

create table if not exists public.site_content (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null,
  content_key text not null,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, site, content_key)
);

create table if not exists public.art_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null default 'rauny',
  name text not null,
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists art_items_user_site_created_idx
  on public.art_items (user_id, site, created_at desc);

create table if not exists public.shopping_products (
  id uuid primary key default gen_random_uuid(),
  store_slug text not null check (char_length(store_slug) between 1 and 80),
  external_id text not null check (char_length(external_id) between 1 and 240),
  title text not null check (char_length(title) between 1 and 300),
  description text,
  category text not null default 'other' check (
    category in ('tops', 'bottoms', 'dresses', 'shoes', 'bags', 'accessories', 'outerwear', 'beauty', 'other')
  ),
  brand text,
  image_url text,
  product_url text not null,
  affiliate_url text,
  price numeric check (price is null or price >= 0),
  compare_at_price numeric check (compare_at_price is null or compare_at_price >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  availability text,
  source_updated_at timestamptz,
  feed_metadata jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_slug, external_id)
);

create index if not exists shopping_products_active_store_category_idx
  on public.shopping_products (active, store_slug, category);

alter table public.site_admins enable row level security;
alter table public.music_playlists enable row level security;
alter table public.music_tracks enable row level security;
alter table public.test_attempts enable row level security;
alter table public.site_content enable row level security;
alter table public.art_items enable row level security;
alter table public.shopping_products enable row level security;

-- New Supabase projects require explicit Data API grants. Grants decide which
-- objects a role can reach; the RLS policies below still decide which rows the
-- role may read or change.
grant usage on schema public to anon, authenticated;
grant select on table public.music_playlists, public.music_tracks, public.shopping_products to anon;
grant select on table
  public.site_admins,
  public.music_playlists,
  public.music_tracks,
  public.test_attempts,
  public.site_content,
  public.art_items,
  public.shopping_products
to authenticated;
grant insert, update, delete on table
  public.music_playlists,
  public.music_tracks,
  public.test_attempts,
  public.site_content,
  public.art_items,
  public.shopping_products
to authenticated;

drop policy if exists "Admins can read their membership" on public.site_admins;
create policy "Admins can read their membership"
  on public.site_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Public can read music playlists" on public.music_playlists;
create policy "Public can read music playlists"
  on public.music_playlists for select to anon, authenticated using (true);
drop policy if exists "Admins can add music playlists" on public.music_playlists;
create policy "Admins can add music playlists"
  on public.music_playlists for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can update music playlists" on public.music_playlists;
create policy "Admins can update music playlists"
  on public.music_playlists for update to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can delete music playlists" on public.music_playlists;
create policy "Admins can delete music playlists"
  on public.music_playlists for delete to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Public can read music tracks" on public.music_tracks;
create policy "Public can read music tracks"
  on public.music_tracks for select to anon, authenticated using (true);
drop policy if exists "Admins can add music tracks" on public.music_tracks;
create policy "Admins can add music tracks"
  on public.music_tracks for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can update music tracks" on public.music_tracks;
create policy "Admins can update music tracks"
  on public.music_tracks for update to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can delete music tracks" on public.music_tracks;
create policy "Admins can delete music tracks"
  on public.music_tracks for delete to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Administrators manage their test attempts" on public.test_attempts;
create policy "Administrators manage their test attempts"
  on public.test_attempts for all to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins where user_id = (select auth.uid())))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins where user_id = (select auth.uid())));

drop policy if exists "Administrators manage their site content" on public.site_content;
create policy "Administrators manage their site content"
  on public.site_content for all to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins where user_id = (select auth.uid())))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins where user_id = (select auth.uid())));

drop policy if exists "Administrators manage their artwork" on public.art_items;
create policy "Administrators manage their artwork"
  on public.art_items for all to authenticated
  using (user_id = (select auth.uid()) and exists (select 1 from public.site_admins where user_id = (select auth.uid())))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.site_admins where user_id = (select auth.uid())));

drop policy if exists "Public can read active shopping products" on public.shopping_products;
create policy "Public can read active shopping products"
  on public.shopping_products for select to anon, authenticated using (active);
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

insert into storage.buckets (id, name, public, file_size_limit)
values ('site-music', 'site-music', true, 52428800)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-art', 'site-art', false, 52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site music" on storage.objects;
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

-- Optional private tax organizer. Never make this bucket public. The static
-- repository contains only the locked shell and official public form links;
-- profile values stay in owner-scoped site_content and documents stay here.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tax-documents', 'tax-documents', false, 20971520,
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

-- Bootstrap only from the SQL editor after creating the admin in Authentication:
-- insert into public.site_admins (user_id)
-- values ('REPLACE_WITH_AUTH_USER_UUID')
-- on conflict (user_id) do nothing;
