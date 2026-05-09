import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

type MutableCookieStore = {
  getAll(): ReturnType<Awaited<ReturnType<typeof cookies>>["getAll"]>;
  set(name: string, value: string, options: CookieOptions): void;
};

export async function createSupabaseServerClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase public URL and anon key are required");
  }

  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          setServerCookies(cookieStore, cookiesToSet);
        },
      },
    },
  );
}

export function setServerCookies(cookieStore: MutableCookieStore, cookiesToSet: CookieToSet[]) {
  try {
    cookiesToSet.forEach(({ name, value, options }) => {
      cookieStore.set(name, value, options);
    });
  } catch {
    // Server Components cannot mutate cookies during render.
    // Middleware and route handlers are responsible for persisting auth refreshes.
  }
}

export async function createOptionalSupabaseServerClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return createSupabaseServerClient();
}
