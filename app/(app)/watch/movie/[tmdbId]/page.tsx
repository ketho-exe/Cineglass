import { VidKingPlayer } from "@/components/player/vidking-player";
import { getDetails } from "@/lib/tmdb/client";

export default async function WatchMoviePage({ params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;
  const media = await getDetails("movie", Number(tmdbId)).catch(() => null);
  return (
    <div className="space-y-5">
      <VidKingPlayer mediaType="movie" tmdbId={Number(tmdbId)} title={media?.title ?? `Movie ${tmdbId}`} autoplay />
      <section className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold">{media?.title ?? `Movie ${tmdbId}`}</h1>
        {media?.overview ? <p className="mt-2 text-slate-300">{media.overview}</p> : null}
      </section>
    </div>
  );
}
