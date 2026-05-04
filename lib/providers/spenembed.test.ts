import { describe, expect, it } from "vitest";
import { buildSpenEmbedUrl } from "./spenembed";

describe("buildSpenEmbedUrl", () => {
  it("builds movie URLs with a theme parameter", () => {
    expect(
      buildSpenEmbedUrl({
        mediaType: "movie",
        tmdbId: 533535,
        theme: { color: "00ffc9" },
      }),
    ).toBe("https://spencerdevs.xyz/movie/533535?theme=00ffc9");
  });

  it("builds TV URLs", () => {
    expect(
      buildSpenEmbedUrl({
        mediaType: "tv",
        tmdbId: 95557,
        seasonNumber: 1,
        episodeNumber: 1,
        theme: { color: "#00ffc9" },
      }),
    ).toBe("https://spencerdevs.xyz/tv/95557/1/1?theme=00ffc9");
  });

  it("builds anime episode URLs from AniList IDs", () => {
    expect(
      buildSpenEmbedUrl({
        mediaType: "anime",
        anilistId: 21,
        episodeNumber: 1,
        theme: { color: "00ffc9" },
      }),
    ).toBe("https://spencerdevs.xyz/anime/21/1?theme=00ffc9");
  });

  it("rejects anime playback without an AniList ID", () => {
    expect(() =>
      buildSpenEmbedUrl({
        mediaType: "anime",
        tmdbId: 21,
        episodeNumber: 1,
      }),
    ).toThrow("SpenEmbed anime playback requires anilistId and episodeNumber");
  });
});
