import { EmbedMasterPlayer } from "@/components/player/embedmaster-player";

export default async function WatchTvPage({
  params,
}: {
  params: Promise<{ tmdbId: string; seasonNumber: string; episodeNumber: string }>;
}) {
  const { tmdbId, seasonNumber, episodeNumber } = await params;
  return (
    <div className="space-y-5">
      <EmbedMasterPlayer
        mediaType="tv"
        tmdbId={Number(tmdbId)}
        seasonNumber={Number(seasonNumber)}
        episodeNumber={Number(episodeNumber)}
        title={`S${seasonNumber} E${episodeNumber}`}
        autoplay
      />
      <section className="glass rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Now watching</p>
        <h1 className="mt-2 text-2xl font-bold">Season {seasonNumber}, Episode {episodeNumber}</h1>
      </section>
    </div>
  );
}
