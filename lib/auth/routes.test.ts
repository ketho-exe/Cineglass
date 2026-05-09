import { describe, expect, it } from "vitest";
import { getRedirectPath, isAuthRoute, isProtectedRoute } from "./routes";
import { getSupabaseConfig } from "./session";

describe("auth route helpers", () => {
  it("keeps discovery and playback public while protecting admin routes", () => {
    expect(isProtectedRoute("/home")).toBe(false);
    expect(isProtectedRoute("/movie/299534")).toBe(false);
    expect(isProtectedRoute("/watch/movie/299534")).toBe(false);
    expect(isProtectedRoute("/api/playback/embedmaster")).toBe(false);
    expect(isProtectedRoute("/api/tmdb/search")).toBe(false);
    expect(isProtectedRoute("/admin")).toBe(true);
    expect(isProtectedRoute("/admin/users")).toBe(true);
  });

  it("does not treat login or pending access as special auth pages", () => {
    expect(isProtectedRoute("/login")).toBe(false);
    expect(isProtectedRoute("/access-pending")).toBe(false);
    expect(isAuthRoute("/login")).toBe(false);
    expect(isAuthRoute("/access-pending")).toBe(false);
    expect(isAuthRoute("/home")).toBe(false);
  });

  it("builds safe home redirect paths", () => {
    expect(getRedirectPath("/watch/movie/299534", "http://localhost:3000")).toBe(
      "/home",
    );
    expect(getRedirectPath("https://evil.example/path", "http://localhost:3000")).toBe(
      "/home",
    );
  });

  it("treats missing or invalid Supabase env as unconfigured", () => {
    expect(getSupabaseConfig({})).toBeNull();
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      }),
    ).toBeNull();
  });
});
