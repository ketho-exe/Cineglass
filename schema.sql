-- CineGlass safe additive Supabase schema.
-- This file is designed for Supabase SQL Editor on an existing project.
-- It creates missing objects and adds missing columns without removing data.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'member',
  access_status text not null default 'pending',
  favourite_genres text[] not null default '{}',
  player_provider text not null default 'embedmaster',
  home_preferences jsonb not null default '{
    "continueWatching": true,
    "watchlist": true,
    "recommended": true,
    "trendingMovies": true,
    "trendingTv": true,
    "anime": true,
    "smartCategories": true,
    "playerProvider": "embedmaster"
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text not null default 'member';
alter table public.profiles add column if not exists access_status text not null default 'pending';
alter table public.profiles add column if not exists favourite_genres text[] not null default '{}';
alter table public.profiles add column if not exists player_provider text not null default 'embedmaster';
alter table public.profiles add column if not exists home_preferences jsonb not null default '{
  "continueWatching": true,
  "watchlist": true,
  "recommended": true,
  "trendingMovies": true,
  "trendingTv": true,
  "anime": true,
  "smartCategories": true,
  "playerProvider": "embedmaster"
}'::jsonb;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

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
  media_type text not null,
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
  media_type text not null,
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
  media_type text not null,
  added_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.favourite_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  added_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  rating integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.media_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  note text not null,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  unique (collection_id, tmdb_id, media_type)
);

create table if not exists public.featured_rows (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  row_type text not null default 'manual',
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
  media_type text not null,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  unique (row_id, tmdb_id, media_type)
);

create table if not exists public.manual_title_overrides (
  id uuid primary key default gen_random_uuid(),
  tmdb_id integer not null,
  media_type text not null,
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
  media_type text not null,
  season_number integer,
  episode_number integer,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  device_label text,
  user_agent text
);

create table if not exists public.watch_parties (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  host_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  season_number integer,
  episode_number integer,
  state jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_access_status_idx on public.profiles (access_status);
create index if not exists media_cache_lookup_idx on public.media_cache (media_type, tmdb_id);
create index if not exists watch_progress_user_recent_idx on public.watch_progress (user_id, last_watched_at desc);
create unique index if not exists watch_progress_unique_item_idx on public.watch_progress (user_id, tmdb_id, media_type, season_number, episode_number) nulls not distinct;
create index if not exists collection_items_position_idx on public.collection_items (collection_id, position);
create index if not exists featured_rows_position_idx on public.featured_rows (active, position);
create index if not exists featured_row_items_position_idx on public.featured_row_items (row_id, position);
create index if not exists watch_parties_room_code_idx on public.watch_parties (room_code);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles add constraint profiles_role_check check (role in ('owner', 'admin', 'member')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_access_status_check') then
    alter table public.profiles add constraint profiles_access_status_check check (access_status in ('pending', 'approved', 'blocked')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_player_provider_check') then
    alter table public.profiles add constraint profiles_player_provider_check check (player_provider in ('embedmaster', 'vidking', 'videasy', 'spenembed')) not valid;
  end if;
end;
$$;

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
    select 1 from public.profiles
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

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'profiles_protect_admin_fields') then
    create trigger profiles_protect_admin_fields before update on public.profiles for each row execute function public.protect_profile_admin_fields();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'profiles_set_updated_at') then
    create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'watch_progress_set_updated_at') then
    create trigger watch_progress_set_updated_at before update on public.watch_progress for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'ratings_set_updated_at') then
    create trigger ratings_set_updated_at before update on public.ratings for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'media_notes_set_updated_at') then
    create trigger media_notes_set_updated_at before update on public.media_notes for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'collections_set_updated_at') then
    create trigger collections_set_updated_at before update on public.collections for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'featured_rows_set_updated_at') then
    create trigger featured_rows_set_updated_at before update on public.featured_rows for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'manual_title_overrides_set_updated_at') then
    create trigger manual_title_overrides_set_updated_at before update on public.manual_title_overrides for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'watch_parties_set_updated_at') then
    create trigger watch_parties_set_updated_at before update on public.watch_parties for each row execute function public.set_updated_at();
  end if;
