import { toggleFavourite, toggleWatchlist } from "@/app/(app)/library-actions";
import { MediaDetailHero } from "@/components/media/media-detail-hero";
import { MediaExtras } from "@/components/media/media-extras";
import { MediaFeedback } from "@/components/media/media-feedback";
import { getLibraryStatus } from "@/lib/library/queries";
import { getDetails } from "@/lib/tmdb/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;
  const media = await getDetails("movie", Number(tmdbId)).catch(() => null);
  if (!media) notFound();
  const status = await getLibraryStatus("movie", media.tmdbId);

  return (
    <article className="space-y-8">
      <MediaDetailHero
        media={media}
        watchHref={`/watch/movie/${media.tmdbId}`}
        watchLabel="Watch Movie"
        watchlistAction={toggleWatchlist}
        favouriteAction={toggleFavourite}
        status={status}
      />
      <MediaExtras media={media} />
      <MediaFeedback mediaType="movie" tmdbId={media.tmdbId} />
    </article>
  );
}
