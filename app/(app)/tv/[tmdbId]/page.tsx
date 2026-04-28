import { toggleFavourite, toggleWatchlist } from "@/app/(app)/library-actions";
import { MediaExtras } from "@/components/media/media-extras";
import { MediaFeedback } from "@/components/media/media-feedback";
import { LinkButton, SubmitButton } from "@/components/ui/button";
import { getLibraryStatus } from "@/lib/library/queries";
import { getDetails, getSeason, getTmdbImageUrl } from "@/lib/tmdb/client";
import { yearFromDate } from "@/lib/utils";
import { Heart, Play, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  const backdrop = getTmdbImageUrl(media.backdropPath, "original");

  return (
    <article className="space-y-8">
      <section className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
        {backdrop ? <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg via-cine-bg/68 to-transparent" />
        <div className="relative flex min-h-[500px] max-w-3xl flex-col justify-end p-6 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Series - {yearFromDate(media.firstAirDate)}</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">{media.title}</h1>
          {media.genres?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {media.genres.map((genre) => (
                <Link key={genre.id} href={`/genre/tv/${genre.id}`} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-slate-100 backdrop-blur transition hover:border-emerald-200/50 hover:bg-emerald-200/10">
                  {genre.name}
                </Link>
              ))}
            </div>
          ) : null}
          <p className="mt-4 text-slate-200">{media.overview}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href={`/watch/tv/${media.tmdbId}/season/${selectedSeason}/episode/${episodes[0]?.episodeNumber ?? 1}`}><Play className="h-4 w-4 fill-current" />Start Season {selectedSeason}</LinkButton>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Season {selectedSeason}</h2>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {seasons.map((season) => (
              <a
                key={season.seasonNumber}
                href={`/tv/${media.tmdbId}?season=${season.seasonNumber}`}
                className={season.seasonNumber === selectedSeason
                  ? "shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-cine-bg"
                  : "shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"}
              >
                S{season.seasonNumber} ({season.episodeCount})
              </a>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {episodes.map((episode) => (
            <a key={episode.episodeNumber} href={`/watch/tv/${media.tmdbId}/season/${selectedSeason}/episode/${episode.episodeNumber}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
              Episode {episode.episodeNumber}: {episode.title}
            </a>
          ))}
        </div>
      </section>
      <MediaExtras media={media} />
      <MediaFeedback mediaType="tv" tmdbId={media.tmdbId} />
    </article>
  );
}
