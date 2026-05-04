import { ProviderPlayer } from "@/components/player/provider-player";
import { WatchPartyPanel } from "@/components/player/watch-party-panel";
import { requireUser } from "@/lib/auth/require-user";
import { getPlaybackProvider } from "@/lib/providers/preferences";
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
  const { supabase, user } = await requireUser();
  const [{ data: profile }, media] = await Promise.all([
    supabase.from("profiles").select("home_preferences, player_provider").eq("id", user.id).maybeSingle(),
    getDetails("movie", Number(tmdbId)).catch(() => null),
  ]);
  const provider = getPlaybackProvider(profile);
  const preferences = getPlayerPreferences(profile?.home_preferences);
  return (
    <div className="space-y-5">
      <ProviderPlayer
        mediaType="movie"
        tmdbId={Number(tmdbId)}
        title={media?.title ?? `Movie ${tmdbId}`}
        autoplay={preferences.autoplay}
        accentColor={preferences.playerAccentColor}
        nextEpisode={preferences.videasy.nextEpisode}
        episodeSelector={preferences.videasy.episodeSelector}
        autoplayNextEpisode={preferences.videasy.autoplayNextEpisode}
        overlay={preferences.videasy.overlay}
        partyCode={provider === "embedmaster" ? party : undefined}
        provider={provider}
      />
      {provider === "embedmaster" ? <WatchPartyPanel mediaType="movie" tmdbId={Number(tmdbId)} roomCode={party} /> : null}
      <section className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold">{media?.title ?? `Movie ${tmdbId}`}</h1>
        {media?.overview ? <p className="mt-2 text-slate-300">{media.overview}</p> : null}
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
