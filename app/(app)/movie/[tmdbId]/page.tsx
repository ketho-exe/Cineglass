import { toggleFavourite, toggleWatchlist } from "@/app/(app)/library-actions";
import { LinkButton, SubmitButton } from "@/components/ui/button";
import { getLibraryStatus } from "@/lib/library/queries";
import { getDetails, getTmdbImageUrl } from "@/lib/tmdb/client";
import { formatRuntime, yearFromDate } from "@/lib/utils";
import { Heart, Play, Plus } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;
  const media = await getDetails("movie", Number(tmdbId)).catch(() => null);
  if (!media) notFound();
  const status = await getLibraryStatus("movie", media.tmdbId);
  const backdrop = getTmdbImageUrl(media.backdropPath, "original");
  const poster = getTmdbImageUrl(media.posterPath, "w500");

  return (
    <article>
      <section className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
        {backdrop ? <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg via-cine-bg/68 to-transparent" />
        <div className="relative grid min-h-[520px] gap-8 p-6 sm:grid-cols-[220px_1fr] sm:p-10">
          {poster ? <img src={poster} alt="" className="hidden w-full self-end rounded-3xl shadow-glow sm:block" /> : null}
          <div className="flex max-w-3xl flex-col justify-end">
            <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Movie • {yearFromDate(media.releaseDate)}</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">{media.title}</h1>
            <p className="mt-4 text-slate-200">{media.overview}</p>
            <p className="mt-4 text-sm text-slate-300">{formatRuntime(undefined)} {media.voteAverage ? `TMDB ${media.voteAverage.toFixed(1)}` : ""}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href={`/watch/movie/${media.tmdbId}`}><Play className="h-4 w-4 fill-current" />Watch Movie</LinkButton>
              <form action={toggleWatchlist}>
                <input type="hidden" name="mediaType" value="movie" />
                <input type="hidden" name="tmdbId" value={media.tmdbId} />
                <input type="hidden" name="action" value={status.inWatchlist ? "remove" : "add"} />
                <SubmitButton variant="glass"><Plus className="h-4 w-4" />{status.inWatchlist ? "Remove Watchlist" : "Watchlist"}</SubmitButton>
              </form>
              <form action={toggleFavourite}>
                <input type="hidden" name="mediaType" value="movie" />
                <input type="hidden" name="tmdbId" value={media.tmdbId} />
                <input type="hidden" name="action" value={status.isFavourite ? "remove" : "add"} />
                <SubmitButton variant="glass"><Heart className="h-4 w-4" />{status.isFavourite ? "Unfavourite" : "Favourite"}</SubmitButton>
              </form>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
