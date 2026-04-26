import { LinkButton } from "@/components/ui/button";
import { fallbackMovies } from "@/lib/demo-data";
import { getDetails, getTmdbImageUrl } from "@/lib/tmdb/client";
import { formatRuntime, yearFromDate } from "@/lib/utils";
import { Heart, Play, Plus } from "lucide-react";

export default async function MovieDetailPage({ params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;
  const media = (await getDetails("movie", Number(tmdbId)).catch(() => null)) ?? fallbackMovies.find((item) => item.tmdbId === Number(tmdbId)) ?? fallbackMovies[0];
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
              <LinkButton href="/watchlist" variant="glass"><Plus className="h-4 w-4" />Watchlist</LinkButton>
              <LinkButton href="/profile" variant="glass"><Heart className="h-4 w-4" />Favourite</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
