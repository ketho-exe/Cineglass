import { describe, expect, it } from "vitest";
import { getNavigationItems } from "./navigation";

describe("getNavigationItems", () => {
  it("keeps the main chrome focused on browse, search, and profile", () => {
    expect(getNavigationItems().primary.map((item) => item.label)).toEqual(["Browse", "Search", "Profile"]);
  });

  it("groups browse around content, features, and personal links", () => {
    const sections = getNavigationItems().browseSections;

    expect(sections.map((section) => section.label)).toEqual(["Content", "Features", "Personal"]);
    expect(sections[0].items.map((item) => item.label)).toEqual(["Movies", "TV Shows", "Anime"]);
    expect(sections[1].items.map((item) => item.label)).toEqual(["Channels", "4K", "Watch Party"]);
    expect(sections[2].items.map((item) => item.label)).toEqual(["History", "Watchlist"]);
  });
});
