export type MediaType = "movie" | "tv";

export type Genre = {
  id: number;
  name: string;
};

export type NormalisedMedia = {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseDate?: string | null;
  firstAirDate?: string | null;
  voteAverage?: number;
  genres?: Genre[];
};

export type Episode = {
  tmdbId?: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview?: string;
  stillPath?: string | null;
  airDate?: string | null;
  runtime?: number | null;
};

export type PlayerProgress = {
  tmdbId: number;
  mediaType: MediaType;
  seasonNumber?: number;
  episodeNumber?: number;
  progressSeconds: number;
  durationSeconds?: number;
  progressPercent: number;
  completed: boolean;
};
