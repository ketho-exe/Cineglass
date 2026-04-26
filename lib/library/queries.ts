import { requireUser } from "@/lib/auth/require-user";
import { compactMedia, normaliseLibraryRows } from "@/lib/library/items";
import { getDetails } from "@/lib/tmdb/client";
import type { MediaType } from "@/types/media";

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
    .select("media_type, tmdb_id")
    .eq("user_id", user.id)
    .eq("completed", false)
    .order("last_watched_at", { ascending: false })
    .limit(12);

  return resolveMediaRefs(normaliseLibraryRows(data ?? []));
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

async function resolveMediaRefs(items: Array<{ mediaType: MediaType; tmdbId: number }>) {
  const media = await Promise.all(
    items.map((item) => getDetails(item.mediaType, item.tmdbId).catch(() => null)),
  );
  return compactMedia(media);
}
