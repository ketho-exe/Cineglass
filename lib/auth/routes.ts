const protectedPrefixes = [
  "/admin",
  "/api/watch-progress",
];

export function isAuthRoute(pathname: string) {
  void pathname;
  return false;
}

export function isProtectedRoute(pathname: string) {
  const path = normalisePath(pathname);
  return protectedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function getRedirectPath(target: string, origin: string) {
  void safeLocalPath(target, origin);
  return "/home";
}

export function safeLocalPath(target: string | null | undefined, origin: string) {
  if (!target) return "/home";
  try {
    const url = target.startsWith("/") ? new URL(target, origin) : new URL(target);
    if (url.origin !== origin) return "/home";
    const path = `${url.pathname}${url.search}`;
    return path.startsWith("/login") || path.startsWith("/access-pending") ? "/home" : path;
  } catch {
    return target.startsWith("/") && !target.startsWith("//") ? target : "/home";
  }
}

function normalisePath(pathname: string) {
  return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
}
