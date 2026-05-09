import { CategoryRail } from "@/components/media/category-rail";
import { HeroCarousel } from "@/components/media/hero-carousel";
import { MediaRow } from "@/components/media/media-row";
import { getContinueWatching, getRecommendedForUser, getUserMediaList } from "@/lib/library/queries";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";
import { discoverAnime, discoverFiltered, getPopular, getTrending } from "@/lib/tmdb/client";

export const dynamic = "force-dynamic";

const defaultPreferences = {
  continueWatching: true,
  watchlist: true,
  recommended: true,
  trendingMovies: true,
  trendingTv: true,
  anime: true,
  smartCategories: true,
};

export default async function HomePage() {
  const supabase = await createOptionalSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: profile } = user && supabase
    ? await supabase
      .from("profiles")
      .select("home_preferences")
      .eq("id", user.id)
      .maybeSingle()
    : { data: null };
  const preferences = { ...defaultPreferences, ...(profile?.home_preferences as Partial<typeof defaultPreferences> | null) };

  const [continueWatching, watchlist, recommended, popularMovies, movies, tv, anime, topRated, feelGood] = await Promise.all([
    preferences.continueWatching ? getContinueWatching().catch(() => []) : [],
    preferences.watchlist ? getUserMediaList("watchlist_items").catch(() => []) : [],
    preferences.recommended ? getRecommendedForUser().catch(() => []) : [],
    getPopular("movie").catch(() => []),
    preferences.trendingMovies ? getTrending("movie").catch(() => []) : [],
    preferences.trendingTv ? getTrending("tv").catch(() => []) : [],
    preferences.anime ? discoverAnime().catch(() => []) : [],
    preferences.smartCategories ? discoverFiltered({ mediaType: "movie", minRating: 8, sortBy: "vote_average.desc" }).then((data) => data.results).catch(() => []) : [],
    preferences.smartCategories ? discoverFiltered({ mediaType: "movie", mood: "feel-good" }).then((data) => data.results).catch(() => []) : [],
  ]);

  return (
    <>
      <HeroCarousel items={popularMovies.length ? popularMovies : movies} />
      <CategoryRail mediaType="movie" />
      <MediaRow title="Continue Watching" items={continueWatching} viewAllHref="/browse/continue-watching" />
      <MediaRow title="Recommended for You" items={recommended} viewAllHref="/browse/recommended" />
      <MediaRow title="Watchlist" items={watchlist} viewAllHref="/browse/watchlist" />
      <MediaRow title="Trending Movies" items={movies} viewAllHref="/browse/trending-movies" />
      <MediaRow title="Trending TV" items={tv} viewAllHref="/browse/trending-tv" />
      <MediaRow title="Top Rated" items={topRated} viewAllHref="/browse/top-rated" />
      <MediaRow title="Feel-good Picks" items={feelGood} viewAllHref="/browse/feel-good" />
      <MediaRow title="Anime Picks" items={anime} viewAllHref="/browse/anime" />
    </>
  );
}
