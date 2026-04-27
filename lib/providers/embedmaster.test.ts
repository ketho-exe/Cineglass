import { describe, expect, it } from "vitest";
import { buildEmbedMasterEmbedUrl } from "./embedmaster";

describe("buildEmbedMasterEmbedUrl", () => {
  it("builds movie embed URLs with the configured player id", () => {
    expect(
      buildEmbedMasterEmbedUrl({
        mediaType: "movie",
        tmdbId: 1078605,
      }),
    ).toBe("https://embedmaster.link/k8i9pm5nsn3nrj0d/movie/1078605");
  });

  it("builds TV embed URLs with season and episode numbers", () => {
    expect(
      buildEmbedMasterEmbedUrl({
        mediaType: "tv",
        tmdbId: 119051,
        seasonNumber: 1,
        episodeNumber: 8,
      }),
    ).toBe("https://embedmaster.link/k8i9pm5nsn3nrj0d/tv/119051/1/8");
  });

  it("adds custom subtitles when provided", () => {
    expect(
      buildEmbedMasterEmbedUrl({
        mediaType: "movie",
        tmdbId: 1078605,
        subtitles: [{ url: "https://example.com/subtitle.vtt", label: "Custom Subtitle" }],
      }),
    ).toBe("https://embedmaster.link/k8i9pm5nsn3nrj0d/movie/1078605?sub_url%5B%5D=https%3A%2F%2Fexample.com%2Fsubtitle.vtt&sub_label%5B%5D=Custom+Subtitle");
  });

  it("rejects TV playback without season and episode numbers", () => {
    expect(() =>
      buildEmbedMasterEmbedUrl({
        mediaType: "tv",
        tmdbId: 119051,
      }),
    ).toThrow("TV playback requires seasonNumber");
  });
});
