import { EmbedMasterPlayer } from "@/components/player/embedmaster-player";
import { WatchPartyPanel } from "@/components/player/watch-party-panel";
import { getDetails } from "@/lib/tmdb/client";

export default async function WatchMoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ tmdbId: string }>;
  searchParams: Promise<{ party?: string }>;
}) {
  const { tmdbId } = await params;
  const { party } = await searchParams;
  const media = await getDetails("movie", Number(tmdbId)).catch(() => null);
  return (
    <div className="space-y-5">
      <EmbedMasterPlayer mediaType="movie" tmdbId={Number(tmdbId)} title={media?.title ?? `Movie ${tmdbId}`} autoplay partyCode={party} />
      <WatchPartyPanel mediaType="movie" tmdbId={Number(tmdbId)} roomCode={party} />
      <section className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold">{media?.title ?? `Movie ${tmdbId}`}</h1>
        {media?.overview ? <p className="mt-2 text-slate-300">{media.overview}</p> : null}
      </section>
    </div>
  );
}
