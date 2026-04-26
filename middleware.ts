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
  let accessStatus: string | undefined;

  try {
    const supabase = createMiddlewareSupabaseClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("access_status, role")
        .eq("id", userId)
        .maybeSingle();
      accessStatus = profile?.access_status;
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

  if (isAuthRoute(pathname) && accessStatus === "approved") {
    return NextResponse.redirect(new URL("/home", origin));
  }

  if (isProtectedRoute(pathname) && accessStatus !== "approved") {
    return NextResponse.redirect(new URL("/access-pending", origin));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
