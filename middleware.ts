import { createMiddlewareSupabaseClient, hasSupabaseConfig } from "@/lib/auth/session";
import { getRedirectPath, isAuthRoute, isProtectedRoute } from "@/lib/auth/routes";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (!isProtectedRoute(pathname) && !isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  if (!hasSupabaseConfig()) {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL(getRedirectPath(request.nextUrl.pathname, origin), origin));
    }
    return NextResponse.next();
  }

  const response = NextResponse.next();
  let userId: string | undefined;
  let role: string | undefined;

  try {
    const supabase = createMiddlewareSupabaseClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      role = profile?.role;
    }
  } catch {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL(getRedirectPath(request.nextUrl.pathname, origin), origin));
    }
    return response;
  }

  if (!userId) {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL(getRedirectPath(request.nextUrl.pathname, origin), origin));
    }
    return response;
  }

  if (isProtectedRoute(pathname) && !["owner", "admin"].includes(role ?? "")) {
    return NextResponse.redirect(new URL("/home", origin));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
