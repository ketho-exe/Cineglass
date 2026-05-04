import type { PlaybackRequest } from "@/lib/providers/playback.types";

export function buildSpenEmbedUrl(request: PlaybackRequest): string {
  const base = trimTrailingSlash(process.env.SPENEMBED_BASE_URL ?? "https://spencerdevs.xyz");
  let path: string;

  if (request.mediaType === "movie") {
    path = `/movie/${requiredPositiveInteger(request.tmdbId, "SpenEmbed movie playback requires tmdbId")}`;
  } else if (request.mediaType === "tv") {
    path = `/tv/${requiredPositiveInteger(request.tmdbId, "SpenEmbed TV playback requires tmdbId")}/${requiredPositiveInteger(request.seasonNumber, "SpenEmbed TV playback requires seasonNumber")}/${requiredPositiveInteger(request.episodeNumber, "SpenEmbed TV playback requires episodeNumber")}`;
  } else if (request.mediaType === "anime") {
    path = `/anime/${requiredPositiveInteger(request.anilistId, "SpenEmbed anime playback requires anilistId and episodeNumber")}/${requiredPositiveInteger(request.episodeNumber, "SpenEmbed anime playback requires anilistId and episodeNumber")}`;
  } else {
    throw new Error(`Unsupported SpenEmbed media type: ${request.mediaType}`);
  }

  const url = new URL(`${base}${path}`);
  const theme = normaliseColor(request.theme?.color ?? process.env.SPENEMBED_DEFAULT_THEME ?? "22d3ee");
  if (theme) url.searchParams.set("theme", theme);
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
