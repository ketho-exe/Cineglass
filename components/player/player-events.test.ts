import { describe, expect, it } from "vitest";
import { parseProviderProgressMessage } from "./player-events";

describe("parseProviderProgressMessage", () => {
  it("parses Videasy JSON progress messages", () => {
    expect(
      parseProviderProgressMessage(JSON.stringify({
        id: 1399,
        type: "progress",
        progress: 25,
        timestamp: 300,
        duration: 1200,
        season: 1,
        episode: 2,
      })),
    ).toEqual({
      event: "progress",
      progressSeconds: 300,
      durationSeconds: 1200,
      progressPercent: 25,
      seasonNumber: 1,
      episodeNumber: 2,
    });
  });

  it("ignores malformed JSON without throwing", () => {
    expect(parseProviderProgressMessage("{not json")).toBeNull();
  });

  it("parses generic PLAYER_EVENT messages", () => {
    expect(
      parseProviderProgressMessage(JSON.stringify({
        type: "PLAYER_EVENT",
        data: {
          event: "pause",
          currentTime: 42,
          duration: 100,
        },
      })),
    ).toEqual({
      event: "pause",
      progressSeconds: 42,
      durationSeconds: 100,
      progressPercent: 42,
    });
  });
});
