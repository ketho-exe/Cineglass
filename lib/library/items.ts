import type { MediaType, NormalisedMedia } from "@/types/media";

export type LibraryItemRef = {
  mediaType: MediaType;
  tmdbId: number;
};

type LibraryRow = {
  media_type: unknown;
  tmdb_id: unknown;
};

export function getMediaKey(item: LibraryItemRef) {
  return `${item.mediaType}:${item.tmdbId}`;
}

export function normaliseLibraryRows(rows: LibraryRow[]): LibraryItemRef[] {
  const seen = new Set<string>();
  const items: LibraryItemRef[] = [];

  for (const row of rows) {
    if ((row.media_type !== "movie" && row.media_type !== "tv") || typeof row.tmdb_id !== "number") {
      continue;
    }

    const item: LibraryItemRef = { mediaType: row.media_type, tmdbId: row.tmdb_id };
    const key = getMediaKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      items.push(item);
    }
  }

  return items;
}

export function compactMedia(items: Array<NormalisedMedia | null>): NormalisedMedia[] {
  return items.filter((item): item is NormalisedMedia => Boolean(item));
}
