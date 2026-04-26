import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

export type ProfileAccess = {
  access_status: "pending" | "approved" | "blocked";
  role: "owner" | "admin" | "member";
};

type SupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

export function getSupabaseConfig(env: SupabaseEnv = readSupabaseEnv()) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:") return null;
    return { supabaseUrl: url.toString().replace(/\/$/, ""), supabaseAnonKey };
  } catch {
    return null;
  }
}

function readSupabaseEnv(): SupabaseEnv {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasSupabaseConfig() {
  return Boolean(getSupabaseConfig());
}

export function createMiddlewareSupabaseClient(request: NextRequest, response: NextResponse) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase public URL and anon key are required");
  }

  return createServerClient(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
}
