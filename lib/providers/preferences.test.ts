import { describe, expect, it } from "vitest";
import { getPlaybackProvider } from "./preferences";

describe("playback preferences", () => {
  it("reads provider from home preferences", () => {
    expect(getPlaybackProvider({ home_preferences: { playerProvider: "vidking" } })).toBe("vidking");
  });

  it("prefers explicit profile provider when available", () => {
    expect(getPlaybackProvider({
      player_provider: "embedmaster",
      home_preferences: { playerProvider: "vidking" },
    })).toBe("embedmaster");
  });

  it("defaults to embedmaster", () => {
    expect(getPlaybackProvider({ home_preferences: {} })).toBe("embedmaster");
  });
});