end;
$$;

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
alter table public.watch_parties enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can read own profile') then
    create policy "Users can read own profile" on public.profiles for select using (id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Admins can read profiles') then
    create policy "Admins can read profiles" on public.profiles for select using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert own pending profile') then
    create policy "Users can insert own pending profile" on public.profiles for insert with check (id = auth.uid() and role = 'member');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Admins can update profiles') then
    create policy "Admins can update profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'app_settings' and policyname = 'Approved users can read app settings') then
    create policy "Approved users can read app settings" on public.app_settings for select using (public.current_user_approved());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'app_settings' and policyname = 'Admins can manage app settings') then
    create policy "Admins can manage app settings" on public.app_settings for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'media_cache' and policyname = 'Approved users can read media cache') then
    create policy "Approved users can read media cache" on public.media_cache for select using (public.current_user_approved());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'media_cache' and policyname = 'Admins can manage media cache') then
    create policy "Admins can manage media cache" on public.media_cache for all using (public.is_admin()) with check (public.is_admin());
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'watch_progress' and policyname = 'Users manage own watch progress') then
    create policy "Users manage own watch progress" on public.watch_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'watchlist_items' and policyname = 'Users manage own watchlist') then
    create policy "Users manage own watchlist" on public.watchlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'favourite_items' and policyname = 'Users manage own favourites') then
    create policy "Users manage own favourites" on public.favourite_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ratings' and policyname = 'Users manage own ratings') then
    create policy "Users manage own ratings" on public.ratings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'watch_sessions' and policyname = 'Users manage own watch sessions') then
    create policy "Users manage own watch sessions" on public.watch_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'media_notes' and policyname = 'Users can read visible notes') then
    create policy "Users can read visible notes" on public.media_notes for select using (user_id = auth.uid() or (visibility = 'group' and public.current_user_approved()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'media_notes' and policyname = 'Users manage own notes') then
    create policy "Users manage own notes" on public.media_notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'collections' and policyname = 'Users can read visible collections') then
    create policy "Users can read visible collections" on public.collections for select using (owner_id = auth.uid() or (visibility = 'group' and public.current_user_approved()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'collections' and policyname = 'Users manage own collections') then
    create policy "Users manage own collections" on public.collections for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'collection_items' and policyname = 'Users can read visible collection items') then
    create policy "Users can read visible collection items" on public.collection_items for select using (
      exists (
        select 1 from public.collections c
        where c.id = collection_id
          and (c.owner_id = auth.uid() or (c.visibility = 'group' and public.current_user_approved()))
      )
    );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'collection_items' and policyname = 'Users manage own collection items') then
    create policy "Users manage own collection items" on public.collection_items for all using (
      exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())
    ) with check (
      exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())
    );
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'featured_rows' and policyname = 'Approved users can read active featured rows') then
    create policy "Approved users can read active featured rows" on public.featured_rows for select using (public.current_user_approved() and active = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'featured_rows' and policyname = 'Admins can manage featured rows') then
    create policy "Admins can manage featured rows" on public.featured_rows for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'featured_row_items' and policyname = 'Approved users can read featured row items') then
    create policy "Approved users can read featured row items" on public.featured_row_items for select using (public.current_user_approved());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'featured_row_items' and policyname = 'Admins can manage featured row items') then
    create policy "Admins can manage featured row items" on public.featured_row_items for all using (public.is_admin()) with check (public.is_admin());
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'manual_title_overrides' and policyname = 'Approved users can read manual overrides') then
    create policy "Approved users can read manual overrides" on public.manual_title_overrides for select using (public.current_user_approved());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'manual_title_overrides' and policyname = 'Admins can manage manual overrides') then
    create policy "Admins can manage manual overrides" on public.manual_title_overrides for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'watch_parties' and policyname = 'Approved users can read watch parties') then
    create policy "Approved users can read watch parties" on public.watch_parties for select using (public.current_user_approved());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'watch_parties' and policyname = 'Approved users can create watch parties') then
    create policy "Approved users can create watch parties" on public.watch_parties for insert with check (host_id = auth.uid() and public.current_user_approved());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'watch_parties' and policyname = 'Hosts can update watch parties') then
    create policy "Hosts can update watch parties" on public.watch_parties for update using (host_id = auth.uid()) with check (host_id = auth.uid());
  end if;
end;
$$;

insert into public.app_settings (key, value)
values (
  'global',
  '{
    "player": {
      "provider": "embedmaster",
      "autoplay": true,
      "defaultLanguage": "en",
      "themeColor": "#22d3ee",
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = true,
    file_size_limit = coalesce(storage.buckets.file_size_limit, excluded.file_size_limit),
    allowed_mime_types = coalesce(storage.buckets.allowed_mime_types, excluded.allowed_mime_types);

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can read avatars') then
    create policy "Public can read avatars" on storage.objects for select using (bucket_id = 'avatars');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can upload own avatar') then
    create policy "Users can upload own avatar" on storage.objects for insert with check (
      bucket_id = 'avatars'
      and auth.role() = 'authenticated'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can update own avatar') then
    create policy "Users can update own avatar" on storage.objects for update using (
      bucket_id = 'avatars'
      and auth.role() = 'authenticated'
      and (storage.foldername(name))[1] = auth.uid()::text
    ) with check (
      bucket_id = 'avatars'
      and auth.role() = 'authenticated'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end;
$$;

alter table public.watch_parties replica identity full;
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'watch_parties'
    ) then
      alter publication supabase_realtime add table public.watch_parties;
    end if;
  end if;
end;
$$;
