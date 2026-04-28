import { getGenres } from "@/lib/tmdb/genres";
import type { MediaType } from "@/types/media";
import Link from "next/link";

export function CategoryRail({ mediaType = "movie" }: { mediaType?: MediaType }) {
  const genres = getGenres(mediaType).slice(0, 10);
  return (
    <section className="glass mt-8 rounded-3xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Browse by category</p>
          <h2 className="mt-1 text-xl font-semibold">{mediaType === "movie" ? "Movie" : "TV"} genres</h2>
        </div>
        <Link href={`/genre/${mediaType}/${genres[0]?.id ?? 28}`} className="text-sm text-slate-300 transition hover:text-white">
          Explore categories
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link key={genre.id} href={`/genre/${mediaType}/${genre.id}`} className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-slate-100 backdrop-blur transition hover:border-emerald-200/50 hover:bg-emerald-200/10">
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
