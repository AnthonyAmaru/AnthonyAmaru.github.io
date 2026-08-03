create extension if not exists pgcrypto;

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

alter table public.test_attempts enable row level security;
drop policy if exists "Administrators manage their test attempts" on public.test_attempts;
create policy "Administrators manage their test attempts"
  on public.test_attempts for all to authenticated
  using (
    user_id = auth.uid()
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  )
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  );

create table if not exists public.site_content (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null,
  content_key text not null,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, site, content_key)
);

alter table public.site_content enable row level security;
drop policy if exists "Administrators manage their site content" on public.site_content;
create policy "Administrators manage their site content"
  on public.site_content for all to authenticated
  using (
    user_id = auth.uid()
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  )
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.site_admins where user_id = auth.uid())
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

alter table public.art_items enable row level security;
drop policy if exists "Administrators manage their artwork" on public.art_items;
create policy "Administrators manage their artwork"
  on public.art_items for all to authenticated
  using (
    user_id = auth.uid()
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  )
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-art',
  'site-art',
  false,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administrators read their artwork files" on storage.objects;
create policy "Administrators read their artwork files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'site-art'
    and (storage.foldername(name))[2] = auth.uid()::text
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  );

drop policy if exists "Administrators upload their artwork files" on storage.objects;
create policy "Administrators upload their artwork files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-art'
    and (storage.foldername(name))[2] = auth.uid()::text
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  );

drop policy if exists "Administrators delete their artwork files" on storage.objects;
create policy "Administrators delete their artwork files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-art'
    and (storage.foldername(name))[2] = auth.uid()::text
    and exists (select 1 from public.site_admins where user_id = auth.uid())
  );
