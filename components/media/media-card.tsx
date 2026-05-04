import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { cn } from "@/lib/utils";
import { yearFromDate } from "@/lib/utils";
import type { NormalisedMedia } from "@/types/media";
import { Play } from "lucide-react";
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
  const poster = getTmdbImageUrl(media.posterPath, "w342");
  const genres = media.genres?.slice(0, 2) ?? [];
  return (
    <article className={cn("group block w-[150px] shrink-0 snap-start sm:w-[180px]", className)}>
      <Link href={cardHref} prefetch className="block">
        <div className="glass-card relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/10 shadow-glow transition group-hover:-translate-y-1 group-hover:border-white/30">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No poster</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
          <span className="absolute right-2 top-2 rounded-full bg-black/60 p-2 opacity-0 backdrop-blur transition group-hover:opacity-100">
            <Play className="h-4 w-4 fill-white" />
          </span>
          {progressPercent ? (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <span className="block h-full bg-emerald-300" style={{ width: `${progressPercent}%` }} />
            </span>
          ) : null}
        </div>
      </Link>
      <div className="mt-3">
        <Link href={cardHref} prefetch className="line-clamp-1 text-sm font-semibold transition hover:text-cyan-100">{media.title}</Link>
        <p className="text-xs text-slate-400">
          {yearFromDate(media.releaseDate ?? media.firstAirDate)} {media.mediaType === "tv" ? "Series" : "Movie"}
        </p>
        {genres.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/genre/${media.mediaType}/${genre.id}`} className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-1 text-[11px] text-slate-200 backdrop-blur transition hover:border-cine-accent/50 hover:bg-cine-accent/10">
                {genre.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
