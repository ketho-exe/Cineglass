import { describe, expect, it } from "vitest";
import { buildPlaybackPreferenceUpdate } from "./preference-update";

describe("buildPlaybackPreferenceUpdate", () => {
  it("preserves existing home preferences while changing the provider", () => {
    expect(
      buildPlaybackPreferenceUpdate({
        homePreferences: {
          continueWatching: true,
          playerAccentColor: "22d3ee",
          videasy: { overlay: true },
        },
        provider: "spenembed",
      }),
    ).toEqual({
      continueWatching: true,
      playerAccentColor: "22d3ee",
      playerProvider: "spenembed",
      videasy: { overlay: true },
    });
  });
});
