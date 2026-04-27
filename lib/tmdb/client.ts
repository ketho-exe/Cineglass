import { normaliseMedia, normaliseSearchResults } from "@/lib/tmdb/normalise";
import type { Episode, MediaType } from "@/types/media";

const baseUrl = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";

type QueryValue = string | number | boolean | undefined;

export function getTmdbImageUrl(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w500",
) {
  if (!path) return null;
  const imageBase = process.env.TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";
  return `${imageBase}/${size}${path}`;
}

export async function tmdbFetch<T>(
  path: string,
  query: Record<string, QueryValue> = {},
): Promise<T> {
  const url = new URL(`${baseUrl}${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  if (!token && apiKey) url.searchParams.set("api_key", apiKey);
  if (!token && !apiKey) {
    throw new Error("TMDB API configuration missing");
  }

  const response = await fetch(url, { headers, next: { revalidate: 60 * 30 } });
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function searchTmdb(query: string, type: "multi" | MediaType = "multi", page = 1) {
  const path = type === "multi" ? "/search/multi" : `/search/${type}`;
  const data = await tmdbFetch<{ page: number; results: Record<string, unknown>[]; total_pages: number; total_results: number }>(
    path,
    { query, page, include_adult: false },
  );
  return {
    page: data.page,
    results: normaliseSearchResults(data.results),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getTrending(mediaType: MediaType) {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>(`/trending/${mediaType}/week`);
  return normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: mediaType })));
}

export async function discoverAnime() {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>("/discover/tv", {
    with_genres: "16",
    with_keywords: "210024",
    sort_by: "popularity.desc",
  });
  return normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: "tv" })));
}

export async function getDetails(mediaType: MediaType, tmdbId: number) {
  const data = await tmdbFetch<Record<string, unknown>>(`/${mediaType}/${tmdbId}`, {
    append_to_response: "credits,videos,recommendations,similar",
  });
  return normaliseMedia({ ...data, media_type: mediaType });
}

export async function getRecommendations(mediaType: MediaType, tmdbId: number) {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>(`/${mediaType}/${tmdbId}/recommendations`);
  return normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: mediaType })));
}

export async function getSeason(tmdbId: number, seasonNumber: number) {
  const data = await tmdbFetch<{ episodes: Array<Record<string, unknown>> }>(
    `/tv/${tmdbId}/season/${seasonNumber}`,
  );
  return data.episodes.map(
    (episode): Episode => ({
      tmdbId: typeof episode.id === "number" ? episode.id : undefined,
      seasonNumber,
      episodeNumber: Number(episode.episode_number),
      title: String(episode.name ?? `Episode ${episode.episode_number}`),
      overview: typeof episode.overview === "string" ? episode.overview : undefined,
      stillPath: typeof episode.still_path === "string" ? episode.still_path : null,
      airDate: typeof episode.air_date === "string" ? episode.air_date : null,
      runtime: typeof episode.runtime === "number" ? episode.runtime : null,
    }),
  );
}
