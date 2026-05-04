import type { PlaybackProvider } from "@/lib/providers/playback.types";

export function buildPlaybackPreferenceUpdate({
  homePreferences,
  provider,
}: {
  homePreferences: unknown;
  provider: PlaybackProvider;
}) {
  const current = homePreferences && typeof homePreferences === "object"
    ? homePreferences as Record<string, unknown>
    : {};

  return {
    ...current,
    playerProvider: provider,
  };
}
