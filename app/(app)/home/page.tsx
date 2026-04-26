import { HeroCarousel } from "@/components/media/hero-carousel";
import { MediaRow } from "@/components/media/media-row";
import { animePicks, fallbackMovies, fallbackTv } from "@/lib/demo-data";
import { getTrending } from "@/lib/tmdb/client";

export default async function HomePage() {
  const [movies, tv] = await Promise.all([
    getTrending("movie").catch(() => fallbackMovies),
    getTrending("tv").catch(() => fallbackTv),
  ]);

  return (
    <>
      <HeroCarousel items={movies.length ? movies : fallbackMovies} />
      <MediaRow title="Continue Watching" items={[...fallbackMovies.slice(0, 1), ...fallbackTv.slice(0, 1)]} />
      <MediaRow title="Trending Movies" items={movies.length ? movies : fallbackMovies} />
      <MediaRow title="Trending TV" items={tv.length ? tv : fallbackTv} />
      <MediaRow title="Anime Picks" items={animePicks} />
    </>
  );
}
