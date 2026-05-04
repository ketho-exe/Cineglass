import { describe, expect, it } from "vitest";
import { buildVideasyEmbedUrl } from "./videasy";

describe("buildVideasyEmbedUrl", () => {
  it("builds movie URLs with a colour parameter", () => {
    expect(
      buildVideasyEmbedUrl({
        mediaType: "movie",
        tmdbId: 299534,
        theme: { color: "8B5CF6" },
      }),
    ).toBe("https://player.videasy.net/movie/299534?color=8B5CF6");
  });

  it("builds TV URLs with playback options", () => {
    expect(
      buildVideasyEmbedUrl({
        mediaType: "tv",
        tmdbId: 1399,
        seasonNumber: 1,
        episodeNumber: 1,
        nextEpisode: true,
        episodeSelector: true,
        autoplayNextEpisode: true,
        overlay: true,
        startTimeSeconds: 120,
        theme: { color: "#8B5CF6" },
      }),
    ).toBe("https://player.videasy.net/tv/1399/1/1?color=8B5CF6&progress=120&nextEpisode=true&episodeSelector=true&autoplayNextEpisode=true&overlay=true");
  });

  it("builds anime episode URLs from AniList IDs", () => {
    expect(
      buildVideasyEmbedUrl({
        mediaType: "anime",
        anilistId: 21,
        episodeNumber: 1,
      }),
    ).toBe("https://player.videasy.net/anime/21/1?color=22d3ee");
  });

  it("rejects anime playback without an AniList ID", () => {
    expect(() =>
      buildVideasyEmbedUrl({
        mediaType: "anime",
        tmdbId: 21,
        episodeNumber: 1,
      }),
    ).toThrow("Videasy anime playback requires anilistId");
  });
});
