import { describe, expect, it } from "vitest";
import { getRedirectPath, isAuthRoute, isProtectedRoute } from "./routes";

describe("auth route helpers", () => {
  it("protects private application pages and API playback routes", () => {
    expect(isProtectedRoute("/home")).toBe(true);
    expect(isProtectedRoute("/movie/299534")).toBe(true);
    expect(isProtectedRoute("/watch/movie/299534")).toBe(true);
    expect(isProtectedRoute("/api/playback/vidking")).toBe(true);
  });

  it("does not protect public auth pages or TMDB metadata APIs", () => {
    expect(isProtectedRoute("/login")).toBe(false);
    expect(isProtectedRoute("/access-pending")).toBe(false);
    expect(isProtectedRoute("/api/tmdb/search")).toBe(false);
  });

  it("recognises auth-only routes", () => {
    expect(isAuthRoute("/login")).toBe(true);
    expect(isAuthRoute("/access-pending")).toBe(true);
    expect(isAuthRoute("/home")).toBe(false);
  });

  it("builds safe login redirect paths", () => {
    expect(getRedirectPath("/watch/movie/299534", "http://localhost:3000")).toBe(
      "/login?redirectTo=%2Fwatch%2Fmovie%2F299534",
    );
    expect(getRedirectPath("https://evil.example/path", "http://localhost:3000")).toBe(
      "/login?redirectTo=%2Fhome",
    );
  });
});
