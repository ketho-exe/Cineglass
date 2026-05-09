import { describe, expect, it } from "vitest";
import { getSafeProgress } from "../../lib/media/progress";

describe("getSafeProgress", () => {
  it("keeps zero progress visible and clamps out-of-range values", () => {
    expect(getSafeProgress(undefined)).toEqual({ hasProgress: false, safeProgress: undefined });
    expect(getSafeProgress(0)).toEqual({ hasProgress: true, safeProgress: 0 });
    expect(getSafeProgress(-12)).toEqual({ hasProgress: true, safeProgress: 0 });
    expect(getSafeProgress(143)).toEqual({ hasProgress: true, safeProgress: 100 });
  });
});
