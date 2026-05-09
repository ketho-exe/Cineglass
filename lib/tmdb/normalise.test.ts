import { describe, expect, it } from "vitest";
import { normaliseMedia, normaliseSearchResults } from "./normalise";

describe("TMDB normalisation", () => {
  it("normalises movies into the app media shape", () => {
    expect(
      normaliseMedia({
        id: 299534,
        media_type: "movie",
        title: "Avengers: Endgame",
        original_title: "Avengers: Endgame",
        overview: "After the devastating events...",
        poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        release_date: "2019-04-24",
        vote_average: 8.2,
        genres: [{ id: 12, name: "Adventure" }],
      }),
    ).toMatchObject({
      tmdbId: 299534,
      mediaType: "movie",
      title: "Avengers: Endgame",
      releaseDate: "2019-04-24",
      genres: [{ id: 12, name: "Adventure" }],
    });
  });

  it("normalises TV shows into the app media shape", () => {
    expect(
      normaliseMedia({
        id: 119051,
        media_type: "tv",
        name: "Wednesday",
        original_name: "Wednesday",
        overview: "Smart, sarcastic and a little dead inside...",
        first_air_date: "2022-11-23",
        vote_average: 8.4,
        seasons: [{ season_number: 1, name: "Season 1", episode_count: 8 }],
      }),
    ).toMatchObject({
      tmdbId: 119051,
      mediaType: "tv",
      title: "Wednesday",
      firstAirDate: "2022-11-23",
      seasons: [{ seasonNumber: 1, title: "Season 1", episodeCount: 8 }],
    });
  });

  it("filters unsupported search result types", () => {
    expect(
      normaliseSearchResults([
        { id: 1, media_type: "person", name: "Actor" },
        { id: 2, media_type: "movie", title: "Heat" },
      ]),
    ).toHaveLength(1);
  });

  it("filters adult or explicit catalogue entries", () => {
    expect(
      normaliseSearchResults([
        { id: 1, media_type: "movie", title: "Adult Result", adult: true },
        { id: 2, media_type: "tv", name: "Explicit Anime", overview: "An erotic late-night title." },
        { id: 3, media_type: "tv", name: "Suggestive Series", overview: "The plot keeps mentioning marital intimacy and touching her body." },
        { id: 4, media_type: "movie", title: "Family Feature" },
      ]),
    ).toEqual([
      expect.objectContaining({
        tmdbId: 4,
        title: "Family Feature",
      }),
    ]);
  });
});
