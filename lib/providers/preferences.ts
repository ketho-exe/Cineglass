import type { PlaybackProvider } from "@/lib/providers/playback.types";

export const providerLabels = {
  embedmaster: "EmbedMaster",
  vidking: "VidKing",
  videasy: "Videasy",
  spenembed: "SpenEmbed",
} satisfies Record<PlaybackProvider, string>;

export const playbackProviders = Object.keys(providerLabels) as PlaybackProvider[];

export type ProfilePlaybackPreference = {
  player_provider?: unknown;
  home_preferences?: unknown;
};

export function normalisePlaybackProvider(value: unknown): PlaybackProvider {
  return playbackProviders.includes(value as PlaybackProvider) ? value as PlaybackProvider : "embedmaster";
}

export function getPlaybackProvider(profile: ProfilePlaybackPreference | null | undefined): PlaybackProvider {
  const homePreferences = profile?.home_preferences;
  const preferred = typeof homePreferences === "object" && homePreferences !== null
    ? (homePreferences as { playerProvider?: unknown }).playerProvider
    : undefined;

  return normalisePlaybackProvider(preferred ?? profile?.player_provider);
}
