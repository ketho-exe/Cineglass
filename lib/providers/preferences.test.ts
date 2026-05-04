import { describe, expect, it } from "vitest";
import { getPlaybackProvider, normalisePlaybackProvider, providerLabels } from "./preferences";

describe("playback preferences", () => {
  it("reads provider from home preferences", () => {
    expect(getPlaybackProvider({ home_preferences: { playerProvider: "vidking" } })).toBe("vidking");
  });

  it("prefers explicit profile provider when available", () => {
    expect(getPlaybackProvider({
      player_provider: "embedmaster",
      home_preferences: { playerProvider: "vidking" },
    })).toBe("vidking");
  });

  it("reads new providers from home preferences even when the legacy column has an old value", () => {
    expect(getPlaybackProvider({
      player_provider: "embedmaster",
      home_preferences: { playerProvider: "videasy" },
    })).toBe("videasy");
  });

  it("defaults to embedmaster", () => {
    expect(getPlaybackProvider({ home_preferences: {} })).toBe("embedmaster");
  });

  it("accepts all supported providers", () => {
    expect(normalisePlaybackProvider("embedmaster")).toBe("embedmaster");
    expect(normalisePlaybackProvider("vidking")).toBe("vidking");
    expect(normalisePlaybackProvider("videasy")).toBe("videasy");
    expect(normalisePlaybackProvider("spenembed")).toBe("spenembed");
  });

  it("provides display labels for every provider", () => {
    expect(providerLabels).toEqual({
      embedmaster: "EmbedMaster",
      vidking: "VidKing",
      videasy: "Videasy",
      spenembed: "SpenEmbed",
    });
  });
});
