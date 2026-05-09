import { ProviderPlayer } from "@/components/player/provider-player";
import { WatchPartyPanel } from "@/components/player/watch-party-panel";
import { getPlaybackProvider } from "@/lib/providers/preferences";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";

export default async function WatchTvPage({
  params,
  searchParams,
}: {
  params: Promise<{ tmdbId: string; seasonNumber: string; episodeNumber: string }>;
  searchParams: Promise<{ party?: string }>;
}) {
  const { tmdbId, seasonNumber, episodeNumber } = await params;
  const { party } = await searchParams;
  const supabase = await createOptionalSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: profile } = user && supabase
    ? await supabase
      .from("profiles")
      .select("home_preferences, player_provider")
      .eq("id", user.id)
      .maybeSingle()
    : { data: null };
  const provider = getPlaybackProvider(profile);
  const preferences = getPlayerPreferences(profile?.home_preferences);
  return (
    <div className="space-y-5">
      <ProviderPlayer
        mediaType="tv"
        tmdbId={Number(tmdbId)}
        seasonNumber={Number(seasonNumber)}
        episodeNumber={Number(episodeNumber)}
        title={`S${seasonNumber} E${episodeNumber}`}
        autoplay={preferences.autoplay}
        accentColor={preferences.playerAccentColor}
        nextEpisode={preferences.videasy.nextEpisode}
        episodeSelector={preferences.videasy.episodeSelector}
        autoplayNextEpisode={preferences.videasy.autoplayNextEpisode}
        overlay={preferences.videasy.overlay}
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

function getPlayerPreferences(value: unknown) {
  const preferences = value && typeof value === "object" ? value as {
    playerAccentColor?: string;
    autoplay?: boolean;
    videasy?: {
      overlay?: boolean;
      episodeSelector?: boolean;
      nextEpisode?: boolean;
      autoplayNextEpisode?: boolean;
    };
  } : {};

  return {
    playerAccentColor: preferences.playerAccentColor ?? "22d3ee",
    autoplay: preferences.autoplay ?? true,
    videasy: {
      overlay: preferences.videasy?.overlay ?? true,
      episodeSelector: preferences.videasy?.episodeSelector ?? true,
      nextEpisode: preferences.videasy?.nextEpisode ?? true,
      autoplayNextEpisode: preferences.videasy?.autoplayNextEpisode ?? false,
    },
  };
}
