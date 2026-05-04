import { describe, expect, it } from "vitest";
import { buildVidKingEmbedUrl } from "./vidking";

describe("buildVidKingEmbedUrl", () => {
  it("builds movie embed URLs", () => {
    expect(
      buildVidKingEmbedUrl({
        mediaType: "movie",
        tmdbId: 1078605,
        autoplay: true,
        startTimeSeconds: 120,
        theme: { color: "e50914" },
      }),
    ).toBe("https://www.vidking.net/embed/movie/1078605?color=e50914&autoPlay=true&progress=120");
  });

  it("builds TV embed URLs", () => {
    expect(
      buildVidKingEmbedUrl({
        mediaType: "tv",
        tmdbId: 119051,
        seasonNumber: 1,
        episodeNumber: 8,
        nextEpisode: true,
        episodeSelector: true,
      }),
    ).toBe("https://www.vidking.net/embed/tv/119051/1/8?color=22d3ee&nextEpisode=true&episodeSelector=true");
  });
});
