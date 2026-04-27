const publicRoutes = new Set(["/login", "/access-pending"]);

const protectedPrefixes = [
  "/home",
  "/search",
  "/movie",
  "/tv",
  "/watch",
  "/watchlist",
  "/history",
  "/collections",
  "/collection",
  "/profile",
  "/settings",
  "/admin",
  "/api/playback",
  "/api/tmdb",
  "/api/watch-progress",
];

export function isAuthRoute(pathname: string) {
  return publicRoutes.has(normalisePath(pathname));
}

export function isProtectedRoute(pathname: string) {
  const path = normalisePath(pathname);
  if (publicRoutes.has(path)) return false;
  return protectedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function getRedirectPath(target: string, origin: string) {
  const safePath = safeLocalPath(target, origin);
  return `/login?redirectTo=${encodeURIComponent(safePath)}`;
}

export function safeLocalPath(target: string | null | undefined, origin: string) {
  if (!target) return "/home";
  try {
    const url = target.startsWith("/") ? new URL(target, origin) : new URL(target);
    if (url.origin !== origin) return "/home";
    const path = `${url.pathname}${url.search}`;
    return path.startsWith("/login") ? "/home" : path;
  } catch {
    return target.startsWith("/") && !target.startsWith("//") ? target : "/home";
  }
}

function normalisePath(pathname: string) {
  return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
}
