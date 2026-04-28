import { CategoryRail } from "@/components/media/category-rail";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { discoverFiltered, searchPersonFilmography, searchTmdb } from "@/lib/tmdb/client";
import { getGenres } from "@/lib/tmdb/genres";
import { parseNaturalSearch } from "@/lib/tmdb/natural-language";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: "multi" | "movie" | "tv"; genre?: string; year?: string; minRating?: string; language?: string; mood?: "feel-good" | "dark" | "mind-bending" }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const type = params.type ?? "multi";
  const parsed = query ? parseNaturalSearch(query, type) : null;
  const mediaType = type === "multi" ? parsed?.mediaType : type;
  const genre = numberParam(params.genre) ?? parsed?.genreId;
  const year = numberParam(params.year) ?? parsed?.year;
  const minRating = numberParam(params.minRating) ?? parsed?.minRating;
  const language = params.language || parsed?.language;
  const mood = params.mood || parsed?.mood;
  const hasFilters = Boolean(mediaType || genre || year || minRating || language || mood);
  const data = query && !hasFilters
    ? await searchTmdb(query, type).catch(() => ({ results: [] }))
    : hasFilters
      ? await discoverFiltered({
        mediaType: mediaType ?? "movie",
        genreId: genre,
        year,
        minRating,
        language,
        mood,
      }).catch(() => ({ results: [] }))
      : { results: [] };
  const personMatches = query && !hasFilters ? await searchPersonFilmography(query).catch(() => []) : [];
  const results = [...data.results, ...personMatches].filter((item, index, items) => (
    items.findIndex((other) => other.mediaType === item.mediaType && other.tmdbId === item.tmdbId) === index
  ));
  const genreOptions = getGenres(mediaType ?? "movie");

  return (
    <div>
      <section className="glass rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-bold">Search CineGlass</h1>
        <form className="mt-5 grid gap-3 lg:grid-cols-[1fr_150px_180px_120px_140px_150px_auto]">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search movies, TV shows, anime..."
            className="w-full rounded-full border border-white/10 bg-white/10 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-300"
            />
          </label>
          <select name="type" defaultValue={type} className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="multi">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV</option>
          </select>
          <select name="genre" defaultValue={genre ?? ""} className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="">Any genre</option>
            {genreOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <input name="year" defaultValue={year ?? ""} placeholder="Year" className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />
          <input name="minRating" defaultValue={minRating ?? ""} placeholder="Min rating" className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />
          <select name="language" defaultValue={language ?? ""} className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="">Any language</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
          </select>
          <Button type="submit">Search</Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {[
            ["Feel-good", "feel-good"],
            ["Dark", "dark"],
            ["Mind-bending", "mind-bending"],
          ].map(([label, value]) => (
            <a key={value} href={`/search?type=movie&mood=${value}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200 hover:bg-white/10">{label}</a>
          ))}
        </div>
      </section>
      {query || hasFilters ? (
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((item) => (
            <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} className="w-full sm:w-full" />
          ))}
        </section>
      ) : (
        <>
          <CategoryRail mediaType="movie" />
          <CategoryRail mediaType="tv" />
        </>
      )}
    </div>
  );
}

function numberParam(value: string | undefined) {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}
