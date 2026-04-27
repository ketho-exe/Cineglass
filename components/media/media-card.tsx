import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { yearFromDate } from "@/lib/utils";
import type { NormalisedMedia } from "@/types/media";
import { Play } from "lucide-react";
import Link from "next/link";

export function MediaCard({ media, progressPercent, href }: { media: NormalisedMedia; progressPercent?: number; href?: string }) {
  const cardHref = href ?? `/${media.mediaType}/${media.tmdbId}`;
  const poster = getTmdbImageUrl(media.posterPath, "w342");
  return (
    <Link href={cardHref} prefetch className="group block w-[150px] shrink-0 sm:w-[180px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-glow transition group-hover:scale-[1.025] group-hover:border-white/30">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No poster</div>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-black/60 p-2 opacity-0 transition group-hover:opacity-100">
          <Play className="h-4 w-4 fill-white" />
        </span>
        {progressPercent ? (
          <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <span className="block h-full bg-cine-accent" style={{ width: `${progressPercent}%` }} />
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <h3 className="line-clamp-1 text-sm font-semibold">{media.title}</h3>
        <p className="text-xs text-slate-400">
          {yearFromDate(media.releaseDate ?? media.firstAirDate)} {media.mediaType === "tv" ? "Series" : "Movie"}
        </p>
      </div>
    </Link>
  );
}
