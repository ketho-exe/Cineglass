import { normaliseGenreIds } from "./genres";
import type { CreditPerson, NormalisedMedia, PersonDetails } from "@/types/media";

type TmdbMedia = Record<string, unknown>;

export function normaliseMedia(item: TmdbMedia): NormalisedMedia | null {
  const mediaType = inferMediaType(item);
  if (!mediaType) return null;

  const title =
    mediaType === "movie"
      ? stringValue(item.title) ?? stringValue(item.name)
      : stringValue(item.name) ?? stringValue(item.title);

  if (!title || typeof item.id !== "number") return null;

  return {
    tmdbId: item.id,
    mediaType,
    title,
    originalTitle:
      mediaType === "movie"
        ? stringValue(item.original_title)
        : stringValue(item.original_name),
    overview: stringValue(item.overview),
    posterPath: nullableString(item.poster_path),
    backdropPath: nullableString(item.backdrop_path),
    releaseDate: nullableString(item.release_date),
    firstAirDate: nullableString(item.first_air_date),
    voteAverage:
      typeof item.vote_average === "number" ? item.vote_average : undefined,
    genres: Array.isArray(item.genres)
      ? item.genres.filter(isGenre)
      : normaliseGenreIds(mediaType, item.genre_ids),
    runtime: typeof item.runtime === "number" ? item.runtime : undefined,
    seasons: Array.isArray(item.seasons)
      ? item.seasons
        .map(normaliseSeason)
        .filter((season): season is NonNullable<ReturnType<typeof normaliseSeason>> => Boolean(season))
      : undefined,
    cast: normaliseCredits(item.credits, "cast"),
    crew: normaliseCredits(item.credits, "crew"),
  };
}

export function normaliseSearchResults(items: TmdbMedia[]) {
  return items.map(normaliseMedia).filter((item): item is NormalisedMedia => Boolean(item));
}

function inferMediaType(item: TmdbMedia) {
  if (item.media_type === "movie" || item.media_type === "tv") {
    return item.media_type;
  }
  if (typeof item.media_type === "string") return null;
  if (item.title || item.release_date) return "movie";
  if (item.name || item.first_air_date) return "tv";
  return null;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function nullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isGenre(value: unknown): value is { id: number; name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { id?: unknown }).id === "number" &&
    typeof (value as { name?: unknown }).name === "string"
  );
}

function normaliseSeason(value: unknown) {
  if (typeof value !== "object" || value === null) return null;
  const season = value as Record<string, unknown>;
  if (typeof season.season_number !== "number" || season.season_number < 0) return null;
  return {
    seasonNumber: season.season_number,
    title: stringValue(season.name) ?? `Season ${season.season_number}`,
    episodeCount: typeof season.episode_count === "number" ? season.episode_count : 0,
  };
}

function normaliseCredits(value: unknown, type: "cast" | "crew"): CreditPerson[] | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const credits = (value as Record<string, unknown>)[type];
  if (!Array.isArray(credits)) return undefined;
  return credits
    .map((credit): CreditPerson | null => {
      if (typeof credit !== "object" || credit === null) return null;
      const row = credit as Record<string, unknown>;
      if (typeof row.id !== "number" || typeof row.name !== "string") return null;
      return {
        id: row.id,
        name: row.name,
        character: stringValue(row.character),
        job: stringValue(row.job),
        profilePath: nullableString(row.profile_path),
      };
    })
    .filter((credit): credit is CreditPerson => Boolean(credit))
    .slice(0, type === "cast" ? 14 : 8);
}

export function normalisePerson(item: Record<string, unknown>): PersonDetails | null {
  if (typeof item.id !== "number" || typeof item.name !== "string") return null;
  return {
    id: item.id,
    name: item.name,
    biography: stringValue(item.biography),
    birthday: nullableString(item.birthday),
    placeOfBirth: nullableString(item.place_of_birth),
    profilePath: nullableString(item.profile_path),
    knownForDepartment: stringValue(item.known_for_department),
  };
}
