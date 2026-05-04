import { MediaCard } from "@/components/media/media-card";
import { getGenreName, getGenres } from "@/lib/tmdb/genres";
import { discoverByGenre } from "@/lib/tmdb/client";
import type { MediaType } from "@/types/media";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ mediaType: string; genreId: string }>;
}) {
  const { mediaType: mediaTypeParam, genreId } = await params;
  if (mediaTypeParam !== "movie" && mediaTypeParam !== "tv") notFound();
  const mediaType = mediaTypeParam as MediaType;
  const id = Number(genreId);
  if (!Number.isInteger(id)) notFound();

  const [items, genres] = await Promise.all([
    discoverByGenre(mediaType, id).catch(() => []),
    Promise.resolve(getGenres(mediaType)),
  ]);
  const title = getGenreName(mediaType, id);

  return (
    <section>
      <div className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">{mediaType === "movie" ? "Movies" : "TV"} by category</p>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${mediaType}/${genre.id}`}
              className={genre.id === id
                ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-cine-bg"
                : "rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm text-slate-100 backdrop-blur transition hover:border-emerald-200/50 hover:bg-emerald-200/10"}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} className="w-full sm:w-full" />
        ))}
      </div>
    </section>
  );
}
