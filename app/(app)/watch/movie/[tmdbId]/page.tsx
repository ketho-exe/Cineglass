import { VidKingPlayer } from "@/components/player/vidking-player";
import { fallbackMovies } from "@/lib/demo-data";
import { getDetails } from "@/lib/tmdb/client";

export default async function WatchMoviePage({ params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;
  const media = (await getDetails("movie", Number(tmdbId)).catch(() => null)) ?? fallbackMovies[0];
  return (
    <div className="space-y-5">
      <VidKingPlayer mediaType="movie" tmdbId={Number(tmdbId)} title={media.title} autoplay />
      <section className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold">{media.title}</h1>
        <p className="mt-2 text-slate-300">{media.overview}</p>
      </section>
    </div>
  );
}
