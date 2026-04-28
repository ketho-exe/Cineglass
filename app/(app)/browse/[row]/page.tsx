import { MediaCard } from "@/components/media/media-card";
import { getContinueWatching, getRecommendedForUser, getUserMediaList } from "@/lib/library/queries";
import { discoverAnime, getPopular, getTrending } from "@/lib/tmdb/client";
import type { NormalisedMedia } from "@/types/media";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const rowTitles: Record<string, string> = {
  "continue-watching": "Continue Watching",
  recommended: "Recommended for You",
  watchlist: "Watchlist",
  "trending-movies": "Trending Movies",
  "trending-tv": "Trending TV",
  anime: "Anime Picks",
};

export default async function BrowseRowPage({
  params,
}: {
  params: Promise<{ row: string }>;
}) {
  const { row } = await params;
  const title = rowTitles[row];
  if (!title) notFound();

  const items = await getRowItems(row);

  return (
    <section>
      <div className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Browse</p>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-300">A fuller shelf of titles from this home section.</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} href={item.watchHref} className="w-full sm:w-full" progressPercent={item.progressPercent} />
        ))}
      </div>
    </section>
  );
}

async function getRowItems(row: string): Promise<Array<NormalisedMedia & { watchHref?: string; progressPercent?: number }>> {
  if (row === "continue-watching") return getContinueWatching().catch(() => []);
  if (row === "recommended") return getRecommendedForUser().catch(() => []);
  if (row === "watchlist") return getUserMediaList("watchlist_items").catch(() => []);
  if (row === "trending-movies") return getPopular("movie").catch(() => getTrending("movie").catch(() => []));
  if (row === "trending-tv") return getPopular("tv").catch(() => getTrending("tv").catch(() => []));
  if (row === "anime") return discoverAnime().catch(() => []);
  return [];
}
