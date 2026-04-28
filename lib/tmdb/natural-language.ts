import { getGenres } from "@/lib/tmdb/genres";
import type { MediaType } from "@/types/media";

export type ParsedSearch = {
  query: string;
  mediaType?: MediaType;
  genreId?: number;
  year?: number;
  minRating?: number;
  language?: string;
  mood?: "feel-good" | "dark" | "mind-bending";
};

const languageAliases: Record<string, string> = {
  english: "en",
  french: "fr",
  spanish: "es",
  korean: "ko",
  japanese: "ja",
  hindi: "hi",
};

export function parseNaturalSearch(input: string, selectedType: "multi" | MediaType): ParsedSearch {
  const text = input.toLowerCase();
  const mediaType = selectedType === "multi"
    ? text.includes("show") || text.includes("series") ? "tv" : text.includes("movie") || text.includes("film") ? "movie" : undefined
    : selectedType;

  const genreId = findGenreId(text, mediaType ?? "movie") ?? findGenreId(text, "tv");
  const decade = text.match(/\b(19|20)\d0s\b/)?.[0];
  const explicitYear = text.match(/\b(19|20)\d{2}\b/)?.[0];
  const rating = text.match(/(?:rated|rating|above|over)\s+([1-9](?:\.\d)?|10)/)?.[1];
  const mood = text.includes("feel good") || text.includes("feel-good") || text.includes("funny")
    ? "feel-good"
    : text.includes("dark") || text.includes("gritty")
      ? "dark"
      : text.includes("mind") || text.includes("twist") || text.includes("bending")
        ? "mind-bending"
        : undefined;
  const language = Object.entries(languageAliases).find(([name]) => text.includes(name))?.[1];

  return {
    query: stripFilterWords(input),
    mediaType,
    genreId,
    year: explicitYear ? Number(explicitYear) : decade ? Number(decade.slice(0, 4)) : undefined,
    minRating: rating ? Number(rating) : undefined,
    language,
    mood,
  };
}

function findGenreId(text: string, mediaType: MediaType) {
  return getGenres(mediaType).find((genre) => {
    const name = genre.name.toLowerCase();
    return text.includes(name) || (name === "sci-fi" && text.includes("science fiction"));
  })?.id;
}

function stripFilterWords(input: string) {
  return input
    .replace(/\b(movie|movies|film|films|show|shows|series|from the|from|after|before|rated|rating|above|over)\b/gi, " ")
    .replace(/\b(19|20)\d0s\b|\b(19|20)\d{2}\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
