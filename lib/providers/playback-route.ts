import { buildEmbedMasterEmbedUrl } from "./embedmaster";
import { playbackProviders, normalisePlaybackProvider } from "./preferences";
import type { PlaybackProvider, PlaybackRequest, PlaybackMediaType } from "./playback.types";
import { buildSpenEmbedUrl } from "./spenembed";
import { buildVideasyEmbedUrl } from "./videasy";
import { buildVidKingEmbedUrl } from "./vidking";

export function parsePlaybackQuery(searchParams: URLSearchParams): PlaybackRequest {
  const mediaType = searchParams.get("mediaType");
  if (!isPlaybackMediaType(mediaType)) {
    throw new Error("Invalid mediaType");
  }

  const request: PlaybackRequest = {
    mediaType,
    tmdbId: numberParam(searchParams.get("tmdbId")),
    anilistId: numberParam(searchParams.get("anilistId")),
    seasonNumber: numberParam(searchParams.get("seasonNumber")),
    episodeNumber: numberParam(searchParams.get("episodeNumber")),
    autoplay: booleanParam(searchParams.get("autoplay")),
    nextEpisode: booleanParam(searchParams.get("nextEpisode")),
    episodeSelector: booleanParam(searchParams.get("episodeSelector")),
    autoplayNextEpisode: booleanParam(searchParams.get("autoplayNextEpisode")),
    overlay: booleanParam(searchParams.get("overlay")),
    startTimeSeconds: numberParam(searchParams.get("progress") ?? searchParams.get("startTimeSeconds")),
    theme: themeParam(searchParams),
  };

  validatePlaybackRequest(request);
  return request;
}

export function buildPlaybackEmbedUrl(provider: string, request: PlaybackRequest): string {
  if (!playbackProviders.includes(provider as PlaybackProvider)) {
    throw new Error("Unknown provider");
  }

  switch (normalisePlaybackProvider(provider)) {
    case "embedmaster":
      return buildEmbedMasterEmbedUrl(request);
    case "vidking":
      return buildVidKingEmbedUrl(request);
    case "videasy":
      return buildVideasyEmbedUrl(request);
    case "spenembed":
      return buildSpenEmbedUrl(request);
  }
}

function validatePlaybackRequest(request: PlaybackRequest) {
  if ((request.mediaType === "movie" || request.mediaType === "tv") && !request.tmdbId) {
    throw new Error("A valid tmdbId is required");
  }
  if (request.mediaType === "tv" && (!request.seasonNumber || !request.episodeNumber)) {
    throw new Error("TV playback requires seasonNumber and episodeNumber");
  }
  if (request.mediaType === "anime" && !request.anilistId) {
    throw new Error("This provider needs an AniList ID for anime playback. Add an AniList mapping first.");
  }
}

function isPlaybackMediaType(value: string | null): value is PlaybackMediaType {
  return value === "movie" || value === "tv" || value === "anime";
}

function numberParam(value: string | null) {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function booleanParam(value: string | null) {
  return value === null ? undefined : value === "true";
}

function themeParam(searchParams: URLSearchParams) {
  const color = searchParams.get("color") ?? searchParams.get("theme");
  return color ? { color } : undefined;
}
