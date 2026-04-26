import { describe, expect, it } from "vitest";
import { buildVidKingEmbedUrl } from "./vidking";

describe("buildVidKingEmbedUrl", () => {
  it("builds movie embed URLs with supported query parameters", () => {
    expect(
      buildVidKingEmbedUrl({
        mediaType: "movie",
        tmdbId: 1078605,
        autoplay: true,
        startTimeSeconds: 120,
        theme: { color: "e50914" },
      }),
    ).toBe(
      "https://www.vidking.net/embed/movie/1078605?color=e50914&autoPlay=true&progress=120",
    );
  });

  it("builds TV embed URLs with season, episode, and TV feature flags", () => {
    expect(
      buildVidKingEmbedUrl({
        mediaType: "tv",
        tmdbId: 119051,
        seasonNumber: 1,
        episodeNumber: 8,
        autoplay: true,
        nextEpisode: true,
        episodeSelector: true,
        theme: { color: "#9146ff" },
      }),
    ).toBe(
      "https://www.vidking.net/embed/tv/119051/1/8?color=9146ff&autoPlay=true&nextEpisode=true&episodeSelector=true",
    );
  });

  it("rejects TV playback without season and episode numbers", () => {
    expect(() =>
      buildVidKingEmbedUrl({
        mediaType: "tv",
        tmdbId: 119051,
      }),
    ).toThrow("TV playback requires seasonNumber and episodeNumber");
  });
});
