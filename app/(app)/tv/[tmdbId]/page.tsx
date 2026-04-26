import { toggleFavourite, toggleWatchlist } from "@/app/(app)/library-actions";
import { LinkButton, SubmitButton } from "@/components/ui/button";
import { getLibraryStatus } from "@/lib/library/queries";
import { getDetails, getSeason, getTmdbImageUrl } from "@/lib/tmdb/client";
import { yearFromDate } from "@/lib/utils";
import { Heart, Play, Plus } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TvDetailPage({ params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;
  const media = await getDetails("tv", Number(tmdbId)).catch(() => null);
  if (!media) notFound();
  const [status, episodes] = await Promise.all([
    getLibraryStatus("tv", media.tmdbId),
    getSeason(media.tmdbId, 1).catch(() => []),
  ]);
  const backdrop = getTmdbImageUrl(media.backdropPath, "original");

  return (
    <article className="space-y-8">
      <section className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
        {backdrop ? <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg via-cine-bg/68 to-transparent" />
        <div className="relative flex min-h-[500px] max-w-3xl flex-col justify-end p-6 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Series • {yearFromDate(media.firstAirDate)}</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">{media.title}</h1>
          <p className="mt-4 text-slate-200">{media.overview}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href={`/watch/tv/${media.tmdbId}/season/1/episode/1`}><Play className="h-4 w-4 fill-current" />Start Episode 1</LinkButton>
            <form action={toggleWatchlist}>
              <input type="hidden" name="mediaType" value="tv" />
              <input type="hidden" name="tmdbId" value={media.tmdbId} />
              <input type="hidden" name="action" value={status.inWatchlist ? "remove" : "add"} />
              <SubmitButton variant="glass"><Plus className="h-4 w-4" />{status.inWatchlist ? "Remove Watchlist" : "Watchlist"}</SubmitButton>
            </form>
            <form action={toggleFavourite}>
              <input type="hidden" name="mediaType" value="tv" />
              <input type="hidden" name="tmdbId" value={media.tmdbId} />
              <input type="hidden" name="action" value={status.isFavourite ? "remove" : "add"} />
              <SubmitButton variant="glass"><Heart className="h-4 w-4" />{status.isFavourite ? "Unfavourite" : "Favourite"}</SubmitButton>
            </form>
          </div>
        </div>
      </section>
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Season 1</h2>
        <div className="mt-4 grid gap-3">
          {episodes.map((episode) => (
            <a key={episode.episodeNumber} href={`/watch/tv/${media.tmdbId}/season/1/episode/${episode.episodeNumber}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
              Episode {episode.episodeNumber}: {episode.title}
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
