import type { PlaybackRequest } from "@/lib/providers/playback.types";

export function buildVideasyEmbedUrl(request: PlaybackRequest): string {
  const base = trimTrailingSlash(process.env.VIDEASY_BASE_URL ?? "https://player.videasy.net");
  let path: string;

  if (request.mediaType === "movie") {
    path = `/movie/${requiredPositiveInteger(request.tmdbId, "Videasy movie playback requires tmdbId")}`;
  } else if (request.mediaType === "tv") {
    path = `/tv/${requiredPositiveInteger(request.tmdbId, "Videasy TV playback requires tmdbId")}/${requiredPositiveInteger(request.seasonNumber, "Videasy TV playback requires seasonNumber")}/${requiredPositiveInteger(request.episodeNumber, "Videasy TV playback requires episodeNumber")}`;
  } else if (request.mediaType === "anime") {
    const anilistId = requiredPositiveInteger(request.anilistId, "Videasy anime playback requires anilistId");
    path = request.episodeNumber
      ? `/anime/${anilistId}/${requiredPositiveInteger(request.episodeNumber, "Videasy anime episode playback requires episodeNumber")}`
      : `/anime/${anilistId}`;
  } else {
    throw new Error(`Unsupported Videasy media type: ${request.mediaType}`);
  }

  const url = new URL(`${base}${path}`);
  const color = normaliseColor(request.theme?.color ?? process.env.VIDEASY_DEFAULT_COLOR ?? "22d3ee");
  if (color) url.searchParams.set("color", color);
  if (request.startTimeSeconds && request.startTimeSeconds > 0) {
    url.searchParams.set("progress", String(Math.floor(request.startTimeSeconds)));
  }
  if (request.nextEpisode) url.searchParams.set("nextEpisode", "true");
  if (request.episodeSelector) url.searchParams.set("episodeSelector", "true");
  if (request.autoplayNextEpisode) url.searchParams.set("autoplayNextEpisode", "true");
  if (request.overlay) url.searchParams.set("overlay", "true");
  return url.toString();
}

function requiredPositiveInteger(value: unknown, message: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) throw new Error(message);
  return number;
}

function normaliseColor(color?: string) {
  return color?.replace(/^#/, "").trim() || undefined;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}
