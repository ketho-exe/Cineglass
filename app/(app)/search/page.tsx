import { CategoryRail } from "@/components/media/category-rail";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { discoverFiltered, searchPersonFilmography, searchTmdb } from "@/lib/tmdb/client";
import { getGenres } from "@/lib/tmdb/genres";
import { parseNaturalSearch } from "@/lib/tmdb/natural-language";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
  const suggestions = ["90s action", "Feel-good anime", "Korean thrillers", "Mind-bending movies", "High-rated sci-fi", "Comfort shows", "Dark drama", "Family animation"];
  const activeFilters = [
    query ? ["Query", query] : null,
    mediaType ? ["Type", mediaType === "tv" ? "TV" : "Movie"] : null,
    genre ? ["Genre", genreOptions.find((item) => item.id === genre)?.name ?? String(genre)] : null,
    year ? ["Year", String(year)] : null,
    minRating ? ["Rating", `${minRating}+`] : null,
    language ? ["Language", language.toUpperCase()] : null,
    mood ? ["Mood", mood] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/36 p-5 shadow-glow sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.16),transparent_24rem),radial-gradient(circle_at_84%_8%,rgba(139,92,246,0.14),transparent_24rem)]" />
        <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Discovery</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Search CineGlass</h1>
        <form className="mt-6 grid gap-4">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search movies, TV shows, anime..."
              aria-label="Search movies, TV shows, anime"
              className="w-full rounded-full border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200"
            />
          </label>
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <SlidersHorizontal className="h-4 w-4 text-cyan-200" />
              Filters
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[140px_1fr_120px_140px_150px_auto]">
          <select name="type" defaultValue={type} aria-label="Media type" className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="multi">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV</option>
          </select>
          <select name="genre" defaultValue={genre ?? ""} aria-label="Genre" className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="">Any genre</option>
            {genreOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <input name="year" defaultValue={year ?? ""} placeholder="Year" aria-label="Year" className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-200" />
          <input name="minRating" defaultValue={minRating ?? ""} placeholder="Min rating" aria-label="Minimum rating" className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-200" />
          <select name="language" defaultValue={language ?? ""} aria-label="Language" className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="">Any language</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
          </select>
          <Button type="submit">Search</Button>
            </div>
          </div>
        </form>
        {activeFilters.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {activeFilters.map(([label, value]) => (
              <span key={`${label}-${value}`} className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1.5 text-cyan-50">
                <span className="text-slate-400">{label}</span> {value}
              </span>
            ))}
            <a href="/search" className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-slate-200 hover:bg-white/10">
              <X className="h-3.5 w-3.5" />
              Clear all
            </a>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {[
            ["Feel-good", "feel-good"],
            ["Dark", "dark"],
            ["Mind-bending", "mind-bending"],
          ].map(([label, value]) => (
            <a key={value} href={`/search?type=movie&mood=${value}`} className={`rounded-full border px-3 py-1.5 text-slate-200 hover:bg-white/10 ${mood === value ? "border-cyan-200/50 bg-cyan-200/12" : "border-white/10 bg-white/5"}`}>{label}</a>
          ))}
        </div>
        </div>
      </section>
      {query || hasFilters ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{results.length} result{results.length === 1 ? "" : "s"}</h2>
          </div>
          {results.length ? (
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((item) => (
                <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} className="w-full sm:w-full" />
              ))}
            </section>
          ) : (
            <EmptyState title="No matches found" description="Try a broader title, remove a filter, or use one of the suggested searches." />
          )}
        </>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold">Suggested searches</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <a key={suggestion} href={`/search?q=${encodeURIComponent(suggestion)}`} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-200/40 hover:bg-cyan-200/10">
                  {suggestion}
                </a>
              ))}
            </div>
          </section>
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
