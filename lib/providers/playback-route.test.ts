import { describe, expect, it } from "vitest";
import { buildPlaybackEmbedUrl, parsePlaybackQuery } from "./playback-route";

describe("parsePlaybackQuery", () => {
  it("parses movie playback query params", () => {
    expect(parsePlaybackQuery(new URLSearchParams("mediaType=movie&tmdbId=299534&progress=42&autoplay=true"))).toEqual({
      mediaType: "movie",
      tmdbId: 299534,
      anilistId: undefined,
      seasonNumber: undefined,
      episodeNumber: undefined,
      autoplay: true,
      nextEpisode: undefined,
      episodeSelector: undefined,
      autoplayNextEpisode: undefined,
      overlay: undefined,
      startTimeSeconds: 42,
      theme: undefined,
    });
  });

  it("rejects invalid media types", () => {
    expect(() => parsePlaybackQuery(new URLSearchParams("mediaType=clip&tmdbId=1"))).toThrow("Invalid mediaType");
  });

  it("rejects invalid TMDB IDs for movies", () => {
    expect(() => parsePlaybackQuery(new URLSearchParams("mediaType=movie&tmdbId=0"))).toThrow("A valid tmdbId is required");
  });
});

describe("buildPlaybackEmbedUrl", () => {
  it("routes Videasy requests to the Videasy builder", () => {
    expect(
      buildPlaybackEmbedUrl("videasy", {
        mediaType: "movie",
        tmdbId: 299534,
        theme: { color: "8B5CF6" },
      }),
    ).toBe("https://player.videasy.net/movie/299534?color=8B5CF6");
  });

  it("routes SpenEmbed requests to the SpenEmbed builder", () => {
    expect(
      buildPlaybackEmbedUrl("spenembed", {
        mediaType: "movie",
        tmdbId: 533535,
        theme: { color: "00ffc9" },
      }),
    ).toBe("https://spencerdevs.xyz/movie/533535?theme=00ffc9");
  });

  it("rejects unknown providers", () => {
    expect(() => buildPlaybackEmbedUrl("bad", { mediaType: "movie", tmdbId: 1 })).toThrow("Unknown provider");
  });
});
