import type { MediaType } from "@/types/media";

export type PlaybackProvider = "embedmaster" | "vidking";

export type PlayerThemeConfig = {
  color?: string;
};

export type PlaybackRequest = {
  mediaType: MediaType;
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
  autoplay?: boolean;
  nextEpisode?: boolean;
  episodeSelector?: boolean;
  startTimeSeconds?: number;
  theme?: PlayerThemeConfig;
  subtitles?: Array<{
    url: string;
    label: string;
  }>;
};
