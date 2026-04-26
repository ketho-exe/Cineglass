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
      }),
    ).toMatchObject({
      tmdbId: 119051,
      mediaType: "tv",
      title: "Wednesday",
      firstAirDate: "2022-11-23",
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
});
