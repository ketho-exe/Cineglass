import type { MediaType } from "@/types/media";

export type PlaybackMediaType = MediaType | "anime";

export type PlaybackProvider = "embedmaster" | "vidking" | "videasy" | "spenembed";

export type PlayerThemeConfig = {
  color?: string;
};

export type PlaybackRequest = {
  mediaType: PlaybackMediaType;
  tmdbId?: number;
  anilistId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  autoplay?: boolean;
  nextEpisode?: boolean;
  episodeSelector?: boolean;
  autoplayNextEpisode?: boolean;
  overlay?: boolean;
  startTimeSeconds?: number;
  theme?: PlayerThemeConfig;
  subtitles?: Array<{
    url: string;
    label: string;
  }>;
};
