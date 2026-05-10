import { describe, expect, it } from "vitest";
import { getSearchQuery } from "./search-params";

describe("getSearchQuery", () => {
  it("normalises string and array query params before trimming", () => {
    expect(getSearchQuery("  dune  ")).toBe("dune");
    expect(getSearchQuery(["  alien  ", "ignored"])).toBe("alien");
    expect(getSearchQuery([42])).toBe("");
    expect(getSearchQuery({ q: "not a string" })).toBe("");
    expect(getSearchQuery(undefined)).toBe("");
  });
});
