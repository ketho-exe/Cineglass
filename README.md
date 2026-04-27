# CineGlass

Private streaming-style front end powered by TMDB metadata, Supabase Auth/Postgres, and EmbedMaster embeds.

## Required Environment Variables

Set these in Vercel project settings and in `.env.local` for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

TMDB_API_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

EMBEDMASTER_BASE_URL=https://embedmaster.link
EMBEDMASTER_PLAYER_ID=k8i9pm5nsn3nrj0d

NEXT_PUBLIC_APP_NAME=CineGlass
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

Optional server-only variable:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code. It is not required for the current app shell.

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor. It creates profiles, media cache, watch progress, watchlists, favourites, ratings, notes, collections, featured rows, manual title overrides, watch sessions, RLS policies, and the trigger that creates a pending profile when a user signs up.

New users land in `/access-pending` until their `profiles.access_status` is changed to `approved`.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```
