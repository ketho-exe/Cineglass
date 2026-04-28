import { EmbedMasterPlayer } from "@/components/player/embedmaster-player";
import { WatchPartyPanel } from "@/components/player/watch-party-panel";
import { requireUser } from "@/lib/auth/require-user";
import { getPlaybackProvider } from "@/lib/providers/preferences";

export default async function WatchTvPage({
  params,
  searchParams,
}: {
  params: Promise<{ tmdbId: string; seasonNumber: string; episodeNumber: string }>;
  searchParams: Promise<{ party?: string }>;
}) {
  const { tmdbId, seasonNumber, episodeNumber } = await params;
  const { party } = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("home_preferences")
    .eq("id", user.id)
    .maybeSingle();
  const provider = getPlaybackProvider(profile);
  return (
    <div className="space-y-5">
      <EmbedMasterPlayer
        mediaType="tv"
        tmdbId={Number(tmdbId)}
        seasonNumber={Number(seasonNumber)}
        episodeNumber={Number(episodeNumber)}
        title={`S${seasonNumber} E${episodeNumber}`}
        autoplay
        partyCode={provider === "embedmaster" ? party : undefined}
        provider={provider}
      />
      {provider === "embedmaster" ? (
        <WatchPartyPanel mediaType="tv" tmdbId={Number(tmdbId)} seasonNumber={Number(seasonNumber)} episodeNumber={Number(episodeNumber)} roomCode={party} />
      ) : null}
      <section className="glass rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Now watching</p>
        <h1 className="mt-2 text-2xl font-bold">Season {seasonNumber}, Episode {episodeNumber}</h1>
      </section>
    </div>
  );
}
