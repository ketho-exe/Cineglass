import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { searchTmdb } from "@/lib/tmdb/client";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: "multi" | "movie" | "tv" }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const type = params.type ?? "multi";
  const data = query ? await searchTmdb(query, type).catch(() => ({ results: [] })) : { results: [] };

  return (
    <div>
      <section className="glass rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-bold">Search CineGlass</h1>
        <form className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search movies, TV shows, anime..."
              className="w-full rounded-full border border-white/10 bg-white/10 py-3 pl-12 pr-4 text-white outline-none focus:border-violet-300"
            />
          </label>
          <select name="type" defaultValue={type} className="rounded-full border border-white/10 bg-zinc-900 px-4 py-3 text-white">
            <option value="multi">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV</option>
          </select>
          <Button type="submit">Search</Button>
        </form>
      </section>
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {data.results.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} />
        ))}
      </section>
    </div>
  );
}
