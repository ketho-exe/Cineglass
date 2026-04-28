import { CategoryRail } from "@/components/media/category-rail";
import { HeroCarousel } from "@/components/media/hero-carousel";
import { MediaRow } from "@/components/media/media-row";
import { requireUser } from "@/lib/auth/require-user";
import { getContinueWatching, getRecommendedForUser, getUserMediaList } from "@/lib/library/queries";
import { discoverAnime, getTrending } from "@/lib/tmdb/client";

export const dynamic = "force-dynamic";

const defaultPreferences = {
  continueWatching: true,
  watchlist: true,
  recommended: true,
  trendingMovies: true,
  trendingTv: true,
  anime: true,
};

export default async function HomePage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("home_preferences")
    .eq("id", user.id)
    .maybeSingle();
  const preferences = { ...defaultPreferences, ...(profile?.home_preferences as Partial<typeof defaultPreferences> | null) };

  const [continueWatching, watchlist, recommended, movies, tv, anime] = await Promise.all([
    preferences.continueWatching ? getContinueWatching().catch(() => []) : [],
    preferences.watchlist ? getUserMediaList("watchlist_items").catch(() => []) : [],
    preferences.recommended ? getRecommendedForUser().catch(() => []) : [],
    preferences.trendingMovies ? getTrending("movie").catch(() => []) : [],
    preferences.trendingTv ? getTrending("tv").catch(() => []) : [],
    preferences.anime ? discoverAnime().catch(() => []) : [],
  ]);

  return (
    <>
      <HeroCarousel items={recommended.length ? recommended : movies} />
      <CategoryRail mediaType="movie" />
      <MediaRow title="Continue Watching" items={continueWatching} viewAllHref="/browse/continue-watching" />
      <MediaRow title="Recommended for You" items={recommended} viewAllHref="/browse/recommended" />
      <MediaRow title="Watchlist" items={watchlist} viewAllHref="/browse/watchlist" />
      <MediaRow title="Trending Movies" items={movies} viewAllHref="/browse/trending-movies" />
      <MediaRow title="Trending TV" items={tv} viewAllHref="/browse/trending-tv" />
      <MediaRow title="Anime Picks" items={anime} viewAllHref="/browse/anime" />
    </>
  );
}
