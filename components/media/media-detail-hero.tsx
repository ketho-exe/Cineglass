import { LinkButton, SubmitButton } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { formatRuntime, yearFromDate } from "@/lib/utils";
import type { NormalisedMedia } from "@/types/media";
import { Heart, Play, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LibraryStatus = {
  inWatchlist: boolean;
  isFavourite: boolean;
};

export function MediaDetailHero({
  media,
  watchHref,
  watchLabel,
  watchlistAction,
  favouriteAction,
  status,
}: {
  media: NormalisedMedia;
  watchHref: string;
  watchLabel: string;
  watchlistAction: (formData: FormData) => void | Promise<void>;
  favouriteAction: (formData: FormData) => void | Promise<void>;
  status: LibraryStatus;
}) {
  const backdrop = getTmdbImageUrl(media.backdropPath, "original");
  const poster = getTmdbImageUrl(media.posterPath, "w500");
  const year = yearFromDate(media.releaseDate ?? media.firstAirDate);
  const runtime = media.runtime ? formatRuntime(media.runtime) : media.seasons?.length ? `${media.seasons.length} seasons` : null;

  return (
    <section className="relative min-h-[540px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-glow">
      {backdrop ? <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover opacity-90" /> : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-cine-bg/82 to-cine-bg/16" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cine-bg to-transparent" />
      <div className="relative grid min-h-[540px] gap-7 p-5 sm:grid-cols-[190px_1fr] sm:p-8 lg:grid-cols-[240px_1fr] lg:p-10">
        {poster ? (
          <div className="relative aspect-[2/3] w-40 self-end overflow-hidden rounded-3xl border border-white/10 shadow-glow sm:w-full">
            <Image src={poster} alt={`Poster for ${media.title}`} fill sizes="(min-width: 1024px) 240px, 190px" className="object-cover" />
          </div>
        ) : null}
        <div className="flex max-w-3xl flex-col justify-end">
          <p className="text-sm uppercase tracking-[0.22em] text-violet-200">{media.mediaType === "tv" ? "Series" : "Movie"} {year ? `- ${year}` : ""}</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-normal sm:text-6xl">{media.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-200">
            {runtime ? <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur">{runtime}</span> : null}
            {media.voteAverage ? <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur">TMDB {media.voteAverage.toFixed(1)}</span> : null}
          </div>
          {media.genres?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {media.genres.map((genre) => (
                <Link key={genre.id} href={`/genre/${media.mediaType}/${genre.id}`} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-slate-100 backdrop-blur transition hover:border-cyan-200/50 hover:bg-cyan-200/10">
                  {genre.name}
                </Link>
              ))}
            </div>
          ) : null}
          <p className="mt-4 line-clamp-4 text-slate-200">{media.overview}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href={watchHref}><Play className="h-4 w-4 fill-current" />{watchLabel}</LinkButton>
            <form action={watchlistAction}>
              <input type="hidden" name="mediaType" value={media.mediaType} />
              <input type="hidden" name="tmdbId" value={media.tmdbId} />
              <input type="hidden" name="action" value={status.inWatchlist ? "remove" : "add"} />
              <SubmitButton variant="glass"><Plus className="h-4 w-4" />{status.inWatchlist ? "Saved" : "Watchlist"}</SubmitButton>
            </form>
            <form action={favouriteAction}>
              <input type="hidden" name="mediaType" value={media.mediaType} />
              <input type="hidden" name="tmdbId" value={media.tmdbId} />
              <input type="hidden" name="action" value={status.isFavourite ? "remove" : "add"} />
              <SubmitButton variant="glass"><Heart className="h-4 w-4" />{status.isFavourite ? "Favourited" : "Favourite"}</SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
