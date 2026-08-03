alter table public.music_tracks
  add column if not exists content_hash text,
  add column if not exists file_fingerprint text,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists music_tracks_user_site_content_hash_uidx
  on public.music_tracks (user_id, site, content_hash)
  where content_hash is not null;

create index if not exists music_tracks_user_site_file_fingerprint_idx
  on public.music_tracks (user_id, site, file_fingerprint)
  where file_fingerprint is not null;
