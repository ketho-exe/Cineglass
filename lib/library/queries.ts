import { requireUser } from "@/lib/auth/require-user";
import { compactMedia, normaliseLibraryRows } from "@/lib/library/items";
import { getDetails } from "@/lib/tmdb/client";
import type { MediaType, NormalisedMedia } from "@/types/media";

export async function getLibraryStatus(mediaType: MediaType, tmdbId: number) {
  const { supabase, user } = await requireUser();
  const [watchlist, favourite] = await Promise.all([
    supabase
      .from("watchlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("media_type", mediaType)
      .eq("tmdb_id", tmdbId)
      .maybeSingle(),
    supabase
      .from("favourite_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("media_type", mediaType)
      .eq("tmdb_id", tmdbId)
      .maybeSingle(),
  ]);

  return {
    inWatchlist: Boolean(watchlist.data),
    isFavourite: Boolean(favourite.data),
  };
}

export async function getUserMediaList(table: "watchlist_items" | "favourite_items") {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from(table)
    .select("media_type, tmdb_id")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  return resolveMediaRefs(normaliseLibraryRows(data ?? []));
}

export async function getContinueWatching() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("watch_progress")
    .select("media_type, tmdb_id, season_number, episode_number, progress_percent")
    .eq("user_id", user.id)
    .eq("completed", false)
    .gt("progress_seconds", 0)
    .order("last_watched_at", { ascending: false })
    .limit(12);

  const refs = normaliseLibraryRows(data ?? []);
  const media = await resolveMediaRefs(refs);
  const progressByKey = new Map(
    (data ?? []).map((row) => [
      `${row.media_type}:${row.tmdb_id}`,
      {
        progressPercent: typeof row.progress_percent === "number" ? row.progress_percent : Number(row.progress_percent ?? 0),
        watchHref: row.media_type === "tv"
          ? `/watch/tv/${row.tmdb_id}/season/${row.season_number ?? 1}/episode/${row.episode_number ?? 1}`
          : `/watch/movie/${row.tmdb_id}`,
      },
    ]),
  );

  return media.map((item) => ({ ...item, ...progressByKey.get(`${item.mediaType}:${item.tmdbId}`) }));
}

export async function getWatchedHistory() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("watch_progress")
    .select("media_type, tmdb_id")
    .eq("user_id", user.id)
    .order("last_watched_at", { ascending: false })
    .limit(36);

  return resolveMediaRefs(normaliseLibraryRows(data ?? []));
}

async function resolveMediaRefs(items: Array<{ mediaType: MediaType; tmdbId: number }>): Promise<NormalisedMedia[]> {
  const media = await Promise.all(
    items.map((item) => getDetails(item.mediaType, item.tmdbId).catch(() => null)),
  );
  return compactMedia(media);
}
