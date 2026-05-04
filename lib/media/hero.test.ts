import { describe, expect, it } from "vitest";
import { getHeroItems } from "./hero";
import type { NormalisedMedia } from "@/types/media";

const items = Array.from({ length: 7 }, (_, index) => ({
  tmdbId: index + 1,
  mediaType: "movie",
  title: `Movie ${index + 1}`,
} satisfies NormalisedMedia));

describe("getHeroItems", () => {
  it("limits the hero carousel to five items", () => {
    expect(getHeroItems(items)).toHaveLength(5);
  });

  it("keeps the incoming order", () => {
    expect(getHeroItems(items).map((item) => item.tmdbId)).toEqual([1, 2, 3, 4, 5]);
  });
});
