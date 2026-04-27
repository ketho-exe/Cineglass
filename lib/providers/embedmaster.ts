import type { PlaybackRequest } from "@/lib/providers/playback.types";

const defaultPlayerId = "k8i9pm5nsn3nrj0d";

export function buildEmbedMasterEmbedUrl(request: PlaybackRequest): string {
  if (!Number.isInteger(request.tmdbId) || request.tmdbId <= 0) {
    throw new Error("A valid tmdbId is required");
  }

  const base = trimTrailingSlash(
    process.env.EMBEDMASTER_BASE_URL ?? "https://embedmaster.link",
  );
  const playerId = encodeURIComponent(
    process.env.EMBEDMASTER_PLAYER_ID?.trim() || defaultPlayerId,
  );
  const path =
    request.mediaType === "movie"
      ? `/${playerId}/movie/${request.tmdbId}`
      : `/${playerId}/tv/${request.tmdbId}/${requiredNumber(request.seasonNumber, "seasonNumber")}/${requiredNumber(request.episodeNumber, "episodeNumber")}`;

  const url = new URL(`${base}${path}`);
  if (request.subtitles?.length) {
    for (const subtitle of request.subtitles) {
      url.searchParams.append("sub_url[]", subtitle.url);
      url.searchParams.append("sub_label[]", subtitle.label);
    }
  }
  return url.toString();
}

function requiredNumber(value: number | undefined, label: string) {
  if (!Number.isInteger(value) || !value || value <= 0) {
    throw new Error(`TV playback requires ${label}`);
  }
  return value;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}
