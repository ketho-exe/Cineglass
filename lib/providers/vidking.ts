import type { PlaybackRequest } from "@/lib/providers/playback.types";

export function buildVidKingEmbedUrl(request: PlaybackRequest): string {
  if (!Number.isInteger(request.tmdbId) || !request.tmdbId || request.tmdbId <= 0) {
    throw new Error("A valid tmdbId is required");
  }

  const base = trimTrailingSlash(
    process.env.VIDKING_BASE_EMBED_URL ?? "https://www.vidking.net/embed",
  );
  const path =
    request.mediaType === "movie"
      ? `/movie/${request.tmdbId}`
      : buildTvPath(request.tmdbId, request.seasonNumber, request.episodeNumber);

  const url = new URL(`${base}${path}`);
  const color = normaliseColor(request.theme?.color ?? process.env.VIDKING_DEFAULT_COLOR ?? "22d3ee");
  if (color) url.searchParams.set("color", color);
  if (request.autoplay) url.searchParams.set("autoPlay", "true");
  if (request.mediaType === "tv" && request.nextEpisode) url.searchParams.set("nextEpisode", "true");
  if (request.mediaType === "tv" && request.episodeSelector) url.searchParams.set("episodeSelector", "true");
  if (request.startTimeSeconds && request.startTimeSeconds > 0) {
    url.searchParams.set("progress", String(Math.floor(request.startTimeSeconds)));
  }
  return url.toString();
}

function buildTvPath(tmdbId: number, seasonNumber?: number, episodeNumber?: number) {
  if (!seasonNumber || !episodeNumber) {
    throw new Error("TV playback requires seasonNumber and episodeNumber");
  }
  return `/tv/${tmdbId}/${seasonNumber}/${episodeNumber}`;
}

function normaliseColor(color?: string) {
  return color?.replace(/^#/, "").trim() || undefined;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}
