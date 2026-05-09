import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { yearFromDate } from "@/lib/utils";
import type { NormalisedMedia } from "@/types/media";
import Image from "next/image";
import Link from "next/link";

export function BecauseYouWatchedRow({
  watched,
  items,
}: {
  watched: NormalisedMedia;
  items: NormalisedMedia[];
}) {
  if (!items.length) return null;
  const watchedPoster = getTmdbImageUrl(watched.posterPath, "w185");

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
          {watchedPoster ? <Image src={watchedPoster} alt="" fill sizes="44px" className="object-cover" /> : null}
        </div>
        <div className="h-14 w-px bg-cyan-200/60" />
        <div>
          <h2 className="text-2xl font-bold text-white">Because you watched</h2>
          <p className="mt-1 text-sm text-slate-400">{watched.title}</p>
        </div>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-3">
        {items.map((item) => {
          const image = getTmdbImageUrl(item.backdropPath, "w500") ?? getTmdbImageUrl(item.posterPath, "w342");
          const href = `/${item.mediaType}/${item.tmdbId}`;
          const meta = [
            item.voteAverage ? `TMDB ${item.voteAverage.toFixed(1)}` : null,
            yearFromDate(item.releaseDate ?? item.firstAirDate),
            item.mediaType === "tv" ? "TV Show" : "Movie",
          ].filter(Boolean).join(" - ");

          return (
            <Link key={`${item.mediaType}-${item.tmdbId}`} href={href} className="group w-64 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition group-hover:-translate-y-0.5 group-hover:border-cyan-200/40">
                {image ? <Image src={image} alt="" fill sizes="256px" className="object-cover transition group-hover:scale-105" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
              </div>
              <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{meta}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
