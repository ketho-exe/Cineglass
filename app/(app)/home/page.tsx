import { HeroCarousel } from "@/components/media/hero-carousel";
import { MediaRow } from "@/components/media/media-row";
import { getContinueWatching, getUserMediaList } from "@/lib/library/queries";
import { discoverAnime, getTrending } from "@/lib/tmdb/client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [continueWatching, watchlist, movies, tv, anime] = await Promise.all([
    getContinueWatching().catch(() => []),
    getUserMediaList("watchlist_items").catch(() => []),
    getTrending("movie").catch(() => []),
    getTrending("tv").catch(() => []),
    discoverAnime().catch(() => []),
  ]);

  return (
    <>
      <HeroCarousel items={movies} />
      <MediaRow title="Continue Watching" items={continueWatching} />
      <MediaRow title="Watchlist" items={watchlist} />
      <MediaRow title="Trending Movies" items={movies} />
      <MediaRow title="Trending TV" items={tv} />
      <MediaRow title="Anime Picks" items={anime} />
    </>
  );
}
