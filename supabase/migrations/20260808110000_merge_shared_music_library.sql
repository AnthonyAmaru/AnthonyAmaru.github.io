begin;

alter table public.music_playlists
  drop constraint music_playlists_site_check;
alter table public.music_playlists
  add constraint music_playlists_site_check
  check (site = any (array['anthony'::text, 'rauny'::text, 'shared'::text]));

alter table public.music_tracks
  drop constraint music_tracks_site_check;
alter table public.music_tracks
  add constraint music_tracks_site_check
  check (site = any (array['anthony'::text, 'rauny'::text, 'shared'::text]));

do $$
declare
  owner_count integer;
begin
  select count(distinct user_id)
    into owner_count
  from public.music_tracks
  where site in ('anthony', 'rauny');

  if owner_count > 1 then
    raise exception 'Shared music migration expected one owner, found %', owner_count;
  end if;

  if exists (
    select 1
    from public.music_tracks
    where site in ('anthony', 'rauny')
      and content_hash is not null
    group by user_id, content_hash
    having count(*) > 1
  ) then
    raise exception 'Shared music migration found duplicate content hashes across site libraries';
  end if;

  if exists (
    select 1
    from public.music_playlists
    where site in ('anthony', 'rauny')
    group by user_id, name
    having count(*) > 1
  ) then
    raise exception 'Shared music migration found duplicate playlist names across site libraries';
  end if;
end
$$;

update public.music_playlists
set site = 'shared'
where site in ('anthony', 'rauny');

update public.music_tracks
set site = 'shared'
where site in ('anthony', 'rauny');

commit;
