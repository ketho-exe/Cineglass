import { describe, expect, it } from "vitest";
import { getMediaKey, normaliseLibraryRows } from "./items";

describe("library item helpers", () => {
  it("creates stable keys for media records", () => {
    expect(getMediaKey({ mediaType: "movie", tmdbId: 299534 })).toBe("movie:299534");
    expect(getMediaKey({ mediaType: "tv", tmdbId: 119051 })).toBe("tv:119051");
  });

  it("deduplicates and filters malformed Supabase rows", () => {
    expect(
      normaliseLibraryRows([
        { media_type: "movie", tmdb_id: 299534 },
        { media_type: "movie", tmdb_id: 299534 },
        { media_type: "person", tmdb_id: 1 },
        { media_type: "tv", tmdb_id: 119051 },
      ]),
    ).toEqual([
      { mediaType: "movie", tmdbId: 299534 },
      { mediaType: "tv", tmdbId: 119051 },
    ]);
  });
});
