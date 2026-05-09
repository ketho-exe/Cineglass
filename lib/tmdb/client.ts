import { normaliseMedia, normalisePerson, normaliseSearchResults } from "@/lib/tmdb/normalise";
import type { Episode, MediaType } from "@/types/media";

const baseUrl = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";

type QueryValue = string | number | boolean | undefined;
type DiscoverFilters = {
  mediaType?: MediaType;
  genreId?: number;
  year?: number;
  minRating?: number;
  language?: string;
  sortBy?: string;
  page?: number;
  mood?: "feel-good" | "dark" | "mind-bending";
};

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

export async function searchPersonFilmography(query: string) {
  const data = await tmdbFetch<{ results: Array<{ id?: number }> }>("/search/person", {
    query,
    page: 1,
    include_adult: false,
  });
  const personId = data.results.find((person) => typeof person.id === "number")?.id;
  if (!personId) return [];
  return getPersonCredits(personId).then((items) => items.slice(0, 18));
}

export async function getTrending(mediaType: MediaType) {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>(`/trending/${mediaType}/week`, { include_adult: false });
  return normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: mediaType })));
}

export async function getPopular(mediaType: MediaType, page = 1) {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>(`/${mediaType}/popular`, { page, include_adult: false });
  return normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: mediaType })));
}

export async function discoverByGenre(mediaType: MediaType, genreId: number, page = 1) {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>(`/discover/${mediaType}`, {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
    include_adult: false,
  });
  return normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: mediaType })));
}

export async function discoverFiltered(filters: DiscoverFilters = {}) {
  const mediaType = filters.mediaType ?? "movie";
  const mood = getMoodFilters(filters.mood, mediaType);
  const data = await tmdbFetch<{ page: number; results: Record<string, unknown>[]; total_pages: number; total_results: number }>(
    `/discover/${mediaType}`,
    {
      with_genres: filters.genreId ?? mood.genreId,
      primary_release_year: mediaType === "movie" ? filters.year : undefined,
      first_air_date_year: mediaType === "tv" ? filters.year : undefined,
      "vote_average.gte": filters.minRating,
      with_original_language: filters.language,
      sort_by: filters.sortBy ?? mood.sortBy ?? "popularity.desc",
      page: filters.page ?? 1,
      include_adult: false,
    },
  );
  return {
    page: data.page,
    results: normaliseSearchResults(data.results.map((item) => ({ ...item, media_type: mediaType }))),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function discoverAnime() {
  const data = await tmdbFetch<{ results: Record<string, unknown>[] }>("/discover/tv", {
    with_genres: "16",
    with_keywords: "210024",
    sort_by: "popularity.desc",
    include_adult: false,
    "vote_count.gte": 25,
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

export async function getPerson(personId: number) {
  const data = await tmdbFetch<Record<string, unknown>>(`/person/${personId}`);
  return normalisePerson(data);
}

export async function getPersonCredits(personId: number) {
  const data = await tmdbFetch<{ cast: Record<string, unknown>[]; crew: Record<string, unknown>[] }>(
    `/person/${personId}/combined_credits`,
  );
  const cast = normaliseSearchResults((data.cast ?? []).filter((item) => item.media_type === "movie" || item.media_type === "tv"));
  const crew = normaliseSearchResults((data.crew ?? []).filter((item) => item.media_type === "movie" || item.media_type === "tv"));
  const seen = new Set<string>();
  return [...cast, ...crew].filter((item) => {
    const key = `${item.mediaType}:${item.tmdbId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getMoodFilters(mood: DiscoverFilters["mood"], mediaType: MediaType) {
  if (mood === "feel-good") return { genreId: mediaType === "movie" ? 35 : 35, sortBy: "vote_average.desc" };
  if (mood === "dark") return { genreId: mediaType === "movie" ? 53 : 80, sortBy: "popularity.desc" };
  if (mood === "mind-bending") return { genreId: mediaType === "movie" ? 878 : 10765, sortBy: "vote_average.desc" };
  return {};
}
