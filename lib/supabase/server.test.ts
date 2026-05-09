import { describe, expect, it, vi } from "vitest";
import { setServerCookies } from "./server";

describe("Supabase server cookies", () => {
  it("does not crash when Server Components reject cookie writes", () => {
    const cookieStore = {
      getAll: () => [],
      set: vi.fn(() => {
        throw new Error("Cookies can only be modified in a Server Action or Route Handler.");
      }),
    };

    expect(() =>
      setServerCookies(cookieStore, [
        { name: "sb-test", value: "value", options: { path: "/" } },
      ]),
    ).not.toThrow();
  });
});
