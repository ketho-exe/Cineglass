import { getGenres } from "@/lib/tmdb/genres";
import type { MediaType } from "@/types/media";
import Link from "next/link";

export function CategoryRail({ mediaType = "movie" }: { mediaType?: MediaType }) {
  const genres = getGenres(mediaType).slice(0, 10);
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Browse by category</p>
          <h2 className="mt-1 text-2xl font-semibold">{mediaType === "movie" ? "Movie" : "TV"} genres</h2>
        </div>
        <Link href={`/genre/${mediaType}/${genres[0]?.id ?? 28}`} className="text-sm text-slate-300 transition hover:text-white">
          Explore categories
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {genres.map((genre, index) => (
          <Link key={genre.id} href={`/genre/${mediaType}/${genre.id}`} className="group block rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 transition hover:border-cyan-200/30 hover:bg-white/[0.08]">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
            <span className="mt-8 block truncate text-base font-semibold text-slate-100 group-hover:text-white">{genre.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
