import { toggleFavourite, toggleWatchlist } from "@/app/(app)/library-actions";
import { MediaDetailHero } from "@/components/media/media-detail-hero";
import { MediaExtras } from "@/components/media/media-extras";
import { MediaFeedback } from "@/components/media/media-feedback";
import { getLibraryStatus } from "@/lib/library/queries";
import { getDetails, getSeason } from "@/lib/tmdb/client";
import { formatRuntime } from "@/lib/utils";
import { Play } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TvDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ tmdbId: string }>;
  searchParams: Promise<{ season?: string }>;
}) {
  const { tmdbId } = await params;
  const requestedSeason = Number((await searchParams).season ?? "1");
  const media = await getDetails("tv", Number(tmdbId)).catch(() => null);
  if (!media) notFound();

  const seasons = (media.seasons ?? []).filter((season) => season.seasonNumber > 0);
  const selectedSeason = seasons.some((season) => season.seasonNumber === requestedSeason)
    ? requestedSeason
    : seasons[0]?.seasonNumber ?? 1;
  const [status, episodes] = await Promise.all([
    getLibraryStatus("tv", media.tmdbId),
    getSeason(media.tmdbId, selectedSeason).catch(() => []),
  ]);
  const firstEpisode = episodes[0]?.episodeNumber ?? 1;

  return (
    <article className="space-y-8">
      <MediaDetailHero
        media={media}
        watchHref={`/watch/tv/${media.tmdbId}/season/${selectedSeason}/episode/${firstEpisode}`}
        watchLabel={`Start Season ${selectedSeason}`}
        watchlistAction={toggleWatchlist}
        favouriteAction={toggleFavourite}
        status={status}
      />
      <section className="glass rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Episodes</p>
            <h2 className="mt-1 text-xl font-semibold">Season {selectedSeason}</h2>
          </div>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {seasons.map((season) => (
              <a
                key={season.seasonNumber}
                href={`/tv/${media.tmdbId}?season=${season.seasonNumber}`}
                className={season.seasonNumber === selectedSeason
                  ? "shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-cine-bg"
                  : "shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"}
              >
                S{season.seasonNumber} ({season.episodeCount})
              </a>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {episodes.map((episode) => (
            <a key={episode.episodeNumber} href={`/watch/tv/${media.tmdbId}/season/${selectedSeason}/episode/${episode.episodeNumber}`} className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-200/35 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Episode {episode.episodeNumber}</p>
                  <h3 className="mt-1 font-semibold text-white">{episode.title}</h3>
                  {episode.overview ? <p className="mt-1 line-clamp-2 text-sm text-slate-400">{episode.overview}</p> : null}
                  <p className="mt-2 text-xs text-slate-500">{[episode.airDate, episode.runtime ? formatRuntime(episode.runtime) : null].filter(Boolean).join(" - ")}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-cine-bg">
                  <Play className="h-4 w-4 fill-current" />
                  Watch
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <MediaExtras media={media} />
      <MediaFeedback mediaType="tv" tmdbId={media.tmdbId} />
    </article>
  );
}
