create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  access_status text not null default 'pending' check (access_status in ('pending', 'approved', 'blocked')),
  favourite_genres text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_cache (
  id uuid primary key default gen_random_uuid(),
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  original_title text,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date date,
  first_air_date date,
  vote_average numeric,
  genres jsonb not null default '[]'::jsonb,
  raw_tmdb jsonb not null default '{}'::jsonb,
  cached_at timestamptz not null default now(),
  unique (tmdb_id, media_type)
);

create table if not exists public.watch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  season_number integer,
  episode_number integer,
  progress_seconds integer not null default 0,
  duration_seconds integer,
  progress_percent numeric not null default 0,
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  added_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.favourite_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  added_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  rating integer not null check (rating between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.media_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  note text not null,
  visibility text not null default 'private' check (visibility in ('private', 'group')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  visibility text not null default 'private' check (visibility in ('private', 'group')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  position integer not null default 0,
  added_at timestamptz not null default now(),
  unique (collection_id, tmdb_id, media_type)
);

create table if not exists public.featured_rows (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  row_type text not null default 'manual' check (row_type in ('manual', 'tmdb_trending', 'tmdb_popular', 'tmdb_anime')),
  position integer not null default 0,
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.featured_row_items (
  id uuid primary key default gen_random_uuid(),
  row_id uuid not null references public.featured_rows(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  position integer not null default 0,
  added_at timestamptz not null default now(),
  unique (row_id, tmdb_id, media_type)
);

create table if not exists public.manual_title_overrides (
  id uuid primary key default gen_random_uuid(),
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title_override text,
  poster_url_override text,
  backdrop_url_override text,
  player_override jsonb not null default '{}'::jsonb,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tmdb_id, media_type)
);

create table if not exists public.watch_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  season_number integer,
  episode_number integer,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  device_label text,
  user_agent text
);

create index if not exists media_cache_lookup_idx on public.media_cache (media_type, tmdb_id);
create index if not exists watch_progress_user_recent_idx on public.watch_progress (user_id, last_watched_at desc);
alter table public.watch_progress
  drop constraint if exists watch_progress_user_id_tmdb_id_media_type_season_number_episode_number_key;
create unique index if not exists watch_progress_unique_item_idx
  on public.watch_progress (user_id, tmdb_id, media_type, season_number, episode_number) nulls not distinct;
create index if not exists collection_items_position_idx on public.collection_items (collection_id, position);
create index if not exists featured_rows_position_idx on public.featured_rows (active, position);
create index if not exists featured_row_items_position_idx on public.featured_row_items (row_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_approved()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and access_status = 'approved'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('owner', 'admin'), false);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, access_status, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'pending',
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.protect_profile_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id
    and coalesce(public.current_user_role(), 'member') not in ('owner', 'admin')
    and (new.role is distinct from old.role or new.access_status is distinct from old.access_status)
  then
    raise exception 'Only admins can change role or access status';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists profiles_protect_admin_fields on public.profiles;
drop trigger if exists profiles_set_updated_at on public.profiles;
drop trigger if exists watch_progress_set_updated_at on public.watch_progress;
drop trigger if exists ratings_set_updated_at on public.ratings;
drop trigger if exists media_notes_set_updated_at on public.media_notes;
drop trigger if exists collections_set_updated_at on public.collections;
drop trigger if exists featured_rows_set_updated_at on public.featured_rows;
drop trigger if exists manual_title_overrides_set_updated_at on public.manual_title_overrides;
create trigger profiles_protect_admin_fields before update on public.profiles for each row execute function public.protect_profile_admin_fields();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger watch_progress_set_updated_at before update on public.watch_progress for each row execute function public.set_updated_at();
create trigger ratings_set_updated_at before update on public.ratings for each row execute function public.set_updated_at();
create trigger media_notes_set_updated_at before update on public.media_notes for each row execute function public.set_updated_at();
create trigger collections_set_updated_at before update on public.collections for each row execute function public.set_updated_at();
create trigger featured_rows_set_updated_at before update on public.featured_rows for each row execute function public.set_updated_at();
create trigger manual_title_overrides_set_updated_at before update on public.manual_title_overrides for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.media_cache enable row level security;
alter table public.watch_progress enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.favourite_items enable row level security;
alter table public.ratings enable row level security;
alter table public.media_notes enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.featured_rows enable row level security;
alter table public.featured_row_items enable row level security;
alter table public.manual_title_overrides enable row level security;
alter table public.watch_sessions enable row level security;

drop policy if exists "Profiles are visible to approved users" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read profiles" on public.profiles;
drop policy if exists "Users can insert own pending profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Approved users can read app settings" on public.app_settings;
drop policy if exists "Admins can manage app settings" on public.app_settings;
drop policy if exists "Approved users can read media cache" on public.media_cache;
drop policy if exists "Admins can manage media cache" on public.media_cache;
drop policy if exists "Users manage own watch progress" on public.watch_progress;
drop policy if exists "Users manage own watchlist" on public.watchlist_items;
drop policy if exists "Users manage own favourites" on public.favourite_items;
drop policy if exists "Users manage own ratings" on public.ratings;
drop policy if exists "Users manage own watch sessions" on public.watch_sessions;
drop policy if exists "Users can read visible notes" on public.media_notes;
drop policy if exists "Users manage own notes" on public.media_notes;
drop policy if exists "Users can read visible collections" on public.collections;
drop policy if exists "Users manage own collections" on public.collections;
drop policy if exists "Users can read visible collection items" on public.collection_items;
drop policy if exists "Users manage own collection items" on public.collection_items;
drop policy if exists "Approved users can read active featured rows" on public.featured_rows;
drop policy if exists "Admins can manage featured rows" on public.featured_rows;
drop policy if exists "Approved users can read featured row items" on public.featured_row_items;
drop policy if exists "Admins can manage featured row items" on public.featured_row_items;
drop policy if exists "Approved users can read manual overrides" on public.manual_title_overrides;
drop policy if exists "Admins can manage manual overrides" on public.manual_title_overrides;

create policy "Users can read own profile" on public.profiles for select using (id = auth.uid());
create policy "Admins can read profiles" on public.profiles for select using (public.is_admin());
create policy "Users can insert own pending profile" on public.profiles for insert with check (id = auth.uid() and role = 'member');
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Admins can update profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

create policy "Approved users can read app settings" on public.app_settings for select using (public.current_user_approved());
create policy "Admins can manage app settings" on public.app_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "Approved users can read media cache" on public.media_cache for select using (public.current_user_approved());
create policy "Admins can manage media cache" on public.media_cache for all using (public.is_admin()) with check (public.is_admin());

create policy "Users manage own watch progress" on public.watch_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own watchlist" on public.watchlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own favourites" on public.favourite_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own ratings" on public.ratings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own watch sessions" on public.watch_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Users can read visible notes" on public.media_notes for select using (user_id = auth.uid() or (visibility = 'group' and public.current_user_approved()));
create policy "Users manage own notes" on public.media_notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Users can read visible collections" on public.collections for select using (owner_id = auth.uid() or (visibility = 'group' and public.current_user_approved()));
create policy "Users manage own collections" on public.collections for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Users can read visible collection items" on public.collection_items for select using (
  exists (
    select 1 from public.collections c
    where c.id = collection_id
      and (c.owner_id = auth.uid() or (c.visibility = 'group' and public.current_user_approved()))
  )
);
create policy "Users manage own collection items" on public.collection_items for all using (
  exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())
) with check (
  exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())
);

create policy "Approved users can read active featured rows" on public.featured_rows for select using (public.current_user_approved() and active = true);
create policy "Admins can manage featured rows" on public.featured_rows for all using (public.is_admin()) with check (public.is_admin());
create policy "Approved users can read featured row items" on public.featured_row_items for select using (public.current_user_approved());
create policy "Admins can manage featured row items" on public.featured_row_items for all using (public.is_admin()) with check (public.is_admin());

create policy "Approved users can read manual overrides" on public.manual_title_overrides for select using (public.current_user_approved());
create policy "Admins can manage manual overrides" on public.manual_title_overrides for all using (public.is_admin()) with check (public.is_admin());

insert into public.app_settings (key, value)
values (
  'global',
  '{
    "player": {
      "provider": "embedmaster",
      "autoplay": true,
      "defaultLanguage": "en",
      "themeColor": "#A78BFA",
      "allowFullscreen": true,
      "enableProgressSyncing": true
    },
    "home": {
      "showTrending": true,
      "showAnime": true,
      "showContinueWatching": true
    }
  }'::jsonb
)
on conflict (key) do nothing;
