import type { PlaybackProvider } from "@/lib/providers/playback.types";

export type ProfilePlaybackPreference = {
  player_provider?: unknown;
  home_preferences?: unknown;
};

export function normalisePlaybackProvider(value: unknown): PlaybackProvider {
  return value === "vidking" ? "vidking" : "embedmaster";
}

export function getPlaybackProvider(profile: ProfilePlaybackPreference | null | undefined): PlaybackProvider {
  const homePreferences = profile?.home_preferences;
  const fallback = typeof homePreferences === "object" && homePreferences !== null
    ? (homePreferences as { playerProvider?: unknown }).playerProvider
    : undefined;

  return normalisePlaybackProvider(profile?.player_provider ?? fallback);
}
