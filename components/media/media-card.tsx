import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { cn } from "@/lib/utils";
import { yearFromDate } from "@/lib/utils";
import { getSafeProgress } from "@/lib/media/progress";
import type { NormalisedMedia } from "@/types/media";
import { Info, MoreHorizontal, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MediaCard({
  media,
  progressPercent,
  href,
  className,
}: {
  media: NormalisedMedia;
  progressPercent?: number;
  href?: string;
  className?: string;
}) {
  const cardHref = href ?? `/${media.mediaType}/${media.tmdbId}`;
  const detailsHref = `/${media.mediaType}/${media.tmdbId}`;
  const watchHref = media.mediaType === "tv" ? `/watch/tv/${media.tmdbId}/season/1/episode/1` : `/watch/movie/${media.tmdbId}`;
  const poster = getTmdbImageUrl(media.posterPath, "w342");
  const genres = media.genres?.slice(0, 2) ?? [];
  const { hasProgress, safeProgress } = getSafeProgress(progressPercent);
  const year = yearFromDate(media.releaseDate ?? media.firstAirDate);

  return (
    <article className={cn("group block w-[150px] shrink-0 snap-start sm:w-[180px]", className)}>
      <Link href={cardHref} prefetch className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.045] transition duration-300 group-hover:border-cyan-200/30 group-focus-within:border-cyan-200/30">
          {poster ? (
            <Image src={poster} alt={`Poster for ${media.title}`} fill sizes="(min-width: 1024px) 180px, 45vw" className="object-cover transition duration-500 group-hover:scale-105 group-focus-within:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No poster</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/64 to-transparent" />
          <div className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/70 px-2 py-1 text-[11px] font-semibold uppercase text-slate-100 backdrop-blur">
            {media.mediaType === "tv" ? "Series" : "Movie"}
          </div>
          <span className="absolute right-2 top-2 rounded-full bg-black/70 p-2 opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100">
            <Play className="h-4 w-4 fill-white" />
          </span>
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="rounded-xl border border-white/10 bg-black/78 p-2 text-xs text-white backdrop-blur">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1"><Play className="h-3.5 w-3.5 fill-current" /> Watch</span>
                <span className="inline-flex items-center gap-1 text-slate-300"><Info className="h-3.5 w-3.5" /> Details</span>
                <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>
          {hasProgress ? (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <span className="block h-full bg-emerald-300" style={{ width: `${safeProgress}%` }} />
            </span>
          ) : null}
        </div>
      </Link>
      <div className="mt-3">
        <Link href={cardHref} prefetch className="line-clamp-1 text-sm font-semibold transition hover:text-cyan-100">{media.title}</Link>
        <p className="text-xs text-slate-400">{[year, media.voteAverage ? `TMDB ${media.voteAverage.toFixed(1)}` : null].filter(Boolean).join(" - ")}</p>
        {genres.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/genre/${media.mediaType}/${genre.id}`} className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-1 text-[11px] text-slate-200 backdrop-blur transition hover:border-cine-accent/50 hover:bg-cine-accent/10">
                {genre.name}
              </Link>
            ))}
          </div>
        ) : null}
        <div className="sr-only">
          <Link href={watchHref}>Watch {media.title}</Link>
          <Link href={detailsHref}>Details for {media.title}</Link>
        </div>
      </div>
    </article>
  );
}
